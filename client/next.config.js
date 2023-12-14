/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1184548057,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "c82e133254bf67ab766074ae113a7348",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
