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
  let pedidoId = parseInt(request.params.id);
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      usuario: true,
      direccion: true,
      metodoPago: true,
      compras: {
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
    orderBy: { fecha: "asc" },
    include: {
      usuario: true,
      direccion: true,
      metodoPago: true,
      compras: {
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
      compras: {
        some: {
          producto: {
            vendedorId: vendedorId,
          },
        },
      },
    },
    orderBy: { fecha: "asc" },
    include: {
      usuario: true,
      direccion: true,
      metodoPago: true,
      compras: {
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
module.exports.create = async (request, response, next) => {
  let pedido = request.body;
  try {
    const pedidoCreado = await prisma.pedido.create({
      data: {
        total: pedido.total,
        usuarioId: pedido.usuarioId,
        direccionId: pedido.direccionId,
        metodoPagoId: pedido.metodoPagoId,
        compras: {
          create: pedido.compras,
        },
      },
    });

    // Lógica para actualizar la cantidad disponible de productos
    for (const compra of pedido.compras) {
      const productoId = compra.productoId;
      const cantidadComprada = compra.cantidad;
      const producto = await prisma.producto.findUnique({
        where: { id: productoId },
      });
      if (producto) {
        const nuevaCantidad = producto.cantidad - cantidadComprada;
        await prisma.producto.update({
          where: { id: productoId },
          data: { cantidad: nuevaCantidad },
        });
      }
    }
    response.json(pedidoCreado);
  } catch (error) {
    next(error);
  }
};

// Actualizar un pedido
module.exports.update = async (request, response, next) => {};

// Cambiar estado del pedido
module.exports.updateStatus = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const pedidoActual = await prisma.pedido.findUnique({
    where: { id: id },
  });
  try {
    const updatedPedido = await prisma.pedido.update({
      where: { id: id },
      data: { estado: pedidoActual.estado ? true : false },
    });
    response.json(updatedPedido);
  } catch (error) {
    next(error);
  }
};
