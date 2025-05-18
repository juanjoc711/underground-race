'use client';

import { useState, useEffect } from 'react';
import AddressSearch from './AddressSearch';
import MapComponent from './map-component';
import { Place } from '@/services/geo';

interface MapWithSearchProps {
  initialLocations: (Place & { time: string; description: string; link: string })[];
  onAddLocation: (newLoc: Place & { time: string; description: string; link: string }) => void;
}

export default function MapWithSearch({
  initialLocations,
  onAddLocation,
}: MapWithSearchProps) {
  const [locations, setLocations] = useState<(Place & { time: string; description: string; link: string })[]>([]);

  // Estado para la ubicación recién seleccionada en AddressSearch
  const [pendingLocation, setPendingLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // Campos para la hora, descripción y link que el usuario pone antes de añadir
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setLocations(initialLocations);
  }, [initialLocations]);

  // Cuando seleccionan ubicación en AddressSearch
  const handleLocationSelected = (lat: number, lon: number, name: string) => {
    setPendingLocation({ lat, lng: lon, name });
    setTime('');
    setDescription('');
    setLink('');
  };

  // Cuando el usuario confirma añadir la ubicación con info extra
  const handleAddLocation = () => {
    if (!pendingLocation) return;
    if (!link.trim()) {
      alert('Por favor, añade un link válido');
      return;
    }

    const newLocation = {
      name: pendingLocation.name,
      location: { lat: pendingLocation.lat, lng: pendingLocation.lng },
      time: time || 'Hora no definida',
      description: description || 'Sin descripción',
      link: link.trim(),
    };

    setLocations((prev) => [...prev, newLocation]);
    onAddLocation(newLocation);

    // Reset
    setPendingLocation(null);
    setTime('');
    setDescription('');
    setLink('');
  };

  return (
    <div className="space-y-4">
      <AddressSearch onLocationSelected={handleLocationSelected} />

      {/* Mostrar formulario solo si hay ubicación pendiente */}
      {pendingLocation && (
        <div className="flex flex-col gap-2 border rounded p-4 bg-gray-50">
          <p className="font-semibold">Añadir información para: {pendingLocation.name}</p>

          <label className="text-sm font-medium">Hora</label>
          <input
            type="text"
            className="rounded border px-3 py-1 text-black bg-white"
            placeholder="Ej: Sáb 10:00 PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label className="text-sm font-medium">Descripción</label>
          <input
            type="text"
            className="rounded border px-3 py-1 text-black bg-white"
            placeholder="Ej: Encuentro en parking del centro"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="text-sm font-medium">Link de la ubicación</label>
          <input
            type="url"
            className="rounded border px-3 py-1 text-black bg-white"
            placeholder="Ej: https://maps.app.goo.gl/abc123"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <button
            onClick={handleAddLocation}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Añadir ubicación
          </button>
        </div>
      )}

      <div style={{ height: '400px' }}>
        <MapComponent locations={locations} />
      </div>
    </div>
  );
}




