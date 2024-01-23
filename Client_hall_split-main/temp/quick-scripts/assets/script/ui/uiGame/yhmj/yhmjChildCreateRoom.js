(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yhmj/yhmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '37b03wRTvJEoK+6oJLBOd2I', 'yhmjChildCreateRoom', __filename);
// script/ui/uiGame/yhmj/yhmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};

        var hupai = this.GetIdxByKey('hupai');
        var fengDing = this.GetIdxByKey('fengDing');
        var shaozhuang = this.GetIdxByKey('shaozhuang');
        var dihu = this.GetIdxByKey('dihu');
        var yougangyouhu = this.GetIdxByKey('yougangyouhu');
        var bangyipao = this.GetIdxByKey('bangyipao');
        var maima = this.GetIdxByKey('maima');
        var mapai = this.GetIdxByKey('mapai');
        // let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        if (maima == 0) {
            // this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
            mapai = -1;
        }
        if (parseInt(renshu[0]) == 2) {
            // this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
            shaozhuang = -1;
        }

        sendPack = {

            "hupai": hupai,
            "fengDing": fengDing,
            "shaozhuang": shaozhuang,
            "dihu": dihu,
            "yougangyouhu": yougangyouhu,
            "bangyipao": bangyipao,
            "maima": maima,
            "mapai": mapai,
            // "kexuanwanfa":kexuanwanfa,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard

        };
        return sendPack;
    },

    GetIdxsByKey: function GetIdxsByKey(key) {
        if (!this.Toggles[key]) {
            return [];
        }

        var arr = [];
        for (var i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },

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

        if ('jushu' == key || 'renshu' == key || 'fangfei' == key || "zhuaniaomoshi" == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            this.UpdateOnClickToggle();
            return;
        } else if ('kexuanwanfa' == key) {} else if ("fangjian" == key) {}
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
        this.UpdateOnClickToggle();
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles['mapai']) {
            if (this.Toggles['maima'][0].getChildByName("checkmark").active) {
                this.Toggles['mapai'][0].parent.active = false;
            } else {
                this.Toggles['mapai'][0].parent.active = true;
            }
        }
        if (this.Toggles['shaozhuang']) {
            if (this.Toggles['renshu'][0].getChildByName("checkmark").active) {
                this.Toggles['shaozhuang'][0].parent.active = false;
            } else {
                this.Toggles['shaozhuang'][0].parent.active = true;
            }
        }
    }
});

module.exports = fzmjChildCreateRoom;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=yhmjChildCreateRoom.js.map
        