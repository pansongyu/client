(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIPromoterAllManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '82a9410aMhN4qDXmAFTjlJx', 'UIPromoterAllManager', __filename);
// script/ui/club/UIPromoterAllManager.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        unSelectSprite: cc.SpriteFrame,
        selectSprite: cc.SpriteFrame
    },

    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
        this.searchInput = this.node.getChildByName("promoterListNode").getChildByName("searchInput").getChildByName("EditBox").getComponent(cc.EditBox);
        this.btn_addPromoter = this.node.getChildByName("promoterListNode").getChildByName("btn_addPromoter");
        this.btn_yaoqing = this.node.getChildByName("promoterListNode").getChildByName("btn_yaoqing");
        this.btn_setShowData = this.node.getChildByName("promoterListNode").getChildByName("btn_setShowData");
        this.bottomNode = this.node.getChildByName("promoterListNode").getChildByName("bottomNode");
        this.showList = [];
        this.showListSecond = [];
        this.curDateType = [];
        this.RegEvent("UpdateBaoMingFeiFenCheng", this.Event_BaoMingFeiFenCheng, this);
        var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        memberScrollView.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
        memberScrollView.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
        memberScrollView.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
        memberScrollView.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
    },
    OnTouch: function OnTouch(event) {
        if ('touchstart' == event.type) {} else if ('touchend' == event.type || 'touchcancel' == event.type) {
            //滑动结束动。检测哪些节点需要渲染
            this.CheckUserDisplay();
        } else if ('touchmove' == event.type) {}
    },
    Event_BaoMingFeiFenCheng: function Event_BaoMingFeiFenCheng(event) {
        var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        for (var i = 0; i < content.children.length; i++) {
            var child = content.children[i];
            if (child.pid == event.pid) {
                if (event.shareType == 0) {
                    child.getChildByName("demo").getChildByName("dataNode").getChildByName("lb_bili").getComponent(cc.Label).string = event.shareValue + "%";
                } else if (event.shareType == 1) {
                    child.getChildByName("demo").getChildByName("dataNode").getChildByName("lb_bili").getComponent(cc.Label).string = event.shareFixedValue;
                } else {
                    child.getChildByName("demo").getChildByName("dataNode").getChildByName("lb_bili").getComponent(cc.Label).string = "区间";
                }
                break;
            }
        }
    },
    GetPromoterList: function GetPromoterList(isRefresh) {
        this.orderType = 0; //默认不排序
        this.orderUpDown = 2; //1:降序，2:升序
        this.InitOrderTip();
        var sendPack = {};
        sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.query = this.ComTool.GetBeiZhuID(this.queryStr);
        sendPack.type = this.type;
        if (this.isGetSelf) {
            console.log("查找自己不用传pid");
        } else if (!this.isGetSelf && this.xiajiPid > 0) {
            sendPack.pid = this.xiajiPid;
        } else {
            console.log("找不到下级pid");
            return;
        }
        var sendPackName = "club.CClubPromotionLevelList";
        if (this.queryStr != "") {
            sendPackName = "club.CClubPromotionLevelIncludeAll"; //改成客户端自己过滤筛选出来
        } else if (this.type == -1) {
            sendPackName = "club.CClubPromotionLevelListCommonOp"; //常用操作
        }
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            self.showList = serverPack.showList;
            self.showListSecond = serverPack.showListSecond;
            self.curDateType = serverPack.dateType;
            //根据选择的条数更改间距
            var toptitle = self.node.getChildByName("promoterListNode").getChildByName("topTitle");
            toptitle.getComponent(cc.Layout).spacingX = (9 - self.showList.length) * 10;
            var dataNode = self.node.getChildByName("promoterListNode").getChildByName("demo").getChildByName("dataNode");
            dataNode.getComponent(cc.Layout).spacingX = (9 - self.showList.length) * 10;
            if (serverPack.clubPromotionLevelItemList.length > 0) {
                self.UpdateScrollView(serverPack.clubPromotionLevelItemList, isRefresh);
            }
        }, function () {
            // app.SysNotifyManager().ShowSysMsg("获取推广员列表失败",[],3);
        });
        this.node.getChildByName("bg_create").getChildByName("btn_shangyiji").active = this.isGetSelfList.length > 0;
    },
    //--------------显示函数-----------------
    OnShow: function OnShow(clubId, unionId, levelPromotion, unionPostType, myisminister, unionName, unionSign, isPromotionManage, promotionManagePid, kicking, modifyValue, showShare, invite) {
        var isGetSelf = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : true;

        this.clubId = clubId;
        this.unionId = unionId;
        this.levelPromotion = levelPromotion; //大于0是推广员
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.isPromotionManage = isPromotionManage; //推官员管理
        this.promotionManagePid = promotionManagePid;
        this.kicking = kicking;
        this.modifyValue = modifyValue;
        this.showShare = showShare;
        this.invite = invite;
        this.isGetSelf = isGetSelf;
        this.xiajiPid = 0;
        this.selfPid = app.HeroManager().GetHeroProperty("pid");
        this.searchInput.string = "";
        this.queryStr = "";
        //返回的时候使用
        this.isGetSelfList = [];
        this.xiajiPidList = [];
        this.type = 0; //默认显示常用数据-1
        this.InitLeft();
        this.InitLeftLb();
        //返回的时候使用
        if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            this.btn_addPromoter.active = true;
            this.btn_setShowData.active = true;
            this.btn_yaoqing.active = false;
        } else {
            this.btn_addPromoter.active = false;
            this.btn_setShowData.active = false;
            //是否有权限
            if (this.invite == 0) {
                this.btn_yaoqing.active = false;
            } else {
                this.btn_yaoqing.active = true;
            }
        }
        var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        memberScrollView.getComponent(cc.ScrollView).scrollToTop();
        this.DestroyAllChildren(content);
        this.GetPromoterList(true);
    },
    InitOrderTip: function InitOrderTip() {
        var toptitle = this.node.getChildByName("promoterListNode").getChildByName("topTitle");
        for (var i = 3; i <= 16; i++) {
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
        if (this.type == -1) {
            this.node.getChildByName("btn_commonOp").getChildByName('off').active = false;
            this.node.getChildByName("btn_commonOp").getChildByName('on').active = true;
        } else {
            this.node.getChildByName("btn_commonOp").getChildByName('off').active = true;
            this.node.getChildByName("btn_commonOp").getChildByName('on').active = false;
        }
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
    SortByTag: function SortByTag(a, b) {
        if (this.orderUpDown == 1) {
            return b[this.orderfield] - a[this.orderfield];
        } else {
            return a[this.orderfield] - b[this.orderfield];
        }
    },

    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        this.serverPackFrom = [];
        this.serverPack = serverPack;
        for (var i = 0; i < serverPack.length; i++) {
            this.serverPackFrom.push(serverPack[i]);
        }
        var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            memberScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }

        var demo = this.node.getChildByName("promoterListNode").getChildByName("demo");
        demo.active = false;
        for (var _i = 0; _i < serverPack.length; _i++) {
            //第一页有一条特殊的数据
            var child = new cc.Node();
            child.anchorY = 1;
            child.width = demo.width;
            child.height = demo.height;
            if (_i == 0) {
                child.zIndex = -1000; //定死在第一个
                //child.getChildByName("tip_all").active=true;
            } else if (serverPack[_i].specialFlag == true) {
                child.active = true;
                child.zIndex = 1; //特殊的数据需要放在第二条，恶心的需求
            } else {
                child.active = true;
                child.zIndex = 10 + _i; //普通数据放后面
            }
            child.isDisplay = false;
            child.pid = serverPack[_i].pid;
            child.number = serverPack[_i].number;
            child.setCount = serverPack[_i].setCount;
            child.winner = serverPack[_i].winner;
            child.entryFee = serverPack[_i].entryFee;
            child.shareFixedValue = serverPack[_i].shareFixedValue;
            child.shareValue = serverPack[_i].shareValue;
            child.scorePoint = serverPack[_i].scorePoint;
            child.consume = serverPack[_i].consume;
            child.sportsPointConsume = serverPack[_i].sportsPointConsume;
            child.sportsPoint = serverPack[_i].sportsPoint;
            child.sumSportsPoint = serverPack[_i].sumSportsPoint;
            child.myisminister = serverPack[_i].myisminister;
            content.addChild(child);
        }
        content.sortAllChildren();
        this.CheckUserDisplay();
    },
    PidGetData: function PidGetData(pid) {
        //0shi 
        for (var i = 1; i < this.serverPackFrom.length; i++) {
            var checkPid = this.serverPackFrom[i].pid;
            if (pid == checkPid) {
                return this.serverPackFrom[i];
            }
        }
    },
    CheckUserDisplay: function CheckUserDisplay() {
        var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        var ScrollOffset = memberScrollView.getComponent(cc.ScrollView).getScrollOffset();
        var gundongY = ScrollOffset.y;
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        content.getComponent(cc.Layout).updateLayout();
        var demo = this.node.getChildByName("promoterListNode").getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < content.children.length; i++) {
            if (content.children[i].y + gundongY > -1300) {
                //需要渲染
                if (content.children[i].isDisplay == false) {
                    //开始渲染,把空节点替换成真实节点
                    var nullNode = content.children[i];
                    nullNode.isDisplay = true;
                    var child = cc.instantiate(demo);
                    var serverPack = null;
                    if (i == 0) {
                        //固定是本家总数据
                        serverPack = this.serverPack[0];
                        child.getChildByName("tip_all").active = this.searchInput.string == ""; //搜索时不变色
                        //child.getChildByName("controlNode").active=true;
                    } else {
                        serverPack = this.PidGetData(nullNode.pid);
                    }
                    if (typeof serverPack == "undefined") {
                        //防止意外获取数据
                        continue;
                    }
                    child.pid = serverPack.pid;
                    child.myisminister = serverPack.myisminister;

                    child.active = true;

                    var dataNode = child.getChildByName("dataNode"); //数据父节点
                    var toptitle = this.node.getChildByName("promoterListNode").getChildByName("topTitle"); //标题父节点

                    child.playerData = serverPack;
                    if (serverPack.iconUrl) {
                        app.WeChatManager().InitHeroHeadImage(serverPack.pid, serverPack.iconUrl);
                        var WeChatHeadImage = dataNode.getChildByName('img_head').getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(serverPack.pid, serverPack.iconUrl);
                    }
                    //自己不能操作自己，不能操作创建者, 创建者可以操作创建者
                    // if (child.pid == this.selfPid && 
                    //     child.myisminister != app.ClubManager().Club_MINISTER_CREATER) {
                    //     child.getChildByName("btn_control").active = false;
                    // }else{
                    //     child.getChildByName("btn_control").active = true;
                    // }
                    dataNode.getChildByName("lb_userName").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(serverPack.pid, serverPack.name);
                    dataNode.getChildByName("lb_userName").getChildByName("lb_userId").getComponent(cc.Label).string = "ID:" + serverPack.pid;
                    dataNode.getChildByName("lb_playerNum").getComponent(cc.Label).string = serverPack.number;
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_4"), dataNode.getChildByName("lb_jushu"), serverPack.setCount, 0);
                    // this.ShowOrHideDataNode(toptitle.getChildByName("lb_4"),dataNode.getChildByName("lb_dayingjia"),serverPack.winner);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_5"), dataNode.getChildByName("lb_costSp"), serverPack.entryFee, 1); //理论报名费
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_12"), dataNode.getChildByName("lb_actualEntryFee"), serverPack.actualEntryFee, 2); //实际报名费
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_13"), dataNode.getChildByName("lb_spWarningPromoter"), serverPack.sportsPointWarning, 9); //推广员预警值
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_14"), dataNode.getChildByName("lb_spWarningPersonal"), serverPack.personalSportsPointWarning, 10); //个人预警值
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_15"), dataNode.getChildByName("lb_allScorePoint"), serverPack.totalPoint, 11); //总积分
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_16"), dataNode.getChildByName("lb_playerTotalPoint"), serverPack.playerTotalPoint, 12); //成员总积分


                    if (serverPack.shareType == 1) {
                        this.ShowOrHideDataNode(toptitle.getChildByName("lb_6"), dataNode.getChildByName("lb_bili"), serverPack.shareFixedValue, 3);
                    } else if (serverPack.shareType == 0) {
                        this.ShowOrHideDataNode(toptitle.getChildByName("lb_6"), dataNode.getChildByName("lb_bili"), serverPack.shareValue, 3, "%");
                    } else if (serverPack.shareType == 2) {
                        this.ShowOrHideDataNode(toptitle.getChildByName("lb_6"), dataNode.getChildByName("lb_bili"), "区间", 3);
                    }
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_7"), dataNode.getChildByName("lb_scorePoint"), serverPack.scorePoint, 4);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_8"), dataNode.getChildByName("lb_costZuan"), serverPack.consume, 5);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_9"), dataNode.getChildByName("lb_WinLostSp"), serverPack.sportsPointConsume, 6);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_10"), dataNode.getChildByName("curSpNode").getChildByName("lb_curSportPoint"), serverPack.sportsPoint, 7);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_11"), dataNode.getChildByName("sumSpNode").getChildByName("lb_sumSportPoint"), serverPack.sumSportsPoint, 8);
                    if (serverPack.level > 0) {
                        child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_xiaji").active = true;
                        dataNode.getChildByName('img_head').getChildByName("img_tg").active = true;
                        if (this.showListSecond.indexOf(1) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = true;
                        } else {
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        }
                    } else {
                        child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_xiaji").active = false;
                        dataNode.getChildByName('img_head').getChildByName("img_tg").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                    }
                    if (this.unionId > 0) {
                        child.getChildByName("controlNode").getChildByName("btn_jjdz").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_bmffc").active = child.pid != this.selfPid;
                        if (this.showListSecond.indexOf(1) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = true;
                        } else {
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        }
                        if (this.showListSecond.indexOf(2) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = true;
                        } else {
                            child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                        }
                    } else {
                        child.getChildByName("controlNode").getChildByName("btn_jjdz").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_bmffc").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                    }
                    if (child.pid == this.selfPid) {
                        if (child.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
                            child.getChildByName("controlNode").getChildByName("btn_xiaji").active = true;
                            child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                        } else {
                            child.getChildByName("controlNode").getChildByName("btn_xiaji").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_jjdz").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_baobiao").active = false;
                        }
                        //预警值本身不能修改
                        child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                        //我的分成
                        if (this.showListSecond.indexOf(0) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_selfFenCheng").active = true;
                        } else {
                            child.getChildByName("controlNode").getChildByName("btn_selfFenCheng").active = false;
                        }
                    } else {
                        child.getChildByName("controlNode").getChildByName("btn_selfFenCheng").active = false;
                    }
                    if (this.isPromotionManage > 0) {
                        child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                        if (child.pid == this.promotionManagePid) {
                            //如果是推广员，那不能操作创建者
                            child.getChildByName("controlNode").getChildByName("btn_xiaji").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_jjdz").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_baobiao").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_bmffc").active = false;
                        }
                    }
                    if (this.levelPromotion > 0 && !this.myisminister && this.kicking == 0) {
                        child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                    }
                    //child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false; //所有人都隐藏这个移除按钮
                    if (this.modifyValue == 0) {
                        child.getChildByName("controlNode").getChildByName("btn_changePromoter").active = false;
                    }
                    if (this.myisminister != app.ClubManager().Club_MINISTER_CREATER) {
                        child.getChildByName("controlNode").getChildByName("btn_powerOp").active = false;
                    }
                    //是否显示审核按钮或者状态
                    /**
                     * 审核状态
                     * 0 不显示
                     * 1 未审核
                     * 2 已审核
                     */
                    child.getChildByName("controlNode").getChildByName("btn_Examine").totalPoint = serverPack.totalPoint;
                    if (serverPack.examineStatus == 0) {
                        dataNode.getChildByName('img_head').getChildByName("img_ysh").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_Examine").active = false;
                    } else if (serverPack.examineStatus == 1) {
                        dataNode.getChildByName('img_head').getChildByName("img_ysh").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_Examine").active = true;
                    } else if (serverPack.examineStatus == 2) {
                        dataNode.getChildByName('img_head').getChildByName("img_ysh").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_Examine").active = false;
                    }
                    nullNode.addChild(child);
                    if (i == 0) {
                        //默认点击打开第一个
                        this.OnClick('btn_ShowBtn', child.getChildByName("btn_ShowBtn"));
                    }
                }
            }
        }
    },
    // /**
    // * 局数
    // */
    // Game_Count(0),
    // /**
    // * 报名费
    // */
    // Rank_Cost(1),
    // /**
    // * 贡献值
    // */
    // Contribution_Value(2),
    // /**
    // * 分成
    // */
    // Share_Value(3),
    // /**
    // * 活跃度
    // */
    // Activity_Value(4),
    // /**
    // * 消耗钻石
    // */
    // Diamond_Cost(5),
    // *
    // * 输赢比赛分
    // SportsPoint_WinOrLose(6),
    // /**
    // * 个人比赛分
    // */
    // SportsPoint_Personal(7),
    // /**
    // * 总比赛分
    // */
    // SportsPoint_Total(8),
    // /**
    // * 推广员预警值
    // */
    // SportsPointWarn_Promotion(9),
    // /**
    // * 个人预警值
    // */
    // SportsPointWarn_Personal(10),
    // /**
    // * 总积分
    // */
    // Total_Point(11),
    ShowOrHideDataNode: function ShowOrHideDataNode(titleNode, node, data, ShowIndexByServer) {
        var strEx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

        if (this.showList.indexOf(ShowIndexByServer) > -1) {
            if (node.name == "lb_curSportPoint" || node.name == "lb_sumSportPoint") {
                node.parent.active = true;
            } else {
                node.active = true;
            }
            titleNode.active = true;
            if ((node.name == "lb_spWarningPromoter" || node.name == "lb_spWarningPersonal" || node.name == "lb_shengcunPoint") && typeof data == "undefined") {
                //个人预警值 推广员预警值  小于0 显示无
                node.getComponent(cc.Label).string = "无";
            } else {
                node.getComponent(cc.Label).string = data + strEx;
            }
        } else {
            if (node.name == "lb_curSportPoint" || node.name == "lb_sumSportPoint") {
                node.parent.active = false;
            } else {
                node.active = false;
            }
            titleNode.active = false;
        }
    },
    OrderBY: function OrderBY(key) {
        var orderfield = "";
        if (key == 3) {
            orderfield = "number"; //玩家数
        } else if (key == 4) {
            orderfield = "setCount"; //局数
        } else if (key == 5) {
            orderfield = "theoryEntryFee"; //理论报名费
        } else if (key == 6) {
            orderfield = "shareValue"; //分成
        } else if (key == 7) {
            orderfield = "scorePoint"; //活跃度
        } else if (key == 8) {
            orderfield = "consume"; //消耗砖石
        } else if (key == 9) {
            orderfield = "sportsPointConsume"; //输赢比赛分
        } else if (key == 10) {
            orderfield = "sportsPoint"; //个人比赛分
        } else if (key == 11) {
            orderfield = "sumSportsPoint"; //总比赛分
        } else if (key == 12) {
            orderfield = "actualEntryFee"; //实际报名费
        } else if (key == 13) {
            orderfield = "sportsPointWarning"; //推广员预警值
        } else if (key == 14) {
            orderfield = "personalSportsPointWarning"; //个人预警值
        } else if (key == 15) {
            orderfield = "totalPoint"; //总积分
        } else if (key == 16) {
            orderfield = "playerTotalPoint"; //个人总积分
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

        var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        for (var i = 1; i < content.children.length; i++) {
            //第一条定死的，不修改zIndex
            content.children[i].zIndex = this.GetPidZindex(content.children[i].pid, orderfield);
        }
        content.sortAllChildren();
        this.CheckUserDisplay();
        this.orderType = key;
        this.InitOrderTip();
    },
    GetPidZindex: function GetPidZindex(pid, field) {
        for (var i = 1; i < this.serverPack.length; i++) {
            if (pid == this.serverPack[i].pid) {
                return i;
            }
        }
        return 0;
    },
    //---------点击函数---------------------
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
        var self = this;
        var sendPack = {};
        if (msgID == "CANCELPROMOTER") {
            sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = backArgList[0].parent.parent.pid;
            sendPack.type = 1;
            app.NetManager().SendPack("club.CClubSubordinateLevelAppoint", sendPack, function (serverPack) {
                self.GetPromoterList(true);
            }, function () {});
        } else if (msgID == "DEL_PROMOTER") {
            sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = backArgList[0].parent.parent.pid;
            app.NetManager().SendPack("club.CClubSubordinateLevelDelete", sendPack, function (serverPack) {
                self.GetPromoterList(true);
            }, function () {});
        } else if ('MSG_PROMOTER_EXAMINE' == msgID) {
            var _sendPack = {};
            var _self = this;
            _sendPack.clubId = this.clubId;
            _sendPack.value = cbArgs[0];
            _sendPack.opPid = cbArgs[1];
            _sendPack.dateType = this.curDateType;
            app.NetManager().SendPack("club.CClubSportsPointExamine", _sendPack, function (serverPack) {
                app.SysNotifyManager().ShowSysMsg("审核成功");
                _self.GetPromoterList(true);
            }, function () {});
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        var self = this;
        if ('btn_close' == btnName) {
            this.isGetSelf = true;
            this.xiajiPid = 0;
            this.CloseForm();
        } else if ('btn_commonOp' == btnName) {
            this.type = -1;
            this.GetPromoterList(true);
            this.InitLeft();
        } else if (btnName.startsWith("btn_tian")) {
            this.type = parseInt(btnName.replace("btn_tian", ''));
            this.GetPromoterList(true);
            this.InitLeft();
        } else if ('btn_all' == btnName) {
            this.type = -2;
            this.GetPromoterList(true);
            this.InitLeft();
        } else if ('btn_setSportsPoint' == btnName) {
            var clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!clubData) {
                return;
            }
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.opPid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubSubordinateLevelSportsPoint", sendPack, function (serverPack) {
                var playerData = btnNode.parent.parent.playerData;
                //默认是普通成员的修改
                var data = { "name": playerData.name,
                    "pid": app.ComTool().GetPid(playerData.pid),
                    "targetPL": serverPack.sportsPoint,
                    "owerPL": serverPack.allowSportsPoint,
                    "myisminister": 0,
                    "targetClubId": self.clubId
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UIUserSetPL_2", data, false, true);
                } else {
                    app.FormManager().ShowForm("ui/club/UIUserSetPL", data, false, true);
                }
                //app.FormManager().ShowForm("ui/club/UIUserSetPL",data,false,true);
            }, function () {});
        } else if ('btn_bmffc' == btnName) {
            var _clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!_clubData) {
                return;
            }
            var _sendPack2 = {};
            _sendPack2.clubId = this.clubId;
            _sendPack2.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubPromotionShareInfo", _sendPack2, function (serverPack) {
                var playerData = btnNode.parent.parent.playerData;
                //默认是普通成员的修改
                var data = {
                    "name": playerData.name,
                    "pid": app.ComTool().GetPid(playerData.pid),
                    "shareValue": serverPack.shareValue,
                    "shareFixedValue": serverPack.shareFixedValue,
                    "doShareValue": serverPack.doShareValue,
                    "minShareValue": serverPack.minShareValue,
                    "doShareFixedValue": serverPack.doShareFixedValue,
                    "minShareFixedValue": serverPack.minShareFixedValue,
                    "shareType": serverPack.shareType
                };
                app.FormManager().ShowForm("ui/club/UIUserSetBaoMingFei", data);
            }, function () {});
        } else if ('btn_xiaji' == btnName) {
            //返回的时候使用
            if (btnNode.parent.parent.pid == this.xiajiPid && this.xiajiPidList.length > 0) {
                return;
            }
            this.isGetSelfList.push(this.isGetSelf);
            this.xiajiPidList.push(this.xiajiPid);
            //返回的时候使用
            this.searchInput.string = "";
            this.queryStr = "";
            this.isGetSelf = false;
            this.xiajiPid = btnNode.parent.parent.pid;
            this.GetPromoterList(true);
        } else if ('btn_shangyiji' == btnName) {
            this.searchInput.string = "";
            this.queryStr = "";
            //返回的时候使用
            this.isGetSelf = this.isGetSelfList.pop();
            this.xiajiPid = this.xiajiPidList.pop();
            //返回的时候使用
            this.GetPromoterList(true);
        } else if ('btn_setPromoter' == btnName) {
            var _sendPack3 = {};
            _sendPack3.clubId = this.clubId;
            _sendPack3.pid = btnNode.parent.parent.pid;
            _sendPack3.type = 0;
            app.NetManager().SendPack("club.CClubSubordinateLevelAppoint", _sendPack3, function (serverPack) {
                self.GetPromoterList(true);
            }, function () {});
        } else if ('btn_cancelPromoter' == btnName) {
            this.SetWaitForConfirm('CANCELPROMOTER', this.ShareDefine.Confirm, [], [btnNode], "取消后该推广员下的所有玩家归属将发生变化，请确认取消");
        } else if ('btn_record' == btnName) {
            app.FormManager().ShowForm('ui/club/UIPromoterRecordUser', this.clubId, btnNode.parent.parent.pid, 0);
        } else if ('btn_baobiao' == btnName) {
            var newPath = 'ui/club/UIPromoterAllReport';
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                newPath = 'ui/club_2/UIPromoterAllReport_2';
            }
            app.FormManager().ShowForm(newPath, this.clubId, btnNode.parent.parent.pid);
        } else if ('btn_delPromoter' == btnName) {
            this.SetWaitForConfirm('DEL_PROMOTER', this.ShareDefine.Confirm, [], [btnNode], "是否将该推广员移除并踢出亲友圈？");
        } else if ('btn_ShowBtn' == btnName || 'btn_control' == btnName) {
            //自己不能操作自己，不能操作创建者
            var targetPid = btnNode.parent.parent.pid;
            var targetMinister = btnNode.parent.parent.myisminister;
            if ('btn_ShowBtn' == btnName) {
                targetPid = btnNode.parent.pid;
                targetMinister = btnNode.parent.myisminister;
            }
            // if (targetPid == this.selfPid && targetMinister != app.ClubManager().Club_MINISTER_CREATER) {
            //     return;
            // }
            var allUserNode = btnNode.parent.parent.parent.children;
            var controlNode = btnNode.parent.getChildByName("controlNode");
            for (var i = 0; i < allUserNode.length; i++) {
                if (allUserNode[i].isDisplay == true) {
                    var userControlNode = allUserNode[i].children[0].getChildByName("controlNode");
                    if (userControlNode && controlNode != userControlNode) {
                        userControlNode.active = false;
                        userControlNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                        userControlNode.parent.height = 80;
                        userControlNode.parent.parent.height = 80;
                    }
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.selectSprite;
                btnNode.parent.height = 230;
                btnNode.parent.parent.height = 230;
            } else {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                btnNode.parent.height = 80;
                btnNode.parent.parent.height = 80;
            }
        } else if ('btn_addPromoter' == btnName) {
            app.FormManager().ShowForm("ui/club/UIPromoterLevelAdd", this.clubId);
        } else if ('btn_yaoqing' == btnName) {
            //推官员管理，又是推广员
            app.FormManager().ShowForm("ui/club/UIPromoterXIaShuAdd", this.clubId, this.levelPromotion > 0 && this.isPromotionManage);
        } else if ('btn_setShowData' == btnName) {
            var _newPath = 'ui/club/UIPromoterShowSetting';
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                _newPath = 'ui/club_2/UIPromoterShowSetting_2';
            }
            app.FormManager().ShowForm(_newPath, this.clubId, this.showList, this.showListSecond);
        } else if ('btn_search' == btnName) {
            this.queryStr = this.searchInput.string;
            var memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
            var content = memberScrollView.getChildByName("view").getChildByName("content");
            memberScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.GetPromoterList(true);
        } else if ('btn_allReport' == btnName) {
            var _newPath2 = 'ui/club/UIPromoterAllReport';
            if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                _newPath2 = 'ui/club_2/UIPromoterAllReport_2';
            }
            if (!this.isGetSelf && this.xiajiPid > 0) {
                app.FormManager().ShowForm(_newPath2, this.clubId, this.xiajiPid);
            } else {
                app.FormManager().ShowForm(_newPath2, this.clubId);
            }
        } else if ('btn_jjdz' == btnName) {
            app.FormManager().ShowForm('ui/club/UIClubUserMessageNew', this.clubId, this.unionId, this.unionName, this.unionSign, btnNode.parent.parent.pid);
        } else if ('btn_sm' == btnName) {
            app.FormManager().ShowForm('ui/club/UIPromoterSM');
        } else if ('btn_powerOp' == btnName) {
            var _self2 = this;
            var _sendPack4 = {};
            _sendPack4.clubId = this.clubId;
            _sendPack4.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubPromotionLevelPowerInfo", _sendPack4, function (serverPack) {
                app.FormManager().ShowForm("ui/club/UIPromoterPowerOp", _self2.clubId, btnNode.parent.parent.pid, serverPack.kicking, serverPack.modifyValue, serverPack.showShare, serverPack.invite);
            }, function () {});
        } else if ('btn_changePromoter' == btnName) {
            var _self3 = this;
            app.NetManager().SendPack("club.CClubGetUplevelPromotion", { "clubId": this.clubId, "pid": btnNode.parent.parent.pid }, function (serverPack) {
                app.FormManager().ShowForm("ui/club/UIPromoterSet", _self3.clubId, btnNode.parent.parent.pid, serverPack.player);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取上级推广员失败", [], 3);
            });
        } else if ("btn_sportsPointWarning" == btnName) {
            var _clubData2 = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!_clubData2) {
                return;
            }
            var _sendPack5 = {};
            _sendPack5.clubId = this.clubId;
            _sendPack5.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubSportsPointWaningInfo", _sendPack5, function (serverPack) {
                //默认是普通成员的修改
                var data = {
                    "name": serverPack.name,
                    "pid": app.ComTool().GetPid(serverPack.pid),
                    "warnStatus": serverPack.warnStatus,
                    "sportsPointWarning": serverPack.sportsPointWarning
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UISetSportsPointWarning_2", data);
                } else {
                    app.FormManager().ShowForm("ui/club/UISetSportsPointWarning", data);
                }
                //app.FormManager().ShowForm("ui/club/UISetSportsPointWarning",data);
            }, function () {});
        } else if ("btn_spWarningPersonal" == btnName) {
            var _clubData3 = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!_clubData3) {
                return;
            }
            var _sendPack6 = {};
            _sendPack6.clubId = this.clubId;
            _sendPack6.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubPersonalSportsPointWaningInfo", _sendPack6, function (serverPack) {
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
                //app.FormManager().ShowForm("ui/club/UISetSportsPointWarning",data);
            }, function () {});
        } else if ("btn_AlivePointWaning" == btnName) {
            var _clubData4 = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!_clubData4) {
                return;
            }
            var _sendPack7 = {};
            _sendPack7.clubId = this.clubId;
            _sendPack7.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubAlivePointWaningInfo", _sendPack7, function (serverPack) {
                //默认是普通成员的修改
                var data = {
                    "name": serverPack.name,
                    "pid": app.ComTool().GetPid(serverPack.pid),
                    "alivePointStatus": serverPack.warnStatus,
                    "alivePoint": serverPack.sportsPointWarning,
                    "isPersonal": true
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UISetSportsPointWarning_2", data);
                } else {
                    app.FormManager().ShowForm("ui/club/UISetSportsPointWarning", data);
                }
                //app.FormManager().ShowForm("ui/club/UISetSportsPointWarning",data);
            }, function () {});
        } else if ("btn_EliminarePoint" == btnName) {
            var _clubData5 = app.ClubManager().GetClubDataByClubID(this.clubId);
            if (!_clubData5) {
                return;
            }
            var _sendPack8 = {};
            var _self4 = this;
            _sendPack8.clubId = this.clubId;
            _sendPack8.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubEliminarePointInfo", _sendPack8, function (serverPack) {
                //默认是普通成员的修改
                var data = {
                    "clubId": _self4.clubId,
                    "name": serverPack.name,
                    "pid": app.ComTool().GetPid(serverPack.pid),
                    // "warnStatus":serverPack.personalWarnStatus,
                    "eliminatePoint": serverPack.sportsPointWarning,
                    "isPersonal": true
                };
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    app.FormManager().ShowForm("ui/club_2/UIChangeSportsPointWarning_2", data);
                } else {
                    app.FormManager().ShowForm("ui/club/UIChangeSportsPointWarning", data);
                }
                //app.FormManager().ShowForm("ui/club/UISetSportsPointWarning",data);
            }, function () {});
        } else if ("btn_selfFenCheng" == btnName) {
            var _sendPack9 = {};
            _sendPack9.clubId = this.clubId;
            _sendPack9.pid = btnNode.parent.parent.pid;
            app.NetManager().SendPack("club.CClubPromotionShareInfoSelf", _sendPack9, function (serverPack) {
                var playerData = btnNode.parent.parent.playerData;
                //默认是普通成员的修改
                var data = {
                    "name": serverPack.name,
                    "pid": serverPack.pid,
                    "shareValue": serverPack.shareValue,
                    "shareFixedValue": serverPack.shareFixedValue,
                    "shareType": serverPack.shareType
                };
                app.FormManager().ShowForm("ui/club/UIUserSelfBaoMingFei", data);
            }, function () {});
        } else if ("btn_Examine" == btnName) {
            var totalPoint = btnNode.totalPoint;
            var opPid = btnNode.parent.parent.pid;
            this.SetWaitForConfirm('MSG_PROMOTER_EXAMINE', this.ShareDefine.Confirm, [], [totalPoint, opPid], "确认对该推广员进行审核，该推广员当前总积分为 " + totalPoint + "，审核将会减少/增加您对应的比赛分");
        } else if (btnName.startsWith("lb_")) {
            //排序
            var key = parseInt(btnName.replace("lb_", ''));
            this.OrderBY(key);
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
        //# sourceMappingURL=UIPromoterAllManager.js.map
        