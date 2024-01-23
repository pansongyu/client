(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/bamj/bamjChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c304c1ZA39OpKB24ndNb2il', 'bamjChildCreateRoom', __filename);
// script/ui/uiGame/bamj/bamjChildCreateRoom.js

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

        var hupaifangshi = this.GetIdxByKey('hupaifangshi');
        var xiapao = this.GetIdxByKey('xiapao');
        var fengpai = this.GetIdxByKey('fengpai');
        var gangdi = this.GetIdxByKey('gangdi');
        var zimosuanfen = this.GetIdxByKey('zimosuanfen');
        var dianpaosuanfen = this.GetIdxByKey('dianpaosuanfen');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "hupaifangshi": hupaifangshi,
            "xiapao": xiapao,
            "fengpai": fengpai,
            "gangdi": gangdi,
            "zimosuanfen": zimosuanfen,
            "dianpaosuanfen": dianpaosuanfen,
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
    AdjustSendPack: function AdjustSendPack(sendPack) {
        return sendPack;
    },
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["kexuanwanfa"]) {
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            if (this.Toggles["hupaifangshi"][0].getChildByName("checkmark").active) {
                this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;
                //置灰
                if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
                }
            } else {
                //恢复
                if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
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
        //# sourceMappingURL=bamjChildCreateRoom.js.map
        