# Plan Técnico — Portafolio Web Profesional

> Guía completa de arquitectura, dockerización y despliegue con Traefik + Cloudflare Tunnel para una vitrina de proyectos web (Angular + Spring Boot) y móviles (Android/Java).

---

## 1. Arquitectura del Sistema

```
                        Internet
                           │
                  ┌────────▼────────┐
                  │  Cloudflare CDN  │  (TLS en el borde / WAF / DNS)
                  └────────┬────────┘
                           │  Cloudflare Tunnel (cloudflared)
                  ┌────────▼────────┐
                  │    Traefik v3    │  (router por Host + middlewares)
                  └───┬─────────┬───┘
            tudominio.com       api.tudominio.com
          ┌───────────────▼──┐   ┌──▼────────────────┐
          │ Frontend Angular │   │ Backend Spring     │
          │ Nginx :80        │   │ Boot :8080         │
          │ (SPA estática)   │   │ REST API           │
          └──────────────────┘   └──┬─────────────────┘
                                    │ red interna (no expuesta)
                           ┌────────▼────────┐
                           │ PostgreSQL 17   │
                           │ volumen pgdata  │
                           └─────────────────┘
```

### Decisiones clave

| Aspecto | Decisión |
|---|---|
| TLS | Termina en Cloudflare (edge). Interno viaja HTTP dentro del túnel. Opción B con Let's Encrypt vía DNS challenge documentada en §6. |
| Enrutamiento | Traefik enruta por cabecera `Host`: dominio raíz → frontend; `api.` → backend. |
| Seguridad de red | PostgreSQL solo en red `internal`; la BD nunca se expone a internet. |
| SPA | Nginx con `try_files ... /index.html` para las rutas de Angular. |

---

## 2. Versiones y Dependencias Detectadas

### Frontend — `portfoliofront` (Angular 20)

| Paquete | Versión | Estado |
|---|---|---|
| `@angular/core`, `common`, `compiler`, `forms`, `platform-browser`, `router` | ^20.3.0 | ✅ Instalado |
| `@angular/build`, `@angular/cli` | ^20.3.10 | ✅ Instalado |
| `typescript` | ~5.9.2 | ✅ Instalado |
| `rxjs` / `zone.js` / `tslib` | ~7.8 / ~0.15 / ^2.3 | ✅ Instalado |

**Pendientes de crear (no requieren nuevas dependencias):**
- `src/environments/environment.ts` + `environment.development.ts` (Angular 20 ya no los genera por defecto).
- `provideHttpClient(withFetch())` en `app.config.ts`.
- Rutas lazy (`app.routes.ts`) y estructura de carpetas `core/`, `shared/`, `features/`.

### Backend — `portafolioback` (Spring Boot 4.1.1, Java 17)

| Dependencia | Estado | Uso |
|---|---|---|
| `spring-boot-starter-webmvc` | ✅ | API REST (nomenclatura nueva de Boot 4) |
| `spring-boot-starter-data-jpa` | ✅ | Persistencia |
| `spring-boot-starter-validation` | ✅ | Validación de DTOs |
| `postgresql` (driver) | ✅ | Conexión a PostgreSQL |
| `lombok` | ✅ | Reducción de boilerplate |
| `spring-boot-starter-security` | ⬜ Fase 6 | Auth del panel admin (JWT) |
| `spring-boot-starter-actuator` | ⬜ Fase 7 | Healthchecks para Docker |
| `flyway-core` + `flyway-database-postgresql` | ⬜ Opcional | Migraciones versionadas (alternativa: `ddl-auto` + `init.sql`) |

> ⚠️ Spring Boot 4 renombró los starters: `web` → `webmvc` y los de test terminan en `-test`. El `pom.xml` existente ya lo refleja correctamente.

---

## 3. Estructura de Carpetas Recomendada

