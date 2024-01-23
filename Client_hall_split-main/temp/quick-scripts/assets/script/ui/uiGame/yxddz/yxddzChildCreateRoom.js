(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yxddz/yxddzChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7a51fmDsOlOJJTcyrHpZt0v', 'yxddzChildCreateRoom', __filename);
// script/ui/uiGame/yxddz/yxddzChildCreateRoom.js

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
        var dizhufengding = this.GetIdxByKey('dizhufengding');
        var quedingdizhu = this.GetIdxByKey('quedingdizhu');
        var zhadan = this.GetIdxByKey('zhadan');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var sandai = [];
        for (var i = 0; i < this.Toggles['sandai'].length; i++) {
            if (this.Toggles['sandai'][i].getChildByName('checkmark').active) {
                sandai.push(i);
            }
        }
        var sidai = [];
        for (var _i = 0; _i < this.Toggles['sidai'].length; _i++) {
            if (this.Toggles['sidai'][_i].getChildByName('checkmark').active) {
                sidai.push(_i);
            }
        }
        var jiabei = [];
        for (var _i2 = 0; _i2 < this.Toggles['jiabei'].length; _i2++) {
            if (this.Toggles['jiabei'][_i2].getChildByName('checkmark').active) {
                jiabei.push(_i2);
            }
        }
        var kexuanwanfa = [];
        for (var _i3 = 0; _i3 < this.Toggles['kexuanwanfa'].length; _i3++) {
            if (this.Toggles['kexuanwanfa'][_i3].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i3);
            }
        }
        var fangjian = [];
        for (var _i4 = 0; _i4 < this.Toggles['fangjian'].length; _i4++) {
            if (this.Toggles['fangjian'][_i4].getChildByName('checkmark').active) {
                fangjian.push(_i4);
            }
        }
        var gaoji = [];
        for (var _i5 = 0; _i5 < this.Toggles['gaoji'].length; _i5++) {
            if (this.Toggles['gaoji'][_i5].getChildByName('checkmark').active) {
                gaoji.push(_i5);
            }
        }
        sendPack = {
            "setCount": setCount,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "paymentRoomCardType": isSpiltRoomCard,
            "difen": difen,
            "dizhufengding": dizhufengding,
            "quedingdizhu": quedingdizhu,
            "zhadan": zhadan,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "jiabei": jiabei,
            "kexuanwanfa": kexuanwanfa,
            "sandai": sandai,
            "sidai": sidai
        };
        return sendPack;
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
        //# sourceMappingURL=yxddzChildCreateRoom.js.map
        