"use client";

import { useState, useEffect } from "react";
import MapWithSearch from "@/components/features/MapWithSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, MapPin } from "lucide-react";
import type { Place } from "@/services/geo";

const mockKdds: (Place & { time: string; description: string })[] = [
  {
    name: "Encuentro Sardinero Nocturno",
    location: { lat: 43.473, lng: -3.78 },
    time: "Vie 9:00 PM",
    description: "Reunión semanal en el parking de la playa.",
  },
  {
    name: "Ruta Costera",
    location: { lat: 43.465, lng: -3.85 },
    time: "Sáb 3:00 PM",
    description: "Ruta panorámica por la costa oeste de Santander.",
  },
  {
    name: "Polígono Candina Meet",
    location: { lat: 43.45, lng: -3.819 },
    time: "Sáb 10:00 PM",
    description: "Encuentro informal en zona industrial.",
  },
];

export default function MapPage() {
  const [kdds, setKdds] = useState(mockKdds);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    setListLoading(true);
    // Simula carga de datos
    const timer = setTimeout(() => {
      setListLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddLocation = (newLoc: typeof mockKdds[0]) => {
    setKdds(prev => [...prev, newLoc]);
  };

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:px-6 lg:flex-row lg:px-8">
      <div className="flex-grow lg:w-2/3">
        <Card className="h-[70vh] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ubicaciones KDD (Santander)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-0">
            <MapWithSearch initialLocations={kdds} onAddLocation={handleAddLocation} />
          </CardContent>
        </Card>
      </div>

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
                {kdds.map(kdd => (
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