```
portfolio/
├── portfoliofront/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/            # interfaces: Project, Technology, ContactMessage
│   │   │   │   ├── services/          # ProjectService, ContactService, AuthService
│   │   │   │   ├── interceptors/      # auth-token.interceptor.ts
│   │   │   │   └── config/app.config.ts
│   │   │   ├── shared/
│   │   │   │   ├── components/        # header, footer, theme-toggle, project-card
│   │   │   │   └── pipes/
│   │   │   ├── features/
│   │   │   │   ├── home/              # hero + stack técnico
│   │   │   │   ├── projects/          # listado + detalle (filtros web/móvil)
│   │   │   │   ├── contact/           # formulario funcional
│   │   │   │   └── admin/             # login + dashboard métricas + CRUD
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── environments/
│   │   │   ├── environment.ts              # prod: apiUrl = '/api'
│   │   │   └── environment.development.ts  # dev: apiUrl = 'http://localhost:8080/api'
│   │   ├── styles.css                 # variables CSS tema claro/oscuro
│   │   └── index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
│
├── portafolioback/
│   ├── src/main/java/com/dev/gabus/portafolioback/
│   │   ├── PortafoliobackApplication.java
│   │   ├── config/                    # CorsConfig, SecurityConfig, OpenApiConfig
│   │   ├── controller/                # ProjectController, TechnologyController,
│   │   │                              # ContactController, AuthController, MetricsController
│   │   ├── service/                   # interfaces + impl
│   │   ├── repository/                # interfaces JpaRepository
│   │   ├── model/
│   │   │   ├── entity/                # Project, Technology, ContactMessage, AdminUser
│   │   │   ├── dto/                   # records request/response
│   │   │   └── enums/                 # ProjectType (WEB, MOBILE), ProjectStatus
│   │   └── exception/                 # GlobalExceptionHandler (@RestControllerAdvice)
│   ├── src/main/resources/
│   │   ├── application.properties     # común
│   │   ├── application-dev.properties # perfil local
│   │   └── application-prod.properties# perfil contenedor
│   ├── Dockerfile
│   └── pom.xml
│
├── deploy/
│   ├── compose.yaml                   # orquestación completa (prod)
│   ├── compose.override.yaml.example  # overrides locales (opcional)
│   ├── .env.example                   # plantilla de variables
│   └── init.sql                       # esquema inicial (si no se usa Flyway)
│
├── docs/                              # ADRs, capturas, notas
├── plan.md                            # este documento
├── commits.md                         # conventional commits por fase
└── README.md
```

---

## 4. Esquema de Base de Datos (PostgreSQL)

`deploy/init.sql` (se monta automáticamente en el primer arranque del contenedor de la BD):

```sql
-- deploy/init.sql
CREATE TYPE project_type   AS ENUM ('WEB', 'MOBILE');
CREATE TYPE project_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'MAINTAINED');

CREATE TABLE technologies (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(60)  NOT NULL UNIQUE,
    category    VARCHAR(40)  NOT NULL,            -- frontend|backend|mobile|db|devops|tool
    icon        VARCHAR(255),                     -- URL o nombre de icono
    color       VARCHAR(9)   DEFAULT '#888888',   -- hex para badge
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE projects (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(120) NOT NULL,
    slug              VARCHAR(140) NOT NULL UNIQUE,
    short_description VARCHAR(200) NOT NULL,
    description       TEXT         NOT NULL,
    type              project_type   NOT NULL DEFAULT 'WEB',
    status            project_status NOT NULL DEFAULT 'COMPLETED',
    repo_url          VARCHAR(500),
    demo_url          VARCHAR(500),
    image_url         VARCHAR(500),
    featured          BOOLEAN      NOT NULL DEFAULT FALSE,
    start_date        DATE,
    end_date          DATE,
    views_count       INT          NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE project_technologies (
    project_id     BIGINT NOT NULL REFERENCES projects(id)     ON DELETE CASCADE,
    technology_id  BIGINT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);

CREATE TABLE contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    subject     VARCHAR(150) NOT NULL,
    message     TEXT         NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    archived    BOOLEAN      NOT NULL DEFAULT FALSE,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(300),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_type     ON projects(type);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured;
CREATE INDEX idx_contact_unread    ON contact_messages(is_read) WHERE NOT is_read;

CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,           -- BCrypt
    role          VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

---

## 5. Dockerización

### 5.1 `portfoliofront/Dockerfile` — multi-etapa con Nginx

```dockerfile
# ---------- Etapa 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---------- Etapa 2: runtime ----------
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/project/browser /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ >/dev/null || exit 1
```

> Nota: el proyecto Angular se llama `project` en `angular.json`, por eso la ruta de salida es `dist/project/browser`.

### 5.2 `portfoliofront/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Assets con hash en el nombre -> cache agresiva
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback: cualquier ruta cae en index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5.3 `portafolioback/Dockerfile` — multi-etapa con JRE ligero

