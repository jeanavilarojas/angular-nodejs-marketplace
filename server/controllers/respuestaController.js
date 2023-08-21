const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener respuestas
module.exports.get = async (request, response, next) => {
  const respuestas = await prisma.respuesta.findMany({
    include: { vendedor: true, pregunta: true },
  });
  response.json(respuestas);
};

// Obtener respuesta por Id
module.exports.getById = async (request, response, next) => {
  let respuestaId = parseInt(request.params.id);
  const respuesta = await prisma.respuesta.findUnique({
    where: { id: respuestaId },
    include: { vendedor: true, pregunta: true },
  });
  response.json(respuesta);
};

// Obtener respuesta por ID de la pregunta
module.exports.getRespuestaPregunta = async (request, response, next) => {
  let preguntaId = parseInt(request.params.id);
  const respuestas = await prisma.respuesta.findMany({
    where: { preguntaId: preguntaId },
    include: { vendedor: true, pregunta: true },
  });
  response.json(respuestas);
};

// Crear una respuesta
module.exports.create = async (request, response, next) => {
  try {
    const respuesta = request.body;
    const createRespuesta = await prisma.respuesta.create({
      data: {
        descripcion: respuesta.descripcion,
        pregunta: { connect: { id: respuesta.preguntaId } },
        vendedorId: respuesta.vendedorId,
      },
      include: { vendedor: true, pregunta: true },
    });
    response.json(createRespuesta);
  } catch (error) {
    next(error);
  }
};
