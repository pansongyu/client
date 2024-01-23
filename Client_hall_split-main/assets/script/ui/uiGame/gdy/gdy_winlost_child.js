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
        
        //倍数
        this.node.getChildByName("lb_beiShu").active = true;
        let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

        beishu.string = player.springPoint;

        //底分
        this.node.getChildByName("lb_difen").active = true;
        let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
        difen.string = player.privateCardSize;
    },
});
