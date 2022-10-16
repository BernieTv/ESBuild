const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	resolve: {
		fallback: {
			fs: false,
		},
	},
	plugins: [new NodePolyfillPlugin()],
};
