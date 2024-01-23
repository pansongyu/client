"use strict";
cc._RF.push(module, '0f279o4RNpGDa4xxiPJqy3Q', 'sssChildCreateRoom');
// script/ui/uiGame/sss/sssChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    OnToggleClick: function OnToggleClick(event) {
        this.FormManager.CloseForm("UIMessageTip");
        var toggles = event.target.parent;
        var toggle = event.target;
        var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
        var toggleIndex = parseInt(toggle.name.substring('Toggle'.length, toggle.name.length)) - 1;
        var needClearList = [];
        var needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('zhuangjiaguize' == key) {
            if (toggleIndex == 0) {
                app.SysNotifyManager().ShowSysMsg('房主坐庄暂时不能选择，我们将尽快修复');
                return;
            }
        }
        if (toggles.getComponent(cc.Toggle)) {
            //复选框
            needShowIndexList = [];
            for (var i = 0; i < needClearList.length; i++) {
                var mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if (mark && i != toggleIndex) {
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if (!mark && i == toggleIndex) {
                        needShowIndexList.push(i);
                    }
            }
        }
        this.ClearToggleCheck(needClearList, needShowIndexList);
        this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
    },
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var sss_kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                sss_kexuanwanfa.push(i);
            }
        }
        var fangjian = [];
        for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
            if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
                fangjian.push(_i);
            }
        }
        var sss_zhuangjiaguize = -1;
        var sign = 0;
        var huase = [];
        var daqiang = -1;
        var difen = -1;
        var guize = -1;
        var paixingfenshu = -1;
        if ("sss_zz" == this.gameType) {
            sign = 1;
            sss_zhuangjiaguize = this.GetIdxByKey('zhuangjiaguize');
        } else if ("sss_dr" == this.gameType) {
            sign = 2;
        }
        //打枪倍数
        daqiang = this.GetIdxByKey('daqiang');
        //底分
        difen = this.GetIdxByKey('difen');
        //限时
        guize = this.GetIdxByKey('guize');
        //牌型分数
        paixingfenshu = this.GetIdxByKey('paixingfenshu');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = [];
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        //自由扑克
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "sign": sign,
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "kexuanwanfa": sss_kexuanwanfa,
            "fangjian": fangjian,
            "zhuangjiaguize": sss_zhuangjiaguize,
            "daqiang": daqiang,
            "difen": difen,
            "guize": guize,
            "jiesan": jiesan,
            "gaoji": gaoji,
            "paixingfenshu": paixingfenshu
        };
        return sendPack;
    }
});

module.exports = sssChildCreateRoom;

cc._RF.pop();