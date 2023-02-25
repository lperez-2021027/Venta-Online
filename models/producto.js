const { Schema, model} = require('mongoose');

const ProductoSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cantidad: {
        type: Number,
        default: 0,
        required: [true, 'La cantidad es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Producto', ProductoSchema);