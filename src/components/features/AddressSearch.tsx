'use client';

import { useState } from 'react';

interface AddressSearchProps {
  onLocationSelected: (lat: number, lon: number, name: string) => void;
}

export default function AddressSearch({ onLocationSelected }: AddressSearchProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    if (!address.trim()) {
      setError('Por favor, ingresa una dirección');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error('Error en la respuesta de búsqueda');
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError('No se encontró ninguna ubicación para esa dirección');
      } else {
        const place = data[0];
        if (!place.lat || !place.lon) {
          setError('Datos de ubicación incompletos');
        } else {
          onLocationSelected(parseFloat(place.lat), parseFloat(place.lon), address);
          setAddress(''); // limpia input al añadir
        }
      }
    } catch (err) {
      setError('Error al buscar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Escribe una dirección o lugar"
        className="border px-3 py-2 rounded w-full text-black"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}



