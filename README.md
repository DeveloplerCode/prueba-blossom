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


1.  **Docker** y **Docker Compose** (imprescindible para los servicios de MySQL y Redis)

Paso 1: Descargar el Proyecto
git clone [https://github.com/DeveloplerCode/prueba-blossom.git](https://github.com/DeveloplerCode/prueba-blossom.git)
cd prueba-blossom


### 1. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto (copia y pega el contenido de  `template.env`) con la siguiente configuración:

``` env
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
```

Paso 2: en power shell windows ejecutar el comando dentro del proyecto ``` docker compose up --build ```

Paso 3: si esta usando docker desktop puede mirar los multistage

Paso 4: al generar el comando el codigo de las migraciones genera se automaticamente

paso 5: swager http://localhost:3000/docs/ si la data no esta en cache hace la peticion al api  guarda en la db y mysql y redis 



