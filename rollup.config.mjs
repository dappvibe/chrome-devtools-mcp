import path from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';

const isProduction = process.env.NODE_ENV === 'production';

export default [
  {
    input: './build/src/third_party/index.js',
    output: {
      file: './build/src/third_party/index.js',
      sourcemap: !isProduction,
      format: 'esm',
      inlineDynamicImports: true,
    },
    plugins: [
      cleanup({
        comments: [/Copyright/i],
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      json(),
      nodeResolve({
        preferBuiltins: true,
        // Don't bundle anything from node_modules for now to avoid the clone-deep issue
        resolveOnly: (module) => !module.includes('node_modules') && !['puppeteer-extra', 'puppeteer-extra-plugin-stealth', 'debug', 'yargs', 'zod', 'puppeteer-core'].includes(module),
      }),
    ],
    external: (source) => {
      // Treat everything except local files as external for now to bypass the bundling issue
      if (source.startsWith('.') || source.startsWith('/')) {
        return false;
      }
      return true;
    },
  },
];
