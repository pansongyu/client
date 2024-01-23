(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/unionChildren/btn_RaceRankZhongzhiNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2fe4898efNIdqVP+5OHXGsv', 'btn_RaceRankZhongzhiNode', __filename);
// script/ui/club/unionChildren/btn_RaceRankZhongzhiNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        imgRank: [cc.SpriteFrame]
    },
    onLoad: function onLoad() {
        this.ComTool = app.ComTool();
        // let rankScrollView = this.node.getChildByName("rankScrollView").getComponent(cc.ScrollView);
        //    rankScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    InitData: function InitData(clubId, unionId, unionPostType, zhongZhiShowStatus) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        var sendPack = {};
        sendPack.unionId = this.unionId;
        var sendPackName = "union.CUnionZhongZhiShowStatusInfo";
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            self.zhongZhiShowStatus = serverPack.zhongZhiShowStatus;
            var toptitle = self.node.getChildByName("topTitle");
            toptitle.getChildByName("lb_7").active = self.zhongZhiShowStatus;
            var toggleShowItem = self.node.getChildByName("toggleShowItem");
            toggleShowItem.getComponent(cc.Toggle).isChecked = self.zhongZhiShowStatus;
            self.node.getChildByName("lb_unionAllMemberPointTotal").active = this.zhongZhiShowStatus;
        }, function () {});
        // this.curPage = 1;
        this.type = 0; //默认显示常用数据-1
        this.InitLeft();
        this.InitLeftLb();
        var btn_default = this.node.getChildByName("topBtnNode").getChildByName("btn_tian0");
        this.OnClick(btn_default.name, btn_default);
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
    // GetNextPage:function(){
    // 	this.curPage++;
    // 	let sendPack = app.ClubManager().GetUnionSendPackHead();
    // 	sendPack.pageNum = this.curPage;
    // 	sendPack.type = this.curType;
    //     let self = this;
    //     app.NetManager().SendPack("union.CUnionRankingList",sendPack, function(serverPack){
    //         self.UpdateScrollView(serverPack, false);
    //     }, function(){
    //         app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
    //     });
    // },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        this.serverPack = serverPack;
        var rankScrollView = this.node.getChildByName("rankScrollView");
        var content = rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var matchItem = serverPack[i];
            var child = cc.instantiate(demo);
            child.zIndex = 10 + i; //普通数据放后面
            if (i % 2 == 0) {
                child.getComponent(cc.Sprite).enabled = true;
            } else {
                child.getComponent(cc.Sprite).enabled = false;
            }
            if (i >= 3) {
                child.getChildByName("img_rank").active = false;
                child.getChildByName("lb_rank").active = true;
                child.getChildByName("lb_rank").getComponent(cc.Label).string = i + 1;
            } else {
                child.getChildByName("img_rank").getComponent(cc.Sprite).spriteFrame = this.imgRank[i];
                child.getChildByName("img_rank").active = true;
                child.getChildByName("lb_rank").active = false;
                child.getChildByName("lb_rank").getComponent(cc.Label).string = "";
            }
            child.getChildByName("lb_clubName").getComponent(cc.Label).string = matchItem.clubName;
            child.getChildByName("lb_clubId").getComponent(cc.Label).string = matchItem.clubSign;
            child.getChildByName("lb_consumeValue").getComponent(cc.Label).string = matchItem.consumeValue;
            child.getChildByName("lb_bigWinner").getComponent(cc.Label).string = matchItem.bigWinner;
            child.getChildByName("lb_promotionShareValue").getComponent(cc.Label).string = matchItem.promotionShareValue;
            child.getChildByName("lb_unionAllMemberPointTotal").getComponent(cc.Label).string = matchItem.unionAllMemberPointTotal;
            child.getChildByName("lb_zhongZhiTotalPoint").getComponent(cc.Label).string = matchItem.zhongZhiTotalPoint;
            child.active = true;
            content.addChild(child);

            child.getChildByName("lb_unionAllMemberPointTotal").active = this.zhongZhiShowStatus;
        }
        content.sortAllChildren();
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
        if (btnName.startsWith("btn_tian")) {
            this.type = parseInt(btnName.replace("btn_tian", ''));
            this.GetUnionMemberRankedList(true);
            this.InitLeft();
        } else if (btnName.startsWith("lb_")) {
            //排序
            var key = parseInt(btnName.replace("lb_", ''));
            this.OrderBY(key);
        }
    },
    OrderBY: function OrderBY(key) {
        var orderfield = "";
        if (key == 3) {
            orderfield = "clubSign"; //亲友圈账号
        } else if (key == 4) {
            orderfield = "consumeValue"; //有效耗钻
        } else if (key == 5) {
            orderfield = "bigWinner"; //大赢家
        } else if (key == 6) {
            orderfield = "promotionShareValue"; //活跃积分
        } else if (key == 7) {
            orderfield = "unionAllMemberPointTotal"; //成员总积分
        } else if (key == 8) {
            orderfield = "zhongZhiTotalPoint"; //最终积分
        }
        if (key == this.orderType) {
            if (this.orderUpDown == 1) {
                this.orderUpDown = 2;
            } else {
                this.orderUpDown = 1;
            }
        }
        this.orderfield = orderfield;
        var self = this;
        this.serverPack.sort(function (a, b) {
            if (self.orderUpDown == 1) {
                return b[self.orderfield] - a[self.orderfield];
            } else {
                return a[self.orderfield] - b[self.orderfield];
            }
        });
        this.UpdateScrollView(this.serverPack, true);
        var rankScrollView = this.node.getChildByName("rankScrollView");
        var content = rankScrollView.getChildByName("view").getChildByName("content");
        content.sortAllChildren();
        this.orderType = key;
        this.InitOrderTip();
    },
    OnClickToggle: function OnClickToggle(event) {
        var isChecked = event.getComponent(cc.Toggle).isChecked;
        var sendPack = {};
        sendPack.unionId = this.unionId;
        if (isChecked) {
            sendPack.type = 1;
        } else {
            sendPack.type = 0;
        }
        var sendPackName = "union.CUnionChangeZhongZhiShowStatus";
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            self.zhongZhiShowStatus = serverPack.zhongZhiShowStatus;
            self.ShowOrHidePointTotal(self.zhongZhiShowStatus);
        }, function () {});
    },
    ShowOrHidePointTotal: function ShowOrHidePointTotal(isChecked) {
        this.zhongZhiShowStatus = isChecked;
        this.node.getChildByName("lb_unionAllMemberPointTotal").active = this.zhongZhiShowStatus;
        var toptitle = this.node.getChildByName("topTitle");
        toptitle.getChildByName("lb_7").active = this.zhongZhiShowStatus;
        var rankScrollView = this.node.getChildByName("rankScrollView");
        var content = rankScrollView.getChildByName("view").getChildByName("content");
        for (var i = 0; i < content.children.length; i++) {
            content.children[i].getChildByName("lb_unionAllMemberPointTotal").active = this.zhongZhiShowStatus;
        }
    },

    InitOrderTip: function InitOrderTip() {
        var toptitle = this.node.getChildByName("topTitle");
        for (var i = 3; i <= 8; i++) {
            toptitle.getChildByName("lb_" + i).getChildByName("orderdown").active = true;
            toptitle.getChildByName("lb_" + i).getChildByName("orderup").active = true;
        }
        if (this.orderType) {
            if (this.orderUpDown == 1) {
                //降序
                toptitle.getChildByName("lb_" + this.orderType).getChildByName("orderup").active = false;
            } else {
                //升序
                toptitle.getChildByName("lb_" + this.orderType).getChildByName("orderdown").active = false;
            }
        }
    },
    InitLeft: function InitLeft() {
        var tab = this.node.getChildByName("topBtnNode");
        for (var i = 0; i < tab.children.length; i++) {
            tab.children[i].getChildByName('img_off').active = i != this.type;
            tab.children[i].getChildByName('lb_off').active = i != this.type;
            tab.children[i].getChildByName('img_on').active = i == this.type;
            tab.children[i].getChildByName('lb_on').active = i == this.type;
        }
    },
    InitLeftLb: function InitLeftLb() {
        var tab = this.node.getChildByName("topBtnNode");
        for (var i = 0; i < tab.children.length; i++) {
            if (i <= 2 || i == 7) {
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
    SortByTag: function SortByTag(a, b) {
        if (this.orderUpDown == 1) {
            return b[this.orderfield] - a[this.orderfield];
        } else {
            return a[this.orderfield] - b[this.orderfield];
        }
    },
    GetUnionMemberRankedList: function GetUnionMemberRankedList(isRefresh) {
        this.orderType = 0; //默认不排序
        this.orderUpDown = 2; //1:降序，2:升序
        this.InitOrderTip();
        var sendPack = {};
        sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.type = this.type;
        var sendPackName = "union.CUnionMemberRankedList";
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            //根据选择的条数更改间距
            if (serverPack.length > 0) {
                self.UpdateScrollView(serverPack, isRefresh);
            }
        }, function () {});
        this.GetUnionCountRankedInfoByZhongZhi();
    },
    GetUnionCountRankedInfoByZhongZhi: function GetUnionCountRankedInfoByZhongZhi() {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.type = this.type;
        var sendPackName = "union.CUnionCountRankedInfoByZhongZhi";
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            self.node.getChildByName("lb_prizePool").getComponent(cc.Label).string = "总成本：" + serverPack.prizePool;
            self.node.getChildByName("lb_setCount").getComponent(cc.Label).string = "总局数：" + serverPack.setCount;
            self.node.getChildByName("lb_roomSize").getComponent(cc.Label).string = "总开房数：" + serverPack.roomSize;
            self.node.getChildByName("lb_consumeValue").getComponent(cc.Label).string = "总消耗钻石：" + serverPack.consumeValue;
            self.node.getChildByName("lb_bigWinner").getComponent(cc.Label).string = "大赢家数总合：" + serverPack.bigWinner;
            self.node.getChildByName("lb_unionAllMemberPointTotal").active = self.zhongZhiShowStatus;
            self.node.getChildByName("lb_unionAllMemberPointTotal").getComponent(cc.Label).string = "成员总积分总和：" + serverPack.unionAllMemberPointTotal;
            self.node.getChildByName("lb_finalAllMemberPointTotal").getComponent(cc.Label).string = "最终积分总合：" + serverPack.finalAllMemberPointTotal;
        }, function () {});
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
        //# sourceMappingURL=btn_RaceRankZhongzhiNode.js.map
        