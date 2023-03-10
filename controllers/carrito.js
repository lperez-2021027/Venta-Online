const { response, request, query } = require('express');
const Carrito = require('../models/carrito');
const Factura = require('../models/factura');
const Producto = require('../models/producto');

const getCarrito = async (req = request, res = response) => {

    const usId = req.usuario._id;

    const query = { usuario: usId };

    const listaCarrito = await Promise.all([
        Carrito.countDocuments(),
        Carrito.find({}, { total: 1, productos: { producto: 1 } })
            .populate('productos.producto', 'nombre categoria')

    ]);

    res.json({
        msg: 'get Api - Controlador Carrito',
        listaCarrito
    })

}

const postCarrito = async (req = request, res = response) => {

    const { usuario, total, ...resto } = req.body;

    const idProduct = resto.productos.map(producto => producto.producto);
    const cantidadProduct = resto.productos.map(producto => producto.cantidad);

    const precioProductos = await Producto.find({ _id: { $in: idProduct } }, { precio: 1, _id: 0 });

    const stockProducto = await Producto.find({ _id: { $in: idProduct } }, { cantidad: 1, _id: 0 });

    const totalPorProducto = cantidadProduct.map((cantidad, index) => cantidad * precioProductos[index].precio);

    const sumaTotal = totalPorProducto.reduce((acumulado, actual) => acumulado + actual, 0);


    // Restar cantidadProduct a stockProducto
    const newStockProducto = stockProducto.map((producto, index) => {
        const newCantidad = producto.cantidad - cantidadProduct[index];
        return { ...producto.toObject(), cantidad: newCantidad };
    });

    for (let i = 0; i < stockProducto.length; i++) {
        const newStock = stockProducto[i].cantidad - cantidadProduct[i];
        if (newStock <= 0) {
            return res.status(400).json({
                msg: `No hay suficiente stock para el producto con ID ${idProduct[i]}.`
            });
        }
        await Producto.updateOne({ _id: idProduct[i] }, { $set: { cantidad: newStock } });
    }

    for (let i = 0; i < idProduct.length; i++) {
        const id = idProduct[i];
        const cantidad = cantidadProduct[i];
        const producto = await Producto.findById(id);
        const newStock = producto.cantidad - cantidad;
        const newVentas = producto.ventas + cantidad;
        await Producto.findByIdAndUpdate(id, { cantidad: newStock, ventas: newVentas });
    }

    // Validar que no hayan valores de 0 en el stockProducto
    const hayStock = newStockProducto.every(producto => producto.cantidad > 0);
    if (!hayStock) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay suficiente stock para completar la compra',
        });
    }

    const data = {
        ...resto,
        total: sumaTotal
    }

    //const listaProduct = Producto.find(query)

    const carrito = await Carrito(data);
    await carrito.save();

    const idCarrito = carrito.id;
    const date = new Date();
    //const carritoData = await Carrito.findById(idCarrito);

    const dataFactura = {
        usuario: resto.usuario,
        fecha: date,
        detalles: idCarrito
    }

    const facturaGuardada = await Factura(dataFactura);
    await facturaGuardada.save();

    res.json({
        msg: 'get Api - Controlador Carrito',
        // idProduct,
        // stockProducto,
        // newStockProducto,
        // hayStock,
        // precioProductos,
        // cantidadProduct,
        // totalPorProducto,
        // sumaTotal,
        carrito
    })

}


const getFactura = async (req = request, res = response) => {

    const listaFacturas = await Promise.all([
        (await Carrito.find({}, { productos: { _id: 0 }, __v: 0 })
            .populate('productos.producto', 'nombre categoria'))

    ]);

    res.json({
        msg: 'get Api - Controlador Factura',
        listaFacturas
    })

}

module.exports = {
    getCarrito,
    getFactura,
    postCarrito
}