"use strict";
cc._RF.push(module, 'typdkf77-9e26-4e6c-963e-a986ed4e2dfc', 'pdk_UIAutoPlay');
// script/ui/pdk_UIAutoPlay.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        lb_notice: cc.Node
    },

    // use this for initialization
    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow() {
        var secTotal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var gameName = app.subGameName;
        if (gameName.indexOf("mj") > -1) {
            this.lb_notice.active = true;
        } else {
            this.lb_notice.active = false;
        }
        this.CheckCanCancelAuto(secTotal);
    },
    //获取房间限时
    GetRoomXianShiTime: function GetRoomXianShiTime() {
        var fangjianxianshi = app[app.subGameName.toUpperCase() + "Room"]().GetRoomConfigByProperty("fangjianxianshi");
        var roomXianShiObj = { 0: 1000000, 1: 8, 2: 10, 3: 12, 4: 15, 5: 20 };
        return roomXianShiObj[fangjianxianshi] * 60; //分钟转换秒数
    },
    //检测是否能点击取消
    CheckCanCancelAuto: function CheckCanCancelAuto(secTotal) {
        var roomXianShiTime = this.GetRoomXianShiTime();
        if (secTotal >= roomXianShiTime) {
            this.node.getChildByName("btn_cancel").active = false;
        } else {
            this.node.getChildByName("btn_cancel").active = true;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_cancel' == btnName) {
            app[app.subGameName + "_GameManager"]().CancelAutoPlay();
            this.CloseForm();
        }
    }
});

cc._RF.pop();