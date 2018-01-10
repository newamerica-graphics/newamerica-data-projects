var webpack = require('webpack');
var path = require('path');
var S3Plugin = require('webpack-s3-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build/');
var PROJECT_DIR = path.resolve(__dirname, 'src');

// s3 bucket settings
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var DATA_PROJECTS_S3_BUCKET_NAME = process.env.DATA_PROJECTS_S3_BUCKET_NAME;

const config = env => {
  console.log(env)
  var {vizSettings} = require("./src/js/projects/" + env.project + "/settings.js")

  return {
    entry: env.NODE_ENV === "development" ? PROJECT_DIR + "/js/index-dev.js" : PROJECT_DIR + "/js/index.js",
    output: {
      path: BUILD_DIR,
      filename: env.project + '.js'
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
        'mapbox-gl-geocoder': path.resolve('./node_modules/mapbox-gl/plugins/src/mapbox-gl-geocoder/v2.0.1/'),
      }
    },
    devtool: env.NODE_ENV === "development" ? 'cheap-module-eval-source-map' : '',
    devServer: {
      contentBase: "./"
    },
    module: {
      rules : [
        {
          test : /\.js?/,
          include : PROJECT_DIR,
          use : 'babel-loader'
        },
        {
          test: /\.scss$/,
          use: [ {loader: 'style-loader'}, {loader: 'css-loader'}, {loader:'sass-loader'} ]
        },
        { 
          test: /\.png$/, 
          use: "url-loader?limit=100000" 
        },
        { 
          test: /\.json$/, 
          use: "json-loader" 
        },
        {
          test: /mapbox-gl.+\.js$/,
          use: 'transform-loader/cacheable?brfs'
        },
      ]
    },
    plugins: (env.NODE_ENV === 'development') ? 
      [
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
          title: env.project,
          vizIdList: Object.keys(vizSettings),
          template: './index_dev.ejs',
          filename: '../index-dev.html'
        }),
        new webpack.DefinePlugin({
          PROJECT: JSON.stringify(env.project)
        })
      ] : [
        new UglifyJSPlugin({
          sourceMap: true
        }),
        // new S3Plugin({
        //   // Only upload css and js 
        //   include: /.*\.(scss|css|js)/,
        //   // s3Options are required 
        //   s3Options: {
        //     accessKeyId: AWS_ACCESS_KEY_ID,
        //     secretAccessKey: AWS_SECRET_ACCESS_KEY,
        //   },
        //   s3UploadOptions: {
        //     Bucket: DATA_PROJECTS_S3_BUCKET_NAME
        //   }
        // }),
        new webpack.optimize.ModuleConcatenationPlugin()
      ],
    node: {
      fs: "empty",
      net: 'empty',
      tls: 'empty',
      console: true
    }
  }
};


module.exports = config;