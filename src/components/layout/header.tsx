'use client';

import Link from 'next/link';
import { Car, Map, Camera, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { LogoutButton } from '@/components/auth/LogoutButton';

// Placeholder Logo SVG
const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="120" height="40" fill="currentColor" className="text-primary mr-4">
    <path d="M0 20 L15 5 L30 20 L15 35 Z" />
    <text x="35" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">UR</text>
  </svg>
);

export default function Header() {
  const { user } = useAuth(); // ✅ Contexto de autenticación

  const navItems = [
    { href: '/', label: 'Galería', icon: Camera },
    { href: '/map', label: 'Mapa KDD', icon: Map },
    { href: '/social', label: 'Social', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
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
          {user && <LogoutButton />} {/* ✅ Logout para escritorio */}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Menú</span>
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
                {user && <LogoutButton />} {/* ✅ Logout para móvil */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
