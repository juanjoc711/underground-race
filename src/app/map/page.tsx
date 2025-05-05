// src/app/map/page.tsx
"use client"; // Required for Map interaction

import { useState, useEffect } from 'react';
import MapComponent from '@/components/features/map-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, MapPin } from 'lucide-react';
import type { Place } from '@/services/geo';

// Mock KDD Data - Replace with actual data fetching
const mockKdds: (Place & { time: string, description: string })[] = [
  {
    name: 'Encuentro Sardinero Nocturno',
    location: { lat: 43.4730, lng: -3.7800 }, // El Sardinero approx
    time: 'Vie 9:00 PM',
    description: 'Reunión semanal en el parking de la playa.',
  },
  {
    name: 'Ruta Costera',
    location: { lat: 43.4650, lng: -3.8500 }, // Near Cabo Mayor approx
    time: 'Sáb 3:00 PM',
    description: 'Ruta panorámica por la costa oeste de Santander.',
  },
  {
    name: 'Polígono Candina Meet',
    location: { lat: 43.4500, lng: -3.8190 }, // Polígono Candina approx
    time: 'Sáb 10:00 PM',
    description: 'Encuentro informal en zona industrial.',
  },
];

export default function MapPage() {
  // Keep state for KDDs, but remove separate loading state for the map itself
  const [kdds, setKdds] = useState<(Place & { time: string, description: string })[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    const fetchKdds = async () => {
      setListLoading(true);
      // Simulate fetching data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setKdds(mockKdds);
      setListLoading(false);
    };

    fetchKdds();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Ensure the return statement correctly wraps the JSX
  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:px-6 lg:flex-row lg:px-8">
      {/* Map Section */}
      <div className="flex-grow lg:w-2/3">
        <Card className="h-[60vh] shadow-lg lg:h-[70vh]"> {/* Adjusted height */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ubicaciones KDD (Santander)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-0">
             {/* MapComponent now handles its own loading/error states */}
             <MapComponent locations={kdds} />
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <div className="lg:w-1/3">
        <Card className="h-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Próximos Encuentros
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <p className="text-muted-foreground">Cargando encuentros...</p>
            ) : kdds.length > 0 ? (
              <ul className="space-y-4">
                {kdds.map((kdd) => (
                  <li key={kdd.name} className="border-b pb-3 last:border-b-0">
                    <h3 className="font-semibold text-foreground">{kdd.name}</h3>
                    <p className="text-sm text-muted-foreground">{kdd.description}</p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-accent">{kdd.time}</span>
                      <span className="text-muted-foreground">
                        ({kdd.location.lat.toFixed(4)}, {kdd.location.lng.toFixed(4)})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No se encontraron próximos KDDs.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
