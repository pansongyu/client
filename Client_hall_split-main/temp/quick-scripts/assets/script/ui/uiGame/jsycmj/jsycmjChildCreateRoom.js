(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/jsycmj/jsycmjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '58d511hDHNEEKpVpQYWpeue', 'jsycmjChildCreateRoom', __filename);
// script/ui/uiGame/jsycmj/jsycmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var wzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var wanfa = this.GetIdxByKey("wanfa");
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        // let kexuanwanfa=[];
        // for(let i=0;i<this.Toggles['kexuanwanfa'].length;i++){
        //     if(this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active){
        //         kexuanwanfa.push(i);
        //     }
        // }
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
            // "kexuanwanfa":kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "wanfa": wanfa,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "xianShi": xianShi,
            "jiesan": jiesan
        };
        return sendPack;
    }
});

module.exports = wzmjChildCreateRoom;

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
        //# sourceMappingURL=jsycmjChildCreateRoom.js.map
        