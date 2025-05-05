import Link from 'next/link';
import { Instagram, Youtube, Twitter, Twitch } from 'lucide-react'; // Using Twitch for TikTok

const socialLinks = [
  { platform: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/undergroundrace_?igsh=a2c0OXNqdHcxOWc4' }, // Actualizado
  { platform: 'YouTube', icon: Youtube, href: '#' },
  { platform: 'Twitter', icon: Twitter, href: 'https://x.com/undergroundrace' }, // Actualizado
  { platform: 'TikTok', icon: Twitch, href: 'https://www.tiktok.com/@_underground_race?_t=ZN-8w776nJIoFi&_r=1' }, // Actualizado, usando icono Twitch
   // Eliminado Facebook
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Underground Race. Todos los derechos reservados. {/* Traducción */}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Los beneficios apoyan a ONGs de víctimas de tráfico. {/* Traducción */}
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
