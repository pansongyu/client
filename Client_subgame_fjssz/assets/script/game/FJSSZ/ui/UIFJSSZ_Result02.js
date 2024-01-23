var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        bg:cc.Node,
        btn_look:cc.Node,

        ClientName:cc.Label,
        ClientJiFen:cc.Label,
        ClientShanDianJiangLi:cc.Label,
        ClientQiangGangHu:cc.Node,
        ClientHead:cc.Node,
        ClientZhongMa:cc.Node,

        ClientDownName:cc.Label,
        ClientDownJiFen:cc.Label,
        ClientDownShanDianJiangLi:cc.Label,
        ClientDownQiangGangHu:cc.Node,
        ClientDownHead:cc.Node,
        ClientDownZhongMa:cc.Node,

        ClientFaceName:cc.Label,
        ClientFaceJiFen:cc.Label,
        ClientFaceShanDianJiangLi:cc.Label,
        ClientFaceQiangGangHu:cc.Node,
        ClientFaceHead:cc.Node,
        ClientFaceZhongMa:cc.Node,

        ClientUpName:cc.Label,
        ClientUpJiFen:cc.Label,
        ClientUpShanDianJiangLi:cc.Label,
        ClientUpQiangGangHu:cc.Node,
        ClientUpHead:cc.Node,
        ClientUpZhongMa:cc.Node,

        gongjima:cc.Label,
        yizhangdingma:cc.Node,
        yimaquanzhong:cc.Node,
        zhongma:cc.Node,

        nd_card:cc.Node,

        btn_exit:cc.Node,
        btn_goon:cc.Node,
    },

    OnCreateInit: function () {
        this.btn_look.on("touchstart", this.Event_TouchStart, this)
        this.btn_look.on("touchend", this.Event_TouchEnd, this)
        this.btn_look.on("touchcancel", this.Event_TouchEnd, this)

        this.SSSRoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();

        this.WeChatHeadImage1 = this.ClientHead.getComponent(app.subGameName + "_WeChatHeadImage");
        this.WeChatHeadImage2 = this.ClientDownHead.getComponent(app.subGameName + "_WeChatHeadImage");
        this.WeChatHeadImage3 = this.ClientFaceHead.getComponent(app.subGameName + "_WeChatHeadImage");
        this.WeChatHeadImage4 = this.ClientUpHead.getComponent(app.subGameName + "_WeChatHeadImage");


    },
    //--------回调函数---------
    Event_TouchStart:function (event) {
        this.bg.active = false;
    },
    Event_TouchEnd:function (event) {
        this.bg.active = true;
    },

    OnShow: function () {

        let state = app[app.subGameName.toUpperCase() + "RoomMgr"]().GetEnterRoom().GetRoomProperty("state");
        if(state == this.ShareDefine.RoomState_End){
            this.btn_goon.active = 0;
            this.btn_exit.active = 1;
        }
        else {
            this.btn_goon.active = 1;
            this.btn_exit.active = 0;
        }

        this.ClientQiangGangHu.active = 0;
        this.ClientDownQiangGangHu.active = 0;
        this.ClientFaceQiangGangHu.active = 0;
        this.ClientUpQiangGangHu.active = 0;
        this.ClientZhongMa.active = 0;
        this.ClientDownZhongMa.active = 0;
        this.ClientFaceZhongMa.active = 0;
        this.ClientUpZhongMa.active = 0;

        let paiShu = this.nd_card.children;
        for(let i = 0; i < paiShu.length - 1; i++){
            paiShu[i].active = 0;
        }

        this.ShowPlayerHu();
    },
    ShowPlayerHu:function () {
        let RoomPosMgr = this.SSSRoomMgr.GetEnterRoom().GetRoomPosMgr();
        let clientPos = RoomPosMgr.GetClientPos();
        let clientDownPos = RoomPosMgr.GetClientDownPos();
        let clientFacePos = RoomPosMgr.GetClientFacePos();
        let clientUpPos = RoomPosMgr.GetClientUpPos();

        let roomSet = this.SSSRoomMgr.GetEnterRoom().GetRoomSet();
        let dataInfo = roomSet.GetRoomSetInfo();
        let SetEnd = dataInfo["setEnd"];
        let posHuList = SetEnd["posHuList"];
        let posHuListKey = Object.keys(posHuList);
        for(let i = 0; i < posHuListKey.length; i++){
            let pos = posHuList[i].pos;
            if(pos == clientPos){
                this.ShowPlayerQiangGangHu(RoomPosMgr, posHuList, this.ClientZhongMa, this.ClientQiangGangHu, this.WeChatHeadImage1, this.ClientName, this.ClientJiFen, this.ClientShanDianJiangLi, i);
            }
            else if(pos == clientDownPos){
                this.ShowPlayerQiangGangHu(RoomPosMgr, posHuList, this.ClientDownZhongMa, this.ClientDownQiangGangHu, this.WeChatHeadImage2, this.ClientDownName, this.ClientDownJiFen, this.ClientDownShanDianJiangLi, i);
            }
            else if(pos == clientFacePos){
                this.ShowPlayerQiangGangHu(RoomPosMgr, posHuList, this.ClientFaceZhongMa, this.ClientFaceQiangGangHu, this.WeChatHeadImage3, this.ClientFaceName, this.ClientFaceJiFen, this.ClientFaceShanDianJiangLi, i);
            }
            else if(pos == clientUpPos){
                this.ShowPlayerQiangGangHu(RoomPosMgr, posHuList, this.ClientUpZhongMa, this.ClientUpQiangGangHu, this.WeChatHeadImage4, this.ClientUpName, this.ClientUpJiFen, this.ClientUpShanDianJiangLi, i);
            }
        }

        this.gongjima.string = posHuList[clientPos]["zhongMa"];

        let roomList = this.SSSRoomMgr.GetEnterRoom().GetRoomConfig();
        let zhama = roomList["zhama"];
        if(
            zhama == this.ShareDefine.HZZhaMa_TwoMa
            ||
            zhama == this.ShareDefine.HZZhaMa_FourMa
            ||
            zhama == this.ShareDefine.HZZhaMa_SixMa
        ){
            this.yizhangdingma.active = 0;
            this.yimaquanzhong.active = 0;
            this.zhongma.active = 1;
        }
        else if(zhama == this.ShareDefine.HZZhaMa_Ymqz){
            this.yizhangdingma.active = 0;
            this.yimaquanzhong.active = 1;
            this.zhongma.active = 0;
        }
        else if(zhama == this.ShareDefine.HZZhaMa_Yzdm){
            this.yizhangdingma.active = 1;
            this.yimaquanzhong.active = 0;
            this.zhongma.active = 0;
        }

        let maCardList = posHuList[0]["maCardList"];
        for(let i = 0; i < maCardList.length; i++){
            let pai = maCardList[i].toString();
            let paiType = pai.charAt(1);
            let path = this.ComTool.StringAddNumSuffix("bg/sp_dingma/nd_card/sp_card", i+1, 2);
            if(paiType == 1 || paiType == 5 || paiType == 9){
                let value = ["CardShow",parseInt(maCardList[i]/100)].join("");
                this.SetWndProperty(path, "active", 1);
                this.SetWndProperty(path,"image",value);
            }
            else{
                this.SetWndProperty(path, "active", 0);
            }
        }

    },
    ShowPlayerQiangGangHu:function (RoomPosMgr, posHuList, ClientZhongMa, QiangGangHuNode, WeChatHeadImageNode, NameNode, JiFenNode, ShanDianJianLiNode, i) {
        let pos = posHuList[i].pos;
        let Player = RoomPosMgr.GetPlayerInfoByPos(pos);
        let name = Player["name"];
        let pid = Player["pid"];
        let jifen = posHuList[i]["point"] > 0 ? ["+",posHuList[i]["point"]].join("") : posHuList[i]["point"];
        let huType = posHuList[i]["huType"];
        let shanDianChuPai = posHuList[i]["flashCnt"];
        NameNode.string = name;
        JiFenNode.string = jifen;
        ShanDianJianLiNode.string = shanDianChuPai;
        WeChatHeadImageNode.ShowHeroHead(pid);
        if(huType == this.ShareDefine.HuType_ZiMo){
            QiangGangHuNode.active = 0;
        }
        else if(huType == this.ShareDefine.HuType_QGH){
            QiangGangHuNode.active = 1;
            ClientZhongMa.active = 1;
            ClientZhongMa.getComponent(cc.Label).string = app.i18n.t("ZhongMa",{"ZhongMa":posHuList[i]["zhongMa"]});
        }
        else if(huType == this.ShareDefine.HuType_FHZ){
            QiangGangHuNode.active = 0;
        }
        else {
            QiangGangHuNode.active = 0;
        }

    },
    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_goon"){
            this.CloseForm();
            this.Click_btn_goon();
        }
        else if(btnName == "btn_exit"){
            this.FormManager.ShowForm("UIResultTotal");
            this.CloseForm();
        }
        else{
            console.error("OnClick not find btnName",btnName);
        }
    },
    Click_btn_goon:function () {
        let room = this.SSSRoomMgr.GetEnterRoom();
        if(!room){
            console.error("Click_btn_ready not enter room");
            return
        }
        let roomID = room.GetRoomProperty("roomID");

        //this.SSSRoomMgr.SendContinueGame(roomID);
        app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
    }

});