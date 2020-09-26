const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Ut = require('./download');
const config = require('./config')
const log = console.log;

const FILE_PATH = './cache' // 图片下载目录
const KEY_WORD = '美女'; 
const URI = config.baidu(KEY_WORD)

; (async () => {

  const options = {
    timeout: 15000,
    ignoreHTTPSErrors: true,
    devtools: false,
    headless: false
  }
  const browser = await puppeteer.launch(options);

  if (browser) {
    log(chalk.green('服务正常启动'))
  } else {
    log(chalk.red('服务启动失败'))
  }

  try {
    const page = await browser.newPage()
    page.on('console', msg => {
      if (typeof msg === 'object') {
        console.dir(msg)
      } else {
        log(chalk.blue(msg))
      }
    })

    await page.goto(URI)
    log(chalk.yellow('页面加载完成！'))
    // 模拟滚动，获取足够的图片
    const scrollTimer = page.evaluate(() => {
      //这个作用域的this不能改变,否则无法正常获取页面元素
      const DOWLOAD_SIZE = 1000; // 一次性需要下载图片的数量
      return new Promise((resolve, reject) => {
          let totalSize = 0
          let totalHeight = 0
          let distance = 600
          let timer = setInterval(() => {
              window.scrollBy(0, distance)
              totalHeight += distance
              let imgList = Array.from(document.getElementsByClassName('imgitem'))
              // 处理图片数量不够的情况
              let documentScrollHeight = document.body.scrollHeight
              let isMaxed = totalHeight >= documentScrollHeight
              totalSize = imgList.length
              if(totalSize >= DOWLOAD_SIZE || isMaxed){
                  clearInterval(timer)
                  resolve()
              }
          }, 200)
      })
      
  })
    let ret = await scrollTimer
    const data = await page.evaluate( async () => {
      let ret = []
      class imgData {
        constructor(title, url) {
          this.title = title
          this.url = url
        }
      }
      let itemlist = document.getElementsByClassName('imgitem')
      Array.from(itemlist).forEach(li => {
        let title = li.getAttribute("data-title")
        let img = li.getElementsByClassName('main_img')[0]
        let url = img.getAttribute('src')
        ret.push(new imgData(title, url))
      })
      return ret
    })
    let len = data.length
    async function getData(index,list) {
      if(!list[index]) {
        return
      }else {
        let item = list[index]
        let url = item.url
        let path = `${FILE_PATH}/${index}.jpg`;
        if (/http/g.test(url)) {
            let opts = {
              url: url,
            };
          log(chalk.green(`正在下载第${index}张共${len}张...`))
          await Ut.downImg(opts, path); 
          log(chalk.green(`正在下载第${index}张下载成功`))
        }
        index ++
        await getData(index,list)
      }
    }
    if (len) {
      await getData(0,data)
    }
  } catch (e) {
    log(chalk.red('服务意外终止'))
    log(chalk.red(e))
    await browser.close()
  } finally {
    process.exit(0)
  }
})();
