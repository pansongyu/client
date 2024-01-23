/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
        icon_you:[cc.SpriteFrame],
    },

	// use this for initialization
	OnLoad: function () {

	},
    ShowSpecData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];
        
        //头游二游
        let finishOrder=player.finishOrder;
        if(finishOrder>0){
            if(finishOrder==setEnd.posResultList.length){
                //抹油
                this.node.getChildByName('img_touyou').getComponent(cc.Sprite).spriteFrame=this.icon_you[5];
            }else{
                this.node.getChildByName('img_touyou').getComponent(cc.Sprite).spriteFrame=this.icon_you[finishOrder-1];
            }
        }else{
            this.node.getChildByName('img_touyou').getComponent(cc.Sprite).spriteFrame="";
        }

        //王庄
        let lb_wangzhuang = this.node.getChildByName("contentLayout").getChildByName("lb_wangzhuang").getComponent(cc.Label);
        lb_wangzhuang.string = player.calcGui+"("+player.selfGui+"-"+player.zhuangGui+")";

        //奖数
        let lb_jiangshu = this.node.getChildByName("contentLayout").getChildByName("lb_jiangshu").getComponent(cc.Label);
        lb_jiangshu.string = player.calcJiang+"("+player.selfJiangShu+"-"+player.otherJiangShu+")";
        
        //奖分
        let lb_jiangfen = this.node.getChildByName("contentLayout").getChildByName("lb_jiangfen").getComponent(cc.Label);
        lb_jiangfen.string = player.rewardScore;

        //捡分
        let lb_jianfen = this.node.getChildByName("contentLayout").getChildByName("lb_jianfen").getComponent(cc.Label);
        lb_jianfen.string = player.score;

        //断分
        let lb_duanfen = this.node.getChildByName("contentLayout").getChildByName("lb_duanfen").getComponent(cc.Label);
        lb_duanfen.string = player.duanFen;

        this.node.getChildByName('img_dj').active=player.isDuJiang;
        this.node.getChildByName('img_wj').active=player.isWuJiang;
        if(player.point>=0){
            this.node.getChildByName('lb_lose_num').active=false;
            this.node.getChildByName('lb_win_num').active=true;
            this.node.getChildByName('lb_win_num').getComponent(cc.Label).string="+"+player.point;
        }else{
            this.node.getChildByName('lb_lose_num').active=true;
            this.node.getChildByName('lb_win_num').active=false;
            this.node.getChildByName('lb_lose_num').getComponent(cc.Label).string=player.point;
        }
    },
});
