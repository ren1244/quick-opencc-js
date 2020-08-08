const path = require('path');

module.exports = {
    entry: {
        async: './src/async.js',
        sync: './src/sync.js',
	},
    output: {
        filename: 'quick-opencc-[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'quickOpenCC',
    }
};
