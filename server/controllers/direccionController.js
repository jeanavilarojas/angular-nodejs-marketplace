const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener direcciones
module.exports.get = async (request, response, next) => {
  const direcciones = await prisma.direccion.findMany({
    include: { usuario: true },
  });
  response.json(direcciones);
};

// Obtener dirección por Id
module.exports.getById = async (request, response, next) => {
  let direccionId = parseInt(request.params.id);
  const direccion = await prisma.direccion.findUnique({
    where: { id: direccionId },
    include: { usuario: true },
  });
  response.json(direccion);
};

// Obtener dirección por Id de usuario
module.exports.getByUsuario = async (request, response, next) => {
  let usuarioId = parseInt(request.params.usuarioId);
  const direcciones = await prisma.direccion.findMany({
    where: { usuarioId: usuarioId },
    include: { usuario: true },
  });
  response.json(direcciones);
};

// Crear una dirección
module.exports.create = async (request, response, next) => {
  try {
    let direccion = request.body;
    const createDireccion = await prisma.direccion.create({
      data: {
        provincia: direccion.provincia,
        canton: direccion.canton,
        distrito: direccion.distrito,
        direccionExacta: direccion.direccionExacta,
        codigoPostal: direccion.codigoPostal,
        telefono: direccion.telefono,
        usuarioId: direccion.usuarioId,
      },
    });
    response.json(createDireccion);
  } catch (error) {
    next(error);
  }
};

// Actualizar una dirección
module.exports.update = async (request, response, next) => {
  try {
    let direccion = request.body;
    let direccionId = parseInt(request.body.id);
    const updateProducto = await prisma.direccion.update({
      where: { id: direccionId },
      data: {
        provincia: direccion.provincia,
        canton: direccion.canton,
        distrito: direccion.distrito,
        direccionExacta: direccion.direccionExacta,
        codigoPostal: direccion.codigoPostal,
        telefono: direccion.telefono,
        usuarioId: direccion.usuarioId,
      },
    });
    response.json(updateProducto);
  } catch (error) {
    next(error);
  }
};
