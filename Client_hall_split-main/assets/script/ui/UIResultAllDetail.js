var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        roomID:cc.Node,
        jushu:cc.Node,
        endTime:cc.Node,

        btn_close:cc.Node,
        btn_sharelink:cc.Node,

        btn_share:cc.Node,
        btn_ddshare:cc.Node,
        btn_xlshare:cc.Node,

        btn_sharemore:cc.Node,
        sharemore:cc.Node,

        btn_exit:cc.Node,

        btn_pingfenkaiju:cc.Node,
        btn_wolaikaiju:cc.Node,
        btn_dayingjiakaiju:cc.Node,

        mj_layout_player:cc.Node,
        poker_layout_player:cc.Node,
        poker_title_list:cc.Node,
        pxcn_title_list:cc.Node,
        zjqzsk_title_list: cc.Node,

        SpriteMale:cc.SpriteFrame,
        SpriteFeMale:cc.SpriteFrame,
    },

    OnCreateInit: function () {
        this.FormManager = app.FormManager();
        this.ComTool = app.ComTool();
        this.SDKManager = app.SDKManager();
        this.isZhanJi=false;
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.RegEvent("CodeError", this.Event_CodeError, this);
        this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
    },
    Event_CodeError:function(event){
        let codeInfo = event;
        if(codeInfo["Code"] == this.ShareDefine.NotFind_Room){
            app.SysNotifyManager().ShowSysMsg('DissolveRoom');
        }
    },
    LoadPrefabByGameType:function(){
        let prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_detail_child";
        let that = this;
        app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab)
            .then(function(prefab){
                if(!prefab){
                    that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
                    return;
                }
                that.InitPlayer(prefab);
            })
            .catch(function(error){
                that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
            }
        );
    },
    InitPlayer:function(prefab){
        //this.layout_player.removeAllChildren();
        this.DestroyAllChildren(this.layout_player);
        this.PlayerName = [];
        for(let i=0;i<this.resultsList.length;i++){
            if (this.resultsList[i].pid == 0) continue;
            this.PlayerName.push(this.playerAll[i].name);
            let addPlayer = cc.instantiate(prefab);
            this.nowChildName = addPlayer.name;
            addPlayer.name="player"+i;
            this.layout_player.addChild(addPlayer);
            addPlayer.getComponent(this.nowChildName).ShowPlayerData(this.resultsList, this.playerAll, i);
        }
    },
    //-----------回调函数------------------
   
    OnShow: function (basedata=false,playerlist=false,gameType="",unionId=0) {
        this.unionId = unionId;
        this.FormManager.ShowForm('UITop', "UIResultAllDetail");
        let Type = this.gametypeConfig[gameType]["Type"];
        this.gameType = app.ShareDefine().GametTypeID2PinYin[gameType];
	    this.node.getChildByName("bjpk_title_list").active = false;
        if (Type == 1) {
            this.layout_player_path = "mj_layout_player";
            this.mj_layout_player.active = true;
            this.poker_layout_player.active = false;
            this.layout_player = this.mj_layout_player;
            this.poker_title_list.active = false;
            this.pxcn_title_list.active = false;
            this.zjqzsk_title_list.active = false;
        }else{
            this.layout_player_path = "poker_layout_player";
            this.mj_layout_player.active = false;
            this.poker_layout_player.active = true;
            this.layout_player = this.poker_layout_player;
            this.poker_title_list.active = true;
	        this.pxcn_title_list.active = false;
            this.zjqzsk_title_list.active = false;
            if (this.unionId > 0) {
                this.poker_title_list.getChildByName("lb_sportsPoint").active = true;
            }else{
                this.poker_title_list.getChildByName("lb_sportsPoint").active = false;
            }
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_PXCN]) {
	            this.poker_title_list.active = false;
	            this.pxcn_title_list.active = true;
            }
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_ZJQZSK]) {
	            this.poker_title_list.active = false;
	            this.zjqzsk_title_list.active = true;
            }
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_BJPK] ||
	            this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_NN]) {
	            this.poker_title_list.active = false;
	            this.node.getChildByName("bjpk_title_list").active = true;
	            if (this.unionId > 0) {
		            this.node.getChildByName("bjpk_title_list").getChildByName("lb_sportsPoint").active = true;
	            }else{
		            this.node.getChildByName("bjpk_title_list").getChildByName("lb_sportsPoint").active = false;
	            }
            }
            //扑克用的麻将结算排版
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_SDH] || this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_CDP] ||
                this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_HNDZP]) {
                this.mj_layout_player.active = true;
                this.poker_layout_player.active = false;
                this.layout_player = this.mj_layout_player;
                this.poker_title_list.active = false;
            }
        }
    	this.PlayerName=[];
        let roomID=0;
        let time=0;
        let setID=0;
        this.playerAll=false;
        this.resultsList=false;
        this.nowChildName = "";

        roomID = basedata.key;
        this.ShareShortRoomID=roomID;
        this.ShareLongRoomID=basedata.roomId;
        this.resultsList=basedata.resultsList;
        time = basedata.endTime;
        setID = basedata.setId;
        this.playerAll=playerlist;

        //初始化分享
        this.sharemore.active=false;
        
        this.roomID.getComponent(cc.Label).string = "房间号:"+roomID;
        if(setID==100){
        	this.jushu.getComponent(cc.Label).string ="共1考";
        }else{
        	this.jushu.getComponent(cc.Label).string = app.i18n.t("UIWanFa_setCount", {"setCount": setID});
    	}
        this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);

        this.LoadPrefabByGameType();
    },
    //---------设置接口---------------

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName=="btn_share"){
            this.Click_btn_Share();
        }else if(btnName=="btn_ddshare"){
            this.Click_btn_DDShare();
        }else if(btnName=="btn_xlshare"){
            this.Click_btn_XLShare();
        }else if(btnName=="btn_mwshare"){
            this.Click_btn_MWShare();
        }else if(btnName=="btn_sharemore"){
            this.Click_btn_ShareMore();
        }else if(btnName=="btn_closeshare"){
            this.sharemore.active=false;
        }else if(btnName=="btn_sharelink"){
            this.Click_btn_Sharelink();
        }else if(btnName == "btn_exit"){
            app.SceneManager().LoadScene("mainScene");
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick not find btnName",btnName);
        }
    },
    Click_btn_Share:function(){
        this.sharemore.active=false;
        this.SDKManager.ShareScreen();
    },
    Click_btn_DDShare:function(){
        this.sharemore.active=false;
        this.SDKManager.ShareScreenDD();
    },
    Click_btn_XLShare:function(){
        this.sharemore.active=false;
        this.SDKManager.ShareScreenXL();
    },
    Click_btn_MWShare:function(){
        this.sharemore.active=false;
        this.SDKManager.ShareScreenMW();
    },
    Click_btn_ShareMore:function(){
        let active=this.sharemore.active;
        if(active==true){
            this.sharemore.active=false;
        }else{
            this.sharemore.active=true;
        }
        
    },
});
