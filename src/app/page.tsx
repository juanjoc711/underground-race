import { promises as fs } from 'fs';
import path from 'path';
import PhotoGallery from '@/components/features/photo-gallery';
import PhotoUpload from '@/components/features/photo-upload';
import { Separator } from '@/components/ui/separator';

interface PhotoMetadata {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  uploadedAt: string;
  dataAiHint?: string; // Keep this if needed for future AI features
}

// Function to fetch photo metadata from the local JSON file
async function getPhotos(): Promise<PhotoMetadata[]> {
  const metadataPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    const photos: PhotoMetadata[] = JSON.parse(data);
    // Sort by upload date, newest first
    return photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch (error: any) {
    // If the file doesn't exist or is invalid, return an empty array
    if (error.code === 'ENOENT') {
      console.log("Metadata file not found, returning empty array.");
      return [];
    }
    console.error("Error reading or parsing metadata.json:", error);
    return []; // Return empty array on error
  }
}


export default async function Home() {
  // Fetch photos dynamically
  const photos = await getPhotos();

  // Keep some default examples if no photos are uploaded yet
  const examplePhotos: PhotoMetadata[] = [
    // Use the provided blue Alpine car image as the main example
    { id: 'ex1', url: 'https://picsum.photos/seed/alpine-blue-car/800/600', alt: 'Blue Alpine sports car', dataAiHint: 'blue alpine sports car', uploadedAt: new Date().toISOString() },
    { id: 'ex2', url: 'https://picsum.photos/seed/musclecar1/600/400', alt: 'Classic American muscle car burnout', dataAiHint: 'classic muscle car burnout', uploadedAt: new Date().toISOString() },
    { id: 'ex3', url: 'https://picsum.photos/seed/eurotuner/600/400', alt: 'Lowered European tuner car', dataAiHint: 'lowered european tuner', uploadedAt: new Date().toISOString() },
    { id: 'ex4', url: 'https://picsum.photos/seed/nightmeet/600/400', alt: 'Cars gathered at a night meet', dataAiHint: 'car meet night parking lot', uploadedAt: new Date().toISOString() },
  ];

  // Combine fetched photos with examples if fetched list is empty, otherwise just show fetched photos
   const displayPhotos = photos.length > 0 ? photos : examplePhotos;


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Underground Rides Gallery</h1>
      <p className="text-center mb-8 text-muted-foreground">Share your ride, discover the scene.</p>

      {/* PhotoUpload component remains the same */}
      <PhotoUpload />

      <Separator className="my-12" />

       {/* Pass the dynamically fetched or example photos to the gallery */}
      <PhotoGallery photos={displayPhotos} />
    </div>
  );
}
