var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad:function(){
        this.ComTool=app.ComTool();
    	let memberScrollView = this.node.getChildByName("memberScrollView").getComponent(cc.ScrollView);
        memberScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData:function (clubId, unionId, unionPostType, myisminister) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.curPage = 1;
        this.curType = 0;
        this.clickBtnName = "";
        if(this.myisminister == app.ClubManager().Club_MINISTER_MGRSS){
            this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck").active = true;
            this.node.getChildByName("topBtnNode").getChildByName("btn_exitCheck").active = true;
            this.node.getChildByName("btn_addMember").active = true;
            let btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck");
            this.OnClick(btn_default.name,btn_default);
        }else if(this.unionPostType == app.ClubManager().UNION_CLUB ||  (this.unionPostType == app.ClubManager().UNION_GENERAL && this.myisminister != app.ClubManager().Club_MINISTER_GENERAL)){//亲友圈创建者
            this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck").active = false;
            this.node.getChildByName("topBtnNode").getChildByName("btn_exitCheck").active = false;
            this.node.getChildByName("btn_addMember").active = false;
            let btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_outRaceCheck");
            this.OnClick(btn_default.name,btn_default);
        }else{
            this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck").active = true;
            this.node.getChildByName("topBtnNode").getChildByName("btn_exitCheck").active = true;
            this.node.getChildByName("btn_addMember").active = true;
            let btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck");
            this.OnClick(btn_default.name,btn_default);
        }
    },
    ClickTopBtn:function(clickName){
    	let topBtnNode = this.node.getChildByName("topBtnNode");
        let allTopBtn = [];
        for (let i = 0; i < topBtnNode.children.length; i++) {
            allTopBtn.push(topBtnNode.children[i]);
        }
        this.clickBtnName = clickName;
        for (let i = 0; i < allTopBtn.length; i++) {
            if (allTopBtn[i].name == clickName) {
                allTopBtn[i].getChildByName("img_off").active = false;
                allTopBtn[i].getChildByName("lb_off").active = false;
                allTopBtn[i].getChildByName("img_on").active = true;
                allTopBtn[i].getChildByName("lb_on").active = true;
            }else{
                allTopBtn[i].getChildByName("img_off").active = true;
                allTopBtn[i].getChildByName("lb_off").active = true;
                allTopBtn[i].getChildByName("img_on").active = false;
                allTopBtn[i].getChildByName("lb_on").active = false;
            }
        }
        let topTitle = this.node.getChildByName("topTitle");
        if (this.curType == 0 || this.curType == 1) {
            //成员审核的
            topTitle.getChildByName("lb_1").getComponent(cc.Label).string = "亲友圈名称";
            topTitle.getChildByName("lb_2").getComponent(cc.Label).string = "圈ID";
            topTitle.getChildByName("lb_3").getComponent(cc.Label).string = "创建者名称";
            topTitle.getChildByName("lb_4").getComponent(cc.Label).string = "圈主ID";
            topTitle.getChildByName("lb_5").getComponent(cc.Label).string = "人数";
        }else{
            //退赛，重赛审核的
            topTitle.getChildByName("lb_1").getComponent(cc.Label).string = "玩家昵称";
            topTitle.getChildByName("lb_2").getComponent(cc.Label).string = "玩家ID";
            topTitle.getChildByName("lb_3").getComponent(cc.Label).string = "所属亲友圈";
            topTitle.getChildByName("lb_4").getComponent(cc.Label).string = "亲友圈ID";
            topTitle.getChildByName("lb_5").getComponent(cc.Label).string = "比赛分";
        }
    },
    GetNextPage:function(){
    	this.curPage++;
    	let sendPack = app.ClubManager().GetUnionSendPackHead();
    	sendPack.pageNum = this.curPage;
    	sendPack.type = this.curType;
        let self = this;
        app.NetManager().SendPack("union.CUnionMemberExamineList",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, false);
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },
    UpdateScrollView:function(serverPack, isRefresh){
    	let memberScrollView = this.node.getChildByName("memberScrollView");
    	let content = memberScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		memberScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
    	let demo = this.node.getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.length; i++) {
    		let child = cc.instantiate(demo);
    		if (i%2 == 0) {
    			child.getChildByName("img_tiaowen01").active = true;
    		}else{
    			child.getChildByName("img_tiaowen01").active = false;
    		}
            if (this.curType == 3) {
                child.getChildByName("btn_refuse").active = false;
                child.getChildByName("btn_agree").x = 345;
            }else{
                child.getChildByName("btn_refuse").active = true;
                child.getChildByName("btn_refuse").x = 265;
                child.getChildByName("btn_agree").x = 425;
            }
            if(serverPack[i].clubName.length > 6)
                serverPack[i].clubName = serverPack[i].clubName.substring(0,6) + '...';
            
            if (serverPack[i].type == 0 || serverPack[i].type == 1) {
                //成员审核的
                child.getChildByName("lb_clubName").getComponent(cc.Label).string = serverPack[i].clubName;
                child.getChildByName("lb_clubId").getComponent(cc.Label).string = serverPack[i].clubSign;
                child.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack[i].createId,serverPack[i].createName);
                child.getChildByName("lb_clubCreatorId").getComponent(cc.Label).string = serverPack[i].createId;
                child.getChildByName("lb_clubMemberNum").getComponent(cc.Label).string = serverPack[i].number;
            }else{
                //退赛，重赛审核的
                child.getChildByName("lb_clubName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack[i].createId,serverPack[i].createName);
                child.getChildByName("lb_clubId").getComponent(cc.Label).string = serverPack[i].createId;
                child.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = serverPack[i].clubName;
                child.getChildByName("lb_clubCreatorId").getComponent(cc.Label).string = serverPack[i].clubSign;
                child.getChildByName("lb_clubMemberNum").getComponent(cc.Label).string = serverPack[i].sportsPoint;
            }
    		
    		child.clubId = serverPack[i].clubId;
            child.opPid = serverPack[i].createId;
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
        if('btn_joinCheck'==btnName){
            this.curType = 0;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            let sendPack = app.ClubManager().GetUnionSendPackHead();
	    	sendPack.pageNum = this.curPage;
	    	sendPack.type = this.curType;
            let self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack, true);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
            });
        }else if('btn_exitCheck'==btnName){
            this.curType = 1;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            let sendPack = app.ClubManager().GetUnionSendPackHead();
	    	sendPack.pageNum = this.curPage;
	    	sendPack.type = this.curType;
            let self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack, true);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
            });
        }else if('btn_outRaceCheck'==btnName){
            this.curType = 2;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.pageNum = this.curPage;
            sendPack.type = this.curType;
            let self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack, true);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
            });
        }else if('btn_reRaceCheck'==btnName){
            this.curType = 3;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.pageNum = this.curPage;
            sendPack.type = this.curType;
            let self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList",sendPack, function(serverPack){
                self.UpdateScrollView(serverPack, true);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
            });
        }else if('btn_agree'==btnName){
            if (this.curType == 2) {
                this.SetWaitForConfirm('MSG_AGREE_OUTRACE',app.ShareDefine().Confirm,[],[btnNode],"同意后该玩家的比赛分将清零，并且由您补足清零的差额");
            }else{
                let sendPack = app.ClubManager().GetUnionSendPackHead();
                sendPack.opClubId = btnNode.parent.clubId;
                sendPack.type = this.curType;
                sendPack.opPid = btnNode.parent.opPid;
                sendPack.operate = 0;
                let self = this;
                app.NetManager().SendPack("union.CUnionMemberExamineOperate",sendPack, function(serverPack){
                    btnNode.parent.removeFromParent();
                    btnNode.parent.destroy();
                    app.SysNotifyManager().ShowSysMsg("操作成功",[],3);
                }, function(){
                    if (self.clickBtnName != "") {
                        let btn_default = self.node.getChildByName("topBtnNode").getChildByName(self.clickBtnName);
                        self.OnClick(btn_default.name,btn_default);
                    }
                });
            }
        	
        }else if('btn_refuse'==btnName){
            let sendPack = app.ClubManager().GetUnionSendPackHead();
	    	sendPack.opClubId = btnNode.parent.clubId;
	    	sendPack.type = this.curType;
            sendPack.opPid = btnNode.parent.opPid;
	    	sendPack.operate = 1;
            let self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineOperate",sendPack, function(serverPack){
                btnNode.parent.removeFromParent();
                btnNode.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("操作成功",[],3);
            }, function(){
                if (self.clickBtnName != "") {
                    let btn_default = self.node.getChildByName("topBtnNode").getChildByName(self.clickBtnName);
                    self.OnClick(btn_default.name,btn_default);
                }
            });
        }else if('btn_addMember'==btnName){
            app.FormManager().ShowForm("ui/club/UIUnionYaoQing");
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[],content=""){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if('MSG_AGREE_OUTRACE' == msgID){
            let btnNode = backArgList[0];
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = btnNode.parent.clubId;
            sendPack.type = this.curType;
            sendPack.opPid = btnNode.parent.opPid;
            sendPack.operate = 0;
            let self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineOperate",sendPack, function(serverPack){
                btnNode.parent.removeFromParent();
                btnNode.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("操作成功",[],3);
            }, function(){
                if (self.clickBtnName != "") {
                    let btn_default = self.node.getChildByName("topBtnNode").getChildByName(self.clickBtnName);
                    self.OnClick(btn_default.name,btn_default);
                }
            });
        }
    },
});