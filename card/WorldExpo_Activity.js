function WorldExpoAct() {}
WorldExpoAct.prototype = {
    requestHome: function(fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=1';
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestTaskHome: function(fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=6';
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestAcceptTask: function(fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=7';
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestOpenTaskBox: function(fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=9';
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestGetTaskRes: function(taskType, fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=8&id=' + taskType;
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestMakeYZ: function(yzId, fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=5&yid=' + yzId;
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestOpenMen: function(menIdx, fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=4&id=' + (menIdx - 1);
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestYZExCard: function(yId, fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=2&yid=' + yId;
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    },
    requestExGift: function(index, fnSucc) {
        var sUrl = 'http://card.show.qq.com/cgi-bin/card_act_travel?act=3&id=' + (index - 1);
        var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
        xhr.send();
    }
}

function yszz() { //勇士之章
    var ActRequest = new WorldExpoAct();
    ActRequest.requestExGift(1, function(oXml) {
        var data = JSON.parse(oXml.text);
        if (data.code == 0) {
            console.info('兑换成功: ' + CARD.data.mapTheme[568][1]);
            collection_add(568);
        } else {
            console.info(data.desc);
        }
    });
}

function sjblh(arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]) { //世界博览会
    var yzId = arr.pop();
    var ActRequest = new WorldExpoAct();
    ActRequest.requestYZExCard(yzId, function(oXml) {
        var data = JSON.parse(oXml.text);
        if (data.code == 0) {
            console.info('兑换成功: 印章' + yzId);
            if (arr.length > 0) {
                sjblh(arr);
            } else {
                collection_add(566);
            }
        } else {
            console.info(data.desc);
        }
    });
}

function collection_add(theme) {
    var giftid = CARD.data.mapTheme[theme][9].split('|').pop();

    function fnSucc(oXml) {
        var obj = oXml.xmlDom.getElementsByTagName('QQHOME')[0];
        var iCode = obj.getAttribute('code');
        if (iCode == 0) {
            console.info('入册成功: ' + CARD.data.mapTheme[theme][1]);
        } else {
            if (iCode == -33033) {
                sContent = '您的卡片放入集卡册成功，但是系统繁忙导致发放QQ秀奖励失败，我们会在24小时内补发，请注意查收。<br>（魔法金币和经验奖励已经成功发放）';
            } else if (iCode == -32002) {
                sContent = '对不起，您的套卡不全，不能放入集卡册哦！';
            } else {
                sContent = '系统繁忙，请您稍候再试！';
            }
            console.info(sContent);
        }
    }
    var sUrl = 'http://card.show.qq.com/cgi-bin/card_collection_add?theme=' + theme + '&themetype=0&giftid=' + giftid;
    var xhr = new CARD.XHR(sUrl, fnSucc, null, null);
    xhr.send();
}
