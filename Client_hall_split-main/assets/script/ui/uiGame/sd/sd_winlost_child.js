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

         this.node.getChildByName("lb_zhadanfen").active = true;
        let lb_zhadanfen = this.node.getChildByName("lb_zhadanfen").getComponent(cc.Label);
        lb_zhadanfen.string = player.zhaDanFen;
        //剩余牌数
        if(player.shouCard.length>0){
            this.node.getChildByName("lb_paishu").active = true;
            let paishu = this.node.getChildByName("lb_paishu").getComponent(cc.Label);
            paishu.string = player.shouCard.length;
        }else{
            this.node.getChildByName("lb_paishu").active = false;
        }
    },
});
