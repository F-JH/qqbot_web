module.exports = {
    devServer: {
        sockHost: '119.91.194.230:8888',
        disableHostCheck: true,
    }
}

const webpack = require('webpack')
// const path = require('path')
// function resolve(dir) {
//   return path.join(__dirname, '..'1, dir)
// }
module.exports = {
    lintOnSave: false,
    publicPath: './', // 部署项目路径
    devServer: {
        port: 8088, // 端口号
        open: false, //配置自动启动浏览器
        proxy: {
            '/项目名称': {
                target: '你的项目服务器内网地址:端口/项目名称',//内网
                /*target: '你的项目服务器外网地址:端口/项目名称',//外网*/
                /*target: '你的项目本地联调地址:端口号/', // 本地测试*/
                changeOrigin: true,
                pathRewrite: {
                    '^/项目名称': '/'
                }
            }
        }
    },
    configureWebpack: {
        // webpack 配置项 根据需求 按需配置即可
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/css/global.scss";`
            },
        }
    }
}