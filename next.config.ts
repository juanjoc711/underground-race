import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Add localhost for development environment if serving local uploads
      // Note: This might vary depending on your dev port
       ...(process.env.NODE_ENV === 'development'
         ? [
             {
               protocol: 'http',
               hostname: 'localhost',
               port: '9002', // Adjust if your dev port is different
               pathname: '/uploads/**', // Be specific to the uploads path
             },
           ]
         : []),

      // Add other domains if needed, e.g., for the logo if hosted elsewhere
      // {
      //   protocol: 'https',
      //   hostname: 'your-logo-domain.com',
      // },
    ],
    // Allow all remote patterns - USE WITH CAUTION IN PRODUCTION
    // dangerouslyAllowSVG: true, // If you need SVG support
    // contentDispositionType: 'attachment', // Optional: Force download for specific types
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Optional: CSP
  },
};

export default nextConfig;
