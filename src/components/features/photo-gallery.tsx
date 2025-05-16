import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

// Interfaz extendida para incluir el usuario que subió la imagen
interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy?: string; // 👈 añadido
  dataAiHint?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <CardContent className="p-0 flex-grow">
            <div className="aspect-video relative w-full">
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                data-ai-hint={photo.dataAiHint}
              />
            </div>
          </CardContent>

          {/* Mostrar pie si hay descripción o autor */}
          {(photo.caption || photo.alt || photo.uploadedBy) && (
            <CardFooter className="p-3 pt-2 flex flex-col gap-1">
              {photo.caption && (
                <CardDescription className="text-xs text-muted-foreground truncate">
                  {photo.caption}
                </CardDescription>
              )}
              {photo.uploadedBy && (
                <CardDescription className="text-[11px] text-muted-foreground italic">
                  Subido por: {photo.uploadedBy}
                </CardDescription>
              )}
            </CardFooter>
          )}
        </Card>
      ))}
      {photos.length === 0 && (
        <p className="col-span-full text-center text-muted-foreground py-10">
          Aún no hay fotos. ¡Sé el primero en compartir!
        </p>
      )}
    </div>
  );
}
