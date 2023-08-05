const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener productos
module.exports.get = async (request, response, next) => {
  const productos = await prisma.producto.findMany({
    include: {
      categorias: true,
      fotos: true,
      preguntas: {
        include: {
          cliente: true,
          respuestas: {
            include: {
              vendedor: true, // Incluimos al vendedor asociado a la respuesta
            },
          },
        },
      },
    },
  });
  response.json(productos);
};

// Obtener producto por Id
module.exports.getById = async (request, response, next) => {
  let id = parseInt(request.params.id);
  const producto = await prisma.producto.findUnique({
    where: { id: id },
    include: {
      categorias: true,
      fotos: true,
      preguntas: {
        include: {
          cliente: true,
          respuestas: {
            include: {
              vendedor: true, // Incluimos al vendedor asociado a la respuesta
            },
          },
        },
      },
    },
  });
  response.json(producto);
};

// Obtener productos por Id de vendedor
module.exports.getByVendedor = async (request, response, next) => {
  let vendedorId = parseInt(request.params.vendedorId);
  const productos = await prisma.producto.findMany({
    where: { vendedorId: vendedorId },
    include: {
      categorias: true,
      fotos: true,
      preguntas: {
        include: {
          cliente: true,
          respuestas: {
            include: {
              vendedor: true, // Incluimos al vendedor asociado a la respuesta
            },
          },
        },
      },
    },
  });
  response.json(productos);
};

// Crear un producto
module.exports.create = async (request, response, next) => {
  let producto = request.body;
  const categoriasIds = producto.categorias.map((categoria) => ({
    id: categoria,
  }));
  const newProducto = await prisma.producto.create({
    data: {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: parseFloat(producto.precio),
      estado: producto.estado,
      fotos: producto.fotos,
      cantidad: parseInt(producto.cantidad),
      categorias: {
        connect: categoriasIds,
      },
      vendedor: {
        connect: {
          id: 2,
        },
      },
    },
  });
  response.json(newProducto);
};

// Actualizar un producto
module.exports.update = async (request, response, next) => {
  let producto = request.body;
  let idProducto = parseInt(request.params.id);
  //Obtener producto viejo
  const productoViejo = await prisma.producto.findUnique({
    where: { id: idProducto },
    include: {
      categorias: {
        select: {
          id: true,
        },
      },
    },
  });

  const categoriasADesconectar = productoViejo.categorias.map((categoria) => ({
    id: categoria.id,
  }));
  const categoriasAConectar = producto.categorias.map((categoriaId) => ({
    id: categoriaId,
  }));

  const newProducto = await prisma.producto.update({
    where: {
      id: idProducto,
    },
    data: {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: parseFloat(producto.precio),
      estado: producto.estado,
      foto: producto.foto,
      cantidad: parseInt(producto.cantidad),
      categorias: {
        disconnect: categoriasADesconectar,
        connect: categoriasAConectar,
      },
    },
  });
  response.json(newProducto);
};
