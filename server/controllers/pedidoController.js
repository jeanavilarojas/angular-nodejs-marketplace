const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener pedidos
module.exports.get = async (request, response, next) => {
  const pedidos = await prisma.pedido.findMany({
    include: { usuario: true },
  });
  response.json(pedidos);
};

// Obtener pedido por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const pedido = await prisma.pedido.findUnique({
    where: { id: id },
    include: {
      usuario: true,
      productos: {
        select: {
          cantidad: true,
          subtotal: true,
          total: true,
          producto: true,
        },
      },
    },
  });
  response.json(pedido);
};

// Obtener pedidos por Id de cliente
module.exports.getByCliente = async (request, response, next) => {
  let clienteId = parseInt(request.params.usuarioId);
  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: clienteId },
    orderBy: {
      fecha: "asc",
    },
    include: {
      usuario: true,
      productos: {
        select: {
          cantidad: true,
          subtotal: true,
          total: true,
          producto: true,
        },
      },
    },
  });
  response.json(pedidos);
};

// Obtener pedidos por Id de vendedor
module.exports.getByVendedor = async (request, response, next) => {
  let vendedorId = parseInt(request.params.vendedorId);
  const pedidos = await prisma.pedido.findMany({
    where: {
      productos: {
        some: {
          producto: {
            vendedorId: vendedorId,
          }
        }
      },
    },
    orderBy: {
      fecha: "asc",
    },
    include: {
      productos: {
        select: {
          cantidad: true,
          subtotal: true,
          total: true,
          producto: true,
        },
      },
    },
  });
  response.json(pedidos);
};

// Crear un pedido
module.exports.create = async (request, response, next) => {};

// Actualizar un pedido
module.exports.update = async (request, response, next) => {};
