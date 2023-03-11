const {Router} = require('express');
const { check } = require('express-validator');

const { getCarrito, postCarrito, getFactura, getFacturaById } = require('../controllers/carrito');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campo');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', [
    validarJWT
],getCarrito);

router.get('/factura', [
    validarJWT,
    esAdminRole
],getFactura);

router.get('/factura/:id', [
    validarJWT,
    check('id').isMongoId(),
    validarCampos
], getFacturaById);

router.post('/agregar', [
    validarJWT,
    check('productos.*.cantidad', 'Debe especificar la cantidad').not().isEmpty(),
    check('productos', 'Debe agregar algún producto').not().isEmpty(),
    check('productos.*.producto').custom(existeProductoPorId),
    check('productos.*.producto').isMongoId(),
    validarCampos
], postCarrito)

module.exports = router