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
        lb_page:cc.Label,
    },

    //初始化
    OnCreateInit:function(){
        this.NetManager=app.NetManager();
        this.WeChatManager=app.WeChatManager();
        this.pageEditBox = this.node.getChildByName("pageGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        this.roomEditBox = this.node.getChildByName("roomGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        // this.recordlist_scrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },

    //---------显示函数--------------------

    OnShow:function(clubId,unionId,clubName,unionPostType,myisminister){
        this.clubId=clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        if (this.unionId > 0) {
            this.node.getChildByName('lb_clubname').getComponent(cc.Label).string="";
            if (this.unionPostType == app.ClubManager().UNION_CREATE ||
                this.unionPostType == app.ClubManager().UNION_MANAGE ||
                this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
                this.node.getChildByName("clubToggle").active = true;
            }else{
                this.node.getChildByName("clubToggle").active = false;
            }
            this.node.getChildByName("recordToggle").active = true;
        }else{
            this.node.getChildByName('lb_clubname').getComponent(cc.Label).string="";
            this.node.getChildByName("clubToggle").active = false;
            this.node.getChildByName("recordToggle").active = true;
        }
        this.pageEditBox.string = "";
        this.roomEditBox.string = "";
        this.recordPage = 1;
        this.pageNumTotal = 1;
        this.lastRecordPage = 1;
        //刷新页数
        this.lb_page.getComponent(cc.Label).string = this.lastRecordPage+"/"+this.pageNumTotal;
        this.recordType = -1;
        this.recordlist_room_demo.active=false;
        this.toBttom=false;
        this.GetClubRecord(0,true); //0:今日  //1:昨天  //2:3天
        this.isQuanXuan=true;

        //预加载的item的数据
        this.data = [];
        //当前可视区域内部填充满需要的item数量
        this.rowItemCounts = 0;
        //创建的item节点的数组
        this.items = [];
        //顶部最大Y
        this.topMax = 0;
        //底部最小Y
        this.bottomMax = 0;
        //上一次listnode的Y坐标
        this.lastListY = 0;
        //itemprefab的高度
        this.itemHeight = 0;

        this.spacingY = 10;
    },
    GetNextPage:function(){
        if(this.toBttom==true){
            return;
        }
        this.toBttom=true;
        this.recordPage++;
        this.GetClubRecord(this.recordType, false);
    },
    //---------点击函数---------------------
    GetClubRecord:function(type,isRefresh=false){
        let sendPack = {"clubId":this.clubId, "getType":type};
        if (this.unionId > 0 && this.node.getChildByName("clubToggle").active
            && !this.node.getChildByName("clubToggle").getComponent(cc.Toggle).isChecked) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        if (isRefresh) {
            this.NetManager.SendPack("club.CClubTotalInfo", sendPack,function(event){
                that.ShowClubRecordTop(event);
            },function(error){

            });
        }
        this.recordType = type;
        let that=this;
        this.InitTop(type);
        this.isQuanXuan=true;
        sendPack.pageNum = this.recordPage;
        if (this.node.getChildByName("recordToggle").getComponent(cc.Toggle).isChecked) {
            //隐藏已查看战绩
            sendPack.type = 1;
        }else{
            sendPack.type = 0;
        }
        this.NetManager.SendPack("club.CClubGetRecord", sendPack,function(event){
            if (event.clubRecordInfos.length > 0) {
                that.ShowClubRecordList(event,isRefresh);
                //刷新页数
                that.lb_page.getComponent(cc.Label).string = that.recordPage+"/"+that.pageNumTotal;
            }else{
                that.recordPage = that.lastRecordPage;
            }
            that.toBttom=false;
        },function(error){
            
        });
    },
    //---------点击函数---------------------
    GetClubRecordRoom:function(type,roomStr,isRefresh=false){
        let sendPack = {"clubId":this.clubId, "getType":type};
        if (this.unionId > 0 && this.node.getChildByName("clubToggle").active
            && !this.node.getChildByName("clubToggle").getComponent(cc.Toggle).isChecked) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        if (isRefresh) {
            this.NetManager.SendPack("club.CClubTotalInfo", sendPack,function(event){
                that.ShowClubRecordTop(event);
            },function(error){

            });
        }
        this.recordType = type;
        let that=this;
        this.InitTop(type);
        this.isQuanXuan=true;
        sendPack.pageNum = 1;
        sendPack.type = 0;
        sendPack.query=roomStr;
        this.NetManager.SendPack("club.CClubGetRecord", sendPack,function(event){
            if (event.clubRecordInfos.length > 0) {
                that.ShowClubRecordList(event,isRefresh);
                //刷新页数
                that.lb_page.getComponent(cc.Label).string = "1/1";
            }else{
                that.recordPage = that.lastRecordPage;
            }
            that.toBttom=false;
        },function(error){
            
        });
    },
    InitTop:function(type){
        let node=this.top.getChildByName('btn_list');
        for(let i=0;i<node.children.length;i++){
            node.children[i].getChildByName('on').active=false;
            node.children[i].getChildByName('off').active=true;
        }
        if(type==6){
            node.getChildByName('btn_all').getChildByName('on').active=true;
            node.getChildByName('btn_all').getChildByName('off').active=false;
        }else if(type==1){
            node.getChildByName('btn_zuotian').getChildByName('on').active=true;
            node.getChildByName('btn_zuotian').getChildByName('off').active=false;
        }else if(type==0){
            node.getChildByName('btn_jintian').getChildByName('on').active=true;
            node.getChildByName('btn_jintian').getChildByName('off').active=false;
        }else if(type==3){
            node.getChildByName('btn_anren').getChildByName('on').active=true;
            node.getChildByName('btn_anren').getChildByName('off').active=false;
        }
    },
    ShowClubRecordTop:function(event){
        this.pageNumTotal = event.pageNumTotal;
        //刷新页数
        this.lb_page.getComponent(cc.Label).string = this.lastRecordPage+"/"+this.pageNumTotal;
        this.top.getChildByName('lb_fangka').getComponent(cc.Label).string='钻石:'+event.roomCardTotalCount+'个';
        this.top.getChildByName('lb_quanka').getComponent(cc.Label).string="";//'圈卡:'+event.clubCardTotalCount+"张";
        this.top.getChildByName('lb_jushu').getComponent(cc.Label).string='开房总次数:'+event.roomTotalCount;
    },
    ShowClubRecordList:function(data, isRefresh){
        if (isRefresh) {
            this.recordlist_scrollView.scrollToTop();
            //this.recordlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.recordlist_layout);
        }
        let clubRecordInfosAll=data.clubRecordInfos;//排名列表
        let count = clubRecordInfosAll.length;
        if (count == 0) return;
        let timer = setInterval(() => {
            if (count-- > 0) {
                let index =  clubRecordInfosAll.length - count - 1;
                //先判断下是否已经存在
                let isExist = false;
                for (let j = 0; j < this.recordlist_layout.children.length; j++) {
                    if (this.recordlist_layout.children[j].roomID == clubRecordInfosAll[index].roomID) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist){
                    this.AddChildToLayout(clubRecordInfosAll,index);
                }
            } else {
                clearInterval(timer);
            } 
        }, 0);
    },
    AddChildToLayout:function(clubRecordInfosAll, i){
        let nodePrefab = cc.instantiate(this.recordlist_room_demo);
        nodePrefab.name="record"+i;
        // nodePrefab.getChildByName('date').getComponent(cc.Label).string=this.ComTool.GetDateYearMonthDayHourMinuteString(clubRecordInfosAll[i].endTime);
        if (clubRecordInfosAll[i].roomState == 1) {
            nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string="游戏中";
            nodePrefab.getChildByName('date').getComponent(cc.Label).string="";
        }else{
            nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string="";
            nodePrefab.getChildByName('date').getComponent(cc.Label).string=this.ComTool.GetDateYearMonthDayHourMinuteString(clubRecordInfosAll[i].endTime);
        }
        if (typeof(clubRecordInfosAll[i].sportsDouble) == "undefined") {
            nodePrefab.getChildByName('lb_beishu').getComponent(cc.Label).string="";
        }else{
            nodePrefab.getChildByName('lb_beishu').getComponent(cc.Label).string=clubRecordInfosAll[i].sportsDouble+"倍";
        }
        nodePrefab.getChildByName('room_key').getComponent(cc.Label).string=clubRecordInfosAll[i].roomKey;
        if (clubRecordInfosAll[i].configName == "") {
            nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string=this.ShareDefine.GametTypeID2Name[clubRecordInfosAll[i].gameType];
        }else{
            nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string=clubRecordInfosAll[i].configName;
        }
        
        if(clubRecordInfosAll[i].valueType == 2){
            nodePrefab.getChildByName('icon_fk').active=true;
            nodePrefab.getChildByName('icon_qk').active=false;
            nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string='X'+clubRecordInfosAll[i].roomCard;
        }else if(clubRecordInfosAll[i].valueType == 3){
            nodePrefab.getChildByName('icon_fk').active=false;
            nodePrefab.getChildByName('icon_qk').active=false;//隐藏圈卡
            nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string="";//'X'+clubRecordInfosAll[i].clubCard;
        }else{
            nodePrefab.getChildByName('icon_fk').active=false;
            nodePrefab.getChildByName('icon_qk').active=false;
        }

        if (clubRecordInfosAll[i].unionId > 0) {
            nodePrefab.getChildByName('icon_pl').active=true;
            nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string='X'+clubRecordInfosAll[i].roomSportsConsume;
        }else{
            nodePrefab.getChildByName('icon_pl').active=false;
            nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string='';
        }
        //显示是否已查看状态
        if (clubRecordInfosAll[i].isViewed) {
            nodePrefab.getChildByName('isCheckToggle').getComponent(cc.Toggle).isChecked=true;
        }else{
            nodePrefab.getChildByName('isCheckToggle').getComponent(cc.Toggle).isChecked=false;
        }
        
        nodePrefab.gameType=clubRecordInfosAll[i].gameType;
        nodePrefab.roomID=clubRecordInfosAll[i].roomID;
        nodePrefab.unionId=clubRecordInfosAll[i].unionId;
        nodePrefab.roomKey=clubRecordInfosAll[i].roomKey;
        nodePrefab.playerList=JSON.parse(clubRecordInfosAll[i].playerList);
        nodePrefab.datainfo=clubRecordInfosAll[i];
        nodePrefab.getChildByName('toggle').roomID=clubRecordInfosAll[i].roomID;
        nodePrefab.active=true;
        this.recordlist_layout.addChild(nodePrefab);
        this.ShowUserList(nodePrefab.getChildByName('user_layout'),clubRecordInfosAll[i].playerList);
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
            if (!node) continue;
            layoutNode.addChild(node);
            node.active=true;
            let player=playerList[i];
            node.getChildByName('lb_name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(player.pid,player.name);
            node.getChildByName('lb_id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(player.pid)});
            playerids.push(player.pid);
            let bisai=false;
            if (layoutNode.parent.unionId > 0) {
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
            if(player.point>0){
                if(bisai==true){
                    if (typeof(player.clubName) == "undefined") {
                        node.getChildByName('lb_code').active = true;
                        node.getChildByName('lb_clubName').active = false;
                        node.getChildByName('lb_code').getComponent(cc.Label).string='得分:+'+player.point;
                        node.getChildByName('lb_code').color=cc.color(168,95,54);

                        node.getChildByName('lb_code').getComponent(cc.Label).fontSize=24;
                        node.getChildByName('lb_name').y=7;
                        node.getChildByName('lb_id').y=-20;
                    }else{
                        node.getChildByName('lb_code').active = false;
                        node.getChildByName('lb_clubName').active = true;
                        node.getChildByName("lb_clubName").getComponent(cc.Label).string='圈:'+player.clubName;
                    }
                }else{
                    node.getChildByName('lb_code').active = true;
                    node.getChildByName('lb_clubName').active = false;
                    node.getChildByName('lb_code').getComponent(cc.Label).string='+'+player.point;
                    node.getChildByName('lb_code').color=cc.color(228,38,38);
                    node.getChildByName('lb_code').getComponent(cc.Label).fontSize=50;
                    node.getChildByName('lb_name').y=-5;
                    node.getChildByName('lb_id').y=-35;

                }
            }else{
               if(bisai==true){
                    if (typeof(player.clubName) == "undefined") {
                        node.getChildByName('lb_code').active = true;
                        node.getChildByName('lb_clubName').active = false;
                        node.getChildByName('lb_code').getComponent(cc.Label).string="得分:"+player.point;
                        node.getChildByName('lb_code').color=cc.color(168,95,54);
                        node.getChildByName('lb_code').getComponent(cc.Label).fontSize=24;
                        node.getChildByName('lb_name').y=7;
                        node.getChildByName('lb_id').y=-20;
                    }else{
                        node.getChildByName('lb_code').active = false;
                        node.getChildByName('lb_clubName').active = true;
                        node.getChildByName("lb_clubName").getComponent(cc.Label).string='圈:'+player.clubName;
                    }
                }else{
                    node.getChildByName('lb_code').active = true;
                    node.getChildByName('lb_clubName').active = false;
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
                WeChatHeadImage.ShowHeroHead(player.pid,player.iconUrl);
            }
        }
        //layoutNode.parent.getChildByName('toggle').ids=playerids;
    },
    click_btn_quanxuan:function(){
        for(let i=0;i<this.recordlist_layout.children.length;i++){
            let node=this.recordlist_layout.children[i];
            if(this.isQuanXuan==true){
                node.getChildByName('toggle').getComponent(cc.Toggle).isChecked=false;
            }else{
                node.getChildByName('toggle').getComponent(cc.Toggle).isChecked=true;
            }
        }
        if(this.isQuanXuan==true){
            this.isQuanXuan=false;
        }else{
            this.isQuanXuan=true;
        }
    },
    click_btn_anren:function(){
        let roomIDS=[];
        // this.InitTop(3);
        for(let i=0;i<this.recordlist_layout.children.length;i++){
             let node=this.recordlist_layout.children[i];
             if(node.getChildByName('toggle').getComponent(cc.Toggle).isChecked==true){
                let roomID=node.getChildByName('toggle').roomID;
                roomIDS.push(roomID);
             }
        }
        if(this.isQuanXuan || roomIDS.length>0){
            let isShowAllClub = false;
            if (this.unionId > 0 && !this.node.getChildByName("clubToggle").getComponent(cc.Toggle).isChecked) {
                //显示所有亲友圈战绩
                isShowAllClub = true;
            }
            this.FormManager.ShowForm('ui/club/UIClubReport',this.clubId,roomIDS,this.isQuanXuan,this.recordType,isShowAllClub,this.unionId);
        }

    },
	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
            //this.recordlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.recordlist_layout);
        	this.CloseForm();
        }else if('btn_next'==btnName){
            this.lastRecordPage = this.recordPage;
            this.recordPage++;
            this.GetClubRecord(this.recordType, true);
        }
        else if('btn_last'==btnName){
            if(this.recordPage<=1){
                return;
            }
            this.lastRecordPage = this.recordPage;
            this.recordPage--;
            this.GetClubRecord(this.recordType, true);
        }else if('btn_all'==btnName){
            this.recordlist_scrollView.scrollToTop();
            this.DestroyAllChildren(this.recordlist_layout);
            this.recordPage = 1;
            this.GetClubRecord(6,true);
        }else if('btn_zuotian'==btnName){
            this.recordlist_scrollView.scrollToTop();
            this.DestroyAllChildren(this.recordlist_layout);
            this.recordPage = 1;
            this.GetClubRecord(1,true);
        }else if('btn_jintian'==btnName){
            this.recordlist_scrollView.scrollToTop();
            this.DestroyAllChildren(this.recordlist_layout);
            this.recordPage = 1;
            this.GetClubRecord(0,true);
        }else if('btn_anren'==btnName){
            this.recordlist_scrollView.scrollToTop();
            this.click_btn_anren();
        }else if('btn_quanxuan'==btnName){
            this.click_btn_quanxuan();
        }else if('btn_huizong'==btnName){
            let signString=app.HeroManager().GetHeroID()+'qinghuai'+app.ComTool().GetNowDateDayStr();
            let sign = app.MD5.hex_md5(signString);

            let clientConfig = app.Client.GetClientConfig();
            let url = "http://" + clientConfig["GameServerIP"] + "/index.php?module=Publics&action=Login&playerid="+app.HeroManager().GetHeroID()+"&key="+sign
            cc.sys.openURL(url);

        }else if(btnName=="btn_record_info"){
            let gameType=btnNode.parent.gameType;
            let roomID=btnNode.parent.roomID;
            let roomKey=btnNode.parent.roomKey;
            let playerList=btnNode.parent.playerList;
            let datainfo=btnNode.parent.datainfo;
            let unionId=btnNode.parent.unionId;
			if (this.ShareDefine.GameType_PYZHW == gameType) {
				let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
				let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
				this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
				return;
			}
            if (this.ShareDefine.GameType_BP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_CDP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_CQCP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
			if (this.ShareDefine.GameType_GZMJ == gameType) {
				let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
				let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
				this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
				return;
			}
            if (this.ShareDefine.GameType_DCTS == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JDZTS == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_DD == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JAWZ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_THBBZ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GYZJMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GSMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_LPSMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_LPTS == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GLWSK == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_WXZMMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_CP == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
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
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_PY == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_KLMJ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
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
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_SSE == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_XSDQ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JYESSZ == gameType) {
                let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                let path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path,roomID,playerList, gameType, unionId);
                return;
            }
            this.FormManager.ShowForm("UIRecordAllResult",roomID,playerList, gameType, unionId);
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
            this.recordPage=parseInt(goPageStr);
            this.GetClubRecord(this.recordType, true);
        }
        else if('btn_searchroom'==btnName){
            let roomStr = this.roomEditBox.string;
            if (roomStr<=0 || roomStr=="") {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字的房间号",[],3);
                return;
            }
            
            this.GetClubRecordRoom(this.recordType,roomStr, true);
        }
        else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
    OnClickClubToggle:function(event){
        this.recordPage = 1;
        this.GetClubRecord(this.recordType, true);
    },
    OnClickRecordToggle:function(event){
        this.recordPage = 1;
        this.GetClubRecord(this.recordType, true);
    },
    OnClickIsCheckToggle:function(event){
        let dataInfo = event.target.parent.parent.datainfo;
        if (typeof(dataInfo) == "undefined") {
            return;
        }
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.endTime = dataInfo.endTime;
        sendPack.roomID = dataInfo.roomID;
        if (event.target.parent.getComponent(cc.Toggle).isChecked) {
            sendPack.type = 1;
        }else{
            sendPack.type = 0;
        }
        this.NetManager.SendPack("club.CClubRoomIdOperation", sendPack,function(event){

        },function(error){
            
        });
    },
});
