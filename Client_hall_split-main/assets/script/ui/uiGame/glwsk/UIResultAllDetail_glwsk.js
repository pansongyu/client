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

        icon_winLost: [cc.SpriteFrame],
        playersNode: cc.Node,
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
    InitShowPlayerInfo: function() {
        this.playerNameList = [];
        let maxPoint = 0;
        for (let i = 0; i < this.resultsList.length; i++) {
            if (maxPoint < this.resultsList[i].point) {
                maxPoint = this.resultsList[i].point;
            }
        }
        //隐藏节点
        for (let i = 0; i < this.playersNode.children.length; i++) {
            this.playersNode.children[i].active = false;
        }

        for (let i = 0; i < this.resultsList.length; i++) {
            let PlayerNode = this.playersNode.children[i];
            let playerinfo =this.playerAll[i];
            let playRecord = this.resultsList[i];

            //显示头像
            let heroID = playerinfo["pid"];
            let headImageUrl = playerinfo["headImageUrl"];
            if (heroID && headImageUrl) {
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
            }
            this.playerNameList.push(playerinfo["name"]);
            //显示玩家姓名
            PlayerNode.getChildByName("userInfo").getChildByName('lb_name').getComponent(cc.Label).string = playerinfo["name"].substring(0,5) + "...";
            PlayerNode.getChildByName("userInfo").getChildByName('lb_ID').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(heroID);
            let WeChatHeadImage = PlayerNode.getChildByName("userInfo").getChildByName('head').getComponent("WeChatHeadImage");
            WeChatHeadImage.onLoad();
            WeChatHeadImage.ShowHeroHead(heroID);
            if (this.isOwer == heroID) {
                PlayerNode.getChildByName("userInfo").getChildByName("icon_fz").active = true;
            } else {
                PlayerNode.getChildByName("userInfo").getChildByName("icon_fz").active = false;
            }

            //分数
            let record = PlayerNode.getChildByName('record');
            //根据分组判断是否显示总积分
            record.getChildByName("paimianfen").getComponent(cc.Label).string = this.GetPointValues(playRecord.paiMianPoint);
            record.getChildByName("jiangfafen").getComponent(cc.Label).string = this.GetPointValues(playRecord.jiangFaPoint);
            record.getChildByName("jifen").getComponent(cc.Label).string = this.GetPointValues(playRecord.zongPoint);
            if(playRecord.point > 0){
                record.getChildByName("lb_winPoint").active = true;
                record.getChildByName("lb_lostPoint").active = false;
                record.getChildByName("lb_winPoint").getComponent(cc.Label).string = this.GetPointValues(playRecord.point);
                //胜负
                PlayerNode.getChildByName("userInfo").getChildByName('winlost').getComponent(cc.Sprite).spriteFrame = this.icon_winLost[0];
            }else{
                record.getChildByName("lb_winPoint").active = false;
                record.getChildByName("lb_lostPoint").active = true;
                record.getChildByName("lb_lostPoint").getComponent(cc.Label).string = this.GetPointValues(playRecord.point);
                //胜负
                PlayerNode.getChildByName("userInfo").getChildByName('winlost').getComponent(cc.Sprite).spriteFrame = this.icon_winLost[1];
                if(playRecord.point == 0){
                    //胜负
                    PlayerNode.getChildByName("userInfo").getChildByName('winlost').getComponent(cc.Sprite).spriteFrame = "";
                }
            }
            let tip6 = this.node.getChildByName("tipNode").getChildByName("tip6");
            if(typeof(playRecord.sportsPoint) != "undefined"){
                tip6.active = true;
                record.getChildByName("sportspoint").getComponent(cc.Label).string = this.GetPointValues(playRecord.sportsPoint);
            }else{
                tip6.active = false;
                record.getChildByName("sportspoint").getComponent(cc.Label).string = "";
            }
            // //显示大赢家
            // if (maxPoint <= record["point"]) {
            //  dataNode.getChildByName("dyj").active = true;
            // } else {
            //  dataNode.getChildByName("dyj").active = false;
            // }
            if (PlayerNode.getChildByName('icon_dissolve') != null) {
                //显示是否解散（-1:正常结束,0:未操作,1:同意操作,2:拒绝操作,3:发起者）
                if (typeof(playRecord.dissolveState) == "undefined" || playRecord.dissolveState == -1) {
                    PlayerNode.getChildByName('icon_dissolve').active = false;
                } else {
                    let imagePath = "texture/record/img_dissolve"+playRecord.dissolveState;
                    let that = this;
                    //加载图片精灵
                    cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                        if(error){
                            console.log("加载图片精灵失败  " + imagePath);
                            return
                        }
                        PlayerNode.getChildByName('icon_dissolve').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        PlayerNode.getChildByName('icon_dissolve').active=true;
                    });
                }
            }
            PlayerNode.active = true;
        }
    },
    GetPointValues:function(point){
        if(point > 0){
            return "+" + point;
        }
        return point;
    },
    //-----------回调函数------------------
   
    OnShow: function (basedata=false,playerlist=false,gameType="",unionId=0) {
        this.unionId = unionId;
        let smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
        let path = "ui/uiGame/" + smallName + "/UIResultAllDetail_" + smallName;
        this.FormManager.ShowForm('UITop', path);
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
     //    if(setID==100){
     //    	this.jushu.getComponent(cc.Label).string ="共1考";
     //    }else{
     //    	this.jushu.getComponent(cc.Label).string = app.i18n.t("UIWanFa_setCount", {"setCount": setID});
    	// }
        //不显示局数
        this.jushu.active = false;
        this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);

        this.InitShowPlayerInfo();
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
