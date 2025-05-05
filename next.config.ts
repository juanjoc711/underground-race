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
      // Add other domains if needed, e.g., for the logo if hosted elsewhere
      // {
      //   protocol: 'https',
      //   hostname: 'your-logo-domain.com',
      // },
    ],
  },
};

export default nextConfig;
