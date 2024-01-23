"use strict";
cc._RF.push(module, 'd73dcGB9NRM/L+cHPanC08+', 'UIVideo_Child');
// script/ui/uiChild/UIVideo_Child.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        recordTimeLabel: cc.Label
    },

    //创建界面回掉
    OnCreateInit: function OnCreateInit() {
        this.ComTool = app.ComTool();
        this.RoomRecordManager = app.RoomRecordManager();
    },

    //显示
    OnShow: function OnShow() {
        var userData = this.GetFormProperty("UserData");
        this.SetRecordPlayerInfo(userData);
    },
    SetRecordPlayerInfo: function SetRecordPlayerInfo(userData) {
        var recordList = this.RoomRecordManager.GetRoomRecord(userData);
        this.recordTimeLabel.string = this.ComTool.GetDateYearMonthDayHourMinuteString(recordList["endSec"]);
        var fastCntList = recordList["fastCnt"];
        var playersList = recordList["players"];
        var pointList = recordList["point"];
        var count = playersList.length;
        for (var i = 0; i < count; i++) {
            var startPath = this.ComTool.StringAddNumSuffix("sp_info/nd_chengji", i + 1, 2);
            var namePath = [startPath, "lb_name"].join("/");
            var IDPath = [startPath, "lb_id"].join("/");
            var jiangLiPath = [startPath, "sp_shandian/sp_di/lb_name/lb_num"].join("/");
            var zhongFenPath = [startPath, "sp_zongfen/lb_zongfen"].join("/");
            var headPath = [startPath, "touxiang/btn_head"].join("/");
            var headPathWeChatImage = cc.find(headPath, this.node).getComponent("WeChatHeadImage");

            var player = playersList[i];
            var playerJiangLi = fastCntList[i];
            var playerZongFen = pointList[i];

            var playerName = player["name"];
            var playerID = player["pid"];

            headPathWeChatImage.ShowHeroHead(playerID);
            this.GetWndComponent(namePath, cc.Label).string = this.ComTool.GetBeiZhuName(playerID, playerName);
            this.GetWndComponent(IDPath, cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(playerID) });
            this.GetWndComponent(jiangLiPath, cc.Label).string = playerJiangLi;
            this.GetWndComponent(zhongFenPath, cc.Label).string = app.i18n.t("UIVideo_Child_ZongFen", { "ZongFen": playerZongFen });
        }
    },
    //-------------点击函数-------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_benji") {
            var roomID = this.GetFormProperty("UserData");
            this.GetParent().ShowRoomRecordDetail(roomID);
        } else {
            this.ErrLog("OnClick not find btnName:%s", btnName);
        }
    }

});

cc._RF.pop();