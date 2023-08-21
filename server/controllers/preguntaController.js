const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener preguntas
module.exports.get = async (request, response, next) => {
  const preguntas = await prisma.pregunta.findMany({
    include: { cliente: true, respuestas: true },
  });
  response.json(preguntas);
};

// Obtener pregunta por Id
module.exports.getById = async (request, response, next) => {
  let preguntaId = parseInt(request.params.id);
  const pregunta = await prisma.pregunta.findUnique({
    where: { id: preguntaId },
    include: { cliente: true, respuestas: true },
  });
  response.json(pregunta);
};

// Obtener pregunta por ID del producto
module.exports.getPreguntaProducto = async (request, response, next) => {
  let productoId = parseInt(request.params.id);
  const preguntas = await prisma.pregunta.findMany({
    where: { productoId: productoId },
    include: { cliente: true, respuesta: true },
  });
  response.json(preguntas);
};

// Crear una pregunta
module.exports.create = async (request, response, next) => {
  try {
    const pregunta = request.body;
    const createPregunta = await prisma.pregunta.create({
      data: {
        descripcion: pregunta.Pregunta,
        productoId: pregunta.productoId,
        clienteId: pregunta.clienteId,
      },
    });
    response.json(createPregunta);
  } catch (error) {
    next(error);
  }
};
