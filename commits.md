# Conventional Commits — Portafolio Web (por fases)

> Formato: `tipo(alcance): descripción en minúsculas, imperativo, sin punto final`
>
> Tipos: `feat`, `fix`, `refactor`, `style`, `perf`, `test`, `docs`, `build`, `ci`, `chore`
>
> Ramas sugeridas: `main` (producción) + `develop` (integración). Feature branches: `feat/nombre-corto`.

---

## Fase 0 — Preparación del repositorio ✅ COMPLETADA

```
chore: inicializar repositorio con estructura base del monorepo
chore: agregar gitignore global para env y artefactos de build
docs: crear readme con stack tecnologico e instrucciones iniciales
docs: agregar plan tecnico y guia de commits convencionales
chore: configurar rama develop y proteccion de main
```

> **Commits reales realizados (25-Ago-2026):**
> `d385b03` · `1272846` · `375cd44`
> Pendiente push a origin.

## Fase 1 — Backend: dominio y persistencia ✅ COMPLETADA

```
chore(backend): importar proyecto spring boot 4 con maven wrapper
feat(enums): agregar projecttype y projectstatus
feat(entity): crear entidad project con auditoria basica
feat(entity): crear entidad technology con categoria e icono
feat(entity): crear entidad contactmessage para formulario de contacto
feat(entity): crear entidad adminuser con hash bcrypt
feat(relation): mapear relacion muchos a muchos entre project y technology
feat(repository): agregar repositorios jpa del dominio
feat(db): versionar esquema inicial en deploy/init.sql
feat(config): separar perfiles dev y prod en properties
test(repository): verificar persistencia de entidades con h2 o testcontainers
```

> **Commits reales realizados (25-Ago-2026):**
> `e5ad8aa` · `652ac38` · `66e173e` · `d29874a` · `2625474` · `62a5e9c`
> Verificación: `./mvnw compile` exitoso (sin errores).

## Fase 2 — Backend: API REST ✅ COMPLETADA

```
feat(dto): agregar records request y response para projects
feat(dto): agregar records para technologies y contact messages
feat(service): implementar project service con crud completo
feat(service): implementar technology service y contacto
feat(controller): exponer endpoints rest de projects
feat(controller): exponer endpoints de technologies y contact
feat(validation): validar dtos con jakarta validation
feat(exception): manejar errores globalmente con problem detail
feat(cors): configurar cors leido desde app.cors.allowed-origins
feat(api): agregar paginacion y filtros al listado de proyectos
test(api): pruebas de integracion de controladores con mockmvc
docs(api): documentar endpoints en http file o coleccion postman
```

> **Commits reales realizados (25-Ago-2026):**
> `564d600` · `02227ce` · `bf19c13`
> Verificación: `./mvnw compile` exitoso.

## Fase 3 — Frontend: layout y tema ✅ COMPLETADA

```
chore(frontend): reorganizar app en core shared y features
feat(env): generar environments para desarrollo y produccion
feat(theme): definir variables css para modo claro y oscuro
feat(theme): crear theme service con senal y persistencia en localstorage
feat(layout): crear header responsive con menu hamburguesa
feat(layout): crear footer con enlaces sociales
feat(routes): configurar rutas lazy de home projects contact y admin
feat(app): integrar providehttpclient en app config
style(global): aplicar tipografia y espaciado base
```

> **Commits reales realizados (26-Ago-2026):**
> `d092891` · `07e7d98` · `c74ec05` · `efd4216` · `89866b2`
> Verificación: `npm run build` exitoso (4 lazy chunks generados).

## Fase 4 — Frontend: secciones públicas ✅ COMPLETADA

```
feat(home): crear hero con presentacion personal y llamada a la accion
feat(home): mostrar stack tecnico con badges de tecnologias
feat(home): listar proyectos destacados desde modelo mock
feat(projects): crear listado con filtros por tipo y tecnologia
feat(projects): crear tarjeta reutilizable de proyecto
feat(projects): crear vista de detalle de proyecto
feat(contact): crear formulario reactivo con validaciones
feat(contact): agregar estados de carga error y exito en el envio
feat(shared): agregar pipe para slug de tecnologias
style(responsive): ajustar breakpoints moviles tablet y desktop
a11y: mejorar contraste foco y etiquetas aria en formularios
```

