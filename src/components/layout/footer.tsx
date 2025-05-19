import Link from 'next/link';
import { Instagram, Youtube, Twitter } from 'lucide-react'; // Eliminado Twitch

const socialLinks = [
  { platform: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/undergroundrace_/', }, // Actualizado
  { platform: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@Underground_Race', },
  { platform: 'Twitter', icon: Twitter, href: 'https://x.com/undergrace_1' }, // Actualizado
  // TikTok eliminado
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            
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

