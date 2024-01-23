(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/myxzmj/myxzmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5e532Obi9ZEIqJU+qplxZD3', 'myxzmjChildCreateRoom', __filename);
// script/ui/uiGame/myxzmj/myxzmjChildCreateRoom.js

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
        var fengDing = this.GetIdxByKey("fengDing");
        var fanxing = this.GetIdxByKey("fanxing");
        var chajiao = this.GetIdxByKey("chajiao");
        var zimojiangli = this.GetIdxByKey("zimojiangli");
        var dianganghua = this.GetIdxByKey("dianganghua");
        var piaofen = this.GetIdxByKey("piaofen");
        var huanpai = this.GetIdxByKey("huanpai");

        var jiesan = this.GetIdxByKey("jiesan");
        var xianShi = this.GetIdxByKey("xianShi");

        var kexuanwanfa = this.GetIdxsByKey("kexuanwanfa");
        var fangjian = this.GetIdxsByKey("fangjian");
        var gaoji = this.GetIdxsByKey("gaoji");

        var fangshu = this.GetIdxByKey('fangshu');
        sendPack = {
            "fengDing": fengDing,
            "fanxing": fanxing,
            "chajiao": chajiao,
            "zimojiangli": zimojiangli,
            "dianganghua": dianganghua,
            "piaofen": piaofen,
            "huanpai": huanpai,

            "jiesan": jiesan,
            "xianShi": xianShi,

            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "fangshu": fangshu,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard
        };

        return sendPack;
    },
    AdjustSendPack: function AdjustSendPack(sendPack) {
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

            if ('renshu' == key) {
                this.CheckFangshu();
            }

            return;
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
        this.UpdateOnClickToggle();
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {},
    //房数检测
    CheckFangshu: function CheckFangshu() {
        if (this.Toggles["fangshu"] == undefined) {
            return;
        }

        var renshu = this.getCurSelectRenShu(); //发给服务器人数用选的
        if (renshu[1] == 2) {
            this.Toggles["fangshu"][0].active = false; //3房
            this.Toggles["fangshu"][1].active = true; //2房
            this.Toggles["fangshu"][2].active = true; //1房
            this.Toggles["fangshu"][1].x = this.Toggles["fangshu"][0].x;
            this.Toggles["fangshu"][2].x = this.Toggles["fangshu"][0].x + 200;
            var event = {};
            event.target = this.Toggles['fangshu'][1];
            this.OnToggleClick(event);
        } else if (renshu[1] == 3) {
            this.Toggles["fangshu"][0].active = true; //3房
            this.Toggles["fangshu"][1].active = true; //2房
            this.Toggles["fangshu"][2].active = false; //1房
            this.Toggles["fangshu"][1].x = this.Toggles["fangshu"][0].x + 200;
            this.Toggles["fangshu"][2].x = this.Toggles["fangshu"][0].x + 400;
            var _event = {};
            _event.target = this.Toggles['fangshu'][1];
            this.OnToggleClick(_event);
        } else if (renshu[1] == 4) {
            this.Toggles["fangshu"][0].active = true; //3房
            this.Toggles["fangshu"][1].active = false; //2房
            this.Toggles["fangshu"][2].active = false; //1房

            var _event2 = {};
            _event2.target = this.Toggles['fangshu'][0];
            this.OnToggleClick(_event2);
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
        //# sourceMappingURL=myxzmjChildCreateRoom.js.map
        