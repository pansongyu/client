var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    OnShow: function (clubId,pid) {
        this.clubId = clubId;
        this.pid = pid;
        this.GetScorePercentList(true);
    },
    GetScorePercentList:function(isRefresh){
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pid = this.pid;
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionActiveReportForm",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取房间活跃计算列表失败",[],3);
        });
    },
    UpdateScrollView:function(serverPack, isRefresh){
        let roomScrollView = this.node.getChildByName("mark");
        let content = roomScrollView.getChildByName("layout");
        if (isRefresh) {
            roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            //content.removeAllChildren();
            this.DestroyAllChildren(content);
        }
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            let child = cc.instantiate(demo);
            child.getChildByName("lb_date").getComponent(cc.Label).string = serverPack[i].dateTime;
            child.getChildByName("lb_active").getComponent(cc.Label).string = serverPack[i].value;
            child.active = true;
            content.addChild(child);
        }
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
