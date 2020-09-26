
let request = require("request");
let fs = require("fs");
 
class Ut {
  static downImg(opts = {}, path = '') {
    return new Promise((resolve, reject) => {
      request
        .get(opts)
        .on('response', (response) => {
          // console.log("img type:", response.headers['content-type'])
        })
        .pipe(fs.createWriteStream(path))
        .on("error", (e) => {
          // console.log("pipe error", e)
          resolve('');
        })
        .on("finish", () => {
          // console.log("finish");
          resolve("ok");
        })
        .on("close", () => {
          // console.log("close");
        })
 
    })
  };
}
 
module.exports = Ut;