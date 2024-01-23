var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        chazhaoEditBox:cc.EditBox,
    },
    onLoad:function(){
    	let rankScrollView = this.node.getChildByName("rankScrollView").getComponent(cc.ScrollView);
        rankScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
        app.Client.RegEvent("UpdateZhanDuiNodeData", this.Event_UpdateZhanDuiNodeData, this);
    },
    InitData:function (clubId, unionId, unionPostType,levelPromotion) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.levelPromotion = levelPromotion;
        this.curPage = 1;
        this.curType = 0;
        this.GetZhanDuiLevelList();
        let sendPack = {};
        let sendPackName = "club.CClubGetCompetitionTime";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){   
            self.competitionTimeList = serverPack;
            self.curType = self.competitionTimeList[0].type;
            self.UpdateStatusAndTime(self.competitionTimeList[0]);
            self.GetClubTeamListZhongZhi(true)
        }, function(){

        });
        this.node.getChildByName("img_sjdi").active = false;
    },
    Event_UpdateZhanDuiNodeData:function(event){
        this.GetZhanDuiLevelList();
        this.curPage = 1;
        this.GetClubTeamListZhongZhi(true)
    },
    GetZhanDuiLevelList:function(){
        this.levelList = [];
        let img_zddi = this.node.getChildByName("selectzd").getChildByName("img_zddi");
        for (let i = 0; i < img_zddi.children.length; i++) {
            let toggle = img_zddi.children[i].getChildByName("toggle").getComponent(cc.Toggle);
            if (toggle.isChecked) {
                let level = parseInt(img_zddi.children[i].name.replace("btn_zd_",''));
                this.levelList.push(level);
            }
        }
    },
    GetClubTeamListZhongZhi:function(isRefresh) {
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.type = this.curType;
        sendPack.pageNum = this.curPage;
        sendPack.query = this.chazhaoEditBox.string;
        sendPack.levelQuery = this.levelList;
        let sendPackName = "club.CClubTeamListZhongZhi";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){

        });
    },
    UpdateStatusAndTime:function(competitionTime){
        this.node.getChildByName("img_rqdi").getChildByName("lb_time").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayString(competitionTime.beginTime);
        this.node.getChildByName("img_sjdi").removeAllChildren();
        for (let i = 0; i < this.competitionTimeList.length; i++) {
            let tempNode = this.node.getChildByName("btn_timeDemo");
            let child = cc.instantiate(tempNode);
            child.getChildByName("lb_btnTime").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayString(this.competitionTimeList[i].beginTime);
            child.competitionTime = this.competitionTimeList[i];
            if (this.curType == this.competitionTimeList[i].type) {
                child.getChildByName("img_sjxz").active = true;
            }else{
                child.getChildByName("img_sjxz").active = false;
            }
            child.active = true;
            this.node.getChildByName("img_sjdi").addChild(child);
        }
    },
    GetNextPage:function(){
    	this.curPage++;
    	this.GetClubTeamListZhongZhi(false);
    },
    UpdateScrollView:function(serverPack, isRefresh){
    	let rankScrollView = this.node.getChildByName("rankScrollView");
    	let content = rankScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		rankScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
        let demo = this.node.getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.clubTeamListInfoList.length; i++) {
            let matchItem = serverPack.clubTeamListInfoList[i];
    		let child = cc.instantiate(demo);
    		if (i%2 == 0) {
    			child.getComponent(cc.Sprite).enabled = true;
    		}else{
    			child.getComponent(cc.Sprite).enabled = false;
    		}
            child.pid = matchItem.pid;
            child.level = matchItem.level;
            child.getChildByName("lb_name").getComponent(cc.Label).string =matchItem.name
            child.getChildByName("lb_id").getComponent(cc.Label).string = matchItem.pid;
            child.getChildByName("lb_scorePoint").getComponent(cc.Label).string = matchItem.scorePoint;
            child.getChildByName("lb_level").getComponent(cc.Label).string = matchItem.level;
            child.getChildByName("lb_number").getComponent(cc.Label).string = matchItem.number;
            child.getChildByName("lb_sportsPointConsume").getComponent(cc.Label).string = matchItem.sportsPointConsume;
            child.getChildByName("lb_consume").getComponent(cc.Label).string = matchItem.consume;
    		child.active = true;
    		content.addChild(child);
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
        if ("btn_timeDemo" == btnName) {
            this.curType = btnNode.competitionTime.type;
            this.curPage = 1;
            this.GetClubTeamListZhongZhi(true);
            this.UpdateStatusAndTime(btnNode.competitionTime);
            this.node.getChildByName("img_sjdi").active = false;
        }else if('img_rqdi'==btnName){
            this.node.getChildByName("img_sjdi").active = !this.node.getChildByName("img_sjdi").active;
        }else if('lb_4'==btnName){
            this.node.getChildByName("selectzd").active = true;
        }else if ("btn_search" == btnName) {
            this.curPage = 1;
            this.GetClubTeamListZhongZhi(true);
        }else if('btn_huizong'==btnName){
            app.FormManager().ShowForm('ui/club_2/UIPromoterAllReport_2',this.clubId);
        }else if('btn_addDuiZhang'==btnName){
            app.FormManager().ShowForm('ui/club_2/UIClubAddCaptain_2',this.clubId);
        }else if('btn_detail'==btnName){
            this.node.parent.getChildByName("zhanduiDetailNode").active = true;
            this.node.parent.getChildByName("zhanduiDetailNode").getComponent("zhanduiDetailNode").InitData(this.clubId, this.unionId, btnNode.parent.pid, btnNode.parent.level, this.levelPromotion,this.unionPostType);
        }else if('selectzd'==btnName){
            this.GetZhanDuiLevelList();
            this.GetClubTeamListZhongZhi(true);
            btnNode.active = false;
        }
    },
});