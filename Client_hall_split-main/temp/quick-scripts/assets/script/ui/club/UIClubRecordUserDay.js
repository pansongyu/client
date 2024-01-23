(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubRecordUserDay.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6a034YkDIhHNLeEHKCFy0vO', 'UIClubRecordUserDay', __filename);
// script/ui/club/UIClubRecordUserDay.js

"use strict";

/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
        this.FormManager = app.FormManager();
        this.ComTool = app.ComTool();
        this.NetManager = app.NetManager();
        this.HeroManager = app.HeroManager();
        this.heroID = app.HeroManager().GetHeroProperty("pid");

        var messageScrollView = this.node.getChildByName("mask").getComponent(cc.ScrollView);
        messageScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    OnShow: function OnShow() {
        var clubId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var unionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this.node.getChildByName("mask").getComponent(cc.ScrollView).scrollToTop();
        this.DestroyAllChildren(this.layout);
        this.clubId = clubId;
        this.unionId = unionId;
        this.sort = 1;
        this.type = 0;
        this.page = 1;
        this.GetData();
        this.InitLeftLb();
        this.InitLeft();
    },
    GetData: function GetData() {
        if (this.page == 1) {
            this.DestroyAllChildren(this.layout);
            this.GetCount();
        }
        this.NetManager.SendPack("club.CClubMemberRoomRecord", {
            "clubId": this.clubId,
            'gameType': -1,
            'pageNum': this.page,
            'sort': this.sort,
            "getType": this.type
        }, this.OnPack_CPlayerRoomRecord.bind(this), this.OnPack_CPlayerRoomRecordFail.bind(this));
    },
    GetCount: function GetCount() {
        var self = this;
        app.NetManager().SendPack("club.CClubPlayerRecordCount", {
            "clubId": this.clubId,
            "unionId": this.unionId,
            "getType": this.type
        }, function (serverPack) {
            self.node.getChildByName("lb_jushu").getComponent(cc.Label).string = "对局数：" + serverPack.size;
            self.node.getChildByName("lb_dayingjia").getComponent(cc.Label).string = "大赢家：" + serverPack.winner;
            if (self.unionId > 0) {
                self.node.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = "比赛分：" + serverPack.sumPoint;
            } else {
                self.node.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = "输赢分：" + serverPack.sumPoint;
            }
        }, function () {
            self.node.getChildByName("lb_jushu").getComponent(cc.Label).string = "";
            self.node.getChildByName("lb_dayingjia").getComponent(cc.Label).string = "";
            self.node.getChildByName("lb_shuyingfen").getComponent(cc.Label).string = "";
        });
    },
    GetNextPage: function GetNextPage() {
        this.page++;
        this.GetData();
    },
    SortRecodeByTime: function SortRecodeByTime(a, b) {
        return b.endTime - a.endTime;
    },
    OnPack_CPlayerRoomRecord: function OnPack_CPlayerRoomRecord(serverPack) {
        if (serverPack.hasOwnProperty('pRoomRecords')) {
            var recodelist = serverPack.pRoomRecords;
            this.ShowData(recodelist);
        } else {

            return;
        }
    },
    ShowData: function ShowData(data) {
        var demo = this.node.getChildByName("demo");
        var demo_user = demo.getChildByName("mask").getChildByName("user_demo");
        for (var i = 0; i < data.length; i++) {
            var child = cc.instantiate(demo);
            var record = data[i];
            child.getChildByName("lb_configName").getComponent(cc.Label).string = record.configName;
            child.getChildByName("lb_game").getComponent(cc.Label).string = this.ShareDefine.GametTypeID2Name[record.gameType];
            child.getChildByName("lb_roomkey").getComponent(cc.Label).string = record.roomKey;
            child.getChildByName("lb_setcount").getComponent(cc.Label).string = this.GetJuString(record.setCount, record.gameType);
            var endTime = this.ComTool.GetDateYearMonthDayHourMinuteString(record.endTime);
            child.getChildByName("lb_time").getComponent(cc.Label).string = endTime;

            //玩家
            var datainfo = JSON.parse(record.dataJsonRes);
            var winnerInfo = null;
            var winPoint = 0;
            if (datainfo) {
                var myPoint = 0;
                var mySportPoint = 0;
                var playerList = JSON.parse(record.playerList);
                var user_layout = child.getChildByName("mask").getChildByName("layout");
                for (var j = 0; j < playerList.length; j++) {
                    var user = cc.instantiate(demo_user);
                    var pid = playerList[j]["pid"];
                    var headImageUrl = playerList[j]["iconUrl"];
                    var name = playerList[j]["name"];
                    user.getChildByName("lb_name").getComponent(cc.Label).string = name;
                    var playerPoint = this.GetRecord(pid, datainfo.resultsList);

                    if (pid == this.heroID) {
                        myPoint = playerPoint;
                    }

                    var lb_point = user.getChildByName("lb_point");
                    if (playerPoint > 0) {
                        lb_point.color = new cc.Color(212, 54, 42);
                        lb_point.getComponent(cc.Label).string = "+" + playerPoint;
                    } else {
                        lb_point.color = new cc.Color(45, 167, 95);
                        lb_point.getComponent(cc.Label).string = playerPoint;
                    }
                    if (winnerInfo == null) {
                        winnerInfo = playerList[j];
                        winPoint = playerPoint;
                    } else {
                        if (playerPoint > winPoint) {
                            winnerInfo = playerList[j];
                            winPoint = playerPoint;
                        }
                    }
                    if (this.unionId > 0) {
                        var sportsPoint = 0;
                        if (datainfo.resultsList) {
                            sportsPoint = this.GetSportsPoint(pid, datainfo.resultsList);
                        } else {
                            sportsPoint = this.GetSportsPoint(pid, datainfo.countRecords);
                        }
                        if (pid == this.heroID) {
                            mySportPoint = sportsPoint;
                        }
                        var lb_sportPoint = user.getChildByName("lb_sportPoint");
                        if (sportsPoint > 0) {
                            lb_sportPoint.color = new cc.Color(212, 54, 42);
                            lb_sportPoint.getComponent(cc.Label).string = "赛:+" + sportsPoint;
                        } else {
                            lb_sportPoint.color = new cc.Color(45, 167, 95);
                            lb_sportPoint.getComponent(cc.Label).string = "赛:" + sportsPoint;
                        }
                        lb_sportPoint.x = 20;
                        lb_point.active = false;
                    } else {
                        lb_point.x = 20;
                        user.getChildByName("lb_sportPoint").getComponent(cc.Label).string = "";
                    }
                    user.active = true;
                    user_layout.addChild(user);
                }
                if (winnerInfo != null) {
                    child.getChildByName("lb_winname").getComponent(cc.Label).string = winnerInfo.name;

                    child.getChildByName("lb_winid").getComponent(cc.Label).string = "ID:" + this.ComTool.GetIDByIndex(winnerInfo.pid.toString(), 3);
                } else {
                    child.getChildByName("lb_winname").getComponent(cc.Label).string = "";
                    child.getChildByName("lb_winid").getComponent(cc.Label).string = "";
                }
                if (this.unionId > 0) {
                    child.getChildByName("img_win").active = mySportPoint > 0;
                    child.getChildByName("img_lost").active = mySportPoint <= 0;
                } else {
                    child.getChildByName("img_win").active = myPoint > 0;
                    child.getChildByName("img_lost").active = myPoint <= 0;
                }

                child.getChildByName("btn_djxq").record = record;
            }

            child.active = true;
            this.layout.addChild(child);
        }
    },
    GetJuString: function GetJuString(setCount, gameType) {
        var ju = "";
        if (gameType == 57) {
            if (setCount == 30 || setCount == 50 || setCount == 100) {
                return setCount + '锅';
            }
            return setCount;
        }
        if (setCount == 100) {
            //厦门麻将1考服务端下发100局
            ju = '1考';
        } else if (setCount == 201) {
            //福鼎麻将1考服务端下发201局
            ju = '1拷';
        } else if (setCount == 40) {
            ju = '打捆40分';
        } else if (setCount == 50) {
            ju = '打捆50分';
        } else if (setCount > 100 && setCount < 200) {
            //保定易县麻将
            ju = setCount % 100 + '圈';
        } else if (setCount == 310) {
            //南安麻将1课服务端下发310局
            ju = '1课:10分';
        } else if (setCount == 311) {
            //泉州麻将1课服务端下发310局
            ju = '1课:100分';
        } else if (setCount == 312) {
            //衢州麻将局麻服务端下发312局
            ju = '局麻';
        } else if (setCount == 401) {
            //江西抚州关牌服务端下发401局
            ju = '1次';
        } else if (setCount >= 400 && gameType == this.ShareDefine.GameType_GD) {
            setCount = setCount % 400;
            if (setCount == 14) {
                ju = "过A";
            } else {
                ju = "过" + setCount;
            }
        } else if (setCount >= 400 && gameType == this.ShareDefine.GameType_WHMJ) {
            ju = setCount % 400 + "底";
        } else if (setCount >= 600 && gameType == this.ShareDefine.GameType_MASMJ) {
            ju = setCount % 600 + "倒";
        } else if (setCount == 501 && gameType == this.ShareDefine.GameType_GLWSK) {
            ju = "";
        } else {
            ju = setCount;
        }
        return ju;
    },
    GetRecord: function GetRecord(pid, resultsList) {
        var count = resultsList.length;
        for (var i = 0; i < count; i++) {
            if (resultsList[i]['pid'] == pid) {
                var sportsPoint = resultsList[i]['sportsPoint'];
                if (sportsPoint) {
                    return sportsPoint;
                }
                var point = resultsList[i]['point'];
                if (point) {
                    return point;
                }
                return 0;
            }
        }
        return 0;
    },
    GetSportsPoint: function GetSportsPoint(pid, resultsList) {
        var count = resultsList.length;
        for (var i = 0; i < count; i++) {
            if (resultsList[i]['pid'] == pid) {
                var sportsPoint = resultsList[i]['sportsPoint'];
                if (sportsPoint) {
                    return sportsPoint;
                }
            }
        }
        return 0;
    },
    OnPack_CPlayerRoomRecordFail: function OnPack_CPlayerRoomRecordFail(serverPack) {
        //this.ScrollViewData({});
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    GameId2Name: function GameId2Name(gameId) {
        return this.ShareDefine.GametTypeID2Name[gameId];
    },
    InitLeft: function InitLeft() {
        var tab = this.node.getChildByName("tab");
        for (var i = 0; i < tab.children.length; i++) {
            tab.children[i].getChildByName('off').active = i != this.type;
            tab.children[i].getChildByName('on').active = i == this.type;
        }
    },
    InitLeftLb: function InitLeftLb() {
        var tab = this.node.getChildByName("tab");
        for (var i = 0; i < tab.children.length; i++) {
            if (i <= 2) {
                continue; //今天，昨天，前天
            }
            var lb = this.getDay(i);
            tab.children[i].getChildByName("on").getChildByName("lb").getComponent(cc.Label).string = lb;
            tab.children[i].getChildByName("off").getChildByName("lb").getComponent(cc.Label).string = lb;
        }
    },
    getDay: function getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码

        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tMonth + "月" + tDate + "日";
    },
    doHandleMonth: function doHandleMonth(month) {
        return month;
    },
    OnClick_ShowMore: function OnClick_ShowMore(btnNode) {
        var record = btnNode.record;
        if (this.ShareDefine.GameType_PYZHW == record.gameType) {
            var smallName = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
            this.FormManager.ShowForm(path, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_BP == record.gameType) {
            var _smallName = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path = "ui/uiGame/" + _smallName + "/UIRecordAllResult_" + _smallName;
            this.FormManager.ShowForm(_path, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_CDP == record.gameType) {
            var _smallName2 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path2 = "ui/uiGame/" + _smallName2 + "/UIRecordAllResult_" + _smallName2;
            this.FormManager.ShowForm(_path2, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_DCTS == record.gameType) {
            var _smallName3 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path3 = "ui/uiGame/" + _smallName3 + "/UIRecordAllResult_" + _smallName3;
            this.FormManager.ShowForm(_path3, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_JDZTS == record.gameType) {
            var _smallName4 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path4 = "ui/uiGame/" + _smallName4 + "/UIRecordAllResult_" + _smallName4;
            this.FormManager.ShowForm(_path4, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_DD == record.gameType) {
            var _smallName5 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path5 = "ui/uiGame/" + _smallName5 + "/UIRecordAllResult_" + _smallName5;
            this.FormManager.ShowForm(_path5, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_JAWZ == record.gameType) {
            var _smallName6 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path6 = "ui/uiGame/" + _smallName6 + "/UIRecordAllResult_" + _smallName6;
            this.FormManager.ShowForm(_path6, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_THBBZ == record.gameType) {
            var _smallName7 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path7 = "ui/uiGame/" + _smallName7 + "/UIRecordAllResult_" + _smallName7;
            this.FormManager.ShowForm(_path7, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_GYZJMJ == record.gameType) {
            var _smallName8 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path8 = "ui/uiGame/" + _smallName8 + "/UIRecordAllResult_" + _smallName8;
            this.FormManager.ShowForm(_path8, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_ASMJ == record.gameType) {
            var _smallName9 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path9 = "ui/uiGame/" + _smallName9 + "/UIRecordAllResult_" + _smallName9;
            this.FormManager.ShowForm(_path9, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_GSMJ == record.gameType) {
            var _smallName10 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path10 = "ui/uiGame/" + _smallName10 + "/UIRecordAllResult_" + _smallName10;
            this.FormManager.ShowForm(_path10, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_LPTS == record.gameType) {
            var _smallName11 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path11 = "ui/uiGame/" + _smallName11 + "/UIRecordAllResult_" + _smallName11;
            this.FormManager.ShowForm(_path11, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_GLWSK == record.gameType) {
            var _smallName12 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path12 = "ui/uiGame/" + _smallName12 + "/UIRecordAllResult_" + _smallName12;
            this.FormManager.ShowForm(_path12, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_WXZMMJ == record.gameType) {
            var _smallName13 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path13 = "ui/uiGame/" + _smallName13 + "/UIRecordAllResult_" + _smallName13;
            this.FormManager.ShowForm(_path13, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_CP == record.gameType) {
            var _smallName14 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path14 = "ui/uiGame/" + _smallName14 + "/UIRecordAllResult_" + _smallName14;
            this.FormManager.ShowForm(_path14, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_JXYZ == record.gameType) {
            var _smallName15 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path15 = "ui/uiGame/" + _smallName15 + "/UIRecordAllResult_" + _smallName15;
            this.FormManager.ShowForm(_path15, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_YCFXMJ == record.gameType) {
            var _smallName16 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path16 = "ui/uiGame/" + _smallName16 + "/UIRecordAllResult_" + _smallName16;
            this.FormManager.ShowForm(_path16, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_PY == record.gameType) {
            var _smallName17 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path17 = "ui/uiGame/" + _smallName17 + "/UIRecordAllResult_" + _smallName17;
            this.FormManager.ShowForm(_path17, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_KLMJ == record.gameType) {
            var _smallName18 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path18 = "ui/uiGame/" + _smallName18 + "/UIRecordAllResult_" + _smallName18;
            this.FormManager.ShowForm(_path18, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_QWWES == record.gameType) {
            var _smallName19 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path19 = "ui/uiGame/" + _smallName19 + "/UIRecordAllResult_" + _smallName19;
            this.FormManager.ShowForm(_path19, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_SGLK == record.gameType) {
            var _smallName20 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path20 = "ui/uiGame/" + _smallName20 + "/UIRecordAllResult_" + _smallName20;
            this.FormManager.ShowForm(_path20, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_SSE == record.gameType) {
            var _smallName21 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path21 = "ui/uiGame/" + _smallName21 + "/UIRecordAllResult_" + _smallName21;
            this.FormManager.ShowForm(_path21, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_XSDQ == record.gameType) {
            var _smallName22 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path22 = "ui/uiGame/" + _smallName22 + "/UIRecordAllResult_" + _smallName22;
            this.FormManager.ShowForm(_path22, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        if (this.ShareDefine.GameType_JYESSZ == record.gameType) {
            var _smallName23 = this.ShareDefine.GametTypeID2PinYin[record.gameType];
            var _path23 = "ui/uiGame/" + _smallName23 + "/UIRecordAllResult_" + _smallName23;
            this.FormManager.ShowForm(_path23, record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId);
            return;
        }
        this.FormManager.ShowForm("UIRecordAllResult", record.roomId, JSON.parse(record.playerList), record.gameType, this.unionId, record.roomKey);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if (btnName.startsWith("btn_tian")) {
            this.type = parseInt(btnName.replace("btn_tian", ''));
            this.GetData();
            this.InitLeft();
        } else if ('btn_djxq' == btnName) {
            this.OnClick_ShowMore(btnNode);
        } else if (btnName == "btn_tongji") {
            this.FormManager.ShowForm("ui/club/UIClubPlayerRecord", this.clubId, this.unionId);
        } else if ("btn_shuaxin" == btnName) {
            this.page = 1;
            this.node.getChildByName("mask").getComponent(cc.ScrollView).scrollToTop();
            this.GetData();
        } else if ("btn_time_sort" == btnName) {
            this.page = 1;
            if (this.sort == 0) {
                this.sort = 1;
            } else {
                this.sort = 0;
            }
            this.GetData();
        } else {
            this.ErrLog("OnClick(%s) not find btnName", btnName);
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
        //# sourceMappingURL=UIClubRecordUserDay.js.map
        