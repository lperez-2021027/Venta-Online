const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const coleccionesPermitidas = [
    'categorias',
    'productos'
];

const buscarProductos = async (termino = '', res = response) => {

    // Buscando termino
    const esMongoID = ObjectId.isValid(termino);

    // validando si fue encontrado el termino
    if (esMongoID) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{ nombre: regex }, { cantidad: { $gt: 0 } },],
        $and: [{ estado: true }]
    });

    res.json({
        results: productos
    })

}

const buscarCategorias = async (termino = '', res = response) => {

    // Buscando termino
    const esMongoID = ObjectId.isValid(termino);

    // validando si fue encontrado el termino
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    }, { usuario: 0, estado: 0, __v: 0 });

    const categoriaId = categoria.map((doc) => doc._id);

    if (categoriaId.length > 0) {
        const idCat = categoriaId[0];

        const query = { categoria: { _id: idCat } }

        const listaProductos = await Producto.find(query);

        res.json({
            results: categoria,
            listaProductos
        })
    }
    
    res.json({
        results: categoria
    })

}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La coleccion ${coleccion} no existe en la DB
                  Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Ups, se me olvido hacer esta busqueda'
            })
            break;
    }
}



module.exports = {
    buscar
}