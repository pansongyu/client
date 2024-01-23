var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {},
    OnCreateInit: function () {
        this.closeformPath = "";
	    this.node_head = this.GetWndNode("img_syright_up/bgcreate/userinfo/btn_head");
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
        this.WeChatHeadImage1 = this.node_head.getComponent(app.subGameName + "_WeChatHeadImage");
    },
    OnShow: function (formPath, isShowFangka = false, isShowQuanka = false, isShowLedou = false) {
	    let path = "img_syright_up/bgcreate/userinfo/";
	    this.lb_heroName = this.GetWndNode(path + "label_name").getComponent(cc.Label);
	    this.lb_heroID = this.GetWndNode(path + "label_id").getComponent(cc.Label);
	    this.rightTop = this.GetWndNode("img_syright_up/bgcreate/rightTop");
        this.closeformPath = formPath;
        if (isShowFangka) {
            this.rightTop.getChildByName('fangka').active = true;
        }else{
            this.rightTop.getChildByName('fangka').active = false;
        }
        if (isShowQuanka) {
            this.rightTop.getChildByName('quanka').active = true;
        }else{
            this.rightTop.getChildByName('quanka').active = false;
        }
        if (isShowLedou) {
            this.rightTop.getChildByName('ledou').active = true;
        }else{
            this.rightTop.getChildByName('ledou').active = false;
        }
        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowClubCard();
        this.ShowHero_NameOrID();
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
        }
    },
    ShowFastCount:function () {
        let gold = app[app.subGameName + "_HeroManager"]().GetHeroProperty('gold');
        this.rightTop.getChildByName('ledou').getChildByName('label').getComponent(cc.Label).string=gold;
    },
    ShowRoomCard:function () {
        let heroRoomCard = app[app.subGameName + "_HeroManager"]().GetHeroProperty("roomCard");
        this.rightTop.getChildByName('fangka').getChildByName('label').getComponent(cc.Label).string=heroRoomCard;
    },
    ShowClubCard:function () {
        let heroClubCard = app[app.subGameName + "_HeroManager"]().GetHeroProperty("clubCard");
        this.rightTop.getChildByName('quanka').getChildByName('label').getComponent(cc.Label).string=heroClubCard;
    },

    ShowHero_NameOrID:function () {
        let heroName = app[app.subGameName + "_HeroManager"]().GetHeroProperty("name");
        this.lb_heroName.string = heroName;
        let width = this.lb_heroName.node.width;
        if(heroName.length > 9 && width > 200)
            this.lb_heroName.string = this.lb_heroName.string.substring(0,9);
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        this.lb_heroID.string = app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        this.WeChatHeadImage1.ShowHeroHead(heroID);

    },
    OnClick:function(btnName, btnNode){
        if('btn_close' == btnName){
            if(this.closeformPath != ""){
                if (this.closeformPath == app.subGameName + "_UIMain") {
                    if (!cc.sys.isNative) return;
                    //如果是游戏切换需要释放内存，重新加载
                    app[app.subGameName + "Client"].RemoveClientManager();
                    app[app.subGameName + "_NetManager"]().SendPack("base.C1110UUID", {"gameName":"hall"}, function(event){
                        app.LocalDataManager().SetConfigProperty("Account", "uuid", event);
                        //停止场景音乐
                        app[app.subGameName + "_SceneManager"]().StopSceneMusic();
                        let gamePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/sss";
                        window.require(gamePath + "/src/dating.js");
                    }, function(error){
                        console.log("获取uuid失败");
                    });
                } else {
                    app[app.subGameName + "_FormManager"]().CloseForm(this.closeformPath);
                    this.CloseForm();
                    app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMain");
                }
            }
        }else if('btn_head' == btnName){
            // this.FormManager.ShowForm("UIUserInfo");
        }else if('btn_addGold' == btnName){
            // this.FormManager.ShowForm("UIStore",'btn_table0');
        }else if('btn_addRoomCard' == btnName){
            // this.FormManager.ShowForm("UIStore",'btn_table1');
        }else if('btn_addQuanCard' == btnName){
            // this.FormManager.ShowForm('ui/club/UIClubStore');
        }
        
    }
});
