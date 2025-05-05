// src/app/map/page.tsx
"use client"; // Required for Map interaction

import { useState, useEffect } from 'react';
import MapComponent from '@/components/features/map-component'; // Assuming MapComponent exists
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, MapPin } from 'lucide-react';
import type { Place } from '@/services/geo'; // Import Place type

// Mock KDD Data - Replace with actual data fetching
const mockKdds: (Place & { time: string, description: string })[] = [
  {
    name: 'Friday Night Meet',
    location: { lat: 37.4275, lng: -122.1697 },
    time: 'Fri 8:00 PM',
    description: 'Weekly gathering at the old warehouse lot.',
  },
  {
    name: 'Golden Gate Cruise',
    location: { lat: 37.8199, lng: -122.4783 },
    time: 'Sat 2:00 PM',
    description: 'Scenic cruise starting near the bridge viewpoint.',
  },
  {
    name: 'Downtown Showdown',
    location: { lat: 37.7749, lng: -122.4194 }, // SF Downtown approx
    time: 'Sat 9:00 PM',
    description: 'Informal meetup at the multi-story car park.',
  },
];

export default function MapPage() {
  // State to hold KDD locations - Use Place[]
  const [kdds, setKdds] = useState<(Place & { time: string, description: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching KDD data
    const fetchKdds = async () => {
      setLoading(true);
      // Replace with actual API call if available
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setKdds(mockKdds);
      setLoading(false);
    };

    fetchKdds();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
      {/* Map Section */}
      <div className="flex-grow lg:w-2/3">
        <Card className="shadow-lg h-[60vh] lg:h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              KDD Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-0">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading Map...</p>
              </div>
            ) : (
               // Pass KDD locations (Places) to the MapComponent
              <MapComponent locations={kdds} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <div className="lg:w-1/3">
        <Card className="shadow-lg h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              Upcoming Meetups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading meetups...</p>
            ) : kdds.length > 0 ? (
              <ul className="space-y-4">
                {kdds.map((kdd) => (
                  <li key={kdd.name} className="border-b pb-3 last:border-b-0">
                    <h3 className="font-semibold text-foreground">{kdd.name}</h3>
                    <p className="text-sm text-muted-foreground">{kdd.description}</p>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-accent">{kdd.time}</span>
                      <span className="text-muted-foreground">
                        ({kdd.location.lat.toFixed(4)}, {kdd.location.lng.toFixed(4)})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming KDDs found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
