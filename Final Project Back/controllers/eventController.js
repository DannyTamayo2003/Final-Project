//qui definiamo i controller per gestire le richieste relative agli eventi, sia quelli creati dagli utenti che quelli ottenuti da fonti esterne come Eventbrite. I controller si occupano di creare nuovi eventi, recuperare tutti gli eventi, ottenere un evento specifico per ID e fare da proxy per le richieste alla API esterna, normalizzando i dati ricevuti per mantenere una struttura coerente con il nostro modello interno.

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

// Helper: converte una data locale Eventbrite nel solo orario (HH:MM)
const extractTimeFromLocal = (localDateTime) => {
  if (!localDateTime || typeof localDateTime !== 'string') {
    return '';
  }

  const parts = localDateTime.split('T');
  if (parts.length < 2) {
    return '';
  }

  return (parts[1] || '').slice(0, 5);
};

// Funzione helper per normalizzare gli eventi Eventbrite
const normalizeEvent = (event) => ({
  id: event.id,
  source: 'external',
  nameEvent: event.name?.text || 'Evento esterno',
  description: event.summary || event.description?.text || 'Dettagli non disponibili',
  image: event.logo?.url || '',
  data: event.start?.utc || event.start?.local || null,
  orario: extractTimeFromLocal(event.start?.local),
  location: event.venue?.address?.city || event.venue?.name || 'Location non disponibile',
  indirizzo: event.venue?.address?.localized_address_display || event.venue?.address?.address_1 || '',
  cap: event.venue?.address?.postal_code || '',
  geoRegion: event.venue?.address?.region || '',
  geoProvince: event.venue?.address?.region_code || '',
  timezone: event.start?.timezone || '',
  categoria: event.category?.name || '',
  sottocategoria: event.subcategory?.name || '',
  prezzoMin: null,
  prezzoMax: null,
  valuta: event.currency || 'EUR',
  stato: event.status || 'live',
  venditaInizio: event.created || '',
  venditaFine: event.end?.utc || event.end?.local || '',
  externalUrl: event.url || ''
});

// Funzione helper per fare una singola richiesta a Eventbrite
const fetchEventbriteEvents = async (apiKey, keyword, city, size = '20') => {
  const params = new URLSearchParams();
  params.set('q', keyword);
  params.set('sort_by', 'date');
  params.set('expand', 'venue,category,subcategory');
  params.set('page_size', size);
  params.set('location.address', city ? `${city}, Italy` : 'Italy');
  params.set('location.within', '300km');
  params.set('start_date.range_start', new Date().toISOString());

  const url = `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return payload?.events || [];
  } catch (err) {
    return [];
  }
};

// GET eventi esterni (proxy backend -> Eventbrite)
exports.getEventiEsterni = async (req, res) => {
  try {
    const apiKey = process.env.EVENTBRITE_PRIVATE_TOKEN;

    if (!apiKey) {
      return res.status(500).json({
        message: 'EVENTBRITE_PRIVATE_TOKEN non configurata nel file .env'
      });
    }

    const userKeyword = req.query.keyword;
    const city = req.query.city || '';
    const size = req.query.size || '10';

    let allEvents = [];

    // Se l'utente ha specificamente ricercato un keyword, usiamo solo quello.
    // Altrimenti facciamo ricerche parallele per ampliare i risultati.
    if (userKeyword) {
      const events = await fetchEventbriteEvents(apiKey, userKeyword, city, size);
      allEvents = events;
    } else {
      // Ricerche parallele per keyword diversi, così catturiamo più varietà.
      const keywords = ['car meeting', 'raduno auto', 'motorsport', 'drift', 'tuning'];
      const promises = keywords.map((kw) => fetchEventbriteEvents(apiKey, kw, city, '20'));
      const results = await Promise.all(promises);
      
      // Uniamo i risultati da tutte le ricerche
      allEvents = results.flat();
    }

    // Dedup per id: se lo stesso evento appare in più ricerche, lo teniamo una sola volta
    const seenIds = new Set();
    const uniqueEvents = [];
    for (const event of allEvents) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        uniqueEvents.push(event);
      }
    }

    // Normalizziamo gli eventi unici
    const normalizedEvents = uniqueEvents.map(normalizeEvent);

    return res.status(200).json({
      source: 'eventbrite',
      total: normalizedEvents.length,
      filters: { keyword: userKeyword || 'multiple', city, size },
      events: normalizedEvents
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ message: 'Timeout nella chiamata alla API esterna' });
    }

    return res.status(500).json({ message: err.message });
  }
};