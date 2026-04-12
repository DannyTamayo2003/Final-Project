import React, { useState } from 'react'

export default function CreateEvent() {
  const [form, setForm] = useState({
    nameEvent: '',
    description: '',
    data: '',
    location: '',
    orario: '',
    descrizioneDettagliata: '',
    organizzatore: '',
    image: ''
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Preparazione dei dati per l'invio al backend
    const dataToSend = { ...form };

    // Gestione specifica per data:
    // Converti la stringa 'YYYY-MM-DD' in un oggetto con '$date' e formato ISO 8601
    if (form.data) {
      // Crea un oggetto Date dalla stringa YYYY-MM-DD
      const dataObject = new Date(form.data);
      // Assicurati che sia una data valida
      if (!isNaN(dataObject.getTime())) {
        dataToSend.data = dataObject.toISOString();
      } else {
        // Gestisci il caso in cui la data non è valida, se necessario
        console.error("Data di nascita non valida:", form.data);
        alert("Per favore, inserisci una data di nascita valida.");
        return; // Blocca l'invio del form
      }
    }

    // Qui puoi aggiungere la fetch per inviare i dati al backend
    try {
      const res = await fetch('http://localhost:3000/api/eventi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("userId")}` },
        body: JSON.stringify(dataToSend)
      })
      const dataRes = await res.json()
      if (res.ok) {
        alert('Evento creato con successo!')
        // Puoi reindirizzare alla home qui.
      } else {
        alert(dataRes.message || dataRes.error || 'Errore, evento non creato... riprova più tardi');
      }
    } catch (err) {
      console.error('Errore di rete o nella richiesta:', err);
      alert('Errore di rete. Controlla la tua connessione o riprova più tardi.');
    }
  }

  return (
    <form className="create-event-form" onSubmit={handleSubmit}>
      <h2>Crea un nuovo evento</h2>
      <div className="centered-label">
        <label>
          Nome evento:
          <input
            type="text"
            name="nameEvent"
            value={form.nameEvent}
            onChange={handleChange}
            required
            className="wide-input"
          />
        </label>
      </div>
      <label>
        Descrizione:
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>
      <div className="event-form-grid">
        <label>
          Data:
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Orario:
          <input
            type="text"
            name="orario"
            value={form.orario}
            onChange={handleChange}
          />
        </label>
        <label>
          Organizzatore:
          <input
            type="text"
            name="organizzatore"
            value={form.organizzatore}
            onChange={handleChange}
          />
        </label>
        <label>
          URL immagine:
          <input
            type='url'
            name="image"
            value={form.image}
            onChange={handleChange}
          />
        </label>
      </div>
      <label>
        Descrizione dettagliata:
        <textarea
          name="descrizioneDettagliata"
          value={form.descrizioneDettagliata}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Crea evento</button>
    </form>
  )
}