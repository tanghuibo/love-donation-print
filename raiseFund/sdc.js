var axios = require('axios');
const qs = require('qs');

function getData(anchorId, pageNum, infoUuid) {
    return axios({
        method: 'post',
        url: 'https://api.shuidichou.com/api/cf/v5/detail/get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            infoUuid,
            anchorId,
            pageNum,
            size: 100,
            degree: 1
        })
    }).then(response => response.data.data);
}
module.exports = {
    async query(urlStr) {
        let url = new URL(urlStr);
        let paths = url.pathname.split('/');
        let infoUuid = paths[paths.length - 1];
        let hasNext = true;
        let anchorId = '';
        let resultList = [];
        let page = 1;
        let id = 1;
        while (hasNext) {
            let data = await getData(anchorId, page, infoUuid);
            if (data == null) {
                break;
            }
            hasNext = data.hasNext;
            if (hasNext == null) {
                hasNext = false;
            }
            anchorId = data.anchorId;
            if (data.list == null) {
                break;
            }
            resultList = resultList.concat(data.list.map(({ nickname, comment, amt, headImgUrl }) => ({ id: id++, nickname, comment, amt, headImgUrl })));
            if (page > 1000) {
                break;
            }
            page++;
        }
        console.log(`sdc query success; itme: ${new Date().toString()}, infoUuid: ${infoUuid}, data.length: ${resultList.length}`);
        return resultList;
    },
    check(urlStr) {
        try {
            let url = new URL(urlStr);
            if (!url.origin.endsWith("www.shuidichou.com")) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}