// src/components/features/map-component.tsx
"use client";

import { useState, useEffect } from 'react';
import type { Place } from '@/services/geo'; // Import Place type

interface MapComponentProps {
  locations: Place[]; // Expect an array of Place objects
}

// Placeholder Map Component
// TODO: Integrate with a real map library like @vis.gl/react-google-maps
// Requires setting up Google Maps API Key in environment variables

export default function MapComponent({ locations }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this only runs on the client
  }, []);

   // Calculate center (average lat/lng) - simple approach
   const center = locations.length > 0
     ? locations.reduce((acc, loc) => ({
         lat: acc.lat + loc.location.lat / locations.length,
         lng: acc.lng + loc.location.lng / locations.length,
       }), { lat: 0, lng: 0 })
     : { lat: 37.7749, lng: -122.4194 }; // Default to SF if no locations

   const zoom = locations.length > 0 ? 10 : 8; // Adjust zoom based on locations

  if (!isClient) {
    // Render a placeholder or nothing on the server
    return <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">Loading Map...</div>;
  }

  // Client-side only rendering
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
        <p className="font-semibold mb-2">Map Placeholder</p>
        <p>Map integration (e.g., Google Maps) needed here.</p>
        <p className="mt-2 text-xs">Center: ({center.lat.toFixed(2)}, {center.lng.toFixed(2)})</p>
        {locations.map(loc => (
          <div key={loc.name} className="absolute" style={{
             // Basic positioning based on lat/lng relative to center (VERY crude approximation)
             // A real map library handles projection correctly.
             left: `calc(50% + ${(loc.location.lng - center.lng) * 5}%)`, // Adjust multiplier for spread
             top: `calc(50% + ${(center.lat - loc.location.lat) * 5}%)`, // Adjust multiplier for spread
             transform: 'translate(-50%, -50%)',
          }}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin drop-shadow-md">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
             </svg>
             {/* <span className="text-xs bg-background/80 px-1 py-0.5 rounded" style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>{loc.name}</span> */}
          </div>
        ))}
      </div>
       {/* TODO: Replace above div with actual map component when API key is available
       Example using a hypothetical MapLib component:
       <MapLib apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} center={center} zoom={zoom}>
         {locations.map(loc => <Marker key={loc.name} position={loc.location} title={loc.name} />)}
       </MapLib>
       Remember to install the chosen map library (e.g., npm install @vis.gl/react-google-maps)
       and configure the API key in your .env.local file (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY)
       */}
    </div>
  );
}
