// src/app/social/page.tsx
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter, Twitch } from 'lucide-react'; // Using Twitch as a stand-in for TikTok/Snapchat
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, href: '#', description: 'Behind-the-scenes, event highlights, and community features.', bgColor: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500', textColor: 'text-white' },
  { name: 'YouTube', icon: Youtube, href: '#', description: 'Full documentary, exclusive interviews, and longer features.', bgColor: 'bg-red-600', textColor: 'text-white' },
  { name: 'Facebook', icon: Facebook, href: '#', description: 'Event announcements, discussions, and community group.', bgColor: 'bg-blue-600', textColor: 'text-white' },
  { name: 'Twitter', icon: Twitter, href: '#', description: 'Quick updates, news snippets, and live event coverage.', bgColor: 'bg-sky-500', textColor: 'text-white' },
  { name: 'TikTok / Snapchat', icon: Twitch, href: '#', description: 'Short clips, making-of moments, and trending content.', bgColor: 'bg-purple-600', textColor: 'text-white' }, // Using Twitch icon
];

export default function SocialPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary">Connect With Us</h1>
      <p className="text-center mb-10 text-muted-foreground">
        Follow Underground Rides across all platforms for exclusive content and updates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {socialPlatforms.map((platform) => (
          <Card key={platform.name} className={`overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300 ${platform.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-lg font-semibold ${platform.textColor}`}>{platform.name}</CardTitle>
              <platform.icon className={`h-6 w-6 ${platform.textColor} opacity-80`} />
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${platform.textColor} opacity-90 mb-4 min-h-[40px]`}>
                {platform.description}
              </p>
              <Button
                variant="secondary" // Use secondary variant for contrast on colored background
                size="sm"
                asChild
                className="bg-white/20 hover:bg-white/30 text-white border-none" // Custom styling for visibility
              >
                <Link href={platform.href} target="_blank" rel="noopener noreferrer">
                  Visit {platform.name}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
