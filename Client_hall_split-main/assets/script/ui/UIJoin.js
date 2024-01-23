/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_shurukuang: cc.Node,
    },
    OnCreateInit: function () {
        this.labelString = [];
        this.GameManager = app.GameManager();
        // this.RegEvent("EnterRoomNeedJoinFamily", this.Event_EnterRoomNeedJoinFamily, this);
        this.RegEvent("GetFamilyInfo", this.Event_GetFamilyInfo, this);
        this.RegEvent("CodeError", this.Event_CodeError, this);
    },
    //事件回调
    Event_CodeError: function (event) {
        let codeInfo = event;
        if (codeInfo["Code"] == this.ShareDefine.CLUB_NotClubJoinRoomErr) {
            app.SysNotifyManager().ShowSysMsg('CLUB_NotClubJoinRoomErr');
        } else if (codeInfo["Code"] == 304) {
            app.SysNotifyManager().ShowSysMsg('该房间已经开始游戏了', [], 3);
            // app.SysNotifyManager().ShowSysMsg(codeInfo["Result"]["Msg"].toString());
        } else if (codeInfo["Code"] == 6018) {
            let codeData = JSON.parse(codeInfo.Result.Msg);
            this.SetWaitForConfirm("MSG_NOT_CLUBMEMBER", app.ShareDefine().ConfirmYN, [codeData.clubName], [codeData.clubsign]);
        } else if (codeInfo["Code"] == 6121) {
            app.SysNotifyManager().ShowSysMsg('该房间为联盟房间，请通过亲友圈加入', [], 4);
        }
    },

    Event_GetFamilyInfo: function () {

        //加入房主工会成功,再次发送进入房间
        // if(this.labelString.length == 6){
        // 	let roomKey = this.labelString.join("");
        // 	this.GameManager.SendEnterRoom(roomKey);
        // }
        // else{
        // 	this.ErrLog("Event_GetFamilyInfo labelString error", this.labelString);
        // }
    },

    OnShow: function () {
        this.ResetNumber();
    },

    ResetNumber: function () {
        let children = this.sp_shurukuang.children;
        for (let idx = 0; idx < children.length; idx++) {
            let sp_bg = children[idx];
            sp_bg.getChildByName("lb_num").getComponent(cc.Label).string = "";
        }
        this.labelString = [];
    },

    OnClickForm: function () {
        //this.CloseForm();
    },
    //---------点击函数---------------------
    OnClick: function (btnName, btnNode) {
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

    Click_btn_close: function () {
        this.labelString = [];
        this.OnClick_Close();
    },

    Click_Btn_Clear: function () {
        if (this.labelString.length == 0) {
            return
        }
        let node = this.GetWndNode("sp_shuru/shurukuang/sp_bg" + this.labelString.length + "/lb_num");
        node.getComponent(cc.Label).string = "";
        this.labelString.pop();
    },

    Click_BtnNumber: function (btnName) {
        if (this.labelString.length >= 6)
            return;
        let num = Math.floor(btnName.substring(btnName.length - 1));
        this.labelString.push(num);
        let roomKey = this.labelString.join("");

        let children = this.sp_shurukuang.children;
        for (let idx = 0; idx < children.length; idx++) {
            let sp_bg = children[idx];
            let lb_num = sp_bg.getChildByName("lb_num").getComponent(cc.Label);
            if (lb_num.string == "") {
                let data = this.labelString[this.labelString.length - 1];
                lb_num.string = data.toString();
                break;
            }
        }
        if (this.labelString.length == 6) {
            let self = this;
            app.NetManager().SendPack("room.CBaseGetGameType", {"roomKey": roomKey}, function (event) {
                console.warn('join event:', event);
                let EnterFunction = null;
                //钓解选座位
                if (event == 87) {
                    EnterFunction = () => {
                        app.NetManager().SendPack("room.CBaseEnterRoom", {
                            "roomKey": roomKey,
                            "posID": -1
                        }, (arg) => {
                            console.log('进入房间参数：', arg);
                            if (arg && arg.cfg) {
                                if (arg.roomKey == null) arg.roomKey = roomKey;
                                let selectNode = cc.find('UIDXSelectJoinChair', self.node);
                                selectNode.active = true;
                                selectNode.getComponent('UIDXSelectJoinChair').onShow(arg, ()=>{
                                    self.OnClick_Close();
                                });
                                //
                            }
                        }, (event) => {
                            console.error("进入房间失败...", event);
                        });
                    }
                }
                let gameType = event;
                let name = app.ShareDefine().GametTypeID2PinYin[gameType];
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
    SetWaitForConfirm: function (msgID, type, msgArg = [], cbArg = []) {
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function (clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_NOT_CLUBMEMBER' == msgID) {
            let clubsign = backArgList[0];
            app.ClubManager().SendReqJoinClub(clubsign);
        }
    },
});
