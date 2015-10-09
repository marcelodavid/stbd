var express = require('express');
var router = express.Router();

//importamos el controlador de las zonas
var zonas_controller = require('../controllers/zonas_controller');

router.route('/nueva')
	.post(zonas_controller.nueva);
router.route('/:id')
	.put(zonas_controller.actualizar);

module.exports = router;
