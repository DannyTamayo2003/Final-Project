// EventCardComponent - Componente che visualizza la card predefinita

import React from 'react'
import { Link } from 'react-router-dom'
import FavoriteButtonComponent from './FavoriteButtonComponent'
import DetailButtonComponent from './DetailButtonComponent'
import '../style/DetailButtonStyle.css'

export default function EventCardComponent({ event }) {
  return (
    <div className="card" style={{ width: '18rem', minHeight: '200px' }}>
      <img src={event.image} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{event.nameEvent}</h5>
        <p className="card-text">{event.description}</p>
        <Link to={`/event/${event.id || event._id}`}>
          <DetailButtonComponent />
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <FavoriteButtonComponent event={event} />
        </div>
      </div>
    </div>
  )
}