/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();

        this.IntegrateImagePath={
                  "zi_fangda_10": {
                    "Name": "zi_fangda_10",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/red_10",
                  },
                  "zi_fangda_11": {
                    "Name": "zi_fangda_11",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_1",
                  },
                  "zi_fangda_12": {
                    "Name": "zi_fangda_12",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/red_2",
                  },
                  "zi_fangda_13": {
                    "Name": "zi_fangda_13",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_3",
                  },
                  "zi_fangda_14": {
                    "Name": "zi_fangda_14",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_4",
                  },
                  "zi_fangda_15": {
                    "Name": "zi_fangda_15",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_5",
                  },
                  "zi_fangda_16": {
                    "Name": "zi_fangda_16",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_6",
                  },
                  "zi_fangda_17": {
                    "Name": "zi_fangda_17",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/red_7",
                  },
                  "zi_fangda_18": {
                    "Name": "zi_fangda_18",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_8",
                  },
                  "zi_fangda_19": {
                    "Name": "zi_fangda_19",
                    "FilePath": "ui/uiGame/byzp/zi/xiaoxue/black_9",
                  },
                    "zi_fangda_20": {
                    "Name": "zi_fangda_20",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/red_10",
                  },
                  "zi_fangda_21": {
                    "Name": "zi_fangda_21",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_1",
                  },
                  "zi_fangda_22": {
                    "Name": "zi_fangda_22",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/red_2",
                  },
                  "zi_fangda_23": {
                    "Name": "zi_fangda_23",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_3",
                  },
                  "zi_fangda_24": {
                    "Name": "zi_fangda_24",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_4",
                  },
                  "zi_fangda_25": {
                    "Name": "zi_fangda_25",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_5",
                  },
                  "zi_fangda_26": {
                    "Name": "zi_fangda_26",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_6",
                  },
                  "zi_fangda_27": {
                    "Name": "zi_fangda_27",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/red_7",
                  },
                  "zi_fangda_28": {
                    "Name": "zi_fangda_28",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_8",
                  },
                  "zi_fangda_29": {
                    "Name": "zi_fangda_29",
                    "FilePath": "ui/uiGame/byzp/zi/daxue/black_9",
                  },
                  "zi_fangda_51": {
                    "Name": "zi_fangda_51",
                    "FilePath": "ui/uiGame/byzp/zi/bg_gui",
                  },
                  "zi_fangda_bg": {
                    "Name": "zi_fangda_bg",
                    "FilePath": "ui/uiGame/byzp/zi/img_pb",
                  }
        };
	},
    ShowPlayerData:function(setEnd,playerAll,index){
        let dPos=setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        this.node.active=true;
        if(dPos===index){
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = true;
        }else{
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = false;
        }
        let PlayerInfo = playerAll[index];
        //显示头像，如果头像UI
        if(PlayerInfo["pid"] && PlayerInfo["iconUrl"]){
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"],PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("userinfo").getChildByName("touxiang").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
        //显示名字跟pid
        this.node.getChildByName("userinfo").getChildByName("lb_name").getComponent(cc.Label).string=PlayerInfo.name;
        this.node.getChildByName("userinfo").getChildByName("lb_id").getComponent(cc.Label).string=PlayerInfo.pid;
        this.PlayerData(this.node,posResultList[index],index);
    },
    PlayerData:function(PlayerNode,result,pos){
        PlayerNode.active=true;
        let huTypeMap=result.endPoint.huTypeMap;
        let totalYouNum=result.endPoint.totalYouNum;
        let isZiMoMulti=result.endPoint.isZiMoMulti;
        let isDianPaoMulti=result.endPoint.isDianPaoMulti;
        let point=result.point;
        let sportsPoint=result["sportsPoint"];
        let cardPublicMap=result.endPoint.publicCardList;
        let cardMap=result.endPoint.shouCardList
        let fanXingCard=this.GetFanXingCardID(result.endPoint.fanXingCard);
        let huCard=result.handCard;
        let layoutyou=PlayerNode.getChildByName("layoutyou");
        layoutyou.removeAllChildren();
        let demo_you=PlayerNode.getChildByName("demo_you");
        demo_you.x=0;demo_you.y=0;
        //显示分数Map
        PlayerNode.getChildByName("lb_hushuipai").getComponent(cc.Label).string="";
        PlayerNode.getChildByName("lb_fanxing").getComponent(cc.Label).string="";
        PlayerNode.getChildByName("lb_tun").getComponent(cc.Label).string="";
        PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string="";
        PlayerNode.getChildByName("lp_zongyou").getComponent(cc.Label).string=totalYouNum;
        for (let huType in huTypeMap) {
            if(huType=="FanXing"){
                PlayerNode.getChildByName("lb_fanxing").getComponent(cc.Label).string="翻醒:"+huTypeMap[huType];
            }else if(huType=="Tun"){
                PlayerNode.getChildByName("lb_tun").getComponent(cc.Label).string="囤:"+huTypeMap[huType];
            }else if(huType=="HuShuiPai"){
                PlayerNode.getChildByName("lb_hushuipai").getComponent(cc.Label).string="胡水牌:"+huTypeMap[huType];
            }else if(huType=="ZiMo"){
                if(isZiMoMulti==false){
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string="自摸:+"+huTypeMap[huType];
                }else{
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string="自摸:X"+huTypeMap[huType];
                }
            }else if(huType=="DianPao"){
                if(isDianPaoMulti==false){
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string="点炮:+"+huTypeMap[huType];
                }else{
                    PlayerNode.getChildByName("lb_hu").getComponent(cc.Label).string="点炮:X"+huTypeMap[huType];
                }
            }
        }
        //碰吃的牌
        for(let i=0;i<cardPublicMap.length;i++){
            let addYou=cc.instantiate(demo_you);
            layoutyou.addChild(addYou);
            let publicInfo = cardPublicMap[i];
            let publicInfoList=publicInfo["cardList"];
            let publicInfoValue=publicInfo["youNum"];
            let getCardID = publicInfoList[2];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            let opType = publicInfoList[0];
            if (opType == 104) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="喂";
            }else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="吃";
            }else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="碰";
            }else{
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="";
            }
            addYou.getChildByName("lb_you").getComponent(cc.Label).string=publicInfoValue;

            let layoutpai=addYou.getChildByName("layoutpai");

            for(let k=1;k<=4;k++){
                let cardChild=layoutpai.getChildByName("card"+k);
                if(typeof(cardIDList[k-1])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                cardChild.cardID=cardIDList[k-1];
                this.ShowOutCardImage(cardChild);
                
            }

            addYou.active=true;
        }
        //余下的牌
        for(let i=0;i<cardMap.length;i++){
            let addYou=cc.instantiate(demo_you);
            let publicInfo = cardMap[i];
            let publicInfoList=publicInfo["cardList"].slice(1,publicInfo["cardList"].length);
            let publicInfoValue=publicInfo["youNum"];
            let cardIDList = publicInfoList;
            addYou.getChildByName("lb_optype").getComponent(cc.Label).string="";
            addYou.getChildByName("lb_you").getComponent(cc.Label).string=publicInfoValue;
            let child=addYou.getChildByName("layoutpai");
            for(let j=1;j<=4;j++){
                let cardChild=child.getChildByName("card"+j);
                if(typeof(cardIDList[j-1])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                cardChild.cardID=cardIDList[j-1];
                this.ShowOutCardImage(cardChild);
                //如果是胡的牌。显示胡牌
                if(huCard>0 && huCard==cardIDList[j-1]){
                    cardChild.getChildByName("tip_hu").active=true;
                }else{
                    cardChild.getChildByName("tip_hu").active=false;
                }
            }
            addYou.active=true;
            layoutyou.addChild(addYou);
        }
        //翻醒的牌
        let layout_xingpai=PlayerNode.getChildByName("layout_xingpai");
        layout_xingpai.removeAllChildren();
        if(fanXingCard.length>0){
            let demo_pai=PlayerNode.getChildByName("demo_pai");
            demo_pai.x=0;demo_pai.y=0;
            PlayerNode.getChildByName("tip_fanxing").active=true;
            for(let i=0;i<5;i++){
                let cardChild=layout_xingpai.getChildByName("card"+i);
                if(typeof(fanXingCard[i])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                if(cardChild){
                    cardChild.active=true;
                    cardChild.cardID=fanXingCard[i];
                }else{
                    cardChild = cc.instantiate(demo_pai);
                    cardChild.active=true;
                    cardChild.name="card"+i;
                    cardChild.cardID=fanXingCard[i];
                    layout_xingpai.addChild(cardChild);
                }
                this.ShowOutCardImage(cardChild);
            }
        }else{
            PlayerNode.getChildByName("tip_fanxing").active=false;
        }
        //胡牌
        let hu_pai=PlayerNode.getChildByName("hu_pai");
        if(huCard>0){
            hu_pai.active=true;
            hu_pai.cardID=huCard;
            this.ShowOutCardImage(hu_pai);
        }else{
            hu_pai.active=false;
        }
        //显示总分
        let lb_winpoint=PlayerNode.getChildByName("lb_winpoint");
        let lb_lostpoint=PlayerNode.getChildByName("lb_lostpoint");
        if(point>0){
            lb_winpoint.active=true;
            lb_lostpoint.active=false;
            lb_winpoint.getComponent(cc.Label).string="+"+point;
        }else{
            lb_winpoint.active=false;
            lb_lostpoint.active=true;
            lb_lostpoint.getComponent(cc.Label).string=point;
        }
        //比赛分
        let lb_sportsPoint=PlayerNode.getChildByName("lb_sportsPoint");
        if(typeof(sportsPoint)!="undefined"){
            lb_sportsPoint.active=true;
            lb_sportsPoint.getComponent(cc.Label).string="比赛分:"+sportsPoint;
        }else{
            lb_sportsPoint.active=false;
        }
    },
    ShowOutCardImage:function(childNode){
        childNode.active=true;
            let imageName = ["zi_fangda_", Math.floor(childNode.cardID/100)].join("");
            if(childNode.cardID==0){
                imageName = ["zi_fangda_bg"].join("");
            }
            let imageInfo = this.IntegrateImagePath[imageName];
            if(!imageInfo){
                this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
                return
            }
            let imagePath = imageInfo["FilePath"];
            let that = this;
             childNode.getChildByName("hua").getComponent(cc.Sprite).spriteFrame="";
            let childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
            this.SpriteShow(childSprite,imagePath);
       
    },
    SpriteShow:function(childSprite,imagePath){
        let that = this;
        app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function(spriteFrame){
                        if(!spriteFrame){
                            that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                            return
                        }
                        childSprite.spriteFrame = spriteFrame;
            }).catch(function(error){
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            }
        );
    },
    GetFanXingCardID:function(map){
        let xingCardList=[];
        for(let key in map){
            xingCardList.push(parseInt(key));
        }
        return xingCardList;
    },
});
