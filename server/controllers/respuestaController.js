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

// Crear una respuesta
module.exports.create = async (request, response, next) => {
  try {
    const respuesta = request.body;
    const pregunta = await prisma.pregunta.findUnique({
      where: { id: respuesta.preguntaId },
      select: { productoId: true },
    });
    if (!pregunta) {
      return response.status(404).json({ error: "Pregunta no encontrada" });
    }
    const createRespuesta = await prisma.respuesta.create({
      data: {
        descripcion: respuesta.descripcion,
        pregunta: { connect: { id: respuesta.preguntaId } },
        vendedorId: respuesta.vendedorId,
      },
    });
    response.json(createRespuesta);
  } catch (error) {
    next(error);
  }
};
