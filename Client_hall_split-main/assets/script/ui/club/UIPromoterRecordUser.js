/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        recordlist_scrollView:cc.ScrollView,
        recordlist_layout:cc.Node,
        recordlist_room_demo:cc.Node,
        top:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        this.NetManager=app.NetManager();
        this.WeChatManager=app.WeChatManager();
        this.pageEditBox = this.node.getChildByName("pageGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
    },

    //---------显示函数--------------------

    OnShow:function(clubId,playerPid,partnerPid){
        this.clubId=clubId;
        this.partnerPid = partnerPid;
        this.page = 1;
        this.pageNumTotal = 1;
        this.recordlist_room_demo.active=false;
        this.playerPid = playerPid;
        this.pageEditBox.string = "";
        this.GetPersonalRecord();
        this.InitTop();
    },
    InitTop:function(playerData){
        let self = this;
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.partnerPid = this.partnerPid;
        sendPack.pid = this.playerPid;
        app.NetManager().SendPack("club.CClubPromotionPersonalCount", sendPack,function(playerData){
            self.pageNumTotal = playerData['pageNumTotal'];
            self.node.getChildByName("page").getChildByName("lb_page").getComponent(cc.Label).string = self.page.toString()+"/"+self.pageNumTotal.toString();
            self.top.getChildByName('lb_cayu').getComponent(cc.Label).string="参与:"+playerData['size']+"场";
            self.top.getChildByName('lb_yingjia').getComponent(cc.Label).string="大赢家:"+playerData['winner']+"场";
            self.top.getChildByName('lb_fangka').getComponent(cc.Label).string="钻石:"+playerData.roomCardSize+"场/"+playerData.roomCard+"个";
            self.top.getChildByName('lb_point').getComponent(cc.Label).string=playerData.point;
            self.top.getChildByName('user').getChildByName('lb_name').getComponent(cc.Label).string=playerData['player'].name;
            self.top.getChildByName('user').getChildByName('lb_id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":app.ComTool().GetPid(playerData['player'].pid)});
            if(playerData['player'].iconUrl){
                self.WeChatManager.InitHeroHeadImage(playerData['player'].pid, playerData['player'].iconUrl);
                let WeChatHeadImage=self.top.getChildByName('user').getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.ShowHeroHead(playerData['player'].pid,playerData['player'].iconUrl);
            }
        },function(error){

        });
        
    },
    //---------点击函数---------------------
    GetPersonalRecord:function(){
        let that=this;
        this.recordlist_scrollView.scrollToTop();
        this.DestroyAllChildren(this.recordlist_layout);
        this.isQuanXuan=false;
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.partnerPid = this.partnerPid;
        sendPack.pid = this.playerPid;
        sendPack.pageNum = this.page;
        this.NetManager.SendPack("club.CClubPromotionPersonalRecord", sendPack,function(event){
            that.RecordList=event;
            that.ShowRecordList();
        },function(error){

        });
    },
    
    ShowRecordList:function(){
        this.node.getChildByName("page").getChildByName("lb_page").getComponent(cc.Label).string = this.page.toString()+"/"+this.pageNumTotal.toString();
        let recordInfos=this.RecordList;
        this.recordlist_scrollView.scrollToTop();
        //this.recordlist_layout.removeAllChildren();
        this.DestroyAllChildren(this.recordlist_layout);
        //this.top.getChildByName('lb_fangka').getComponent(cc.Label).string='总消耗房卡:'+roomCardTotalCount;
        for(let i=0;i<recordInfos.length;i++){
            let nodePrefab = cc.instantiate(this.recordlist_room_demo);
            nodePrefab.name="record"+i;
            
            nodePrefab.getChildByName('room_key').getComponent(cc.Label).string=recordInfos[i].roomKey;
            if (recordInfos[i].configName == "") {
                nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string=this.ShareDefine.GametTypeID2Name[recordInfos[i].gameType];
            }else{
                nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string=recordInfos[i].configName;
            }
            
            if (recordInfos[i].roomState == 1) {
                nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string="游戏中";
                nodePrefab.getChildByName('datetime').getComponent(cc.Label).string="";
            }else{
                nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string="";
                nodePrefab.getChildByName('datetime').getComponent(cc.Label).string=this.ComTool.GetDateYearMonthDayHourMinuteString(recordInfos[i].endTime);
            }

            if(recordInfos[i].roomCard>0){
                nodePrefab.getChildByName('icon_fk').active=true;
                nodePrefab.getChildByName('icon_qk').active=false;
                nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string='X'+recordInfos[i].roomCard;
            }else{
                nodePrefab.getChildByName('icon_fk').active=false;
                nodePrefab.getChildByName('icon_qk').active=false;
                nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string='X'+recordInfos[i].clubCard;
            }

            if (recordInfos[i].unionId > 0) {
                nodePrefab.getChildByName('icon_pl').active=true;
                nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string='X'+recordInfos[i].roomSportsConsume;
            }else{
                nodePrefab.getChildByName('icon_pl').active=false;
                nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string='';
            }

            nodePrefab.gameType=recordInfos[i].gameType;
            nodePrefab.roomID=recordInfos[i].roomID;
            nodePrefab.roomKey=recordInfos[i].roomKey;
            nodePrefab.playerList=JSON.parse(recordInfos[i].playerList);
            nodePrefab.datainfo=recordInfos[i];
            nodePrefab.active=true;
            this.recordlist_layout.addChild(nodePrefab);
            this.ShowUserList(nodePrefab.getChildByName('user_layout'),recordInfos[i].playerList);
            
        }

    },
    ShowUserList:function(layoutNode,playerList){
        playerList=JSON.parse(playerList);
        //layoutNode.removeAllChildren();
        this.DestroyAllChildren(layoutNode);
        let demoNode=layoutNode.parent.getChildByName('userDemo');
        let playerids=[];
        let heightTemp = 175;
        layoutNode.parent.height = 175 + parseInt((playerList.length-1)/4)*175;
        for(let i=0;i<playerList.length;i++){
            let node=cc.instantiate(demoNode);
            layoutNode.addChild(node);
            node.active=true;
            let player=playerList[i];
            node.getChildByName('lb_name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(player.pid,player.name);
            node.getChildByName('lb_id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(player.pid)});
            let bisai=false;
            if (typeof(player.sportsPoint)!="undefined") {
                bisai=true;
                if (player.sportsPoint > 0) {
                    node.getChildByName('lb_pl').getComponent(cc.Label).string ="赛:+" + player.sportsPoint;
                    node.getChildByName('lb_pl').color=cc.color(228,38,38);
                }else{
                    node.getChildByName('lb_pl').getComponent(cc.Label).string ="赛:" + player.sportsPoint;
                    node.getChildByName('lb_pl').color=cc.color(70,169,77);
                }
            }else{
                node.getChildByName('lb_pl').getComponent(cc.Label).string = "";
            }
            playerids.push(player.pid);
            if(player.point>0){
                if(bisai==true){
                    node.getChildByName('lb_code').getComponent(cc.Label).string='得分:+'+player.point;
                    node.getChildByName('lb_code').color=cc.color(168,95,54);

                    node.getChildByName('lb_code').getComponent(cc.Label).fontSize=24;
                    node.getChildByName('lb_name').y=7;
                    node.getChildByName('lb_id').y=-20;
                }else{
                    node.getChildByName('lb_code').getComponent(cc.Label).string='+'+player.point;
                    node.getChildByName('lb_code').color=cc.color(228,38,38);
                    node.getChildByName('lb_code').getComponent(cc.Label).fontSize=50;
                    node.getChildByName('lb_name').y=-5;
                    node.getChildByName('lb_id').y=-35;

                }
            }else{
               if(bisai==true){
                   node.getChildByName('lb_code').getComponent(cc.Label).string="得分:"+player.point;
                   node.getChildByName('lb_code').color=cc.color(168,95,54);
                   node.getChildByName('lb_code').getComponent(cc.Label).fontSize=24;
                   node.getChildByName('lb_name').y=7;
                   node.getChildByName('lb_id').y=-20;
                }else{
                   node.getChildByName('lb_code').getComponent(cc.Label).string=player.point;
                   node.getChildByName('lb_code').color=cc.color(70,169,77);
                   node.getChildByName('lb_code').getComponent(cc.Label).fontSize=50;
                   node.getChildByName('lb_name').y=-15;
                   node.getChildByName('lb_id').y=-45;

                }
            }
            if(player.iconUrl){
                this.WeChatManager.InitHeroHeadImage(player.pid, player.iconUrl);
                let WeChatHeadImage=node.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(player.pid,player.iconUrl);
            }
        }
    },
    
	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
            this.DestroyAllChildren(this.recordlist_layout);
        	this.CloseForm();
        }else if('btn_zhanji_next'==btnName){
            if(this.pageNumTotal<=this.page){
                return;
            }
            this.page=this.page+1;
            this.GetPersonalRecord();
        }else if('btn_zhanji_last'==btnName){
            if(this.page<=1){
                return;
            }
            this.page=this.page-1;
            this.GetPersonalRecord();
        }else if(btnName=="btn_record_info"){
            let gameType=btnNode.parent.gameType;
            let roomID=btnNode.parent.roomID;
            let roomKey=btnNode.parent.roomKey;
            let playerList=btnNode.parent.playerList;
            let datainfo=btnNode.parent.datainfo;
			if (this.ShareDefine.GameType_PYZHW == gameType) {
				let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
				let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
				this.FormManager.ShowForm(path,roomID,playerList, gameType);
				return;
			}
            if (this.ShareDefine.GameType_BP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_CDP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_CQCP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_GZMJ == gameType) {
				let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
				let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
				this.FormManager.ShowForm(path,roomID,playerList, gameType);
				return;
			}
            if (this.ShareDefine.GameType_DCTS == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_JDZTS == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_DD == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_JAWZ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_GYZJMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_GSMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_LPTS == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_GLWSK == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_ASMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_WXZMMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_CP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_JXYZ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_YCFXMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_PY == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_KLMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_QWWES == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_SGLK == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_SSE == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_XSDQ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_JYESSZ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType);
                return;
            }
            this.FormManager.ShowForm("UIRecordAllResult",roomID,playerList, gameType);
        }else if('btn_tz'==btnName){
            let goPageStr = this.pageEditBox.string;
            if (!app.ComTool().StrIsNumInt(goPageStr)) {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字的页数",[],3);
                return;
            }
            if (parseInt(goPageStr) > this.pageNumTotal) {
                app.SysNotifyManager().ShowSysMsg("输入的页数超出总页数",[],3);
                return;
            }
            this.page=parseInt(goPageStr);
            this.GetPersonalRecord();
        }
        else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
