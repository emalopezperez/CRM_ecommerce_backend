var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    contenido: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    portada: { type: String, required: true },
    str_variedad: { type: String, required: true },
    estado: { type: Boolean, required: true },
    descuento: { type: Boolean, required: false },
    updatedAt: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('producto', ProductoSchema);
