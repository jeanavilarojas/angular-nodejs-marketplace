const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Obtener usuarios
module.exports.get = async (request, response, next) => {
  const usuarios = await prisma.usuario.findMany({
    include: { roles: true },
  });
  response.json(usuarios);
};

// Obtener usuario por Id
module.exports.getById = async (request, response, next) => {
  let usuarioId = parseInt(request.params.usuarioId);
  const usuario = await prisma.usuario.findUnique({
    where: { usuarioId: usuarioId },
    include: {
      roles: true,
      direcciones: true,
      metodosPago: true,
    },
  });
  response.json(usuario);
};

// Crear un usuario
module.exports.register = async (request, response, next) => {
  try {
    let usuario = request.body;
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(usuario.contrasenna, salt);
    const createUsuario = await prisma.usuario.create({
      data: {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        identificacion: usuario.identificacion,
        telefono: usuario.telefono,
        correo: usuario.correo,
        contrasenna: hash,
        roles: {
          connect: roles.map((rol) => ({ id: rol })),
        },
      },
    });
    response.json(createUsuario);
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario
module.exports.update = async (request, response, next) => {
  const idUsuario = parseInt(request.params.id);
  const usuarioData = request.body;
  let updateData = {
    nombre: usuarioData.nombre,
    apellidos: usuarioData.apellidos,
    identificacion: usuarioData.identificacion,
    telefono: usuarioData.telefono,
    correo: usuarioData.correo,
  };

  // Verificar si el usuario proporcionó una nueva contraseña
  if (usuarioData.contrasenna) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(usuarioData.contrasenna, saltRounds);
    updateData.contrasenna = hashedPassword;
  }

  try {
    const updatedUsuario = await prisma.usuario.update({
      where: { id: idUsuario },
      data: updateData,
      include: { roles: true },
    });
    response.status(200).json({
      status: true,
      message: "Usuario actualizado correctamente",
      data: updatedUsuario,
    });
  } catch (error) {
    response.status(500).json({
      status: false,
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

// Iniciar sesión
module.exports.login = async (request, response, next) => {
  let solicitud = request.body;
  console.log(solicitud);
  // Buscar el usuario según el correo dado
  const usuario = await prisma.usuario.findUnique({
    where: { correo: solicitud.correo },
    include: { roles: true },
  });
  // Por si no lo encuentra según su correo
  if (!usuario) {
    response.status(401).send({
      success: false,
      message: "El usuario ingresado no existe",
    });
  }
  // Verificar la contraseña
  const verificarContrasenna = bcrypt.compareSync(
    solicitud.contrasenna,
    usuario.contrasenna
  );
  if (verificarContrasenna) {
    // Si el usuario es correcto (correo y contraseña)
    const payload = {
      correo: usuario.correo,
      roles: usuario.roles,
    };
    // Crear el token con el payload y el tiempo de expiración
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    response.json({
      success: true,
      message: "Usuario registrado satisfactoriamente",
      data: { usuario, token },
    });
  } else {
    response.status(401).send({
      success: false,
      message: "Por favor verifique los datos ingresados",
    });
  }
};
