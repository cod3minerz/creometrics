/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => [
    {
      source: "/quotes/:path*",
      destination: "/dashboard",
      permanent: false,
    },
  ],
}

export default nextConfig
