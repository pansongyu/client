(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hbpdk/hbpdkChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd72d9zCnVhBxom7jvbwMPun', 'hbpdkChildCreateRoom', __filename);
// script/ui/uiGame/hbpdk/hbpdkChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var hbpdkChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var shoupai = this.GetIdxByKey('shoupai');
        var xianchu = this.GetIdxByKey('xianchu');
        var kexuanwanfa = [];
        var maxAddDouble = 0;
        var zhadansuanfa = 0;
        var zhadanfenshu = 0;
        kexuanwanfa.push(4); //固定3A炸
        kexuanwanfa.push(13); //固定三不带
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            var isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
            if (isCheck) {
                if (this.Toggles['kexuanwanfa'][i].serverIdx) {
                    kexuanwanfa.push(this.Toggles['kexuanwanfa'][i].serverIdx);
                } else {
                    kexuanwanfa.push(i);
                }
            }
        }
        for (var _i = 0; _i < this.Toggles['zhadanfenshu'].length; _i++) {
            var _isCheck = this.Toggles['zhadanfenshu'][_i].getChildByName('checkmark').active;
            if (_isCheck) {
                zhadanfenshu = _i;
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "cardNum": shoupai,
            "xianchu": xianchu,
            "kexuanwanfa": kexuanwanfa,
            "zhadanfenshu": zhadanfenshu,
            "score": 0,
            "maxAddDouble": maxAddDouble
        };
        //通用高级
        var gaoji = [];
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        sendPack.gaoji = gaoji;
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
            // //每局先出黑桃3和首局先出黑桃3不能同时选择
            // if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 1){
            //     this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            // }
            // else if(this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 0){
            //     this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            // }
            // //每局先出黑桃3和首局先出黑桃3必须选择一项
            // if(this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 0){
            //     return;
            // }
            // if(this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 1){
            //     return;
            // }
        } else {}
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

module.exports = hbpdkChildCreateRoom;

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
        //# sourceMappingURL=hbpdkChildCreateRoom.js.map
        