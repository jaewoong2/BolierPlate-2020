module.exports = {
    productionSourceMap: true,
    compress : true,
    webpack(config, { webpack }) {
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko%/),
        ];
        return {
            ...config,
            mode : prod ? 'production' : 'development',
            devtool : prod ? 'hidden-source-map' : 'eval', 
            devtool: 'source-map',
            plugins 
       }
    },
}