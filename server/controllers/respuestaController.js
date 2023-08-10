const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener respuestas
module.exports.get = async (request, response, next) => {
  const respuestas = await prisma.respuesta.findMany({
    include: { pregunta: true, vendedor: true },
  });
  response.json(respuestas);
};

// Obtener respuesta por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const respuesta = await prisma.respuesta.findUnique({
    where: { id: id },
    include: { pregunta: true, vendedor: true },
  });
  response.json(respuesta);
};
