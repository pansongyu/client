var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {
        let roomScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    OnShow: function (data, clubId) {
        this.data = data;
        this.clubId = clubId;
        this.curPage = 1;
        this.GetScorePercentList(true);
    },
    GetNextPage:function(){
        this.curPage++;
        this.GetScorePercentList(false);
    },
    GetScorePercentList:function(isRefresh){
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pid = this.data.pid;
        sendPack.pageNum = this.curPage;
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionCalcActiveList",sendPack, function(serverPack){
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
            //先判断下是否已经存在
            let isExist = false;
            for (let j = 0; j < content.children.length; j++) {
                if (content.children[j].configId == serverPack[i].configId) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            let child = cc.instantiate(demo);
            child.configId = serverPack[i].configId;
            child.configInfo = serverPack[i];
            let roomNameStr = serverPack[i].configName;
            if (typeof(roomNameStr) == "undefined" || roomNameStr == "") {
                roomNameStr = app.ShareDefine().GametTypeID2Name[serverPack[i].gameId];
            }
            child.getChildByName("lb_roomName").getComponent(cc.Label).string = roomNameStr;
            child.getChildByName("lb_roomCount").getComponent(cc.Label).string = serverPack[i].size;
            child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = serverPack[i].value.toString();
            child.active = true;
            content.addChild(child);
        }
    },
    GetAllRoomListCfg:function(){
        let roomScrollView = this.node.getChildByName("mark");
        let content = roomScrollView.getChildByName("layout");
        let list = [];
        for (let i = 0; i < content.children.length; i++) {
            let temp = {};
            temp.configId = content.children[i].configId;
            let scorePercentStr = content.children[i].getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string;
            if (content.children[i].configInfo.value == parseFloat(scorePercentStr)) {
                //没有修改不用上传
                continue;
            }
            if (!isNaN(parseFloat(scorePercentStr)) && app.ComTool().StrIsNum(scorePercentStr) && parseFloat(scorePercentStr) >= 0) {
                temp.value = parseFloat(scorePercentStr);
                list.push(temp);
            }else{
                app.SysNotifyManager().ShowSysMsg("活跃计算值请输入大于等于0的数字",[],3);
                return [];
            }
        }
        return list;
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_save"){
            let sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = this.data.pid;
            sendPack.promotionCalcActiveItemList = this.GetAllRoomListCfg();
            if (sendPack.promotionCalcActiveItemList.length == 0) {
                return;
            }
            let self = this;
            app.NetManager().SendPack("club.CClubPromotionCalcActiveBatch",sendPack, function(serverPack){
                app.FormManager().GetFormComponentByFormName("ui/club/UIPromoterManager").ClickLeftBtn("btn_PromoterList");
                app.SysNotifyManager().ShowSysMsg("保存成功",[],3);
                self.CloseForm();
            }, function(){
                // app.SysNotifyManager().ShowSysMsg("保存失败",[],3);
            });
        }else if(btnName == "btn_cancel"){
            this.CloseForm();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
