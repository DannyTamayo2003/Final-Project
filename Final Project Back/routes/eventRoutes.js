/*
 * eventRoutes.js
 * Definisce le route per le operazioni sugli eventi.
 * La creazione di un evento richiede un token JWT valido (verificaToken).
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const eventoController = require('../controllers/eventController.js');
const userController = require('../controllers/userController.js');

// Percorso assoluto alla cartella uploads (più affidabile del path relativo su Windows)
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Configurazione multer: salva le immagini nella cartella /uploads con nome univoco
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const estensione = path.extname(file.originalname);
    cb(null, Date.now() + estensione);
  }
});

// Accetta solo immagini
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo immagini sono consentite'));
    }
  }
});

// POST /api/eventi/ — Crea un nuovo evento (richiede token)
router.post('/', userController.verificaToken, upload.single('image'), eventoController.createEvento);

// GET /api/eventi/ — Restituisce tutti gli eventi (pubblica, nessun token richiesto)
router.get('/', eventoController.getEventi);

// GET /api/eventi/:id — Restituisce un singolo evento per ID (pubblica)
router.get('/:id', eventoController.getEventoById);

// PUT /api/eventi/:id — Modifica un evento (richiede token, solo il creatore)
router.put('/:id', userController.verificaToken, upload.single('image'), eventoController.updateEvento);

// DELETE /api/eventi/:id — Elimina un evento (richiede token, solo il creatore)
router.delete('/:id', userController.verificaToken, eventoController.deleteEvento);

module.exports = router;
