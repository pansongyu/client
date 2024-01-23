(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd770bSb+WxH6pUQia0Xunn0', 'UIUnionManager', __filename);
// script/ui/club/UIUnionManager.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        redTip: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
        this.InitEvent();
    },
    InitEvent: function InitEvent() {
        //基础网络包
        this.NetManager = app.NetManager();
        this.RegEvent("CodeError", this.Event_CodeError, this);
        //新的审核通知
        this.NetManager.RegNetPack('SUnion_Examine', this.Event_UnionExamine, this);
    },
    Event_CodeError: function Event_CodeError(event) {
        var code = event["Code"];
    },
    Event_UnionExamine: function Event_UnionExamine(event) {
        if (event.unionId != this.unionId) {
            return;
        }
        if (event.size > 0) {
            this.redTip.active = true;
        } else {
            this.redTip.active = false;
        }
    },
    //--------------显示函数-----------------
    OnShow: function OnShow(clubId, unionId, unionName, unionPostType, myisminister, unionSign) {
        var btn_defaultName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "btn_Setting";

        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.lastClickBtnName = "";
        var lb_Title = this.node.getChildByName("bg_create").getChildByName("lb_Title");
        lb_Title.getComponent(cc.Label).string = unionName + "（ID:" + unionSign + "）";
        var btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name, btn_default);
        this.UpdateLeftBtn();
        if (this.unionPostType == app.ClubManager().UNION_MANAGE || this.unionPostType == app.ClubManager().UNION_CREATE) {
            //如果是管理或者创建者，请求是否有审核消息
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            var self = this;
            app.NetManager().SendPack('union.CUnionExamine', sendPack, function (serverPack) {
                self.Event_UnionExamine(serverPack);
            });
        }
    },
    UpdateLeftBtn: function UpdateLeftBtn() {
        var btn_Setting = this.node.getChildByName("left").getChildByName("btn_Setting");
        var btn_Data = this.node.getChildByName("left").getChildByName("btn_Data");
        var btn_Member = this.node.getChildByName("left").getChildByName("btn_Member");
        var btn_Wanfa = this.node.getChildByName("left").getChildByName("btn_Wanfa");
        var btn_Message = this.node.getChildByName("left").getChildByName("btn_Message");
        var btn_MemberCheck = this.node.getChildByName("left").getChildByName("btn_MemberCheck");
        var btn_RaceRank = this.node.getChildByName("left").getChildByName("btn_RaceRank");
        var btn_ForbidTable = this.node.getChildByName("left").getChildByName("btn_ForbidTable");

        var btn_Management = this.node.getChildByName("left").getChildByName("btn_Management");
        var btn_ForbidGame = this.node.getChildByName("left").getChildByName("btn_ForbidGame");
        var btn_SetSkinType = this.node.getChildByName("left").getChildByName("btn_SetSkinType");
        if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            //赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_GENERAL) {
            //普通成员
            btn_Setting.active = false;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = false;
            if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
                btn_MemberCheck.active = true;
            } else {
                btn_MemberCheck.active = false;
            }
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        } else if (this.unionPostType == app.ClubManager().UNION_CLUB) {
            //亲友圈创建者
            btn_Setting.active = true;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        } else if (this.unionPostType == app.ClubManager().UNION_MANAGE) {
            //赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_CREATE) {
            //赛事创建者
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        }
        //赛事数据暂时放后台统计
        btn_Data.active = false;
        btn_RaceRank.active = true;
    },
    ClickLeftBtn: function ClickLeftBtn(clickName) {
        if (clickName == "btn_MemberCheck") {
            this.redTip.active = false;
        }
        var rightNode = this.node.getChildByName("right");
        var allRightBtn = [];
        for (var i = 0; i < rightNode.children.length; i++) {
            allRightBtn.push(rightNode.children[i]);
        }
        for (var _i = 0; _i < allRightBtn.length; _i++) {
            if (allRightBtn[_i].name == this.lastClickBtnName + "Node") {
                if (allRightBtn[_i].getComponent(allRightBtn[_i].name).isClickAnyWnd) {
                    allRightBtn[_i].getComponent(allRightBtn[_i].name).isClickAnyWnd = false;
                    if (this.unionPostType != app.ClubManager().UNION_CREATE && this.lastClickBtnName == "btn_Setting") {
                        continue;
                    }
                    this.SetWaitForConfirm("MSG_UNOIN_SAVE", app.ShareDefine().ConfirmYN, [], [clickName, this.lastClickBtnName]);
                    return;
                }
            }
        }
        this.lastClickBtnName = clickName;
        var leftNode = this.node.getChildByName("left");
        var allLeftBtn = [];
        for (var _i2 = 0; _i2 < leftNode.children.length; _i2++) {
            allLeftBtn.push(leftNode.children[_i2]);
        }
        for (var _i3 = 0; _i3 < allLeftBtn.length; _i3++) {
            if (allLeftBtn[_i3].name == clickName) {
                allLeftBtn[_i3].getChildByName("img_off").active = false;
                allLeftBtn[_i3].getChildByName("lb_off").active = false;
                allLeftBtn[_i3].getChildByName("img_on").active = true;
                allLeftBtn[_i3].getChildByName("lb_on").active = true;
            } else {
                allLeftBtn[_i3].getChildByName("img_off").active = true;
                allLeftBtn[_i3].getChildByName("lb_off").active = true;
                allLeftBtn[_i3].getChildByName("img_on").active = false;
                allLeftBtn[_i3].getChildByName("lb_on").active = false;
            }
        }
        for (var _i4 = 0; _i4 < allRightBtn.length; _i4++) {
            if (allRightBtn[_i4].name == clickName + "Node") {
                allRightBtn[_i4].active = true;
                allRightBtn[_i4].getComponent(allRightBtn[_i4].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign);
            } else {
                allRightBtn[_i4].active = false;
            }
        }
    },
    //---------点击函数---------------------
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
            if ('MSG_UNOIN_SAVE' == msgID) {
                this.ClickLeftBtn(backArgList[0]);
            }
            return;
        }
        if ('MSG_UNOIN_SAVE' == msgID) {
            var rightNode = this.node.getChildByName("right");
            var eventComponent = rightNode.getChildByName(backArgList[1] + "Node").getComponent(backArgList[1] + "Node");
            if (eventComponent) {
                eventComponent.SaveChange();
                this.ClickLeftBtn(backArgList[0]);
            } else {
                console.log("找不到组件：" + backArgList[1] + "Node，需查询！！！");
            }
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            //关闭之前判断是否保存了房间列表
            var rightNode = this.node.getChildByName("right");
            var eventComponent = rightNode.getChildByName("btn_WanfaNode").getComponent("btn_WanfaNode");
            if (eventComponent) {
                if (eventComponent.isSaveSuccess) {
                    app.Client.OnEvent('OnRefreshRoomList');
                }
            } else {
                console.log("找不到组件：btn_WanfaNode,需查询！！！");
            }
            this.CloseForm();
        } else if ('btn_Setting' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_Data' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_Member' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_Wanfa' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_Message' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_MemberCheck' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_RaceRank' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_ForbidTable' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_Management' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_ForbidGame' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_SetSkinType' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_RaceRankZhongzhi' == btnName) {
            this.ClickLeftBtn(btnName);
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIUnionManager.js.map
        