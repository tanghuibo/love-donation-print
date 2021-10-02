var axios = require('axios');

function getData(projuuid, next) {
    return axios.get(`https://gateway.qschou.com/v3.0.0/support/support/${projuuid}`, {
        params: {
            next

        }
    }).then(response => response.data);
}

module.exports = {
    async query(urlStr) {
        let url = new URL(urlStr);
        let projuuid = url.searchParams.get("projuuid");
        let next = null;
        let resultList = [];
        let page = 0;
        do {
            let data = await getData(projuuid, next);
            if (data == null) {
                break;
            }
            next = data.next;

            resultList = resultList.concat(data.data.map(({ id, user: { avatar, nickname }, title, message }) => ({ id, nickname, comment: message, amt: title[1].text - 0, headImgUrl: avatar })));
            page++;
            if (page > 10000) {
                break;
            }
        } while (next != null && next != "");
        return resultList;
    },
    check(urlStr) {
        try {
            let url = new URL(urlStr);
            if (!url.origin.endsWith("m2.qschou.com")) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}