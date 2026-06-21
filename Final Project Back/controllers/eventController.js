const Evento = require('../models/event.js');
const Utente = require('../models/user.js');

// CREATE events
exports.createEvento = async (req, res) => {
    try {
      const evento = new Evento(req.body);
      await evento.save();
      res.status(201).json(evento);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// GET all events
exports.getEventi = async (req, res) => {
  try {
    const eventi = await Evento.find();
    res.json(eventi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OTTIENI evento per ID
exports.getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ message: 'Evento non trovato' });
    res.json(evento);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};