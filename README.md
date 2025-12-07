



# 🚀 Rick and Morty Character API

Este proyecto implementa una API moderna y robusta utilizando **Node.js, Express y GraphQL**. Su objetivo es buscar y sincronizar datos de personajes de la API externa de Rick y Morty, empleando una arquitectura avanzada con bases de datos relacionales, caché y tareas programadas.

## 🗃️ Arquitectura y Tecnologías

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Servidor** | Node.js / Express / TypeScript | Entorno de ejecución y framework base. |
| **Capa de Datos** | GraphQL | Lenguaje de consulta declarativo para la API. |
| **Persistencia** | **MySQL** (Sequelize ORM) | Base de datos relacional para almacenar datos. |
| **Caché** | **Redis** | Almacenamiento rápido en memoria para resultados de búsqueda (Cache-Aside). |
| **Tareas** | **`node-cron`** | Programación de sincronización automática (cada 1 minuto). |
| **Debugging** | **Decoradores** (`@measureTime`) | Medición del tiempo de ejecución de consultas. |
| **Logging** | Logger Service | Registro centralizado de peticiones y errores. |

---

## ⚙️ Configuración y Requisitos

Para ejecutar este proyecto, necesitas tener instalado:

1.  **Node.js** (v18+ recomendado).
2.  **Docker** y **Docker Compose** (para ejecutar MySQL y Redis).
3.  **Sequelize CLI** (instalación global: `npm install -g sequelize-cli`).

### 1. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto con la configuración de Docker para los servicios de base de datos y caché:

```env
# SERVER CONFIG
PORT=4000

# MYSQL / SEQUELIZE CONFIG
DB_HOST=mysql_db
DB_DIALECT=mysql
DB_NAME=blossom_db
DB_USER=root
DB_PASSWORD=secret

# REDIS CONFIG
REDIS_URL=redis://redis_cache:6379
