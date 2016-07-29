var express = require('express');
var router = express.Router();

var mapCtrl = require('../controllers/mapa');

router.get('/', mapCtrl.mapa);

module.exports = router;
