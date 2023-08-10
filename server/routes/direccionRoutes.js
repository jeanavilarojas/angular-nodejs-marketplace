const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const direccionController = require("../controllers/direccionController");

// Rutas de direcciones
// locahost:3000/direccion/
router.get("/", direccionController.get);
router.get("/:id", direccionController.getById);

module.exports = router;
