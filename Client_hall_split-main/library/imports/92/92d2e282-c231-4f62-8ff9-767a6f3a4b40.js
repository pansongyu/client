"use strict";
cc._RF.push(module, '92d2eKCwjFPYo/5dnpvOktA', 'st_winlost_child');
// script/ui/uiGame/st/st_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function OnLoad() {},
    ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
        //let player = setEnd.posResultList[index];

        //地主标识
        /*if (player.isLandowner) {
            this.node.getChildByName("user_info").getChildByName("icon_dzm").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("icon_dzm").active = false;
        }
        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);
         beishu.string = player.doubleNum;*/

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