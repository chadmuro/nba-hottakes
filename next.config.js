/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'njbaysarqhupdtmikdvd.supabase.co',
        port: '',
        pathname: '/storage/v1/**/**',
      },
    ]
  }
}

module.exports = nextConfig
