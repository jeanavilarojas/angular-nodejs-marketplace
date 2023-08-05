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
  let id = parseInt(request.params.id);
  const usuario = await prisma.usuario.findUnique({
    where: { id: id },
    include: { roles: true },
  });
  response.json(usuario);
};

// Crear un usuario
module.exports.register = async (request, response, next) => {
  const userData = request.body;
  const rolesId = usuario.roles.map((rol) => ({
    id: rol,
  }));
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(userData.contrasenna, salt);
  const user = await prisma.usuario.create({
    data: {
      nombre: userData.nombre,
      apellidos: userData.apellidos,
      identificacion: userData.identificacion,
      telefono: userData.telefono,
      correo: userData.correo,
      contrasenna: hash,
      roles: {
        connect: rolesId,
      },
    },
  });
  response.status(200).json({
    status: true,
    message: "Usuario registrado satisfactoriamente",
    data: user,
  });
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
  let userReq = request.body;
  console.log(userReq);
  // Buscar el usuario según el correo dado
  const user = await prisma.usuario.findUnique({
    where: { correo: userReq.correo },
  });
  // Por si no lo encuentra según su correo
  if (!user) {
    response.status(401).send({
      success: false,
      message: "Usuario ingresado no existe",
    });
  }
  // Verificar la contraseña
  const checkPassword = bcrypt.compareSync(
    userReq.contrasenna,
    user.contrasenna
  );
  if (checkPassword) {
    // Si el usuario es correcto: correo y contraseña
    // Crear el token
    const payload = {
      correo: user.correo,
      roles: user.roles,
    };
    // Crea el token con el payload y el tiempo de expiración
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    response.json({
      success: true,
      message: "Usuario registrado satisfactoriamente",
      data: {
        user,
        token,
      },
    });
  } else {
    response.status(401).send({
      success: false,
      message: "Contraseña incorrecta",
    });
  }
};
