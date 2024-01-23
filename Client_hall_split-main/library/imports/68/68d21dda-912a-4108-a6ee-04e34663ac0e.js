"use strict";
cc._RF.push(module, '68d213akSpBCKbuBONGY6wO', 'UIJoinMessage');
// script/ui/UIJoinMessage.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        LabelMessage: cc.RichText,
        BtnCancel: cc.Button,
        BtnSure: cc.Button
    },

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow() {
        var roomKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var userName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var paymentRoomCardType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (roomKey == false) {
            this.CloseForm();
        }
        this.roomkey = roomKey;
        var paymentName = '';
        if (paymentRoomCardType == 0) {
            paymentName = "房主支付";
        } else if (paymentRoomCardType == 1) {
            paymentName = "平分支付";
        } else if (paymentRoomCardType == 2) {
            paymentName = "大赢家支付";
        }
        this.LabelMessage.string = "<color=#5c813d>房间号：</c><color=#b56830>" + roomKey + "</c><color=#5c813d>\n</c><color=#b56830>" + userName + "</c><color=#5c813d>选择了</c><color=#b56830>" + paymentName + "</c><color=#5c813d>\n邀请您继续游戏！</c>";
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
            // app.GameManager().SendEnterRoom(this.roomkey);
            this.CloseForm();
        } else if (btnName == "btnCancel") {
            this.CloseForm();
        }
    }

});

cc._RF.pop();