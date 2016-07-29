var express = require('express');
var router = express.Router();

//importamos el controlador de las zonas
var zoneCtrl = require('../controllers/zonas');

router.route('/nueva')
	.post(zoneCtrl.nueva);
router.route('/:id')
	.put(zoneCtrl.actualizar);

module.exports = router;
