import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface Photo {
  id: string;
  url: string;
  alt: string;
  dataAiHint?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="aspect-w-16 aspect-h-9 relative">
              <Image
                src={photo.url}
                alt={photo.alt}
                fill // Use fill for responsive images within the aspect ratio container
                style={{ objectFit: 'cover' }} // Ensure image covers the area
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                data-ai-hint={photo.dataAiHint}
              />
            </div>
            {/* Optionally add captions or user info here */}
            {/* <div className="p-2 text-xs text-muted-foreground">
              <p>{photo.alt}</p>
            </div> */}
          </CardContent>
        </Card>
      ))}
      {photos.length === 0 && (
        <p className="col-span-full text-center text-muted-foreground">No photos yet. Be the first to share!</p>
      )}
    </div>
  );
}
