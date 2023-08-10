const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener métodos de pago
module.exports.get = async (request, response, next) => {
  const metodosPago = await prisma.metodoPago.findMany({
    include: { usuario: true },
  });
  response.json(metodosPago);
};

// Obtener método de pago por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const metodoPago = await prisma.metodoPago.findUnique({
    where: { id: id },
    include: { usuario: true },
  });
  response.json(metodoPago);
};

// Obtener método de pago por Id de usuario
module.exports.getByUsuario = async (request, response, next) => {
  let usuarioId = parseInt(request.params.usuarioId);
  const metodosPago = await prisma.metodoPago.findMany({
    where: { usuarioId: usuarioId },
    include: { usuario: true },
  });
  response.json(metodosPago);
};

// Crear un método de pago
module.exports.create = async (request, response, next) => {
  try {
    let metodoPago = request.body;
    const createMetodoPago = await prisma.metodoPago.create({
      data: {
        tipoPago: metodoPago.tipoPago,
        proveedor: metodoPago.proveedor,
        numeroCuenta: metodoPago.numeroCuenta,
        fechaExpiracion: metodoPago.fechaExpiracion,
        usuarioId: metodoPago.usuarioId,
      },
    });
    response.json(createMetodoPago);
  } catch (error) {
    next(error);
  }
};

// Actualizar un método de pago
module.exports.update = async (request, response, next) => {
  try {
    let metodoPago = request.body;
    let metodoPagoId = parseInt(request.body.id);
    const updateMetodoPago = await prisma.metodoPago.update({
      where: { id: metodoPagoId },
      data: {
        tipoPago: metodoPago.tipoPago,
        proveedor: metodoPago.proveedor,
        numeroCuenta: metodoPago.numeroCuenta,
        fechaExpiracion: metodoPago.fechaExpiracion,
        usuarioId: metodoPago.usuarioId,
      },
    });
    response.json(updateMetodoPago);
  } catch (error) {
    next(error);
  }
};
