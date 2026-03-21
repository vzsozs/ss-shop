import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/custom-products',
        permanent: false,
      },
    ]
  },
};

export default withPayload(nextConfig);
