var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
        layout:cc.Node,
        demo:cc.Node,
        renshu:cc.Label,
        chongzhi:cc.Label,
    },
    OnCreateInit:function(){
        this.ComTool=app.ComTool();
    },
    OnShow: function () {
        app.FormManager().ShowForm('UITop', "UITaskYaoQing");
        this.demo.active=false;
        this.pageNum=1;
        this.maxPage=1;
        this.ShowPagePlayer();
    },
    ShowPagePlayer:function(){
        let that=this;
        app.NetManager().SendPack('game.CPlayerReceiveList',{'pageNum':this.pageNum},function(serverPack){
            //that.layout.removeAllChildren();
            that.DestroyAllChildren(that.layout);
            that.InitPlayer(serverPack);
        },function(serverPack){
            that.ShowSysMsg("推广数据获取失败，请稍后重试");
        });
    },
    InitPlayer:function(serverPack){
        let refererReceiveItems=serverPack.refererReceiveItems;
        let totalPrice=serverPack.totalPrice;
        let totalNumber=serverPack.totalNumber;
        this.renshu.string=totalNumber;
        this.maxPage=Math.ceil(totalNumber/10);
        if(this.maxPage==0){
            this.maxPage=1;
        }
        this.chongzhi.string=totalPrice;
        //显示玩家
        for(let i=0;i<refererReceiveItems.length;i++){
            let nodePrefab = cc.instantiate(this.demo);
            nodePrefab.getChildByName('name').getComponent(cc.Label).string=refererReceiveItems[i].name.substr(0,7);
            nodePrefab.getChildByName('date').getComponent(cc.Label).string=this.ComTool.GetDateYearMonthDayHourMinuteString(refererReceiveItems[i].inviteTime);;
            if(refererReceiveItems[i].state==0){
                nodePrefab.getChildByName('state').getComponent(cc.Label).string='局数不够';
            }else{
                nodePrefab.getChildByName('state').color=new cc.Color(0, 134, 13);
                nodePrefab.getChildByName('state').getComponent(cc.Label).string='邀请成功';
            }
            nodePrefab.getChildByName('num').getComponent(cc.Label).string=refererReceiveItems[i].price;
            nodePrefab.active=true;
            this.layout.addChild(nodePrefab);
        }
        
    },
    OnClick:function(btnName, btnNode){
        if('btn_yaoqing'==btnName){
            // this.FormManager.ShowForm('UIShare');
            //直接链接分享
            let title = app.Client.GetClientConfigProperty("WeChatShareTitle");
            let desc = app.Client.GetClientConfigProperty("WeChatShareDesc");
            let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");
            let heroID = app.HeroManager().GetHeroProperty("pid");
            let cityId=app.HeroManager().GetHeroProperty("cityId");
            weChatAppShareUrl = weChatAppShareUrl+heroID+"&cityid="+cityId;
            console.log("Click_btn_weixin:",title);
            console.log("Click_btn_weixin:",desc);
            console.log("Click_btn_weixin:",weChatAppShareUrl);
            this.ShareType=0;
            this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
        }
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
    }
});
