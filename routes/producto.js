const { Router } = require('express');
const multipart = require('connect-multiparty');
const productoControllers = require('../controllers/producto')
const authenticate = require('../middlewares/authenticate')

const router = Router()
const path = multipart({ uploadDir: './uploads/productos' });

router.post('/registro_producto_admin', [authenticate.decodeToken, path], productoControllers.registro_producto_admin)

module.exports = router;