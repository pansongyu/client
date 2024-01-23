var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        chazhaoEditBox:cc.EditBox,
    },

    OnCreateInit: function () {
        this.rankScrollView = this.node.getChildByName("rankScrollView");
        this.rankScrollView.getComponent(cc.ScrollView).node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    OnShow: function (clubId) {
        this.opClubId = clubId;
        this.curPage = 1;
        this.GetUnionDynamicItemList(true);
    },
    GetPage:function(){
        this.curPage++;
        this.GetUnionDynamicItemList(false);
    },
    GetUnionDynamicItemList:function(isRefresh){
        let sendPack = {};
        sendPack.clubId = this.opClubId;
        sendPack.query = this.chazhaoEditBox.string;
        sendPack.pageNum = this.curPage;
        let self = this;
        app.NetManager().SendPack("club.CClubAddCaptainZhongZhi",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){

        });
    },
    UpdateScrollView:function(serverPack, isRefresh){
        let roomScrollView = this.node.getChildByName("mark");
        let content = this.rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            let child = cc.instantiate(demo);
            if (i%2 == 0) {
                child.getComponent(cc.Sprite).enabled = false;
            }else{
                child.getComponent(cc.Sprite).enabled = true;
            }
            child.shortPlayer = serverPack[i].shortPlayer;
            child.getChildByName("lb_name").getComponent(cc.Label).string = serverPack[i].shortPlayer.name;
            child.getChildByName("lb_id").getComponent(cc.Label).string = serverPack[i].shortPlayer.pid;
            child.getChildByName("lb_minister").getComponent(cc.Label).string = this.GetMinisterStr(serverPack[i].minister);
            child.getChildByName("lb_upPlayerName").getComponent(cc.Label).string = serverPack[i].upPlayerName;
            child.active = true;
            content.addChild(child);
        }
    },
    // //**是否是管理,不是为null,是为1，2为创建者
    GetMinisterStr:function(minister){
        if (minister == 1) {
            return "管理员";
        }else if (minister == 2) {
            return "创建者";
        }else{
            return "成员";
        }
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }else if ("btn_search" == btnName) {
            this.curPage = 1;
            this.GetUnionDynamicItemList(true);
        }else if ("btn_addCaptain" == btnName) {
            this.curPage = 1;
            let sendPack = {};
            sendPack.clubId = this.opClubId;
            sendPack.pid = btnNode.parent.shortPlayer.pid;
            sendPack.pageNum = this.curPage;
            let self = this;
            app.NetManager().SendPack("Club.CClubAddCaptionOpZhongZhi",sendPack, function(serverPack){
                self.GetUnionDynamicItemList(true);
                app.Client.OnEvent('UpdateZhanDuiNodeData', {});
            }, function(){

            });
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
