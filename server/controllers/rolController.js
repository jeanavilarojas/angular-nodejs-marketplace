const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener roles
module.exports.get = async (request, response, next) => {
  const roles = await prisma.rol.findMany();
  response.json(roles);
};

// Obtener rol por Id
module.exports.getById = async (request, response, next) => {
  let rolId = parseInt(request.params.id);
  const rol = await prisma.rol.findUnique({
    where: { id: rolId },
  });
  response.json(rol);
};