> **Commits reales realizados (26-Ago-2026):**
> `25023a0` · `ed9f74f` · `389f904` · `e015024`
> Verificación: `npm run build` exitoso (8 lazy chunks generados).

## Fase 5 — Integración Front ↔ Back

```
feat(http): conectar project service con api real
feat(http): conectar contact service con endpoint de contacto
feat(interceptor): agregar interceptor de url base y errores http
fix(cors): habilitar origen del dev server en backend
feat(toast): notificar resultado de operaciones al usuario
perf(frontend): precargar rutas criticas con preloadstrategy
e2e: validar flujo contacto guarda mensaje en postgres
```

## Fase 6 — Panel de administración

```
feat(security): agregar spring security con filtro jwt
feat(auth): implementar login con emision de token jwt
feat(auth): proteger endpoints de escritura con role admin
feat(metrics): exponer contadores agregados en api metrics
feat(admin): crear login de administrador en frontend
feat(admin): guardar token y redirigir tras autenticacion
feat(interceptor): adjuntar bearer token en peticiones salientes
feat(admin): crear dashboard con metricas de proyectos y mensajes
feat(admin): implementar crud de proyectos en panel
feat(admin): implementar crud de tecnologias en panel
feat(admin): crear bandeja de mensajes con marcar leido y archivar
feat(seed): cargar usuario admin inicial con bcrypt
test(security): verificar acceso publico vs protegido por rol
```

## Fase 7 — Dockerización

```
build(frontend): crear dockerfile multi-etapa node y nginx
build(frontend): agregar nginx conf con spa fallback y gzip
build(backend): crear dockerfile multi-etapa maven y jre alpine
build: agregar dockerignore en ambos proyectos
feat(backend): agregar actuator para healthchecks
build(deploy): crear compose con redes web e internal
build(deploy): persistir datos de postgres en volumen pgdata
build(deploy): agregar healthchecks y depends_on condicional
build(deploy): parametrizar variables con env example
chore(deploy): documentar levantamiento local del stack
fix(compose): corregir red docker usada por traefik provider
```

## Fase 8 — Despliegue con Traefik y Cloudflare Tunnel

```
feat(traefik): agregar labels de routing para dominio raiz
feat(traefik): agregar labels de routing para subdominio api
feat(traefik): configurar tls con resolver letsencrypt dns challenge
feat(traefik): agregar middlewares de headers seguros y compresion
feat(tunnel): integrar cloudflared como servicio del compose
docs(deploy): detallar public hostnames en zero trust dashboard
chore(server): instalar docker y clonar repo en debian
fix(traefik): ajustar reglas host para www y api
ops: programar backup diario de pgdata con cron
ops: agregar renovacion verificada de certificados acme
```

## Fase 9 — CI/CD opcional

```
ci: ejecutar lint y tests en pull requests
ci: construir y publicar imagenes en ghcr al fusionar main
ci: desplegar automaticamente al servidor via ssh
chore(ci): agregar secrets de ghcr ssh y tunnel al repositorio
```

## Commits de mantenimiento (plantillas)

```
fix(api): describir bug corregido y causa raiz
perf(db): agregar indice parcial para consultas frecuentes
refactor(service): extraer logica duplicada a metodo compartido
deps: actualizar angular a la ultima version menor
security: rotar jwt secret y credenciales filtradas
revert(feat/admin): revertir cambio que rompia el login
hotfix(prod): parche critico aplicado directamente en main
```

---

### Reglas acordadas para este repo

1. Un commit = un cambio lógico atómico.
2. Nunca commitear `deploy/.env`, secretos ni `node_modules`.
3. Antes de cada push a `develop`: tests verdes (`./mvnw verify`, `npm test`).
4. Merge a `main` solo vía PR (o fast-forward si trabajas solo) con historial limpio.
