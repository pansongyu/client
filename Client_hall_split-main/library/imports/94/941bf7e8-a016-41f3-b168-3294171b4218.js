"use strict";
cc._RF.push(module, '941bffooBZB87FoMpQXG0IY', 'btn_ManagementNode');
// script/ui/club/unionChildren/btn_ManagementNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        // let managementScrollView = this.node.getChildByName("managementScrollView").getComponent(cc.ScrollView);
        //    managementScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData: function InitData(clubId, unionId, unionPostType, myisminister) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.curPage = 1;
        this.lastPage = 1;
        this.curType = 0;
        this.queryStr = "";
        this.clickBtnName = "";
        this.InitTopLb();
        var btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_day1");
        this.OnClick(btn_default.name, btn_default);
    },
    InitTopLb: function InitTopLb() {
        var tab = this.node.getChildByName("topBtnNode");
        for (var i = 0; i < tab.children.length; i++) {
            if (i <= 2) {
                continue; //今天，昨天，前天
            }
            var lb = this.getDay(i);
            tab.children[i].getChildByName("lb_on").getComponent(cc.Label).string = lb;
            tab.children[i].getChildByName("lb_off").getComponent(cc.Label).string = lb;
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
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetDataList(false);
    },
    GetDataList: function GetDataList() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.pageNum = this.curPage;
        sendPack.type = this.curType;
        sendPack.query = this.queryStr;
        var self = this;
        app.NetManager().SendPack("union.CUnionRoomConfigPrizePoolList", sendPack, function (serverPack) {
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
        if (isRefresh) {
            sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.type = this.curType;
            sendPack.query = this.queryStr;
            app.NetManager().SendPack("union.CUnionRoomConfigPrizePoolCount", sendPack, function (serverPack) {
                self.node.getChildByName("lb_jushu").getComponent(cc.Label).string = "总局数:" + serverPack.setCount;
                self.node.getChildByName("lb_kaifang").getComponent(cc.Label).string = "总开房数:" + serverPack.roomSize;
                self.node.getChildByName("lb_xiaohao").getComponent(cc.Label).string = "总消耗钻石:" + serverPack.consumeValue;
                self.node.getChildByName("lb_prizePool").getComponent(cc.Label).string = "总成本:" + serverPack.prizePool;
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    self.node.getChildByName("lb_zongshouyi").getComponent(cc.Label).string = "成员总积分总和:" + serverPack.unionAllMemberPointTotal;
                    self.node.getChildByName("lb_zongxipai").getComponent(cc.Label).string = "最终积分总和:" + serverPack.finalAllMemberPointTotal;
                } else {
                    self.node.getChildByName("lb_zongshouyi").getComponent(cc.Label).string = "总收益(含成本):" + serverPack.sportsPointIncome;
                    self.node.getChildByName("lb_zongxipai").getComponent(cc.Label).string = "总洗牌费:" + serverPack.xiPaiIncome;
                }
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取消息失败", [], 3);
            });
        }
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var managementScrollView = this.node.getChildByName("managementScrollView");
        var content = managementScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            managementScrollView.getComponent(cc.ScrollView).scrollToTop();
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
            var cfgObj = JSON.parse(serverPack[i].dataJsonCfg);
            var gameType = app.ShareDefine().GametTypeID2PinYin[serverPack[i].gameId];
            var wanfa = app.RoomCfgManager().WanFa(gameType, cfgObj);
            child.wanfa = wanfa;
            wanfa += "  比赛分设置：" + this.GetUnionCfg(cfgObj);
            child.unionCfg = this.GetUnionCfg(cfgObj);
            if (wanfa.length > 20) {
                wanfa = wanfa.substring(0, 20) + '...';
            }

            child.getChildByName("bg_key").getChildByName("key").getComponent(cc.Label).string = serverPack[i].tagId;
            child.getChildByName("lb_roomName").getComponent(cc.Label).string = serverPack[i].roomName;
            child.getChildByName("lb_roomCfg").getComponent(cc.Label).string = wanfa;
            child.getChildByName("lb_duiju").getComponent(cc.Label).string = serverPack[i].setCount;
            child.getChildByName("lb_kaifang").getComponent(cc.Label).string = serverPack[i].roomSize;
            child.getChildByName("lb_cost").getComponent(cc.Label).string = serverPack[i].consumeValue;
            child.getChildByName("lb_prizePool").getComponent(cc.Label).string = serverPack[i].prizePool;

            child.configId = serverPack[i].configId;
            child.active = true;
            content.addChild(child);
        }
    },
    GetUnionCfg: function GetUnionCfg(cfgObj) {
        var PLDecStr = "";
        PLDecStr += "房间比赛分门槛：" + cfgObj.roomSportsThreshold;
        PLDecStr += "，比赛分倍数：" + cfgObj.sportsDouble;
        if (typeof cfgObj.prizePool == "undefined") {
            cfgObj.prizePool = 0;
        }
        PLDecStr += "，赛事成本：" + cfgObj.prizePool;
        PLDecStr += "，房间比赛分消耗：";
        if (cfgObj.roomSportsType == 0) {
            if (typeof cfgObj.bigWinnerConsumeList == "undefined" || cfgObj.bigWinnerConsumeList.length <= 0) {
                PLDecStr += "大赢家赢比赛分>=" + cfgObj.geWinnerPoint + "时，消耗" + cfgObj.roomSportsBigWinnerConsume;
            } else {
                for (var i = 0; i < cfgObj.bigWinnerConsumeList.length; i++) {
                    PLDecStr += "大赢家赢比赛分>" + cfgObj.bigWinnerConsumeList[i].winScore + "时，消耗比赛分" + cfgObj.bigWinnerConsumeList[i].sportsPoint;
                    if (i < cfgObj.bigWinnerConsumeList.length - 1) {
                        PLDecStr += "，";
                    }
                }
            }
            if (cfgObj.twoMode) {
                PLDecStr += "；每人付" + cfgObj.roomSportsEveryoneConsume;
            }
        } else {
            PLDecStr += "每人付" + cfgObj.roomSportsEveryoneConsume;
        }
        if (cfgObj.dianbo && parseInt(cfgObj.dianbo)) {
            PLDecStr += "，携带分" + cfgObj.dianbo;
        } else PLDecStr += "，比赛分低于" + cfgObj.autoDismiss + "自动解散";
        return PLDecStr;
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
        if (btnName.startsWith("btn_day")) {
            this.curType = parseInt(btnName.replace("btn_day", '')) - 1;
            this.curPage = 1;
            this.ClickTopBtn(btnName);
            var managementScrollView = this.node.getChildByName("managementScrollView");
            var content = managementScrollView.getChildByName("view").getChildByName("content");
            managementScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
            this.GetDataList(true);
        } else if ('btn_next' == btnName) {
            this.lastPage = this.curPage;
            this.curPage++;
            this.GetDataList(true);
        } else if ('btn_last' == btnName) {
            if (this.curPage <= 1) {
                return;
            }
            this.lastPage = this.curPage;
            this.curPage--;
            this.GetDataList(true);
        } else if ('btn_search' == btnName) {
            this.queryStr = btnNode.parent.getComponent(cc.EditBox).string;
            this.curPage = 1;
            this.lastPage = 1;
            this.GetDataList(true);
        } else if ('lb_roomCfg' == btnName) {
            var wanfaStr = btnNode.parent.wanfa;
            var unionCfgStr = btnNode.parent.unionCfg;
            app.FormManager().ShowForm("ui/club/UIUnionRoomCfgMsg", wanfaStr, unionCfgStr);
        }
    }
});

cc._RF.pop();