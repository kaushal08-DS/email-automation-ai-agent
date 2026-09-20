/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://email-automation-ai-agent.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;