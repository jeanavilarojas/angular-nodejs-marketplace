const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const preguntaController = require("../controllers/preguntaController");

// Rutas de preguntas
// locahost:3000/pregunta/
router.get("/", preguntaController.get);
router.get("/:id", preguntaController.getById);
router.post("/pregunta/:id", preguntaController.create);

module.exports = router;
