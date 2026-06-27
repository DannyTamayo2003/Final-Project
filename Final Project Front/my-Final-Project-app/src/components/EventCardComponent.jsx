/*
 * EventCardComponent.jsx — Card singolo evento
 * Mostra immagine, nome e descrizione di un evento.
 * Il click su "Dettagli" passa l'intero oggetto evento alla pagina di dettaglio
 * tramite router state, evitando una fetch aggiuntiva.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import FavoriteButtonComponent from './FavoriteButtonComponent'
import DetailButtonComponent from './DetailButtonComponent'
import '../style/DetailButtonStyle.css'

export default function EventCardComponent({ event }) {
  return (
    <div className="card" style={{ width: '18rem', border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>

      {/* Immagine in formato 4:5 (1080x1350) come Instagram */}
      <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
        <img
          src={event.image || 'https://placehold.co/400x500?text=Nessuna+immagine'}
          alt={event.nameEvent}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div className="card-body" style={{ padding: '12px 14px' }}>
        <h5 className="card-title" style={{ fontSize: '1rem', marginBottom: '4px' }}>{event.nameEvent}</h5>

        {/* Descrizione troncata a 2 righe */}
        <p className="card-text" style={{
          fontSize: '0.82rem',
          color: '#666',
          marginBottom: '10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </p>

        {/* Bottoni affiancati */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to={`/event/${event._id}`} state={{ event }} style={{ flex: 1 }}>
            <DetailButtonComponent />
          </Link>
          <FavoriteButtonComponent event={event} />
        </div>
      </div>

    </div>
  )
}
