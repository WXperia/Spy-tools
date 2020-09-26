const util = {
    forMatCookie: function (cookieStr) {
        cookieStr = cookieStr.replace(/\s/ig, '');
        let keyValueList = cookieStr.split(';')
        let cookieList = []
        keyValueList.forEach(item => {
            let kpv = item.split('=')
            let key = kpv[0]
            let value = kpv[1]
            let obj = {
                [key]: value
            }
            cookieList.push(obj)
        })
        return cookieList
    }
}

module.exports = util