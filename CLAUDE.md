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
│   └── index.js
└── Final Project Front/my-Final-Project-app/
    └── src/
        ├── components/   EventListComponent, EventCardComponent, EventDetailButton,
        │                 FavoriteButtonComponent, NavBarComponent, CreateEvent,
        │                 LoginUserComponent, RegistrationComponent, LogOutComponent,
        │                 MockEventsComponent, FeaturedCardComponent
        ├── router-dom-page/  HomePage, EventPage, EventDetailPage, FavoriteEventPage,
        │                     LoginUserPage, RegistrationPage, CreateEventPage, AccountPage, ContactsPage
        ├── mocks/        MockEvents.js (usato solo su HomePage)
        └── App.jsx
```

## Variabili d'ambiente richieste

File `.env` in `Final Project Back/`:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=chiave_segreta_min_32_chars
PORT=3000
```

## Branch di sviluppo

- `danny` — branch principale di sviluppo (lavoro dal PC)
- `claude/session-context-5u9bhj` — sessione remota Claude (web)
- `main` — produzione

**Flusso:** lavorare su `danny` (o branch remoto) → PR → `main`

## Stato attuale (giugno 2026)

### Completato (fasi 1–6 del roadmap)
- Auth: registrazione, login JWT, logout
- CRUD eventi: crea (`POST /api/eventi/`), leggi tutti (`GET /api/eventi/`), leggi per ID (`GET /api/eventi/:id`)
- Preferiti: aggiungi/rimuovi/leggi dal DB utente
- Frontend: tutte le pagine principali funzionanti, filtro per nome/città su EventPage
- Rimossa integrazione Eventbrite API (non esistono API affidabili per eventi auto in Italia)

### Endpoint API backend

| Metodo | Path | Auth | Descrizione |
|--------|------|------|-------------|
| POST | /api/eventi/ | ✓ | Crea evento |
| GET | /api/eventi/ | — | Lista tutti gli eventi |
| GET | /api/eventi/:id | — | Evento per ID |
| POST | /api/user/register | — | Registrazione |
| POST | /api/user/login | — | Login → JWT |
| PUT | /api/user/eventi/:id/preferiti | ✓ | Aggiungi preferito |
| GET | /api/user/eventsFavourites | ✓ | Lista preferiti |
| DELETE | /api/user/eventi/:id/preferiti | ✓ | Rimuovi preferito |

### Bug noti
- `deleteEventoPreferito` in `userController.js` usa `.remove()` deprecato — va corretto con `$pull`

### TODO (prossimi step)
- [ ] Fix bug delete preferiti (`$pull` invece di `.remove()`)
- [ ] Admin Dashboard (Fase 7): pannello per gestire eventi con ruoli utente
- [ ] Edit/Delete eventi da parte del creatore (endpoint PUT/DELETE + UI)
- [ ] Validazione form (Express Validator backend + validazione frontend)
- [ ] Profilo utente (AccountPage mostra solo logout, aggiungere dati utente)
- [ ] Sostituire mock events su HomePage con eventi reali dal DB
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
