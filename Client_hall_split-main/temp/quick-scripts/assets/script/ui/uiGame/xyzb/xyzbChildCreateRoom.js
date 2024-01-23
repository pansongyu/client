(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xyzb/xyzbChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f59a8EQWlhKXLF3dMnvnSBG', 'xyzbChildCreateRoom', __filename);
// script/ui/uiGame/xyzb/xyzbChildCreateRoom.js

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
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');

        var gaoji = [];
        for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        var fangjian = [];
        for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
            if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
                fangjian.push(_i);
            }
        }
        var kexuanwanfa = [];
        for (var _i2 = 0; _i2 < this.Toggles['kexuanwanfa'].length; _i2++) {
            if (this.Toggles['kexuanwanfa'][_i2].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i2);
            }
        }
        if (isSpiltRoomCard == 1) {
            isSpiltRoomCard = 2;
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,
            "fangjian": fangjian,
            "kexuanwanfa": kexuanwanfa
        };
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
        //# sourceMappingURL=xyzbChildCreateRoom.js.map
        