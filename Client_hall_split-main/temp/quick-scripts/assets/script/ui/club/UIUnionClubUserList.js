(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionClubUserList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f7807FOvdpN+Yv4bQ6rNOzL', 'UIUnionClubUserList', __filename);
// script/ui/club/UIUnionClubUserList.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        memberlist_scrollView: cc.ScrollView,
        memberlist_layout: cc.Node,
        memberlist_demo: cc.Node,
        memberlist_editbox: cc.EditBox
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.RegEvent("OnClubPlayerNtf", this.Event_PlayerNtf);
        this.RegEvent("OnUnionMemberInfoChange", this.Event_UnionMemberInfoChange, this);
        this.WeChatManager = app.WeChatManager();
        // this.memberlist_scrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },

    //---------显示函数--------------------

    OnShow: function OnShow(owerClubId, opClubId, unionId, unionName, unionSign) {
        this.node.getChildByName("bottom").getChildByName("FuToggle").getComponent(cc.Toggle).isChecked = false;
        this.memberPage = 1;
        this.lastMemberPage = 1;
        //刷新页数
        var lb_page = this.node.getChildByName("bottom").getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.memberPage;
        this.owerClubId = owerClubId;
        this.clubId = opClubId;
        this.unionId = unionId;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.memberlist_demo.active = false;
        this.isSearching = false;
        this.memberlist_editbox.string = '';
        this.queryStr = "";
        this.GetPalyerList(true);
        this.toBttom = false;
        var sendOnlinePack = {};
        sendOnlinePack.clubId = opClubId;
        var self = this;
        app.NetManager().SendPack("club.CClubOnlinePlayerCount", sendOnlinePack, function (serverPack) {
            self.node.getChildByName("bottom").getChildByName("lb_OnlineCount").getComponent(cc.Label).string = "当前亲友圈在线人数：" + serverPack + "人";
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取在线人数失败", [], 3);
        });
    },
    GetPalyerList: function GetPalyerList() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.opClubId = this.clubId;
        sendPack.pageNum = this.memberPage;
        sendPack.query = this.ComTool.GetBeiZhuID(this.queryStr);
        if (this.queryStr != "") {
            this.isSearching = true;
        } else {
            this.isSearching = false;
        }
        //是否勾选只显示在线的
        var isShowOnline = this.node.getChildByName("bottom").getChildByName("OnlineToggle").getComponent(cc.Toggle).isChecked;
        if (isShowOnline) {
            sendPack.type = 1;
        } else {
            sendPack.type = 0;
        }
        var isFu = this.node.getChildByName("bottom").getChildByName("FuToggle").getComponent(cc.Toggle).isChecked;
        if (isFu) {
            sendPack.losePoint = 1;
        } else {
            sendPack.losePoint = 0;
        }
        var self = this;
        app.NetManager().SendPack('union.CUnionClubMemberList', sendPack, function (serverPack) {
            if (serverPack.length > 0) {
                self.ShowMemberList(serverPack, isRefresh);
                //刷新页数
                var lb_page = self.node.getChildByName("bottom").getChildByName("page").getChildByName("lb_page");
                lb_page.getComponent(cc.Label).string = self.memberPage;
            } else {
                self.memberPage = self.lastMemberPage;
            }
            self.toBttom = false;
        }, function (error) {
            self.ShowSysMsg("获取亲友圈玩家列表失败");
        });
    },
    Event_PlayerNtf: function Event_PlayerNtf(event) {
        //处于搜索中，不需要刷新
        if (this.isSearching) return;
        var clubId = event.clubId;
        var self = this;
        if (this.clubId == clubId) {
            this.memberPage = 1;
            this.GetPalyerList(true);
        }
    },
    Event_UnionMemberInfoChange: function Event_UnionMemberInfoChange(serverPack) {
        var allUserNode = this.memberlist_layout.children;
        for (var i = 0; i < allUserNode.length; i++) {
            if (serverPack.unionId == this.unionId && serverPack.clubId == this.clubId && serverPack.pid == allUserNode[i].playerData.shortPlayer.pid) {
                allUserNode[i].playerData.sportsPoint = serverPack.sportsPoint;
                allUserNode[i].getChildByName("pl").getComponent(cc.Label).string = serverPack.sportsPoint;
                break;
            }
        }
    },
    GetNextPage: function GetNextPage() {
        if (this.toBttom == true) {
            return;
        }
        this.toBttom = true;
        this.memberPage++;
        this.GetPalyerList(false);
    },
    ShowMemberList: function ShowMemberList(playerlist, isRefresh) {
        if (isRefresh) {
            //this.memberlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.memberlist_layout);
            this.memberlist_scrollView.scrollToTop();
        }
        for (var i = 0; i < playerlist.length; i++) {
            var heroID = playerlist[i].shortPlayer.pid;
            var shortHeroID = this.ComTool.GetPid(heroID);
            var nodePrefab = cc.instantiate(this.memberlist_demo);
            nodePrefab.name = heroID.toString();
            nodePrefab.minister = playerlist[i].minister;
            nodePrefab.playerData = playerlist[i];
            var headImageUrl = playerlist[i].shortPlayer.iconUrl;
            nodePrefab.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerlist[i].shortPlayer.pid, playerlist[i].shortPlayer.name);
            nodePrefab.getChildByName('id').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(heroID);
            nodePrefab.getChildByName('promoterName').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerlist[i].upShortPlayer.pid, playerlist[i].upShortPlayer.name);
            nodePrefab.getChildByName('promoterId').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(playerlist[i].upShortPlayer.pid);
            if (this.unionId > 0) {
                nodePrefab.getChildByName('pl').getComponent(cc.Label).string = playerlist[i].sportsPoint;
                nodePrefab.getChildByName('btn_setPL').active = true;
            } else {
                nodePrefab.getChildByName('pl').getComponent(cc.Label).string = "";
                nodePrefab.getChildByName('btn_setPL').active = false;
            }
            if (playerlist[i].minister > 0) {
                nodePrefab.getChildByName('btn_setPL').getChildByName("label").getComponent(cc.Label).string = "授权比赛分";
            } else {
                nodePrefab.getChildByName('btn_setPL').getChildByName("label").getComponent(cc.Label).string = "修改比赛分";
            }
            //根据是否禁止来显示按钮
            if (playerlist[i].isUnionBanGame) {
                nodePrefab.getChildByName('btn_jzyx').active = false;
                nodePrefab.getChildByName('btn_qxjz').active = true;
                nodePrefab.getChildByName("img_jzyx").active = true;
            } else {
                nodePrefab.getChildByName('btn_jzyx').active = true;
                nodePrefab.getChildByName('btn_qxjz').active = false;
                nodePrefab.getChildByName("img_jzyx").active = false;
            }
            nodePrefab.active = true;
            this.memberlist_layout.addChild(nodePrefab);
            if (headImageUrl) {
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                var WeChatHeadImage = nodePrefab.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
            }
        }
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_next' == btnName) {
            this.lastMemberPage = this.memberPage;
            this.memberPage++;
            this.GetPalyerList(true);
        } else if ('btn_last' == btnName) {
            if (this.memberPage <= 1) {
                return;
            }
            this.lastMemberPage = this.memberPage;
            this.memberPage--;
            this.GetPalyerList(true);
        } else if ('btn_search' == btnName) {
            this.memberPage = 1;
            this.lastMemberPage = 1;
            this.queryStr = this.memberlist_editbox.string;
            this.GetPalyerList(true);
        } else if ('btn_close' == btnName) {
            this.CloseForm();
        } else if (btnName == "btn_jzyx") {
            this.BanGameClubMember(btnNode, 1);
        } else if (btnName == "btn_qxjz") {
            this.BanGameClubMember(btnNode, 0);
        } else if ('btn_setPL' == btnName) {
            var clubData = app.ClubManager().GetClubDataByClubID(this.owerClubId);
            if (!clubData) {
                return;
            }

            var playerData = btnNode.parent.playerData;
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.opPid = playerData.shortPlayer.pid;
            sendPack.exeClubId = this.owerClubId;
            var self = this;
            app.NetManager().SendPack("club.CClubMemberSportsPointInfo", sendPack, function (serverPack) {
                var playerData = btnNode.parent.playerData;
                var data = { "name": playerData.shortPlayer.name,
                    "pid": self.ComTool.GetPid(playerData.shortPlayer.pid),
                    "opClubId": self.clubId,
                    "targetPL": serverPack.sportsPoint,
                    "owerPL": serverPack.allowSportsPoint,
                    "myisminister": playerData.minister
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UIUserSetPL_2", data, true);
                } else {
                    app.FormManager().ShowForm("ui/club/UIUserSetPL", data, true);
                }
            }, function () {});
        } else if ('btn_changePL' == btnName) {
            //eliminatePoin

            var _clubData = app.ClubManager().GetClubDataByClubID(this.owerClubId);
            if (!_clubData) {
                return;
            }
            var _playerData = btnNode.parent.playerData;
            var _sendPack = {};
            _sendPack.clubId = this.clubId;
            _sendPack.opPid = _playerData.shortPlayer.pid;
            _sendPack.exeClubId = this.owerClubId;
            var data = { "name": _playerData.shortPlayer.name,
                "pid": this.ComTool.GetPid(_playerData.shortPlayer.pid),
                "opClubId": this.clubId,
                "eliminatePoint": _playerData.eliminatePoint
            };
            app.FormManager().ShowForm("ui/club_2/UIChangeSportsPointWarning_2", data, true);
        } else if (btnName == "btn_jjdz") {
            var _playerData2 = btnNode.parent.playerData;
            app.FormManager().ShowForm('ui/club/UIClubUserMessageNew', this.owerClubId, this.unionId, this.unionName, this.unionSign, this.ComTool.GetPid(_playerData2.shortPlayer.pid), this.clubId);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },
    OnClickOnLineToggle: function OnClickOnLineToggle(event) {
        this.memberPage = 1;
        this.lastMemberPage = 1;
        this.DestroyAllChildren(this.memberlist_layout);
        this.memberlist_scrollView.scrollToTop();
        this.GetPalyerList(true);
    },
    OnClickFuToggle: function OnClickFuToggle(event) {
        this.memberPage = 1;
        this.lastMemberPage = 1;
        this.DestroyAllChildren(this.memberlist_layout);
        this.memberlist_scrollView.scrollToTop();
        this.GetPalyerList(true);
    },
    BanGameClubMember: function BanGameClubMember(btnNode, value) {
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        var playerData = btnNode.parent.playerData;
        app.FormManager().ShowForm("ui/club/UIForbidRoomCfg", this.clubId, playerData.shortPlayer.pid);
        // sendPack.opClubId = this.clubId;
        // sendPack.opPid = playerData.shortPlayer.pid;
        // sendPack.value = value;
        // let self = this;
        // app.NetManager().SendPack('union.CUnionBanGameClubMember',sendPack,function(serverPack){
        //     //根据是否禁止来显示按钮
        //     if (value == 1) {
        //         btnNode.parent.getChildByName('btn_jzyx').active=false;
        //         btnNode.parent.getChildByName('btn_qxjz').active=true;
        //         btnNode.parent.getChildByName("img_jzyx").active=true;
        //     }else{
        //         btnNode.parent.getChildByName('btn_jzyx').active=true;
        //         btnNode.parent.getChildByName('btn_qxjz').active=false;
        //         btnNode.parent.getChildByName("img_jzyx").active=false;
        //     }
        // },function(error){
        //     self.ShowSysMsg("操作该玩家失败");
        // });
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
        //# sourceMappingURL=UIUnionClubUserList.js.map
        