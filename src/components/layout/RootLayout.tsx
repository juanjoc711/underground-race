import DocumentaryBanner from '@/components/ui/DocumentaryBanner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <DocumentaryBanner /> {/* 👈 Este es el banner */}
        {children}
      </body>
    </html>
  );
}
