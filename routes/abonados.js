var express = require('express');
var router = express.Router();

//importamos el controlador de las zonas
var abonados_controller = require('../controllers/abonados_controller');
var resumen_controller = require('../controllers/resumen_controller/resumen_controller');
router.route('/registrar')
	.get(abonados_controller.getForm)
	.post(abonados_controller.registrar);
router.route('/buscar')
	.get(abonados_controller.buscar);
router.route('/:id')
	.get(abonados_controller.informe);
router.route('/:id/mediciones')
	.get(abonados_controller.mediciones);
router.route('/:id/resumen/dias')
	.get(resumen_controller.abonados.dias);
router.route('/:id/resumen/meses')
	.get(resumen_controller.abonados.meses);

module.exports = router;
