var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        img_wxnc:cc.Node,
        typeLabel:cc.Label,
        gameLabel:cc.Label,
    },
    onLoad:function(){
        this.wechatName = true;
        let rankScrollView = this.node.getChildByName("rankNode").getChildByName("rankScrollView").getComponent(cc.ScrollView);
        rankScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData:function (clubId, unionId, getType,rankedOpenZhongZhi, rankedOpenEntryZhongZhi) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.getType = getType;
        this.rankedOpenZhongZhi = rankedOpenZhongZhi;
        this.rankedOpenEntryZhongZhi = rankedOpenEntryZhongZhi;
        this.initAllClick = true;
        this.initOpenClick = true;
        let allToggle = this.node.getChildByName("rankNode").getChildByName("allToggle").getComponent(cc.Toggle);
        let openToggle = this.node.getChildByName("rankNode").getChildByName("openToggle").getComponent(cc.Toggle);
        allToggle.isChecked = rankedOpenZhongZhi;
        openToggle.isChecked = rankedOpenEntryZhongZhi;
        this.curPage = 1;
        this.type = 0;
        this.gameType = -1;
        this.node.getChildByName("rankNode").getChildByName("toggleContainer").active = false;
        this.node.getChildByName("rankNode").getChildByName("img_gamedi").active = false;
        this.ShowTypeBtnLabel();
        this.GetClubReportRanked(true);
        this.gameList = app.Client.GetAllGameId();
        this.ShowGameBtnLabel();
    },
    ShowTypeBtnLabel:function(){
        let toggleContainer = this.node.getChildByName("rankNode").getChildByName("toggleContainer");
        for (let i = 0; i < toggleContainer.children.length; i++) {
            let btnType = parseInt(toggleContainer.children[i].name.replace('toggle',''));
            if (toggleContainer.children[i].getComponent(cc.Toggle).isChecked) {
                this.type = btnType;
            }
        }
        let strObj = ["参与房间数","参与小局数","积分","大赢家","比赛最高分"];
        this.typeLabel.string = strObj[this.type];
    },
    ShowGameBtnLabel:function(){
        this.node.getChildByName("rankNode").getChildByName("img_gamedi").removeAllChildren();
        let selectGameName = "所有游戏";
        let gameDemo = this.node.getChildByName("rankNode").getChildByName("btn_gameDemo");
        let allGameChild = cc.instantiate(gameDemo);
        allGameChild.gameId = -1;
        allGameChild.gameName = selectGameName;
        allGameChild.getChildByName("lb_btnGame").getComponent(cc.Label).string = selectGameName;
        if (this.gameType == -1) {
            allGameChild.getChildByName("img_sjxz").active = true;
            selectGameName = "所有游戏";
        }else{
            allGameChild.getChildByName("img_sjxz").active = false;
        }
        allGameChild.active = true;
        this.node.getChildByName("rankNode").getChildByName("img_gamedi").addChild(allGameChild);
        for (let i = 0; i < this.gameList.length; i++) {
            let gameName = app.ShareDefine().GametTypeID2Name[this.gameList[i]];
            let key = this.gameList[i].toString();
            let child = cc.instantiate(gameDemo);
            child.gameId = this.gameList[i];
            child.gameName = gameName;
            child.getChildByName("lb_btnGame").getComponent(cc.Label).string = gameName;
            if (this.gameType == this.gameList[i]) {
                child.getChildByName("img_sjxz").active = true;
                selectGameName = gameName;
            }else{
                child.getChildByName("img_sjxz").active = false;
            }
            child.active = true;
            this.node.getChildByName("rankNode").getChildByName("img_gamedi").addChild(child);
        }
        this.gameLabel.string = selectGameName;
    },
    GetClubReportRanked:function(isRefresh) {
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.pageNum = this.curPage;
        sendPack.type = this.type;
        sendPack.getType = this.getType;
        sendPack.gameType = this.gameType;
        let sendPackName = "Club.CClubReportRanked";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            self.UpdateScrollView(serverPack["data"], isRefresh);
            self.ShowSelfInfo(serverPack["data"]["clubRankedZhongZhiSelf"]);
        }, function(){

        });
    },
    ShowSelfInfo:function(data){
        let img_xiadi = this.node.getChildByName("rankNode").getChildByName("img_xiadi");
        let lb_selfRank = img_xiadi.getChildByName("lb_selfRank").getComponent(cc.Label);
        if (data.id == 0) {
            lb_selfRank.string = "我的名次:未上榜";
        }else{
            lb_selfRank.string = "我的名次:" + data.id;
        }
        let lb_selfName = img_xiadi.getChildByName("lb_selfName").getComponent(cc.Label);
        lb_selfName.string = data.player.name;
        let lb_selfPid = img_xiadi.getChildByName("lb_selfPid").getComponent(cc.Label);
        lb_selfPid.string = data.player.pid;
        let lb_selfValue = img_xiadi.getChildByName("lb_selfValue").getComponent(cc.Label);
        lb_selfValue.string = data.itemsValue;
    },
    GetNextPage:function(){
        this.curPage++;
        this.GetClubChangeAlivePointList(false);
    },
    UpdateScrollView:function(serverPack, isRefresh){
        let rankScrollView = this.node.getChildByName("rankNode").getChildByName("rankScrollView");
        let content = rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        let demo = this.node.getChildByName("rankNode").getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack["recordList"].length; i++) {
            let matchItem = serverPack["recordList"][i];
            let child = cc.instantiate(demo);
            if (i%2 == 0) {
                child.getComponent(cc.Sprite).enabled = true;
            }else{
                child.getComponent(cc.Sprite).enabled = false;
            }
            let headImageUrl = matchItem.player.iconUrl;
            if(headImageUrl){
                app.WeChatManager().InitHeroHeadImage(matchItem.pid, headImageUrl);
                let WeChatHeadImage = child.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(matchItem.player.pid,headImageUrl);
            }
            child.wechatName = matchItem.player.name;
            child.playerInfo = matchItem.player;
            child.beizhu = app.ComTool().GetBeiZhuName(matchItem.player.pid,matchItem.player.name);
            if (this.wechatName) {
                child.getChildByName("lb_name").getComponent(cc.Label).string =matchItem.player.name;
            }else{
                child.getChildByName("lb_name").getComponent(cc.Label).string =child.beizhu;
            }
            child.pid = matchItem.player.pid;
            child.data = matchItem;
            child.getChildByName("lb_pid").getComponent(cc.Label).string = matchItem.player.pid;
            child.getChildByName("lb_value").getComponent(cc.Label).string = matchItem.itemsValue;
            child.getChildByName("lb_rank").getComponent(cc.Label).string = matchItem.id;
            child.active = true;
            content.addChild(child);
        }
    },
    SwitchWechatName:function(){
        let rankScrollView = this.node.getChildByName("rankNode").getChildByName("rankScrollView");
        let content = rankScrollView.getChildByName("view").getChildByName("content");
        for (let i = 0; i < content.children.length; i++) {
            if (this.wechatName) {
                content.children[i].getChildByName("lb_name").getComponent(cc.Label).string =content.children[i].wechatName;
            }else{
                content.children[i].getChildByName("lb_name").getComponent(cc.Label).string =content.children[i].beizhu;
            }
        }
    },
    //控件点击回调
    OnClick_BtnWnd:function(eventTouch, eventData){
        try{
            app.SoundManager().PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        }
        catch (error){
            console.log("OnClick_BtnWnd:"+error.stack);
        }
    },
    OnClick:function(btnName, btnNode){
        if('lb_4'==btnName){
            this.node.getChildByName("rankNode").getChildByName("toggleContainer").active = !this.node.getChildByName("rankNode").getChildByName("toggleContainer").active;
        }else if ("img_qmp" == btnName) {
            if (this.wechatName) {
                this.wechatName = false;
                this.img_wxnc.x = -36;
                this.img_wxnc.getChildByName("lb_2_3").getComponent(cc.Label).string = "群名片";
            }else{
                this.wechatName = true;
                this.img_wxnc.x = 36;
                this.img_wxnc.getChildByName("lb_2_3").getComponent(cc.Label).string = "微信昵称";
            }
            this.SwitchWechatName();
        }else if ("btn_gameDemo" == btnName) {
            this.gameType = btnNode.gameId;
            this.gameLabel.string = btnNode.gameName;
            this.curPage = 1;
            this.GetClubReportRanked(true);
            this.node.getChildByName("rankNode").getChildByName("img_gamedi").active = false;
            this.ShowGameBtnLabel();
        }else if ("btn_selectGame" == btnName) {
            this.node.getChildByName("rankNode").getChildByName("img_gamedi").active = !this.node.getChildByName("rankNode").getChildByName("img_gamedi").active;
        }
    },
    OnClickTypeToggle:function(event){
        this.node.getChildByName("rankNode").getChildByName("toggleContainer").active = false;
        this.ShowTypeBtnLabel();
        this.curPage = 1;
        this.GetClubReportRanked(true);
    },

    OnClickAllToggle:function(event){
        if (this.initAllClick) {
            this.initAllClick = false;
            return;
        }
        let allToggle = this.node.getChildByName("rankNode").getChildByName("allToggle").getComponent(cc.Toggle);
        let openToggle = this.node.getChildByName("rankNode").getChildByName("openToggle").getComponent(cc.Toggle);
        if (allToggle.isChecked && !openToggle.isChecked) {
            openToggle.isChecked = true;
        }
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.rankedOpenZhongZhi = allToggle.isChecked;
        // sendPack.rankedOpenEntryZhongZhi = openToggle.isChecked;
        let sendPackName = "Union.CUnionChangeZhongZhiRnaked";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){

        }, function(){

        });
    },

    OnClickOpenToggle:function(event){
        if (this.initOpenClick) {
            this.initOpenClick = false;
            return;
        }
        let allToggle = this.node.getChildByName("rankNode").getChildByName("allToggle").getComponent(cc.Toggle);
        let openToggle = this.node.getChildByName("rankNode").getChildByName("openToggle").getComponent(cc.Toggle);
        if (allToggle.isChecked && !openToggle.isChecked) {
            allToggle.isChecked = false;
        }
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        // sendPack.rankedOpenZhongZhi = allToggle.isChecked;
        sendPack.rankedOpenEntryZhongZhi = openToggle.isChecked;
        let sendPackName = "Union.CUnionChangeZhongZhiRnakedOpenEntry";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){

        }, function(){

        });
    },

    // ChangeZhongZhiRanked:function(allToggle,openToggle){
    //     let sendPack = {};
    //     sendPack.clubId = this.clubId;
    //     sendPack.unionId = this.unionId;
    //     sendPack.rankedOpenZhongZhi = allToggle.isChecked;
    //     sendPack.rankedOpenEntryZhongZhi = openToggle.isChecked;
    //     let sendPackName = "Union.CUnionChangeZhongZhiRnaked";
    //     let self = this;
    //     app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){

    //     }, function(){

    //     });
    // },
});