const {request, response} = require('express');

// Verificando si es admin
const esAdminRole = (req = request, res = response, next) => {

    // Si no viene el usuario (token)
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token primero'
        })
    }

    // Verificar que el rol sea ROLE_ADMIN.
    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(500).json({
            msg: `${nombre} no es Administrador - No tiene acceso a esta funcion`
        })
    }

    next();

}


// Operador rest u operador spread
const tieneRole = (...roles) => {

    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'No'
            })
        }

        next();

    }

}

module.exports = {
    tieneRole,
    esAdminRole
}