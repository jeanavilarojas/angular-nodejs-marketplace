const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const respuestaController = require("../controllers/respuestaController");

// Rutas de respuestas
// locahost:3000/respuesta/
router.get("/", respuestaController.get);
router.get("/:id", respuestaController.getById);
router.get("/pregunta/:id", respuestaController.getByPreguntaId);
router.post("/", respuestaController.create);

module.exports = router;
