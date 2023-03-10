const {Router} = require('express');
const { check } = require('express-validator');

const { getCarrito, postCarrito, getFactura } = require('../controllers/carrito');
const { esRoleValido, existeProductoPorId, } = require('../helpers/db-validators');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campo');

const router = Router();

router.get('/', [
    validarJWT
],getCarrito);

router.get('/factura', [
    validarJWT
],getFactura);

router.post('/agregar', [
    validarJWT,
    check('cantidad', 'Debe especificar la cantidad').not().isEmpty(),
    check('productos', 'Debe agregar algún producto').not().isEmpty(),
    check('productos.*.producto').custom(existeProductoPorId),
    check('productos.*.producto').isMongoId(),
    validarCampos
], postCarrito)

module.exports = router