var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        paixing:[cc.SpriteFrame],
        //[0]  六金倒
        //[1]  三游
        //[2]  四金倒
        //[3]  四游
        //[4]  三金倒
        //[5]  双游
        //[6]  天胡
        //[7]  五金倒
        //[8]  游金


        //[9]  单吊
        //[10]  点炮
        //[11]  六金
        //[12]  平胡
        //[13]  抢杠胡
        //[14]  抢金
        //[15]  三金游
        //[16]  十三幺
        //[17]  五金
        //[18]  自摸
    },

    OnCreateInit: function () {
        this.FormManager = app[app.subGameName+"_FormManager"]();
        this.NetManager=app[app.subGameName+"_NetManager"]();
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
        
        //this.RegEvent("ShareSuccess", this.Event_ShareSuccess, this);
        
        this.ShowPlayerDownCard(this.node.getChildByName('paixing').getChildByName('downcard'),HuList.publicCardList);
        this.ShowPlayerShowCard(this.node.getChildByName('paixing').getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
        //显示头像
        this.ShowHero_NameOrID();
        //显示胡类型+分数
        this.ShowHuTypePoint(HuList.huType,HuList.point);
        this.huType=HuList.huType;
        this.ShowHuImg(this.huType);
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
        }

        else if(huType == this.ShareDefine.HuType_DanDiao){
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
    Event_ShareSuccess:function(event){
        this.SysLog("UIMJSharePaiXingMini Event_ShareSuccess");
        let roomID = this.RoomMgr.GetEnterRoomID();
        let roomSet = this.RoomMgr.GetEnterRoom().GetRoomSet();
        if(!roomSet){
            this.ErrLog("Event_ShareSuccess not find roomSet");
            return
        }
        let setID = roomSet.GetRoomSetProperty("setID");
        let that=this;
        this.NetManager.SendPack("share.CPlayerHuRewardShare",{roomId:roomID,setId:setID,huType:this.huType},function(success){
            that.SysLog("UIMJSharePaiXingMini Event_ShareSuccess :success");
            let rewardInfos=success.rewardInfos;
            that.SysLog("UIMJSharePaiXingMini Event_ShareSuccess rewardInfos length:"+rewardInfos.length);
            let msg='';
            for(let i=0;i<rewardInfos.length;i++){
              let prizeType=rewardInfos[i].prizeType;
              let count=rewardInfos[i].count;
              if(prizeType==6){
                  //房卡
                  if(msg){
                    msg=msg+",房卡"+count;
                  }else{
                    msg="房卡"+count;
                  }

              }else if(prizeType==1){
                  //乐斗
                  if(msg){
                    msg=msg+",乐豆"+count;
                  }else{
                    msg="乐豆"+count;
                  }
              }else if(prizeType==2){
                  //兑换券
                  if(msg){
                    msg=msg+",兑换券"+count;
                  }else{
                    msg="兑换券"+count;
                  }
              }
            }
            if(msg!=""){
              app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg("分享成功,获取"+msg);
            }else{
              app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg("分享成功,暂无奖励");
            }
            that.CloseForm();
        },function(error){
            that.SysLog("UIMJSharePaiXingMini Event_ShareSuccess :error");
            app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg("您今日已经领取奖励");
            that.CloseForm();
        });
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
            if(!cc.sys.isNative){
               this.FormManager.ShowForm('game/base/ui/majiang/'+app.subGameName+'_UIMJSharePaiXingMax',this.HuList,this.jin1,this.jin2);
               this.Event_ShareSuccess();
            }else{
               this.FormManager.ShowForm('game/base/ui/majiang/'+app.subGameName+'_UIMJSharePaiXingMax',this.HuList,this.jin1,this.jin2);
            }
            
        }else if(btnName=="btn_close"){
            this.CloseForm();
        }
        else{
            this.ErrLog("OnClick not find btnName",btnName);
        }
    },
});
