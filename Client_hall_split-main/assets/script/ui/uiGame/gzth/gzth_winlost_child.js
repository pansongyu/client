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
        }else{
            zhenying.string = "";
        }
	    let upLevelId = player["upLevelId"];
	    this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "所属推广员ID：" + upLevelId;
        let contentLayout = this.node.getChildByName("contentLayout");
        //奖分
        contentLayout.getChildByName("lb_zhenying").getComponent(cc.Label).string = player["totalHua"];
	    //得分
	    contentLayout.getChildByName("lb_defen").getComponent(cc.Label).string = player["winHua"];
	    //罚分
	    contentLayout.getChildByName("lb_fafen").getComponent(cc.Label).string = player["firstHuaBW"];
	    //输赢分
	    contentLayout.getChildByName("lb_jiangfen").getComponent(cc.Label).string = player["baoJiHua"];
        contentLayout.getChildByName("lb_jiangligenshu").getComponent(cc.Label).string = player["roomPoint"];

        //总得分
        contentLayout.getChildByName("lb_zongdefen").getComponent(cc.Label).string = player.point;
        if(player.faScore == 0){
            contentLayout.getChildByName("lb_defen").active = true;
            contentLayout.getChildByName("lb_fafen").active = false;
        }else{
            contentLayout.getChildByName("lb_defen").active = false;
            contentLayout.getChildByName("lb_fafen").active = true;
        }
    },
});
