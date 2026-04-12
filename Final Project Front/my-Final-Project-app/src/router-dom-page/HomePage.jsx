import React, { useEffect, useState } from 'react'
import '../style/HomePageStyle.css'

import { Link } from 'react-router-dom'

import FeaturedCardComponent from '../components/FeaturedCardComponent'
import EventCardComponent from '../components/EventCardComponent'
import MockEventsComponent from '../components/MockEventsComponent'

//import mockEvents data
import mockEvents from '../mocks/MockEvents'

// Dati manuali per l'evento in evidenza (puoi anche prenderlo dal backend se vuoi)
const featuredEvent = {
    id: 1,
    nome: "Music Festival",
    data: "2023-10-15",
    location: "Central Park, NY",
    descrizione: "Join us for a day of music and fun!"
}



export default function HomePage() {
    const [homeEvents, setHomeEvents] = useState([])
    // Stato per login (esempio: true se c'è userId in localStorage)
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"))
    // Stato per i preferiti dell'utente loggato
    const [favorites, setFavorites] = useState([])

    // Funzione per aggiungere/rimuovere preferiti
    const toggleFavorite = (eventId) => {
        if (!isLoggedIn) return;
        setFavorites(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    }

    useEffect(() => {
        fetch('http://localhost:3000/api/eventi')
            .then(res => res.json())
            .then(data => setHomeEvents(data))
            .catch(err => console.error('Errore nel caricamento eventi:', err))
    }, [])

    // Render della pagina principale con evento in evidenza, lista eventi e icone
    return (
        <>
            <div id='mainContainer'>
                <h1>STREET AND RACE</h1>


                <div id='mainEventCard' className="event-flex-row">


                    <div className="featured-col">
                        <div id="titleFeaturedEvent">
                            <h2>in evidenzia</h2>
                        </div>
                        <FeaturedCardComponent />
                    </div>
                    <div id='eventDetailsContainer'>
                        <div id='eventDetails'>
                            <h2>Event Details</h2>
                            <p><span>Event Name:</span> {featuredEvent.nome}</p>
                            <p><span>Date:</span> {featuredEvent.data}</p>
                            <p><span>Location:</span> {featuredEvent.location}</p>
                            <p><span>Description:</span> {featuredEvent.descrizione}</p>
                        </div>
                    </div>
                </div>

                {/* Sezione lista eventi */}
                <div>
                    <h2>I nostri eventi</h2>
                    <MockEventsComponent events={mockEvents.slice(0, 3)} />
                </div>

                {/* Sezione icone */}
                <div id='iconContainer'>
                    <div className='containerIconText'>
                        <Link to="/eventpage" className="icon-link">
                            <ion-icon name="calendar-outline" class="icon"></ion-icon>
                        </Link>
                        <h6><span>1.</span> Location</h6>
                    </div>
                    <div className='containerIconText'>
                        <ion-icon name="share-social-sharp" class="icon"></ion-icon>
                        <h6><span>2.</span> Share</h6>
                    </div>
                    {/* 
                    <div className='containerIconText'>
                        <ion-icon name="map-outline" class="icon"></ion-icon>
                        <h6><span>2.</span> Location</h6>
                    </div> 
                    */}
                </div>
            </div>
        </>
    )
}