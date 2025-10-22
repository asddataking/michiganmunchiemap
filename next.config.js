/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['maplibre-gl'],
  images: {
    domains: ['localhost', 'supabase.com', 'imgproxy.fourthwall.com', 'img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'imgproxy.fourthwall.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
