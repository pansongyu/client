"use strict";
cc._RF.push(module, '7ad84yfqFJCrrVu+pvVF5fw', 'pdk_UIMessageJoin');
// script/ui/pdk_UIMessageJoin.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("pdk_app");

cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        lb_message: cc.Label
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();
    },

    //---------显示函数--------------------

    OnShow: function OnShow(serverPack) {
        this.RoomKey = serverPack.roomKey;
        var name = serverPack.name;
        var type = serverPack.continueType;
        var typeName = "";
        if (type == 0) {
            typeName = "房主付";
        } else if (type == 1) {
            typeName = "平分";
        } else if (type == 2) {
            typeName = "大赢家";
        }
        this.lb_message.string = name + " 选择 " + typeName + " 续局，是否加入该房间？";
        this.GameServerIP = serverPack.gameTypeUrl.gameServerIP;
        this.GameServerPort = serverPack.gameTypeUrl.gameServerPort;
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
            var self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "EnterRoom", { "roomKey": this.RoomKey, "posID": -1 }, function (success) {
                self.CloseForm("game/" + app.subGameName.toUpperCase() + "ui/UI" + app.subGameName.toUpperCase() + "_Play");
                self.CloseForm("game/" + app.subGameName.toUpperCase() + "ui/UI" + app.subGameName.toUpperCase() + "_LPPlay");
                self.CloseForm("game/" + app.subGameName.toUpperCase() + "ui/UI" + app.subGameName.toUpperCase() + "_SYPlay");
                self.CloseForm(app.subGameName + "_UIPublic_Record");
                self.CloseForm(app.subGameName + "_UILPPublic_Record");
                //关闭没用的UI
                app[app.subGameName + "Client"].clientConfig.GameServerIP = self.gameServerIP;
                app[app.subGameName + "Client"].clientConfig.GameServerPort = self.gameServerPort;
                app[app.subGameName + "_NetWork"]().isReconnecting = true; //标记为正在重新连接，让发送消息堆积多发送队列
                app[app.subGameName.toUpperCase() + "RoomMgr"]().SendGetRoomInfo(self.roomID); //加入获取消息到队列
                //关闭没用的UI
                app[app.subGameName + "_NetWork"]().UpdateAccessPoint(); //更新连接节点
                app[app.subGameName + "_NetWork"]().ReConnect(); //发起重新连接服务器
                self.CloseForm();
            }, function (error) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('DissolveRoom');
                self.CloseForm();
            });
        } else if (btnName == "btnCancel") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();