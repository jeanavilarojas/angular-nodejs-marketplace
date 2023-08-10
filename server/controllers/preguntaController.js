const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener preguntas
module.exports.get = async (request, response, next) => {
  const preguntas = await prisma.pregunta.findMany({
    include: { respuestas: true, cliente: true },
  });
  response.json(preguntas);
};

// Obtener pregunta por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const pregunta = await prisma.pregunta.findUnique({
    where: { id: id },
    include: { respuestas: true, cliente: true },
  });
  response.json(pregunta);
};
