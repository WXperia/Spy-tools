const chalk = require('chalk');
const puppeteer = require('puppeteer');
const log = console.log;
const sleep = require('./sleep')
const config = require('./config')
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://spy:war3hack!@#ye@spy-mogodb.hhpvl.gcp.mongodb.net/spy?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const KEY_WORD = 'RTX3080';
const util = require('./util')
const URI = config.taobao(KEY_WORD)
    // let cookieStr = "t=2125bbbe33ef08ea1c7230d10ea7fbad; UM_distinctid=174a48e85b1133-0b4deb7d599d02-333769-1fa400-174a48e85b294e; thw=cn; _m_h5_tk=aae7433e6fa039f928f382140c70b4b0_1600698509229; _m_h5_tk_enc=d86813a1d6e457b5feb9943132bcf4a0; xlly_s=1; linezing_session=wJfjORGlq7bIj3N791a21VVn_1600688124885pY7U_2; hng=CN%7Czh-CN%7CCNY%7C156; _tb_token_=fe7ea7783343e; cna=95F8F7oxlS0CAXQXP9S7ZC3k; lgc=xzqalipay; dnk=xzqalipay; tracknick=xzqalipay; lid=xzqalipay; _l_g_=Ug%3D%3D; sg=y10; _nk_=xzqalipay; mt=ci=57_1; sgcookie=E100b8PN9jHRLNK4Io8lr82I8GduIPWV7829PahNRWPeWu0vgkqnxe70fqsp2rSKQb8yl%2B15wZBJbX7SUicrxLih3A%3D%3D; csg=e9e47ae6; existShop=MTYwMDY5NzQ0OA%3D%3D; _cc_=WqG3DMC9EA%3D%3D; uc1=cookie15=UIHiLt3xD8xYTw%3D%3D&pas=0&cookie16=V32FPkk%2FxXMk5UvIbNtImtMfJQ%3D%3D&cookie14=Uoe0bU5dsvUzbQ%3D%3D&existShop=false&cookie21=V32FPkk%2FgihF%2FS5nr3O5; isg=BHJyqXI3eeVs4EXTbEcjjxT1w7hUA3ad54q82jxLniUQzxLJJJPGrXgtu2vzpO41; l=eBOT_VxPOJb5BEoCBOfanurza77OSIRYYuPzaNbMiOCPODfB54jCWZr9pA86C3GVh6XWR3uV-FgpBeYBqQAonxvOvhLyCdMmn; tfstk=cUJVBmmxsxH4zP6s9t6aCgc5GbtAw8tDj8SCiC2VrczvIifD2PIokoIPfwHli"
    // let cookieList = util.forMatCookie(cookieStr)
    ; (async () => {
        const options = {
            timeout: 15000,
            ignoreHTTPSErrors: true,
            devtools: false,
            headless: false,
            slowMo: 100
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
            await page.evaluate(() => {
                //页面入侵，可在打开的前台页面console 界面键入代码，更改dom信息，。。。
                window.addEventListener('mousemove', e => {
                    try {
                        //添加点击动画，留下点击痕迹，便于测试
                        const div = document.createElement('div');
                        div.style.width = '5px';
                        div.style.height = '5px';
                        div.style.borderRadius = '50%';
                        div.style.backgroundColor = 'red';
                        div.style.position = 'absolute';
                        div.style.left = e.x + 5 + 'px';
                        div.style.top = e.y + 5 + 'px';
                        div.style.zIndex = "99999";
                        document.body.appendChild(div);
                    } catch (err) {
                        console.error(err);
                    }
                });
            });
            log(chalk.yellow('页面加载完成！'))
            // 开启登录流程
            await page.waitFor('input[name=fm-login-id]')
            await page.waitFor('input[name=fm-login-password]')
            let uInput = await page.$('input[name=fm-login-id]')
            let pInput = await page.$('input[name=fm-login-password]')
            // tb用户名
            await uInput.type('username')
            await sleep.sleep(500)
            // tb密码
            await pInput.type('password')
            await sleep.sleep(1000)
            let loginBtn = await page.$('.fm-btn > button[type=submit]')
            if (loginBtn) {
                loginBtn.click()
            }
            // await page.waitFor('input[name=q]')
            // let searchInput = await page.$('input[name=q]')
            // if(searchInput) {
            //     searchInput.type(KEY_WORD)
            // }
            // let buttonSearch = await page.$('.btn-search')
            // if(buttonSearch) {
            //     buttonSearch.click()
            // }
            // 获取搜索最大值
            await page.waitFor('div.total')
            let totalSpan = await page.$('.total')
            let h1 = await page.evaluate(node => node.innerText, totalSpan)
            const TOTAL_PAGE = h1.match(/\d+/g)[0]
            log(chalk.blue(`获取到最大页面为${TOTAL_PAGE}`))
            let retList = []
            // 获取所有信息
            const getData = async function () {
                return await page.evaluate(() => {
                    //这个作用域的this不能改变,否则无法正常获取页面元    
                    let mainList = document.getElementById('mainsrp-itemlist').getElementsByClassName('items')[0].getElementsByClassName('item')
                    let mainListArray = Array.from(mainList)
                    let ret = []
                    mainListArray.forEach(item => {
                        let ctxBox = item.getElementsByClassName('ctx-box')[0]
                        let image = item.getElementsByClassName('J_ItemPic')[0]
                        let imageUrl = image.getAttribute('src')
                        let productUrl = item.getElementsByClassName('pic-link')[0].getAttribute('href')
                        let price = ctxBox.getElementsByClassName('price')[0].getElementsByTagName('strong')[0].innerText
                        // 月付款人数
                        let nop = ctxBox.getElementsByClassName('deal-cnt').innerHTML
                        let shop = ctxBox.getElementsByClassName('shop')[0].getElementsByClassName('shopname')[0]
                        let shopName = shop.children[1].innerText
                        let shopUrl = shop.getAttribute('href')
                        let location = ctxBox.getElementsByClassName('location')[0].innerText
                        let producTitle = ctxBox.getElementsByClassName('title')[0].getElementsByTagName('a')[0].textContent.replace(/[\n+\s+]/g, '')
                        // title = title.replace(/\s+/g, "");
                        let productInfor = {
                            price,
                            nop,
                            shopName,
                            shopUrl,
                            imageUrl,
                            location,
                            producTitle,
                            productUrl
                        }
                        ret.push(productInfor)
                    })
                    return ret
                })
            }
            while (true) {
                // 休息3秒
                await sleep.sleep(2000)
                let curretnPageSpan = await page.$('.m-page .items .active')
                let currentPage = await page.evaluate(node => node.innerText, curretnPageSpan)
                log(chalk.blue(currentPage + '/' + TOTAL_PAGE))
                let res = await getData()
                retList.concat(res)
                if (parseInt(currentPage) >= parseInt(TOTAL_PAGE)) {
                    break;
                }
                await page.waitFor('.m-page')
                let nextBtn = await page.$('.m-page .next > a')
                await nextBtn.click()
            }


        } catch (e) {
            log(chalk.red('服务意外终止'))
            log(chalk.red(e))
            await browser.close()
        } finally {
            process.exit(0)
        }
    })()
