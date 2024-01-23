"use strict";
cc._RF.push(module, '4101eXTg1JEy5W8OXU6uXb2', 'UIClubRecordList');
// script/ui/club/UIClubRecordList.js

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
        top: cc.Node,
        lb_page: cc.Label
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.WeChatManager = app.WeChatManager();
        this.pageEditBox = this.node.getChildByName("pageGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        this.roomEditBox = this.node.getChildByName("roomGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        // this.recordlist_scrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, unionId, clubName, unionPostType, myisminister) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        if (this.unionId > 0) {
            this.node.getChildByName('lb_clubname').getComponent(cc.Label).string = "";
            if (this.unionPostType == app.ClubManager().UNION_CREATE || this.unionPostType == app.ClubManager().UNION_MANAGE || this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
                this.node.getChildByName("clubToggle").active = true;
            } else {
                this.node.getChildByName("clubToggle").active = false;
            }
            this.node.getChildByName("recordToggle").active = true;
        } else {
            this.node.getChildByName('lb_clubname').getComponent(cc.Label).string = "";
            this.node.getChildByName("clubToggle").active = false;
            this.node.getChildByName("recordToggle").active = true;
        }
        this.pageEditBox.string = "";
        this.roomEditBox.string = "";
        this.recordPage = 1;
        this.pageNumTotal = 1;
        this.lastRecordPage = 1;
        //刷新页数
        this.lb_page.getComponent(cc.Label).string = this.lastRecordPage + "/" + this.pageNumTotal;
        this.recordType = -1;
        this.recordlist_room_demo.active = false;
        this.toBttom = false;
        this.GetClubRecord(0, true); //0:今日  //1:昨天  //2:3天
        this.isQuanXuan = true;

        //预加载的item的数据
        this.data = [];
        //当前可视区域内部填充满需要的item数量
        this.rowItemCounts = 0;
        //创建的item节点的数组
        this.items = [];
        //顶部最大Y
        this.topMax = 0;
        //底部最小Y
        this.bottomMax = 0;
        //上一次listnode的Y坐标
        this.lastListY = 0;
        //itemprefab的高度
        this.itemHeight = 0;

        this.spacingY = 10;
    },
    GetNextPage: function GetNextPage() {
        if (this.toBttom == true) {
            return;
        }
        this.toBttom = true;
        this.recordPage++;
        this.GetClubRecord(this.recordType, false);
    },
    //---------点击函数---------------------
    GetClubRecord: function GetClubRecord(type) {
        var isRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var sendPack = { "clubId": this.clubId, "getType": type };
        if (this.unionId > 0 && this.node.getChildByName("clubToggle").active && !this.node.getChildByName("clubToggle").getComponent(cc.Toggle).isChecked) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        if (isRefresh) {
            this.NetManager.SendPack("club.CClubTotalInfo", sendPack, function (event) {
                that.ShowClubRecordTop(event);
            }, function (error) {});
        }
        this.recordType = type;
        var that = this;
        this.InitTop(type);
        this.isQuanXuan = true;
        sendPack.pageNum = this.recordPage;
        if (this.node.getChildByName("recordToggle").getComponent(cc.Toggle).isChecked) {
            //隐藏已查看战绩
            sendPack.type = 1;
        } else {
            sendPack.type = 0;
        }
        this.NetManager.SendPack("club.CClubGetRecord", sendPack, function (event) {
            if (event.clubRecordInfos.length > 0) {
                that.ShowClubRecordList(event, isRefresh);
                //刷新页数
                that.lb_page.getComponent(cc.Label).string = that.recordPage + "/" + that.pageNumTotal;
            } else {
                that.recordPage = that.lastRecordPage;
            }
            that.toBttom = false;
        }, function (error) {});
    },
    //---------点击函数---------------------
    GetClubRecordRoom: function GetClubRecordRoom(type, roomStr) {
        var isRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var sendPack = { "clubId": this.clubId, "getType": type };
        if (this.unionId > 0 && this.node.getChildByName("clubToggle").active && !this.node.getChildByName("clubToggle").getComponent(cc.Toggle).isChecked) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        if (isRefresh) {
            this.NetManager.SendPack("club.CClubTotalInfo", sendPack, function (event) {
                that.ShowClubRecordTop(event);
            }, function (error) {});
        }
        this.recordType = type;
        var that = this;
        this.InitTop(type);
        this.isQuanXuan = true;
        sendPack.pageNum = 1;
        sendPack.type = 0;
        sendPack.query = roomStr;
        this.NetManager.SendPack("club.CClubGetRecord", sendPack, function (event) {
            if (event.clubRecordInfos.length > 0) {
                that.ShowClubRecordList(event, isRefresh);
                //刷新页数
                that.lb_page.getComponent(cc.Label).string = "1/1";
            } else {
                that.recordPage = that.lastRecordPage;
            }
            that.toBttom = false;
        }, function (error) {});
    },
    InitTop: function InitTop(type) {
        var node = this.top.getChildByName('btn_list');
        for (var i = 0; i < node.children.length; i++) {
            node.children[i].getChildByName('on').active = false;
            node.children[i].getChildByName('off').active = true;
        }
        if (type == 6) {
            node.getChildByName('btn_all').getChildByName('on').active = true;
            node.getChildByName('btn_all').getChildByName('off').active = false;
        } else if (type == 1) {
            node.getChildByName('btn_zuotian').getChildByName('on').active = true;
            node.getChildByName('btn_zuotian').getChildByName('off').active = false;
        } else if (type == 0) {
            node.getChildByName('btn_jintian').getChildByName('on').active = true;
            node.getChildByName('btn_jintian').getChildByName('off').active = false;
        } else if (type == 3) {
            node.getChildByName('btn_anren').getChildByName('on').active = true;
            node.getChildByName('btn_anren').getChildByName('off').active = false;
        }
    },
    ShowClubRecordTop: function ShowClubRecordTop(event) {
        this.pageNumTotal = event.pageNumTotal;
        //刷新页数
        this.lb_page.getComponent(cc.Label).string = this.lastRecordPage + "/" + this.pageNumTotal;
        this.top.getChildByName('lb_fangka').getComponent(cc.Label).string = '钻石:' + event.roomCardTotalCount + '个';
        this.top.getChildByName('lb_quanka').getComponent(cc.Label).string = ""; //'圈卡:'+event.clubCardTotalCount+"张";
        this.top.getChildByName('lb_jushu').getComponent(cc.Label).string = '开房总次数:' + event.roomTotalCount;
    },
    ShowClubRecordList: function ShowClubRecordList(data, isRefresh) {
        var _this = this;

        if (isRefresh) {
            this.recordlist_scrollView.scrollToTop();
            //this.recordlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.recordlist_layout);
        }
        var clubRecordInfosAll = data.clubRecordInfos; //排名列表
        var count = clubRecordInfosAll.length;
        if (count == 0) return;
        var timer = setInterval(function () {
            if (count-- > 0) {
                var index = clubRecordInfosAll.length - count - 1;
                //先判断下是否已经存在
                var isExist = false;
                for (var j = 0; j < _this.recordlist_layout.children.length; j++) {
                    if (_this.recordlist_layout.children[j].roomID == clubRecordInfosAll[index].roomID) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    _this.AddChildToLayout(clubRecordInfosAll, index);
                }
            } else {
                clearInterval(timer);
            }
        }, 0);
    },
    AddChildToLayout: function AddChildToLayout(clubRecordInfosAll, i) {
        var nodePrefab = cc.instantiate(this.recordlist_room_demo);
        nodePrefab.name = "record" + i;
        // nodePrefab.getChildByName('date').getComponent(cc.Label).string=this.ComTool.GetDateYearMonthDayHourMinuteString(clubRecordInfosAll[i].endTime);
        if (clubRecordInfosAll[i].roomState == 1) {
            nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string = "游戏中";
            nodePrefab.getChildByName('date').getComponent(cc.Label).string = "";
        } else {
            nodePrefab.getChildByName('lb_roomState').getComponent(cc.Label).string = "";
            nodePrefab.getChildByName('date').getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(clubRecordInfosAll[i].endTime);
        }
        if (typeof clubRecordInfosAll[i].sportsDouble == "undefined") {
            nodePrefab.getChildByName('lb_beishu').getComponent(cc.Label).string = "";
        } else {
            nodePrefab.getChildByName('lb_beishu').getComponent(cc.Label).string = clubRecordInfosAll[i].sportsDouble + "倍";
        }
        nodePrefab.getChildByName('room_key').getComponent(cc.Label).string = clubRecordInfosAll[i].roomKey;
        if (clubRecordInfosAll[i].configName == "") {
            nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string = this.ShareDefine.GametTypeID2Name[clubRecordInfosAll[i].gameType];
        } else {
            nodePrefab.getChildByName('game_name').getChildByName('lb_gameName').getComponent(cc.Label).string = clubRecordInfosAll[i].configName;
        }

        if (clubRecordInfosAll[i].valueType == 2) {
            nodePrefab.getChildByName('icon_fk').active = true;
            nodePrefab.getChildByName('icon_qk').active = false;
            nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string = 'X' + clubRecordInfosAll[i].roomCard;
        } else if (clubRecordInfosAll[i].valueType == 3) {
            nodePrefab.getChildByName('icon_fk').active = false;
            nodePrefab.getChildByName('icon_qk').active = false; //隐藏圈卡
            nodePrefab.getChildByName('lb_card').getComponent(cc.Label).string = ""; //'X'+clubRecordInfosAll[i].clubCard;
        } else {
            nodePrefab.getChildByName('icon_fk').active = false;
            nodePrefab.getChildByName('icon_qk').active = false;
        }

        if (clubRecordInfosAll[i].unionId > 0) {
            nodePrefab.getChildByName('icon_pl').active = true;
            nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = 'X' + clubRecordInfosAll[i].roomSportsConsume;
        } else {
            nodePrefab.getChildByName('icon_pl').active = false;
            nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = '';
        }
        //显示是否已查看状态
        if (clubRecordInfosAll[i].isViewed) {
            nodePrefab.getChildByName('isCheckToggle').getComponent(cc.Toggle).isChecked = true;
        } else {
            nodePrefab.getChildByName('isCheckToggle').getComponent(cc.Toggle).isChecked = false;
        }

        nodePrefab.gameType = clubRecordInfosAll[i].gameType;
        nodePrefab.roomID = clubRecordInfosAll[i].roomID;
        nodePrefab.unionId = clubRecordInfosAll[i].unionId;
        nodePrefab.roomKey = clubRecordInfosAll[i].roomKey;
        nodePrefab.playerList = JSON.parse(clubRecordInfosAll[i].playerList);
        nodePrefab.datainfo = clubRecordInfosAll[i];
        nodePrefab.getChildByName('toggle').roomID = clubRecordInfosAll[i].roomID;
        nodePrefab.active = true;
        this.recordlist_layout.addChild(nodePrefab);
        this.ShowUserList(nodePrefab.getChildByName('user_layout'), clubRecordInfosAll[i].playerList);
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
            if (!node) continue;
            layoutNode.addChild(node);
            node.active = true;
            var player = playerList[i];
            node.getChildByName('lb_name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(player.pid, player.name);
            node.getChildByName('lb_id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(player.pid) });
            playerids.push(player.pid);
            var bisai = false;
            if (layoutNode.parent.unionId > 0) {
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
        //layoutNode.parent.getChildByName('toggle').ids=playerids;
    },
    click_btn_quanxuan: function click_btn_quanxuan() {
        for (var i = 0; i < this.recordlist_layout.children.length; i++) {
            var node = this.recordlist_layout.children[i];
            if (this.isQuanXuan == true) {
                node.getChildByName('toggle').getComponent(cc.Toggle).isChecked = false;
            } else {
                node.getChildByName('toggle').getComponent(cc.Toggle).isChecked = true;
            }
        }
        if (this.isQuanXuan == true) {
            this.isQuanXuan = false;
        } else {
            this.isQuanXuan = true;
        }
    },
    click_btn_anren: function click_btn_anren() {
        var roomIDS = [];
        // this.InitTop(3);
        for (var i = 0; i < this.recordlist_layout.children.length; i++) {
            var node = this.recordlist_layout.children[i];
            if (node.getChildByName('toggle').getComponent(cc.Toggle).isChecked == true) {
                var roomID = node.getChildByName('toggle').roomID;
                roomIDS.push(roomID);
            }
        }
        if (this.isQuanXuan || roomIDS.length > 0) {
            var isShowAllClub = false;
            if (this.unionId > 0 && !this.node.getChildByName("clubToggle").getComponent(cc.Toggle).isChecked) {
                //显示所有亲友圈战绩
                isShowAllClub = true;
            }
            this.FormManager.ShowForm('ui/club/UIClubReport', this.clubId, roomIDS, this.isQuanXuan, this.recordType, isShowAllClub, this.unionId);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            //this.recordlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.recordlist_layout);
            this.CloseForm();
        } else if ('btn_next' == btnName) {
            this.lastRecordPage = this.recordPage;
            this.recordPage++;
            this.GetClubRecord(this.recordType, true);
        } else if ('btn_last' == btnName) {
            if (this.recordPage <= 1) {
                return;
            }
            this.lastRecordPage = this.recordPage;
            this.recordPage--;
            this.GetClubRecord(this.recordType, true);
        } else if ('btn_all' == btnName) {
            this.recordlist_scrollView.scrollToTop();
            this.DestroyAllChildren(this.recordlist_layout);
            this.recordPage = 1;
            this.GetClubRecord(6, true);
        } else if ('btn_zuotian' == btnName) {
            this.recordlist_scrollView.scrollToTop();
            this.DestroyAllChildren(this.recordlist_layout);
            this.recordPage = 1;
            this.GetClubRecord(1, true);
        } else if ('btn_jintian' == btnName) {
            this.recordlist_scrollView.scrollToTop();
            this.DestroyAllChildren(this.recordlist_layout);
            this.recordPage = 1;
            this.GetClubRecord(0, true);
        } else if ('btn_anren' == btnName) {
            this.recordlist_scrollView.scrollToTop();
            this.click_btn_anren();
        } else if ('btn_quanxuan' == btnName) {
            this.click_btn_quanxuan();
        } else if ('btn_huizong' == btnName) {
            var signString = app.HeroManager().GetHeroID() + 'qinghuai' + app.ComTool().GetNowDateDayStr();
            var sign = app.MD5.hex_md5(signString);

            var clientConfig = app.Client.GetClientConfig();
            var url = "http://" + clientConfig["GameServerIP"] + "/index.php?module=Publics&action=Login&playerid=" + app.HeroManager().GetHeroID() + "&key=" + sign;
            cc.sys.openURL(url);
        } else if (btnName == "btn_record_info") {
            var gameType = btnNode.parent.gameType;
            var roomID = btnNode.parent.roomID;
            var roomKey = btnNode.parent.roomKey;
            var playerList = btnNode.parent.playerList;
            var datainfo = btnNode.parent.datainfo;
            var unionId = btnNode.parent.unionId;
            if (this.ShareDefine.GameType_PYZHW == gameType) {
                var smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
                var path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                this.FormManager.ShowForm(path, roomID, playerList, gameType, unionId);
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
                this.FormManager.ShowForm(_path4, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_DCTS == gameType) {
                var _smallName5 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path5 = "ui/uiGame/" + _smallName5 + "/UIRecordAllResult_" + _smallName5;
                this.FormManager.ShowForm(_path5, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JDZTS == gameType) {
                var _smallName6 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path6 = "ui/uiGame/" + _smallName6 + "/UIRecordAllResult_" + _smallName6;
                this.FormManager.ShowForm(_path6, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_DD == gameType) {
                var _smallName7 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path7 = "ui/uiGame/" + _smallName7 + "/UIRecordAllResult_" + _smallName7;
                this.FormManager.ShowForm(_path7, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JAWZ == gameType) {
                var _smallName8 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path8 = "ui/uiGame/" + _smallName8 + "/UIRecordAllResult_" + _smallName8;
                this.FormManager.ShowForm(_path8, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_THBBZ == gameType) {
                var _smallName9 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path9 = "ui/uiGame/" + _smallName9 + "/UIRecordAllResult_" + _smallName9;
                this.FormManager.ShowForm(_path9, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GYZJMJ == gameType) {
                var _smallName10 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path10 = "ui/uiGame/" + _smallName10 + "/UIRecordAllResult_" + _smallName10;
                this.FormManager.ShowForm(_path10, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GSMJ == gameType) {
                var _smallName11 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path11 = "ui/uiGame/" + _smallName11 + "/UIRecordAllResult_" + _smallName11;
                this.FormManager.ShowForm(_path11, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_LPSMJ == gameType) {
                var _smallName12 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path12 = "ui/uiGame/" + _smallName12 + "/UIRecordAllResult_" + _smallName12;
                this.FormManager.ShowForm(_path12, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_LPTS == gameType) {
                var _smallName13 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path13 = "ui/uiGame/" + _smallName13 + "/UIRecordAllResult_" + _smallName13;
                this.FormManager.ShowForm(_path13, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_GLWSK == gameType) {
                var _smallName14 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path14 = "ui/uiGame/" + _smallName14 + "/UIRecordAllResult_" + _smallName14;
                this.FormManager.ShowForm(_path14, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_WXZMMJ == gameType) {
                var _smallName15 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path15 = "ui/uiGame/" + _smallName15 + "/UIRecordAllResult_" + _smallName15;
                this.FormManager.ShowForm(_path15, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_CP == gameType) {
                var _smallName16 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path16 = "ui/uiGame/" + _smallName16 + "/UIRecordAllResult_" + _smallName16;
                this.FormManager.ShowForm(_path16, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JXYZ == gameType) {
                var _smallName17 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path17 = "ui/uiGame/" + _smallName17 + "/UIRecordAllResult_" + _smallName17;
                this.FormManager.ShowForm(_path17, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_YCFXMJ == gameType) {
                var _smallName18 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path18 = "ui/uiGame/" + _smallName18 + "/UIRecordAllResult_" + _smallName18;
                this.FormManager.ShowForm(_path18, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_PY == gameType) {
                var _smallName19 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path19 = "ui/uiGame/" + _smallName19 + "/UIRecordAllResult_" + _smallName19;
                this.FormManager.ShowForm(_path19, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_KLMJ == gameType) {
                var _smallName20 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path20 = "ui/uiGame/" + _smallName20 + "/UIRecordAllResult_" + _smallName20;
                this.FormManager.ShowForm(_path20, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_QWWES == gameType) {
                var _smallName21 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path21 = "ui/uiGame/" + _smallName21 + "/UIRecordAllResult_" + _smallName21;
                this.FormManager.ShowForm(_path21, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_SGLK == gameType) {
                var _smallName22 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path22 = "ui/uiGame/" + _smallName22 + "/UIRecordAllResult_" + _smallName22;
                this.FormManager.ShowForm(_path22, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_SSE == gameType) {
                var _smallName23 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path23 = "ui/uiGame/" + _smallName23 + "/UIRecordAllResult_" + _smallName23;
                this.FormManager.ShowForm(_path23, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_XSDQ == gameType) {
                var _smallName24 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path24 = "ui/uiGame/" + _smallName24 + "/UIRecordAllResult_" + _smallName24;
                this.FormManager.ShowForm(_path24, roomID, playerList, gameType, unionId);
                return;
            }
            if (this.ShareDefine.GameType_JYESSZ == gameType) {
                var _smallName25 = this.ShareDefine.GametTypeID2PinYin[gameType];
                var _path25 = "ui/uiGame/" + _smallName25 + "/UIRecordAllResult_" + _smallName25;
                this.FormManager.ShowForm(_path25, roomID, playerList, gameType, unionId);
                return;
            }
            this.FormManager.ShowForm("UIRecordAllResult", roomID, playerList, gameType, unionId);
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
            this.GetClubRecord(this.recordType, true);
        } else if ('btn_searchroom' == btnName) {
            var roomStr = this.roomEditBox.string;
            if (roomStr <= 0 || roomStr == "") {
                app.SysNotifyManager().ShowSysMsg("请输入纯数字的房间号", [], 3);
                return;
            }

            this.GetClubRecordRoom(this.recordType, roomStr, true);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },
    OnClickClubToggle: function OnClickClubToggle(event) {
        this.recordPage = 1;
        this.GetClubRecord(this.recordType, true);
    },
    OnClickRecordToggle: function OnClickRecordToggle(event) {
        this.recordPage = 1;
        this.GetClubRecord(this.recordType, true);
    },
    OnClickIsCheckToggle: function OnClickIsCheckToggle(event) {
        var dataInfo = event.target.parent.parent.datainfo;
        if (typeof dataInfo == "undefined") {
            return;
        }
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.endTime = dataInfo.endTime;
        sendPack.roomID = dataInfo.roomID;
        if (event.target.parent.getComponent(cc.Toggle).isChecked) {
            sendPack.type = 1;
        } else {
            sendPack.type = 0;
        }
        this.NetManager.SendPack("club.CClubRoomIdOperation", sendPack, function (event) {}, function (error) {});
    }
});

cc._RF.pop();