import React from 'react'
import '../style/ContactsStyle.css'

export default function ContactsPage() {
  return (
    <div className="ct-page">

      {/* CARD INSTAGRAM */}
      <div className="ct-body">
        <div className="ct-ig-card">
          <div className="ct-ig-icon-wrap">
            <ion-icon name="logo-instagram" class="ct-ig-icon"></ion-icon>
          </div>
          <div className="ct-ig-handle">@streetandrace</div>
          <p className="ct-ig-desc">
            Post, stories e reel sugli eventi automobilistici italiani.<br />
            Car meeting, raduni, motorsport e molto altro.
          </p>
          <a
            href="https://instagram.com/streetandrace"
            target="_blank"
            rel="noopener noreferrer"
            className="ct-ig-btn"
          >
            <ion-icon name="logo-instagram"></ion-icon>
            Seguici su Instagram
          </a>
        </div>

        {/* CHI SIAMO */}
        <div className="ct-about-card">
          <div className="ct-about-label">Chi siamo</div>
          <p className="ct-about-text">
            Street &amp; Race è una piattaforma per la scoperta e la gestione di eventi automobilistici in Italia.
            Gli utenti possono creare, scoprire e salvare car meeting, raduni e eventi motorsport nella propria zona.
          </p>
          <div className="ct-about-meta">
            <span className="ct-about-badge">Progetto Demo</span>
            <span className="ct-about-badge">v1.0 — 2026</span>
          </div>
        </div>
      </div>

    </div>
  )
}
