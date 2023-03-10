const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
        //,required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    detalles: {
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    }
});

module.exports = model('Factura', FacturaSchema);