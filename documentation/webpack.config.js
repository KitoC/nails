const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const autoprefixer = require("autoprefixer");
// const pluginProposalClassProperties = require("@babel/plugin-proposal-class-properties");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});

const CSSModuleLoader = {
  loader: "css-loader",
  options: {
    modules: true,
    sourceMap: true,
    localIdentName: "[local]__[hash:base64]"
  }
};

const CSSLoader = {
  loader: "css-loader",
  options: {
    modules: false,
    sourceMap: true
  }
};

const postCSSLoader = {
  loader: "postcss-loader",
  options: {
    ident: "postcss",
    sourceMap: true,
    plugins: () => [
      autoprefixer({
        browsers: [">1%", "last 4 versions", "Firefox ESR", "not ie < 9"]
      })
    ]
  }
};

module.exports = {
  output: {
    publicPath: "/"
  },

  // target: "node",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", CSSModuleLoader]
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ["style-loader", CSSLoader, postCSSLoader, "sass-loader"]
      },
      {
        test: /\.module\.scss$/,
        use: ["style-loader", CSSModuleLoader, postCSSLoader, "sass-loader"]
      },
      {
        test: /\.md$/,
        use: "raw-loader"
      }
    ]
  },
  plugins: [htmlPlugin],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    noInfo: true,
    port: 4242,
    historyApiFallback: true
  },
  resolve: {
    alias: {
      theme: path.resolve(__dirname, "src/theme/"),
      view: path.resolve(__dirname, "src/view/"),
      utils: path.resolve(__dirname, "src/utils/"),
      config: path.resolve(__dirname, "src/config/")
    }
  }
};
