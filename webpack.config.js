var webpack = require('webpack');
var path = require('path');
var S3Plugin = require('webpack-s3-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build/');
var PROJECT_DIR = path.resolve(__dirname, 'src');

// s3 bucket settings
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var DATA_PROJECTS_S3_BUCKET_NAME = process.env.DATA_PROJECTS_S3_BUCKET_NAME;

function getProjectEntryPoints() {
	var entryPoints = {};
  var whichProject = process.env.npm_config_project;

  if (whichProject) {
    var projectList = [whichProject];
  } else {
    var projectList = ['homegrown_terrorism', 'care_index', 'extreme_weather', 'world_of_drones'];
  }

	for (var project of projectList) {
		entryPoints[project] = PROJECT_DIR + "/js/projects/" + project + '/index.js';
  }

  return entryPoints;
}

var config = {
  entry: getProjectEntryPoints(),
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      // webworkify: 'webworkify-webpack',

      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
      'mapbox-gl-geocoder': path.resolve('./node_modules/mapbox-gl/plugins/src/mapbox-gl-geocoder/v2.0.1/'),
    }
  },
  module: {
    loaders : [
      {
        test : /\.js?/,
        include : PROJECT_DIR,
        loader : 'babel'
      },
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css', 'sass' ]
      },
      { 
        test: /\.png$/, 
        loader: "url-loader?limit=100000" 
      },
      { 
        test: /\.json$/, 
        loader: "json-loader" 
      },
      {
        test: /mapbox-gl.+\.js$/,
        loader: 'transform/cacheable?brfs'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./src/scss/index.scss")]
  },
  plugins: (process.env.NODE_ENV === 'development') ? 
    [
      new HtmlWebpackPlugin({
        title: process.env.npm_config_project,
        // otherData: "fifteen",
        // template: './index_dev.ejs',
        filename: '../index-dev.html'
      })
    ] : [
      new S3Plugin({
        // Only upload css and js 
        include: /.*\.(scss|css|js)/,
        // s3Options are required 
        s3Options: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
        s3UploadOptions: {
          Bucket: DATA_PROJECTS_S3_BUCKET_NAME
        }
      })
    ],
  node: {
    fs: "empty",
    net: 'empty',
    tls: 'empty',
    console: true
  }
};

module.exports = config;