"use strict";
cc._RF.push(module, '112ffjLAWxJFp3ywnhAOFAj', 'UIRoomInvitation');
// script/ui/UIRoomInvitation.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        LabelMessage: cc.RichText,
        lb_wanfa: cc.Label,
        lb_roomname: cc.Label,
        toggle_yaoqing: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.commonColor = "<color=#705d52>";
        this.clubNameColor = "<color=#daa235>";
        this.playerNameColor = "<color=#f8772c>";
        this.gameNameColor = "<color=#639349>";
        this.allInvitation = [];
        this.invitationData = null;
    },

    //---------显示函数--------------------

    OnShow: function OnShow(Data) {
        this.allInvitation.push(Data);
        this.ShowMsgInfo();
    },

    ShowMsgInfo: function ShowMsgInfo() {
        if (this.allInvitation.length <= 0) {
            this.CloseForm();
            return;
        }
        this.invitationData = this.allInvitation[0];
        this.allInvitation.splice(0, 1);
        if (this.invitationData == null) {
            this.CloseForm();
            return;
        }
        var gameName = app.ShareDefine().GametTypeID2Name[this.invitationData.gameId];
        var invitationStr = "" + this.clubNameColor + this.invitationData.name + this.commonColor + "的成员" + this.playerNameColor + this.invitationData.playerName + this.commonColor + "邀请您参与" + this.gameNameColor + gameName;
        this.LabelMessage.string = invitationStr;
        var gameType = app.ShareDefine().GametTypeID2PinYin[this.invitationData.gameId];
        var wanfaStr = app.RoomCfgManager().WanFa(gameType, this.invitationData.baseCreateRoom);
        this.lb_wanfa.string = wanfaStr;
        //显示房间名字
        if (typeof this.invitationData["baseCreateRoom"]['roomName'] != "undefined") {
            this.lb_roomname.string = this.invitationData["baseCreateRoom"]['roomName'];
        } else {
            this.lb_roomname.string = "";
        }
    },

    OnClose: function OnClose() {},
    click_toggle_jujue: function click_toggle_jujue() {
        var check = this.toggle_yaoqing.getComponent(cc.Toggle).isChecked;
        if (check == false) {
            //已经是不接受邀请
            app.NetManager().SendPack('club.CClubChangePlayerInvite', { type: 0 }, function (serverPack) {}, function (error) {
                console.error(error);
            });
        } else {
            app.NetManager().SendPack('club.CClubChangePlayerInvite', { type: 1 }, function (serverPack) {}, function (error) {
                console.error(error);
            });
            /*this.SetWaitForConfirm(
               'MSG_CLUB_YaoQing',
               this.ShareDefine.Confirm,
               [],
               [],
            );*/
        }
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
            var gameType = app.ShareDefine().GametTypeID2PinYin[this.invitationData.gameId];
            app.Client.JoinRoomCheckSubGame(gameType, this.invitationData.roomKey, this.invitationData.clubId);
            this.allInvitation = [];
            this.invitationData = null;
            this.CloseForm();
        } else if (btnName == "btnCancel") {
            if (this.allInvitation.length > 0) {
                this.ShowMsgInfo();
                return;
            }
            this.invitationData = null;
            this.CloseForm();
        } else if (btnName == "btn_close") {
            if (this.allInvitation.length > 0) {
                this.ShowMsgInfo();
                return;
            }
            this.invitationData = null;
            this.CloseForm();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            this.toggle_yaoqing.getComponent(cc.Toggle).isChecked = false;
            return;
        }
        var self = this;
        if ('MSG_CLUB_YaoQing' == msgID) {
            app.NetManager().SendPack('club.CClubChangePlayerInvite', { type: 1 }, function (serverPack) {}, function (error) {
                console.error(error);
            });
        }
    }
});

cc._RF.pop();