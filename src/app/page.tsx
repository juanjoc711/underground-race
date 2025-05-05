import * as React from 'react'; // Ensure React is imported
import { promises as fs } from 'fs';
import path from 'path';
import PhotoGallery from '@/components/features/photo-gallery';
import PhotoUpload from '@/components/features/photo-upload';
import { Separator } from '@/components/ui/separator';

// Ensure dynamic rendering and prevent data caching during development/SSR
export const revalidate = 0; // Set to 0 to disable caching for this page

interface PhotoMetadata {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  uploadedAt: string;
  dataAiHint?: string;
}

// Function to fetch photo metadata from the local JSON file
async function getPhotos(): Promise<PhotoMetadata[]> {
  const metadataPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
  console.log(`Attempting to read metadata from: ${metadataPath}`); // Log path
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    const photos: PhotoMetadata[] = JSON.parse(data);
    console.log(`Successfully read ${photos.length} photos from metadata.`); // Log success
    // Sort by upload date, newest first
    return photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch (error: any) {
    // If the file doesn't exist or is invalid, return an empty array
    if (error.code === 'ENOENT') {
      console.log("Metadata file not found, returning empty array.");
      // Create an empty metadata file if it doesn't exist
      try {
        await fs.writeFile(metadataPath, JSON.stringify([], null, 2));
        console.log("Created empty metadata.json file.");
      } catch (writeError) {
        console.error("Error creating empty metadata.json:", writeError);
      }
      return [];
    }
    console.error("Error reading or parsing metadata.json:", error);
    return []; // Return empty array on other errors
  }
}


export default async function Home() {
  // Fetch photos dynamically
  const photos = await getPhotos();

  // Example photos to show if no uploads exist or fetching fails
  // These use the actual uploaded images now as primary examples if metadata is empty
  const examplePhotos: PhotoMetadata[] = [
    {
      id: '1638e2d5-2930-4e5b-8276-a9456c7609d4', // Use actual ID from metadata
      url: '/uploads/40ca4bc5-a242-4584-9ed2-71fa63e5b0b1.jpg', // Use actual path
      alt: 'Camaro',
      caption: 'Camaro',
      uploadedAt: '2025-05-05T21:46:18.362Z', // Use actual timestamp
      dataAiHint: 'red chevrolet camaro zl1',
    },
    {
      id: 'd852dbb3-f604-4c7c-813b-520e6549235a', // Use actual ID
      url: '/uploads/a882e851-eae5-49b2-88c0-b97a679a4d3f.jpg', // Use actual path
      alt: 'Porsche',
      caption: 'Porsche',
      uploadedAt: '2025-05-05T21:46:41.343Z', // Use actual timestamp
      dataAiHint: 'black porsche 911 turbo classic',
    },
    { id: 'ex1', url: 'https://picsum.photos/seed/blue-alpine-car/800/600', alt: 'Blue Alpine sports car', dataAiHint: 'blue alpine sports car', uploadedAt: new Date().toISOString() },
    { id: 'ex2', url: 'https://picsum.photos/seed/orange-supra-drift/800/600', alt: 'Orange Toyota Supra drifting', dataAiHint: 'orange toyota supra drift smoke', uploadedAt: new Date().toISOString() },
    // Keep a couple of picsum as further fallbacks if needed
  ];


  // Combine fetched photos with examples if fetched list is empty, otherwise just show fetched photos
   const displayPhotos = photos.length > 0 ? photos : examplePhotos;
   console.log(`Displaying ${displayPhotos.length} photos. ${photos.length > 0 ? 'Using uploaded photos.' : 'Using example photos.'}`);


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Underground Rides Gallery</h1>
      <p className="text-center mb-8 text-muted-foreground">Share your ride, discover the scene.</p>

      {/* PhotoUpload component */}
      <PhotoUpload />

      <Separator className="my-12" />

       {/* Pass the dynamically fetched or example photos to the gallery */}
      <PhotoGallery photos={displayPhotos} />
    </div>
  );
}
