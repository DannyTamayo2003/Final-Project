/*
 * eventController.js
 * Gestisce la logica relativa agli eventi creati dagli utenti:
 * creazione, lettura di tutti gli eventi e lettura di un singolo evento per ID.
 */

const Evento = require('../models/event.js');

// CREA EVENTO: salva un nuovo evento nel database
exports.createEvento = async function(req, res) {
  try {
    const datiEvento = { ...req.body };

    // Se multer ha ricevuto un file immagine, costruisce l'URL pubblico per salvarlo nel DB
    if (req.file) {
      datiEvento.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Salva l'ID dell'utente loggato come creatore dell'evento
    datiEvento.creatorId = req.userId;

    const evento = new Evento(datiEvento);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// MODIFICA EVENTO: aggiorna i campi di un evento esistente (solo il creatore)
exports.updateEvento = async function(req, res) {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    // Blocca la modifica se l'utente loggato non è il creatore
    if (evento.creatorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Non autorizzato: non sei il creatore di questo evento' });
    }

    const aggiornamenti = { ...req.body };

    // Se è stata caricata una nuova immagine, aggiorna l'URL
    if (req.file) {
      aggiornamenti.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const eventoAggiornato = await Evento.findByIdAndUpdate(req.params.id, aggiornamenti, { new: true });
    res.json(eventoAggiornato);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    await Evento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evento eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LEGGI TUTTI GLI EVENTI: restituisce la lista completa degli eventi nel database
exports.getEventi = async function(req, res) {
  try {
    const eventi = await Evento.find();
    res.json(eventi);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
};
