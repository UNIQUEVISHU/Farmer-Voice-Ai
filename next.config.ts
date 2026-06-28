/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.da.gov.ph',
      },
    ],
  },
};

export default nextConfig;