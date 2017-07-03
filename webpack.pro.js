// 声明:
// node版本6.2.0 node-sass@4.0.0
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var containerPath = path.resolve('./');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var px2rem = require('postcss-px2rem');
var getEntry = require('./getEntry');
var moment = require('moment');
var CryptoJS = require('crypto-js');
const versionHash = CryptoJS.MD5(moment().format('x')).toString().substr(0, 4) + moment().format('YYMMDDHH');
var extractSASS = new ExtractTextPlugin(`${versionHash}/css/[name].[contenthash:8].css`);

//  配置入口文件

var entrys = getEntry('./src/*.js');

//  添加插件
var plugins = [];

//  切割css文件
plugins.push(extractSASS);
plugins.push(new webpack.HotModuleReplacementPlugin());

//  提取公共文件
plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: `${versionHash}/js/vendor.[hash:8].js`
}));
// 混淆
plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));

//  处理html
var pages = getEntry('./src/*.html');
console.log('pages', pages);

for (var chunkname in pages) {
    var conf = {
        filename: chunkname + '.html',
        template: pages[chunkname],
        inject: true,
        cache: false,
        minify: {
            removeComments: true,
            collapseWhitespace: false
        },
        chunks: ['vendor', chunkname],
        hash: true,
        // complieConfig: compileConfig
    }
    var titleC = {};
    var title = titleC[chunkname];
    if (title) {
        conf.title = title;
    }
    plugins.push(new HtmlWebpackPlugin(conf));
}

plugins.push(new webpack.HotModuleReplacementPlugin());
// webpack2.x不支持自定义配置节点，需要用webpack.LoaderOptionsPlugin加入自定义的插件配置节点。
// plugins.push(new webpack.LoaderOptionsPlugin({
//     options: {
//         postcss: [autoprefixer()]
//     }
// }))
//  配置webpack
var config = {
    entry: entrys,
    output: {
        path: path.resolve(containerPath, './dist'),
        filename: '[name].js'
    },
    devtool: 'false',
    module: {
        rules: [{
                test: /\.html$/,
                use: ['raw-loader'], // 把html解析成string,依赖file-loader
                exclude: /(node_modules)/
            }, {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /(node_modules)/
            }, {
                test: /\.css$/i,
                use: extractSASS.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'postcss-loader',
                    }]
                })
            },
            {
                test: /\.scss$/i,
                // 线上环境这么使用
                use: extractSASS.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'sass-loader'
                    }, {
                        loader: 'postcss-loader',
                    }]
                })
            },
            {
                test: /.pug$/,
                use: ['pug-html-loader']
            }, {
                test: /\.(png|jpg|gif|jpge)$/,
                use: ['url-loader?limit=8192&name=img/[name].[ext]']
            }, {
                test: /\.(woff|woff2|svg|eot|ttf|otf)$/,
                use: ['file-loader?limit=8192&name=fonts/[name].[ext]']
            }
        ]
    },
    plugins: plugins,
    resolve: {
        alias: {

        },
        extensions: ['.js', '.css', '.scss', '.pug', '.png', '.jpg']
    },
    externals: {}
};
module.exports = config;