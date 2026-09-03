"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import { useState } from "react";
import "./SportsBanner.css";

const SPORTS_SITE_URL = "https://liast26.naevyn.com";
const EVENT_DATE = new Date("2026-09-19T23:59:59-04:00");

export default function SportsBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || new Date() > EVENT_DATE) return null;

  return (
    <aside className="sports-banner" aria-label="Sports tournament announcement">
      <div className="sports-banner-photo" aria-hidden="true" />

      <div className="sports-banner-inner">
        <div className="sports-banner-title">
          <div className="sports-banner-eyebrow">3rd Annual Love In Action</div>
          <div className="sports-banner-heading">Sports Tournament</div>
        </div>

        <div className="sports-banner-details">
          <div><CalendarDays aria-hidden="true" />Saturday, September 19, 2026</div>
          <div><Clock3 aria-hidden="true" />1:00 PM – 11:00 PM</div>
          <div><MapPin aria-hidden="true" />JFK High School, Maryland</div>
        </div>

        <div className="sports-banner-description">
          <strong>A Christian community sports day.</strong>
          <span>
            Team sports are invite-only; individual sports and volunteering are
            open to sign up.
          </span>
        </div>

        <div className="sports-banner-actions">
          <a
            href={SPORTS_SITE_URL}
            className="sports-register-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go Register <ArrowRight aria-hidden="true" />
          </a>
          <a
            href={SPORTS_SITE_URL}
            className="sports-site-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Sports Site <ExternalLink aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className="sports-banner-close"
          onClick={() => setIsVisible(false)}
          aria-label="Close sports tournament announcement"
        >
          <X aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
