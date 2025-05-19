"use client";

import { useState } from "react";
import MapComponent from "./map-component"; // Pon la ruta correcta

interface Location {
  name: string;
  location: { lat: number; lng: number };
}

// Función para geocoding usando la API de Google Maps
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0].geometry.location;
  }
  return null;
}

export default function EventWithMap() {
  const [inputText, setInputText] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);

  const handleAddLocation = async () => {
    if (!inputText.trim()) {
      alert("Escribe la ubicación del evento");
      return;
    }

    const coords = await geocodeAddress(inputText);
    if (!coords) {
      alert("No se pudo obtener las coordenadas para esa dirección");
      return;
    }

    setLocations((prev) => [...prev, { name: inputText, location: coords }]);
    setInputText("");
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Ej: Quedada Sábado 5, en Peñacastillo"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: "70%", padding: "0.5rem" }}
        />
        <button onClick={handleAddLocation} style={{ padding: "0.5rem 1rem", marginLeft: "1rem" }}>
          Añadir Evento
        </button>
      </div>

      <MapComponent locations={locations} />
    </div>
  );
}
