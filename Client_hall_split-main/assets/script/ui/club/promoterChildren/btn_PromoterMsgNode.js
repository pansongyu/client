var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
    	jiantouSprite:[cc.SpriteFrame],
    },
    onLoad:function(){
    	this.btn_msg_more = this.node.getChildByName("time").getChildByName("btn_msg_more");
    	this.btn_msg_all = this.node.getChildByName("time").getChildByName("btn_msg_all");
    	this.btn_msg_add = this.node.getChildByName("time").getChildByName("btn_msg_add");
    	this.btn_msg_del = this.node.getChildByName("time").getChildByName("btn_msg_del");
    	this.btn_msg_union = this.node.getChildByName("time").getChildByName("btn_msg_union");
        this.btn_msg_club = this.node.getChildByName("time").getChildByName("btn_msg_club");
        this.btn_msg_xiashu = this.node.getChildByName("time").getChildByName("btn_msg_xiashu");
        
        this.execPidEditBox = this.node.getChildByName("execPidEditBox").getComponent(cc.EditBox);
    	let messageScrollView = this.node.getChildByName("messageScrollView").getComponent(cc.ScrollView);
        messageScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);

        this.clubNameColor = "<color=#fa59bc>";
        this.nameColor = "<color=#67b619>";
        this.actionColor = "<color=#e94817>";
        this.valueColor = "<color=#e6910b>";
        //消息类型
        /**
         * 默认状态
         */
        this.UNION_EXEC_NOT = 0;
        /**
        * 设置为推广员
        */
        this.PROMOTION_DYNAMIC_SET = 1;
        /**
        * 上任了推广员
        */
        this.PROMOTION_DYNAMIC_APPOINT = 2;
        /**
        * 卸任了推广员
        */
        this.PROMOTION_DYNAMIC_LEAVE_OFFICE = 3;
        /**
        * 删除推广员
        */
        this.PROMOTION_DYNAMIC_DELETE = 4;

        /**
        * 推广员活跃度异常补偿
        */
        this.PROMOTION_DYNAMIC_ACTIVE_COMPENSATE = 5;
        /**
        * 推广员活跃度异常扣除
        */
        this.PROMOTION_DYNAMIC_ACTIVE_DEDUCT = 6;

        /**
        * 推广员从属发生改变
        */
        this.PROMOTION_DYNAMIC_CHANGE = 7;

        /**
        * 对局获得活跃度
        */
        this.PROMOTION_DYNAMIC_ACTIVE_GET = 8;

        /**
        * 推广员从属发生改变
        */
        this.PROMOTION_DYNAMIC_CHANGE_ALL = 9;

    },
    InitData:function (clubId, unionId, unionPostType, myisminister, myisPartner) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.myisPartner = myisPartner;
        this.curPage = 1;
        this.curDateType = 0;
        this.execPidEditBox.string = "";
        let btn_default = this.node.getChildByName("time").getChildByName("btn_msg_all");
        this.OnClick(btn_default.name,btn_default);
    },
    ShowBtn:function(){
        this.btn_msg_all.active = false;
        this.btn_msg_add.active = false;
        this.btn_msg_del.active = false;
        this.btn_msg_union.active = false;
        this.btn_msg_club.active = false;
        this.btn_msg_xiashu.active = false;
        let btnLable = this.btn_msg_more.getChildByName("label").getComponent(cc.Label);
        if (this.curDateType == 0) {
            btnLable.string = "全  部";
        }else if (this.curDateType == 1) {
            btnLable.string = "异常补偿";
        }else if (this.curDateType == 2) {
            btnLable.string = "异常扣除";
        }else if (this.curDateType == 3) {
            btnLable.string = "赛事房间";
        }else if (this.curDateType == 4) {
            btnLable.string = "亲友圈房间";
        }else if (this.curDateType == 5) {
            btnLable.string = "下属玩家变动";
        }
    },
    GetNextPage:function(){
    	this.curPage++;
    	this.SendPackByType(false);
    },
    UpdateScrollView:function(serverPack, isRefresh){
        this.ShowBtn();
    	let messageScrollView = this.node.getChildByName("messageScrollView");
    	let content = messageScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		messageScrollView.getComponent(cc.ScrollView).scrollToTop();
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
            child.getChildByName("lb_time").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayHourMinuteString(serverPack[i].execTime);
    		let lb_message = child.getChildByName("lb_message").getComponent(cc.RichText);
            let msgStr = "";
            let clubNameStr = "";
            if (typeof(serverPack[i].clubName)!="undefined" && typeof(serverPack[i].clubId)!="undefined") {
                clubNameStr = "亲友圈"+this.clubNameColor+serverPack[i].clubName+"["+serverPack[i].clubId+"]</c>";
            }
            let NameStr = "";
            if (typeof(serverPack[i].name)!="undefined" && typeof(serverPack[i].pid)!="undefined") {
                NameStr = "玩家"+this.nameColor+serverPack[i].name+"["+serverPack[i].pid+"]</c>";
            }
            let ManageNameStr = "";
            if (typeof(serverPack[i].name)!="undefined" && typeof(serverPack[i].pid)!="undefined") {
                ManageNameStr = "裁判"+this.nameColor+serverPack[i].name+"["+serverPack[i].pid+"]</c>";
            }
            let execNameStr = "";
            if (typeof(serverPack[i].execName)!="undefined" && typeof(serverPack[i].execPid)!="undefined") {
                execNameStr = "玩家"+this.nameColor+serverPack[i].execName+"["+serverPack[i].execPid+"]</c>";
            }
            let curValueStr = "";
            if (typeof(serverPack[i].curValue) != "undefined") {
                curValueStr = "，当前活跃度为" + serverPack[i].curValue;
            }
            let preValueStr = "";
            if (typeof(serverPack[i].preValue) != "undefined") {
                preValueStr = "，修改前为" + serverPack[i].preValue;
            }
            switch(serverPack[i].execType){
                case this.PROMOTION_DYNAMIC_SET:
                    msgStr = NameStr+"被"+execNameStr+this.actionColor+"设置</c>为推广员";
                    break;
                case this.PROMOTION_DYNAMIC_APPOINT:
                    msgStr = NameStr+"被"+execNameStr+this.actionColor+"上任</c>了推广员";
                    break;
                case this.PROMOTION_DYNAMIC_LEAVE_OFFICE:
                    msgStr = NameStr+"被"+execNameStr+this.actionColor+"卸任</c>了推广员";
                    break;
                case this.PROMOTION_DYNAMIC_DELETE:
                    msgStr = NameStr+"被"+execNameStr+this.actionColor+"删除</c>了推广员";
                    break;
                case this.PROMOTION_DYNAMIC_ACTIVE_COMPENSATE:
                    msgStr = execNameStr+this.actionColor+"因系统异常，补偿了 </c>"+NameStr+" 活跃度"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.PROMOTION_DYNAMIC_ACTIVE_DEDUCT:
                    msgStr = execNameStr+this.actionColor+"因系统异常，扣除了 </c>"+NameStr+" 活跃度"+this.valueColor+serverPack[i].value+"</c>"+curValueStr;
                    break;
                case this.PROMOTION_DYNAMIC_CHANGE:
                    msgStr = NameStr+"被"+execNameStr+this.actionColor+"设置为</c>"+this.valueColor+serverPack[i].value+"</c>的下属玩家";
                    break;
                case this.PROMOTION_DYNAMIC_ACTIVE_GET:
                    msgStr = "通过下属"+NameStr+this.actionColor+"参与房间"+serverPack[i].roomKey+"对局获得"+this.valueColor+serverPack[i].value+"活跃度</c>"+curValueStr;
                    break;
                case this.PROMOTION_DYNAMIC_CHANGE_ALL:
                    msgStr = NameStr+"被"+execNameStr+this.actionColor+"设置为</c>"+this.valueColor+serverPack[i].value+"</c>的下属玩家";
                    break;
                default:
                    msgStr = "位置消息类型:"+serverPack[i].execType;
                    break;
            }
            lb_message.string = msgStr;
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
        if('btn_msg_more'==btnName){
            this.btn_msg_all.active = !this.btn_msg_all.active;
            this.btn_msg_add.active = !this.btn_msg_add.active;
            this.btn_msg_del.active = !this.btn_msg_del.active;
            if (this.unionId > 0) {
                this.btn_msg_union.active = !this.btn_msg_union.active;
            }else{
                this.btn_msg_union.active = false;
            }
            this.btn_msg_club.active = !this.btn_msg_club.active;
            this.btn_msg_xiashu.active = !this.btn_msg_xiashu.active;
            let img_jiantou = this.btn_msg_more.getChildByName("img_jiantou").getComponent(cc.Sprite);
            if (this.btn_msg_all.active) {
                img_jiantou.spriteFrame = this.jiantouSprite[1];
            }else{
                img_jiantou.spriteFrame = this.jiantouSprite[0];
            }
        }else if('btn_msg_all' == btnName){
            this.curDateType = 0;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_add' == btnName){
            this.curDateType = 1;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_del' == btnName){
            this.curDateType = 2;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_union' == btnName){
            this.curDateType = 3;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_club' == btnName){
            this.curDateType = 4;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_msg_xiashu' == btnName){
            this.curDateType = 5;
            this.curPage = 1;
            this.SendPackByType(true);
        }else if('btn_search' == btnName){
            this.curPage = 1;
            this.SendPackByType(true);
        }
    },
    SendPackByType:function(isRefresh){
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.type = this.curDateType;
        let execPidStr =app.ComTool().GetBeiZhuID(this.execPidEditBox.string);
        if (execPidStr == "") {
            execPidStr = "0";
        }
        if (isNaN(parseInt(execPidStr)) || !app.ComTool().StrIsNumInt(execPidStr)) {
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id",[],3);
            return;
        }
        let execPid = parseInt(execPidStr);
        sendPack.query = execPid;
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionDynamic",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){
            // app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },
});