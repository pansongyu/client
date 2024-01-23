(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/py/py_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3220bAsoj1JirBZLvuvZLPN', 'py_winlost_child', __filename);
// script/ui/uiGame/py/py_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {
        icon_you: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
        var player = setEnd.posResultList[index];

        //地主标识
        // if (player.isLandowner) {
        //     this.node.getChildByName("user_info").getChildByName("icon_dzm").active = true;
        // }else{
        //     this.node.getChildByName("user_info").getChildByName("icon_dzm").active = false;
        // }
        //加倍
        var a = player.isJiaBei == "True";
        this.node.getChildByName("img_jiabei").active = a;

        //显示游数
        var endType = player.endType; //游数  0为默认值
        var finishOrder = 0;
        if (endType == "ONE") {
            finishOrder = 1;
        } else if (endType == "TWO") {
            finishOrder = 2;
        } else if (endType == "THREE") {
            finishOrder = 3;
        } else if (endType == "FOUR") {
            finishOrder = 4;
        } else {
            finishOrder = -1;
        }
        if (finishOrder > 0) {
            this.node.getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[finishOrder - 1];
        } else {
            this.node.getChildByName('you').getComponent(cc.Sprite).spriteFrame = "";
        }

        /*//明牌倍数
        if (typeof(player.openCard) != "undefined") {
            this.node.getChildByName("lb_mingpaititle").active = true;
            this.node.getChildByName("lb_mingpai").active = true;
            let mingpai = this.node.getChildByName("lb_mingpai").getComponent(cc.Label);
             mingpai.string = player.openCard;
        }else{
            this.node.getChildByName("lb_mingpaititle").active = false;
            this.node.getChildByName("lb_mingpai").active = false;
        }
        */

        //底分
        /*this.node.getChildByName("lb_difen").active = true;
        let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.baseMark;*/

        //显示春天或者反春天
        /*let icon_robClose = this.node.getChildByName("icon_robClose");
        icon_robClose.active = true;
        
        if (player.robClose == -1) {
            icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_fct;
        }else if (player.robClose == 1) {
            icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_ct;    
        }else{
            icon_robClose.active = false;
        }*/
    }
});

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
        //# sourceMappingURL=py_winlost_child.js.map
        