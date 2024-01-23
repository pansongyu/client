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
        
        //名次
        let lb_mingci = this.node.getChildByName("contentLayout").getChildByName("lb_mingci");
	    lb_mingci.active = true;
        let difen = lb_mingci.getComponent(cc.Label);
        difen.string = "";
        if (player.finishOrder > 0) {
	        difen.string = player.finishOrder;
        }

        //奖分
        let lb_jiangfen = this.node.getChildByName("contentLayout").getChildByName("lb_jiangfen");
        lb_jiangfen.active = true;
        let jiangfen = lb_jiangfen.getComponent(cc.Label);
        jiangfen.string = player.rewardScore;

        //抓分
        let lb_zhuafen = this.node.getChildByName("contentLayout").getChildByName("lb_zhuafen");
	    lb_zhuafen.active = true;
        let renjiang = lb_zhuafen.getComponent(cc.Label);
        renjiang.string = player.score;
    },
});
