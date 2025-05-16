import * as React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import PhotoGallery from '@/components/features/photo-gallery';
import PhotoUpload from '@/components/features/photo-upload';
import { Separator } from '@/components/ui/separator';
import AuthGate from '@/components/auth/AuthGate'; // ✅ Nuevo import

// Ensure dynamic rendering and prevent data caching during development/SSR
export const revalidate = 0;

interface PhotoMetadata {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  uploadedAt: string;
  dataAiHint?: string;
}

async function getPhotos(): Promise<PhotoMetadata[]> {
  const metadataPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
  console.log(`Intentando leer metadatos desde: ${metadataPath}`);
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    const photos: PhotoMetadata[] = JSON.parse(data);
    console.log(`Se leyeron ${photos.length} fotos de los metadatos.`);
    return photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log("Archivo de metadatos no encontrado, devolviendo array vacío.");
      try {
        await fs.writeFile(metadataPath, JSON.stringify([], null, 2));
        console.log("Creado archivo metadata.json vacío.");
      } catch (writeError) {
        console.error("Error creando metadata.json vacío:", writeError);
      }
      return [];
    }
    console.error("Error leyendo o parseando metadata.json:", error);
    return [];
  }
}

export default async function Home() {
  const photos = await getPhotos();

  const examplePhotos: PhotoMetadata[] = [
    {
      id: '1638e2d5-2930-4e5b-8276-a9456c7609d4',
      url: '/uploads/40ca4bc5-a242-4584-9ed2-71fa63e5b0b1.jpg',
      alt: 'Camaro Rojo',
      caption: 'Camaro Rojo ZL1',
      uploadedAt: '2025-05-05T21:46:18.362Z',
      dataAiHint: 'red chevrolet camaro zl1',
    },
    {
      id: 'd852dbb3-f604-4c7c-813b-520e6549235a',
      url: '/uploads/a882e851-eae5-49b2-88c0-b97a679a4d3f.jpg',
      alt: 'Porsche Negro Clásico',
      caption: 'Porsche 911 Turbo Clásico',
      uploadedAt: '2025-05-05T21:46:41.343Z',
      dataAiHint: 'black porsche 911 turbo classic',
    },
    {
      id: '3a5c73b7-9d77-48e4-8409-cceb1708c386',
      url: '/uploads/d5e9fdc1-afd7-4acd-a49b-d812332fcb15.jpg',
      alt: 'BMW M3 Azul',
      caption: 'BMW M3 Competición Azul',
      uploadedAt: '2025-05-05T21:40:54.991Z',
      dataAiHint: 'blue bmw m3 competition',
    },
    {
      id: '63b2d351-31f9-4d31-a609-eee347d8043a',
      url: '/uploads/747c3356-8eb0-42f0-9c18-891a26b28ac7.jpg',
      alt: 'Nissan GT-R Blanco',
      caption: 'Nissan GT-R Nismo Blanco',
      uploadedAt: '2025-05-05T21:41:04.801Z',
      dataAiHint: 'white nissan gtr nismo',
    },
  ];

  const displayPhotos = photos.length > 0 ? photos : examplePhotos;
  console.log(`Mostrando ${displayPhotos.length} fotos. ${photos.length > 0 ? 'Usando fotos subidas.' : 'Usando fotos de ejemplo.'}`);

  return (
    <AuthGate> {/* ✅ Protegido por autenticación */}
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Galería Underground Rides</h1>
        <p className="text-center mb-8 text-muted-foreground">Comparte tu coche, descubre la escena.</p>

        <PhotoUpload />

        <Separator className="my-12" />

        <PhotoGallery photos={displayPhotos} />
      </div>
    </AuthGate>
  );
}
