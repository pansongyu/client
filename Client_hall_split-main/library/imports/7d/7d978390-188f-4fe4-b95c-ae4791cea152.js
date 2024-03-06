"use strict";
cc._RF.push(module, '7d978OQGI9P5LlcrkeRzqFS', 'UIClubUserList');
// script/ui/club/UIClubUserList.js

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
        nullNode: cc.Node,
        memberlist_editbox: cc.EditBox,

        unSelectSprite: cc.SpriteFrame,
        selectSprite: cc.SpriteFrame
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.RegEvent("OnClubPlayerNtf", this.Event_PlayerNtf);
        this.RegEvent("OnUnionSportsPoint", this.Event_UnionSportsPoint, this);
        this.RegEvent("ChangeBeiZhu", this.Event_ChangeBeiZhu);
        this.WeChatManager = app.WeChatManager();
        // this.memberlist_scrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, unionId, unionName, unionSign) {
        this.node.getChildByName("bottom").getChildByName("FuToggle").getComponent(cc.Toggle).isChecked = false;
        this.memberPage = 1;
        this.lastMemberPage = 1;
        this.pageType = 0; //0 已经加入,1 加入为批准2 退出未批准
        //刷新页数
        var lb_page = this.node.getChildByName("bottom").getChildByName("page").getChildByName("lb_page");
        lb_page.getComponent(cc.Label).string = this.memberPage;
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.memberlist_demo.active = false;
        this.isSearching = false;
        this.memberlist_editbox.string = '';
        this.queryStr = "";
        var clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
        this.myisminister = clubData.minister;
        this.myisPartner = clubData.promotion;
        this.unionPostType = clubData.unionPostType;
        this.levelPromotion = clubData.levelPromotion;
        this.isPromotionManage = clubData.isPromotionManage;

        if (this.unionId > 0) {
            this.node.getChildByName("top").getChildByName("tip_qk").active = false;
            this.node.getChildByName("top").getChildByName("tip_pl").active = true;
            this.node.getChildByName("bottom").getChildByName("btn_plxg").active = false;
        } else {
            this.node.getChildByName("top").getChildByName("tip_qk").active = false;
            this.node.getChildByName("top").getChildByName("tip_pl").active = false;
            this.node.getChildByName("bottom").getChildByName("btn_plxg").active = false;
        }

        this.node.getChildByName("tab").active = this.myisminister > 0;
        this.node.getChildByName("bottom").getChildByName("JoinToggle").active = this.myisminister > 0;
        this.node.getChildByName("bottom").getChildByName("OutToggle").active = this.myisminister > 0;

        var self = this;
        if (this.myisminister) {
            this.InitTab();
            this.node.getChildByName("bottom").getChildByName("JoinToggle").getComponent(cc.Toggle).isChecked = clubData.joinNeedExamine;
            this.node.getChildByName("bottom").getChildByName("OutToggle").getComponent(cc.Toggle).isChecked = clubData.quitNeedExamine;

            this.node.getChildByName("bottom").getChildByName("SeeToggle").active = true;

            app.NetManager().SendPack("club.CClubGetShowOnlinePlayerNum", { "clubId": this.clubId }, function (serverPack) {
                self.node.getChildByName("bottom").getChildByName("SeeToggle").getComponent(cc.Toggle).isChecked = serverPack.showOnlinePlayerNum == 0;
            }, function () {
                self.node.getChildByName("bottom").getChildByName("SeeToggle").getComponent(cc.Toggle).isChecked = false;
            });
        } else {

            this.node.getChildByName("bottom").getChildByName("SeeToggle").active = false;
        }

        this.GetPalyerList(true);
        var sendOnlinePack = {};
        sendOnlinePack.clubId = this.clubId;
        app.NetManager().SendPack("club.CClubOnlinePlayerCount", sendOnlinePack, function (serverPack) {
            if (serverPack >= 0) {
                self.node.getChildByName("bottom").getChildByName("lb_OnlineCount").getComponent(cc.Label).string = "在线人数：" + serverPack + "人";
            } else {
                self.node.getChildByName("bottom").getChildByName("lb_OnlineCount").getComponent(cc.Label).string = "在线人数：**人";
            }
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取在线人数失败", [], 3);
        });
    },
    Event_ChangeBeiZhu: function Event_ChangeBeiZhu(event) {
        for (var i = 0; i < this.memberlist_layout.children.length; i++) {
            if (this.memberlist_layout.children[i].name == event.pid.toString()) {
                this.memberlist_layout.children[i].getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetNameByIndex(event.name, 10);
                return;
            }
        }
    },
    //初始化tab
    InitTab: function InitTab() {
        var tab = this.node.getChildByName("tab");
        if (this.pageType == 0) {
            tab.getChildByName("btn_user_list").getChildByName("off").active = false;
            tab.getChildByName("btn_join_list").getChildByName("off").active = true;
            tab.getChildByName("btn_out_list").getChildByName("off").active = true;
        } else if (this.pageType == 1) {
            tab.getChildByName("btn_user_list").getChildByName("off").active = true;
            tab.getChildByName("btn_join_list").getChildByName("off").active = false;
            tab.getChildByName("btn_out_list").getChildByName("off").active = true;
        } else if (this.pageType == 2) {
            tab.getChildByName("btn_user_list").getChildByName("off").active = true;
            tab.getChildByName("btn_join_list").getChildByName("off").active = true;
            tab.getChildByName("btn_out_list").getChildByName("off").active = false;
        }
    },
    GetJoinOutCheck: function GetJoinOutCheck() {
        var join = this.node.getChildByName("bottom").getChildByName("JoinToggle").getComponent(cc.Toggle).isChecked;
        var out = this.node.getChildByName("bottom").getChildByName("OutToggle").getComponent(cc.Toggle).isChecked;
        var joineInt = 0;
        var outInt = 0;
        if (join) {
            joineInt = 1;
        }
        if (out) {
            outInt = 1;
        }
        return { "joinNeedExamine": joineInt, "quitNeedExamine": outInt };
    },
    GetPalyerList: function GetPalyerList() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pageNum = this.memberPage;
        sendPack.query = this.ComTool.GetBeiZhuID(this.queryStr);
        sendPack.pageType = this.pageType;
        if (this.queryStr != "") {
            this.isSearching = true;
        } else {
            this.isSearching = false;
        }
        //是否勾选只显示在线的
        var isShowOnline = this.node.getChildByName("bottom").getChildByName("OnlineToggle").getComponent(cc.Toggle).isChecked;
        if (isShowOnline && this.pageType == 0) {
            //加入和退出要显示全部
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
        app.NetManager().SendPack('club.CClubGetMemberManage', sendPack, function (serverPack) {
            if (serverPack.length > 0) {
                self.ShowMemberList(serverPack, isRefresh);
                //刷新页数
                var lb_page = self.node.getChildByName("bottom").getChildByName("page").getChildByName("lb_page");
                lb_page.getComponent(cc.Label).string = self.memberPage;
            } else {
                self.memberPage = self.lastMemberPage;
            }
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
    Event_UnionSportsPoint: function Event_UnionSportsPoint(event) {
        for (var j = 0; j < this.memberlist_layout.children.length; j++) {
            if (this.unionId > 0 && this.clubId == event.clubId && this.memberlist_layout.children[j].playerData.shortPlayer.pid == event.pid) {
                this.memberlist_layout.children[j].playerData.sportsPoint = event.sportsPoint;
                this.memberlist_layout.children[j].getChildByName('pl').getComponent(cc.Label).string = event.sportsPoint;
                break;
            }
        }
    },
    SortPlayerByIsminister: function SortPlayerByIsminister(a, b) {
        if (a.minister && b.minister) return a.time - b.time;else if (!a.minister && !b.minister) {
            if (a.status == app.ClubManager().Enum_NotAgree) {
                return -1;
            } else if (b.status == app.ClubManager().Enum_NotAgree) {
                return 1;
            }
            return a.time - b.time;
        } else if (a.minister && !b.minister) return -1;else if (!a.minister && b.minister) return 1;
    },
    GetNextPage: function GetNextPage() {
        this.memberPage++;
        this.GetPalyerList(false);
    },
    ShowMemberList: function ShowMemberList(playerlist, isRefresh) {
        var joinState = app.ClubManager().Enum_Join;
        var notAgreeState = app.ClubManager().Enum_NotAgree;
        var notAgreeStateOut = app.ClubManager().Enum_NotAgreeOut;
        if (isRefresh) {
            this.memberlist_scrollView.scrollToTop();
            //this.memberlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.memberlist_layout);
        }
        for (var i = 0; i < playerlist.length; i++) {
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            var isExist = false;
            for (var j = 0; j < this.memberlist_layout.children.length; j++) {
                if (this.memberlist_layout.children[j].playerData.shortPlayer.pid == playerlist[i].shortPlayer.pid) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            if (joinState == playerlist[i].status || notAgreeState == playerlist[i].status || notAgreeStateOut == playerlist[i].status) {
                var heroID = playerlist[i].shortPlayer.pid;
                var shortHeroID = this.ComTool.GetPid(heroID);
                var nodePrefab = cc.instantiate(this.memberlist_demo);
                nodePrefab.name = heroID.toString();
                nodePrefab.minister = playerlist[i].minister;
                var selfHeroID = app.HeroManager().GetHeroProperty("pid");
                if (heroID == selfHeroID || nodePrefab.minister == app.ClubManager().Club_MINISTER_CREATER && app.ClubManager().GetUnionTypeByLastClubData() != 1) {
                    //自己和创建者不能操作
                    nodePrefab.getChildByName('btn_control').active = true;
                } else {
                    nodePrefab.getChildByName('btn_control').active = true;
                }
                nodePrefab.playerData = playerlist[i];
                var headImageUrl = playerlist[i].shortPlayer.iconUrl;
                nodePrefab.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerlist[i].shortPlayer.pid, playerlist[i].shortPlayer.name);

                nodePrefab.getChildByName('name').playerData = playerlist[i].shortPlayer;
                nodePrefab.getChildByName('head').playerData = playerlist[i].shortPlayer;

                nodePrefab.getChildByName('id').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(heroID);

                nodePrefab.getChildByName('promoterName').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerlist[i].upShortPlayer.pid, playerlist[i].upShortPlayer.name);

                nodePrefab.getChildByName('promoterId').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(playerlist[i].upShortPlayer.pid);
                nodePrefab.getChildByName('promoterId').pid = playerlist[i].shortPlayer.pid;

                if (this.unionId > 0) {
                    nodePrefab.getChildByName('quanka').getComponent(cc.Label).string = "";
                } else {
                    nodePrefab.getChildByName('quanka').getComponent(cc.Label).string = playerlist[i].playerClubCard;
                }
                var controlNode = nodePrefab.getChildByName('controlNode');
                if (this.unionId > 0) {
                    nodePrefab.getChildByName('pl').getComponent(cc.Label).string = playerlist[i].sportsPoint;
                    controlNode.getChildByName('btn_setPL').active = true;
                    controlNode.getChildByName('btn_jjdz').active = true;
                } else {
                    nodePrefab.getChildByName('pl').getComponent(cc.Label).string = "";
                    controlNode.getChildByName('btn_setPL').active = false;
                    controlNode.getChildByName('btn_jjdz').active = false;
                }
                if (playerlist[i].minister > 0) {
                    controlNode.getChildByName('btn_setPL').getChildByName("label").getComponent(cc.Label).string = "授权比赛分";
                } else {
                    controlNode.getChildByName('btn_setPL').getChildByName("label").getComponent(cc.Label).string = "修改比赛分";
                }
                controlNode.getChildByName('btn_tichu').active = false;
                controlNode.getChildByName('btn_qxgl').active = false;
                controlNode.getChildByName('btn_swgl').active = false;
                controlNode.getChildByName('btn_swssgl').active = false;
                controlNode.getChildByName('btn_swtgygl').active = false;
                controlNode.getChildByName('btn_qxtgygl').active = false;
                controlNode.getChildByName('btn_jzyx').active = false;
                controlNode.getChildByName('btn_qxjz').active = false;
                controlNode.getChildByName('btn_csxg').active = false;
                controlNode.getChildByName('btn_spWarningPersonal').active = false;
                controlNode.getChildByName('btn_csxg').heroID = heroID.toString();
                controlNode.getChildByName('btn_csxg').heroName = this.ComTool.GetBeiZhuName(playerlist[i].shortPlayer.pid, playerlist[i].shortPlayer.name);
                //职务
                if (playerlist[i].minister) {
                    if (playerlist[i].minister == app.ClubManager().Club_MINISTER_MGR) {
                        nodePrefab.getChildByName('zhiwu').getComponent(cc.Label).string = "管理员";
                        //如果自己是创建者，隐藏
                        nodePrefab.getChildByName('controlNode').active = false;
                    } else if (playerlist[i].minister == app.ClubManager().Club_MINISTER_MGRSS) {
                        nodePrefab.getChildByName('zhiwu').getComponent(cc.Label).string = "赛事管理员";
                        //如果自己是创建者，隐藏
                        nodePrefab.getChildByName('controlNode').active = false;
                    } else if (playerlist[i].minister == app.ClubManager().Club_MINISTER_CREATER) {
                        nodePrefab.getChildByName('zhiwu').getComponent(cc.Label).string = "创建者";
                        //如果自己是创建者，隐藏
                        nodePrefab.getChildByName('controlNode').active = false;
                    }
                    if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER && heroID != app.HeroManager().GetHeroID()) {
                        //我自己是创建者，并且该玩家是管理员或者赛事管理员
                        nodePrefab.getChildByName('controlNode').active = true;
                        controlNode.getChildByName('btn_qxgl').active = true;
                        if (playerlist[i].minister == app.ClubManager().Club_MINISTER_MGRSS) {
                            //赛事管理员情况下，显示普通管理员设置按钮
                            controlNode.getChildByName('btn_swgl').active = true;
                        } else if (playerlist[i].minister == app.ClubManager().Club_MINISTER_MGR) {
                            //普通管理员情况下，显示设置赛事管理员按钮,本人是赛事管理才能显示
                            if (this.unionPostType == 3) {
                                controlNode.getChildByName('btn_swssgl').active = true;
                            } else {
                                controlNode.getChildByName('btn_swssgl').active = false;
                            }
                        }
                    }
                    if (heroID == app.HeroManager().GetHeroID()) {
                        controlNode.getChildByName('btn_tichu').active = false;
                        controlNode.getChildByName('btn_swgl').active = false;
                        controlNode.getChildByName('btn_swssgl').active = false;
                    }
                    if (playerlist[i].minister == 2) {
                        controlNode.getChildByName('btn_csxg').active = false;
                    } else {
                        if (this.myisminister == 2) {
                            controlNode.getChildByName('btn_csxg').active = true;
                        } else {
                            controlNode.getChildByName('btn_csxg').active = false;
                        }
                    }
                } else {
                    if (joinState == playerlist[i].status) {
                        if (playerlist[i].minister == app.ClubManager().Club_MINISTER_GENERAL) {
                            controlNode.getChildByName('btn_spWarningPersonal').active = true;
                        }
                        nodePrefab.getChildByName('zhiwu').getComponent(cc.Label).string = "成员";
                        if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
                            if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
                                controlNode.getChildByName('btn_swgl').active = true;
                                if (this.unionPostType == 3) {
                                    controlNode.getChildByName('btn_swssgl').active = true;
                                } else {
                                    controlNode.getChildByName('btn_swssgl').active = false;
                                }
                                controlNode.getChildByName('btn_tichu').active = true;
                            } else if (this.myisminister == app.ClubManager().Club_MINISTER_MGR) {
                                controlNode.getChildByName('btn_tichu').active = true;
                            }
                        }
                        if (playerlist[i].isBanGame) {
                            if (this.myisminister > 0) {
                                controlNode.getChildByName('btn_qxjz').active = true;
                            } else {
                                controlNode.getChildByName('btn_qxjz').active = false;
                            }
                        } else {
                            if (this.myisminister > 0) {
                                controlNode.getChildByName('btn_jzyx').active = true;
                            } else {
                                controlNode.getChildByName('btn_jjdz').active = this.levelPromotion <= 0;
                                controlNode.getChildByName('btn_tichu').active = false;
                                /*controlNode.getChildByName('btn_tichu').active= this.levelPromotion<=0; */
                                controlNode.getChildByName('btn_jzyx').active = this.levelPromotion <= 0; //推广员不显示禁止游戏按钮
                            }
                        }
                        if (this.myisminister == 2) {
                            controlNode.getChildByName('btn_csxg').active = true;
                        } else {
                            controlNode.getChildByName('btn_csxg').active = false; //推广员不显示从属修改按钮
                        }
                    }
                    if (notAgreeState == playerlist[i].status || notAgreeStateOut == playerlist[i].status) {
                        nodePrefab.getChildByName('zhiwu').getComponent(cc.Label).string = "待审核";
                        controlNode.getChildByName('btn_spWarningPersonal').active = false;
                        if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
                            controlNode.getChildByName('btn_refuse').active = true;
                            controlNode.getChildByName('btn_agree').active = true;
                            controlNode.getChildByName('btn_setPL').active = false;
                            controlNode.getChildByName('btn_tichu').active = false;
                            controlNode.getChildByName('btn_jjdz').active = false;
                            controlNode.active = false;
                        }
                    }
                }
                if (this.levelPromotion && heroID != app.HeroManager().GetHeroID()) {
                    if (playerlist[i].isPromotionManage) {
                        controlNode.getChildByName('btn_qxtgygl').active = true;
                    } else {
                        controlNode.getChildByName('btn_swtgygl').active = true;
                    }
                }

                //合伙人不显示从属修改
                /*if (playerlist[i].promotion == app.ClubManager().Club_PARTNER_ONE) {
                    controlNode.getChildByName('btn_csxg').active = false;
                }*/
                controlNode.active = false;
                nodePrefab.active = true;
                this.memberlist_layout.addChild(nodePrefab);
                if (headImageUrl) {
                    this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                    var WeChatHeadImage = nodePrefab.getChildByName('head').getComponent("WeChatHeadImage");
                    WeChatHeadImage.OnLoad();
                    WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                }
            }
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
        var lbSure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
        var lbCancle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content, lbSure, lbCancle);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_CLUB_DissolveRoomCfg' == msgID) {
            var roomData = backArgList[0];
            var jesanState = app.ClubManager().Enum_RoomCfg_Delete;
            app.ClubManager().SendSetRoomCfg(this.clubId, roomData.gameIndex, jesanState);
        } else if ('MSG_CLUB_DissolveRoom' == msgID) {
            app.ClubManager().SendCloseClub(this.clubId);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        } else if ('MSG_CLUB_EXIT' == msgID) {
            app.ClubManager().SendPlayerStateChange(this.clubId, app.HeroManager().GetHeroProperty("pid"), app.ClubManager().Enum_Leave);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        } else if ('MSG_CLUB_KICKPlayer' == msgID) {
            var data = backArgList[0];
            app.ClubManager().SendPlayerStateChange(data.clubId, data.pid, data.kickState);
        } else if ('MSG_CLUB_SetManager' == msgID) {
            var _data = backArgList[0];
            app.ClubManager().SendSetClubMinister(_data.clubId, _data.pid, _data.state);
        } else if ('MSG_CLUB_SetPromoterManager' == msgID) {
            var _data2 = backArgList[0];
            app.ClubManager().SendSetPromotionMinister(_data2.clubId, _data2.pid, _data2.state);
        }
    },
    BeiZhu: function BeiZhu(event) {
        this.FormManager.ShowForm("UIUserBeiZhu", this.clubId, event.playerData);
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
            this.queryStr = this.ComTool.GetBeiZhuID(this.memberlist_editbox.string);
            this.GetPalyerList(true);
        } else if ("btn_user_list" == btnName) {
            this.memberPage = 1;
            this.pageType = 0;
            this.DestroyAllChildren(this.memberlist_layout);
            this.GetPalyerList(true);
            this.InitTab();
        } else if ("btn_join_list" == btnName) {
            this.memberPage = 1;
            this.pageType = 1;
            this.DestroyAllChildren(this.memberlist_layout);
            this.GetPalyerList(true);
            this.InitTab();
        } else if ("btn_out_list" == btnName) {
            this.memberPage = 1;
            this.pageType = 2;
            this.DestroyAllChildren(this.memberlist_layout);
            this.GetPalyerList(true);
            this.InitTab();
        } else if ("name" == btnName || "head" == btnName) {
            this.BeiZhu(btnNode);
        } else if ('btn_close' == btnName) {
            this.CloseForm();
        } else if (btnName == "btn_refuse") {
            if (this.pageType < 2) {
                //加入状态
                app.ClubManager().SendPlayerStateChange(this.clubId, btnNode.parent.parent.name, app.ClubManager().Enum_Refuse);
            } else {
                //退出状态
                app.ClubManager().SendPlayerStateChange(this.clubId, btnNode.parent.parent.name, app.ClubManager().Enum_Refuse, true);
            }
            //删除节点
            btnNode.parent.parent.destroy();
        } else if (btnName == "btn_agree") {
            if (this.pageType < 2) {
                //加入状态
                app.ClubManager().SendPlayerStateChange(this.clubId, btnNode.parent.parent.name, app.ClubManager().Enum_Join);
            } else {
                //退出状态
                app.ClubManager().SendPlayerStateChange(this.clubId, btnNode.parent.parent.name, app.ClubManager().Enum_Leave, true);
            }
            //删除节点
            btnNode.parent.parent.destroy();
        } else if (btnName == "btn_tichu") {
            var data = {};
            data.clubId = this.clubId;
            data.pid = btnNode.parent.parent.name;
            data.kickState = app.ClubManager().Enum_Kick;
            var name = btnNode.parent.parent.getChildByName('name').getComponent(cc.Label).string;
            this.SetWaitForConfirm('MSG_CLUB_KICKPlayer', this.ShareDefine.Confirm, [name], [data]);
        } else if (btnName == "btn_qxgl") {
            app.ClubManager().SendSetClubMinister(this.clubId, btnNode.parent.parent.name, 0);
        } else if (btnName == "btn_swgl") {
            var _data3 = {};
            _data3.clubId = this.clubId;
            _data3.pid = btnNode.parent.parent.name;
            _data3.state = 1;
            var _name = btnNode.parent.parent.getChildByName('name').getComponent(cc.Label).string;
            this.SetWaitForConfirm('MSG_CLUB_SetManager', this.ShareDefine.Confirm, [], [_data3], "是否将{" + _name + "}设为亲友圈管理？");
            // app.ClubManager().SendSetClubMinister(this.clubId,btnNode.parent.parent.name,1);
        } else if (btnName == "btn_qxtgygl") {
            app.ClubManager().SendSetPromotionMinister(this.clubId, btnNode, 0);
        } else if (btnName == "btn_swtgygl") {
            var _data4 = {};
            _data4.clubId = this.clubId;
            _data4.pid = btnNode;
            _data4.state = 1;
            var _name2 = btnNode.parent.parent.getChildByName('name').getComponent(cc.Label).string;
            this.SetWaitForConfirm('MSG_CLUB_SetPromoterManager', this.ShareDefine.Confirm, [], [_data4], "是否将{" + _name2 + "}设为推广员管理？");
            // app.ClubManager().SendSetPromotionMinister(this.clubId,btnNode,1);
        } else if (btnName == "btn_swssgl") {
            app.ClubManager().SendSetClubMinister(this.clubId, btnNode.parent.parent.name, 3);
        } else if (btnName == "btn_ShowBtn" || btnName == "btn_control") {
            var heroID = app.HeroManager().GetHeroProperty("pid");
            if ((btnNode.parent.name == heroID || btnNode.parent.minister == app.ClubManager().Club_MINISTER_CREATER) && app.ClubManager().GetUnionTypeByLastClubData() != 1) {
                //自己和创建者不能操作
                return;
            }
            var allUserNode = btnNode.parent.parent.children;
            var controlNode = btnNode.parent.getChildByName("controlNode");
            for (var i = 0; i < allUserNode.length; i++) {
                var userControlNode = allUserNode[i].getChildByName("controlNode");
                if (userControlNode && controlNode != userControlNode) {
                    userControlNode.active = false;
                    userControlNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                    userControlNode.parent.height = 100;
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.selectSprite;
                btnNode.parent.height = 280;
            } else {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                btnNode.parent.height = 100;
            }
        } else if (btnName == "btn_jzyx") {
            app.FormManager().ShowForm("ui/club/UIForbidRoomCfg", this.clubId, btnNode.parent.parent.name, true);
            // app.ClubManager().SendSetClubBanGame(this.clubId,btnNode.parent.parent.name,true);
        } else if (btnName == "btn_qxjz") {
            app.FormManager().ShowForm("ui/club/UIForbidRoomCfg", this.clubId, btnNode.parent.parent.name, true);
            // app.ClubManager().SendSetClubBanGame(this.clubId,btnNode.parent.parent.name,false);
        } else if ('btn_csxg' == btnName) {
            var self = this;
            app.NetManager().SendPack("club.CClubGetUplevelPromotion", { "clubId": this.clubId, "pid": btnNode.heroID }, function (serverPack) {
                app.FormManager().ShowForm("ui/club/UIPromoterSet", self.clubId, btnNode.heroID, serverPack.player);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取上级推广员失败", [], 3);
            });
        } else if ('btn_setPL' == btnName) {
            var clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!clubData) {
                return;
            }
            var _self = this;
            var playerData = btnNode.parent.parent.playerData;
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.opPid = playerData.shortPlayer.pid;
            app.NetManager().SendPack("club.CClubMemberSportsPointInfo", sendPack, function (serverPack) {
                var data = { "name": playerData.shortPlayer.name,
                    "pid": _self.ComTool.GetPid(playerData.shortPlayer.pid),
                    "targetPL": serverPack.sportsPoint,
                    "owerPL": serverPack.allowSportsPoint,
                    "myisminister": playerData.minister
                };

                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UIUserSetPL_2", data, false);
                } else {
                    app.FormManager().ShowForm("ui/club/UIUserSetPL", data, false);
                }

                //app.FormManager().ShowForm("ui/club/UIUserSetPL",data,false);
            }, function () {});
        } else if ('btn_jjdz' == btnName) {
            var _playerData = btnNode.parent.parent.playerData;
            app.FormManager().ShowForm('ui/club/UIClubUserMessageNew', this.clubId, this.unionId, this.unionName, this.unionSign, this.ComTool.GetPid(_playerData.shortPlayer.pid));
        } else if ('promoterId' == btnName) {
            if (this.pageType == 1) {
                return; //加入审核不需要显示这个
            }
            var _self2 = this;
            app.NetManager().SendPack("club.CClubGetMembePromotionList", { "clubId": this.clubId, "query": btnNode.pid }, function (serverPack) {
                app.FormManager().ShowForm("ui/club/UIClubPromotionDetail", serverPack, _self2.myisminister, _self2.levelPromotion);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取所属推广明细失败，请稍后再试", [], 3);
            });
        } else if ("btn_spWarningPersonal" == btnName) {
            var _clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!_clubData) {
                return;
            }
            var _sendPack = {};
            _sendPack.clubId = this.clubId;
            _sendPack.pid = btnNode.parent.parent.playerData.shortPlayer.pid;
            app.NetManager().SendPack("club.CClubPersonalSportsPointWaningInfo", _sendPack, function (serverPack) {
                //默认是普通成员的修改
                var data = {
                    "name": serverPack.name,
                    "pid": app.ComTool().GetPid(serverPack.pid),
                    "warnStatus": serverPack.personalWarnStatus,
                    "sportsPointWarning": serverPack.personalSportsPointWarning,
                    "isPersonal": true
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UISetSportsPointWarning_2", data);
                } else {
                    app.FormManager().ShowForm("ui/club/UISetSportsPointWarning", data);
                }
            }, function () {});
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

    OnClickSeeToggle: function OnClickSeeToggle(event) {
        var isShow = event.node.getComponent(cc.Toggle).isChecked;
        var sendNum = 0;
        if (isShow == false) {
            sendNum = 1;
        }
        app.NetManager().SendPack("club.CClubChangeShowOnlinePlayerNum", { "clubId": this.clubId, "showOnlinePlayerNum": sendNum }, function (serverPack) {}, function () {});
    },

    OnClickFuToggle: function OnClickFuToggle(event) {
        this.memberPage = 1;
        this.lastMemberPage = 1;
        this.DestroyAllChildren(this.memberlist_layout);
        this.memberlist_scrollView.scrollToTop();
        this.GetPalyerList(true);
    },

    OnClickJoinOutToggle: function OnClickJoinOutToggle(event) {
        var self = this;
        var sendPack = this.GetJoinOutCheck();
        sendPack.clubId = this.clubId;
        app.NetManager().SendPack("club.CClubChangeQuitAndJoinConfig", sendPack, function (success) {
            //成功后刷新会亲友圈
            var clubData = app.ClubManager().GetClubDataByClubID(self.clubId);
            clubData.joinNeedExamine = sendPack.joinNeedExamine;
            clubData.quitNeedExamine = sendPack.quitNeedExamine;
            self.node.getChildByName("bottom").getChildByName("JoinToggle").getComponent(cc.Toggle).isChecked = sendPack.joinNeedExamine;
            self.node.getChildByName("bottom").getChildByName("OutToggle").getComponent(cc.Toggle).isChecked = sendPack.quitNeedExamine;
        }, function (error) {});
    }
});

cc._RF.pop();