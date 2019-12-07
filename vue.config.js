const path = require("path");
const pxtorem = require("postcss-pxtorem");
const autoprefixer = require("autoprefixer");

const resolve = file => path.resolve(__dirname, file);

//获取多页面配置 
const getPages=require('./src/utils/getPages.js');
let pages=getPages.pages();

module.exports = {
	pages,
	outputDir: "dist",
	assetsDir: "static",
	publicPath: process.env.VUE_BASE_PATH,     
	// devServer: {
	// 	proxy: {
	// 		"/api": {
	// 			// 在本地新建 .env.development.local文件 将PROXY_URL定义在
	// 			target: process.env.PROXY_URL,
	// 			changeOrigin: true,
	// 			logLevel: "debug"
	// 		}
	// 	}
	// },
	css: {
		loaderOptions: {
			postcss: {
				plugins: [
					autoprefixer(),
					pxtorem({
						rootValue: 16,
						propList: ["*"],
						selectorBlackList: ["ig-"],
						unitPrecision: 5,
						replace: true,
						mediaQuery: false,
						minPixelValue: 2
					})
				]
			},
			less: {
				modifyVars: {
					'@color':"aquamarine"
				}
			},
		}
	},
	chainWebpack: config => {
		config.resolve.alias
			.set("@", resolve("src"))
			.set("@assets", resolve("src/assets"))
			.set("@components", resolve("src/components"))
			.set("@views", resolve("src/views"))
			.set("@utils", resolve("src/utils"))
			.set("@config", resolve("src/config"));
	}
	
	
};
