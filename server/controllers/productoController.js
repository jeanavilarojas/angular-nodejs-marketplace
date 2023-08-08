const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener productos
module.exports.get = async (request, response, next) => {
  const productos = await prisma.producto.findMany({
    include: {
      categorias: true,
      fotos: true,
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
              vendedor: true,
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
    },
  });
  response.json(productos);
};

// Crear un producto
module.exports.create = async (request, response, next) => {
  let producto = request.body;
  const categoriasId = producto.categorias.map((categoria) => ({
    id: categoria,
  }));
  const newProducto = await prisma.producto.create({
    data: {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: parseFloat(producto.precio),
      cantidad: parseInt(producto.cantidad),
      estado: producto.estado,
      categorias: {
        connect: categoriasId,
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  // Guardar imágenes y crear registros de fotos
  const fotos = request.files['fotos']; // Asumiendo que estás usando una librería para manejar archivos, como 'multer'
    
  for (let i = 0; i < fotos.length; i++) {
    await prisma.foto.create({
      data: {
        productoId: newProducto.id,
        url: fotos[i].path, // Asumiendo que `fotos[i].path` contiene la ruta al archivo de imagen
      },
    });
  }
  response.json(newProducto);
};

// Actualizar un producto
module.exports.update = async (request, response, next) => {
  let producto = request.body;
  let idProducto = parseInt(request.params.id);
  // Obtener producto viejo
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
      cantidad: parseInt(producto.cantidad),
      estado: producto.estado,
      categorias: {
        disconnect: categoriasADesconectar,
        connect: categoriasAConectar,
      },
    },
  });
  response.json(newProducto);
};
