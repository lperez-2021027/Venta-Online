const {Schema, model} = require('mongoose');

const FacturaSchema = Schema({
    numero_factura: {
        type: String,
        required: true
    },
    producto: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],
    precio_producto: {
        type: Number,
        required: [true, 'El valor del producto es obligatorio']
    }
    ,
    total: {
        type: Number,
        required: [true, 'El valor total de la compra es obligatorio']
    }
});

module.exports = model('Factura', FacturaSchema);