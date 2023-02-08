/** @type {import('next').NextConfig} */

module.exports = {
	reactStrictMode: false,
	webpack: config => {
		config.resolve.fallback = { fs: false };

		return config;
	},
};