```dockerfile
# ---------- Etapa 1: build ----------
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Etapa 2: runtime ----------
FROM eclipse-temurin:17-jre-alpine

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
HEALTHCHECK CMD wget -qO- http://localhost:8080/actuator/health >/dev/null || exit 1
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
```

### 5.4 `.dockerignore` (idéntico en ambos proyectos, raíz de cada uno)

```
node_modules/
dist/
.angular/
target/
.git/
.vscode/
*.md
.env*
```

---

## 6. Red y Despliegue con Traefik + Cloudflare Tunnel

### 6.1 Variables de entorno — `deploy/.env.example`

```bash
# ---- Dominios ----
DOMAIN=tudominio.com
API_DOMAIN=api.tudominio.com
ACME_EMAIL=tu@correo.com

# ---- Base de datos ----
POSTGRES_DB=portfolio_db
POSTGRES_USER=portfolio_user
POSTGRES_PASSWORD=cambiame_seguro

# ---- Backend ----
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=genera_con: openssl rand -base64 64

# ---- Cloudflare (para DNS challenge de Let's Encrypt, Opción B) ----
CF_API_EMAIL=tu@correo.com
CF_DNS_API_TOKEN=token_con_permiso_Zone_DNS_Edit

# ---- Cloudflare Tunnel (Opción A: modo token) ----
CF_TUNNEL_TOKEN=eyJ...   # Zero Trust Dashboard > Networks > Tunnels > Create
```

```bash
cp deploy/.env.example deploy/.env && chmod 600 deploy/.env   # .gitignore debe incluir deploy/.env
```

### 6.2 Dos modos de conexión del túnel

| Modo | Cómo | Cuándo usarlo |
|---|---|---|
| **A. Token rápido** (recomendado para empezar) | `cloudflared` como contenedor en el compose apuntando a `http://traefik:80`. Los public hostnames se configuran en el dashboard de Zero Trust hacia `http://traefik:80`. TLS solo en el borde de Cloudflare. | Puesta en marcha rápida, sin certificados que gestionar. |
| **B. Traefik + Let's Encrypt** | Traefik emite certificado real con DNS challenge (`CF_DNS_API_TOKEN`) y escucha 443. El túnel del dashboard apunta a `https://traefik:443`. | Si quieres TLS extremo-a-extremo o exponer puertos fuera del túnel. |

El `compose.yaml` incluye ambos: los routers llevan el resolver `le` activable y el servicio `cloudflared` listo para el modo A.

### 6.3 `deploy/compose.yaml`

