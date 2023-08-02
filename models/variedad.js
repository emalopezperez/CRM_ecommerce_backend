var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariedadSchema = Schema({
    proveedor: { type: String, required: false },
    variedad: { type: String, required: false },
    sku: { type: String, required: false },
    stock: { type: Number, default: 0, required: false },
    producto: { type: Schema.ObjectId, ref: 'producto', required: false },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('variedad', VariedadSchema);