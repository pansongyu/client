(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zjjhmj/zjjhmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a5923mqZf1EkqO10Cae6TB+', 'zjjhmjChildCreateRoom', __filename);
// script/ui/uiGame/zjjhmj/zjjhmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var zjjhmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var jiesan = this.GetIdxByKey("jiesan");
        var xianShi = this.GetIdxByKey("xianShi");
        var difen = this.GetIdxByKey("difen");
        var wanfa = this.GetIdxByKey("wanfa");
        var fangjian = [];
        for (var i = 0; i < this.Toggles['fangjian'].length; i++) {
            if (this.Toggles['fangjian'][i].getChildByName('checkmark').active) {
                fangjian.push(i);
            }
        }
        var gaoji = [];
        for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
            if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
                gaoji.push(_i);
            }
        }
        sendPack = {
            "jiesan": jiesan,
            "xianShi": xianShi,
            "fangjian": fangjian,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji,
            "difen": difen,
            "wanfa": wanfa
        };
        return sendPack;
    }
});

module.exports = zjjhmjChildCreateRoom;

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
        //# sourceMappingURL=zjjhmjChildCreateRoom.js.map
        