```yaml
name: portfolio

networks:
  web:                 # red expuesta (traefik, frontend, backend)
  internal:            # backend <-> db sin salida a internet
    internal: true

volumes:
  pgdata:

services:
  # ================= REVERSE PROXY =================
  traefik:
    image: traefik:v3.5
    restart: unless-stopped
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=portfolio_web
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      # Let's Encrypt por DNS challenge de Cloudflare (Opción B)
      - --certificatesresolvers.le.acme.email=${ACME_EMAIL}
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.le.acme.dnschallenge=true
      - --certificatesresolvers.le.acme.dnschallenge.provider=cloudflare
      - --api.dashboard=false
      - --log.level=INFO
    ports:
      - "80:80"
      - "443:443"
    environment:
      CF_API_EMAIL: ${CF_API_EMAIL}
      CF_DNS_API_TOKEN: ${CF_DNS_API_TOKEN}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - web

  # ============ CLOUDFLARE TUNNEL (Opción A) ============
  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel --no-autoupdate run
    environment:
      TUNNEL_TOKEN: ${CF_TUNNEL_TOKEN}
    depends_on:
      - traefik
    networks:
      - web
    # En el dashboard Zero Trust configura los public hostnames:
    #   tudominio.com     -> http://traefik:80
    #   api.tudominio.com -> http://traefik:80

  # ================= FRONTEND =================
  frontend:
    build:
      context: ../portfoliofront
      dockerfile: Dockerfile
    image: gabus/portfolio-front:latest
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - web
    labels:
      - traefik.enable=true
      # Router principal: tudominio.com y www
      - traefik.http.routers.frontend.rule=Host(`${DOMAIN}`) || Host(`www.${DOMAIN}`)
      - traefik.http.routers.frontend.entrypoints=websecure
      - traefik.http.routers.frontend.tls.certresolver=le
      - traefik.http.services.frontend.loadbalancer.server.port=80
      # Middlewares de seguridad
      - traefik.http.middlewares.secure-headers.headers.stsSeconds=31536000
      - traefik.http.middlewares.secure-headers.headers.stsIncludeSubdomains=true
      - traefik.http.middlewares.secure-headers.headers.browserXssFilter=true
      - traefik.http.middlewares.secure-headers.headers.contentTypeNosniff=true
      - traefik.http.middlewares.secure-headers.headers.referrerPolicy=strict-origin-when-cross-origin
      - traefik.http.routers.frontend.middlewares=secure-headers@docker
      - traefik.http.middlewares.gzip.compress=true
      - traefik.http.routers.frontend.middlewares=secure-headers@docker,gzip@docker

  # ================= BACKEND =================
  backend:
    build:
      context: ../portafolioback
      dockerfile: Dockerfile
    image: gabus/portfolio-api:latest
    restart: unless-stopped
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/${POSTGRES_DB}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/actuator/health"]
      interval: 15s
      timeout: 5s
      retries: 10
      start_period: 40s
    networks:
      - web
      - internal
    labels:
      - traefik.enable=true
      # Router API: api.tudominio.com -> Spring Boot
      - traefik.http.routers.api.rule=Host(`${API_DOMAIN}`)
      - traefik.http.routers.api.entrypoints=websecure
      - traefik.http.routers.api.tls.certresolver=le
      - traefik.http.services.api.loadbalancer.server.port=8080
      - traefik.http.routers.api.middlewares=api-headers@docker
      - traefik.http.middlewares.api-headers.headers.contentTypeNosniff=true
      # CORS ya lo gestiona Spring; aquí no se necesita strip-prefix

  # ================= BASE DE DATOS =================
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal
    # Sin puerto publicado: la BD solo es accesible desde la red interna

volumes:
  letsencrypt:
```

> ⚠️ Con el modo **A** (túnel), las reglas `Host(...)` de Traefik siguen aplicando porque cloudflared reenvía la cabecera `Host` original. Con el modo **B**, apunta el public hostname del túnel a `https://traefik:443`.

---

## 7. Configuración del Backend — properties

```properties
# application.properties (común)
spring.application.name=portafolioback
spring.jpa.open-in-view=false
spring.jackson.time-zone=America/Bogota

# application-dev.properties (local)
spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio_db
spring.datasource.username=portfolio_user
spring.datasource.password=devpassword
spring.jpa.hibernate.ddl-auto=update
logging.level.com.dev.gabus=DEBUG
app.cors.allowed-origins=http://localhost:4200

# application-prod.properties (contenedor; las creds llegan por env vars)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
app.cors.allowed-origins=https://${DOMAIN:localhost}
jwt.secret=${JWT_SECRET}
management.endpoints.web.exposure.include=health,info
```

---

## 8. Plan de Desarrollo Paso a Paso (por fases)

### Fase 0 — Preparación del repositorio
1. Crear repo GitHub y conectar el local (`git remote add origin ...`, rama `main`).
2. Crear `.gitignore` raíz global (`.env`, `deploy/.env`, `.DS_Store`).
3. Documentar en README el stack y cómo levantar.
4. Proteger rama `main` en GitHub (PR obligatorio opcional).

Verificar: `git status` limpio, push inicial OK.

### Fase 1 — Backend: dominio y persistencia
1. Enums `ProjectType`, `ProjectStatus`.
2. Entidades JPA: `Project`, `Technology`, `ContactMessage`, `AdminUser` (Lombok).
3. Relación N:M `Project` ↔ `Technology`.
4. Repositorios Spring Data.
5. `deploy/init.sql` versionado.
6. Perfiles `application-dev/prod.properties`.

