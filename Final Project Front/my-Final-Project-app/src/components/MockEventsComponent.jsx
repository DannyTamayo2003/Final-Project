// MockEventsComponent - Componente che visualizza la card di ogni evento mock 

import React from 'react'
import { Link } from 'react-router-dom'
import '../style/MockEventsStyle.css'
import DetailButtonComponent from './DetailButtonComponent'
  
export default function MockEventsComponent({ events }) {
  return (
    <div className="mockEventsList">
      {events.map(event => (
        <div key={event.id} className="mockEventCard">
          <img src={event.img} alt={event.nome} />
          <h3>{event.nome}</h3>
          <p>{event.descrizione}</p>
          <Link to={`/event/${event.id}`}>
            <DetailButtonComponent />
          </Link>
        </div>
      ))}
    </div>
  )
}