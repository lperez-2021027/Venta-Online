const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {

    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const getUsuarioByID = async (req = request, res = response) => {

    const { id } = req.params;

    const listaUsuarios = await Promise.all([
        Usuario.findById(id)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;

    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });
}

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const idJwt = req.usuario._id;

    const vieneRol = req.body.rol;

    const rolUserParam = await Usuario.findOne({ _id: id }, { rol: 1, _id: 0 });
    const rolUserJwt = await Usuario.findOne({ _id: idJwt }, { rol: 1, _id: 0 });

    if (rolUserJwt.rol === "ADMIN_ROLE" && rolUserParam.rol === "ADMIN_ROLE" && idJwt != id) {
        return res.status(401).json({
            msg: 'No es posible modificar otro administrador'
        })
    }

    if (vieneRol && rolUserJwt.rol === "USER_ROLE") {
        return res.status(401).json({
            msg: 'El rol no puede ser modificado / No cuenta con la autorización'
        })
    }

    if (rolUserJwt.rol === "USER_ROLE" && rolUserParam.rol === "ADMIN_ROLE") {
        return res.status(401).json({
            msg: 'No es posible modificar a un administrador'
        })
    }

    if (rolUserJwt.rol === "USER_ROLE" && idJwt != id) {
        return res.status(401).json({
            msg: 'No es posible modificar a otro usuario'
        })
    }

    const { _id, estado, google, ...resto } = req.body;

    if (resto.password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: 'Put Apit- Editar Usuario',
        usuarioEditado
        , rolUserParam,
        rolUserJwt
    })
}

const deleteUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const idJwt = req.usuario._id;

    const rolUserParam = await Usuario.findOne({ _id: id }, { rol: 1, _id: 0 });
    const rolUserJwt = await Usuario.findOne({ _id: idJwt }, { rol: 1, _id: 0 });

    if (rolUserJwt.rol === "ADMIN_ROLE" && rolUserParam.rol === "ADMIN_ROLE" && idJwt != id) {
        return res.status(401).json({
            msg: 'No es posible eliminar a otro administrador'
        })
    }

    if (rolUserJwt.rol === "USER_ROLE" && rolUserParam.rol === "ADMIN_ROLE") {
        return res.status(401).json({
            msg: 'No es posible eliminar a un administrador'
        })
    }

    if (rolUserJwt.rol === "USER_ROLE" && idJwt != id) {
        return res.status(401).json({
            msg: 'No es posible eliminar a otro usuario'
        })
    }
    
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    //const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: "Delete Api - Eliminar Usuario",
        usuarioEliminado
    })

}

module.exports = {
    getUsuarios,
    getUsuarioByID,
    postUsuario,
    putUsuario,
    deleteUsuario
}