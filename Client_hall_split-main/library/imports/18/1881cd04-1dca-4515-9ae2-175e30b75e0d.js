"use strict";
cc._RF.push(module, '1881c0EHcpFFZriF14wt14N', 'UIJoin');
// script/ui/UIJoin.js

"use strict";

/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_shurukuang: cc.Node
    },
    OnCreateInit: function OnCreateInit() {
        this.labelString = [];
        this.GameManager = app.GameManager();
        // this.RegEvent("EnterRoomNeedJoinFamily", this.Event_EnterRoomNeedJoinFamily, this);
        this.RegEvent("GetFamilyInfo", this.Event_GetFamilyInfo, this);
        this.RegEvent("CodeError", this.Event_CodeError, this);
    },
    //事件回调
    Event_CodeError: function Event_CodeError(event) {
        var codeInfo = event;
        if (codeInfo["Code"] == this.ShareDefine.CLUB_NotClubJoinRoomErr) {
            app.SysNotifyManager().ShowSysMsg('CLUB_NotClubJoinRoomErr');
        } else if (codeInfo["Code"] == 304) {
            app.SysNotifyManager().ShowSysMsg('该房间已经开始游戏了', [], 3);
            // app.SysNotifyManager().ShowSysMsg(codeInfo["Result"]["Msg"].toString());
        } else if (codeInfo["Code"] == 6018) {
            var codeData = JSON.parse(codeInfo.Result.Msg);
            this.SetWaitForConfirm("MSG_NOT_CLUBMEMBER", app.ShareDefine().ConfirmYN, [codeData.clubName], [codeData.clubsign]);
        } else if (codeInfo["Code"] == 6121) {
            app.SysNotifyManager().ShowSysMsg('该房间为联盟房间，请通过亲友圈加入', [], 4);
        }
    },

    Event_GetFamilyInfo: function Event_GetFamilyInfo() {

        //加入房主工会成功,再次发送进入房间
        // if(this.labelString.length == 6){
        // 	let roomKey = this.labelString.join("");
        // 	this.GameManager.SendEnterRoom(roomKey);
        // }
        // else{
        // 	this.ErrLog("Event_GetFamilyInfo labelString error", this.labelString);
        // }
    },

    OnShow: function OnShow() {
        this.ResetNumber();
    },

    ResetNumber: function ResetNumber() {
        var children = this.sp_shurukuang.children;
        for (var idx = 0; idx < children.length; idx++) {
            var sp_bg = children[idx];
            sp_bg.getChildByName("lb_num").getComponent(cc.Label).string = "";
        }
        this.labelString = [];
    },

    OnClickForm: function OnClickForm() {
        //this.CloseForm();
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (!btnName) {
            this.ErrLog("UIJoin Buttn OnClick(%s) not find btnName", btnName);
        }
        if (btnName === "btn_clear") {
            this.Click_Btn_Clear();
        } else if (btnName === "btn_close") {
            this.Click_btn_close();
        } else if (btnName === "btn_reset") {
            this.ResetNumber();
        } else {
            this.Click_BtnNumber(btnName);
        }
    },

    Click_btn_close: function Click_btn_close() {
        this.labelString = [];
        this.OnClick_Close();
    },

    Click_Btn_Clear: function Click_Btn_Clear() {
        if (this.labelString.length == 0) {
            return;
        }
        var node = this.GetWndNode("sp_shuru/shurukuang/sp_bg" + this.labelString.length + "/lb_num");
        node.getComponent(cc.Label).string = "";
        this.labelString.pop();
    },

    Click_BtnNumber: function Click_BtnNumber(btnName) {
        if (this.labelString.length >= 6) return;
        var num = Math.floor(btnName.substring(btnName.length - 1));
        this.labelString.push(num);
        var roomKey = this.labelString.join("");

        var children = this.sp_shurukuang.children;
        for (var idx = 0; idx < children.length; idx++) {
            var sp_bg = children[idx];
            var lb_num = sp_bg.getChildByName("lb_num").getComponent(cc.Label);
            if (lb_num.string == "") {
                var data = this.labelString[this.labelString.length - 1];
                lb_num.string = data.toString();
                break;
            }
        }
        if (this.labelString.length == 6) {
            var self = this;
            app.NetManager().SendPack("room.CBaseGetGameType", { "roomKey": roomKey }, function (event) {
                console.warn('join event:', event);
                var EnterFunction = null;
                //钓解选座位
                if (event == 87) {
                    EnterFunction = function EnterFunction() {
                        app.NetManager().SendPack("room.CBaseEnterRoom", {
                            "roomKey": roomKey,
                            "posID": -1
                        }, function (arg) {
                            console.log('进入房间参数：', arg);
                            if (arg && arg.cfg) {
                                if (arg.roomKey == null) arg.roomKey = roomKey;
                                var selectNode = cc.find('UIDXSelectJoinChair', self.node);
                                selectNode.active = true;
                                selectNode.getComponent('UIDXSelectJoinChair').onShow(arg, function () {
                                    self.OnClick_Close();
                                });
                                //
                            }
                        }, function (event) {
                            console.error("进入房间失败...", event);
                        });
                    };
                }
                var gameType = event;
                var name = app.ShareDefine().GametTypeID2PinYin[gameType];
                app.Client.JoinRoomCheckSubGame(name, roomKey, undefined, EnterFunction);
                self.ResetNumber();
            }, function (event) {
                self.ResetNumber();
            });
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
            return;
        }
        if ('MSG_NOT_CLUBMEMBER' == msgID) {
            var clubsign = backArgList[0];
            app.ClubManager().SendReqJoinClub(clubsign);
        }
    }
});

cc._RF.pop();