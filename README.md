# Street & Race - Piattaforma di Gestione Eventi

## 📋 Panoramica
**Street & Race** è un prototipo funzionante di un'applicazione web per la gestione di eventi dedicata alla scoperta, creazione e gestione di eventi di street racing e motorsport. Costruito con tecnologie web moderne, dimostra competenze di sviluppo full-stack includendo autenticazione utente, operazioni CRUD su eventi e funzionalità di preferiti.

**Stato:** Prototipo Funzionante (WIP - Work In Progress)

## 🎯 Funzionalità (Attuali)
- ✅ **Autenticazione Utente** - Registrazione, login/logout con token JWT
- ✅ **Scoperta Eventi** - Naviga e ricerca tutti gli eventi
- ✅ **Dettagli Evento** - Visualizza informazioni complete dell'evento con location e orari
- ✅ **Gestione Preferiti** - Aggiungi/rimuovi eventi preferiti (solo utenti autenticati)
- ✅ **Creazione Eventi** - Gli utenti autenticati possono creare nuovi eventi
- ✅ **Interfaccia Responsiva** - Design mobile-friendly con layout Flexbox
- ✅ **Integrazione API** - Backend RESTful con gestione errori appropriata

## 🛠 Stack Tecnologico

### Frontend
- **React 19** - Libreria UI con hooks
- **Vite 6** - Build tool veloce per lo sviluppo
- **React Router 7** - Routing lato client
- **React Bootstrap 2** - Componenti UI
- **CSS3** - Styling personalizzato con Flexbox

### Backend
- **Node.js + Express 5** - Framework server
- **MongoDB + Mongoose 8** - Database con ORM
- **JWT (jsonwebtoken)** - Autenticazione/autorizzazione
- **bcrypt** - Hashing delle password
- **CORS** - Gestione richieste Cross-Origin

## 🚀 Guida Rapida

### Prerequisiti
- Node.js 18+
- Account MongoDB Atlas (o MongoDB locale)
- Git

### Installazione & Setup

**1. Clona e naviga al progetto:**
```bash
cd Final-Project
```

**2. Setup Backend:**
```bash
cd "Final Project Back"
npm install
```
Crea file `.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

Avvia il backend:
```bash
node index.js
```
Il server gira su `http://localhost:3000`

**3. Setup Frontend:**
```bash
cd "Final Project Front/my-Final-Project-app"
npm install
npm run dev
```
L'app gira su `http://localhost:5173`

## 📝 Endpoint API (Backend)

### Utenti
- `POST /api/user/register` - Registra nuovo utente
- `POST /api/user/login` - Login utente (ritorna token JWT)
- `GET /api/user/eventsFavourites` - Ottieni eventi preferiti (richiede token)
- `PUT /api/user/eventi/:id/preferiti` - Aggiungi evento ai preferiti
- `DELETE /api/user/eventi/:id/preferiti` - Rimuovi evento dai preferiti

### Eventi
- `GET /api/eventi` - Ottieni tutti gli eventi
- `GET /api/eventi/:id` - Ottieni dettagli evento
- `POST /api/eventi/` - Crea nuovo evento (richiede token)

## 🔑 Dettagli Implementazione

### Flusso Autenticazione
Gli utenti si autenticano tramite token JWT memorizzati in `localStorage`. Il token è inviato nell'header `Authorization` per le rotte protette:
```
Authorization: Bearer <jwt_token>
```

### State Management
State a livello componente con React hooks (`useState`, `useEffect`) per semplicità. Nessuna libreria esterna per lo stato ancora.

### Schema Database
- **Users** - nome, email, password (hashata), data nascita, array eventi preferiti
- **Events** - nome, descrizione, location, data, ora, organizzatore, immagini

## 📚 Problemi Noti & Miglioramenti Futuri

### Limitazioni Attuali
- Nessuna verifica email durante la registrazione
- Funzionalità di modifica/eliminazione eventi mancante
- Nessuna paginazione per le liste di eventi
- Validazione moduli limitata
- Pagina profilo utente non completa

### Funzionalità Pianificate
- [ ] Modifica/eliminazione eventi da parte del creatore
- [ ] Filtri di ricerca (location, intervallo date, categoria)
- [ ] Recensioni e valutazioni utenti
- [ ] Categorie/tag per eventi
- [ ] Notifiche via email
- [ ] Deploy su cloud (Vercel/Render)
- [ ] State management globale (Redux/Context API)
- [ ] Test unit/integrazione

## 🧪 Testing
Attualmente nessun test automatizzato. Testing manuale consigliato:
1. Registra nuovo utente
2. Login con credenziali
3. Naviga eventi
4. Aggiungi/rimuovi dai preferiti
5. Crea nuovo evento

## 📦 Struttura Progetto
```
Final-Project/
├── Final Project Back/       # API Node.js + Express
│   ├── controllers/          # Gestori rotte
│   ├── models/               # Schema MongoDB
│   ├── routes/               # Endpoint API
│   ├── index.js              # Entry point server
│   └── package.json
├── Final Project Front/      # Frontend React + Vite
│   └── my-Final-Project-app/
│       ├── src/
│       │   ├── components/   # Componenti React riutilizzabili
│       │   ├── router-dom-page/   # Componenti pagina per routing
│       │   ├── style/        # File CSS
│       │   └── App.jsx       # Componente principale app
│       └── package.json
└── README.md
```

## 👤 Autore
**Danny** - Full Stack Developer

## 📄 Licenza
ISC

## 💡 Note per i Reviewer (HR)
Questo progetto dimostra:
- Sviluppo Full-Stack JavaScript/Node.js
- Design pattern API RESTful
- Implementazione di autenticazione e autorizzazione
- Architettura componenti React e hooks
- Design database e query
- Workflow Git e version control

Come prototipo funzionante, l'attenzione è stata sulla funzionalità e l'apprendimento di concetti core. Il codebase è pulito e mantenibile con spazio per scalabilità e nuove feature.