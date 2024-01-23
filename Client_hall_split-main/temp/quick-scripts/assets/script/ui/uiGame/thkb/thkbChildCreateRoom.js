(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/thkb/thkbChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8d2edPc0uZB95KWVi5G3k2B', 'thkbChildCreateRoom', __filename);
// script/ui/uiGame/thkb/thkbChildCreateRoom.js

"use strict";

/*
 创建房间子界面
 */
var app = require("app");

var ctwskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var youximoshi = this.GetIdxByKey('youximoshi');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "youximoshi": youximoshi,
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
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["youximoshi"][0].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][0].active = true;
                this.Toggles["kexuanwanfa"][1].active = false;
            } else {
                this.Toggles["kexuanwanfa"][0].active = false;
                this.Toggles["kexuanwanfa"][1].active = true;
            }
            if (typeof this.unionData != "undefined" && this.unionData != null) {
                if (this.unionData.unionId > 0) {
                    this.Toggles["kexuanwanfa"][4].active = true;
                    this.Toggles["kexuanwanfa"][5].active = true;
                }
            } else {
                this.Toggles["kexuanwanfa"][4].active = false;
                this.Toggles["kexuanwanfa"][5].active = false;
            }
        }
        console.log("this.clubData", this.clubData, this.unionData);
    },
    AdjustSendPack: function AdjustSendPack(sendPack) {
        if (sendPack.youximoshi == 0) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 1);
        }
        if (sendPack.youximoshi == 1) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
        }
        return sendPack;
    }

});

module.exports = ctwskChildCreateRoom;

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
        //# sourceMappingURL=thkbChildCreateRoom.js.map
        