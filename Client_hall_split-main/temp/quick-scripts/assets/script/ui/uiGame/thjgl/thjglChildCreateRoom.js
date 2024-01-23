(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/thjgl/thjglChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e8b8f0SDn1LJ7iosfJC4yNM', 'thjglChildCreateRoom', __filename);
// script/ui/uiGame/thjgl/thjglChildCreateRoom.js

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
        var difen = this.GetIdxByKey('difen');
        var chupaishunxu = this.GetIdxByKey('chupaishunxu');
        var sandai = this.GetIdxsByKey('sandai');
        var sidai = this.GetIdxsByKey('sidai');
        var fangjian = this.GetIdxsByKey('fangjian');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen": difen,
            "chupaishunxu": chupaishunxu,
            "sidai": sidai,
            "sandai": sandai,
            "fangjian": fangjian,
            "kexuanwanfa": kexuanwanfa,
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
    AdjustSendPack: function AdjustSendPack(sendPack) {
        // 勾选“每局红四处”玩法，才能勾选“必带红四”
        if (sendPack.chupaishunxu != 0) {
            this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
        }
        return sendPack;
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["chupaishunxu"][0].getChildByName('checkmark').active) {
                this.Toggles["kexuanwanfa"][0].parent.active = true;
            } else {
                this.Toggles["kexuanwanfa"][0].parent.active = false;
            }
        }
    }
});

module.exports = ddzChildCreateRoom;

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
        //# sourceMappingURL=thjglChildCreateRoom.js.map
        