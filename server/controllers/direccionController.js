const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener direcciones
module.exports.get = async (request, response, next) => {
  const direcciones = await prisma.direccion.findMany();
  response.json(direcciones);
};

// Obtener dirección por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const direccion = await prisma.direccion.findUnique({
    where: { id: id },
  });
  response.json(direccion);
};
