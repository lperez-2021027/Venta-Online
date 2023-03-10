// Importaciones
// Dependencias
const { response, request } = require('express');
const mongoose = require('mongoose');

// Clases
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const  getCategoriasInfo = async (req = request, res = response) => {

    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'get Api - Get Categoria',
        listaCategorias        
    });
}

const getCategorias = async (req = request, res = response) => {

    const query = { estado: true, nombre: { $ne: 'DEFAULT' }  };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query, { nombre: 1, descripcion: 1, _id: 0})
    ]);

    res.json({
        msg: 'get Api - Get Categoria',
        listaCategorias
    });
}

const postCategoria = async (req = request, res = response) => {
    
    //const { nombre, descripcion } = req.body;
    ///const categoriaGuardadaDB = new Categoria({ nombre, descripcion });

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    const data = {
        nombre,
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.json({
        msg: 'Post Api - Post Categoria',
        categoria
    });
}

const putCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const categoriaEditada = await Categoria.findOneAndUpdate(id, resto, {new : true});

    res.json({
        msg: 'Put Api - Put Categoria',
        categoriaEditada
    })
}

const deleteCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const productoCategoria = await Producto.find({ categoria : {_id: id}})
    const categoriaDefault = await Categoria.findOne({nombre: "DEFAULT"})

    const idProduct = productoCategoria.id;
    const { _id, nombre} = categoriaDefault;

    // Eliminando de manera total en la DB
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    const productoEditado = await Producto.updateMany(idProduct, { categoria : { _id : _id , nombre: nombre}}, {new : true});
    
    /*
    Eliminando de manera lógica de la DB
    const categoriaEliminada = await Categoria.findByIdAndUpdate({estado: false});
    */

    res.json({
        msg: 'Delete Api - Delete Categoria',
        productoEditado,
        categoriaEliminada,
        idProduct
    })
}

module.exports = {
    getCategorias,
    getCategoriasInfo,
    postCategoria,
    putCategoria,
    deleteCategoria
}