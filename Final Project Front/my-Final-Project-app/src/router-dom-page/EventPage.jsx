import React, { useState } from 'react'
import EventListComponent from '../components/EventListComponent'
import '../style/EventPageStyle.css'
//import { fetchEvents } from '../API/eventsAPI'

export default function EventPage() {
  const [search, setSearch] = useState("")
  /*const [events, setEvents] = useState([])

  // Carica gli eventi al montaggio del componente
  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data))
      .catch(err => console.error('Errore nel caricamento eventi:', err))
  }, []) 
console.log('EventPage rendered with events:', events)*/

  return (
    <>
      <h1>Event Pages</h1>

      <div className="event-search-container">
        {/* La search ora filtra solo regione o provincia, non rifà nuove chiamate al backend. */}
        <input
          type="text"
          placeholder="Cerca evento o città..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="event-search-input"
        />
      </div>

      <div className='eventListContainer'>
        <EventListComponent search={search} />
      </div>
    </>
  )
}
