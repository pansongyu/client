var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        // imgRank:[cc.SpriteFrame],
        chazhaoEditBox:cc.EditBox,
        chazhaoEditBoxJingJi:cc.EditBox,
        imgHideOrShow:[cc.SpriteFrame],
        img_wxnc:cc.Node,
    },
    onLoad:function(){
        this.ComTool=app.ComTool();
        this.wechatName = true;
    	this.liansaiRankScrollView = this.node.getChildByName("liansaiNode").getChildByName("rankScrollView");
        this.liansaiRankScrollView.getComponent(cc.ScrollView).node.on('scroll-to-bottom',this.GetLianSaiNextPage,this);
        this.jingjiRankScrollView = this.node.getChildByName("jingjiNode").getChildByName("rankScrollView");
        this.jingjiRankScrollView.getComponent(cc.ScrollView).node.on('scroll-to-bottom',this.GetJingJiNextPage,this);
    },
    InitData:function (clubId, unionId, unionPostType, zhongZhiShowStatus) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        let sendPack = {};
        let sendPackName = "club.CClubGetCompetitionTime";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){   
            self.competitionTimeList = serverPack;
            self.curType = self.competitionTimeList[0].type;
            self.UpdateStatusAndTime(self.competitionTimeList[0]);
        }, function(){

        });
        this.chazhaoEditBox.string = "";
        this.chazhaoEditBoxJingJi.string = "";
        this.curPage = 1;
        this.curPageJingJi = 1;
        let btn_default = this.node.getChildByName("btn_jingji");
        this.OnClick(btn_default.name,btn_default);
        let toptitleJingJi = this.node.getChildByName("jingjiNode").getChildByName("topTitle");
        toptitleJingJi.getChildByName("lb_4").getChildByName("btn_help_1").getChildByName("img_kuang02").active = false;
        toptitleJingJi.getChildByName("lbJingJi_5").getChildByName("btn_help_2").getChildByName("img_kuang02").active = false;
        this.node.getChildByName("img_sjdi").active = false;
    },
    UpdateStatusAndTime:function(competitionTime){
        if (competitionTime.status == 0) {
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").getComponent(cc.Label).string = "已结束";
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").color = new cc.Color(226, 28, 61);
        }else{
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").getComponent(cc.Label).string = "进行中";
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").color = new cc.Color(11, 230, 42);
        }
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
    ClickTopBtn:function(clickName){
    	let topBtnNode = this.node.getChildByName("topBtnNode");
        let allTopBtn = [];
        for (let i = 0; i < topBtnNode.children.length; i++) {
            allTopBtn.push(topBtnNode.children[i]);
        }
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
    },
    GetLianSaiNextPage:function(){
    	this.curPage++;
    	let sendPack = {};
    	sendPack.unionId = this.unionId;
        sendPack.type = this.curType;
        sendPack.pageNum = this.curPage;
        sendPack.query = this.chazhaoEditBox.string;
        let sendPackName = "Union.CUnionMemberRanked";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            if (serverPack.unionMemberItemList.length == 0) {
                self.curPage--;
            }
            self.UpdateScrollView(serverPack.unionMemberItemList, false);
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },
    UpdateScrollView:function(serverPack, isRefresh){
        if (!isRefresh) {
            //跟之前的数组合并
            let newList = this.serverPack.concat(serverPack);
            this.serverPack = newList;
        }else{
            this.serverPack = serverPack;
        }
    	let content = this.liansaiRankScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		this.liansaiRankScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
        let demo = this.node.getChildByName("liansaiNode").getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.length; i++) {
            let matchItem = serverPack[i];
    		let child = cc.instantiate(demo);
            child.zIndex=10+i; //普通数据放后面
    		if (i%2 == 0) {
    			child.getComponent(cc.Sprite).enabled = true;
    		}else{
    			child.getComponent(cc.Sprite).enabled = false;
    		}
            child.getChildByName("img_rank").active = true;
            child.getChildByName("lb_rank").active = true;
            child.getChildByName("lb_rank").getComponent(cc.Label).string = matchItem.id;
            // if (i >= 3) {
            //     child.getChildByName("img_rank").active = false;
            //     child.getChildByName("lb_rank").active = true;
            //     child.getChildByName("lb_rank").getComponent(cc.Label).string = i + 1;
            // }else{
            //     child.getChildByName("img_rank").getComponent(cc.Sprite).spriteFrame = this.imgRank[i];
            //     child.getChildByName("img_rank").active = true;
            //     child.getChildByName("lb_rank").active = false;
            //     child.getChildByName("lb_rank").getComponent(cc.Label).string = "";
            // }
            child.getChildByName("lb_clubName").getComponent(cc.Label).string =matchItem.clubName;
            child.getChildByName("lb_clubId").getComponent(cc.Label).string = matchItem.clubSign;
            // child.getChildByName("lb_bigWinner").getComponent(cc.Label).string = matchItem.bigWinner;
            child.getChildByName("lb_promotionShareValue").getComponent(cc.Label).string = matchItem.promotionShareValue;
            child.getChildByName("lb_unionAllMemberPointTotal").getComponent(cc.Label).string = matchItem.unionAllMemberPointTotal;
            child.getChildByName("lb_zhongZhiTotalPoint").getComponent(cc.Label).string = matchItem.zhongZhiTotalPoint;
            child.getChildByName("lb_consumeValue").getComponent(cc.Label).string = matchItem.consumeValue;
    		child.active = true;
    		content.addChild(child);
    	}
        content.sortAllChildren();
    },
    OrderBY:function(key){
        let orderfield="";
        if(key==3){
            orderfield="clubSign";//亲友圈账号
        }else if(key==7){
            orderfield="consumeValue";//有效耗钻
        }
        else if(key==4){
            orderfield="promotionShareValue";//活跃积分
        }
        else if(key==5){
            orderfield="unionAllMemberPointTotal";//成员总积分
        }
        else if(key==6){
            orderfield="zhongZhiTotalPoint";//最终积分
        }
        if(key==this.orderType){
            if(this.orderUpDown==1){
                this.orderUpDown=2;
            }else{
                this.orderUpDown=1;
            }
        }
        this.orderfield=orderfield;
        let self=this;
        this.serverPack.sort(function(a, b){
            if(self.orderUpDown==1){
                return b[self.orderfield]-a[self.orderfield];
            }else{
                return a[self.orderfield]-b[self.orderfield];
            }
        });
        this.UpdateScrollView(this.serverPack,true);
        let content = this.liansaiRankScrollView.getChildByName("view").getChildByName("content");
        content.sortAllChildren();
        this.orderType=key;
        this.InitOrderTip();
    },

    InitOrderTip:function(){
        let toptitle=this.node.getChildByName("liansaiNode").getChildByName("topTitle");
        for(let i=3;i<=7;i++){
            toptitle.getChildByName("lb_"+i).getChildByName("orderdown").active=true;
            toptitle.getChildByName("lb_"+i).getChildByName("orderup").active=true;
        }
        if(this.orderType){
            if(this.orderUpDown==1){
                //降序
                toptitle.getChildByName("lb_"+this.orderType).getChildByName("orderup").active=false;
            }else{
                //升序
                toptitle.getChildByName("lb_"+this.orderType).getChildByName("orderdown").active=false;
            }
        }
    },
    getDay:function(day){
        var today = new Date();
        var targetday_milliseconds=today.getTime() - 1000*60*60*24*day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tMonth+"月"+tDate+"日";
    },
    doHandleMonth:function(month){
        return month;
    },
    SortByTag:function(a,b){
        if(this.orderUpDown==1){
            return b[this.orderfield]-a[this.orderfield];
        }else{
            return a[this.orderfield]-b[this.orderfield];
        }
        
    },
    GetUnionMemberRankedList:function(isRefresh) {
        this.orderType=0;  //默认不排序
        this.orderUpDown=2;  //1:降序，2:升序
        this.InitOrderTip();
        let sendPack = {};
        sendPack = {};
        // sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.type = this.curType;
        sendPack.pageNum = this.curPage;
        sendPack.query = this.chazhaoEditBox.string;
        let sendPackName = "Union.CUnionMemberRanked";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            self.UpdateScrollView(serverPack.unionMemberItemList,isRefresh);
        }, function(){

        });
        this.GetUnionCountRankedInfoByZhongZhi();
    },
    GetUnionCountRankedInfoByZhongZhi:function(){
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.type = this.curType;
        let sendPackName = "union.CUnionMemberRankedSumInfo";
        let self = this;
        let bottomNode = this.node.getChildByName("liansaiNode").getChildByName("buttomNode");
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){   
            bottomNode.getChildByName("lb_1").getComponent(cc.Label).string="联赛活跃积分："+serverPack.scorePointSum;
            bottomNode.getChildByName("lb_2").getComponent(cc.Label).string="房卡消耗："+serverPack.consumeValueSum;
            bottomNode.getChildByName("lb_3").getComponent(cc.Label).string="成员积分总和："+serverPack.unionAllMemberPointTotalSum;
            bottomNode.getChildByName("lb_4").getComponent(cc.Label).string="最终积分总和："+serverPack.zhongZhiTotalPointSum;
        }, function(){

        });
    },

    //竞技榜单
    GetJingJiNextPage:function(){
        this.curPageJingJi++;
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.type = this.curType;
        sendPack.pageNum = this.curPageJingJi;
        if (this.wechatName) {
            sendPack.query = this.chazhaoEditBoxJingJi.string;
        }else{
            sendPack.query = app.ComTool().GetBeiZhuID(this.chazhaoEditBoxJingJi.string);
        }
        let sendPackName = "club.CClubCompetitionRanked";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            if (serverPack.clubPromotionLevelItemList.length == 0) {
                self.curPageJingJi--;
            }
            //跟之前的数组合并
            let newClubPromotionLevelItemList = self.JingJiServerPack.clubPromotionLevelItemList.concat(serverPack.clubPromotionLevelItemList);
            self.JingJiServerPack.clubPromotionLevelItemList = newClubPromotionLevelItemList;
            self.UpdateScrollViewJingJi(serverPack.clubPromotionLevelItemList,serverPack.totalPointShowStatus, false);
            let img_xiadi = self.node.getChildByName("jingjiNode").getChildByName("img_xiadi");
            img_xiadi.getChildByName("lb_huoyuezonghe").getComponent(cc.Label).string = "竞技赛活跃积分和："+serverPack.scorePointTotal;
            img_xiadi.getChildByName("btn_showjifen").getChildByName("img_xianshi").getComponent(cc.Sprite).spriteFrame = self.imgHideOrShow[serverPack.totalPointShowStatus];
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },

    UpdateScrollViewJingJi:function(serverPack,totalPointShowStatus, isRefresh){
        let content = this.jingjiRankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.jingjiRankScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        let demo = this.node.getChildByName("jingjiNode").getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            let matchItem = serverPack[i];
            let child = cc.instantiate(demo);
            child.zIndex=10+i; //普通数据放后面
            if (i%2 == 0) {
                child.getComponent(cc.Sprite).enabled = true;
            }else{
                child.getComponent(cc.Sprite).enabled = false;
            }
            child.getChildByName("img_rank").active = true;
            child.getChildByName("lb_rank").active = true;
            child.getChildByName("lb_rank").getComponent(cc.Label).string = matchItem.id;
            // if (i >= 3) {
            //     child.getChildByName("img_rank").active = false;
            //     child.getChildByName("lb_rank").active = true;
            //     child.getChildByName("lb_rank").getComponent(cc.Label).string = i + 1;
            // }else{
            //     child.getChildByName("img_rank").getComponent(cc.Sprite).spriteFrame = this.imgRank[i];
            //     child.getChildByName("img_rank").active = true;
            //     child.getChildByName("lb_rank").active = false;
            //     child.getChildByName("lb_rank").getComponent(cc.Label).string = "";
            // }
            let headImageUrl = matchItem.iconUrl;
            if(headImageUrl){
                app.WeChatManager().InitHeroHeadImage(matchItem.pid, headImageUrl);
                let WeChatHeadImage = child.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(matchItem.pid,headImageUrl);
            }
            child.wechatName = matchItem.name;
            child.playerInfo = matchItem;
            child.beizhu = app.ComTool().GetBeiZhuName(matchItem.pid,matchItem.name);
            if (this.wechatName) {
                child.getChildByName("lb_name").getComponent(cc.Label).string =matchItem.name;
            }else{
                child.getChildByName("lb_name").getComponent(cc.Label).string =child.beizhu;
            }
            child.getChildByName("lb_pid").getComponent(cc.Label).string = matchItem.pid;
            child.getChildByName("lb_scorePoint").getComponent(cc.Label).string = matchItem.scorePoint;
            let totalPointStr = "(*)";
            if (totalPointShowStatus == 1) {
                totalPointStr = "("+matchItem.totalPoint+")";
            }
            child.getChildByName("lb_playerTotalPoint").getComponent(cc.Label).string = matchItem.playerTotalPoint+totalPointStr;
            child.active = true;
            content.addChild(child);
        }
        content.sortAllChildren();
    },

    GetClubPromotionLevelItemList:function(isRefresh) {
        this.orderTypeJingJi=0;  //默认不排序
        this.orderUpDownJingJi=2;  //1:降序，2:升序
        this.InitOrderTipJingJi();
        let sendPack = {};
        sendPack = {};
        sendPack.clubId = this.clubId;
        // sendPack.unionId = this.unionId;
        sendPack.type = this.curType;
        sendPack.pageNum = this.curPageJingJi;
        if (this.wechatName) {
            sendPack.query = this.chazhaoEditBoxJingJi.string;
        }else{
            sendPack.query = app.ComTool().GetBeiZhuID(this.chazhaoEditBoxJingJi.string);
        }
        
        let sendPackName = "club.CClubCompetitionRanked";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            self.JingJiServerPack = serverPack;
            self.UpdateScrollViewJingJi(serverPack.clubPromotionLevelItemList,serverPack.totalPointShowStatus,isRefresh);
            let img_xiadi = self.node.getChildByName("jingjiNode").getChildByName("img_xiadi");
            img_xiadi.getChildByName("lb_huoyuezonghe").getComponent(cc.Label).string = "竞技赛活跃积分和："+serverPack.scorePointTotal;
            img_xiadi.getChildByName("btn_showjifen").getChildByName("img_xianshi").getComponent(cc.Sprite).spriteFrame = self.imgHideOrShow[serverPack.totalPointShowStatus];
        }, function(){

        });
    },
    InitOrderTipJingJi:function(){
        let toptitle=this.node.getChildByName("jingjiNode").getChildByName("topTitle");
        for(let i=5;i<=5;i++){
            toptitle.getChildByName("lbJingJi_"+i).getChildByName("orderdown").active=true;
            toptitle.getChildByName("lbJingJi_"+i).getChildByName("orderup").active=true;
        }
        if(this.orderTypeJingJi){
            if(this.orderUpDownJingJi==1){
                //降序
                toptitle.getChildByName("lbJingJi_"+this.orderTypeJingJi).getChildByName("orderup").active=false;
            }else{
                //升序
                toptitle.getChildByName("lbJingJi_"+this.orderTypeJingJi).getChildByName("orderdown").active=false;
            }
        }
    },

    OrderBYJingJi:function(key){
        let orderfield="";
        if(key==5){
            orderfield="playerTotalPoint";//成员积分
        }
        if(key==this.orderTypeJingJi){
            if(this.orderUpDownJingJi==1){
                this.orderUpDownJingJi=2;
            }else{
                this.orderUpDownJingJi=1;
            }
        }
        this.orderfield=orderfield;
        let self=this;
        this.JingJiServerPack.clubPromotionLevelItemList.sort(function(a, b){
            if(self.orderUpDownJingJi==1){
                return b[self.orderfield]-a[self.orderfield];
            }else{
                return a[self.orderfield]-b[self.orderfield];
            }
        });
        this.UpdateScrollViewJingJi(this.JingJiServerPack.clubPromotionLevelItemList,this.JingJiServerPack.totalPointShowStatus,true);
        let content = this.jingjiRankScrollView.getChildByName("view").getChildByName("content");
        content.sortAllChildren();
        this.orderTypeJingJi=key;
        this.InitOrderTipJingJi();
    },
    SwitchWechatName:function(){
        let content = this.jingjiRankScrollView.getChildByName("view").getChildByName("content");
        for (let i = 0; i < content.children.length; i++) {
            if (this.wechatName) {
                content.children[i].getChildByName("lb_name").getComponent(cc.Label).string =content.children[i].wechatName;
            }else{
                content.children[i].getChildByName("lb_name").getComponent(cc.Label).string =content.children[i].beizhu;
            }
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
        if('btn_liansai'==btnName){
            let toptitleJingJi = this.node.getChildByName("jingjiNode").getChildByName("topTitle");
            toptitleJingJi.getChildByName("lb_4").getChildByName("btn_help_1").getChildByName("img_kuang02").active = false;
            toptitleJingJi.getChildByName("lbJingJi_5").getChildByName("btn_help_2").getChildByName("img_kuang02").active = false;
            this.node.getChildByName("liansaiNode").active = true;
            this.node.getChildByName("btn_liansai").getChildByName("img_jt").active = true;
            this.node.getChildByName("jingjiNode").active = false;
            this.node.getChildByName("btn_jingji").getChildByName("img_jt").active = false;
            this.GetUnionMemberRankedList(true);
            this.isSelectLianSai = true;
        }else if('btn_jingji'==btnName){
            this.node.getChildByName("liansaiNode").active = false;
            this.node.getChildByName("btn_liansai").getChildByName("img_jt").active = false;
            this.node.getChildByName("jingjiNode").active = true;
            this.node.getChildByName("btn_jingji").getChildByName("img_jt").active = true;
            this.GetClubPromotionLevelItemList(true);
            this.isSelectLianSai = false;
        }else if('img_rqdi'==btnName){
            this.node.getChildByName("img_sjdi").active = !this.node.getChildByName("img_sjdi").active;
        }else if ("btn_timeDemo" == btnName) {
            this.curType = btnNode.competitionTime.type;
            this.curPage = 1;
            if (this.isSelectLianSai) {
                this.GetUnionMemberRankedList(true);
            }else{
                this.GetClubPromotionLevelItemList(true);
            }
            this.UpdateStatusAndTime(btnNode.competitionTime);
            this.node.getChildByName("img_sjdi").active = false;
        }else if ("btn_search" == btnName) {
            this.curPage = 1;
            this.GetUnionMemberRankedList(true);
        }else if ("btn_searchjingji" == btnName) {
            this.curPage = 1;
            this.GetClubPromotionLevelItemList(true);
        }else if ("btn_showjifen" == btnName) {
            let type = this.JingJiServerPack.totalPointShowStatus;
            let sendPack = {};
            sendPack.clubId = this.clubId;
            if (type == 0) {
                sendPack.type = 1;
            }else{
                sendPack.type = 0;
            }
            let sendPackName = "club.CClubChangeTotalPointShowStatus";
            let self = this;
            app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
                self.curPage = 1;
                self.GetClubPromotionLevelItemList(true);
            }, function(){

            });
        }else if ("img_qmp" == btnName) {
            if (this.wechatName) {
                this.wechatName = false;
                this.img_wxnc.x = -36;
                this.img_wxnc.getChildByName("lb_2_3").getComponent(cc.Label).string = "群名片";
            }else{
                this.wechatName = true;
                this.img_wxnc.x = 36;
                this.img_wxnc.getChildByName("lb_2_3").getComponent(cc.Label).string = "微信昵称";
            }
            this.SwitchWechatName();
        }else if ("btn_help_1" == btnName) {
            btnNode.getChildByName("img_kuang02").active = !btnNode.getChildByName("img_kuang02").active;
        }else if ("btn_help_2" == btnName) {
            btnNode.getChildByName("img_kuang02").active = !btnNode.getChildByName("img_kuang02").active;
        }else if ("btn_detailJingJi" == btnName) {
            let playerInfo = btnNode.parent.playerInfo;
            app.FormManager().ShowForm('ui/club_2/UIPlayerRaceRankInfo',this.clubId,playerInfo.pid,this.curType);
        }else if(btnName.startsWith("lb_")){
            //排序
            let key=parseInt(btnName.replace("lb_",''));
            this.OrderBY(key);
        }else if(btnName.startsWith("lbJingJi_")){
            //排序
            let key=parseInt(btnName.replace("lbJingJi_",''));
            this.OrderBYJingJi(key);
        }
    },
});