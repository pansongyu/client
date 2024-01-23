"use strict";
cc._RF.push(module, 'fjssz9a9-9ff7-412b-bb07-9f0d1ca36180', 'fjssz_UIMessageTip');
// script/ui/fjssz_UIMessageTip.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        lb_info: cc.Label

    },

    OnCreateInit: function OnCreateInit() {
        this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();
    },

    OnShow: function OnShow(msgID) {
        this.ShowLabelString(msgID);
    },
    ShowLabelString: function ShowLabelString(msgID) {
        var desc = this.SysNotifyManager.GetSysMsgContentByMsgID(msgID);
        var reg = /\/n/g;
        desc = desc.replace(reg, "\n");
        reg = /\/t/g;
        desc = desc.replace(reg, "\t");
        this.lb_info.string = desc;
    },

    GetMsgWndSize: function GetMsgWndSize() {
        return this.lb_info.node.getContentSize();
    },
    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {}

});

cc._RF.pop();