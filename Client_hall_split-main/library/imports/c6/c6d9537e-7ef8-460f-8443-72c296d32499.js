"use strict";
cc._RF.push(module, 'c6d95N+fvhGD4RDcsKW0ySZ', 'UIClubFindRoom');
// script/ui/club/UIClubFindRoom.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {},

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, unionId) {
        this.clubId = clubId;
        this.unionId = unionId;
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_search' == btnName) {
            var roomKey = this.node.getChildByName("input").getChildByName("EditBox").getComponent(cc.EditBox).string;
            if (roomKey == "") {
                this.ShowSysMsg("请输入6位数房间号", [], 3);
                return;
            }
            if (roomKey < 100000) {
                this.ShowSysMsg("请输入6位数房间号", [], 3);
                return;
            }
            var sendPack = {
                "clubId": this.clubId,
                "roomKey": roomKey
            };
            var packName = "club.CClubRoomInfoDetails";
            var self = this;
            if (this.unionId > 0) {
                sendPack.unionId = this.unionId;
                packName = "union.CUnionRoomInfoDetails";
            }
            app.NetManager().SendPack(packName, sendPack, function (serverPack) {
                self.FormManager.ShowForm('ui/club/UIClubRoomJoin', serverPack);
                self.CloseForm();
            }, function () {
                app.SysNotifyManager().ShowSysMsg("未找到房间", [], 3);
            });
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();