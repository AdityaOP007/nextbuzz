/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // Bust stale webpack chunks from other projects on the same port
  generateBuildId: async () =>
    process.env.NODE_ENV === "development"
      ? `nextbuzz-dev-${Date.now()}`
      : "nextbuzz-prod",
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
