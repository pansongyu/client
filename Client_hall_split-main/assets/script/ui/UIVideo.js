var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIVideo_Child: cc.Prefab,
        UIVideo_Child02:cc.Prefab,
    },

    OnCreateInit: function () {
        this.RoomRecordManager = app.RoomRecordManager();

        this.RoomID = 0;

        this.loopScrollView = this.getComponent("LoopScrollView");
        this.RegEvent("RoomRecordDetail", this.Event_RoomRecordDetail);
        this.RegEvent("RoomAllRecord", this.Event_RoomAllRecord);
        this.RegEvent("HeroProperty", this.Event_HeroProperty);

    },
    Event_HeroProperty:function (event) {
        let argDict = event.detail;

        if(argDict["Property"] == "fastCard"){
            this.ShowFastCount();
        }
        else if(argDict["Property"] == "roomCard"){
            this.ShowRoomCard();
        }
    },
    Event_RoomAllRecord:function (event) {
        this.ShowUIVideoChild();
    },

    Event_RoomRecordDetail:function (event) {
        let roomID = event.detail["roomID"];
        this.ShowRoomRecordDetail(roomID);
    },
    ShowRoomRecordDetail:function (roomID) {
        this.ClearAllChildComponentByName("UIVideo_Child");

        this.SetRoomID(roomID);
        let roomRecordList = this.RoomRecordManager.GetRoomRecordDetail(roomID);
        let RoomRecordKeyList = Object.keys(roomRecordList);
        this.loopScrollView.InitScrollData("UIVideo_Child02", this.UIVideo_Child02, RoomRecordKeyList);
    },
    SetRoomID:function (roomID) {
        this.RoomID = roomID;
    },
    GetRoomID:function () {
        return this.RoomID;
    },
    OnShow:function () {
        this.RoomRecordManager.RequestRoomAllRecord();
        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowHero_NameOrID();

        this.ShowUIVideoChild();
    },
    ShowUIVideoChild:function () {
        this.ClearAllChildComponentByName("UIVideo_Child02");
        let roomAllRecordList = this.RoomRecordManager.GetRoomAllRecord();
        let roomAllRecordKeyList = Object.keys(roomAllRecordList);

        this.loopScrollView.InitScrollData("UIVideo_Child", this.UIVideo_Child, roomAllRecordKeyList);

    },
    ShowFastCount:function () {
        let fastCard = app.HeroManager().GetHeroProperty("fastCard");
        this.SetWndProperty("UITitle/sp_info/juan/lb_juannum","text",fastCard);
    },
    ShowRoomCard:function () {
        let heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.SetWndProperty("UITitle/sp_info/fang/lb_fangnum","text",heroRoomCard);
    },
    ShowHero_NameOrID:function () {
        let heroID = app.HeroManager().GetHeroProperty("pid");
        let heroName = app.HeroManager().GetHeroProperty("name");
        this.SetWndProperty("UITitle/sp_info/lb_name","text",this.ComTool.GetBeiZhuName(heroID,heroName));
        this.SetWndProperty("UITitle/sp_info/lb_id","text",app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)}));
    },

    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_buy"){
            let clientConfig = app.Client.GetClientConfig();
            this.FormManager.ShowForm("UIStore");
        }
        else if(btnName == "btn_bendi"){
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        }
        else if(btnName == "btn_taren"){
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        }
        else if(btnName == "btn_back"){
            let childComponent = this.GetAllChildComponentByName("UIVideo_Child02");
            if(childComponent[0]){
                this.ShowUIVideoChild();
            }
            else{
                this.CloseForm();
            }
        }
        else{
            this.ErrLog("OnClick(%s) not find btnName",btnName);
        }
    },


});