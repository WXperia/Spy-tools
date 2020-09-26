const cofig = {
    taobao: (key)=>{
        return  `https://s.taobao.com/search?q=${key}&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20200921&ie=utf8`
    },
    baidu: (key)=>{
        return `https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1600486165662_R&pv=&ic=&nc=1&z=&hd=&latest=&copyright=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&hs=2&sid=&word=${key}`;
    }
}

module.exports = cofig;