/*

 */

let app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {

	},
	ShowPlayerData:function(resultsList, playerAll,idx){
        let data = resultsList[idx];
        let userInfo = this.node.getChildByName("user_info");
        if(userInfo){
            userInfo.getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
            userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
            for(let index in playerAll){
                let player = playerAll[index];
                if(player.pid == data.pid){
                    userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
                    // if(player.sex==app.ShareDefine().HeroSex_Boy){
                    //     userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame=this.SpriteMale;
                    // }else if(player.sex==app.ShareDefine().HeroSex_Girl){
                    //     userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame=this.SpriteFeMale;
                    // }
                    break;
                }
            }
        }

        let jiesuan = this.node.getChildByName("jiesuan");
        let show=1;
        let showLabel=false;
        if(jiesuan){
            this.huTypesShow(jiesuan,data);
            if(data.point>=0){
                jiesuan.getChildByName("lb_win").active=true;
                jiesuan.getChildByName("lb_lost").active=false;
                jiesuan.getChildByName("lb_win").getComponent(cc.Label).string = '+'+data.point;
            }else{
                jiesuan.getChildByName("lb_win").active=false;
                jiesuan.getChildByName("lb_lost").active=true;
                jiesuan.getChildByName("lb_lost").getComponent(cc.Label).string = data.point;
            }
            //比赛分
            if (typeof(data.sportsPoint)!="undefined") {
                jiesuan.getChildByName("lb_sportsPoint").active = true;
                if (data.sportsPoint > 0) {
                    jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "比赛分：+" + data.sportsPoint;
                }else{
                    jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "比赛分：" + data.sportsPoint;
                }
            }else{
                jiesuan.getChildByName("lb_sportsPoint").active = false;
            }
        }
        let maxPoint=0;
        let maxDianPao=0;
        for(let i = 0; i < resultsList.length; i++){
            let data = resultsList[i];
            if(data.point>maxPoint){
                maxPoint=data.point;
            }
            if(data.dianPaoPoint>maxDianPao){
                maxDianPao=data.dianPaoPoint;
            }
        }
        //显示大赢家图标
        if(data.dianPaoPoint>=maxDianPao && maxDianPao>0){
            this.node.getChildByName('icon_paoshou').active=true;
        }else{
            this.node.getChildByName('icon_paoshou').active=false;
        }
        if(data.point>=maxPoint){
            this.node.getChildByName('icon_win').active=true;
            this.node.getChildByName('icon_paoshou').active=false;
        }else{
            this.node.getChildByName('icon_win').active=false;
        }
	},

    huTypesShow:function(jiesuan,huData){
        jiesuan.getChildByName('top').getChildByName('lb_zuida').getComponent(cc.Label).string=huData.maxPoint;
        jiesuan.getChildByName('top').getChildByName('lb_hupai').getComponent(cc.Label).string=huData.huPoint;
        jiesuan.getChildByName('top').getChildByName('lb_teshu').getComponent(cc.Label).string=huData.specialPoint;
    },
});
