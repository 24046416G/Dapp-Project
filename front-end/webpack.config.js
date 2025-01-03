const path = require("path") //core module in nodejs, designed for solving path problem.
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/Index.jsx", //require ralative path here.
    output:{
        path: path.resolve(__dirname, "dist"), //require absolute path here.
        filename: "main.js",
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    target: 'web',
    module: {
        rules: [
            //loader configuration
            {
				test: /\.css$/, //matching .css
				use:['style-loader','css-loader']
			},
            {
				test: /\.jsx?$/, //matching .jsx or .js
				exclude: /node_modules/, //exclude node_modules folder
				use:{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            //add preset-react
                            require.resolve('@babel/preset-react'),
                            [require.resolve('@babel/preset-env'), {modules: false}]
                        ],
                        cacheDirectory: true
                    }
                }
			}
        ],
    },
    plugins: [
        //plugin configuration
        new HtmlWebPackPlugin({
			template: 'public/index.html',
			filename: 'index.html',
			inject: true
		})
    ],
    //mode
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        hot: true,
        port: 9090,
        historyApiFallback: true,
        open: true,
        compress: true
    }
}