Verificar: `./mvnw spring-boot:run` con PostgreSQL local arranca sin errores.

### Fase 2 — Backend: API REST
1. DTOs (records) request/response + mappers.
2. Services + Controllers: `/api/projects`, `/api/technologies`, `/api/contact`.
3. Validaciones (`@Valid`, `@NotBlank`, `@Email`...).
4. `GlobalExceptionHandler` con `ProblemDetail`.
5. `CorsConfig` leyendo `app.cors.allowed-origins`.
6. Colección de Postman/HTTP file para probar.

Verificar: CRUD de projects y POST de contacto con curl/Postman.

### Fase 3 — Frontend: layout y tema
1. Estructura `core/shared/features`.
2. Variables CSS claro/oscuro + `ThemeService` (signal + localStorage).
3. Header responsive con menú hamburguesa, footer.
4. Rutas lazy: home, projects, contact, admin.
5. Environments dev/prod.

Verificar: `npm start`, navegación entre páginas, toggle de tema persistente.

### Fase 4 — Frontend: secciones públicas
1. Home: hero, stack técnico, proyectos destacados.
2. Projects: listado con filtros (tipo web/móvil, tecnología), tarjeta y detalle.
3. Contact: formulario reactivo con estados de carga/error/éxito.
4. Componentes compartidos (project-card, badge tech).

Verificar: UI responsive en móvil/desktop, datos mock mientras tanto.

### Fase 5 — Integración Front ↔ Back
1. `provideHttpClient(withFetch())` + interceptor base URL.
2. Services tipados contra la API real.
3. Manejo de errores global (interceptor HTTP).
4. Proxy de desarrollo o CORS verificado end-to-end.

Verificar: formulario de contacto guarda en BD; listado de proyectos viene de la API.

### Fase 6 — Panel de administración
1. `spring-boot-starter-security` + JWT (login `/api/auth/login`).
2. Endpoints admin protegidos: CRUD proyectos/tecnologías, bandeja de mensajes, métricas agregadas (`/api/metrics`).
3. Front: login, dashboard con métricas (contadores, últimos mensajes), CRUD.
4. Usuario admin semilla (BCrypt).

Verificar: flujo login → token → llamadas protegidas OK; público no puede escribir.

### Fase 7 — Dockerización
1. Dockerfiles front/back + nginx.conf + .dockerignore.
2. `deploy/compose.yaml` + `.env.example` (+ actuator para healthchecks).
3. Levantar todo local: `docker compose up -d --build`.
4. Probar dominios locales: añadir `127.0.0.1 tudominio.com api.tudominio.com` a `/etc/hosts` y validar routers de Traefik.

Verificar: `docker compose ps` healthy; SPA y API responden por cada Host.

### Fase 8 — Despliegue en Debian con Cloudflare Tunnel
1. Instalar Docker + compose plugin en el VPS Debian.
2. Clonar repo, crear `deploy/.env` real.
3. Crear túnel en Zero Trust y pegar `CF_TUNNEL_TOKEN`.
4. Public hostnames: raíz y `api.` → `http://traefik:80` (o 443 si Opción B).
5. `docker compose up -d --build` en el servidor.
6. Backup programado del volumen `pgdata` (cron + `pg_dump`).

Verificar: https://tudominio.com y https://api.tudominio.com responden con candado.

### Fase 9 — CI/CD opcional (GitHub Actions)
1. Workflow lint/test en PR.
2. Build y push de imágenes a GHCR en merge a main.
3. Deploy por SSH al servidor (`docker compose pull && up -d`).

---

## 9. Comandos Rápidos de Referencia

```bash
# Local sin Docker
(cd portafolioback && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev)
(cd portfoliofront && npm start)

# Stack completo local
cd deploy && cp .env.example .env && docker compose up -d --build
docker compose logs -f backend
docker compose down            # conserva pgdata
docker compose down -v         # ¡borra datos!

# Verificación de integración
curl http://localhost:8080/api/projects
curl -H "Host: tudominio.com"     http://localhost:8080   # (tras /etc/hosts, vía traefik)
```
