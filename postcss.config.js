const process = require('process');
console.log('process', process.env.NODE_ENV);

module.exports = {
    plugins: [

        require('postcss-conditionals')(),

        require('postcss-simple-vars')(), //https://www.npmjs.com/package/postcss-simple-vars

        require('postcss-each')(),

        require('postcss-for')(),

        require('postcss-mixins')(),

        require('postcss-import')(),

        require('postcss-nested')(),

        require('postcss-atroot')(),
        require('postcss-cssnext')(), // 包括了profixcss
        require('postcss-extend')(),
        require('postcss-px2rem')({
            remUnit: 75
        }),
    ]
}