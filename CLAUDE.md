# Street & Race — Contesto di Progetto

App web per la scoperta e gestione di eventi automobilistici (car meeting, raduni, motorsport). Gli utenti creano i propri eventi direttamente nell'app. Non ci sono API esterne di terze parti.

## Stack tecnico

**Backend:** Node.js + Express 5, MongoDB + Mongoose 8, JWT (jsonwebtoken), bcrypt  
**Frontend:** React 19, Vite 6, React Router 7, React Bootstrap 2, Bootstrap 5  
**Porta backend:** 3000 | **Porta frontend:** 5173

## Struttura cartelle

```
Final-Project/
├── Final Project Back/
│   ├── controllers/   eventController.js, userController.js
│   ├── models/        event.js, user.js
│   ├── routes/        eventRoutes.js, userRoutes.js
│   ├── uploads/       immagini eventi caricate con multer
│   └── index.js
└── Final Project Front/my-Final-Project-app/
    └── src/
        ├── components/   EventListComponent, EventCardComponent, DetailButtonComponent,
        │                 FavoriteButtonComponent, NavBarComponent, CreateEvent,
        │                 LoginUserComponent, RegistrationComponent, LogOutComponent,
        │                 FeaturedCardComponent
        ├── router-dom-page/  HomePage (landing page), EventPage, EventDetailPage,
        │                     FavoriteEventPage, LoginUserPage, RegistrationPage,
        │                     CreateEventPage, AccountPage, EditEventPage, ContactsPage
        └── App.jsx
```

## Variabili d'ambiente richieste

File `.env` in `Final Project Back/`:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=chiave_segreta_min_32_chars
PORT=3000
```

## Auth — token JWT in localStorage

Il token JWT viene salvato con la chiave `"token"` (non `"userId"`):
- Salvato al login: `localStorage.setItem('token', data.token)`
- Letto nelle richieste protette: `localStorage.getItem('token')`
- Rimosso al logout: `localStorage.removeItem('token')`

## Branch di sviluppo

- `danny` — branch principale di sviluppo (lavoro dal PC)
- `claude/session-context-5u9bhj` — sessione remota Claude (web)
- `main` — produzione

**Flusso:** lavorare su `danny` (o branch remoto) → PR → `main`

## Stato attuale (giugno 2026)

### Completato (fasi 1–7)
- Auth: registrazione, login JWT, logout
- CRUD eventi: crea, leggi tutti, leggi per ID
- Upload immagine: multer@1.4.5-lts.1 (v2 causava req.body vuoto), diskStorage, cartella `/uploads`
- Preferiti: aggiungi/rimuovi/leggi dal DB (bug `.remove()` → `$pull` fixato)
- Profilo utente: AccountPage mostra nome, email, data di nascita (endpoint GET /api/user/profile)
- Eventi creati dall'utente: visibili in AccountPage (endpoint GET /api/user/myEvents)
- Edit evento: form pre-compilato in EditEventPage, invia PUT (immagine opzionale)
- Delete evento: bottone con conferma in AccountPage, invia DELETE
- Frontend: tutte le pagine principali funzionanti, filtro per nome/città su EventPage
- Card eventi: formato 4:5 (aspect-ratio Instagram), descrizione troncata 2 righe, bottoni affiancati
- Rimossa integrazione Eventbrite; HomePage trasformata in landing page

### Note importanti sul modello dati
- `event.js` ha il campo `creatorId` (ObjectId ref User) — aggiunto il 2026-06-27
- Gli eventi creati **prima** del 2026-06-27 non hanno `creatorId` e non appaiono in myEvents
- I preferiti sono copie dell'evento (non reference) — per evitare fetch aggiuntive

### Endpoint API backend

| Metodo | Path | Auth | Descrizione |
|--------|------|------|-------------|
| POST | /api/eventi/ | ✓ | Crea evento (salva creatorId) |
| GET | /api/eventi/ | — | Lista tutti gli eventi |
| GET | /api/eventi/:id | — | Evento per ID |
| PUT | /api/eventi/:id | ✓ | Modifica evento (solo creatore) |
| DELETE | /api/eventi/:id | ✓ | Elimina evento (solo creatore) |
| POST | /api/user/register | — | Registrazione |
| POST | /api/user/login | — | Login → JWT |
| GET | /api/user/profile | ✓ | Dati profilo (senza password) |
| GET | /api/user/myEvents | ✓ | Eventi creati dall'utente |
| PUT | /api/user/eventi/:id/preferiti | ✓ | Aggiungi preferito |
| GET | /api/user/eventsFavourites | ✓ | Lista preferiti |
| DELETE | /api/user/eventi/:id/preferiti | ✓ | Rimuovi preferito |

### TODO (prossimi step)
- [ ] Google Auth — da fare per ultimo, richiede Google Cloud Console (client ID/secret); mantenere anche login classico per compatibilità
- [ ] Admin Dashboard: pannello per gestire eventi con ruoli utente
- [ ] Validazione form più robusta (Express Validator backend)
- [ ] Paginazione lista eventi

## Come avviare il progetto

```bash
# Backend
cd "Final Project Back"
npm install
npm run dev   # nodemon index.js su porta 3000

# Frontend
cd "Final Project Front/my-Final-Project-app"
npm install
npm run dev   # Vite su porta 5173
```
