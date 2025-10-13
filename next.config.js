/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['maplibre-gl'],
  images: {
    domains: ['localhost', 'supabase.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
