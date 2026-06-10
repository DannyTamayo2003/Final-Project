// EventListComponent - Componente container che visualizza la lista di eventi, filtrata in base alla ricerca

import React, { useEffect, useState } from 'react'
import EventCardComponent from './EventCardComponent'
import '../style/EventPageStyle.css'
//import mockEvents from '../mocks/mockEvents'

export default function EventListComponent({ search = "" }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/eventi') // Cambia l'URL se necessario
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Errore nel caricamento eventi:', err))
  }, [])
  
  const filteredEvents = events.filter(event =>
  event.nameEvent?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="eventListFlex">
      {filteredEvents.map(event => (
        <EventCardComponent key={event._id || event.id} event={event} />
      ))}
    </div>
  )
}
