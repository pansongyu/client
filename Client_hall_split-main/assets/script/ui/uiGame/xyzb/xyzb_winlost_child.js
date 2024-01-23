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
        if (player.ranksType == 1) {
            zhenying.string = "红方";
        }else if(player.ranksType == 2){
            zhenying.string = "蓝方";
        }

        let contentLayout = this.node.getChildByName("contentLayout");
        //奖分
        contentLayout.getChildByName("lb_jiangfen").getComponent(cc.Label).string = player.prizePoint;
        //输赢分
        contentLayout.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = player.basePoint;
        //得分
        contentLayout.getChildByName("lb_defen").getComponent(cc.Label).string = player.point;
        //总得分
        contentLayout.getChildByName("lb_zongdefen").getComponent(cc.Label).string = player.roomPoint;
    },
});
