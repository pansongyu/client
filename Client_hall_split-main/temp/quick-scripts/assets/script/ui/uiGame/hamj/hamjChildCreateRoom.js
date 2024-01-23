(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hamj/hamjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6074dTiTD5J1JvIIslWAX2v', 'hamjChildCreateRoom', __filename);
// script/ui/uiGame/hamj/hamjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var hamjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var lazi = this.GetIdxByKey('lazi');
        var fangjian = this.GetIdxByKey('fangjian');
        var gaoji = [];
        for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        var kexuanwanfa = [];
        for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
            if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i);
            }
        }
        sendPack = {
            "setCount": setCount, // 局数
            "playerNum": renshu[1],
            "paymentRoomCardType": isSpiltRoomCard,
            "lazi": lazi,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": [fangjian],
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,
            "playerMinNum": renshu[0]
            // "xianShi":xianShi,
            // "jiesan":jiesan,
            // "fengDing":fengDing,
            // "playerMinNum":renshu[0],
            // "playerNum":renshu[1],
            // "setCount":setCount,
            // "paymentRoomCardType":isSpiltRoomCard,
            // "gaoji":gaoji,
            // "kexuanwanfa":kexuanwanfa,
            // "setCount":setCount,  // 局数
            // "playerNum":renshu[1],
            // "paymentRoomCardType":isSpiltRoomCard,
            // "lazi":lazi,
            // "kexuanwanfa":kexuanwanfa,
            // "fangjian":[fangjian],
            // "xianShi":xianShi,
            // "jiesan":jiesan,
            // "gaoji":gaoji,
            // "playerMinNum":renshu[0],
        };
        return sendPack;
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
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            // if(this.Toggles['zhuaniao'][0].getChildByName('checkmark').active==true && toggleIndex==4){
            //     //红中赖子
            //     app.SysNotifyManager().ShowSysMsg("按庄家中鸟不能勾选红中癞子玩法");
            //     return;
            // }
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
    }
});

module.exports = hamjChildCreateRoom;

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
        //# sourceMappingURL=hamjChildCreateRoom.js.map
        