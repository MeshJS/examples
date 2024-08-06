/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["lucid-cardano", "@meshsdk/core", "@meshsdk/react"],
  experimental: {
    after: true,
  },
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
