const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const metodoPagoController = require("../controllers/metodoPagoController");

// Rutas de métodos de pago
// locahost:3000/metodoPago/
router.get("/", metodoPagoController.get);
router.get("/:id", metodoPagoController.getById);
router.get("/usuario/:usuarioId", metodoPagoController.getByUsuario);
router.post("/", metodoPagoController.create);
router.put("/:id", metodoPagoController.update);

module.exports = router;
