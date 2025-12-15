/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Firebase Storage image URLs; add more domains as needed.
    domains: ["firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;

