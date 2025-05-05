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
    name: 'Encuentro Viernes Noche',
    location: { lat: 37.4275, lng: -122.1697 },
    time: 'Vie 8:00 PM',
    description: 'Reunión semanal en el lote del antiguo almacén.',
  },
  {
    name: 'Ruta Golden Gate',
    location: { lat: 37.8199, lng: -122.4783 },
    time: 'Sáb 2:00 PM',
    description: 'Ruta panorámica comenzando cerca del mirador del puente.',
  },
  {
    name: 'Showdown Centro Ciudad',
    location: { lat: 37.7749, lng: -122.4194 }, // SF Downtown approx
    time: 'Sáb 9:00 PM',
    description: 'Encuentro informal en el parking de varias plantas.',
  },
];

export default function MapPage() {
  const [kdds, setKdds] = useState<(Place & { time: string, description: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKdds = async () => {
      setLoading(true);
      // Simulate fetching data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setKdds(mockKdds);
      setLoading(false);
    };

    fetchKdds();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:px-6 lg:flex-row lg:px-8">
      {/* Map Section */}
      <div className="flex-grow lg:w-2/3">
        <Card className="h-[60vh] shadow-lg lg:h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ubicaciones KDD {/* Spanish translation */}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-0">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Cargando Mapa...</p> {/* Spanish translation */}
              </div>
            ) : (
              <MapComponent locations={kdds} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <div className="lg:w-1/3">
        <Card className="h-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Próximos Encuentros {/* Spanish translation */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Cargando encuentros...</p> {/* Spanish translation */}
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
              <p className="text-muted-foreground">No se encontraron próximos KDDs.</p> {/* Spanish translation */}
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
