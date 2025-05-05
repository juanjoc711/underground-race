import PhotoGallery from '@/components/features/photo-gallery';
import PhotoUpload from '@/components/features/photo-upload';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  // Mock data for photos - replace with actual data fetching
  const photos = [
    { id: '1', url: 'https://picsum.photos/seed/car1/400/300', alt: 'Sleek sports car at night', dataAiHint: 'sports car night' },
    { id: '2', url: 'https://picsum.photos/seed/carmeet1/400/300', alt: 'Car meetup gathering under lights', dataAiHint: 'car meet night lights' },
    { id: '3', url: 'https://picsum.photos/seed/tunedcar/400/300', alt: 'Tuned car showing modifications', dataAiHint: 'tuned car modification' },
    { id: '4', url: 'https://picsum.photos/seed/racecar1/400/300', alt: 'Car drifting on a track', dataAiHint: 'car drift race track' },
    { id: '5', url: 'https://picsum.photos/seed/carinterior/400/300', alt: 'Custom car interior view', dataAiHint: 'car interior custom' },
    { id: '6', url: 'https://picsum.photos/seed/classiccar/400/300', alt: 'Restored classic car gleaming', dataAiHint: 'classic car restored' },
     { id: '7', url: 'https://picsum.photos/seed/car2/400/300', alt: 'Another sleek sports car at night', dataAiHint: 'sports car city night' },
    { id: '8', url: 'https://picsum.photos/seed/carmeet2/400/300', alt: 'Another car meetup gathering under lights', dataAiHint: 'car show outdoor' },
    { id: '9', url: 'https://picsum.photos/seed/tunedcar2/400/300', alt: 'Another tuned car showing modifications', dataAiHint: 'modified car engine' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Underground Rides Gallery</h1>
      <p className="text-center mb-8 text-muted-foreground">Share your ride, discover the scene.</p>

      <PhotoUpload />

      <Separator className="my-12" />

      <PhotoGallery photos={photos} />
    </div>
  );
}
