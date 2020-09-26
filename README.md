# Spy-tools
使用puppeteer制作的关键词爬虫，目前已经完成了淘宝和百度的数据爬取

# 使用方式

因为puppeteer这个库需要翻墙才能下载所以使用cnpm进行安装
```node
npm install cnpm -g
cnpm install
```
> node ./spy-taobao.js  ## 默认是RTX3080的数据

> node ./index.js ## 默认是百度图片搜索，并且会将获取的图片下载到本地


# 后续

- 将这些初步的代码优化下，改成小程序云函数

- 写一个可视化界面