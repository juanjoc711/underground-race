import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter, Twitch } from 'lucide-react'; // Added Twitter and Twitch (similar to TikTok/Snapchat)

const socialLinks = [
  { platform: 'Instagram', icon: Instagram, href: '#' }, // Replace # with actual links
  { platform: 'Facebook', icon: Facebook, href: '#' },
  { platform: 'YouTube', icon: Youtube, href: '#' },
  { platform: 'Twitter', icon: Twitter, href: '#' }, // Representing TikTok/Twitter/Snapchat
   // Add more as needed
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Underground Race. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Proceeds support traffic victim NGOs.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <Link key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.platform}>
              <social.icon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
