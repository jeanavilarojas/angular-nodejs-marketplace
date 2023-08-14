const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener categorias
module.exports.get = async (request, response, next) => {
  const categorias = await prisma.categoria.findMany();
  response.json(categorias);
};

// Obtener categoria por Id
module.exports.getById = async (request, response, next) => {
  let categoriaId = parseInt(request.params.id);
  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
  });
  response.json(categoria);
};
