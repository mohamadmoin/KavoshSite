/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'], // Allow images from backend
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy API requests
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/:path*`,
      },
    ];
  },
};

console.log('Next.js config:', JSON.stringify(nextConfig, null, 2));
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api');

export default nextConfig;
