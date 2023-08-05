import fs from "fs";

export const fotos = [
    // Imagen del producto 1
    {
        url: Buffer.from(fs.readFileSync("images/cuello-redondo.jpg")).toString("base64"),
        productoId: 1,
    },
    // Imagen del producto 2
    {
        url: Buffer.from(fs.readFileSync("images/tipo-polo.jpg")).toString("base64"),
        productoId: 2,
    },
    // Imagen del producto 3
    {
        url: Buffer.from(fs.readFileSync("images/tipo-dry-fit.jpg")).toString("base64"),
        productoId: 3,
    },
    // Imagen del producto 4
    {
        url: Buffer.from(fs.readFileSync("images/gorra-dry-fit.jpg")).toString("base64"),
        productoId: 4,
    },
    // Imagen del producto 5
    {
        url: Buffer.from(fs.readFileSync("images/manga-larga.jpg")).toString("base64"),
        productoId: 5,
    },
    // Imagen del producto 6
    {
        url: Buffer.from(fs.readFileSync("images/estilo-columbia.jpg")).toString("base64"),
        productoId: 6,
    },
];
