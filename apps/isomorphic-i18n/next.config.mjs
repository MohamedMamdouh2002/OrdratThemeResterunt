/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {

    
    domains: ['ordratuserbucket.s3.eu-north-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "/redqteam.com/isomorphic-furyroad/public/**",
      },
      {
        protocol: "https",
        hostname: "isomorphic-furyroad.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "isomorphic-furyroad.vercel.app",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/',
        destination: '/ar', 
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
      {
        source: '/post-sitemap.xml',
        destination: '/api/post-sitemap.xml',
      },
      {
        source: '/page-sitemap.xml',
        destination: '/api/page-sitemap.xml',
      },
    ];
  },

  reactStrictMode: true,
  transpilePackages: ["@isomorphic/core"],
};

export default nextConfig;
