const dotEnv = require("dotenv");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { request, response } = require("express");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const prism = new PrismaClient();

//---Archivos de rutas---
const categoriasRoutes = require("./routes/categoriaRoutes");
const direccionesRoutes = require("./routes/direccionRoutes");
const metodosPagoRoutes = require("./routes/metodoPagoRoutes");
const pedidosRoutes = require("./routes/pedidoRoutes");
const preguntasRoutes = require("./routes/preguntaRoutes");
const productosRoutes = require("./routes/productoRoutes");
const respuestasRoutes = require("./routes/respuestaRoutes");
const rolRoutes = require("./routes/rolRoutes");
const usuariosRoutes = require("./routes/usuarioRoutes");

// Acceder a la configuracion del archivo .env
dotEnv.config();
// Puero que escucha por defecto 300 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(logger("dev"));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Configurar el middleware para guardar fotos a la carpeta 'images'
app.use("/images/", express.static("images"));

//---- Definir rutas ----
app.use("/categoria/", categoriasRoutes);
app.use("/direccion/", direccionesRoutes);
app.use("/metodoPago/", metodosPagoRoutes);
app.use("/pedido/", pedidosRoutes);
app.use("/pregunta/", preguntasRoutes);
app.use("/producto/", productosRoutes);
app.use("/respuesta/", respuestasRoutes);
app.use("/rol/", rolRoutes);
app.use("/usuario/", usuariosRoutes);

// Servidor
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log("Presione CTRL-C para deternerlo\n");
});
