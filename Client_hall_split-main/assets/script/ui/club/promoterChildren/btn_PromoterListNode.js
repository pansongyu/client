var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        unSelectSprite:cc.SpriteFrame,
        selectSprite:cc.SpriteFrame,
    },
    onLoad:function(){
    	let memberScrollView = this.node.getChildByName("memberScrollView").getComponent(cc.ScrollView);
        memberScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData:function (clubId, unionId, unionPostType, myisminister, myisPartner) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.myisPartner = myisPartner;
        this.curPage = 1;
        this.GetClubPromoter(true);
    },
    GetClubPromoter:function(isRefresh){
        let sendPack = {};
        sendPack.clubId = this.clubId
        sendPack.pageNum = this.curPage;
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionList",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取成员列表失败",[],3);
        });
    },
    GetNextPage:function(){
    	this.curPage++;
        this.GetClubPromoter(false);
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
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            let isExist = false;
            for (let j = 0; j < content.children.length; j++) {
                if (content.children[j].pid == serverPack[i].pid) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
    		let child = cc.instantiate(demo);
            child.pid = serverPack[i].pid;
	        child.playerData = serverPack[i];
            if(serverPack[i].iconUrl){
                app.WeChatManager().InitHeroHeadImage(serverPack[i].pid, serverPack[i].iconUrl);
                let WeChatHeadImage = child.getChildByName('img_head').getComponent("WeChatHeadImage");
                WeChatHeadImage.ShowHeroHead(serverPack[i].pid,serverPack[i].iconUrl);
            }
            let nameTemp = serverPack[i].name;
            if (nameTemp.length >= 6) {
                nameTemp = serverPack[i].name.substr(0,6) + "...";
            }
	        child.getChildByName("lb_userName").getComponent(cc.Label).string = nameTemp;
	        child.getChildByName("lb_userId").getComponent(cc.Label).string = serverPack[i].pid;
	        child.getChildByName("lb_playerNum").getComponent(cc.Label).string = serverPack[i].number;
            child.getChildByName("lb_active").getComponent(cc.Label).string = serverPack[i].calcActiveValue;
            child.getChildByName("lb_activeNum").getComponent(cc.Label).string = serverPack[i].curActiveValue;
    		if (serverPack[i].promotion == 1) {
                child.getChildByName("controlNode").getChildByName("btn_xieren").active = true;
                child.getChildByName("controlNode").getChildByName("btn_shangren").active = false;
            }else if (serverPack[i].promotion == 2) {
                child.getChildByName("controlNode").getChildByName("btn_xieren").active = false;
                child.getChildByName("controlNode").getChildByName("btn_shangren").active = true;
            }else{
                child.getChildByName("controlNode").getChildByName("btn_xieren").active = false;
                child.getChildByName("controlNode").getChildByName("btn_shangren").active = false;
            }
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
    	if('btn_addPromoter'==btnName){
            app.FormManager().ShowForm("ui/club/UIClubPromoterAdd", this.clubId);
        }else if(btnName=="btn_ShowBtn" || btnName=="btn_control"){
            let selfHeroID = app.HeroManager().GetHeroProperty("pid");
            //自己不能操作自己
        	if (btnNode.parent.pid == selfHeroID) {
        		return;
        	}
            let allUserNode = btnNode.parent.parent.children;
            let controlNode = btnNode.parent.getChildByName("controlNode");
            for (let i = 0; i < allUserNode.length; i++) {
                let userControlNode = allUserNode[i].getChildByName("controlNode");
                if (userControlNode && controlNode != userControlNode) {
                    userControlNode.active = false;
                    userControlNode.parent.getComponent(cc.Sprite).spriteFrame=this.unSelectSprite;
                    userControlNode.parent.height = 80;
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame=this.selectSprite;
                btnNode.parent.height = 190;
            }else{
                btnNode.parent.getComponent(cc.Sprite).spriteFrame=this.unSelectSprite;
                btnNode.parent.height = 80;
            }
        }else if('btn_xieren'==btnName){
            let sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = btnNode.parent.parent.pid;
            let self = this;
            app.NetManager().SendPack("club.CClubPromotionAppointOrLeaveOffice",sendPack, function(serverPack){
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_shangren").active = true;
                app.SysNotifyManager().ShowSysMsg("卸任成功",[],3);
            }, function(){

            });
        }else if('btn_shangren'==btnName){
            let sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = btnNode.parent.parent.pid;
            let self = this;
            app.NetManager().SendPack("club.CClubPromotionAppointOrLeaveOffice",sendPack, function(serverPack){
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_xieren").active = true;
                app.SysNotifyManager().ShowSysMsg("上任成功",[],3);
            }, function(){

            });
        }else if('btn_xiashu'==btnName){
            app.FormManager().ShowForm("ui/club/UIPromoterXiaShuList", this.clubId, btnNode.parent.parent.playerData.pid, this.myisminister, this.myisPartner);
        }else if('btn_jisuan'==btnName){
            app.FormManager().ShowForm("ui/club/UIPromoterSetActive", btnNode.parent.parent.playerData, this.clubId);
        }else if('btn_yichang'==btnName){
            app.FormManager().ShowForm("ui/club/UIPromoterSetActiveNum", btnNode.parent.parent.playerData, this.clubId);
        }else if('btn_mingxi'==btnName){
            app.FormManager().ShowForm("ui/club/UIPromoterMsg", this.clubId, this.unionId, this.unionPostType, this.myisminister, this.myisPartner, btnNode.parent.parent.pid);
        }else if('btn_baobiao'==btnName){
            app.FormManager().ShowForm("ui/club/UIPromoterSetActiveReport", this.clubId, btnNode.parent.parent.playerData.pid);
        }else if('btn_delPromoter'==btnName){
            this.SetWaitForConfirm('MSG_DEL_PROMOTER',app.ShareDefine().Confirm,[],[this.clubId, btnNode.parent.parent.pid], "删除推广员后，该玩家将被踢出亲友圈");
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArgs=[],cbArgs=[],content = ""){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArgs);
        ConfirmManager.ShowConfirm(type, msgID, msgArgs, content);
    },
    OnConFirm:function(clickType, msgID, cbArgs){
        if('Sure' != clickType){
            return;
        }
        if ('MSG_DEL_PROMOTER' == msgID) {
            let clubId = cbArgs[0];
            let pid = cbArgs[1];
            let sendPack = {};
            sendPack.clubId = clubId;
            sendPack.pid = pid;
            let self = this;
            app.NetManager().SendPack("club.CClubPromotionDelete",sendPack, function(serverPack){
                self.curPage = 1;
                self.GetClubPromoter(true);
                app.SysNotifyManager().ShowSysMsg("成功移除",[],3);
            }, function(){

            });
        }
    },
});