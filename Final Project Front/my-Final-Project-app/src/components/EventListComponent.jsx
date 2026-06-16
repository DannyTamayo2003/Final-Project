// EventListComponent - Componente container che visualizza la lista di eventi, filtrata in base alla ricerca

import React, { useEffect, useState } from 'react'
import EventCardComponent from './EventCardComponent'
import '../style/EventPageStyle.css'
//import mockEvents from '../mocks/mockEvents'

export default function EventListComponent({ search = "" }) {
  // rawEvents: dati caricati una sola volta dal backend esterno
  const [rawEvents, setRawEvents] = useState([])
  // loading: true mentre la fetch e' in corso
  const [loading, setLoading] = useState(false)
  // error: messaggio mostrato in pagina se la fetch fallisce
  const [error, setError] = useState('')

  useEffect(() => {
    // Facciamo una sola chiamata iniziale al backend esterno.
    // La search bar non deve piu' rifare richieste: filtra solo i dati gia' caricati.
    const query = new URLSearchParams({
      size: '10',
      page: '0'
    })

    // Prima di una nuova fetch puliamo eventuali errori precedenti.
    setLoading(true)
    setError('')

    fetch(`http://localhost:3000/api/eventi/external?${query.toString()}`)
      .then(async (res) => {
        // Se il backend risponde con errore, mostriamo il messaggio ricevuto
        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}))
          throw new Error(errPayload.message || 'Errore nel caricamento eventi esterni')
        }
        return res.json()
      })
      .then((data) => {
        // Il backend ritorna un oggetto { source, total, filters, events }
        // Usiamo un fallback a [] per evitare errori se events non arriva o non e' un array.
        setRawEvents(Array.isArray(data.events) ? data.events : [])
      })
      .catch((err) => {
        // In caso di errore svuotiamo la lista per evitare di mostrare dati vecchi/non coerenti.
        setError(err.message)
        setRawEvents([])
        console.error('Errore nel caricamento eventi esterni:', err)
      })
      .finally(() => {
        // finally viene eseguito sia in successo che in errore.
        setLoading(false)
      })
    // Questo useEffect parte solo al mount.
  }, [])

  // Normalizziamo la search per confrontare solo regione e provincia.
  const normalizedSearch = search.trim().toLowerCase()

  // Filtriamo localmente i dati gia' caricati dal backend.
  const filteredEvents = rawEvents.filter((event) => {
    if (!normalizedSearch) {
      return true
    }

    const location = (event.location || '').toLowerCase()
    const region = (event.geoRegion || '').toLowerCase()
    const province = (event.geoProvince || '').toLowerCase()

    // Cerchiamo in location (città), regione e provincia.
    return location.includes(normalizedSearch) || region.includes(normalizedSearch) || province.includes(normalizedSearch)
  })

  return (
    <div className="eventListFlex">
      {/* Stato di caricamento: utile per capire che la richiesta è partita */}
      {loading && <p>Caricamento eventi...</p>}

      {/* Stato errore: rende visibile il problema senza guardare la console */}
      {!loading && error && <p>Errore: {error}</p>}

      {/* Lista eventi filtrati localmente per regione/provincia */}
      {!loading && !error && filteredEvents.map(event => (
        <EventCardComponent key={event._id || event.id} event={event} />
      ))}

      {/* Caso lista vuota: nessun evento trovato con il filtro corrente */}
      {!loading && !error && filteredEvents.length === 0 && <p>Nessun evento trovato.</p>}
    </div>
  )
}
