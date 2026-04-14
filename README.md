# 🎵 NextSong Web

Plataforma web para la gestión de canciones y eventos musicales. Permite a músicos y bandas organizar su repertorio, crear eventos, agregar colaboradores y acceder a información enriquecida de canciones mediante APIs externas.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [APIs Externas Integradas](#apis-externas-integradas)
- [Modelos de Datos](#modelos-de-datos)
- [Endpoints de la API REST](#endpoints-de-la-api-rest)
- [Configuración y Despliegue](#configuración-y-despliegue)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Roles de Usuario](#roles-de-usuario)

---

## Descripción General

NextSong es una aplicación fullstack dividida en dos módulos principales:

- **`Nextsong/`** — Frontend desarrollado con React + Vite.
- **`services/`** — Backend desarrollado con Spring Boot 3 conectado a una base de datos Oracle Cloud.

---

## Tecnologías

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19.2.0 |
| Vite | 7.3.1 |
| React Router DOM | 7.13.1 |
| Bootstrap | 5.3.8 |
| React Bootstrap | 2.10.10 |
| React Icons | 5.6.0 |

### Backend
| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 3.3.5 |
| Spring Security | (incluido en Boot) |
| Spring Data JPA | (incluido en Boot) |
| Spring WebFlux | (incluido en Boot) |
| Hibernate | OracleDialect |
| Oracle JDBC (ojdbc11) | 23.3.0 |
| Lombok | 1.18.34 |
| Jackson Databind | (incluido en Boot) |
| Spring Cache | (incluido en Boot) |
| Spring Mail | (incluido en Boot) |

### Base de Datos
- **Oracle Autonomous Database (Oracle Cloud)** con conexión segura mediante Oracle Wallet.

---

## Arquitectura del Proyecto

```
Nextsong-Web/
├── Nextsong/          # Frontend — React + Vite
│   ├── src/
│   │   ├── components/        # Componentes globales (Navbar, Sidebar, Modales)
│   │   ├── modules/
│   │   │   ├── access/        # Vistas públicas (Login, SignUp, Recovery)
│   │   │   ├── auth/          # Vistas protegidas (Songs, Events, Home, User)
│   │   │   ├── errors/        # Páginas de error (403, 404)
│   │   │   └── router/        # Enrutadores público y autenticado
│   │   └── services/          # Configuración de URL base de la API
│   └── .env.example
│
└── services/          # Backend — Spring Boot
    └── src/main/java/utez/edu/mx/nextsong/
        ├── config/            # Seguridad CORS y WebClient
        ├── controllers/       # Controladores REST
        ├── dto/               # Data Transfer Objects
        ├── models/            # Entidades JPA
        ├── repositories/      # Repositorios Spring Data
        ├── services/          # Lógica de negocio + APIs externas
        └── utils/             # Utilidades (TextCleaner)
```

---

## Funcionalidades

### Autenticación y Usuarios
- Registro de nuevos usuarios (`/signUp`).
- Inicio de sesión con email y contraseña (`/login`).
- Recuperación de contraseña por correo electrónico con código de verificación (`/recovery`, `/verify-code`, `/reset-password`).
- Gestión del perfil del usuario autenticado.
- Sistema de roles: **Administrador** y **Usuario regular**.

### Gestión de Canciones
- CRUD completo de canciones (título, autor, letra, acordes, tonalidad, BPM, duración, notas, estatus).
- Búsqueda de canciones en el catálogo interno.
- **Búsqueda de canciones externas** mediante integración con múltiples APIs musicales.
- Importación de canciones externas al repertorio propio.
- Visualización de diagramas de acordes (`ChordDiagrams`).
- Vista de detalle de canción con toda su metadata enriquecida.
- Solo los administradores pueden eliminar canciones; las canciones asignadas a eventos no pueden eliminarse.

### Gestión de Eventos
- Creación de eventos en dos pasos (nombre/categoría/fecha/lugar → canciones del repertorio).
- Visualización de eventos propios y de eventos en los que el usuario es colaborador.
- Invitación y gestión de colaboradores por evento.
- Asignación y desasignación de canciones del repertorio a eventos (`EventSong`).
- Vista de detalle de evento con su lista de canciones.
- Administradores visualizan todos los eventos del sistema.

### Categorías de Usuario
- Soporte para categorías personalizadas de usuario (`UserCategory`).

---

## APIs Externas Integradas

El backend orquesta múltiples APIs de forma paralela para enriquecer la información de las canciones:

| Servicio | Función |
|---|---|
| **MusicBrainz** | Búsqueda principal de canciones y artistas |
| **OpenOpus** | Búsqueda de obras de música clásica |
| **Lyrics.ovh / Happi.dev** | Obtención de letras de canciones |
| **AcousticBrainz** | Metadata de audio (BPM, tonalidad, modo) |
| **iTunes** | Duración de tracks y arte de álbum |
| **Last.fm** | Metadata enriquecida y corrección de nombres |
| **Songsterr** | Información de acordes |

La búsqueda combina resultados de MusicBrainz y OpenOpus, aplica de-duplicación automática y completa la metadata de todas las canciones en paralelo (`parallelStream`) para minimizar la latencia.

---

## Modelos de Datos

### `User`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | PK, generado por secuencia |
| `fullName` | String | Nombre completo |
| `email` | String | Único |
| `password` | String | Contraseña en texto plano|
| `status` | String | Estado de la cuenta |
| `role` | Role | Rol asignado (FK) |

### `Song`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | PK |
| `title` | String | Título |
| `author` | String | Autor/Artista |
| `lyrics` | CLOB | Letra completa |
| `chords` | CLOB | Acordes |
| `keyTone` | String | Tonalidad |
| `bpm` | Integer | Tempo |
| `duration` | String | Duración |
| `notes` | String | Notas adicionales |
| `status` | String | Estado |

### `Event`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | PK, generado por secuencia |
| `name` | String | Nombre del evento |
| `category` | String | Categoría |
| `status` | String | Estado |
| `description` | String | Descripción |
| `location` | String | Lugar |
| `eventDate` | String | Fecha del evento |
| `creator` | User | Creador (FK) |
| `collaborators` | Set\<User\> | Colaboradores (ManyToMany) |

### `EventSong`
Tabla relacional entre eventos y canciones, con soporte para orden o número de canción dentro del evento.

### `PasswordResetToken`
Token para el flujo de recuperación de contraseña por email.

---

## Endpoints de la API REST

> Base URL: `http://localhost:8080`

### Auth — `/auth`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/recovery` | Solicitar recuperación de contraseña |
| POST | `/auth/verify-code` | Verificar código de recuperación |
| POST | `/auth/reset-password` | Restablecer contraseña |

### Usuarios — `/users`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/users/{id}` | Obtener usuario por ID |
| PUT | `/users/{id}` | Actualizar datos del usuario |
| PUT | `/users/{id}/password` | Cambiar contraseña |

### Canciones — `/songs`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/songs` | Obtener todas las canciones |
| GET | `/songs/{id}` | Obtener canción por ID |
| POST | `/songs` | Crear canción |
| PUT | `/songs/{id}` | Actualizar canción |
| DELETE | `/songs/{id}` | Eliminar canción (solo Admin) |

### Canciones Externas — `/external-songs`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/external-songs/search?query=...` | Buscar canciones en APIs externas |
| POST | `/external-songs/import` | Importar canción externa al sistema |

### Eventos — `/events`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/events/user/{userId}` | Eventos del usuario |
| GET | `/events/{id}` | Detalle de evento |
| POST | `/events` | Crear evento |
| PUT | `/events/{id}` | Actualizar evento |
| DELETE | `/events/{id}` | Eliminar evento |

### Canciones de Evento — `/event-songs`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/event-songs/event/{eventId}` | Canciones de un evento |
| POST | `/event-songs` | Agregar canción a evento |
| DELETE | `/event-songs/{id}` | Quitar canción de evento |

---

## Configuración y Despliegue

### Requisitos Previos

- **Java 21** o superior
- **Node.js 18+** y **npm**
- **Maven 3.8+**
- **Oracle Wallet** configurado localmente para la conexión a Oracle Cloud
- Cuenta de **Gmail** con contraseña de aplicación habilitada
- API Keys de **Happi.dev** y **Last.fm**

---

### Backend (Spring Boot)

#### 1. Configurar `application.properties`

Edita `services/src/main/resources/application.properties`:

```properties
# BASE DE DATOS — Oracle Cloud
spring.datasource.url=jdbc:oracle:thin:@<alias_tns>?TNS_ADMIN=<ruta/al/Wallet>
spring.datasource.username=ADMIN
spring.datasource.password=<tu_password_oracle>
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

# JPA / HIBERNATE
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect

# CORREO (Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<tu_correo@gmail.com>
spring.mail.password=<contraseña_de_aplicacion_gmail>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# API KEYS
happi.api.key=<tu_api_key_happi>
lastfm.api.key=<tu_api_key_lastfm>
```

> ⚠️ **Importante:** El Oracle Wallet debe estar descomprimido en la ruta indicada en `TNS_ADMIN`. Asegúrate de que los archivos `tnsnames.ora`, `sqlnet.ora` y los certificados estén presentes.

#### 2. Compilar y ejecutar

```bash
cd services
./mvnw clean install
./mvnw spring-boot:run
```

El backend quedará disponible en: `http://localhost:8080`

---

### Frontend (React + Vite)

#### 1. Instalar dependencias

```bash
cd Nextsong
npm install
```

#### 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta la URL:

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_API_URL=http://localhost:8080
```

#### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

#### 4. Compilar para producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

---

## Variables de Entorno

### Frontend

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:8080` |

### Backend (`application.properties`)

| Propiedad | Descripción |
|---|---|
| `spring.datasource.url` | URL de conexión JDBC a Oracle Cloud |
| `spring.datasource.username` | Usuario de la base de datos |
| `spring.datasource.password` | Contraseña de la base de datos |
| `spring.mail.username` | Correo remitente para recuperación de contraseña |
| `spring.mail.password` | Contraseña de aplicación de Gmail |
| `happi.api.key` | API Key de Happi.dev para letras |
| `lastfm.api.key` | API Key de Last.fm para metadata |

---

## Estructura de Carpetas

```
Nextsong/src/
├── components/
│   ├── ConfirmModal.jsx
│   ├── CustomNavbar.jsx
│   ├── CustomSidebar.jsx
│   └── SuccessModal.jsx
├── modules/
│   ├── access/
│   │   ├── views/         # Login, SignUp, RecoveryPassword, VerifyCode, ResetPassword
│   │   ├── controller/    # LoginController, UserController
│   │   └── service/       # LoginService, UserService
│   ├── auth/
│   │   ├── home/          # Home.jsx
│   │   ├── songs/
│   │   │   ├── views/     # Songs, SongDetail, CreateIndependentSong
│   │   │   ├── components/ # SongCard, ChordDiagrams, ExternalSongSearchModal
│   │   │   ├── controller/ # songs.controller, SongIndependientController
│   │   │   └── service/   # ExternalSongService, ChordReferenceService, SongIndependientService
│   │   ├── events/
│   │   │   ├── views/     # Events, EventDetail
│   │   │   ├── components/ # EventCard, SongEventCard, CreateEventModal, CollaboratorsModal
│   │   │   └── controller/ # events.controller, eventSongs.controller, users.controller
│   │   └── user/
│   │       ├── view/      # User.jsx
│   │       └── controller/ # UserController
│   ├── errors/            # Error403.jsx, Error404.jsx
│   └── router/
│       ├── AuthRouter.jsx
│       └── PublicRouter.jsx
└── services/
    └── api.js             # URL base de la API
```

---

## Roles de Usuario

| Rol | ID | Permisos |
|---|---|---|
| **Administrador** | 1 | Ver todos los eventos y usuarios, eliminar canciones, gestión completa |
| **Usuario Regular** | 2+ | Ver sus propios eventos y colaboraciones, gestionar su repertorio |

---

## Notas de Seguridad

> ⚠️ Este proyecto fue desarrollado con fines académicos. Antes de llevarlo a producción se recomienda:
>
> - Implementar **hashing de contraseñas** (bcrypt o Argon2) — actualmente se almacenan en texto plano.
> - Implementar **JWT** u otro mecanismo de autenticación stateless en lugar de `sessionStorage`.
> - Restringir los **orígenes CORS** permitidos en `SecurityConfig`.
> - Mover todas las credenciales a variables de entorno del sistema operativo o un gestor de secretos.
> - No incluir el Oracle Wallet en el repositorio de código.
