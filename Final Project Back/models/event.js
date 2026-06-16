const mongoose = require('mongoose');

// Definizione dello schema per gli eventi
const eventSchema = new mongoose.Schema({
    image: { type: String, required: false },
    nameEvent: { type: String, required: true },
    location: { type: String, required: true },
    data: { type: Date, required: true },
    description: { type: String, required: true },

    //questo campo serve per distinguere gli eventi creati dagli utenti e quelli provenienti da fonti esterne.

    // 'user' = evento creato dalla community, 'external' = riservato per usi futuri

    source: {//source indica la provenienza dell'evento, se è stato creato da un utente o se proviene da una fonte esterna.
        type: String,
        enum: ['user', 'external'], // Definisce i valori consentiti per il campo source
        default: 'user' // Imposta il valore predefinito su 'user'
    },

    geoRegion: { type: String, required: false },
    geoProvince: { type: String, required: false },

    // Aggiunta dei campi solo del dettaglio
    orario: { type: String, required: false },
    descrizioneDettagliata: { type: String, required: false },
    organizzatore: { type: String, required: false },

});

const Event = mongoose.model('Event', eventSchema, 'Events');
module.exports = Event;