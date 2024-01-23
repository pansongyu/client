var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    OnShow: function (clubId,pid = 0) {
        this.clubId = clubId;
        this.pid = pid;
        this.GetScorePercentList(true);
    },
    GetScorePercentList:function(isRefresh){
        let sendPack = {};
        sendPack.clubId = this.clubId;
        if (this.pid > 0) {
            sendPack.pid = this.pid;
        }
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionLevelReportForm",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){

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
            child.getChildByName("lb_jushu").getComponent(cc.Label).string = serverPack[i].setCount;
            child.getChildByName("lb_dayingjia").getComponent(cc.Label).string = serverPack[i].winner;
            //child.getChildByName("lb_scorePoint").getComponent(cc.Label).string = serverPack[i].scorePoint;
            child.getChildByName("lb_costZuan").getComponent(cc.Label).string = serverPack[i].consume;
            child.getChildByName("lb_costSP").getComponent(cc.Label).string = serverPack[i].entryFee;
            child.getChildByName("lb_winlostSP").getComponent(cc.Label).string = serverPack[i].sportsPointConsume;
            child.getChildByName("lb_sumScore").getComponent(cc.Label).string = serverPack[i].sumSportsPoint;
            child.getChildByName("lb_sumTable").getComponent(cc.Label).string = serverPack[i].table;
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
