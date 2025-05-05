import PhotoGallery from '@/components/features/photo-gallery';
import PhotoUpload from '@/components/features/photo-upload';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  // Updated example photos for the gallery
  const photos = [
    { id: '1', url: 'https://picsum.photos/seed/jdm1/600/400', alt: 'Modified JDM car drifting', dataAiHint: 'modified jdm drift' },
    { id: '2', url: 'https://picsum.photos/seed/musclecar1/600/400', alt: 'Classic American muscle car burnout', dataAiHint: 'classic muscle car burnout' },
    { id: '3', url: 'https://picsum.photos/seed/eurotuner/600/400', alt: 'Lowered European tuner car', dataAiHint: 'lowered european tuner' },
    { id: '4', url: 'https://picsum.photos/seed/nightmeet/600/400', alt: 'Cars gathered at a night meet', dataAiHint: 'car meet night parking lot' },
    { id: '5', url: 'https://picsum.photos/seed/supercar1/600/400', alt: 'Exotic supercar parked on street', dataAiHint: 'exotic supercar street' },
    { id: '6', url: 'https://picsum.photos/seed/offroad1/600/400', alt: 'Modified off-road truck on trail', dataAiHint: 'modified offroad truck trail' },
    { id: '7', url: 'https://picsum.photos/seed/enginebay/600/400', alt: 'Detailed engine bay modification', dataAiHint: 'car engine bay modified' },
    { id: '8', url: 'https://picsum.photos/seed/stancecar/600/400', alt: 'Car with aggressive stance fitment', dataAiHint: 'stance car wheels' },
    { id: '9', url: 'https://picsum.photos/seed/garagebuild/600/400', alt: 'Project car being built in a garage', dataAiHint: 'project car garage build' },
    { id: '10', url: 'https://picsum.photos/seed/trackday/600/400', alt: 'Sports car on a race track', dataAiHint: 'sports car race track day' },
    { id: '11', url: 'https://picsum.photos/seed/vintagecar/600/400', alt: 'Restored vintage car show', dataAiHint: 'vintage car show restored' },
    { id: '12', url: 'https://picsum.photos/seed/driftmissile/600/400', alt: 'Beaten up drift car in action', dataAiHint: 'drift missile car action' },
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
