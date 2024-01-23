(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/unionChildren/btn_MemberCheckNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5929eu3mNxAdI+xmjYOyzdc', 'btn_MemberCheckNode', __filename);
// script/ui/club/unionChildren/btn_MemberCheckNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        var memberScrollView = this.node.getChildByName("memberScrollView").getComponent(cc.ScrollView);
        memberScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    InitData: function InitData(clubId, unionId, unionPostType, myisminister) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.curPage = 1;
        this.curType = 0;
        this.clickBtnName = "";
        if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck").active = true;
            this.node.getChildByName("topBtnNode").getChildByName("btn_exitCheck").active = true;
            this.node.getChildByName("btn_addMember").active = true;
            var btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck");
            this.OnClick(btn_default.name, btn_default);
        } else if (this.unionPostType == app.ClubManager().UNION_CLUB || this.unionPostType == app.ClubManager().UNION_GENERAL && this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
            //亲友圈创建者
            this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck").active = false;
            this.node.getChildByName("topBtnNode").getChildByName("btn_exitCheck").active = false;
            this.node.getChildByName("btn_addMember").active = false;
            var _btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_outRaceCheck");
            this.OnClick(_btn_default.name, _btn_default);
        } else {
            this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck").active = true;
            this.node.getChildByName("topBtnNode").getChildByName("btn_exitCheck").active = true;
            this.node.getChildByName("btn_addMember").active = true;
            var _btn_default2 = this.node.getChildByName("topBtnNode").getChildByName("btn_joinCheck");
            this.OnClick(_btn_default2.name, _btn_default2);
        }
    },
    ClickTopBtn: function ClickTopBtn(clickName) {
        var topBtnNode = this.node.getChildByName("topBtnNode");
        var allTopBtn = [];
        for (var i = 0; i < topBtnNode.children.length; i++) {
            allTopBtn.push(topBtnNode.children[i]);
        }
        this.clickBtnName = clickName;
        for (var _i = 0; _i < allTopBtn.length; _i++) {
            if (allTopBtn[_i].name == clickName) {
                allTopBtn[_i].getChildByName("img_off").active = false;
                allTopBtn[_i].getChildByName("lb_off").active = false;
                allTopBtn[_i].getChildByName("img_on").active = true;
                allTopBtn[_i].getChildByName("lb_on").active = true;
            } else {
                allTopBtn[_i].getChildByName("img_off").active = true;
                allTopBtn[_i].getChildByName("lb_off").active = true;
                allTopBtn[_i].getChildByName("img_on").active = false;
                allTopBtn[_i].getChildByName("lb_on").active = false;
            }
        }
        var topTitle = this.node.getChildByName("topTitle");
        if (this.curType == 0 || this.curType == 1) {
            //成员审核的
            topTitle.getChildByName("lb_1").getComponent(cc.Label).string = "亲友圈名称";
            topTitle.getChildByName("lb_2").getComponent(cc.Label).string = "圈ID";
            topTitle.getChildByName("lb_3").getComponent(cc.Label).string = "创建者名称";
            topTitle.getChildByName("lb_4").getComponent(cc.Label).string = "圈主ID";
            topTitle.getChildByName("lb_5").getComponent(cc.Label).string = "人数";
        } else {
            //退赛，重赛审核的
            topTitle.getChildByName("lb_1").getComponent(cc.Label).string = "玩家昵称";
            topTitle.getChildByName("lb_2").getComponent(cc.Label).string = "玩家ID";
            topTitle.getChildByName("lb_3").getComponent(cc.Label).string = "所属亲友圈";
            topTitle.getChildByName("lb_4").getComponent(cc.Label).string = "亲友圈ID";
            topTitle.getChildByName("lb_5").getComponent(cc.Label).string = "比赛分";
        }
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.type = this.curType;
        var self = this;
        app.NetManager().SendPack("union.CUnionMemberExamineList", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, false);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
        });
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var memberScrollView = this.node.getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            memberScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            if (i % 2 == 0) {
                child.getChildByName("img_tiaowen01").active = true;
            } else {
                child.getChildByName("img_tiaowen01").active = false;
            }
            if (this.curType == 3) {
                child.getChildByName("btn_refuse").active = false;
                child.getChildByName("btn_agree").x = 345;
            } else {
                child.getChildByName("btn_refuse").active = true;
                child.getChildByName("btn_refuse").x = 265;
                child.getChildByName("btn_agree").x = 425;
            }
            if (serverPack[i].clubName.length > 6) serverPack[i].clubName = serverPack[i].clubName.substring(0, 6) + '...';

            if (serverPack[i].type == 0 || serverPack[i].type == 1) {
                //成员审核的
                child.getChildByName("lb_clubName").getComponent(cc.Label).string = serverPack[i].clubName;
                child.getChildByName("lb_clubId").getComponent(cc.Label).string = serverPack[i].clubSign;
                child.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack[i].createId, serverPack[i].createName);
                child.getChildByName("lb_clubCreatorId").getComponent(cc.Label).string = serverPack[i].createId;
                child.getChildByName("lb_clubMemberNum").getComponent(cc.Label).string = serverPack[i].number;
            } else {
                //退赛，重赛审核的
                child.getChildByName("lb_clubName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack[i].createId, serverPack[i].createName);
                child.getChildByName("lb_clubId").getComponent(cc.Label).string = serverPack[i].createId;
                child.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = serverPack[i].clubName;
                child.getChildByName("lb_clubCreatorId").getComponent(cc.Label).string = serverPack[i].clubSign;
                child.getChildByName("lb_clubMemberNum").getComponent(cc.Label).string = serverPack[i].sportsPoint;
            }

            child.clubId = serverPack[i].clubId;
            child.opPid = serverPack[i].createId;
            child.active = true;
            content.addChild(child);
        }
    },
    //控件点击回调
    OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
        try {
            app.SoundManager().PlaySound("BtnClick");
            var btnNode = eventTouch.currentTarget;
            var btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            console.log("OnClick_BtnWnd:" + error.stack);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_joinCheck' == btnName) {
            this.curType = 0;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.pageNum = this.curPage;
            sendPack.type = this.curType;
            var self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList", sendPack, function (serverPack) {
                self.UpdateScrollView(serverPack, true);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else if ('btn_exitCheck' == btnName) {
            this.curType = 1;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            var _sendPack = app.ClubManager().GetUnionSendPackHead();
            _sendPack.pageNum = this.curPage;
            _sendPack.type = this.curType;
            var _self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList", _sendPack, function (serverPack) {
                _self.UpdateScrollView(serverPack, true);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else if ('btn_outRaceCheck' == btnName) {
            this.curType = 2;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            var _sendPack2 = app.ClubManager().GetUnionSendPackHead();
            _sendPack2.pageNum = this.curPage;
            _sendPack2.type = this.curType;
            var _self2 = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList", _sendPack2, function (serverPack) {
                _self2.UpdateScrollView(serverPack, true);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else if ('btn_reRaceCheck' == btnName) {
            this.curType = 3;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            var _sendPack3 = app.ClubManager().GetUnionSendPackHead();
            _sendPack3.pageNum = this.curPage;
            _sendPack3.type = this.curType;
            var _self3 = this;
            app.NetManager().SendPack("union.CUnionMemberExamineList", _sendPack3, function (serverPack) {
                _self3.UpdateScrollView(serverPack, true);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
            });
        } else if ('btn_agree' == btnName) {
            if (this.curType == 2) {
                this.SetWaitForConfirm('MSG_AGREE_OUTRACE', app.ShareDefine().Confirm, [], [btnNode], "同意后该玩家的比赛分将清零，并且由您补足清零的差额");
            } else {
                var _sendPack4 = app.ClubManager().GetUnionSendPackHead();
                _sendPack4.opClubId = btnNode.parent.clubId;
                _sendPack4.type = this.curType;
                _sendPack4.opPid = btnNode.parent.opPid;
                _sendPack4.operate = 0;
                var _self4 = this;
                app.NetManager().SendPack("union.CUnionMemberExamineOperate", _sendPack4, function (serverPack) {
                    btnNode.parent.removeFromParent();
                    btnNode.parent.destroy();
                    app.SysNotifyManager().ShowSysMsg("操作成功", [], 3);
                }, function () {
                    if (_self4.clickBtnName != "") {
                        var btn_default = _self4.node.getChildByName("topBtnNode").getChildByName(_self4.clickBtnName);
                        _self4.OnClick(btn_default.name, btn_default);
                    }
                });
            }
        } else if ('btn_refuse' == btnName) {
            var _sendPack5 = app.ClubManager().GetUnionSendPackHead();
            _sendPack5.opClubId = btnNode.parent.clubId;
            _sendPack5.type = this.curType;
            _sendPack5.opPid = btnNode.parent.opPid;
            _sendPack5.operate = 1;
            var _self5 = this;
            app.NetManager().SendPack("union.CUnionMemberExamineOperate", _sendPack5, function (serverPack) {
                btnNode.parent.removeFromParent();
                btnNode.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("操作成功", [], 3);
            }, function () {
                if (_self5.clickBtnName != "") {
                    var btn_default = _self5.node.getChildByName("topBtnNode").getChildByName(_self5.clickBtnName);
                    _self5.OnClick(btn_default.name, btn_default);
                }
            });
        } else if ('btn_addMember' == btnName) {
            app.FormManager().ShowForm("ui/club/UIUnionYaoQing");
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
        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_AGREE_OUTRACE' == msgID) {
            var btnNode = backArgList[0];
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = btnNode.parent.clubId;
            sendPack.type = this.curType;
            sendPack.opPid = btnNode.parent.opPid;
            sendPack.operate = 0;
            var self = this;
            app.NetManager().SendPack("union.CUnionMemberExamineOperate", sendPack, function (serverPack) {
                btnNode.parent.removeFromParent();
                btnNode.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("操作成功", [], 3);
            }, function () {
                if (self.clickBtnName != "") {
                    var btn_default = self.node.getChildByName("topBtnNode").getChildByName(self.clickBtnName);
                    self.OnClick(btn_default.name, btn_default);
                }
            });
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
        //# sourceMappingURL=btn_MemberCheckNode.js.map
        