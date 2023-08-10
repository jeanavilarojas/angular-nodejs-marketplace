const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");

// Controlador con las acciones de las rutas
const productoController = require("../controllers/productoController");

// Rutas de productos
// locahost:3000/producto/
router.get("/", productoController.get);
router.get("/:id", productoController.getById);
router.get("/vendedor/:vendedorId", productoController.getByVendedor);
router.post("/", upload.array("fotos", 5), productoController.create);
router.put("/:id", upload.array("fotos", 5), productoController.update);

module.exports = router;
