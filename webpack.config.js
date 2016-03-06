module.exports = {
    entry: "./js/external/image-gallery/image-gallery.js",
    output: {
        filename: "./js/external/image-gallery/bundlegallery.js"
    },
	module: {
		loaders: [
		  {
			test: /\.scss$/,
			loaders: ["style", "css", "sass"]
		  }
		]
  }
}