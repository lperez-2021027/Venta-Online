const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }

});

// 'Nombre de la coleccion en la db'
module.exports = model('Role', RoleSchema);