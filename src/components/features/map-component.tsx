// src/components/features/map-component.tsx
"use client";

import { useState, useEffect } from 'react';
import type { Place } from '@/services/geo';

interface MapComponentProps {
  locations: Place[];
}

export default function MapComponent({ locations }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

   const center = locations.length > 0
     ? locations.reduce((acc, loc) => ({
         lat: acc.lat + loc.location.lat / locations.length,
         lng: acc.lng + loc.location.lng / locations.length,
       }), { lat: 0, lng: 0 })
     : { lat: 37.7749, lng: -122.4194 };

   const zoom = locations.length > 0 ? 10 : 8;

  if (!isClient) {
    return <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">Cargando Mapa...</div>; // Traducción
  }

  return (
    <div className="w-full h-full bg-muted/50 border border-border rounded-md relative overflow-hidden">
      {/* Basic Placeholder Visual */}
      <div
        style={{
           width: '100%',
           height: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           flexDirection: 'column',
           textAlign: 'center',
           color: 'hsl(var(--muted-foreground))',
           fontSize: '0.9rem',
           padding: '1rem',
           backgroundImage: 'radial-gradient(hsl(var(--border)) 1px, transparent 1px)',
           backgroundSize: '20px 20px',
        }}
      >
        <p className="font-semibold mb-2">Marcador de Posición del Mapa</p> {/* Traducción */}
        <p>Aquí se necesita la integración del mapa (ej., Google Maps).</p> {/* Traducción */}
        <p className="mt-2 text-xs">Centro: ({center.lat.toFixed(2)}, {center.lng.toFixed(2)})</p>
        {locations.map(loc => (
          <div key={loc.name} className="absolute" style={{
             left: `calc(50% + ${(loc.location.lng - center.lng) * 5}%)`,
             top: `calc(50% + ${(center.lat - loc.location.lat) * 5}%)`,
             transform: 'translate(-50%, -50%)',
          }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin drop-shadow-md">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
             </svg>
          </div>
        ))}
      </div>
       {/* TODO: Reemplazar div anterior con componente de mapa real cuando la clave API esté disponible */}
    </div>
  );
}
