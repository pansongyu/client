var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        paixing:[cc.SpriteFrame],
        erweima:cc.Node,
        //[0]  六金倒
        //[1]  三游
        //[2]  四金倒
        //[3]  四游
        //[4]  三金倒
        //[5]  双游
        //[6]  天胡
        //[7]  五金倒
        //[8]  游金
    },

    OnCreateInit: function () {
        this.SDKManager = app[app.subGameName+"_SDKManager"]();
        this.NetManager=app[app.subGameName+"_NetManager"]();
        this.FormManager = app[app.subGameName+"_FormManager"]();
        //添加手牌
        let ShowCardNode=this.GetWndNode('paixing/showcard');
        let sp_in=ShowCardNode.getChildByName('sp_in');
        for(let i=1;i<=16;i++){
            let cardNode = cc.instantiate(sp_in);
            cardNode.name=this.ComTool.StringAddNumSuffix("card",Math.abs(i-(16+1)),2);
            ShowCardNode.addChild(cardNode);
        }

        //添加吃牌
        let DownCardNode=this.GetWndNode('paixing/downcard');
        let downNode01=DownCardNode.getChildByName('down01');
        for(let i=2;i<=5;i++){
            let downNode = cc.instantiate(downNode01);
            downNode.name=this.ComTool.StringAddNumSuffix("down",i,2);
            DownCardNode.addChild(downNode);
        }
    },

    OnShow: function (HuList,jin1,jin2) {
        this.HuList=HuList;
        this.jin1=jin1;
        this.jin2=jin2;
        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();

        this.ShowPlayerDownCard(this.node.getChildByName('paixing').getChildByName('downcard'),HuList.publicCardList);
        this.ShowPlayerShowCard(this.node.getChildByName('paixing').getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
        //显示头像
        this.ShowHero_NameOrID();
        //显示胡类型+分数
        this.ShowHuTypePoint(HuList.huType,HuList.point);
        this.huType=HuList.huType;
        this.ShowHuImg(this.huType);
        let that=this;

        let heroID = app[app.subGameName+"_HeroManager"]().GetHeroProperty("pid"); 
        let shareUrl="http://yangzhong.qp355.com:88/"+this.ComTool.GetPid(heroID)+"/";
        let imgUrl = "https://www.qp355.com:4433/makeQRcode.php?url=" + shareUrl;
        cc.loader.load({url:imgUrl,type: 'png'},function (err, texture) {
                if(texture instanceof cc.Texture2D){
                    var frame = new cc.SpriteFrame(texture);
                    that.erweima.getComponent(cc.Sprite).spriteFrame=frame;
                }
                else{
                    that.ErrLog("texture not Texture2D");
                }
        });

        this.scheduleOnce(this.ShareScreen,1);
    },
    ShareScreen:function(){
        this.SDKManager.ShareScreen('1');
        this.scheduleOnce(this.CloseForm,3.5);
    },
    ShowHuImg:function(huType){
        let huTypeImg=this.node.getChildByName('bg').getChildByName('paixing').getComponent(cc.Sprite);
        if(huType == this.ShareDefine.HuType_LiuJinDao){
           huTypeImg.spriteFrame=this.paixing[0];
        }else if(huType == this.ShareDefine.HuType_SanYou){
           huTypeImg.spriteFrame=this.paixing[1];
        }else if(huType == this.ShareDefine.HuType_SiJinDao){
           huTypeImg.spriteFrame=this.paixing[2];
        }else if(huType == this.ShareDefine.HuType_SanJinDao){
           huTypeImg.spriteFrame=this.paixing[4];
        }else if(huType == this.ShareDefine.HuType_ShuangYou){
           huTypeImg.spriteFrame=this.paixing[5];
        }else if(huType == this.ShareDefine.HuType_TianHu){
           huTypeImg.spriteFrame=this.paixing[6];
        }else if(huType == this.ShareDefine.HuType_WuJinDao){
           huTypeImg.spriteFrame=this.paixing[7];
        }else if(huType == this.ShareDefine.HuType_DanYou){
           huTypeImg.spriteFrame=this.paixing[8];
        }else if(huType == this.ShareDefine.HuType_DanDiao){
           huTypeImg.spriteFrame=this.paixing[9];
        }
        else if(huType == this.ShareDefine.HuType_DianPao){
           huTypeImg.spriteFrame=this.paixing[10];
        }
        else if(huType == this.ShareDefine.HuType_LiuJinDao){
           huTypeImg.spriteFrame=this.paixing[11];
        }
        else if(huType == this.ShareDefine.HuType_PingHu){
           huTypeImg.spriteFrame=this.paixing[12];
        }
        else if(huType == this.ShareDefine.HuType_QGH){
           huTypeImg.spriteFrame=this.paixing[13];
        }
        else if(huType == this.ShareDefine.HuType_QiangJin){
           huTypeImg.spriteFrame=this.paixing[14];
        }
        else if(huType == this.ShareDefine.HuType_SanJinYou){
           huTypeImg.spriteFrame=this.paixing[15];
        }
        else if(huType == this.ShareDefine.HuType_ShiSanYao){
           huTypeImg.spriteFrame=this.paixing[16];
        }
        else if(huType == this.ShareDefine.HuType_WuJinDao){
           huTypeImg.spriteFrame=this.paixing[17];
        }
        else if(huType == this.ShareDefine.HuType_ZiMo){
           huTypeImg.spriteFrame=this.paixing[18];
        }
    },
    ShowHuTypePoint:function(huType,point){
        this.node.getChildByName('userinfo').getChildByName('huname').getComponent(cc.Label).string=this.HuName(huType)+'    +'+point;
    },
    HuName:function(huType){
        if(huType == this.ShareDefine.HuType_ZiMo){
           return "自摸";
        }else if(huType == this.ShareDefine.HuType_PingHu){
           return "平胡";
        }else if(huType == this.ShareDefine.HuType_QGH){
           return "抢杠胡";
        }else if(huType == this.ShareDefine.HuType_FHZ){
           return "四红中";
        }else if(huType == this.ShareDefine.HuType_SanJinDao){
           return "三金倒";
        }else if(huType == this.ShareDefine.HuType_DanYou){
           return "单游";
        }else if(huType == this.ShareDefine.HuType_ShuangYou){
           return "双游";
        }else if(huType == this.ShareDefine.HuType_SanYou){
           return "三游";
        }else if(huType == this.ShareDefine.HuType_QiangJin){
           return "抢金";
        }else if(huType == this.ShareDefine.HuType_TianHu){
           return "天胡";
        }else if(huType == this.ShareDefine.HuType_SiJinDao){
           return "四金倒";
        }else if(huType == this.ShareDefine.HuType_WuJinDao){
           return "五金倒";
        }else if(huType == this.ShareDefine.HuType_LiuJinDao){
           return "六金倒";
        }else if(huType == this.ShareDefine.HuType_ShiSanYao){
           return "十三幺";
        }else if(huType == this.ShareDefine.HuType_JinQue){
           return "金雀";
        }else if(huType == this.ShareDefine.HuType_JinLong){
           return "金龙";
        }else if(huType == this.ShareDefine.HuType_YiZhangHua){
           return "一张花";
        }else if(huType == this.ShareDefine.HuType_WHuaWGang){
           return "无花无杠";
        }else if(huType == this.ShareDefine.HuType_HunYiSe){
           return "混一色";
        }else if(huType == this.ShareDefine.HuType_QingYiSe){
           return "清一色";
        }else if(huType == this.ShareDefine.HuType_DiHu){
           return "地胡";
        }else if(huType == this.ShareDefine.HuType_XiaoZhaDan){
           return "小炸弹";
        }else if(huType == this.ShareDefine.HuType_DaZhaDan){
           return "大炸弹";
        }else if(huType == this.ShareDefine.HuType_ChaoJiZhaDan){
           return "超级炸弹";
        }else if(huType == this.ShareDefine.HuType_SanJinYou){
           return "三金游";
        }else if(huType == this.ShareDefine.HuType_DaSanYuan){
           return "大三元";
        }else if(huType == this.ShareDefine.HuType_DaDuiPeng){
           return "大对碰";
        }else if(huType == this.ShareDefine.HuType_DDHu){
           return "对对胡";
        }else if(huType == this.ShareDefine.HuType_DianPao){
           return "点炮";
        }else if(huType == this.ShareDefine.HuType_DanDiao){
           return "单吊";
        }else if(huType == this.ShareDefine.HuType_PiHu){
           return "屁胡";
        }else if(huType == this.ShareDefine.HuType_MenZi){
           return "门子";
        }else if(huType == this.ShareDefine.HuType_JieDao){
           return "接刀";
        }
        else {
            return "";
        }  
    },
    ShowHero_NameOrID:function () {
        this.WeChatHeadImage = this.node.getChildByName('userinfo').getChildByName('head_img').getComponent("WeChatHeadImage");
        let heroName = app[app.subGameName+"_HeroManager"]().GetHeroProperty("name");
        this.node.getChildByName('userinfo').getChildByName('name').getComponent(cc.Label).string = heroName;
        let heroID = app[app.subGameName+"_HeroManager"]().GetHeroProperty("pid");
        this.WeChatHeadImage.ShowHeroHead(heroID);
    },
    ShowPlayerShowCard:function(ShowNode,cardIDList,handCard,jin1,jin2){
        ShowNode.active = 1;
        let UICard_ShowCard =ShowNode.getComponent(app.subGameName+"_UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCard(cardIDList,handCard,jin1,jin2);
    },
    ShowPlayerDownCard:function(ShowNode,publishcard){
        ShowNode.active = 1;
        let UICard_DownCard =ShowNode.getComponent(app.subGameName+"_UIMJCard_Down");
        UICard_DownCard.ShowDownCard(publishcard);
    },
    //---------设置接口---------------

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName=="btn_share"){
            this.FormManager.ShowForm('game/base/ui/majiang/'+app.subGameName+'_UIMJSharePaiXingMax',this.HuList,this.jin1,this.jin2);
        }else if(btnName=="btn_close"){
            this.CloseForm();
        }
        else{
            this.ErrLog("OnClick not find btnName",btnName);
        }
    },
});
