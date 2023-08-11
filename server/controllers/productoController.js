const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("../middleware/multerConfig");

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
  try {
    let producto = request.body;
    const imagenes = request.files;
    const createProducto = await prisma.producto.create({
      data: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: parseFloat(producto.precio),
        cantidad: parseInt(producto.cantidad),
        estado: producto.estado,
        vendedorId: producto.vendedorId,
        categorias: {
          connect: producto.categorias.map((categoria) => ({ id: categoria })),
        },
      },
    });
    // Guardar imágenes y crear registros de fotos
    if (imagenes && imagenes.length > 0) {
      const imagenesData = imagenes.map((url) => ({
        url: "http://localhost:3000/" + url.destination + "/" + url.filename,
        productoId: createProducto.id,
      }));
      await prisma.foto.createMany({
        data: imagenesData,
      });
    }
    response.json(createProducto);
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto
module.exports.update = async (request, response, next) => {
  try {
    let producto = request.body;
    let productoId = parseInt(request.params.id);
    const imagenes = request.files;
    // Obtener el producto actual
    const productoActual = await prisma.producto.findUnique({
      where: { id: productoId },
      include: {
        categorias: {
          select: {
            id: true,
          },
        },
      },
    });
    const desconectarCategorias = productoActual.categorias.map(
      (categoria) => ({
        id: categoria.id,
      })
    );
    const conectarCategorias = producto.categorias.map((categoriaId) => ({
      id: categoriaId,
    }));
    // Actualizar el producto actual
    const updateProducto = await prisma.producto.update({
      where: { id: productoId },
      data: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: parseFloat(producto.precio),
        cantidad: parseInt(producto.cantidad),
        estado: producto.estado,
        categorias: {
          disconnect: desconectarCategorias,
          connect: conectarCategorias,
        },
        include: { foto: true },
      },
    });
    // Guardar imágenes y crear registros de fotos
    if (imagenes && imagenes.length > 0) {
      const imagenesData = imagenes.map((url) => ({
        url: "http://localhost:3000/" + url.destination + "/" + url.filename,
        productoId: updateProducto.id,
      }));
      await prisma.foto.createMany({
        data: imagenesData,
      });
    }
    response.json(updateProducto);
  } catch (error) {
    next(error);
  }
};
