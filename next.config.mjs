/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === 'true'
const basePath = process.env.BASE_PATH || ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isGhPages && basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
}

export default nextConfig