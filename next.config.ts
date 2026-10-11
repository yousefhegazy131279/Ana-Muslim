import type { NextConfig } from 'next';
const config: NextConfig = {
 trailingSlash: true,
 images: { unoptimized: true },
 turbopack: { root: process.cwd() },
 async headers() {return [
  {source:'/images/prophets/optimized/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
  {source:'/fonts/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
 ];},
};
export default config;
