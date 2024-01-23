var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {
        this.minAllowShareToValue = 0;
        // let sectionScrollView = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        // sectionScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    OnShow: function (data, isShowSelf = false) {
        this.data = data;
        this.curPage = 1;
        this.isShowSelf = isShowSelf;
        if (isShowSelf) {
            this.node.getChildByName("top").getChildByName("btn_oneKey").active = false;
        }else{
            this.node.getChildByName("top").getChildByName("btn_oneKey").active = true;
        }
        this.GetSectionList(true);
    },
    GetNextPage:function(){
        this.curPage++;
        this.GetSectionList(false);
    },
    GetSectionList:function(isRefresh){
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.opClubId = this.data.opClubId;
        sendPack.opPid = this.data.opPid;
        sendPack.pageNum = this.curPage;
        sendPack.isShowSelf = this.isShowSelf;
        sendPack.unionFlag = this.data.unionFlag;
        if (this.data.unionFlag == 0) {
            sendPack.unionId = 0;//推广员的不用传联盟 id
        }
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionSectionChangeList",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack["promotionShareSectionItems"], isRefresh);
            self.minAllowShareToValue = serverPack["minAllowShareToValue"];
        }, function(){

        });
    },
    UpdateScrollView:function(serverPack, isRefresh){
        let sectionScrollView = this.node.getChildByName("mark");
        let content = sectionScrollView.getChildByName("layout");
        if (isRefresh) {
            sectionScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            //先判断下是否已经存在
            let isExist = false;
            for (let j = 0; j < content.children.length; j++) {
                if (content.children[j].id == serverPack[i].id) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            let child = cc.instantiate(demo);
            child.unionSectionId = serverPack[i].unionSectionId;
            child.sectionInfo = serverPack[i];
            //UI
            if (this.isShowSelf) {
                child.getChildByName("btn_change").active = false;
            }else{
                child.getChildByName("btn_change").active = true;
            }
            child.getChildByName("lb_index").getComponent(cc.Label).string = ""+(i+1);
            let sectionStr = "("+serverPack[i].beginValue+","+serverPack[i].endValue+"]";
            if (serverPack[i].endFlag == 1) {
                sectionStr = "("+serverPack[i].beginValue+",∞]";
            }
            child.getChildByName("lb_section").getComponent(cc.Label).string = sectionStr;
            child.getChildByName("lb_allowShareToValue").getComponent(cc.Label).string = ""+serverPack[i].allowShareToValue;
            child.getChildByName("lb_shareToSelfValue").getComponent(cc.Label).string = ""+serverPack[i].shareToSelfValue;
            let renJunStr = "人均:("+serverPack[i].twoValue+","+serverPack[i].threeValue+","+serverPack[i].fourValue+","+serverPack[i].tenValue+")";
            child.getChildByName("lb_renJunValue").getComponent(cc.Label).string = renJunStr;
            child.active = true;
            content.addChild(child);
        }
    },
    UpdateShareToSelfValue:function(data){
        let sectionScrollView = this.node.getChildByName("mark");
        let content = sectionScrollView.getChildByName("layout");
        let unionSectionId = data["unionSectionId"];
        let shareToSelfValue = data["shareToSelfValue"];
        let twoValue = (shareToSelfValue/2).toFixed(2);
        let threeValue = (shareToSelfValue/3).toFixed(2);
        let fourValue = (shareToSelfValue/4).toFixed(2);
        let tenValue = (shareToSelfValue/10).toFixed(2);
        for (let i = 0; i < content.children.length; i++) {
            if (unionSectionId == -1) {
                content.children[i].getChildByName("lb_shareToSelfValue").getComponent(cc.Label).string = shareToSelfValue;
                let renJunStr = "人均:("+twoValue+","+threeValue+","+fourValue+","+tenValue+")";
                content.children[i].getChildByName("lb_renJunValue").getComponent(cc.Label).string = renJunStr;
            }else if (content.children[i].unionSectionId == unionSectionId) {
                content.children[i].getChildByName("lb_shareToSelfValue").getComponent(cc.Label).string = shareToSelfValue;
                let renJunStr = "人均:("+twoValue+","+threeValue+","+fourValue+","+tenValue+")";
                content.children[i].getChildByName("lb_renJunValue").getComponent(cc.Label).string = renJunStr;
                break;
            }
        }
    },
    GetAllRoomListCfg:function(){
        let sectionScrollView = this.node.getChildByName("mark");
        let content = sectionScrollView.getChildByName("layout");
        let list = [];
        for (let i = 0; i < content.children.length; i++) {
            let temp = {};
            temp.unionSectionId = content.children[i].unionSectionId;
            let shareToSelfValue = content.children[i].getChildByName("lb_shareToSelfValue").getComponent(cc.Label).string;
            // if (content.children[i].sectionInfo.shareToSelfValue == parseFloat(shareToSelfValue)) {
            //     //没有修改不用上传
            //     continue;
            // }
            if (!isNaN(parseFloat(shareToSelfValue)) && app.ComTool().StrIsNum(shareToSelfValue) && parseFloat(shareToSelfValue) >= 0) {
                temp.shareToSelfValue = parseFloat(shareToSelfValue);
                temp.beginValue = content.children[i].sectionInfo.beginValue;
                temp.endValue = content.children[i].sectionInfo.endValue;
                list.push(temp);
            }else{
                app.SysNotifyManager().ShowSysMsg("可分配值请输入大于等于0的数字",[],3);
                return [];
            }
        }
        return list;
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_save"){
            if (this.isShowSelf) {
                this.CloseForm();
                return;
            }
            let sendPack = {};
            sendPack.opClubId = this.data.opClubId;
            sendPack.opPid = this.data.opPid;
            sendPack.promotionSectionCalcActiveItems = this.GetAllRoomListCfg();
            if (sendPack.promotionSectionCalcActiveItems.length == 0) {
                return;
            }
            let self = this;
            app.NetManager().SendPack("club.CClubPromotionShareSectionChangeBatch",sendPack, function(serverPack){
                app.SysNotifyManager().ShowSysMsg("保存成功",[],3);
                self.CloseForm();
            }, function(){
                // app.SysNotifyManager().ShowSysMsg("保存失败",[],3);
            });
        }else if(btnName == "btn_cancel"){
            this.CloseForm();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else if(btnName == "btn_oneKey"){
            let data = {};
            data.unionSectionId = -1;
            data.minAllowShareToValue = this.minAllowShareToValue;
            data.shareToSelfValue = this.minAllowShareToValue;
            app.FormManager().ShowForm("ui/club/UIUserChangeSection",data);
        }else if(btnName == "btn_change"){
            let data = {};
            data.unionSectionId = btnNode.parent.sectionInfo.unionSectionId;
            data.minAllowShareToValue = btnNode.parent.sectionInfo.allowShareToValue;
            data.shareToSelfValue = btnNode.parent.sectionInfo.shareToSelfValue;
            app.FormManager().ShowForm("ui/club/UIUserChangeSection",data);
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
