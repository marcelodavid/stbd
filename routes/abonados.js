var express = require('express');
var router = express.Router();

//importamos el controlador de las zonas
var userCtrl = require('../controllers/abonados');
var resumen_controller = require('../controllers/resumen_controller/resumen');
router.route('/registrar')
	.post(userCtrl.register);
router.route('/buscar')
	.get(userCtrl.search);
router.route('/:id')
	.get(userCtrl.report);
router.route('/:id/mediciones')
	.get(userCtrl.getMeassurement);
router.route('/:id/resumen/dias')
	.get(resumen_controller.abonados.dias);
router.route('/:id/resumen/meses')
	.get(resumen_controller.abonados.meses);

module.exports = router;
