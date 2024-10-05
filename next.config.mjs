import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve('node_modules/kuromoji/dict'),
              to: path.resolve('public'),
            },
          ],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
