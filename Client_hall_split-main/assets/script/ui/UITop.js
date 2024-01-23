var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_heroName:cc.Label,
        lb_heroID:cc.Label,
        node_head:cc.Node,
        rightTop:cc.Node,
    },
    OnCreateInit: function () {
        this.closeformArr = [];
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
        this.WeChatHeadImage1 = this.node_head.getComponent("WeChatHeadImage");
    },
    OnShow: function (formPath, isShowQuanKa = false) {
        isShowQuanKa = false;//暂时全部隐藏圈卡
        if(this.closeformArr.length == 0){
            this.closeformArr.push(formPath);
        }
        else{
            if(this.closeformArr.indexOf(formPath) == -1){
                this.closeformArr.push(formPath);
            }
           
        }
        if (isShowQuanKa) {
            this.rightTop.getChildByName("ledou").active = false;
            this.rightTop.getChildByName("quanka").active = true;
            this.rightTop.getChildByName("fangka").active = true;
        }else{
            this.rightTop.getChildByName("ledou").active = false;
            this.rightTop.getChildByName("quanka").active = false;
            this.rightTop.getChildByName("fangka").active = true;
        }
        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowClubCard();
        this.ShowHero_NameOrID();
    },
    RemoveCloseFormArr:function(formPath){
        if(this.closeformArr.InArray(formPath)){
            this.closeformArr.Remove(formPath);
        }
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
        let heroID = app.HeroManager().GetHeroProperty("pid");
        let heroName = app.HeroManager().GetHeroProperty("name");
        this.lb_heroName.string = this.ComTool.GetBeiZhuName(heroID,heroName,9);
        
        this.lb_heroID.string = app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        this.WeChatHeadImage1.ShowHeroHead(heroID);

    },
    OnClick:function(btnName, btnNode){
        if('btn_close' == btnName){
            if(this.closeformArr.length >= 0){
                var closeformPath = this.closeformArr.pop();
                if(this.closeformArr.length == 0){
                    app.FormManager().CloseForm(closeformPath);
                    this.CloseForm();
                }else{
                    app.FormManager().CloseForm(closeformPath);
                }
            }
        }else if('btn_head' == btnName){
            this.FormManager.ShowForm("UIUserInfo");
        }else if('btn_addGold' == btnName){
            this.FormManager.ShowForm("UIStore",'btn_table0');
        }else if('btn_addRoomCard' == btnName){
            this.FormManager.ShowForm("UIStore",'btn_table1');
        }else if('btn_addQuanCard' == btnName){
            // this.FormManager.ShowForm('ui/club/UIClubStore');
        }
        
    }
});
