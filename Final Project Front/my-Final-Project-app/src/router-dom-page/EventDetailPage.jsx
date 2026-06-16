// EventDetailPage.jsx
import { useLocation, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import mockEvents from '../mocks/MockEvents'
import '../style/EventDetailStyle.css'


export default function EventDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Se arriviamo dalla card, usiamo subito l'evento passato nello state del router.
    // Questo evita una fetch inutile e funziona bene anche per gli eventi esterni.
    if (location.state?.event) {
      setEvent(location.state.event)
      setLoading(false)
      return
    }

    // Fallback 1: eventi mock usati in alcune parti vecchie del progetto.
    const mockEvent = mockEvents.find(e => String(e.id) === String(id))
    if (mockEvent) {
      setEvent(mockEvent)
      setLoading(false)
      return
    }

    // Fallback 2: se non abbiamo lo state e non troviamo il mock, proviamo la fetch API locale.
    fetch(`http://localhost:3000/api/eventi/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Evento non trovato')
        return res.json()
      })
      .then(data => {
        setEvent(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id, location.state])

  if (loading) return <div>Caricamento...</div>
  if (error) return <div>{error}</div>
  if (!event) return <div>Evento non trovato</div>

  return (
    <div className="eventDetailHero">
      <div
        className="eventDetailBg"
        style={{
          backgroundImage: `url(${event.img || event.image})`
        }}
      />
      <div className="eventDetailContent">
        <h1 className="eventDetailTitle">{event.nome || event.nameEvent}</h1>
        <h3 className="eventDetailSubtitle">{event.descrizione || event.description}</h3>
        
        <div className="eventDetailInfoList">
          {event.location && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Luogo:</span>
              {event.location}
            </div>
          )}
          {event.indirizzo && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Indirizzo:</span>
              {event.indirizzo} {event.cap && `- ${event.cap}`}
            </div>
          )}
          {/* I campi geo arrivano dal backend esterno e servono anche per il filtro nella search bar. */}
          {event.geoRegion && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Regione:</span>
              {event.geoRegion}
            </div>
          )}
          {event.geoProvince && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Provincia:</span>
              {event.geoProvince}
            </div>
          )}
          {event.categoria && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Categoria:</span>
              {event.categoria} {event.sottocategoria && `(${event.sottocategoria})`}
            </div>
          )}
          {event.data && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Data:</span>
              {event.data}
            </div>
          )}
          {event.orario && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Orario:</span>
              {event.orario}
            </div>
          )}
          {event.prezzoMin && event.prezzoMax && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Prezzo:</span>
              €{event.prezzoMin} - €{event.prezzoMax}
            </div>
          )}
          {event.stato && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Stato:</span>
              {event.stato === 'active' ? '✓ In vendita' : event.stato}
            </div>
          )}
          {event.descrizioneDettagliata && (
            <div className="eventDetailRow eventDetailDettagliata">
              <span className="eventDetailLabel">Descrizione dettagliata:</span>
              {event.descrizioneDettagliata}
            </div>
          )}
          {event.organizzatore && (
            <div className="eventDetailRow">
              <span className="eventDetailLabel">Organizzatore:</span>
              {event.organizzatore}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}