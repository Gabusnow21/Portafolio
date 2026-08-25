Actúa como un Arquitecto de Software Senior y Desarrollador Full-Stack experto en Angular, Spring Boot, PostgreSQL, Docker y despliegues con Traefik. 

Quiero desarrollar y desplegar una aplicación de Portafolio Web profesional que sirva como vitrina para mostrar mis proyectos web (Angular + Spring Boot) y aplicaciones móviles (Android Studio con Java). El sistema debe ser dinámico (por ejemplo, con un panel de contacto funcional que guarde mensajes y un sistema básico de administración o métricas de proyectos).

Por favor, entrégame una guía técnica completa estructurada por fases y su integracion a un repo de Github por fases de desarrollo:

1. Arquitectura del Sistema:
   - Frontend: Angular (versión moderna con componentes standalone y diseño responsive, enfocado en UI/UX limpio y modo oscuro/claro).
   - Backend: Spring Boot (REST API conectada a PostgreSQL para gestionar los proyectos, tecnologías y el formulario de contacto).
   - Base de Datos: PostgreSQL.

2. Estructura de Contenedores (Docker & Docker Compose):
   - Un `Dockerfile` optimizado multi-etapa para el frontend de Angular (sirviéndolo con Nginx o Caddy).
   - Un `Dockerfile` optimizado para el backend de Spring Boot (empaquetando el JAR con una imagen ligera de Java).
   - Un archivo `docker-compose.yml` que orqueste los tres servicios (frontend, backend y base de datos) asegurando persistencia de datos con volúmenes y redes internas seguras.

3. Configuración de Red y Despliegue con Traefik:
   - Configuración exacta de las etiquetas (labels) de **Traefik** dentro del `docker-compose.yml` para enrutar correctamente el tráfico hacia el frontend y el backend (ej: api.tudominio.com y tudominio.com), considerando que el servidor corre sobre Debian con Cloudflare Tunnels.

4. Plan de Desarrollo Paso a Paso:
   - Instrucciones claras sobre cómo configurar las variables de entorno, levantar los contenedores localmente y verificar la integración de todo el stack.

Revisa la estructura de carpetas con las versiones para Angular y Springboot, ademas de las dependencias agregadas y las necesarias.

Proporcióname los códigos de configuración (Dockerfiles, docker-compose, esquemas de base de datos) y la estructura de carpetas recomendada para arrancar el proyecto de inmediato. Guarda todo en un .md llamado plan y luego ejecutaremos el desarrollo por fases con git, usa conventional commits en español para el detallado de los commits a usar en git en un documento .md.
