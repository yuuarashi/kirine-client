import path from 'path';
import _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const pageTemplate = _.template(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
    <div id="react-root"></div>
</body>
</html>`.trim());

export default {
    mode: 'development',
    entry: './src/index.jsx',
    output: {
        path: path.resolve('dist'),
        filename: 'app.bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Kirine',
            publicPath: '/',
            templateContent: pageTemplate
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}