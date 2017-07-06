var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var containerPath = path.resolve('./');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var px2rem = require('postcss-px2rem');
var getEntry = require('./getEntry');
var extractSASS = new ExtractTextPlugin('[name].css');

//  配置入口文件
var entrys = getEntry('./src/**/*.js');
//  处理html
var pages = getEntry('./src/**/*.pug');
//  添加插件
var plugins = [];

//  切割css文件
plugins.push(extractSASS);
plugins.push(new webpack.HotModuleReplacementPlugin());


// 第三方插件
entrys['vendor'] = [

];

//  提取公共文件
plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js'
}));


console.log('entrys', entrys);

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
        path: path.resolve(containerPath, './src/'),
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.html$/,
                use: ['html-withimg-loader', 'raw-loader'], // 把html解析成string,依赖file-loader
                exclude: /(node_modules)/
            }, {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: [require('babel-plugin-transform-object-rest-spread'), 'transform-runtime']
                        // babel-present-env  修补使用一些es的新语法
                        // transform-runtime 避免添加每个文件依赖
                        // babel-plugin-transform-object-rest-spread 使用...等新的es语法
                    }
                }],
                exclude: /(node_modules)/
            }, {
                test: /\.css$/i,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader?module',
                    },
                    {
                        loader: 'postcss-loader',
                    }
                ]
            },
            {
                test: /\.scss$/i,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                    }, {
                        loader: 'sass-loader'
                    }, {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /.pug$/,
                use: ['pug-loader'],
                exclude: /(node_modules)/
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
            'vue': 'vue/dist/vue.js'
        },
        extensions: ['.js', '.css', '.scss', '.pug', '.png', '.jpg']
    },
    externals: {}
};
module.exports = config;