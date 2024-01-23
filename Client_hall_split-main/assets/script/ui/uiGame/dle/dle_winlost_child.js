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

       
        //抓分
        let lb_sheng2 = this.node.getChildByName("contentLayout").getChildByName("lb_sheng2");
	    lb_sheng2.active = true;
        let sheng2 = lb_sheng2.getComponent(cc.Label);
        sheng2.string = player.twoRestNum;
    },
});
