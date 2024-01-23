
var app = require("app");
cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        recordTimeLabel:cc.Label,
    },

    //创建界面回掉
    OnCreateInit:function(){
        this.ComTool = app.ComTool();
        this.RoomRecordManager = app.RoomRecordManager();
    },


    //显示
    OnShow:function(){
        let userData = this.GetFormProperty("UserData");
        this.SetRecordPlayerInfo(userData);

    },
    SetRecordPlayerInfo:function (userData) {
        let recordList = this.RoomRecordManager.GetRoomRecord(userData);
        this.recordTimeLabel.string = this.ComTool.GetDateYearMonthDayHourMinuteString(recordList["endSec"]);
        let fastCntList = recordList["fastCnt"];
        let playersList = recordList["players"];
        let pointList = recordList["point"];
        let count = playersList.length;
        for(let i = 0; i < count; i++){
            let startPath = this.ComTool.StringAddNumSuffix("sp_info/nd_chengji", i+1, 2);
            let namePath = [startPath, "lb_name"].join("/");
            let IDPath = [startPath, "lb_id"].join("/");
            let jiangLiPath = [startPath, "sp_shandian/sp_di/lb_name/lb_num"].join("/");
            let zhongFenPath = [startPath, "sp_zongfen/lb_zongfen"].join("/");
            let headPath = [startPath, "touxiang/btn_head"].join("/");
            let headPathWeChatImage =  cc.find(headPath, this.node).getComponent("WeChatHeadImage");

            let player = playersList[i];
            let playerJiangLi = fastCntList[i];
            let playerZongFen = pointList[i];

            let playerName = player["name"];
            let playerID = player["pid"];

            headPathWeChatImage.ShowHeroHead(playerID);
            this.GetWndComponent(namePath, cc.Label).string = this.ComTool.GetBeiZhuName(playerID,playerName);
            this.GetWndComponent(IDPath, cc.Label).string = app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(playerID)});
            this.GetWndComponent(jiangLiPath, cc.Label).string = playerJiangLi;
            this.GetWndComponent(zhongFenPath, cc.Label).string = app.i18n.t("UIVideo_Child_ZongFen", {"ZongFen":playerZongFen});

        }
    },
    //-------------点击函数-------------
    OnClick: function (btnName, btnNode) {
        if(btnName == "btn_benji"){
            let roomID = this.GetFormProperty("UserData");
            this.GetParent().ShowRoomRecordDetail(roomID);
        }
        else{
            this.ErrLog("OnClick not find btnName:%s", btnName);
        }
    },

});

