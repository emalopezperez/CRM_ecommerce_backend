const { Router } = require('express');
const colaboradorControllers = require('../controllers/colaborador')


const router = Router()

router.post('/registro_colaborador_admin',colaboradorControllers.registro_colaborador_admin)

module.exports = router;