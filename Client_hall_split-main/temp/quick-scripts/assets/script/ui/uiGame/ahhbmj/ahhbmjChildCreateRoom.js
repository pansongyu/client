(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/ahhbmj/ahhbmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '82694V+LrNN/aCwKJaDKKwa', 'ahhbmjChildCreateRoom', __filename);
// script/ui/uiGame/ahhbmj/ahhbmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},

    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var jiafan = this.GetIdxsByKey('jiafan');
        var fanbei = this.GetIdxsByKey('fanbei');
        var paishu = this.GetIdxsByKey('paishu');
        var gangpaisuanfen = this.GetIdxByKey('gangpaisuanfen');
        var fangjian = this.GetIdxsByKey('fangjian');
        var qiangganghu = this.GetIdxByKey('qiangganghu');
        var paohufen = this.GetIdxByKey('paohufen');
        var zimofen = this.GetIdxByKey('zimofen');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "kexuanwanfa": kexuanwanfa,
            "jiafan": jiafan,
            "fanbei": fanbei,
            "paishu": paishu,
            "gangpaisuanfen": gangpaisuanfen,
            "fangjian": fangjian,
            "qiangganghu": qiangganghu,
            "paohufen": paohufen,
            "zimofen": zimofen,
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

    AdjustSendPack: function AdjustSendPack(sendPack) {
        // if (sendPack.shagui < 3) {
        //     sendPack.guipaijiafen = -1;
        // }
        // if (parseInt(sendPack.playerMinNum) != 2) {
        //     sendPack.ewaifenshu = -1;
        //     sendPack.jiabei = -1;
        // } else {
        //     if (sendPack.ewaifenshu != 1) {
        //         sendPack.jiabei = -1;
        //     }
        // }
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

        if ('jushu' == key || 'renshu' == key || 'fangfei' == key || "zhuaniaomoshi" == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            this.UpdateOnClickToggle();

            // 	3人场玩法时，“缺一”不可选；
            if ('renshu' == key) {
                if (toggleIndex == 1) {
                    this.Toggles['jiafan'][2].active = false;
                } else {
                    this.Toggles['jiafan'][2].active = true;
                }

                // 	3人场“去字牌”不可选；
                // 	4人场“去万牌”不可选；
                if (toggleIndex == 1) {
                    this.Toggles['paishu'][0].active = true;
                    // this.Toggles['paishu'][1].active = false;
                } else if (toggleIndex == 2) {
                    this.Toggles['paishu'][0].active = false;
                    this.Toggles['paishu'][1].active = true;
                } else {
                    this.Toggles['paishu'][0].active = true;
                    this.Toggles['paishu'][1].active = true;
                }
            }
            return;
        } else if ('kexuanwanfa' == key) {
            // 	勾选“不可点炮”，不能勾选“一炮多响”；
            if (toggleIndex == 1 && this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active) {
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                app.SysNotifyManager().ShowSysMsg("勾选不可点炮，不能勾选一炮多响");
                return;
            }
            if (toggleIndex == 2 && this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active) {
                app.SysNotifyManager().ShowSysMsg("勾选不可点炮，不能勾选一炮多响");
                return;
            }
        } else if ("fangjian" == key) {}
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
        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // 	3人场玩法时，“缺一”不可选；
        if (this.Toggles["jiafan"]) {
            if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                this.Toggles["jiafan"][2].active = false;
            } else {
                this.Toggles["jiafan"][2].active = true;
            }
        }

        // 	3人场“去字牌”不可选；
        // 	4人场“去万牌”不可选；
        if (this.Toggles["paishu"]) {
            if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                this.Toggles['paishu'][0].active = true;
                // this.Toggles['paishu'][1].active = false;
            } else if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
                this.Toggles['paishu'][0].active = false;
                this.Toggles['paishu'][1].active = true;
            } else {
                this.Toggles['paishu'][0].active = true;
                this.Toggles['paishu'][1].active = true;
            }
        }
    },

    UpdateOnClickToggle: function UpdateOnClickToggle() {
        // if (this.Toggles['guipaijiafen']) {
        //     if(this.Toggles['shagui'][3].getChildByName("checkmark").active || this.Toggles['shagui'][4].getChildByName("checkmark").active){
        //         this.Toggles['guipaijiafen'][0].parent.active = true;
        //     }else{
        //         this.Toggles['guipaijiafen'][0].parent.active = false;
        //     }
        // }
        // if (this.Toggles['ewaifenshu']) {
        //     if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
        //         this.Toggles['ewaifenshu'][0].parent.active = true;
        //     }else{
        //         this.Toggles['ewaifenshu'][0].parent.active = false;
        //     }
        // }
        // if (this.Toggles['jiabei']) {
        //     if(this.Toggles['renshu'][0].getChildByName("checkmark").active){
        //         if(this.Toggles['ewaifenshu'][1].getChildByName("checkmark").active){
        //             this.Toggles['jiabei'][0].parent.active = true;
        //         }else{
        //             this.Toggles['jiabei'][0].parent.active = false;
        //         }
        //     }else{
        //         this.Toggles['jiabei'][0].parent.active = false;
        //     }
        // }
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
        //# sourceMappingURL=ahhbmjChildCreateRoom.js.map
        