const { Router } = require('express');
const multipart = require('connect-multiparty');
const productoControllers = require('../controllers/producto')
const authenticate = require('../middlewares/authenticate')

const router = Router()
const path = multipart({ uploadDir: './uploads/productos' });

router.post('/registro_producto_admin', [authenticate.decodeToken, path], productoControllers.registro_producto_admin)
router.get('/listar_productos_admin/:filtro?', [authenticate.decodeToken], productoControllers.listar_productos_admin)
router.get('/obtener_portada_producto/:img', productoControllers.obtener_portada_producto)
router.get('/obtener_producto_admin/:id', authenticate.decodeToken, productoControllers.obtener_producto_admin)
router.put('/editar_producto_admin/:id', [authenticate.decodeToken, path], productoControllers.editar_producto_admin)

//Variedades productos
router.post('/registro_variedad_producto', authenticate.decodeToken, productoControllers.registro_variedad_producto)
router.get('/obtener_variedad_producto/:id',authenticate.decodeToken, productoControllers.obtener_variedad_producto)
router.delete('/eliminar_variedad_producto/:id',authenticate.decodeToken, productoControllers.eliminar_variedad_producto)


module.exports = router;

