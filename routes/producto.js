const { Router } = require('express');
const { check } = require('express-validator');

const { getProductos, getProductosPorID, postProducto, putProducto, deleteProducto, getProductosOrdenados, getProductosInfo, getProductosAgotados } = require('../controllers/producto');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campo');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', getProductos);

router.get('/info', [
    validarJWT,
    esAdminRole,
    validarCampos
],getProductosInfo);

router.get('/ordenado', getProductosOrdenados);

router.get('/agotado', [
    validarJWT,
    esAdminRole,
    validarCampos
], getProductosAgotados);

router.get('/:id', [
    check('id', 'No es un id de MongoDB').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getProductosPorID);

router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de MongoDB').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], postProducto);

router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    check('categoria', 'No es un id de MongoDB').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], putProducto);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteProducto);

module.exports = router;
