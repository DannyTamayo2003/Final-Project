/*
 * eventController.js
 * Gestisce la logica relativa agli eventi creati dagli utenti:
 * creazione, lettura di tutti gli eventi e lettura di un singolo evento per ID.
 */

const Evento = require('../models/event.js');
const { cloudinary } = require('../config/cloudinary.js');
const { validationResult } = require('express-validator');

// Estrae il public_id Cloudinary da un URL completo (gestisce nomi con più punti)
function extractPublicId(cloudinaryUrl) {
  const parts = cloudinaryUrl.split('/');
  const basename = parts[parts.length - 1];
  const nameParts = basename.split('.');
  const nameWithoutExt = nameParts.length > 1 ? nameParts.slice(0, -1).join('.') : basename;
  return `street-and-race/${nameWithoutExt}`;
}

// CREA EVENTO: salva un nuovo evento nel database
exports.createEvento = async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se multer aveva già caricato un'immagine su Cloudinary, la elimina per evitare file orfani
    if (req.file) {
      await cloudinary.uploader.destroy(extractPublicId(req.file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const datiEvento = { ...req.body };

    // Se multer ha ricevuto un file immagine, usa l'URL pubblico restituito da Cloudinary
    if (req.file) {
      datiEvento.image = req.file.path;
    }

    // Salva l'ID dell'utente loggato come creatore dell'evento
    datiEvento.creatorId = req.userId;

    const evento = new Evento(datiEvento);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) {
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

// MODIFICA EVENTO: aggiorna i campi di un evento esistente (solo il creatore)
exports.updateEvento = async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se multer aveva già caricato una nuova immagine su Cloudinary, la elimina
    if (req.file) {
      await cloudinary.uploader.destroy(extractPublicId(req.file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    // Blocca la modifica se l'utente loggato non è il creatore
    if (evento.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorizzato: non sei il creatore di questo evento' });
    }

    // Whitelist dei campi modificabili: impedisce che campi come creatorId vengano sovrascritti
    const campiConsentiti = ['nameEvent', 'description', 'data', 'location', 'geoRegion', 'orario', 'descrizioneDettagliata', 'organizzatore', 'via'];
    const aggiornamenti = {};
    campiConsentiti.forEach(function(campo) {
      if (req.body[campo] !== undefined) aggiornamenti[campo] = req.body[campo];
    });

    if (req.file) {
      // Se l'evento aveva già un'immagine su Cloudinary, la elimina prima di salvare la nuova
      if (evento.image) {
        await cloudinary.uploader.destroy(extractPublicId(evento.image));
      }
      aggiornamenti.image = req.file.path;
    }

    const eventoAggiornato = await Evento.findByIdAndUpdate(req.params.id, aggiornamenti, { new: true });
    res.json(eventoAggiornato);
  } catch (err) {
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

// ELIMINA EVENTO: rimuove un evento dal database (solo il creatore)
exports.deleteEvento = async function(req, res) {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    // Blocca l'eliminazione se l'utente loggato non è il creatore
    if (evento.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorizzato: non sei il creatore di questo evento' });
    }

    // Se l'evento ha un'immagine su Cloudinary, la elimina prima di rimuovere il documento
    if (evento.image) {
      await cloudinary.uploader.destroy(extractPublicId(evento.image));
    }

    await Evento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evento eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

// LEGGI TUTTI GLI EVENTI: restituisce la lista completa degli eventi nel database
exports.getEventi = async function(req, res) {
  try {
    const eventi = await Evento.find();
    res.json(eventi);
  } catch (err) {
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

// LEGGI EVENTO PER ID: restituisce un singolo evento tramite il suo ID
exports.getEventoById = async function(req, res) {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }
    res.json(evento);
  } catch (err) {
    res.status(500).json({ message: 'Errore interno del server' });
  }
};
