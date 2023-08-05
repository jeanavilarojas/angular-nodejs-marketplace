const express = require("express");
const router = express.Router();

//Controlador con las acciones de las rutas
const categoriaController = require("../controllers/categoriaController");

//Rutas de categorias
//locahost:3000/categoria/
router.get("/", categoriaController.get);
router.get("/:id", categoriaController.getById);

module.exports = router;
