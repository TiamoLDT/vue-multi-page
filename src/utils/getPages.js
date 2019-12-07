//多页面获取文件配置
const glob = require('glob')
let pages = {}
module.exports.pages = function () {
  glob.sync('./src/views/*/*.js').forEach(filepath => {
    let fileList = filepath.split('/');
    let fileName = fileList[fileList.length - 2];//所在页面文件名
    pages[fileName] = {
      entry: `src/views/${fileName}/${fileName}.js`,  
      // 模板来源
      template: `public/index.html`,
      // 在 dist/index.html 的输出
      // filename: process.env.NODE_ENV === 'development' ? `${fileName}.html` : `${fileName}/${fileName}.html`,
      filename: `${fileName}.html`,
      title: `${fileName} page`,
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', fileName]
    }
  })
  return pages
}