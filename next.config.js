/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_R2_PUBLIC_URL: process.env.VITE_R2_PUBLIC_URL,
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-da45e99017dca2252440c60f874d5ab8.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
