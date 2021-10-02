const qsc = require("./qsc");
const sdc = require("./sdc");

let raiseFund = [sdc, qsc];


module.exports = {
    query(url) {
        let parseList = raiseFund.filter(item => item.check(url));
        if(parseList.length == 0) {
            throw "不支持当前捐款地址";
        }
        return parseList[0].query(url);

    }
}