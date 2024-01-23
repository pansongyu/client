"use strict";
cc._RF.push(module, '2f616CsNuZLEKStsL8Xk4ZU', 'UIClubRecordUser');
// script/ui/club/UIClubRecordUser.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        recordlist_scrollView: cc.ScrollView,
        recordlist_layout: cc.Node,
        recordlist_room_demo: cc.Node,
        top: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.WeChatManager = app.WeChatManager();
        this.lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        this.pageEditBox = this.node.getChildByName("pageGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        this.roomEditBox = this.node.getChildByName("roomGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        // this.recordlist_scrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, roomIDList, playerData, isAll, getType, isShowAllClub, unionId) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.isShowAllClub = isShowAllClub;
        this.roomIDList = roomIDList;
        this.isAll = isAll;
        this.getType = getType;
        this.recordPage = 1;
        this.pageNumTotal = 1;
        this.lastRecordPage = 1;
        //刷新页数
        this.pageEditBox.string = "";
        this.roomEditBox.string = "";
        this.lb_page.getComponent(cc.Label).string = this.recordPage + "/" + this.pageNumTotal;
        this.toBttom = false;
        this.recordlist_room_demo.active = false;
        this.pid = playerData['player'].pid;
        var that = this;
        var sendPack = { "clubId": this.clubId, "pid": this.pid, "roomIDList": this.roomIDList, "isAll": this.isAll, "getType": this.getType, "pageNum": this.recordPage };
        if (this.unionId > 0 && this.isShowAllClub) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        //请求总页数
        this.NetManager.SendPack("club.CClubPersonalRecordGetPageNum", sendPack, function (event) {
            that.pageNumTotal = event.pageNumTotal;
            that.lb_page.getComponent(cc.Label).string = that.recordPage + "/" + that.pageNumTotal;
        }, function (error) {});
        this.GetPersonalRecord(playerData['player'].pid, true);
        this.InitTop(playerData);
    },
    InitTop: function InitTop(playerData) {
        this.top.getChildByName('lb_cayu').getComponent(cc.Label).string = "参与:" + playerData['size'] + "场";
        this.top.getChildByName('lb_yingjia').getComponent(cc.Label).string = "大赢家:" + playerData['winner'] + "场";
        this.top.getChildByName('lb_fangka').getComponent(cc.Label).string = "钻石:" + playerData.roomCardSize + "场/" + playerData.roomCard + "个";
        this.top.getChildByName('lb_quanka').getComponent(cc.Label).string = ""; //"圈卡:"+playerData.clubCardSize+"场/"+playerData.clubCard+"张";
        this.top.getChildByName('lb_point').getComponent(cc.Label).string = playerData.point;
        this.top.getChildByName('user').getChildByName('lb_name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerData['player'].pid, playerData['player'].name);
        this.top.getChildByName('user').getChildByName('lb_id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(playerData['player'].pid) });
        if (playerData['player'].iconUrl) {
            this.WeChatManager.InitHeroHeadImage(playerData['player'].pid, playerData['player'].iconUrl);
            var WeChatHeadImage = this.top.getChildByName('user').getChildByName('head').getComponent("WeChatHeadImage");
            WeChatHeadImage.ShowHeroHead(playerData['player'].pid, playerData['player'].iconUrl);
        }
    },
    //---------点击函数---------------------
    GetPersonalRecord: function GetPersonalRecord(pid) {
        var isRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var roomStr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        if (this.isAll) {
            this.roomIDList = [];
        }
        var that = this;
        var sendPack = { "clubId": this.clubId, "pid": pid, "roomIDList": this.roomIDList, "isAll": this.isAll, "getType": this.getType, "pageNum": this.recordPage, "query": roomStr };
        if (this.unionId > 0 && this.isShowAllClub) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        this.NetManager.SendPack("club.CClubPersonalRecord", sendPack, function (event) {
            if (event.length > 0) {
                that.ShowRecordList(event, isRefresh);
                //刷新页数
                if (roomStr) {
                    that.lb_page.getComponent(cc.Label).string = "1/1";
                } else {
                    that.lb_page.getComponent(cc.Label).string = that.recordPage + "/" + that.pageNumTotal;
                }
            } else {
                that.recordPage = that.lastRecordPage;
            }
            that.toBttom = false;
        }, function (error) {});
    },
    GetNextPage: function GetNextPage() {
        if (this.toBttom == true) {
            return;
        }
        this.toBttom = true;
        this.recordPage++;
        this.GetPersonalRecord(this.pid, false);
    },
    ShowRecordList: function ShowRecordList(recordInfos, isRefresh) {
        if (isRefresh) {
            this.recordlist_scrollView.scrollToTop();
            //this.recordlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.recordlist_layout);
        }
        //this.top.getChildByName('lb_fangka').getComponent(cc.Label).string='总消耗房卡:'+roomCardTotalCount;
        for (var i = 0; i < recordInfos.length; i++) {
            var nodePrefab = cc.instantiate(this.recordlist_room_demo);
            nodePrefab.name = "record" + i;

            nodePrefab.getChildByName('room_key').getComponent(cc.Label).string = recordInfos[i].roomKey;
            if (recordInfos[i].configName == "") {
                nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string = this.ShareDefine.GametTypeID2Name[recordInfos[i].gameType];
            } else {
                nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string = recordInfos[i].configName;
            }

            if (recordInfos[i].roomState == 1) {
                nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string = "游戏中";
                nodePrefab.getChildByName('datetime').getComponent(cc.Label).string = "";
            } else {
                nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string = "";
                nodePrefab.getChildByName('datetime').getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(recordInfos[i].endTime);
            }

            if (recordInfos[i].roomCard > 0) {
                nodePrefab.getChildByName('icon_fk').active = true;
                nodePrefab.getChildByName('icon_qk').active = false;
                nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string = 'X' + recordInfos[i].roomCard;
            } else {
                nodePrefab.getChildByName('icon_fk').active = false;
                nodePrefab.getChildByName('icon_qk').active = false; //隐藏圈卡
                nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string = ""; //'X'+recordInfos[i].clubCard;
            }

            if (recordInfos[i].unionId > 0) {
                nodePrefab.getChildByName('icon_pl').active = true;
                nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = 'X' + recordInfos[i].roomSportsConsume;
            } else {
                nodePrefab.getChildByName('icon_pl').active = false;
                nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = '';
            }

            nodePrefab.gameType = recordInfos[i].gameType;
            nodePrefab.roomID = recordInfos[i].roomID;
            nodePrefab.roomKey = recordInfos[i].roomKey;
            nodePrefab.playerList = JSON.parse(recordInfos[i].playerList);
            nodePrefab.datainfo = recordInfos[i];
            nodePrefab.active = true;
            this.recordlist_layout.addChild(nodePrefab);
            this.ShowUserList(nodePrefab.getChildByName('user_layout'), recordInfos[i].playerList);
        }
    },
    ShowUserList: function ShowUserList(layoutNode, playerList) {
        playerList = JSON.parse(playerList);
        //layoutNode.removeAllChildren();
        this.DestroyAllChildren(layoutNode);
        var demoNode = layoutNode.parent.getChildByName('userDemo');
        var playerids = [];
        var heightTemp = 175;
        layoutNode.parent.height = 175 + parseInt((playerList.length - 1) / 4) * 175;
        for (var i = 0; i < playerList.length; i++) {
            var node = cc.instantiate(demoNode);
            layoutNode.addChild(node);
            node.active = true;
            var player = playerList[i];
            node.getChildByName('lb_name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(player.pid, player.name);
            node.getChildByName('lb_id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(player.pid) });
            var bisai = false;
            if (typeof player.sportsPoint != "undefined") {
                bisai = true;
                if (player.sportsPoint > 0) {
                    node.getChildByName('lb_pl').getComponent(cc.Label).string = "赛:+" + player.sportsPoint;
                    node.getChildByName('lb_pl').color = cc.color(228, 38, 38);
                } else {
                    node.getChildByName('lb_pl').getComponent(cc.Label).string = "赛:" + player.sportsPoint;
                    node.getChildByName('lb_pl').color = cc.color(70, 169, 77);
                }
            } else {
                node.getChildByName('lb_pl').getComponent(cc.Label).string = "";
            }
            playerids.push(player.pid);
            if (player.point > 0) {
                if (bisai == true) {
                    if (typeof player.clubName == "undefined") {
                        node.getChildByName('lb_code').active = true;
                        node.getChildByName('lb_clubName').active = false;
                        node.getChildByName('lb_code').getComponent(cc.Label).string = '得分:+' + player.point;
                        node.getChildByName('lb_code').color = cc.color(168, 95, 54);

                        node.getChildByName('lb_code').getComponent(cc.Label).fontSize = 24;
                        node.getChildByName('lb_name').y = 7;
                        node.getChildByName('lb_id').y = -20;
                    } else {
                        node.getChildByName('lb_code').active = false;
                        node.getChildByName('lb_clubName').active = true;
                        node.getChildByName("lb_clubName").getComponent(cc.Label).string = '圈:' + player.clubName;
                    }
                } else {
                    node.getChildByName('lb_code').active = true;
                    node.getChildByName('lb_clubName').active = false;
                    node.getChildByName('lb_code').getComponent(cc.Label).string = '+' + player.point;
                    node.getChildByName('lb_code').color = cc.color(228, 38, 38);
                    node.getChildByName('lb_code').getComponent(cc.Label).fontSize = 50;
                    node.getChildByName('lb_name').y = -5;
                    node.getChildByName('lb_id').y = -35;
                }
            } else {
                if (bisai == true) {
                    if (typeof player.clubName == "undefined") {
                        node.getChildByName('lb_code').active = true;
                        node.getChildByName('lb_clubName').active = false;
                        node.getChildByName('lb_code').getComponent(cc.Label).string = "得分:" + player.point;
                        node.getChildByName('lb_code').color = cc.color(168, 95, 54);
                        node.getChildByName('lb_code').getComponent(cc.Label).fontSize = 24;
                        node.getChildByName('lb_name').y = 7;
                        node.getChildByName('lb_id').y = -20;
                    } else {
                        node.getChildByName('lb_code').active = false;
                        node.getChildByName('lb_clubName').active = true;
                        node.getChildByName("lb_clubName").getComponent(cc.Label).string = '圈:' + player.clubName;
                    }
                } else {
                    node.getChildByName('lb_code').active = true;
                    node.getChildByName('lb_clubName').active = false;
                    node.getChildByName('lb_code').getComponent(cc.Label).string = player.point;
                    node.getChildByName('lb_code').color = cc.color(70, 169, 77);
                    node.getChildByName('lb_code').getComponent(cc.Label).fontSize = 50;
                    node.getChildByName('lb_name').y = -15;
                    node.getChildByName('lb_id').y = -45;
                }
            }
            if (player.iconUrl) {
                this.WeChatManager.InitHeroHeadImage(player.pid, player.iconUrl);
                var WeChatHeadImage = node.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.ShowHeroHead(player.pid, player.iconUrl);
            }
        }
    },

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.DestroyAllChildren(this.recordlist_layout);
            this.CloseForm();
        } else if ('btn_next' == btnName) {
            this.lastRecordPage = this.recordPage;
            this.recordPage++;
            this.GetPersonalRecord(this.pid, true);
        } else if ('btn_last' == btnName) {
            if (this.recordPage <= 1) {
                return;
            }
            this.lastRecordPage = this.recordPage;
            this.recordPage--;
            this.GetPersonalRecord(this.pid, true);
        } else if (btnName == "btn_record_info") {
            var gameType = btnNode.parent.gameType;
            var roomID = btnNode.parent.roomID;
            var roomKey = btnNode.parent.roomKey;
            var playerList = btnNode.parent.playerList;
            var datainfo = btnNode.parent.datainfo;
            if (this.ShareDefine.GameType_PYZHW == gameType) {
                var smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                var path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path, roomID, playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_BP == gameType) {
                var _smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path = "ui/uiGame/" + _smallName + "/UIRecordAllResult_" + _smallName;
                this.FormManager.ShowForm(_path, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_CDP == gameType) {
                var _smallName2 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path2 = "ui/uiGame/" + _smallName2 + "/UIRecordAllResult_" + _smallName2;
                this.FormManager.ShowForm(_path2, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_CQCP == gameType) {
                var _smallName3 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path3 = "ui/uiGame/" + _smallName3 + "/UIRecordAllResult_" + _smallName3;
                this.FormManager.ShowForm(_path3, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GZMJ == gameType) {
                var _smallName4 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path4 = "ui/uiGame/" + _smallName4 + "/UIRecordAllResult_" + _smallName4;
                this.FormManager.ShowForm(_path4, roomID, playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_DCTS == gameType) {
                var _smallName5 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path5 = "ui/uiGame/" + _smallName5 + "/UIRecordAllResult_" + _smallName5;
                this.FormManager.ShowForm(_path5, roomID, playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_GLWSK == gameType) {
                var _smallName6 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path6 = "ui/uiGame/" + _smallName6 + "/UIRecordAllResult_" + _smallName6;
                this.FormManager.ShowForm(_path6, roomID, playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_WXZMMJ == gameType) {
                var _smallName7 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path7 = "ui/uiGame/" + _smallName7 + "/UIRecordAllResult_" + _smallName7;
                this.FormManager.ShowForm(_path7, roomID, playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_CP == gameType) {
                var _smallName8 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path8 = "ui/uiGame/" + _smallName8 + "/UIRecordAllResult_" + _smallName8;
                this.FormManager.ShowForm(_path8, roomID, playerList, gameType);
                return;
            }
            if (this.ShareDefine.GameType_JXYZ == gameType) {
                var _smallName9 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path9 = "ui/uiGame/" + _smallName9 + "/UIRecordAllResult_" + _smallName9;
                this.FormManager.ShowForm(_path9, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_YCFXMJ == gameType) {
                var _smallName10 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path10 = "ui/uiGame/" + _smallName10 + "/UIRecordAllResult_" + _smallName10;
                this.FormManager.ShowForm(_path10, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_PY == gameType) {
                var _smallName11 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path11 = "ui/uiGame/" + _smallName11 + "/UIRecordAllResult_" + _smallName11;
                this.FormManager.ShowForm(_path11, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_KLMJ == gameType) {
                var _smallName12 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path12 = "ui/uiGame/" + _smallName12 + "/UIRecordAllResult_" + _smallName12;
                this.FormManager.ShowForm(_path12, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_QWWES == gameType) {
                var _smallName13 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path13 = "ui/uiGame/" + _smallName13 + "/UIRecordAllResult_" + _smallName13;
                this.FormManager.ShowForm(_path13, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_SGLK == gameType) {
                var _smallName14 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path14 = "ui/uiGame/" + _smallName14 + "/UIRecordAllResult_" + _smallName14;
                this.FormManager.ShowForm(_path14, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_SSE == gameType) {
                var _smallName15 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path15 = "ui/uiGame/" + _smallName15 + "/UIRecordAllResult_" + _smallName15;
                this.FormManager.ShowForm(_path15, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_XSDQ == gameType) {
                var _smallName16 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path16 = "ui/uiGame/" + _smallName16 + "/UIRecordAllResult_" + _smallName16;
                this.FormManager.ShowForm(_path16, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JYESSZ == gameType) {
                var _smallName17 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path17 = "ui/uiGame/" + _smallName17 + "/UIRecordAllResult_" + _smallName17;
                this.FormManager.ShowForm(_path17, roomID, playerList, gameType, unionId);
                return;
            }
            this.FormManager.ShowForm("UIRecordAllResult", roomID, playerList, gameType);
        } else if ('btn_tz' == btnName) {
            var goPageStr = this.pageEditBox.string;
            if (!app.ComTool().StrIsNumInt(goPageStr)) {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字的页数", [], 3);
                return;
            }
            if (parseInt(goPageStr) > this.pageNumTotal) {
                app.SysNotifyManager().ShowSysMsg("输入的页数超出总页数", [], 3);
                return;
            }
            this.recordPage = parseInt(goPageStr);
            this.GetPersonalRecord(this.pid, true);
        } else if ('btn_searchroom' == btnName) {
            var roomStr = this.roomEditBox.string;
            if (roomStr <= 0 || roomStr == "") {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字的房间号", [], 3);
                return;
            }
            this.recordPage = 1;
            this.GetPersonalRecord(this.pid, true, roomStr);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();