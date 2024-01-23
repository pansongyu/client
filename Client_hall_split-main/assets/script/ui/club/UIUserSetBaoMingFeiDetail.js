var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {
        let roomScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);

        this.RegEvent("OnClubFixedShareChangeMulti", this.Event_ClubFixedShareChangeMulti, this);
    },
    OnShow: function (data, type, isShowSelf=false) {
        this.data = data;
        this.isShowSelf = isShowSelf;
        this.curPage = 1;
        this.type = type;
        if (type == 1) {
            this.shareFixedValue=data.shareFixedValue;
            this.shareValue=0;
        }else if (type == 0) {
            this.shareValue=data.shareValue;
            this.shareFixedValue=0;
        }
        if (this.isShowSelf) {
            this.node.getChildByName("btn_reservedValue").active = false;
            this.node.getChildByName("top").getChildByName("tip_pl").active = false;
        }else{
            if (type == 1) {
                this.node.getChildByName("btn_reservedValue").active = true;
            }
            else{
                this.node.getChildByName("btn_reservedValue").active = false;
            }
            this.node.getChildByName("top").getChildByName("tip_pl").active = true;
        }
        this.GetScorePercentList(true);
    },
    GetNextPage:function(){
        // this.curPage++;
        // this.GetScorePercentList(false);
    },
    GetScorePercentList:function(isRefresh){
        let sendPack = {};
        sendPack.clubId = this.data.opClubId;
        sendPack.pid = this.data.opPid;
        sendPack.pageNum = this.curPage;
        sendPack.type = this.type;
        let self = this;
        if (this.isShowSelf) {
            app.NetManager().SendPack("club.CClubPromotionShareChangeListSelfInfo",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack, isRefresh);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取房间活跃计算列表失败",[],3);
            });
        }else{
            app.NetManager().SendPack("club.CClubPromotionShareChangeList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack, isRefresh);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取房间活跃计算列表失败",[],3);
            });
        }
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
            child.getChildByName("lb_roomName").getComponent(cc.Label).string = serverPack[i].configName;
            child.getChildByName("lb_roomCount").getComponent(cc.Label).string = serverPack[i].size;
            if (this.isShowSelf) {
                child.getChildByName("scorePercentEditBox").active = false;
            }else{
                child.getChildByName("scorePercentEditBox").active = true;
                if(serverPack[i].changeFlag==true){
                    child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = serverPack[i].value.toString();
                }else{
                    if (this.type == 1) {
                        child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareFixedValue;
                    }else if (this.type == 0) {
                        child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareValue;
                    }
                }
            }
            
            //可分配
            if (serverPack[i].type == 0) {
                child.getChildByName("lb_allowValue").getComponent(cc.Label).string = serverPack[i].allowValue + "%";
            }else{
                child.getChildByName("lb_allowValue").getComponent(cc.Label).string = serverPack[i].allowValue;
            }
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
            if (content.children[i].configInfo.scorePercent == parseFloat(scorePercentStr)) {
                //没有修改不用上传
                continue;
            }
            if (parseFloat(scorePercentStr) != null && parseFloat(scorePercentStr) >= 0) {
                temp.value = parseFloat(scorePercentStr);
                list.push(temp);
            }else{
                app.SysNotifyManager().ShowSysMsg("活跃计算值请输入大于等于0的数字",[],3);
                return [];
            }
        }
        return list;
    },
    Event_ClubFixedShareChangeMulti:function(event){
        this.UpdateScrollView(event, true);
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_save"){
            if (this.isShowSelf) {
                this.CloseForm();
                return;
            }
            let sendPack = {};
            sendPack.clubId = this.data.opClubId;
            sendPack.pid = this.data.opPid;
            sendPack.type = this.type;
            sendPack.promotionCalcActiveItemList = this.GetAllRoomListCfg();
            if (sendPack.promotionCalcActiveItemList.length == 0) {
                return;
            }
            let self = this;
            app.NetManager().SendPack("club.CClubPromotionShareChangeBatch",sendPack, function(serverPack){
                app.SysNotifyManager().ShowSysMsg("保存成功",[],3);
                self.CloseForm();
            }, function(){
                app.SysNotifyManager().ShowSysMsg("保存失败",[],3);
            });
        }else if (btnName == "btn_reservedValue") {
            let sendPack = {};
            sendPack.clubId = this.data.opClubId;
            sendPack.pid = this.data.opPid;
            let promotionCalcActiveItemList = this.GetAllRoomListCfg();
            let self = this;
            app.NetManager().SendPack("club.CClubReservedValueInfo",sendPack, function(serverPack){
                serverPack.promotionCalcActiveItemList = promotionCalcActiveItemList;
                serverPack.clubId = self.data.opClubId;
                serverPack.pid = self.data.opPid;
                serverPack.type = self.type;
                app.FormManager().ShowForm("ui/club/UIUserSetReservedBaoMingFei",serverPack);
            }, function(){
                
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
