var config = require("./webpack.dev.js");
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var WebpackDevServer = require('webpack-dev-server');
var port = 10086;
console.log('port:', 10086);

for (var item in config.entry) {
  config.entry[item].unshift("webpack-dev-server/client?http://localhost:" + port + "/", 'webpack/hot/dev-server');
}
console.log('config', config.entry);

config.plugins.push(new OpenBrowserPlugin({
  url: 'http://localhost:' + port
}));

var compiler = webpack(config);
compiler.plugin('compilation', function (compilation, callbak) {
  compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callbak) {
    htmlPluginData.html += 'The magic footer';
    callbak();
  })
})
console.log('config.output.path', config.output.path);

var server = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  hot: true,
  stats: {
    colors: true // 用颜色标识
  },
  contentBase: config.output.path
});
server.listen(port);