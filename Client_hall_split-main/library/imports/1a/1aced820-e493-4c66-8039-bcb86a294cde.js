"use strict";
cc._RF.push(module, '1acedgg5JNMZoA5vLhqKUze', 'UIVideo_Child02');
// script/ui/uiChild/UIVideo_Child02.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        recordTimeLabel: cc.Label,
        recordIDLabel: cc.Label,

        juShuLabel: cc.Label,

        yinJiaNode1: cc.Node,
        yinJiaNode2: cc.Node,
        yinJiaNode3: cc.Node,
        yinJiaNode4: cc.Node
    },

    //创建界面回掉
    OnCreateInit: function OnCreateInit() {
        this.ComTool = app.ComTool();
        this.RoomRecordManager = app.RoomRecordManager();

        this.yinJiaNodeList = [this.yinJiaNode1, this.yinJiaNode2, this.yinJiaNode3, this.yinJiaNode4];
    },

    //显示
    OnShow: function OnShow() {
        var userData = this.GetFormProperty("UserData");

        this.yinJiaNode1.active = 0;
        this.yinJiaNode2.active = 0;
        this.yinJiaNode3.active = 0;
        this.yinJiaNode4.active = 0;

        this.SetRecordPlayerInfo(userData);
    },
    SetRecordPlayerInfo: function SetRecordPlayerInfo(userData) {
        var roomID = this.GetParent().GetRoomID();
        var allRecordList = this.RoomRecordManager.GetRoomRecordDetail(roomID);
        var recordList = allRecordList[userData];
        this.juShuLabel.string = recordList["setID"];
        this.recordTimeLabel.string = this.ComTool.GetDateYearMonthDayHourMinuteString(recordList["endSec"]);
        this.recordIDLabel.string = app.i18n.t("UIVideo_Child02_PaiJuID", { "PaiJuID": this.ComTool.GetPid(recordList["keyID"]) });
        var playersList = recordList["players"];
        var pointList = recordList["point"];
        var setPoint = recordList["setPoint"];
        var setPointMax = this.ComTool.ListMaxNum(setPoint);
        var count = playersList.length;

        for (var i = 0; i < count; i++) {
            var startPath = this.ComTool.StringAddNumSuffix("sp_info/nd_chengji", i + 1, 2);
            var namePath = [startPath, "lb_name"].join("/");
            var IDPath = [startPath, "lb_id"].join("/");
            var chengJiPath = [startPath, "lb_chengji"].join("/");
            var zhongFenPath = [startPath, "sp_zongfen/lb_zongfen"].join("/");
            var headPath = [startPath, "touxiang/btn_head"].join("/");
            var headPathWeChatImage = cc.find(headPath, this.node).getComponent("WeChatHeadImage");

            var player = playersList[i];

            var playerChengJi = 0;
            for (var j = 1; j <= userData; j++) {
                var _recordList = allRecordList[j];
                var _setPoint = _recordList["point"];
                playerChengJi += _setPoint[i];
            }

            var playerZongFen = pointList[i];

            if (playerChengJi == setPointMax) {
                this.yinJiaNodeList[i].active = 1;
            } else {
                this.yinJiaNodeList[i].active = 0;
            }

            var playerName = player["name"];
            var playerID = player["pid"];

            headPathWeChatImage.ShowHeroHead(playerID);
            this.GetWndComponent(namePath, cc.Label).string = this.ComTool.GetBeiZhuName(playerID, playerName);
            this.GetWndComponent(IDPath, cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(playerID) });
            this.GetWndComponent(chengJiPath, cc.Label).string = app.i18n.t("Integral", { "Integral": playerChengJi });
            this.GetWndComponent(zhongFenPath, cc.Label).string = app.i18n.t("UIVideo_Child_ZongFen", { "ZongFen": playerZongFen });
        }
    },
    //-------------点击函数-------------
    OnClick: function OnClick(btnName, btnNode) {

        if (btnName == "btn_benji") {
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        } else if (btnName == "btn_fenxiang") {
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        } else if (btnName == "btn_chakan") {
            this.ShowSysMsg("UIVideoChildSeeVideotape");
        } else {
            this.ErrLog("OnClick not find btnName:%s", btnName);
        }
    }

});

cc._RF.pop();