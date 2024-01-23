(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/za16mj/za16mjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd56b7WZoKlBt43ZmmZyMCdR', 'za16mjChildCreateRoom', __filename);
// script/ui/uiGame/za16mj/za16mjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zjmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var fangjian = [];
        var chatai = this.GetIdxByKey('chatai');
        var chipai = this.GetIdxByKey('chipai');
        var gaoji = [];
        for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        var kexuanwanfa = [];
        for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
            if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i);
            }
        }
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "chatai": chatai,
            "chipai": chipai,
            "fangjian": fangjian,
            //房间默认配置（人数局数支付）
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "kexuanwanfa": kexuanwanfa,
            "gaoji": gaoji

        };
        return sendPack;
    }
});

module.exports = zjmjChildCreateRoom;

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
        //# sourceMappingURL=za16mjChildCreateRoom.js.map
        