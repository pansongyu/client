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
        // //倍数默认1

        //剩余牌数
        this.node.getChildByName("lb_paishu").active = true;
        let paishu = this.node.getChildByName("lb_paishu").getComponent(cc.Label);
        paishu.string = player.surplusCardList[index];
    },
});
