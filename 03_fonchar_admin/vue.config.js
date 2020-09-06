module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://192.168.31.39:8081',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}