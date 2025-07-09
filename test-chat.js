const { io } = require("socket.io-client");

// Reemplaza con el token recibido al hacer login
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZlNmE1ZTEzM2FjOWYxZTA2ZDdkOTgiLCJpYXQiOjE3NTIwNjY4NzUsImV4cCI6MTc1MjE1MzI3NX0._en2-Jdoesop-nCQrquGBBcW-e2O3U3iz7d4nwDrL4I";

const socket = io("http://localhost:3000", {
  auth: { token }
});

// Escuchar mensajes nuevos
display = (msg) => {
  console.log("Nuevo mensaje:", msg);
};
socket.on("newMessage", display);

// Enviar un mensaje
dispatch = () => {
  socket.emit("sendMessage", { text: "¡Hola a todos desde el cliente!" });
};
dispatch();

// Manejar errores
socket.on("error", (err) => {
  console.error("Error:", err);
});
