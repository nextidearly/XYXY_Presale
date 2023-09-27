/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ['images.unsplash.com', 'source.unsplash.com'],
    loader: "custom",
    unoptimized : true,
  }
}

module.exports = nextConfig
