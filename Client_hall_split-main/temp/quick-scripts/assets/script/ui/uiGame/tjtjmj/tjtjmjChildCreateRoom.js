(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/tjtjmj/tjtjmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bcd7bQT4H9Ec5Ljf2etcEzn', 'tjtjmjChildCreateRoom', __filename);
// script/ui/uiGame/tjtjmj/tjtjmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var qymjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var moshi = this.GetIdxByKey('moshi');
        var gangfen = this.GetIdxByKey('gangfen');
        var gangpai = this.GetIdxByKey('gangpai');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "moshi": moshi,
            "gangfen": gangfen,
            "gangpai": gangpai,
            "kexuanwanfa": kexuanwanfa,
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
    // CreateSendPack -end-

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
            if (toggleIndex == 0) {
                var mark4 = this.Toggles['renshu'][2].getChildByName('checkmark').active;
                if (!mark4) {
                    app.SysNotifyManager().ShowSysMsg("四人才能选择带铲", [], 3);
                    return;
                }
            }
        } else if ('gangfen' == key) {
            if (toggleIndex == 1) {
                var _mark = this.Toggles['moshi'][0].getChildByName('checkmark').active;
                if (!_mark) {
                    app.SysNotifyManager().ShowSysMsg("坐一拉二才能勾选坐庄拉庄杠翻番", [], 3);
                    return;
                }
            }
            //自摸胡和点炮大包不能同时选择
            // if(this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active && toggleIndex == 3){
            //     this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][2].parent);
            // }
            // else if(this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active && toggleIndex == 2){
            //     this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][3].parent);
            // }
        }
        // else if ('xiapao' == key) {
        //     if (toggleIndex == 5 && !needClearList[toggleIndex].getChildByName('checkmark').active) {
        //         this.Toggles['zuigaopaoshu'][0].parent.active = true;
        //     } else {
        //         this.Toggles['zuigaopaoshu'][0].parent.active = false;
        //     }
        // }

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

    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        // if (this.Toggles["kexuanwanfa"]) {
        //     if (this.Toggles["kexuanwanfa"][1].getChildByName("checkmark").active) {
        //         this.Toggles["kexuanwanfa"][2].active = true;
        //     } else {
        //         this.Toggles["kexuanwanfa"][2].active = false;
        //     }
        // }

        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    }

});

module.exports = qymjChildCreateRoom;

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
        //# sourceMappingURL=tjtjmjChildCreateRoom.js.map
        