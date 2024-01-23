var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {
        let roomScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    OnShow: function (data, type) {
        this.data = data;
        this.curPage = 1;
        this.type = type;
        if (type == 1) {
            this.shareFixedValue=data.shareFixedValue;
            this.shareValue=0;
        }else if (type == 0) {
            this.shareValue=data.shareValue;
            this.shareFixedValue=0;
        }
        this.GetScorePercentList(true);
    },
    GetNextPage:function(){
        this.curPage++;
        this.GetScorePercentList(false);
    },
    GetScorePercentList:function(isRefresh){
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.opClubId = this.data.opClubId;
        sendPack.opPid = this.data.opPid;
        sendPack.pageNum = this.curPage;
        sendPack.type = this.type;
        let self = this;
        app.NetManager().SendPack("union.CUnionScorePercentList",sendPack, function(serverPack){
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
            if(serverPack[i].changeFlag==true){
                child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = serverPack[i].scorePercent.toString();
            }else{
                if (this.type == 1) {
                    child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareFixedValue;
                }else if (this.type == 0) {
                    child.getChildByName("scorePercentEditBox").getComponent(cc.EditBox).string = this.shareValue;
                }
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
                temp.scorePercent = parseFloat(scorePercentStr);
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
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = this.data.opClubId;
            sendPack.opPid = this.data.opPid;
            sendPack.type = this.type;
            sendPack.unionScorePercentItemList = this.GetAllRoomListCfg();
            if (sendPack.unionScorePercentItemList.length == 0) {
                return;
            }
            let self = this;
            app.NetManager().SendPack("union.CUnionScorePercentBatchUpdate",sendPack, function(serverPack){
                app.SysNotifyManager().ShowSysMsg("保存成功",[],3);
                self.CloseForm();
            }, function(){
                app.SysNotifyManager().ShowSysMsg("保存失败",[],3);
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
