var express = require('express');
var router = express.Router();

var mapa_controller = require('../controllers/mapa_controller');

router.get('/', mapa_controller.mapa);
router.get('/mediciones', mapa_controller.mediciones);

module.exports = router;
