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
                  "shuzi_fangxiao_10": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_14",
                  },
                  "shuzi_fangxiao_11": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_2",
                  },
                  "shuzi_fangxiao_12": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_3",
                  },
                  "shuzi_fangxiao_13": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_4",
                  },
                  "shuzi_fangxiao_14": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_5",
                  },
                  "shuzi_fangxiao_15": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_6",
                  },
                  "shuzi_fangxiao_16": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_7",
                  },
                  "shuzi_fangxiao_17": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_8",
                  },
                  "shuzi_fangxiao_18": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_9",
                  },
                  "shuzi_fangxiao_19": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/red_10",
                  },
                  "shuzi_fangxiao_20": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_14",
                  },
                  "shuzi_fangxiao_21": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_2",
                  },
                  "shuzi_fangxiao_22": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_3",
                  },
                  "shuzi_fangxiao_23": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_4",
                  },
                  "shuzi_fangxiao_24": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_5",
                  },
                  "shuzi_fangxiao_25": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_6",
                  },
                  "shuzi_fangxiao_26": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_7",
                  },
                  "shuzi_fangxiao_27": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_8",
                  },
                  "shuzi_fangxiao_28": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_9",
                  },
                  "shuzi_fangxiao_29": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/black_10",
                  },
                  "shuzi_fangxiao_bg": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/bg_poker",
                  },
                  "shuzi_fangxiao_spade": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/bg_spade1",
                  },
                  "shuzi_fangxiao_diamond": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/bg_diamond1",
                  },
                  "shuzi_fangxiao_club": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/bg_club1",
                  },
                  "shuzi_fangxiao_heart": {
                    "FilePath": "ui/uiGame/xpphz/zi/card_small/bg_heart1",
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
        let huType=result.huType;
        if(huType!=0){
            //显示胡牌分数
            let layout_huinfo=PlayerNode.getChildByName("layout_huinfo");
            let demo_huinfo=this.node.getChildByName("demo_huinfo");
            let huTypeMap=result.endPoint.huTypeMap;
            let huTypeDict = {
                ZiMo: "自摸",
                ChongFen: "冲分",
                PaoHu: "跑胡",
                PingHu: "平胡",
            };
            layout_huinfo.removeAllChildren();
            for (let huType in huTypeMap) {
                let huPoint = huTypeMap[huType];
                let lb_huInfo=cc.instantiate(demo_huinfo);
                lb_huInfo.getComponent(cc.Label).string=huTypeDict[huType]+"：" + huPoint;
                lb_huInfo.active=true;
                layout_huinfo.addChild(lb_huInfo);
            }
        }else{
            PlayerNode.getChildByName("layout_huinfo").removeAllChildren();
        }
        let point=result.point;
        let sportsPoint=result["sportsPoint"];
        let cardPublicMap=result.endPoint.publicCardList;
        let cardMap=result.endPoint.shouCardList;
        let huCard=result.handCard;
        let layoutyou=PlayerNode.getChildByName("layoutyou");
        layoutyou.removeAllChildren();
        let demo_you=this.node.getChildByName("demo_you");
        demo_you.x=0;demo_you.y=0;
        //碰吃的牌
        for(let i=0;i<cardPublicMap.length;i++){
            let addYou=cc.instantiate(demo_you);
            layoutyou.addChild(addYou);
            let publicInfo = cardPublicMap[i];
            let publicInfoList=publicInfo["cardList"];
            let publicInfoValue=publicInfo["youNum"];

            let getCardID = publicInfoList[2];
            let cardIDList = publicInfoList.slice(1, publicInfoList.length);

            let opType = publicInfoList[0];
            if (opType == 0) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="提";
            }else if (opType ==1) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="跑";
            }else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="偎";
            }else if (opType == 3) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="连";
            }else if (opType == 4) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="坎";
            }else if (opType == 5) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="碰";
            }else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="对";
            }else if (opType == 7) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="绞";
            }else if (opType == 8) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="手";
            }else{
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="";
            }
            addYou.getChildByName("layoutpai").getChildByName("lb_you").getComponent(cc.Label).string=publicInfoValue;

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
                /*if(opType==this.ShareDefine.OpType_Chi && cardChild.cardID==getCardID){
                    cardChild.color=cc.color(180,180,180);
                }else{
                    cardChild.color=cc.color(255,255,255);
                }*/
                this.ShowOutCardImage(cardChild);
            }

            addYou.active=true;
        }
        //余下的牌
        for(let i=0;i<cardMap.length;i++){
            let addYou=cc.instantiate(demo_you);
            let publicInfo = cardMap[i];
            let opType = publicInfo["cardList"][0];
            let publicInfoList=publicInfo["cardList"].slice(1,publicInfo["cardList"].length);
            let publicInfoValue=publicInfo["youNum"];
            let cardIDList = publicInfoList;
            if (opType == 0) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="提";
            }else if (opType ==1) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="跑";
            }else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="偎";
            }else if (opType == 3) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="连";
            }else if (opType == 4) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="坎";
            }else if (opType == 5) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="碰";
            }else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="对";
            }else if (opType == 7) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="绞";
            }else if (opType == 8) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="手";
            }else{
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="";
            }
            addYou.getChildByName("layoutpai").getChildByName("lb_you").getComponent(cc.Label).string=publicInfoValue;
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
            let imageName = ["shuzi_fangxiao_", Math.floor(childNode.cardID/100)].join("");
            if(childNode.cardID==0){
                imageName = ["shuzi_fangxiao_bg"].join("");
            }
            let imageInfo = this.IntegrateImagePath[imageName];
            if(!imageInfo){
                this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
                return
            }
            let imagePath = imageInfo["FilePath"];
            let childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
            this.SpriteShow(childSprite,imagePath);
            let huaseSprite = childNode.getChildByName("hua").getComponent(cc.Sprite);
            let huaImageName="";
            if(childNode.cardID<2000){
                if (childNode.cardID%100 <= 2) {
                    huaImageName="shuzi_fangxiao_diamond";
                }else{
                    huaImageName="shuzi_fangxiao_heart";
                }
            }else if(childNode.cardID>=2000){
                if (childNode.cardID%100 <= 2) {
                    huaImageName="shuzi_fangxiao_club";
                }else{
                    huaImageName="shuzi_fangxiao_spade";
                }
            }
            let huaImageInfo = this.IntegrateImagePath[huaImageName];
            if(!huaImageInfo){
                this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", huaImageName);
                return
            }
            let huaImagePath = huaImageInfo["FilePath"];
            this.SpriteShow(huaseSprite,huaImagePath);
       
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
});
