const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener métodos de pago
module.exports.get = async (request, response, next) => {
  const metodosPago = await prisma.metodoPago.findMany();
  response.json(metodosPago);
};

// Obtener método de pago por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const metodoPago = await prisma.metodoPago.findUnique({
    where: { id: id },
  });
  response.json(metodoPago);
};
