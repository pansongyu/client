/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {

    },

	// use this for initialization
	OnLoad: function () {

	},
    ShowSpecData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];
        
        //地主标识
        if (player.isLandowner) {
            this.node.getChildByName("user_info").getChildByName("icon_dzm").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("icon_dzm").active = false;
        }
        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        beishu.string = player.doubleNum;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.baseMark;

        //显示春天或者反春天
        let icon_robClose = this.node.getChildByName("icon_robClose");
        icon_robClose.active = true;
        
        if (player.robClose == -1) {
            icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_fct;
        }else if (player.robClose == 1) {
            icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_ct;    
        }else{
            icon_robClose.active = false;
        }
    },
});
