# 💈 Santos Faded  — Sistema de Reservas de Citas

Aplicación web (PWA) para la gestión de citas de una barbería real. Permite a los clientes reservar citas en línea viendo disponibilidad en tiempo real, y le da al barbero un panel de administración completo para manejar su negocio sin depender de terceros.

🔗 **Demo en vivo:** https://barberia-app-roan.vercel.app

## 📋 Descripción del proyecto

Este proyecto fue desarrollado a solicitud de un cliente real (dueño de una barbería), con el objetivo de digitalizar el proceso de agendamiento de citas, anteriormente manejado por WhatsApp o llamadas telefónicas.

## ✨ Funcionalidades

### Para el cliente
- Visualización de servicios y precios
- Visualización de horarios de atención
- Selección de horarios disponibles en tiempo real (bloqueando automáticamente horas ya reservadas u ocupadas por el barbero)
- Reserva de citas con nombre y tipo de servicio
- Galería de fotos de trabajos realizados
- Confirmación de asistencia previa a la cita
- Acceso rápido mediante código QR (instalación como PWA)

### Para el barbero (panel de administración)
- Autenticación segura (correo y contraseña)
- Gestión de servicios y precios (crear / eliminar)
- Configuración de horarios de atención por día de la semana
- Bloqueo manual de horarios puntuales (ej. almuerzo, imprevistos)
- Visualización de todas las citas reservadas
- Subida de fotos a la galería

## 🛠️ Tecnologías utilizadas

- **Frontend:** React + Vite
- **Enrutamiento:** React Router DOM
- **Base de datos:** Firebase Firestore
- **Autenticación:** Firebase Authentication
- **Almacenamiento de imágenes:** Cloudinary
- **PWA:** vite-plugin-pwa
- **Despliegue:** Vercel (integración continua desde GitHub)

## 📂 Estructura del proyecto
src/
├── App.jsx # Vista principal del cliente (servicios, horarios, reserva)
├── PanelBarbero.jsx # Panel de administración del barbero
├── Login.jsx # Autenticación del barbero
├── ConfirmarCita.jsx # Confirmación de asistencia del cliente
└── firebase.js # Configuración de conexión a Firebase



## 🗄️ Modelo de datos (Firestore)

| Colección   | Campos                                                              |
|-------------|----------------------------------------------------------------------|
| `servicios` | nombre, precio                                                       |
| `horarios`  | dia, horaInicio, horaFin, activo                                     |
| `citas`     | nombreCliente, servicio, dia, hora, estado                          |
| `bloqueos`  | dia, hora                                                            |
| `fotos`     | url                                                                  |

## 🚀 Instalación local

```bash
git clone https://github.com/erickmaurozena/barberia-app.git
cd barberia-app
npm install
npm run dev
```

## 👤 Autor

**Erick Mauro Zeña**
Proyecto desarrollado de forma independiente, incluyendo levantamiento de requerimientos con cliente real, diseño (wireframes), desarrollo full stack, y despliegue en producción.
