'use client';

import { useState, useEffect } from "react";
import MapWithSearch from "@/components/features/MapWithSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, MapPin } from "lucide-react";
import type { Place } from "@/services/geo";
import AuthGate from "@/components/auth/AuthGate"; // 👈 importar AuthGate

const mockKdds: (Place & { time: string; description: string; link: string })[] = [
  {
    name: "Hostal La Biela",
    location: { lat: 43.473, lng: -3.78 },
    time: "Vie 9:00 PM",
    description: "Reunión informal entre participantes.",
    link: "https://maps.app.goo.gl/g5wXmTwvuSpTSiWk7?g_st=com.google.maps.preview.copy"
  },
  {
    name: 'The Bridge Tavern "LA FINCA"',
    location: { lat: 43.465, lng: -3.85 },
    time: "Sáb 3:00 PM",
    description: "Punto de encuentro para briefing general.",
    link: "https://maps.app.goo.gl/fYTK59wjm8AfPWbW8?g_st=com.google.maps.preview.copy"
  },
  {
    name: "Mirador Reocin",
    location: { lat: 43.45, lng: -3.819 },
    time: "Sáb 10:00 PM",
    description: "Encuentro informal en zona industrial.",
    link: "https://maps.app.goo.gl/hipWevSKR5AYN6rU9?g_st=com.google.maps.preview.copy"
  },
];

export default function MapPage() {
  const [kdds, setKdds] = useState(mockKdds);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    setListLoading(true);
    const timer = setTimeout(() => {
      setListLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddLocation = (newLoc: typeof mockKdds[0]) => {
    setKdds(prev => [...prev, newLoc]);
  };

  return (
    <AuthGate>
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
                      <a
                        href={kdd.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs"
                      >
                        Ver en Google Maps
                      </a>
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
    </AuthGate>
  );
}




