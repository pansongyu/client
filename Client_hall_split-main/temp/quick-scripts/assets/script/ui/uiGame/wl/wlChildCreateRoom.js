(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/wl/wlChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '884fcT+npJLdarVH2MC6UD2', 'wlChildCreateRoom', __filename);
// script/ui/uiGame/wl/wlChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sssChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var tongse = this.GetIdxByKey('tongse');
        var shunjiang = this.GetIdxByKey('shunjiang');
        var fapai = this.GetIdxByKey('fapai');
        var beilv = this.GetIdxByKey('beilv');
        var sudu = this.GetIdxByKey('sudu');
        var wujiang = this.GetIdxByKey('wujiang');
        var wanfa = this.GetIdxByKey('wanfa');
        //let fengDing=this.GetIdxByKey('fengDing');

        var jiesan = this.GetIdxByKey('jiesan');
        var xianShi = this.GetIdxByKey('xianShi');
        var gaoji = [];
        for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
            if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
                gaoji.push(i);
            }
        }
        var kexuanwanfa = [];
        for (var _i = 0; _i < this.Toggles['kexuanwanfa'].length; _i++) {
            if (this.Toggles['kexuanwanfa'][_i].getChildByName('checkmark').active) {
                kexuanwanfa.push(_i);
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

            "tongse": tongse,
            "shunjiang": shunjiang,
            "fapai": fapai,
            "beilv": beilv,
            "sudu": sudu,
            "wujiang": wujiang,
            "wanfa": wanfa,
            //"fengDing":fengDing,

            "kexuanwanfa": kexuanwanfa,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji
        };
        return sendPack;
    }
});

module.exports = sssChildCreateRoom;

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
        //# sourceMappingURL=wlChildCreateRoom.js.map
        