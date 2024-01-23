/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        clublist_scrollView:cc.ScrollView,
        clublist_layout:cc.Node,
        rightTop:cc.Node,
        lb_heroName:cc.Label,
        lb_heroID:cc.Label,
        node_head:cc.Node,
        clublist_demo:[cc.Node],
    },

    //初始化
    OnCreateInit:function(){
        this.RegEvent("HeroProperty", this.Event_HeroProperty, this);
        this.WeChatManager=app.WeChatManager();
        this.WeChatHeadImage1 = this.node_head.getComponent("WeChatHeadImage");
        this.CityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.ShareDefine = app.ShareDefine();
    },

    //---------显示函数--------------------

    OnShow:function(clublist){
        this.scrollView=this.node.getChildByName("mark").getComponent(cc.ScrollView);
        this.scrollView.scrollToLeft(0);
        //this.clublist_demo.active = false;
        if (clublist == null || typeof(clublist) == "undefined") {
            let self=this;
            app.NetManager().SendPack('club.CGetClubList',{},function(serverPack){
                self.ShowClubList(serverPack);
            },function(error){

            });
        }else{
            this.ShowClubList(clublist);
        }
        this.ShowHero_NameOrID();
        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowClubCard();


    },
    GetCityGameList:function(cityId){
        let cityGame = this.CityConfig[cityId].Game;
        let cityGameList = cityGame.split(",");
        let nameList=[];
        for(let i=0;i<cityGameList.length;i++){
            if(i>0){
                break;
            }
            nameList.push(this.GameId2Name(cityGameList[i]));
        }
        return nameList.join(',')+"...";

    },
    GameId2Name:function(gameId){
        return this.ShareDefine.GametTypeID2Name[gameId];
    },
    Event_HeroProperty:function (event) {
        let argDict = event;
        if(argDict["Property"] == "gold"){
            this.ShowFastCount();
        }
        else if(argDict["Property"] == "roomCard"){
            this.ShowRoomCard();
        }else if(argDict["Property"] == "clubCard"){
            this.ShowClubCard();
        }else if(argDict["Property"] == "name"){
            this.lb_heroName.string =argDict["name"].substr(0.9);
        }else if(argDict["Property"]=="headimg"){
            let heroID = app.HeroManager().GetHeroProperty("pid");
            let headImageUrl = app.HeroManager().GetHeroProperty("headImageUrl");
            this.WeChatHeadImage1.ShowHeroHead(heroID,headImageUrl);
        }
    },
    ShowClubList:function(serverPack){
        //this.clublist_layout.removeAllChildren();
        let heroID = app.HeroManager().GetHeroProperty("pid");
        this.DestroyAllChildren(this.clublist_layout);
        for(let i=0;i<serverPack.length;i++){
            let demo_key=i%3;
            let node=cc.instantiate(this.clublist_demo[demo_key]);

            let player=serverPack[i].player;
            this.clublist_layout.addChild(node);
            node.active=true;
            node.name="btn_club";
            node.clubId = serverPack[i].id;
            node.cLubSign = serverPack[i].clubsign;
            node.clubName = serverPack[i].name;

            node.showUplevelId = serverPack[i].showUplevelId;
            node.showClubSign = serverPack[i].showClubSign;
            

            node.getChildByName("clubName").getComponent(cc.Label).string = serverPack[i].name;
            node.getChildByName("clubId").getComponent(cc.Label).string = "(亲友圈ID:"+serverPack[i].clubsign+")";
            //node.getChildByName("tableNum").getComponent(cc.Label).string = "在玩桌数:"+serverPack[i].playingRoomCount;
            node.getChildByName("tableNum").getComponent(cc.Label).string = "在玩桌数:*";
            node.getChildByName("quankaNum").getComponent(cc.Label).string = serverPack[i].playerClubCard;
            node.getChildByName("peopleNum").getComponent(cc.Label).string = "成员数:*";
            //node.getChildByName("peopleNum").getComponent(cc.Label).string = "成员数:"+serverPack[i].peopleNum;
            node.getChildByName("lb_gamelist").getComponent(cc.Label).string = "游戏:"+this.GetCityGameList(serverPack[i].cityId);
            let headNode=node.getChildByName("head");
            let WeChatHeadImage=headNode.getComponent("WeChatHeadImage");
            this.WeChatManager.InitHeroHeadImage(player.pid, player.iconUrl);
            this.WeChatHeadImage1.ShowHeroHead(player.pid,player.iconUrl);
            headNode.getChildByName("img_wd").active=player.pid==heroID;
        }
        this.clublist_layout.getComponent(cc.Layout).updateLayout();
        this.ScrollMaxWidth=0-this.clublist_layout.width;
    },

    ShowFastCount:function () {
        let gold = app.HeroManager().GetHeroProperty('gold');
        this.rightTop.getChildByName('ledou').getChildByName('label').getComponent(cc.Label).string=gold;
    },
    ShowRoomCard:function () {
        let heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.rightTop.getChildByName('fangka').getChildByName('label').getComponent(cc.Label).string=heroRoomCard;
    },
    ShowClubCard:function () {
        let heroClubCard = app.HeroManager().GetHeroProperty("clubCard");
        this.rightTop.getChildByName('quanka').getChildByName('label').getComponent(cc.Label).string=heroClubCard;
    },
    ShowHero_NameOrID:function () {
        let i = 0;
        let isGetHeroData = false;
        while(i < 30 || !isGetHeroData){
            let heroName = app.HeroManager().GetHeroProperty("name");
            if (typeof(heroName) == "string") {
                let heroID = app.HeroManager().GetHeroProperty("pid");
                let headImageUrl = app.HeroManager().GetHeroProperty("headImageUrl");
                this.lb_heroName.string =  this.ComTool.GetBeiZhuName(heroID,heroName,9);
                this.lb_heroID.string = app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
                this.WeChatHeadImage1.ShowHeroHead(heroID,headImageUrl);
                isGetHeroData = true;
                break;
            }else{
                i++;
            }
        }
        //如果还是没取到玩家信息，重新登录
        if (!isGetHeroData) {
            this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", {});
            console.log("玩家信息获取失败，切换账号");
            app.Client.LogOutGame(1);
        }
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_enter'==btnName){
            //this.CloseForm();
            app.ClubManager().SetLastClubData(btnNode.parent.clubId, btnNode.parent.cLubSign, btnNode.parent.clubName,btnNode.parent.showUplevelId,btnNode.parent.showClubSign);
            // app.FormManager().ShowForm("ui/club/UIClubMain");
            app.ClubManager().ShowClubFrom();
        }else if('btn_club'==btnName){
            //this.CloseForm();
            app.ClubManager().SetLastClubData(btnNode.clubId, btnNode.cLubSign, btnNode.clubName, btnNode.showUplevelId, btnNode.showClubSign);
            // app.FormManager().ShowForm("ui/club/UIClubMain");
            app.ClubManager().ShowClubFrom();
        }

        else if('btn_up'==btnName){
            let self = this;
            app.NetManager().SendPack('club.CClubTop',{"clubId":btnNode.parent.clubId},function(serverPack){
                app.ClubManager().SetClubData(serverPack);
                self.ShowClubList(serverPack);
            },function(error){

            });
        }else if('btn_joinClub'==btnName){
            app.FormManager().ShowForm('ui/club/UIJoinClub');
        }else if('btn_createClub'==btnName){
            this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
            let heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
            let limit = app.Config ? app.Config.clubCreateNum : 100
            if(heroRoomCard>=limit){
                app.FormManager().ShowForm('ui/club/UIClubCreate',this.allSelectCityData[0].selcetId);
            }else{
                app.SysNotifyManager().ShowSysMsg('钻石不足' + limit + '，无法创建亲友圈');
            }


            /*app.NetManager().SendPack("family.CPlayerCheckFamilyOwner",{},function(success){
                app.FormManager().ShowForm('ui/club/UIClubCreate', success);
            },function(error){
                app.SysNotifyManager().ShowSysMsg('不是代理或工会不存在，请联系客服');
            });*/
        }
        else if('btn_addGold' == btnName){
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.ShowForm("UIStore",'btn_table0');
        }
        else if('btn_addRoomCard' == btnName){
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIBangDingTuiGuang");
            this.FormManager.ShowForm("UIStore",'btn_table1');
        } 
        else if('btn_head' == btnName){
            this.FormManager.ShowForm("UIUserInfo");
        }else if('btn_back'==btnName){
            this.CloseForm();
        }else if("btn_you"==btnName){
            var pos = this.scrollView.getScrollOffset();
            pos.x=pos.x-300;
            this.scrollView.scrollToOffset(pos);

        }else if("btn_zuo"==btnName){
            var pos2 = this.scrollView.getScrollOffset();
            pos2.x=pos2.x+300;
            this.scrollView.scrollToOffset(pos2);
        }
        else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
