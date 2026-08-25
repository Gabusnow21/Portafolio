# Portafolio Web Profesional

Vitrina dinámica de proyectos web y aplicaciones móviles. API REST + SPA + PostgreSQL, desplegada con Traefik y Cloudflare Tunnel.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Angular (standalone, signals) | 20.3.0 |
| Backend | Spring Boot (Maven, Java 17) | 4.1.1 |
| Base de datos | PostgreSQL | 17 |
| Contenedores | Docker + Docker Compose | - |
| Reverse proxy / TLS | Traefik v3 | v3.5 |
| CDN / Túnel | Cloudflare | - |

---

## Arquitectura

```
Internet → Cloudflare CDN → Cloudflare Tunnel → Traefik
                                                     │
                                    ┌─────────────────┴──────────────────┐
                                    │                                    │
                              tudominio.com                   api.tudominio.com
                                    │                                    │
                              Angular SPA                        Spring Boot API
                              (Nginx :80)                           (:8080)
                                                                    │
                                                              PostgreSQL 17
```

---

## Estructura del Repositorio

```
portfolio/
├── portfoliofront/        # Angular 20 — SPA frontend
│   ├── src/               # Componentes, servicios, environments
│   ├── nginx.conf         # Configuración SPA para Nginx
│   └── Dockerfile         # Multi-etapa: Node build + Nginx runtime
├── portafolioback/        # Spring Boot 4 — API REST
│   ├── src/               # Controllers, services, entities, DTOs
│   └── Dockerfile         # Multi-etapa: Maven build + JRE runtime
├── deploy/
│   ├── compose.yaml       # Orchestration completa (prod)
│   ├── .env.example       # Plantilla de variables de entorno
│   └── init.sql           # Esquema inicial de PostgreSQL
├── plan.md                # Documentación técnica completa por fases
├── commits.md             # Conventional commits por fase
└── README.md              # Este archivo
```

---

## Prerrequisitos

| Herramienta | Versión mínima | Nota |
|---|---|---|
| Node.js | ^20 o ^22 | LTS |
| Java JDK | 17+ | o usar `./mvnw` (descarga automáticamente) |
| Maven | 3.9+ | o usar `./mvnw` incluido en el repo |
| Docker + Compose | 20.10+ / 2.x+ | plugin `docker compose` (sin guion) |
| PostgreSQL | 15+ | solo para desarrollo local sin Docker |

---

## Desarrollo Local (sin Docker)

**Backend:**
```bash
cd portafolioback
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# → http://localhost:8080
```

**Frontend:**
```bash
cd portfoliofront
npm install
npm start
# → http://localhost:4200
```

---

## Stack Completo con Docker

```bash
cd deploy
cp .env.example .env        # editar con tus valores reales
docker compose up -d --build
docker compose logs -f backend
```

Verificar:
- SPA: http://localhost
- API: http://localhost:8080/api/projects

**Parar (conservando datos):**
```bash
docker compose down
```

**Parar (borrando todo, incluyendo la BD):**
```bash
docker compose down -v
```

---

## Variables de Entorno

Ver `deploy/.env.example` para la plantilla completa. Las más importantes:

| Variable | Ejemplo | Descripción |
|---|---|---|
| `POSTGRES_DB` | `portfolio_db` | Nombre de la base de datos |
| `POSTGRES_USER` | `portfolio_user` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | `cambiame` | Contraseña de PostgreSQL |
| `JWT_SECRET` | `base64...` | Secreto para tokens JWT |
| `SPRING_PROFILES_ACTIVE` | `prod` | Perfil de Spring Boot |
| `DOMAIN` | `tudominio.com` | Dominio principal |
| `API_DOMAIN` | `api.tudominio.com` | Subdominio de la API |

---

## Despliegue en Producción (Debian + Cloudflare)

Ver **`plan.md §6`** para la guía completa. Resumen rápido:

1. Clonar el repo en el servidor.
2. Configurar `deploy/.env` con variables reales.
3. Crear túnel en Cloudflare Zero Trust y pegar `CF_TUNNEL_TOKEN`.
4. `docker compose up -d --build`
5. Backup de PostgreSQL con cron + `pg_dump`.

---

## Flujo de Git

- **Ramas:** `main` (producción) y `develop` (integración).
- **Commits:** Conventional Commits en español (`feat:`, `fix:`, `docs:`, etc.).
- **Commits por fase documentados en:** `commits.md`

```bash
git checkout -b develop
git add .
git commit -m "feat(ruta): descripción"
git push -u origin develop
```

---

## Documentación

| Archivo | Contenido |
|---|---|
| [plan.md](./plan.md) | Guía técnica completa: arquitectura, Docker, Traefik, esquema BD, fases de desarrollo |
| [commits.md](./commits.md) | Conventional commits en español organizados por fase |
| [instructions.md](./instructions.md) | Especificación original del proyecto |

---

## Contacto

Desarrollado por **Gabus** · [GitHub](https://github.com/Gabusnow21)
