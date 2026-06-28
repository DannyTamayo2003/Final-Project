/*
 * index.js — Entry point del server
 * Configura Express, connette MongoDB e registra le route dell'applicazione.
 * Il server gira sulla porta 3000 (o quella definita in .env).
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Carica le variabili d'ambiente da .env

const eventoRoutes = require('./routes/eventRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const cron = require('node-cron');
const cleanupExpiredEvents = require('./jobs/cleanupExpiredEvents.js');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: in sviluppo usa localhost, in produzione legge il dominio da .env (CORS_ORIGIN=https://tuo-sito.com)
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));

// Interpreta il body delle richieste come JSON
app.use(express.json());

// Serve i file statici dalla cartella /uploads (immagini degli eventi)
app.use('/uploads', express.static('uploads'));

// Registra le route: ogni percorso viene gestito dal rispettivo router
app.use('/api/eventi', eventoRoutes);
app.use('/api/user', userRoutes);

// Il server parte solo dopo che MongoDB è connesso.
// Se la connessione fallisce, il processo termina: è inutile accettare richieste senza DB.
mongoose.connect(process.env.MONGODB_URI)
  .then(function() {
    console.log('MongoDB connesso');
    cron.schedule('0 2 * * *', cleanupExpiredEvents);
    console.log('[cleanup] Job schedulato: ogni giorno alle 02:00');
    app.listen(PORT, function() {
      console.log('Server in ascolto sulla porta ' + PORT);
    });
  })
  .catch(function(err) {
    console.error('Errore connessione MongoDB:', err);
    process.exit(1);
  });
