const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const rolController = require("../controllers/rolController");

// Rutas de roles
// locahost:3000/rol/
router.get("/", rolController.get);
router.get("/:id", rolController.getById);

module.exports = router;
