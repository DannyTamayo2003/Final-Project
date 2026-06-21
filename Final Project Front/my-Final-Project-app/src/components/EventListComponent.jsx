import React, { useEffect, useState } from 'react'
import EventCardComponent from './EventCardComponent'
import '../style/EventPageStyle.css'

export default function EventListComponent({ search = "" }) {
  const [rawEvents, setRawEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    fetch('http://localhost:3000/api/eventi')
      .then(async (res) => {
        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}))
          throw new Error(errPayload.message || 'Errore nel caricamento eventi')
        }
        return res.json()
      })
      .then((data) => {
        setRawEvents(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message)
        setRawEvents([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const normalizedSearch = search.trim().toLowerCase()

  const filteredEvents = rawEvents.filter((event) => {
    if (!normalizedSearch) return true
    const name = (event.nameEvent || '').toLowerCase()
    const location = (event.location || '').toLowerCase()
    return name.includes(normalizedSearch) || location.includes(normalizedSearch)
  })

  return (
    <div className="eventListFlex">
      {loading && <p>Caricamento eventi...</p>}
      {!loading && error && <p>Errore: {error}</p>}
      {!loading && !error && filteredEvents.map(event => (
        <EventCardComponent key={event._id} event={event} />
      ))}
      {!loading && !error && filteredEvents.length === 0 && <p>Nessun evento trovato.</p>}
    </div>
  )
}
