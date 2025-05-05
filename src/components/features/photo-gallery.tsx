import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'; // Added CardDescription, CardFooter

// Interface matches the structure in metadata.json
interface Photo {
  id: string;
  url: string; // This will be the public path like /uploads/image.jpg
  alt: string;
  caption?: string; // Make caption optional
  uploadedAt: string; // Keep if needed, maybe for sorting or display
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
            <div className="aspect-video relative w-full"> {/* Use aspect-video for consistent ratio */}
              <Image
                // URL is now relative to the public folder, Next.js handles this
                src={photo.url}
                alt={photo.alt}
                fill // Use fill for responsive images within the aspect ratio container
                style={{ objectFit: 'cover' }} // Ensure image covers the area
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                data-ai-hint={photo.dataAiHint}
                // Add unoptimized prop if using external URLs (like picsum) alongside local ones,
                // or configure next.config.js domains properly. For purely local, it's often not needed.
                // unoptimized={photo.url.startsWith('https://')}
              />
            </div>
          </CardContent>
           {/* Optionally add captions or user info here */}
           {(photo.caption || photo.alt !== `Uploaded image ${photo.url.split('/').pop()}`) && ( // Show footer if caption exists OR alt isn't default
              <CardFooter className="p-3 pt-2">
                <CardDescription className="text-xs text-muted-foreground truncate">
                    {/* Display caption if available, otherwise the alt text */}
                    {photo.caption || photo.alt}
                </CardDescription>
              </CardFooter>
            )}
        </Card>
      ))}
      {photos.length === 0 && (
        <p className="col-span-full text-center text-muted-foreground py-10">
            No photos yet. Be the first to share!
        </p>
      )}
    </div>
  );
}
