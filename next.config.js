/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['img.clerk.com'],
	},
	experimental: {
		optimizeFonts: true,
		optimizeCss: true,
	},
}

module.exports = nextConfig
