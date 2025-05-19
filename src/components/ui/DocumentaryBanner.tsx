'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DocumentaryBanner() {
  const pathname = usePathname();

  if (pathname === '/documental') return null; // No mostrar el banner aquí

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 text-center text-sm z-50">
      🎬 <strong>¡Nuevo documental disponible!</strong>{' '}
      <Link
        href="/documental"
        className="underline font-semibold hover:text-yellow-900 transition-colors"
      >
        Ver ahora →
      </Link>
    </div>
  );
}

