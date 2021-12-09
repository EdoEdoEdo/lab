const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const pages = [
  "airplanes",
  "bird",
  "camera",
  "flag",
  "geometries",
  "scroll",
];

module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/${page}/index.js`;
    return config;
  }, {}),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/${page}/index.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    ),
    new CopyWebpackPlugin({
      patterns: [
          { from: path.resolve(__dirname, '../static') }
      ]
    }),
    new HtmlWebpackPlugin({
        inject: false,
        template: path.resolve(__dirname, '../src/index.html'),
        minify: true
    }),
    new MiniCSSExtractPlugin()
  ),
  module:
  {
    rules:
    [
      // HTML
      {
        test: /\.(html)$/,
        use: ['html-loader']
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:
        [
            'babel-loader'
        ]
      },

      // CSS
      {
        test: /\.s[ac]ss$/i,
        use:
        [
            MiniCSSExtractPlugin.loader,
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
        ]
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        use:
        [
            {
                loader: 'file-loader',
                options:
                {
                    outputPath: 'assets/images/'
                }
            }
        ]
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use:
        [
            {
                loader: 'file-loader',
                options:
                {
                    outputPath: 'assets/fonts/'
                }
            }
        ]
      },

      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
            'raw-loader'
        ]
      }
    ]
  }
};
