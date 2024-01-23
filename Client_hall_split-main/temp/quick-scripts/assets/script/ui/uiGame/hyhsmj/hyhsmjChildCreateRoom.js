(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hyhsmj/hyhsmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '097a190dgBPCYqySoM/hdH6', 'hyhsmjChildCreateRoom', __filename);
// script/ui/uiGame/hyhsmj/hyhsmjChildCreateRoom.js

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
        //单选
        var zhuaniao = this.GetIdxByKey("zhuaniao");
        var quezhang = this.GetIdxByKey("quezhang");
        var jiesan = this.GetIdxByKey("jiesan");
        var xianShi = this.GetIdxByKey("xianShi");

        //多选
        var kexuanwanfa = this.GetIdxsByKey("kexuanwanfa");
        var fangjian = this.GetIdxsByKey("fangjian");
        var gaoji = this.GetIdxsByKey("gaoji");

        sendPack = {
            "zhuaniao": zhuaniao,
            "quezhang": quezhang,
            "jiesan": jiesan,
            "xianShi": xianShi,

            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard
        };

        return sendPack;
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
        //# sourceMappingURL=hyhsmjChildCreateRoom.js.map
        