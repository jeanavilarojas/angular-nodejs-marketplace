const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const metodoPagoController = require("../controllers/metodoPagoController");

// Rutas de métodos de pago
// locahost:3000/metodoPago/
router.get("/", metodoPagoController.get);
router.get("/:id", metodoPagoController.getById);

module.exports = router;
