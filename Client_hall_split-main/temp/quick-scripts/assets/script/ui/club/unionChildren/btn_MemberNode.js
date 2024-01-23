(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/unionChildren/btn_MemberNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dacdfXo7xVFNIh2m0EmojvE', 'btn_MemberNode', __filename);
// script/ui/club/unionChildren/btn_MemberNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        unSelectSprite: cc.SpriteFrame,
        selectSprite: cc.SpriteFrame
    },
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        app.Client.RegEvent("OnUnionMemberInfoChange", this.Event_UnionMemberInfoChange, this);

        // let memberScrollView = this.node.getChildByName("memberScrollView").getComponent(cc.ScrollView);
        //    memberScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData: function InitData(clubId, unionId, unionPostType, myisminister, unionName, unionSign) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.unionPostType = unionPostType;
        this.curPage = 1;
        this.lastPage = 1;
        this.queryStr = "";
        this.node.getChildByName("searchEditBox").getComponent(cc.EditBox).string = "";
        //刷新页数
        var lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.curPage;
        this.GetPalyerList(true);
        var self = this;
        var sendOnlinePack = app.ClubManager().GetUnionSendPackHead();
        app.NetManager().SendPack("union.CUnionOnlinePlayerCount", sendOnlinePack, function (serverPack) {
            self.node.getChildByName("lb_OnlineCount").getComponent(cc.Label).string = "当前赛事在线人数：" + serverPack + "人";
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取在线人数失败", [], 3);
        });

        if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
            app.NetManager().SendPack("Union.CUnionCountInfoByZhongZhi", sendOnlinePack, function (serverPack) {
                self.node.getChildByName("tip").getComponent(cc.Label).string = "联赛活跃积分:" + serverPack.prizePool + "、成员总积分:" + serverPack.unionAllMemberPointTotal + "、房卡消耗:" + serverPack.consumeValue + "、最终积分总和:" + serverPack.finalAllMemberPointTotal;
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取在线人数失败", [], 3);
            });
        }
    },
    GetPalyerList: function GetPalyerList() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.query = app.ComTool().GetBeiZhuID(this.queryStr);
        var self = this;
        app.NetManager().SendPack("union.CUnionMemberList", sendPack, function (serverPack) {
            if (serverPack.length > 0) {
                self.UpdateScrollView(serverPack, isRefresh);
                //刷新页数
                var lb_page = self.node.getChildByName("page").getChildByName("lb_page");
                lb_page.getComponent(cc.Label).string = self.curPage;
            } else {
                self.curPage = self.lastPage;
            }
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取成员列表失败", [], 3);
        });
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetPalyerList(false);
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
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            var isExist = false;
            for (var j = 0; j < content.children.length; j++) {
                if (content.children[j].clubId == serverPack[i].clubId) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            var child = cc.instantiate(demo);
            var controlNode = child.getChildByName("controlNode");
            if (this.unionPostType == app.ClubManager().UNION_MANAGE) {
                //赛事管理
                controlNode.getChildByName("btn_delClub").active = true;
                controlNode.getChildByName("btn_setManager").active = false;
                controlNode.getChildByName("btn_cancelManager").active = false;
                controlNode.getChildByName("btn_sportsPointWarning").active = false;
            } else if (this.unionPostType == app.ClubManager().UNION_CREATE) {
                //赛事创建者
                if (serverPack[i].unionPostType == app.ClubManager().UNION_MANAGE) {
                    controlNode.getChildByName("btn_setManager").active = false;
                    controlNode.getChildByName("btn_cancelManager").active = true;
                } else {
                    controlNode.getChildByName("btn_setManager").active = true;
                    controlNode.getChildByName("btn_cancelManager").active = false;
                }
                controlNode.getChildByName("btn_sportsPointWarning").active = true;
            }
            child.clubId = serverPack[i].clubId;
            child.unionPostType = serverPack[i].unionPostType;
            child.playerData = serverPack[i];
            //可以操作自己，不能操作创建者
            if (child.playerData.createId == app.HeroManager().GetHeroProperty("pid")) {
                //child.getChildByName("btn_control").active = true;
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    child.getChildByName("btn_control").active = true; //赛事创建者要显示一个生存积分
                    controlNode.getChildByName("btn_delClub").active = false;
                    controlNode.getChildByName("btn_setPL").active = true;
                    controlNode.getChildByName("btn_setScore").active = true;
                    controlNode.getChildByName("btn_setManager").active = false;
                    controlNode.getChildByName("btn_cancelManager").active = false;
                    controlNode.getChildByName("btn_clubMember").active = false;
                    controlNode.getChildByName("btn_clubReport").active = false;
                    controlNode.getChildByName("btn_sportsPointWarning").active = true;
                } else {
                    child.getChildByName("btn_control").active = false;
                }
            } else if (child.clubId == this.clubId || child.unionPostType == app.ClubManager().UNION_CREATE) {
                //不能操作创建者
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    child.getChildByName("btn_control").active = true; //赛事创建者要显示一个生存积分
                    controlNode.getChildByName("btn_delClub").active = false;
                    controlNode.getChildByName("btn_setPL").active = false;
                    controlNode.getChildByName("btn_setScore").active = true;
                    controlNode.getChildByName("btn_setManager").active = false;
                    controlNode.getChildByName("btn_cancelManager").active = false;
                    controlNode.getChildByName("btn_clubMember").active = false;
                    controlNode.getChildByName("btn_clubReport").active = false;
                    controlNode.getChildByName("btn_sportsPointWarning").active = true;
                } else {
                    child.getChildByName("btn_control").active = false;
                }
            } else {
                child.getChildByName("btn_control").active = true;
            }
            var clubNameTemp = serverPack[i].clubName;
            if (clubNameTemp.length >= 4) {
                clubNameTemp = serverPack[i].clubName.substr(0, 4) + "...";
            }
            child.getChildByName("lb_clubName").getComponent(cc.Label).string = clubNameTemp;
            child.getChildByName("lb_clubId").getComponent(cc.Label).string = "ID:" + serverPack[i].clubSign;
            var createNameTemp = serverPack[i].createName;
            if (createNameTemp.length >= 4) {
                createNameTemp = serverPack[i].createName.substr(0, 4) + "...";
            }
            child.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack[i].createId, createNameTemp);
            child.getChildByName("lb_clubCreatorId").getComponent(cc.Label).string = "ID:" + serverPack[i].createId;

            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                if (typeof serverPack[i].alivePoint == "undefined") {
                    child.getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = "无";
                } else {
                    child.getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = serverPack[i].alivePoint;
                }
                child.getChildByName("lb_sumSportsPoint").getComponent(cc.Label).string = serverPack[i].zhongZhiTotalPoint;
                child.getChildByName("lb_sumTaoTaiPoint").getComponent(cc.Label).string = serverPack[i].zhongZhiEliminatePointSum;
            } else {
                child.getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = serverPack[i].sportsPoint;
                child.getChildByName("lb_sumSportsPoint").getComponent(cc.Label).string = serverPack[i].sumSportsPoint;
            }

            if (serverPack[i].shareType == 1) {
                child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack[i].shareFixedValue;
            } else if (serverPack[i].shareType == 0) {
                child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack[i].shareValue + "%";
            } else if (serverPack[i].shareType == 2) {
                child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = "区间";
            }
            //child.getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack[i].scorePercent;

            child.getChildByName("lb_score").getComponent(cc.Label).string = serverPack[i].scorePoint;
            child.getChildByName("lb_clubMemberNum").getComponent(cc.Label).string = serverPack[i].number;
            child.active = true;
            content.addChild(child);
        }
    },
    Event_UnionMemberInfoChange: function Event_UnionMemberInfoChange(serverPack) {
        var memberScrollView = this.node.getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        var allUserNode = content.children;
        for (var i = 0; i < allUserNode.length; i++) {
            if (serverPack.unionId == this.unionId && serverPack.clubId == allUserNode[i].playerData.clubId && serverPack.pid == allUserNode[i].playerData.createId) {
                allUserNode[i].playerData.sportsPoint = serverPack.sportsPoint;

                allUserNode[i].playerData.shareType = serverPack.shareType;
                allUserNode[i].playerData.shareFixedValue = serverPack.shareFixedValue;
                allUserNode[i].playerData.shareValue = serverPack.shareValue;
                //allUserNode[i].playerData.scorePercent = serverPack.scorePercent;

                allUserNode[i].getChildByName("lb_clubCreatorPL").getComponent(cc.Label).string = serverPack.sportsPoint;
                if (serverPack.shareType == 1) {
                    allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack.shareFixedValue;
                } else if (serverPack.shareType == 0) {
                    allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack.shareValue + "%";
                } else if (serverPack.shareType == 2) {
                    allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = "区间";
                }
                ///allUserNode[i].getChildByName("lb_scorePercent").getComponent(cc.Label).string = serverPack.scorePercent;
                break;
            }
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
        if ('btn_next' == btnName) {
            this.lastPage = this.curPage;
            this.curPage++;
            this.GetPalyerList(true);
        } else if ('btn_last' == btnName) {
            if (this.curPage <= 1) {
                return;
            }
            this.lastPage = this.curPage;
            this.curPage--;
            this.GetPalyerList(true);
        } else if ('btn_addMember' == btnName) {
            app.FormManager().ShowForm("ui/club/UIUnionYaoQing");
        } else if (btnName == "btn_ShowBtn" || btnName == "btn_control") {

            if (app.ClubManager().GetUnionTypeByLastClubData() == 0) {
                //普通打开UI，中至的要弹出下拉
                if (btnNode.parent.playerData.createId == app.HeroManager().GetHeroProperty("pid")) {
                    //显示操作设置分数
                    var playerData = btnNode.parent.playerData;
                    var data = { "name": playerData.createName,
                        "pid": app.ComTool().GetPid(playerData.createId),
                        "opClubId": playerData.clubId,
                        "shareType": playerData.shareType,
                        "shareFixedValue": playerData.shareFixedValue,
                        "shareValue": playerData.shareValue
                    };
                    app.FormManager().ShowForm("ui/club/UIUserSetPercent", data);
                    return;
                }
            }
            //自己不能操作自己，不能操作创建者
            if (app.ClubManager().GetUnionTypeByLastClubData() == 0) {
                if (btnNode.parent.clubId == this.clubId || btnNode.parent.unionPostType == app.ClubManager().UNION_CREATE) {
                    return;
                }
                //管理不能操作管理
                if (btnNode.parent.unionPostType == app.ClubManager().UNION_MANAGE && this.unionPostType == app.ClubManager().UNION_MANAGE) {
                    return;
                }
            }
            var allUserNode = btnNode.parent.parent.children;
            var controlNode = btnNode.parent.getChildByName("controlNode");
            for (var i = 0; i < allUserNode.length; i++) {
                var userControlNode = allUserNode[i].getChildByName("controlNode");
                if (userControlNode && controlNode != userControlNode) {
                    userControlNode.active = false;
                    userControlNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                    userControlNode.parent.height = 70;
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.selectSprite;
                btnNode.parent.height = 170;
            } else {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                btnNode.parent.height = 70;
            }
        } else if ('btn_search' == btnName) {
            this.queryStr = btnNode.parent.getComponent(cc.EditBox).string;
            this.curPage = 1;
            this.lastPage = 1;
            this.GetPalyerList(true);
        } else if ('btn_delClub' == btnName) {
            var _playerData = btnNode.parent.parent.playerData;
            this.SetWaitForConfirm("MSG_UNION_DEL_MEMBER", app.ShareDefine().ConfirmYN, [_playerData.clubName], [btnNode]);
        } else if ('btn_setPL' == btnName) {
            var clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!clubData) {
                return;
            }

            var _playerData2 = btnNode.parent.parent.playerData;
            var sendPack = {};
            sendPack.clubId = _playerData2.clubId;
            sendPack.opPid = _playerData2.createId;
            sendPack.exeClubId = this.clubId;
            var self = this;
            app.NetManager().SendPack("club.CClubMemberSportsPointInfo", sendPack, function (serverPack) {
                var playerData = btnNode.parent.parent.playerData;
                var data = { "name": playerData.createName,
                    "pid": app.ComTool().GetPid(playerData.createId),
                    "opClubId": playerData.clubId,
                    "targetPL": serverPack.sportsPoint,
                    "owerPL": serverPack.allowSportsPoint,
                    "myisminister": app.ClubManager().Club_MINISTER_CREATER
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UIUserSetPL_2", data);
                } else {
                    app.FormManager().ShowForm("ui/club/UIUserSetPL", data);
                }
                //app.FormManager().ShowForm("ui/club/UIUserSetPL",data);
            }, function () {});
        } else if ('btn_setScore' == btnName) {
            var _playerData3 = btnNode.parent.parent.playerData;
            var _data = { "name": _playerData3.createName,
                "pid": app.ComTool().GetPid(_playerData3.createId),
                "opClubId": _playerData3.clubId,

                "shareType": _playerData3.shareType,
                "shareFixedValue": _playerData3.shareFixedValue,
                "shareValue": _playerData3.shareValue
            };
            app.FormManager().ShowForm("ui/club/UIUserSetPercent", _data);
        } else if ('btn_setManager' == btnName) {
            var _playerData4 = btnNode.parent.parent.playerData;
            var _sendPack = app.ClubManager().GetUnionSendPackHead();
            _sendPack.opClubId = _playerData4.clubId;
            _sendPack.opPid = _playerData4.createId;
            _sendPack.value = 1;
            var _self = this;
            app.NetManager().SendPack("union.CUnionPostTypeUpdate", _sendPack, function (serverPack) {
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_cancelManager").active = true;
                app.SysNotifyManager().ShowSysMsg("成功设为副裁判", [], 3);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("设为副裁判失败", [], 3);
            });
        } else if ('btn_cancelManager' == btnName) {
            var _playerData5 = btnNode.parent.parent.playerData;
            var _sendPack2 = app.ClubManager().GetUnionSendPackHead();
            _sendPack2.opClubId = _playerData5.clubId;
            _sendPack2.opPid = _playerData5.createId;
            _sendPack2.value = 0;
            var _self2 = this;
            app.NetManager().SendPack("union.CUnionPostTypeUpdate", _sendPack2, function (serverPack) {
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_setManager").active = true;
                app.SysNotifyManager().ShowSysMsg("成功取消副裁判", [], 3);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("取消副裁判失败", [], 3);
            });
        } else if ('btn_clubMember' == btnName) {
            var _playerData6 = btnNode.parent.parent.playerData;
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                app.FormManager().ShowForm("ui/club_2/UIUnionClubUserList_2", this.clubId, _playerData6.clubId, this.unionId, this.unionName, this.unionSign);
            } else {
                app.FormManager().ShowForm("ui/club/UIUnionClubUserList", this.clubId, _playerData6.clubId, this.unionId, this.unionName, this.unionSign);
            }
        } else if ('btn_clubReport' == btnName) {
            var _playerData7 = btnNode.parent.parent.playerData;
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                app.FormManager().ShowForm("ui/club_2/UIUnionClubReport_2", _playerData7.clubId, _playerData7.createId);
            } else {
                app.FormManager().ShowForm("ui/club/UIUnionClubReport", _playerData7.clubId, _playerData7.createId);
            }
        } else if ('btn_sportsPointWarning' == btnName) {

            var _playerData8 = btnNode.parent.parent.playerData;
            var _sendPack3 = app.ClubManager().GetUnionSendPackHead();
            _sendPack3.opClubId = _playerData8.clubId;
            _sendPack3.opPid = _playerData8.createId;
            var packName = "union.CUnionSportsPointWaningInfo";
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                packName = "union.CUnionAlivePointInfo";
            }
            app.NetManager().SendPack(packName, _sendPack3, function (serverPack) {
                serverPack.createId = _playerData8.createId;
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UISetSportsPointWarning_2", serverPack);
                } else {
                    app.FormManager().ShowForm("ui/club/UISetSportsPointWarning", serverPack);
                }
            }, function () {});
        } else if ('btn_scoreDetail' == btnName) {
            var _playerData9 = btnNode.parent.playerData;
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                app.FormManager().ShowForm("ui/club_2/UIUnionClubReport_2", _playerData9.clubId, _playerData9.createId);
            } else {
                app.FormManager().ShowForm("ui/club/UIUnionClubReport", _playerData9.clubId, _playerData9.createId);
            }
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArgs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArgs);
        ConfirmManager.ShowConfirm(type, msgID, msgArgs);
    },
    OnConFirm: function OnConFirm(clickType, msgID, cbArgs) {
        if ('Sure' != clickType) {
            return;
        }
        if ('MSG_UNION_DEL_MEMBER' == msgID) {
            var btnNode = cbArgs[0];
            var playerData = btnNode.parent.parent.playerData;
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            var self = this;
            app.NetManager().SendPack("union.CUnionRemoveMember", sendPack, function (serverPack) {
                btnNode.parent.parent.removeFromParent();
                btnNode.parent.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("成功移除", [], 3);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("移除失败", [], 3);
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
        //# sourceMappingURL=btn_MemberNode.js.map
        