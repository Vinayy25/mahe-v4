/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase timeout for external resources like Google Fonts
  experimental: {
    fetchCacheKeyPrefix: "",
  },
  // Add headers to help with font loading
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
