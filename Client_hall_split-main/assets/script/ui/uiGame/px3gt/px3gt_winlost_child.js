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

        //阵营
        let lb_zhenying = this.node.getChildByName("contentLayout").getChildByName("lb_zhenying");
        lb_zhenying.active = true;
        let zhenying = lb_zhenying.getComponent(cc.Label);
        if (player.isRed) {
            zhenying.string = "红方";
        }else{
            zhenying.string = "蓝方";
        }
        
        //底分
        let lb_difen = this.node.getChildByName("contentLayout").getChildByName("lb_difen");
        lb_difen.active = true;
        let difen = lb_difen.getComponent(cc.Label);
        difen.string = player.baseScore;

        //奖分
        let lb_jiangfen = this.node.getChildByName("contentLayout").getChildByName("lb_jiangfen");
        lb_jiangfen.active = true;
        let jiangfen = lb_jiangfen.getComponent(cc.Label);
        jiangfen.string = player.rewardScore;

        //认奖分
        let lb_renjiang = this.node.getChildByName("contentLayout").getChildByName("lb_renjiang");
        lb_renjiang.active = true;
        let renjiang = lb_renjiang.getComponent(cc.Label);
        renjiang.string = player.renJiang;

        //臭庄
        let lb_chouzhuang = this.node.getChildByName("contentLayout").getChildByName("lb_chouzhuang");
        lb_chouzhuang.active = true;
        let chouzhuang = lb_chouzhuang.getComponent(cc.Label);
        chouzhuang.string = player.chouZhuang;
    },
});
