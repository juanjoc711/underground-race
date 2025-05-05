import Link from 'next/link';
import { Car, Map, Camera, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image'; // Import next/image

// Placeholder Logo SVG - Replace with actual logo if available
const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="120" height="40" fill="currentColor" className="text-primary mr-4">
    {/* Simplified representation of the logo from the website */}
    <path d="M0 20 L15 5 L30 20 L15 35 Z" />
    <text x="35" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">UR</text>
  </svg>
);


export default function Header() {
  const navItems = [
    { href: '/', label: 'Galería', icon: Camera }, // Traducción
    { href: '/map', label: 'Mapa KDD', icon: Map }, // Traducción
    { href: '/social', label: 'Social', icon: Users },
    // Add more links as needed based on website structure (Noticias, Equipo, etc.)
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Use the actual logo image if available, otherwise use SVG */}
           {/*<Image src="/logo.png" alt="Underground Race Logo" width={120} height={40} className="mr-4" />*/}
           <Logo /> {/* Remove this if using Image */}
          <span className="hidden font-bold sm:inline-block text-foreground">Underground Rides</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Menú</span> {/* Traducción */}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center mb-4">
                  <Logo />
                  <span className="font-bold text-foreground">Underground Rides</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
