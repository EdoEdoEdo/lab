const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const pages = [
  "album",
  "airplanes",
  "aviator",
  "band",
  "barba1",
  "barba2",
  "blend",
  "bird",
  "breath",
  "box",
  "camera",
  "coconut",
  "cripto",
  "cloth-studios",
  "donuts",
  "ektogamat",
  "fake3d",
  "fbm",
  "flag",
  "fireflies",
  "flowmap",
  "geometries",
  "glitch",
  "horizontal",
  "howler",
  "index",
  "intro",
  "kaleidoscope",
  "lab",
  "loader",
  "ocean",
  "ogl",
  "ogl-draw",
  "ogl-triangle-shader",
  "ogl2",
  "photos",
  "portraits",
  "portal",
  "phone",
  "rafa",
  "records",
  "records-store",
  "render-target",
  "seacreatures",
  "scroll",
  "scrolltrigger",
  "smoke",
  "template",
  "toggle-actions",
  "untitled",
  "xmas",
  "zippy",
  "workers1",
  "workers2",
  "workers3",
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
    new MiniCSSExtractPlugin(),
    // new FaviconsWebpackPlugin('./static/favicon.ico')
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
      {
        test: /\.mp3$/,
        loader: 'file-loader'
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

      // {
      //   test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name (file) {
      //       return '[hash].[ext]'
      //     }
      //   }
      // },

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
