const { response, request } = require('express');
const Producto = require('../models/producto');

const getProductos = async (req = request, res = response) => {

    const query = { estado: true, cantidad: { $gt: 0 } };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        (await Producto.find(query, { usuario: 0, __v: 0, estado: 0 })
            .populate('categoria', 'nombre -_id'))

    ]);

    res.json({
        msg: 'get Api - Controlador Producto',
        listaProductos
    })

}

const getProductosInfo = async (req = request, res = response) => {

    const query = { estado: true };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'get Api - Controlador Producto',
        listaProductos
    })

}

const getProductosOrdenados = async (req = request, res = response) => {

    const query = { estado: true, cantidad: { $gt: 0 } };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query, { usuario: 0, __v: 0 }),
        Producto.find(query, { usuario: 0, __v: 0, estado: 0 })
            .populate('categoria', 'nombre -_id')
            .sort({ ventas: -1 })
    ]);

    res.json({
        msg: 'get Api - Controlador Producto',
        listaProductos
    })

}

const getProductosAgotados = async (req = request, res = response) => {

    const query = { cantidad: 0 };

    const listaProductosAgotados = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'get Api - Controlador Producto',
        listaProductosAgotados
    })

}

const getProductosPorID = async (req = request, res = response) => {

    const { id } = req.params;
    const productoById = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')

    res.json({
        msg: 'GET by id',
        productoById
    })

}

const postProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;
    const productName = body.nombre.toUpperCase();

    const productoGuardadoDB = await Producto.findOne({ nombre: productName });

    if (productoGuardadoDB) {
        return res.status(400).json({
            msg: `El producto ${productoGuardadoDB.nombre}, ya existe en la DB`
        });
    }

    const data = {
        ...body,
        nombre: productName,
        usuario: req.usuario._id
    }

    const producto = await Producto(data);

    await producto.save();

    res.status(201).json({
        msg: 'Post Api - Post Producto',
        producto
    });

}

const putProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...resto } = req.body;
    let nombreProducto = resto.nombre;
    let productoDB;

    if (nombreProducto) {
        
        nombreProducto = resto.nombre.toUpperCase();
        productoDB = await Producto.findOne({ nombre: nombreProducto });

        if (productoDB) {
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre}, ya existe en la DB`
            });
        }

        resto.nombre = nombreProducto;
    }

    resto.usuario = req.usuario._id;

    const productoEditado = await Producto.findByIdAndUpdate(id, resto, { new: true });

    res.json({
        msg: 'Put Api - Put Categoria',
        id,
        nombreProducto,
        productoEditado
    })
}

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const productoEliminado = await Producto.findByIdAndDelete(id);

    //const productoEliminado = await Producto.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'Delete Api - Delete Producto',
        id,
        productoEliminado
    })

}

module.exports = {
    getProductos,
    getProductosInfo,
    getProductosOrdenados,
    getProductosAgotados,
    getProductosPorID,
    postProducto,
    putProducto,
    deleteProducto
}