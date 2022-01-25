import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';
import path from 'path';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: './',
    }),
    svgr(),
  ],
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      Events: 'rollup-plugin-node-polyfills/polyfills/events',
      Buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      web3: path.resolve(__dirname, './node_modules/web3/dist/web3.min.js'),
    },
  },
});
