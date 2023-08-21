import { PrismaClient } from "@prisma/client";
import { categorias } from "./seeds/categorias";
import { roles } from "./seeds/roles";
const bcrypt = require("bcrypt");
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  // Categorias
  await prisma.categoria.createMany({
    data: categorias,
  });

  // Roles
  await prisma.rol.createMany({
    data: roles,
  });

  // Cifrar la contraseña
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync("123456", saltRounds);

  // Usuarios
  // Instancia del usuario 1
  await prisma.usuario.create({
    data: {
      nombre: "Nathalie",
      apellidos: "Paniagua López",
      identificacion: "113170309",
      telefono: "86632742",
      correo: "paniaguanathalie@bordadoshalom.com",
      contrasenna: hashedPassword,
      estado: true,
      roles: { connect: { id: 1 } },
      direcciones: {
        create: [
          {
            provincia: "Alajuela",
            canton: "Central",
            distrito: "Carrizal",
            direccionExacta: "De Iglesia de Carrizal 500 metros norte",
            codigoPostal: "20103",
            telefono: "86632742",
          },
        ],
      },
      metodosPago: {
        create: [
          {
            tipoPago: "Tarjeta de crédito",
            proveedor: "Visa",
            numeroCuenta: "4611-3114-3565-6339",
            fechaExpiracion: "05/2028",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  // Instancia del usuario 2
  await prisma.usuario.create({
    data: {
      nombre: "Dayana",
      apellidos: "Álvarez Salas",
      identificacion: "208240894",
      telefono: "62716075",
      correo: "alvarezdayana@bordadoshalom.com",
      contrasenna: hashedPassword,
      estado: true,
      roles: { connect: [{ id: 2 }, { id: 3 }] },
      direcciones: {
        create: [
          {
            provincia: "Alajuela",
            canton: "Poás",
            distrito: "Sabana Redonda",
            direccionExacta: "De Iglesia de Sabana Redonda 500 metros sur",
            codigoPostal: "20805",
            telefono: "62716075",
          },
        ],
      },
      metodosPago: {
        create: [
          {
            tipoPago: "Tarjeta de crédito",
            proveedor: "Mastercard",
            numeroCuenta: "5187-1656-8860-4920",
            fechaExpiracion: "09/2025",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  // Instancia del usuario 3
  await prisma.usuario.create({
    data: {
      nombre: "Manuel",
      apellidos: "Álvarez Campos",
      identificacion: "204860873",
      telefono: "62626327",
      correo: "camposmanuel@bordadoshalom.com",
      contrasenna: hashedPassword,
      estado: true,
      roles: { connect: { id: 2 } },
      direcciones: {
        create: [
          {
            provincia: "Alajuela",
            canton: "Poás",
            distrito: "San Juan",
            direccionExacta: "De la Iglesia de San Juan 500 metros este",
            codigoPostal: "20802",
            telefono: "62626333",
          },
        ],
      },
      metodosPago: {
        create: [
          {
            tipoPago: "Tarjeta de crédito",
            proveedor: "American Express",
            numeroCuenta: "3236-9068-3147-1592",
            fechaExpiracion: "11/2025",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  // Instancia del usuario 4
  await prisma.usuario.create({
    data: {
      nombre: "Jean Franco",
      apellidos: "Ávila Rojas",
      identificacion: "208220155",
      telefono: "63283300",
      correo: "avilajeanfranco@bordadoshalom.com",
      contrasenna: hashedPassword,
      estado: true,
      roles: { connect: { id: 3 } },
      direcciones: {
        create: [
          {
            provincia: "Alajuela",
            canton: "Poás",
            distrito: "San Rafael",
            direccionExacta: "De Iglesia de San Rafael 500 metros oeste",
            codigoPostal: "20803",
            telefono: "63283300",
          },
        ],
      },
      metodosPago: {
        create: [
          {
            tipoPago: "Tarjeta de crédito",
            proveedor: "Visa",
            numeroCuenta: "4966-7837-8117-8343",
            fechaExpiracion: "12/2025",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  // Instancia del usuario 5
  await prisma.usuario.create({
    data: {
      nombre: "Kattia",
      apellidos: "Rojas Trejos",
      identificacion: "204530876",
      telefono: "84688669",
      correo: "rojaskattia@bordadoshalom.com",
      contrasenna: hashedPassword,
      estado: true,
      roles: { connect: { id: 3 } },
      direcciones: {
        create: [
          {
            provincia: "Cartago",
            canton: "Paraíso",
            distrito: "Santiago",
            direccionExacta: "De la Iglesia de Santiago 500 metros norte",
            codigoPostal: "30202",
            telefono: "84688669",
          },
        ],
      },
      metodosPago: {
        create: [
          {
            tipoPago: "Tarjeta de crédito",
            proveedor: "Mastercard",
            numeroCuenta: "	5594-3566-7133-4156",
            fechaExpiracion: "03/2025",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  // Productos
  // Instancia del producto 1
  await prisma.producto.create({
    data: {
      nombre: "Camiseta cuello redondo",
      descripcion: "Camiseta cuello redondo",
      precio: 4000,
      cantidad: 10,
      estado: "Nuevo",
      vendedor: { connect: { id: 2 } },
      categorias: { connect: [{ id: 1 }, { id: 5 }] },
      fotos: {
        create: [
          {
            url: Buffer.from(fs.readFileSync('images/cuello-redondo-1.jpg')).toString('base64'),
          },
          {
            url: Buffer.from(fs.readFileSync('images/cuello-redondo-2.jpg')).toString('base64'),
          },
        ],
      },
    },
    include: {
      categorias: true,
      fotos: true,
      preguntas: true,
    },
  });

  // Instancia del producto 2
  await prisma.producto.create({
    data: {
      nombre: "Camisa tipo polo",
      descripcion: "Camisa tipo polo",
      precio: 6000,
      cantidad: 15,
      estado: "Nuevo",
      vendedor: { connect: { id: 3 } },
      categorias: { connect: [{ id: 1 }, { id: 4 }] },
      fotos: {
        create: [
          {
            url: Buffer.from(fs.readFileSync("images/tipo-polo-1.jpg")).toString("base64"),
          },
          {
            url: Buffer.from(fs.readFileSync("images/tipo-polo-2.jpg")).toString("base64"),
          },
        ],
      },
    },
    include: {
      categorias: true,
      fotos: true,
      preguntas: true,
    },
  });

  // Instancia del producto 3
  await prisma.producto.create({
    data: {
      nombre: "Camiseta tipo Dry-Fit",
      descripcion: "Camiseta tipo Dry-Fit",
      precio: 8000,
      cantidad: 10,
      estado: "Nuevo",
      vendedor: { connect: { id: 2 } },
      categorias: { connect: [{ id: 2 }, { id: 4 }] },
      fotos: {
        create: [
          {
            url: Buffer.from(fs.readFileSync("images/tipo-dry-fit-1.jpg")).toString("base64"),
          },
          {
            url: Buffer.from(fs.readFileSync("images/tipo-dry-fit-2.jpg")).toString("base64"),
          },
        ],
      },
    },
    include: {
      categorias: true,
      fotos: true,
      preguntas: true,
    },
  });

  // Instancia del producto 4
  await prisma.producto.create({
    data: {
      nombre: "Gorra tipo Dry-Fit",
      descripcion: "Gorra tipo Dry-Fit",
      precio: 5000,
      cantidad: 10,
      estado: "Nuevo",
      vendedor: { connect: { id: 3 } },
      categorias: { connect: [{ id: 2 }, { id: 4 }, { id: 5 }] },
      fotos: {
        create: [
          {
            url: Buffer.from(fs.readFileSync("images/gorra-dry-fit-1.jpg")).toString("base64"),
          },
          {
            url: Buffer.from(fs.readFileSync("images/gorra-dry-fit-2.jpg")).toString("base64"),
          },
        ],
      },
    },
    include: {
      categorias: true,
      fotos: true,
      preguntas: true,
    },
  });

  // Instancia del producto 5
  await prisma.producto.create({
    data: {
      nombre: "Camisa manga larga",
      descripcion: "Camisa manga larga",
      precio: 10000,
      cantidad: 5,
      estado: "Nuevo",
      vendedor: { connect: { id: 2 } },
      categorias: { connect: [{ id: 3 }, { id: 4 }] },
      fotos: {
        create: [
          {
            url: Buffer.from(fs.readFileSync("images/manga-larga-1.jpg")).toString("base64"),
          },
          {
            url: Buffer.from(fs.readFileSync("images/manga-larga-2.jpg")).toString("base64"),
          },
        ],
      },
    },
    include: {
      categorias: true,
      fotos: true,
      preguntas: true,
    },
  });

  // Instancia del producto 6
  await prisma.producto.create({
    data: {
      nombre: "Camisa estilo Columbia",
      descripcion: "Camisa estilo Columbia",
      precio: 12000,
      cantidad: 15,
      estado: "Nuevo",
      vendedor: { connect: { id: 3 } },
      categorias: { connect: [{ id: 3 }, { id: 5 }] },
      fotos: {
        create: [
          {
            url: Buffer.from(fs.readFileSync("images/estilo-columbia-1.jpg")).toString("base64"),
          },
          {
            url: Buffer.from(fs.readFileSync("images/estilo-columbia-2.jpg")).toString("base64"),
          },
        ],
      },
    },
    include: {
      categorias: true,
      fotos: true,
      preguntas: true,
    },
  });

  // Preguntas
  // Instancia de la pregunta 1
  await prisma.pregunta.create({
    data: {
      descripcion: "¿Este producto tiene garantía?",
      producto: {
        connect: { id: 1 },
      },
      cliente: {
        connect: { id: 4 },
      },
    },
    include: { respuestas: true },
  });

  // Instancia de la pregunta 2
  await prisma.pregunta.create({
    data: {
      descripcion: "¿Cuántos colores tienen disponibles?",
      producto: {
        connect: { id: 2 },
      },
      cliente: {
        connect: { id: 5 },
      },
    },
    include: { respuestas: true },
  });

  // Instancia de la pregunta 3
  await prisma.pregunta.create({
    data: {
      descripcion: "¿Cuál es el tiempo estimado de entrega?",
      producto: {
        connect: { id: 3 },
      },
      cliente: {
        connect: { id: 4 },
      },
    },
    include: { respuestas: true },
  });

  // Instancia de la pregunta 4
  await prisma.pregunta.create({
    data: {
      descripcion: "¿Este producto viene con accesorios adicionales?",
      producto: {
        connect: { id: 4 },
      },
      cliente: {
        connect: { id: 5 },
      },
    },
    include: { respuestas: true },
  });

  // Instancia de la pregunta 5
  await prisma.pregunta.create({
    data: {
      descripcion: "¿Hay descuentos disponibles para este artículo?",
      producto: {
        connect: { id: 5 },
      },
      cliente: {
        connect: { id: 4 },
      },
    },
    include: { respuestas: true },
  });

  // Instancia de la pregunta 6
  await prisma.pregunta.create({
    data: {
      descripcion: "¿Puedo programar la entrega del producto?",
      producto: {
        connect: { id: 6 },
      },
      cliente: {
        connect: { id: 5 },
      },
    },
    include: { respuestas: true },
  });

  // Respuestas
  // Instancia de la respuesta 1
  await prisma.respuesta.create({
    data: {
      descripcion: "Sí, el producto tiene 1 mes de garantía.",
      pregunta: {
        connect: { id: 1 },
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  // Instancia de la respuesta 2
  await prisma.respuesta.create({
    data: {
      descripcion: "Contamos con 20 colores diferentes.",
      pregunta: {
        connect: { id: 2 },
      },
      vendedor: {
        connect: { id: 3 },
      },
    },
  });

  // Instancia de la respuesta 3
  await prisma.respuesta.create({
    data: {
      descripcion: "Normalmente entre 24-48 horas hábiles.",
      pregunta: {
        connect: { id: 3 },
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  // Instancia de la respuesta 4
  await prisma.respuesta.create({
    data: {
      descripcion: "Sí, el producto viene con un set de accesorios adicionales.",
      pregunta: {
        connect: { id: 4 },
      },
      vendedor: {
        connect: { id: 3 },
      },
    },
  });

  // Instancia de la respuesta 5
  await prisma.respuesta.create({
    data: {
      descripcion: "Actualmente no tenemos descuentos disponibles para este artículo.",
      pregunta: {
        connect: { id: 5 },
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  // Instancia de la respuesta 6
  await prisma.respuesta.create({
    data: {
      descripcion: "Sí, ofrecemos la opción de programar la entrega del producto.",
      pregunta: {
        connect: { id: 6 },
      },
      vendedor: {
        connect: { id: 3 },
      },
    },
  });

  // Pedidos
  // Instancia del pedido 1
  await prisma.pedido.create({
    data: {
      total: 4520,
      estado: false,
      usuario: {
        connect: { id: 4 },
      },
      direccion: {
        connect: { id: 4 },
      },
      metodoPago: {
        connect: { id: 4 },
      },
    },
  });

  // Compras
  // Instancia de la compra 1
  await prisma.compra.create({
    data: {
      cantidad: 1,
      subtotal: 4000,
      impuestos: 520,
      total: 4520,
      productoId: 1,
      pedidoId: 1,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
