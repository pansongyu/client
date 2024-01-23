"use strict";
cc._RF.push(module, '8393814QwpLjoZEjFV+c9I3', 'wnpdkChildCreateRoom');
// script/ui/uiGame/wnpdk/wnpdkChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var ddzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var shoupai = this.GetIdxByKey('shoupai');
        var jiesuan = this.GetIdxByKey('jiesuan');
        var xianShi = this.GetIdxByKey('xianShi');
        var wnpdk_jiesan = this.GetIdxByKey('jiesan');
        var kexuanwanfa = [];
        var maxAddDouble = 0;
        var zhadansuanfa = 0;
        var zhadanfenshu = 0;
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
        var wnpdk_gaoji = [];
        for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
            if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
                wnpdk_gaoji.push(_i);
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "gaoji": wnpdk_gaoji,
            "jiesan": wnpdk_jiesan,
            "xianShi": xianShi,
            "paymentRoomCardType": isSpiltRoomCard,
            "shoupai": shoupai, //跑得快牌型     0-15张牌  1-16张牌
            "resultCalc": jiesuan,
            "kexuanwanfa": kexuanwanfa,
            "zhadansuanfa": zhadansuanfa,
            "zhadanfenshu": zhadanfenshu,
            "score": 0,
            "maxAddDouble": maxAddDouble
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
            //每局先出黑桃3和首局先出黑桃3不能同时选择
            if (this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 1) {
                this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            } else if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 0) {
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }
            //每局先出黑桃3和首局先出黑桃3必须选择一项
            if (this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 0) {
                return;
            }
            if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 1) {
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
    }
});

module.exports = ddzChildCreateRoom;

cc._RF.pop();