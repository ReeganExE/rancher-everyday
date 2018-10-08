/* eslint-disable no-console */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const Copy = require('copy-webpack-plugin');
const Write = require('write-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const fill = require('fill-tpl');

const { env } = process;
const DEV = env.NODE_ENV === 'development';

if (!env.RANCHER_ADDR) {
  console.error('RANCHER_ADDR is not specified');
  process.exit(1);
}

if (!env.RANCHER_ADDR.startsWith('http')) {
  console.error('RANCHER_ADDR is not valid. It must be an http address');
  process.exit(1);
}

console.log(`RANCHER_ADDR: ${env.RANCHER_ADDR}`);

const manifest = JSON.parse(fill(fs.readFileSync('./src/manifest.json')).with(process.env));

const pkg = {
  author: env.npm_package_author_name,
  description: env.npm_package_description,
  version: env.npm_package_version
};

const cssLoader = () => {
  const css = {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: 'ninhdeptrai.com-[hash:base64:8]',
      minimize: DEV ? false : { discardComments: { removeAll: true } }
    }
  };

  return ['style-loader', css];
};

const options = {
  mode: env.NODE_ENV,
  entry: {
    background: './src/index.js',
    exec: './src/exec.js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        use: cssLoader()
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      'process.env.RANCHER_ADDR': JSON.stringify(env.RANCHER_ADDR),
      'process.env.BROWSER': JSON.stringify(env.BROWSER)
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: manifest,
        extend: pkg
      }
    }),
    new Copy([{ from: './icon.png' }])
  ].concat(DEV ? [new Write()] : []),
  devtool: DEV ? 'cheap-module-eval-source-map' : undefined,
  optimization: optimization()
};


function optimization() {
  if (DEV) {
    return;
  }

  return {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false
          },
          safari10: true
        }
      })
    ]
  };
}

module.exports = options;
