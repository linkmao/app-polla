# PRD (Product Requirements Document)

## 1. Visión General
El proyecto es una aplicación web para la gestión de apuestas deportivas tipo "polla". Permite a los usuarios registrarse, realizar apuestas sobre partidos, consultar clasificaciones, ver resultados y administrar equipos y llaves. Incluye un panel de administración para la gestión de usuarios, juegos, equipos y configuraciones.

## 2. Objetivos del Proyecto
- Permitir la gestión y registro de apuestas deportivas.
- Facilitar la administración de usuarios, equipos, juegos y clasificaciones.
- Proveer reportes y visualizaciones de resultados y clasificaciones.
- Garantizar la seguridad y privacidad de los datos de los usuarios.

## 3. Usuarios y Roles
- **Usuario Apostador:** Puede registrarse, iniciar sesión, realizar apuestas, consultar resultados y clasificaciones.
- **Administrador:** Accede a paneles de gestión para administrar usuarios, equipos, juegos, llaves y configuraciones generales.

## 4. Funcionalidades Principales
- Registro y autenticación de usuarios (login, logout, recuperación de contraseña).
- Realización de apuestas por partido, fase y clasificación.
- Visualización de resultados, puntos y clasificaciones.
- Gestión de equipos, juegos, llaves y usuarios desde el panel de administración.
- Carga de imágenes y recursos asociados a equipos y juegos.
- Configuración de reglas y parámetros del sistema.

## 5. Requisitos Técnicos
- **Backend:** Node.js, Express, Mongoose (MongoDB).
- **Frontend:** Handlebars, SCSS, Bootstrap.
- **Base de datos:** MongoDB.
- **Autenticación:** Passport.js.
- **Despliegue:** Servidor Node.js, compatible con Windows.

## 6. Criterios de Aceptación
- El usuario puede registrarse, iniciar sesión y recuperar su contraseña.
- El usuario puede realizar apuestas y consultar sus resultados.
- El administrador puede gestionar usuarios, equipos, juegos y llaves.
- El sistema calcula y muestra correctamente los puntos y clasificaciones.
- El sistema es seguro y protege los datos de los usuarios.

## 7. Riesgos y Consideraciones
- Seguridad en el manejo de datos personales y contraseñas.
- Integridad de los datos de apuestas y resultados.
- Escalabilidad para soportar múltiples usuarios concurrentes.
- Facilidad de uso y experiencia de usuario.

## 8. Métricas de Éxito
- Número de usuarios registrados y activos.
- Cantidad de apuestas realizadas.
- Disponibilidad y estabilidad del sistema.
- Satisfacción de los usuarios (feedback y encuestas).

---

Este documento servirá como base para la planificación y ejecución de pruebas (testing) funcionales y de usuario.