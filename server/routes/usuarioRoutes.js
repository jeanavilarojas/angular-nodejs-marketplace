const express = require("express");
const router = express.Router();

// Controlador con las acciones de las rutas
const usuarioController = require("../controllers/usuarioController");

// Rutas de usuarios
// locahost:3000/usuario/
router.get("/", usuarioController.get);
router.get("/:id", usuarioController.getById);
router.post("/register", usuarioController.register);
router.put("/:id",usuarioController.update);
router.post("/login", usuarioController.login);

module.exports = router;
