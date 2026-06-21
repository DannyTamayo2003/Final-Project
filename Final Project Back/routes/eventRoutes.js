const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventController.js');
const userController = require('../controllers/userController.js');

router.post('/', userController.verificaToken, eventoController.createEvento);
router.get('/', eventoController.getEventi);

router.get('/:id', eventoController.getEventoById);
//router.put('/:id', eventoController.updateEvento);
//router.delete('/:id', eventoController.deleteEvento);
//router.get('/search/location', eventoController.getEventiByLocation);

module.exports = router;