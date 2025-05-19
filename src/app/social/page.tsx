'use client';

import Link from 'next/link';
import { Instagram, Youtube, Twitter, Twitch, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthGate from '@/components/auth/AuthGate'; // 👈 Importar el AuthGate

const socialPlatforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/undergroundrace_/',
    description: 'Detrás de cámaras, destacados de eventos y features de la comunidad.',
    bgColor: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
    textColor: 'text-white',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://www.youtube.com/@Underground_Race',
    description: 'Documentales completos, entrevistas exclusivas y contenido extendido.',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://x.com/undergrace_1',
    description: 'Actualizaciones rápidas, noticias breves y cobertura de eventos en vivo.',
    bgColor: 'bg-sky-500',
    textColor: 'text-white',
  },
  {
    name: 'TikTok',
    icon: Twitch,
    href: 'https://www.tiktok.com/@_underground_race?lang=es',
    description: 'Clips cortos, momentos del making-of y contenido de tendencia.',
    bgColor: 'bg-black',
    textColor: 'text-white',
  },
];

export default function SocialPage() {
  return (
    <AuthGate> {/* 👈 Protegiendo el contenido */}
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary">Conecta Con Nosotros</h1>
        <p className="text-center mb-10 text-muted-foreground">
          Sigue a Underground Rides en todas las plataformas para contenido exclusivo y actualizaciones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {socialPlatforms.map((platform) => (
            <Card
              key={platform.name}
              className={`overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300 ${platform.bgColor}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-lg font-semibold ${platform.textColor}`}>{platform.name}</CardTitle>
                <platform.icon className={`h-6 w-6 ${platform.textColor} opacity-80`} />
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${platform.textColor} opacity-90 mb-4 min-h-[40px]`}>
                  {platform.description}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="bg-white/20 hover:bg-white/30 text-white border-none"
                >
                  <Link href={platform.href} target="_blank" rel="noopener noreferrer">
                    Visitar {platform.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGate>
  );
}
