var express = require('express');
var router = express.Router();

//importamos el controlador de las zonas
var abonados_controller = require('../controllers/abonados_controller');
router.route('/buscar')
	.get(abonados_controller.buscar)
router.route('/:id')
	.get(abonados_controller.abonado);
router.route('/:id/mediciones')
	.get(abonados_controller.mediciones);
module.exports = router;
