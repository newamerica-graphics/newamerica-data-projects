var webpack = require('webpack');
var path = require('path');
var S3Plugin = require('webpack-s3-plugin')

var BUILD_DIR = path.resolve(__dirname, 'build/');
var PROJECT_DIR = path.resolve(__dirname, 'src/js/projects');

// s3 bucket settings
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var STATIC_BUCKET_NAME = process.env.STATIC_S3_BUCKET_NAME;

function getProjectEntryPoints() {
	let entryPoints = {};

	let projectList = ['homegrown_terrorism', 'care_index'];

	for (var project of projectList) {
		entryPoints[project] = PROJECT_DIR + "/" + project + '/index.js';
	}

	return entryPoints;
}

var config = {
  entry: getProjectEntryPoints(),
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  module: {
    loaders : [
      {
        test : /\.js?/,
        include : PROJECT_DIR,
        loader : 'babel'
      }
    ]
  },
  plugins: (process.env.NODE_ENV === 'development') ? [] : [
    new S3Plugin({
      // Only upload css and js 
      include: /.*\.(css|js)/,
      // s3Options are required 
      s3Options: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      s3UploadOptions: {
        Bucket: STATIC_BUCKET_NAME
      }
    })
  ]
};

module.exports = config;