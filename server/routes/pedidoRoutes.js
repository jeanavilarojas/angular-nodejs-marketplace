const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const pedidoController = require("../controllers/pedidoController");

// Rutas de pedidos
// locahost:3000/pedido/
router.get("/", pedidoController.get);
router.get("/:id", pedidoController.getById);
router.get("/cliente/:usuarioId", pedidoController.getByCliente);
router.get("/vendedor/:vendedorId", pedidoController.getByVendedor);

module.exports = router;
