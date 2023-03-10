const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
        //,required: true
    },
    productos: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            cantidad: {
                type: Number,
                //required: true
                default: 1
            }
        }
    ],
    total: {
        type: Number
        //, required: true
    }
});

module.exports = model('Carrito', CarritoSchema);