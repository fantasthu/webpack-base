var config = require('./webpack.dev.js');
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var WebpackDevServer = require('webpack-dev-server');
var port = 10086;
var getIPAddress = require('./getIPAddress');
for (var item in config.entry) {
  config.entry[item].unshift(
    'webpack-dev-server/client?http://localhost:' + port + '/',
    'webpack/hot/dev-server'
  );
}
console.log('entrys', config.entry);

config.plugins.push(
  new OpenBrowserPlugin({
    url: `http://${getIPAddress()}:${port}?debug=1`
  })
);

var compiler = webpack(config);
compiler.plugin('compilation', function(compilation, callbak) {
  // compilation.plugin('html-webpack-plugin-before-html-processing', function(
  //   htmlPluginData,
  //   callbak
  // ) {
  //   htmlPluginData.html += ``;
  //   callbak();
  // });
});

var server = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  hot: true,
  stats: {
    colors: true
  },
  contentBase: config.output.path
});
server.listen(port);
