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

## Sistema de Diseño RPG

La interfaz sigue una estética de RPG pixel art inspirada en **Golden Sun** (identidad:
ventanas azul profundo, trim dorado y biseles) y **Dragon Quest VII** (legibilidad:
cajas de diálogo azul sólido con borde crema). No es un tema alternativo: reemplaza
por completo el diseño anterior.

### Estructura

| Ruta | Contenido |
|---|---|
| `src/styles/_tokens.css` | Paleta, tipografía, espaciado, sombras y movimiento |
| `src/styles/_base.css` | Fuentes, reset, foco visible y `prefers-reduced-motion` |
| `src/styles/_rpg.css` | Ventanas, botones, badges, menús y utilidades |
| `src/styles/_legacy.css` | Compatibilidad temporal con controles y `.container` |
| `src/app/shared/ui/` | `RpgWindow`, `RpgButton`, `StatBar`, `PixelIcon`, `PixelAvatar` |
| `src/app/features/styleguide/` | Catálogo visual interno en `/styleguide` |

Las fuentes **Pixelify Sans** e **IBM Plex Mono** se sirven localmente desde
`public/fonts/` con licencia SIL OFL (archivos de licencia incluidos). Pixelify Sans
se reserva para títulos y elementos de display; IBM Plex Mono se usa en cuerpo,
formularios y textos largos.

### Datos

- Ficha, habilidades, equipo y biografía: contenido estático tipado en
  `src/app/features/about/about.content.ts`.
- Proyectos y tecnologías: se obtienen de la API REST (`/api/projects`,
  `/api/technologies`). Las vistas incluyen estados de carga, error y vacío.

### Accesibilidad

- Enlace “Saltar al contenido”, landmarks (`header`, `main`, `footer`, `nav`) y un
  único `h1` por página.
- Foco visible de alto contraste y navegación completa por teclado; el menú móvil
  usa `aria-expanded` y se cierra con `Escape`.
- Formularios con `label` asociado, `aria-invalid`, `aria-describedby`, foco en el
  primer campo inválido y mensajes de estado con `aria-live`/`role`.
- Barras de habilidad con `role="progressbar"` y valor textual; nada depende solo
  del color.
- Animaciones desactivadas con `prefers-reduced-motion`.
- Contraste verificado AA y auditoría automática con axe-core sin violaciones en
  escritorio (1440px) y móvil (390px).

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

Resumen rápido:

1. Clonar el repo en el servidor.
2. Configurar `deploy/.env` con variables reales (ver `deploy/.env.example`).
3. Crear túnel en Cloudflare Zero Trust y pegar `CF_TUNNEL_TOKEN`.
4. `cd deploy && docker compose up -d --build`
5. Backup de PostgreSQL con cron + `pg_dump`.

---

## Flujo de Git

- **Ramas:** `main` (producción) y `develop` (integración).
- **Commits:** Conventional Commits en español (`feat:`, `fix:`, `docs:`, etc.).

```bash
git checkout -b develop
git add .
git commit -m "feat(ruta): descripción"
git push -u origin develop
```

---

## Contacto

Desarrollado por **Gabus** · [GitHub](https://github.com/Gabusnow21)
