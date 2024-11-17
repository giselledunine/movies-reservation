/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            { hostname: "firebasestorage.googleapis.com" },
            { hostname: "avatars.githubusercontent.com" },
            { hostname: "lh3.googleusercontent.com" },
        ],
    },
};

export default nextConfig;
