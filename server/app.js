const dotEnv = require("dotenv");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const prism = new PrismaClient();

//---Archivos de rutas---
const categoriasRoutes = require("./routes/categoriaRoutes");
const pedidosRoutes = require("./routes/pedidoRoutes");
const productosRoutes = require("./routes/productoRoutes");
const preguntasRoutes = require("./routes/preguntaRoutes");
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
// Configurar el middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

//---- Definir rutas ----
app.use("/categoria/", categoriasRoutes);
app.use("/pedido/", pedidosRoutes);
app.use("/producto/", productosRoutes);
app.use("/pregunta/", preguntasRoutes);
app.use("/rol/", rolRoutes);
app.use("/usuario/", usuariosRoutes);

// Servidor
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log("Presione CTRL-C para deternerlo\n");
});