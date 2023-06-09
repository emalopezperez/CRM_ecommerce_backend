var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: { type: String, required: false },
    slug: { type: String, required: false },
    contenido: { type: String, required: false },
    categoria: { type: String, required: false },
    precio: { type: Number, required: false },
    descripcion: { type: String, required: false },
    stock: { type: Number, default: 0, required: false },
    portada: { type: String, required: false },
    str_variedad: { type: String, required: false },
    estado: { type: Boolean, required: false },
    descuento: { type: Boolean, required: false },
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('producto', ProductoSchema);
