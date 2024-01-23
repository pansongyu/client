(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/unionChildren/btn_WanfaNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7284cNLy9ZB+7VvCwqAnhXg', 'btn_WanfaNode', __filename);
// script/ui/club/unionChildren/btn_WanfaNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        unSelectSprite: cc.SpriteFrame,
        selectSprite: cc.SpriteFrame,
        toggleIcon: cc.SpriteFrame
    },
    onLoad: function onLoad() {
        var roomScrollView = this.node.getChildByName("roomScrollView").getComponent(cc.ScrollView);
        // roomScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData: function InitData(clubId, unionId, unionPostType, myisminister) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.curPage = 1;
        this.lastPage = 1;
        this.curType = 0;
        this.isClickAnyWnd = false;
        this.isSaveSuccess = false;
        this.allPLDecStr = "";
        this.selectIdList = [];
        this.GetUnionRoomCount();
        //刷新页数
        var lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.curPage;
        var btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_All");
        this.OnClick(btn_default.name, btn_default);
        if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            //赛事管理员显示创建按钮
            this.node.getChildByName("btn_create").active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_CLUB || this.unionPostType == app.ClubManager().UNION_GENERAL) {
            //普通成员隐藏新增房间按钮
            this.node.getChildByName("btn_create").active = false;
        } else {
            this.node.getChildByName("btn_create").active = true;
        }
        //只有赛事创建者才有空桌排序
        if (this.unionPostType == app.ClubManager().UNION_CREATE || this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            this.node.getChildByName("sortToggleGroup").active = true;
            this.node.getChildByName("lb_tip").active = true;
        } else {
            this.node.getChildByName("sortToggleGroup").active = false;
            this.node.getChildByName("lb_tip").active = false;
        }
    },
    ClickTopBtn: function ClickTopBtn(clickName) {
        var topBtnNode = this.node.getChildByName("topBtnNode");
        var allTopBtn = [];
        for (var i = 0; i < topBtnNode.children.length; i++) {
            allTopBtn.push(topBtnNode.children[i]);
        }
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
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetUnionRoomCfgList(false);
    },
    OnClickAnyWnd: function OnClickAnyWnd(event) {
        if (this.isUpdateDataEnd) {
            this.isClickAnyWnd = true;
            if (event.node.name == "selectToggle") {
                var targetId = event.node.parent.id;
                if (event.node.getComponent(cc.Toggle).isChecked && this.selectIdList.indexOf(targetId) < 0) {
                    this.selectIdList.push(targetId);
                } else if (!event.node.getComponent(cc.Toggle).isChecked && this.selectIdList.indexOf(targetId) > -1) {
                    this.selectIdList.splice(this.selectIdList.indexOf(targetId), 1);
                }
            }
        }
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        if (!this.isClickAnyWnd) {
            this.isUpdateDataEnd = false;
        }
        var roomScrollView = this.node.getChildByName("roomScrollView");
        var content = roomScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            // let isExist = false;
            // for (let j = 0; j < content.children.length; j++) {
            //     if (content.children[j].id == serverPack[i].id) {
            //         isExist = true;
            //         break;
            //     }
            // }
            // if (isExist) continue;
            var child = cc.instantiate(demo);
            child.id = serverPack[i].id;
            child.name = "room" + serverPack[i].id;
            if (i % 2 == 0) {
                // child.getChildByName("img_tiaowen01").active = true;
                child.getComponent(cc.Sprite).active = true;
            } else {
                // child.getChildByName("img_tiaowen01").active = false;
                child.getComponent(cc.Sprite).active = false;
            }
            child.getChildByName("helpNode").active = false;
            //20是服务端每页20条数据
            child.getChildByName("lb_index").getComponent(cc.Label).string = 20 * (this.curPage - 1) + i + 1;
            child.getChildByName("lb_roomName").getComponent(cc.Label).string = serverPack[i].roomName;
            child.getChildByName("lb_gameName").getComponent(cc.Label).string = app.ShareDefine().GametTypeID2Name[serverPack[i].gameId];
            child.getChildByName("lb_playingCount").getComponent(cc.Label).string = serverPack[i].playingCount;
            if (serverPack[i].isSelect) {
                if (this.selectIdList.indexOf(serverPack[i].id) < 0) {
                    this.selectIdList.push(serverPack[i].id);
                }
                child.getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = true;
            } else {
                child.getChildByName("selectToggle").getComponent(cc.Toggle).isChecked = false;
            }
            child.active = true;
            content.addChild(child);
        }
        this.isUpdateDataEnd = true;
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
            this.GetUnionRoomCfgList(true);
        } else if ('btn_last' == btnName) {
            if (this.curPage <= 1) {
                return;
            }
            this.lastPage = this.curPage;
            this.curPage--;
            this.GetUnionRoomCfgList(true);
        } else if ('btn_All' == btnName) {
            this.ClickTopBtn(btnName);
            this.curType = 0;
            this.curPage = 1;
            this.lastPage = this.curPage;
            var roomScrollView = this.node.getChildByName("roomScrollView");
            var content = roomScrollView.getChildByName("view").getChildByName("content");
            roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
            this.GetUnionRoomCfgList(true);
        } else if ('btn_MaJiang' == btnName) {
            this.ClickTopBtn(btnName);
            this.curType = 1;
            this.curPage = 1;
            this.lastPage = this.curPage;
            var _roomScrollView = this.node.getChildByName("roomScrollView");
            var _content = _roomScrollView.getChildByName("view").getChildByName("content");
            _roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            _content.removeAllChildren();
            this.GetUnionRoomCfgList(true);
        } else if ('btn_Poker' == btnName) {
            this.ClickTopBtn(btnName);
            this.curType = 2;
            this.curPage = 1;
            this.lastPage = this.curPage;
            var _roomScrollView2 = this.node.getChildByName("roomScrollView");
            var _content2 = _roomScrollView2.getChildByName("view").getChildByName("content");
            _roomScrollView2.getComponent(cc.ScrollView).scrollToTop();
            _content2.removeAllChildren();
            this.GetUnionRoomCfgList(true);
        } else if (btnName == "btn_ShowBtn") {
            var allUserNode = btnNode.parent.parent.children;
            var controlNode = btnNode.parent.getChildByName("controlNode");
            for (var i = 0; i < allUserNode.length; i++) {
                var userControlNode = allUserNode[i].getChildByName("controlNode");
                if (userControlNode && controlNode != userControlNode) {
                    userControlNode.active = false;
                    userControlNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                    userControlNode.parent.height = 86;
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                //普通成员隐藏新增房间按钮
                if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
                    controlNode.getChildByName("btn_changeRoom").active = true;
                    controlNode.getChildByName("btn_delRoom").active = true;
                } else if (this.unionPostType == app.ClubManager().UNION_CLUB || this.unionPostType == app.ClubManager().UNION_GENERAL) {
                    controlNode.getChildByName("btn_changeRoom").active = false;
                    controlNode.getChildByName("btn_delRoom").active = false;
                } else {
                    controlNode.getChildByName("btn_changeRoom").active = true;
                    controlNode.getChildByName("btn_delRoom").active = true;
                }
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.selectSprite;
                btnNode.parent.height = 396;
                //请求该房间数据
                this.GetUnionRoomCfgInfo(btnNode.parent.id, btnNode.parent.getChildByName("controlNode"));
            } else {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                btnNode.parent.height = 86;
            }
        } else if ('btn_create' == btnName) {
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            var clubData = app.ClubManager().GetClubDataByClubID(sendPack.clubId);
            sendPack.cityId = clubData.cityId;
            sendPack.roomKey = 0;
            sendPack.cfgData = null;
            app.FormManager().ShowForm("UICreatRoom", { "gameList": app.Client.GetAllGameId() }, "", null, sendPack);
        } else if ('btn_changeRoom' == btnName) {
            //点击后把列表折叠
            var btn_ShowBtn = btnNode.parent.parent.getChildByName("btn_ShowBtn");
            this.OnClick(btn_ShowBtn.name, btn_ShowBtn);

            var _sendPack = app.ClubManager().GetUnionSendPackHead();
            var _clubData = app.ClubManager().GetClubDataByClubID(_sendPack.clubId);
            _sendPack.cityId = _clubData.cityId;
            _sendPack.roomKey = btnNode.parent.parent.id;
            _sendPack.cfgData = btnNode.parent.cfgData;
            var gameType = app.ShareDefine().GametTypeID2PinYin[_sendPack.cfgData.gameId];
            app.FormManager().ShowForm("UICreatRoom", { "gameList": app.Client.GetAllGameId() }, gameType, null, _sendPack);
        } else if ('btn_delRoom' == btnName) {
            this.SetWaitForConfirm("MSG_DEL_UNIONROOM", app.ShareDefine().ConfirmYN, [], [btnNode]);
        } else if ('btn_unUseing' == btnName) {
            var _sendPack2 = app.ClubManager().GetUnionSendPackHead();
            _sendPack2.unionRoomCfgId = btnNode.parent.parent.id;
            _sendPack2.status = 1; //-1空，0正常，1禁用，2解散
            this.UnionRoomCfgUpdate(_sendPack2, btnNode.parent.parent);
        } else if ('btn_useing' == btnName) {
            var _sendPack3 = app.ClubManager().GetUnionSendPackHead();
            _sendPack3.unionRoomCfgId = btnNode.parent.parent.id;
            _sendPack3.status = 0; //-1空，0正常，1禁用，2解散
            this.UnionRoomCfgUpdate(_sendPack3, btnNode.parent.parent);
        } else if ('btn_save' == btnName) {
            if (this.isClickAnyWnd) {
                this.SaveChange();
            }
        } else if ('btn_wanfaDetail' == btnName) {
            var helpNode = btnNode.parent.parent.getChildByName("helpNode");
            var lb_wanfaDetail = helpNode.getChildByName("helpScrollView").getChildByName("view").getChildByName("content").getChildByName("lb_tip_1");
            lb_wanfaDetail.getComponent(cc.Label).string = this.allPLDecStr;
            helpNode.active = true;
        } else if ('btn_helpHide' == btnName) {
            btnNode.parent.active = false;
        }
    },
    GetUnionRoomCfgList: function GetUnionRoomCfgList(isRefresh) {
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.classType = this.curType;
        var self = this;
        app.NetManager().SendPack("union.CUnionRoomCfgList", sendPack, function (serverPack) {
            if (serverPack.length > 0) {
                self.UpdateScrollView(serverPack, isRefresh);
                //刷新页数
                var lb_page = self.node.getChildByName("page").getChildByName("lb_page");
                lb_page.getComponent(cc.Label).string = self.curPage;
            } else {
                self.curPage = self.lastPage;
            }
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取列表失败", [], 3);
        });
    },
    GetUnionRoomCfgInfo: function GetUnionRoomCfgInfo(unionRoomCfgId, cfgNode) {
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.unionRoomCfgId = unionRoomCfgId;
        var self = this;
        app.NetManager().SendPack("union.CUnionRoomCfgInfo", sendPack, function (serverPack) {
            self.UndateRoomCfgInfo(serverPack, cfgNode);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取房间配置信息失败", [], 3);
        });
    },
    UndateRoomCfgInfo: function UndateRoomCfgInfo(serverPack, cfgNode) {
        if (serverPack.status == 0) {
            cfgNode.getChildByName("btn_unUseing").active = true;
            cfgNode.getChildByName("btn_useing").active = false;
        } else if (serverPack.status == 1) {
            cfgNode.getChildByName("btn_unUseing").active = false;
            cfgNode.getChildByName("btn_useing").active = true;
        } else {
            cfgNode.getChildByName("btn_unUseing").active = false;
            cfgNode.getChildByName("btn_useing").active = false;
        }
        var PLDecStr = "";
        PLDecStr += "房间比赛分门槛：" + serverPack.bRoomConfigure.roomSportsThreshold;
        PLDecStr += "，比赛分倍数：" + serverPack.bRoomConfigure.sportsDouble;
        if (typeof serverPack.bRoomConfigure.prizePool == "undefined") {
            serverPack.bRoomConfigure.prizePool = 0;
        }
        PLDecStr += "，赛事成本：" + serverPack.bRoomConfigure.prizePool;
        PLDecStr += "，房间比赛分消耗：";
        if (serverPack.bRoomConfigure.roomSportsType == 0) {
            if (typeof serverPack.bRoomConfigure.bigWinnerConsumeList == "undefined" || serverPack.bRoomConfigure.bigWinnerConsumeList.length <= 0) {
                PLDecStr += "大赢家赢比赛分>=" + serverPack.bRoomConfigure.geWinnerPoint + "时，消耗" + serverPack.bRoomConfigure.roomSportsBigWinnerConsume;
            } else {
                for (var i = 0; i < serverPack.bRoomConfigure.bigWinnerConsumeList.length; i++) {
                    PLDecStr += "大赢家赢比赛分>" + serverPack.bRoomConfigure.bigWinnerConsumeList[i].winScore + "时，消耗比赛分" + serverPack.bRoomConfigure.bigWinnerConsumeList[i].sportsPoint;
                    if (i < serverPack.bRoomConfigure.bigWinnerConsumeList.length - 1) {
                        PLDecStr += "，";
                    }
                }
            }
            if (serverPack.bRoomConfigure.twoMode) {
                PLDecStr += "；每人付" + serverPack.bRoomConfigure.roomSportsEveryoneConsume;
            }
        } else {
            PLDecStr += "每人付" + serverPack.bRoomConfigure.roomSportsEveryoneConsume;
        }
        if (serverPack.bRoomConfigure.dianbo && parseInt(serverPack.bRoomConfigure.dianbo)) {
            PLDecStr += "，携带分" + serverPack.bRoomConfigure.dianbo;
        } else PLDecStr += "，比赛分低于" + serverPack.bRoomConfigure.autoDismiss + "自动解散";
        this.allPLDecStr = PLDecStr;
        if (PLDecStr.length > 95) {
            PLDecStr = PLDecStr.substr(0, 95) + "...";
        }
        cfgNode.getChildByName("lb_PLDec").getComponent(cc.Label).string = PLDecStr;
        var wanfa = app.RoomCfgManager().WanFa(serverPack.gameId, serverPack.bRoomConfigure);
        cfgNode.getChildByName("lb_wanfa").getComponent(cc.Label).string = wanfa;
        cfgNode.cfgData = serverPack;
    },
    GetUnionRoomCount: function GetUnionRoomCount() {
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.classType = this.curType;
        var self = this;
        app.NetManager().SendPack("union.CUnionRoomCfgCount", sendPack, function (serverPack) {
            self.node.getChildByName("lb_playingRoom").getComponent(cc.Label).string = "游戏中桌子：" + serverPack.roomCount;
            self.node.getChildByName("lb_playingMember").getComponent(cc.Label).string = "游戏中人数：" + serverPack.playerCount;
            self.isUpdateDataEnd = false;
            self.InitSortToggle(serverPack.sort);
            //self.node.getChildByName("sortToggle").getComponent(cc.Toggle).isChecked = serverPack.sort;
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取房间配置失败", [], 3);
        });
    },
    UnionRoomCfgUpdate: function UnionRoomCfgUpdate(sendPack, cfgNode) {
        var self = this;
        app.NetManager().SendPack("union.CUnionRoomCfgUpdate", sendPack, function (serverPack) {
            if (serverPack == 2) {
                cfgNode.removeFromParent();
            } else if (serverPack == 1) {
                cfgNode.getChildByName("controlNode").getChildByName("btn_useing").active = true;
                cfgNode.getChildByName("controlNode").getChildByName("btn_unUseing").active = false;
            } else if (serverPack == 0) {
                cfgNode.getChildByName("controlNode").getChildByName("btn_useing").active = false;
                cfgNode.getChildByName("controlNode").getChildByName("btn_unUseing").active = true;
            }
            app.SysNotifyManager().ShowSysMsg("操作房间配置成功", [], 3);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("操作房间配置失败", [], 3);
        });
    },
    GetToggleGroupSelect: function GetToggleGroupSelect(node) {
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].getComponent(cc.Toggle).isChecked == true) {
                return i;
            }
        }
        return 1; //如果没选择，默认选中空桌固定序号-人满-已开
    },
    SaveChange: function SaveChange() {
        var roomScrollView = this.node.getChildByName("roomScrollView");
        var content = roomScrollView.getChildByName("view").getChildByName("content");
        // let selectIdList = [];
        // for (let i = 0; i < content.children.length; i++) {
        //     let selectToggle = content.children[i].getChildByName("selectToggle").getComponent(cc.Toggle);
        //     if (selectToggle.isChecked) {
        //         selectIdList.push(content.children[i].id);
        //     }
        // }
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.unionGameList = this.selectIdList;
        var self = this;
        app.NetManager().SendPack("union.CUnionRoomCfgSave", sendPack, function (serverPack) {
            app.SysNotifyManager().ShowSysMsg("保存成功", [], 3);
            self.isClickAnyWnd = false;
            self.isSaveSuccess = true;
        }, function () {
            app.SysNotifyManager().ShowSysMsg("保存失败", [], 3);
        });
        if (this.unionPostType == app.ClubManager().UNION_CREATE || this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            //桌子的排序单独发
            var sortID = this.GetToggleGroupSelect(this.node.getChildByName("sortToggleGroup"));
            var sendSortPack = app.ClubManager().GetUnionSendPackHead();
            sendSortPack.sort = sortID;
            app.NetManager().SendPack("union.CUnionSort", sendSortPack, function (serverPack) {
                // app.SysNotifyManager().ShowSysMsg("桌子排序修改成功",[],3);
            }, function () {});
        }
    },
    ShowSortToggle: function ShowSortToggle() {
        var node = this.node.getChildByName("sortToggleGroup");
        for (var i = 0; i < node.children.length; i++) {
            node.children[i].active = true;
            node.children[i].getChildByName("tip").active = false;
            node.children[i].getChildByName("Background").active = true;
            node.children[i].getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame = this.toggleIcon;
        }
        this.node.getChildByName("btn_close_toggle").active = true;
    },
    InitSortToggle: function InitSortToggle(sort) {
        var node = this.node.getChildByName("sortToggleGroup");
        for (var i = 0; i < node.children.length; i++) {
            if (i == sort) {
                node.children[i].getComponent(cc.Toggle).isChecked = true;
                node.children[i].active = true;
                node.children[i].getChildByName("tip").active = true;
                node.children[i].getChildByName("Background").active = false;
                node.children[i].getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame = ""; //toggleIcon
            } else {
                node.children[i].active = false;
            }
        }
        this.node.getChildByName("btn_close_toggle").active = false;
    },
    close_toggle: function close_toggle() {
        var sortID = this.GetToggleGroupSelect(this.node.getChildByName("sortToggleGroup"));
        this.InitSortToggle(sortID);
    },
    checkToogle: function checkToogle(event) {
        this.isClickAnyWnd = true;
        var sortid = parseInt(event.node.name.replace("sortToggle", ""));
        this.InitSortToggle(sortid);
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
        if ('MSG_DEL_UNIONROOM' == msgID) {
            var btnNode = backArgList[0];
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.unionRoomCfgId = btnNode.parent.parent.id;
            sendPack.status = 2; //-1空，0正常，1禁用，2解散
            this.UnionRoomCfgUpdate(sendPack, btnNode.parent.parent);
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
        //# sourceMappingURL=btn_WanfaNode.js.map
        