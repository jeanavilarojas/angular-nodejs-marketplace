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
  await prisma.usuario.create({
    // Instancia de usuario 1
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
            fechaExpiracion: "05/28",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  await prisma.usuario.create({
    // Instancia de usuario 2
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
            fechaExpiracion: "09/25",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  await prisma.usuario.create({
    // Instancia de usuario 3
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
            numeroCuenta: "323-690-683-147-159",
            fechaExpiracion: "11/25",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  await prisma.usuario.create({
    // Instancia de usuario 4
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
            fechaExpiracion: "12/25",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  await prisma.usuario.create({
    // Instancia de usuario 5
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
            fechaExpiracion: "03/25",
          },
        ],
      },
    },
    include: { roles: true, }
  });

  // Productos
  await prisma.producto.create({
    // Instancia de producto 1
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

  await prisma.producto.create({
    // Instancia de producto 2
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

  await prisma.producto.create({
    // Instancia de producto 3
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

  await prisma.producto.create({
    // Instancia de producto 4
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

  await prisma.producto.create({
    // Instancia de producto 5
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

  await prisma.producto.create({
    // Instancia de producto 6
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
  await prisma.pregunta.create({
    // Instancia de la pregunta 1
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

  await prisma.pregunta.create({
    // Instancia de la pregunta 2
    data: {
      descripcion: "¿Cuántos colores tienen disponibles?",
      producto: {
        connect: { id: 1 },
      },
      cliente: {
        connect: { id: 5 },
      },
    },
    include: { respuestas: true },
  });

  await prisma.pregunta.create({
    // Instancia de la pregunta 3
    data: {
      descripcion: "¿Cuál es el tiempo estimado de entrega?",
      producto: {
        connect: { id: 5 },
      },
      cliente: {
        connect: { id: 5 },
      },
    },
    include: { respuestas: true },
  });

  // Respuestas
  await prisma.respuesta.create({
    // Instancia de la respuesta 1
    data: {
      descripcion: "Sí, el producto tiene 1 mes de garantía",
      pregunta: {
        connect: { id: 1 },
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  await prisma.respuesta.create({
    // Instancia de la respuesta 2
    data: {
      descripcion: "Contamos con 20 colores diferentes",
      pregunta: {
        connect: { id: 2 },
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  await prisma.respuesta.create({
    // Instancia de la respuesta 3
    data: {
      descripcion: "Normalmente entre 24-48 horas hábiles",
      pregunta: {
        connect: { id: 3 },
      },
      vendedor: {
        connect: { id: 2 },
      },
    },
  });

  // Pedido
  await prisma.pedido.create({
    // Instancia de pedido 1
    data: {
      total: 4250,
      estado: "Finalizado",
      usuario: {
        connect: { id: 4 }, // ID del usuario asociado
      },
      productos: {
        createMany: {
          data: [{ cantidad: 1, subtotal: 4000, total: 4520, productoId: 1 }],
        },
      },
    },
    include: { productos: true },
  });

  await prisma.pedido.create({
    // Instancia de pedido 2
    data: {
      total: 20340,
      estado: "Pendiente",
      usuario: {
        connect: { id: 4 }, // ID del usuario asociado
      },
      productos: {
        createMany: {
          data: [
            { cantidad: 1, subtotal: 6000, total: 6780, productoId: 2 }, // ID del primer producto asociado
            { cantidad: 1, subtotal: 12000, total: 13560, productoId: 6 }, // ID del segundo producto asociado
          ],
        },
      },
    },
    include: { productos: true },
  });

  await prisma.pedido.create({
    // Instancia de pedido 3
    data: {
      total: 9900,
      estado: "Finalizado",
      usuario: {
        connect: { id: 4 }, // ID del usuario asociado
      },
      productos: {
        createMany: {
          data: [
            { cantidad: 1, subtotal: 4000, total: 4520, productoId: 1 }, // ID del primer producto asociado
            { cantidad: 1, subtotal: 5000, total: 5650, productoId: 4 }, // ID del segundo producto asociado
          ],
        },
      },
    },
    include: { productos: true },
  });

  await prisma.pedido.create({
    // Instancia de pedido 4
    data: {
      total: 11300,
      estado: "Pendiente",
      usuario: {
        connect: { id: 5 }, // ID del usuario asociado
      },
      productos: {
        createMany: {
          data: [{ cantidad: 1, subtotal: 10000, total: 11300, productoId: 5 }],
        },
      },
    },
    include: { productos: true },
  });

  await prisma.pedido.create({
    // Instancia de pedido 5
    data: {
      total: 15820,
      estado: "Finalizado",
      usuario: {
        connect: { id: 5 }, // ID del usuario asociado
      },
      productos: {
        createMany: {
          data: [
            { cantidad: 1, subtotal: 6000, total: 6780, productoId: 2 }, // ID del primer producto asociado
            { cantidad: 1, subtotal: 8000, total: 9040, productoId: 3 }, // ID del segundo producto asociado
          ],
        },
      },
    },
    include: { productos: true },
  });

  await prisma.pedido.create({
    // Instancia de pedido 6
    data: {
      total: 23730,
      estado: "Pendiente",
      usuario: {
        connect: { id: 5 }, // ID del usuario asociado
      },
      productos: {
        createMany: {
          data: [
            { cantidad: 1, subtotal: 6000, total: 6780, productoId: 2 }, // ID del primer producto asociado
            { cantidad: 1, subtotal: 5000, total: 5650, productoId: 4 }, // ID del segundo producto asociado
            { cantidad: 1, subtotal: 10000, total: 11300, productoId: 5 }, // ID del tercer producto asociado
          ],
        },
      },
    },
    include: { productos: true },
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
