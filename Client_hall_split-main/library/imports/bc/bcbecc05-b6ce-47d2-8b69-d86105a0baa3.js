"use strict";
cc._RF.push(module, 'bcbecwFts5H0otp2GEFoLqj', 'UIClubReport');
// script/ui/club/UIClubReport.js

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
        recordlist_demo: cc.Node,
        top: cc.Node,
        editbox: cc.EditBox
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.WeChatManager = app.WeChatManager();
        this.lb_page = this.node.getChildByName("page").getChildByName("lb_page");
        this.pageEditBox = this.node.getChildByName("pageGo").getChildByName("pageEditBox").getComponent(cc.EditBox);
        // this.recordlist_scrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, roomIDList, isAll, getType, isShowAllClub, unionId) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.isShowAllClub = isShowAllClub;
        this.roomIDList = roomIDList;
        this.isAll = isAll;
        this.getType = getType;
        this.recordlist_demo.active = false;
        this.recordlist_scrollView.scrollToTop();
        //this.recordlist_layout.removeAllChildren();
        this.DestroyAllChildren(this.recordlist_layout);
        this.recordPage = 1;
        this.pageNumTotal = 1;
        this.lastRecordPage = 1;
        //刷新页数
        this.pageEditBox.string = "";
        this.lb_page.getComponent(cc.Label).string = this.recordPage + "/" + this.pageNumTotal;
        this.editbox.string = "";
        this.toBttom = false;
        this.GetClubRecord(true);
    },
    GetClubRecord: function GetClubRecord() {
        var isRefresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        this.query = this.ComTool.GetBeiZhuID(this.editbox.string);
        if (this.isAll) {
            this.roomIDList = [];
        }
        var sendPack = { "clubId": this.clubId, "roomIDList": this.roomIDList, "isAll": this.isAll, "getType": this.getType, "pageNum": this.recordPage, "query": this.query };
        if (this.unionId > 0 && this.isShowAllClub) {
            //显示所有亲友圈战绩
            sendPack.unionId = this.unionId;
        }
        var that = this;
        this.NetManager.SendPack("club.CClubSChoolReport", sendPack, function (event) {
            that.pageNumTotal = event.totalPageNum;
            if (event.clubPlayerRoomAloneLogBOS.length > 0) {
                that.ShowRecordList(event.clubPlayerRoomAloneLogBOS, isRefresh);
                //刷新页数
                that.lb_page.getComponent(cc.Label).string = that.recordPage + "/" + that.pageNumTotal;
            } else {
                that.recordPage = that.lastRecordPage;
            }
            that.toBttom = false;
        }, function (error) {
            console.log(error);
        });
    },
    GetNextPage: function GetNextPage() {
        if (this.toBttom == true) {
            return;
        }
        this.toBttom = true;
        this.recordPage++;
        this.GetClubRecord(this.recordType, false);
    },
    SortByCanYu: function SortByCanYu(a, b) {
        if (a.size > b.size) {
            return -1;
        }
        return 1;
    },
    ShowRecordList: function ShowRecordList(data, isRefresh) {
        if (isRefresh) {
            this.recordlist_scrollView.scrollToTop();
            //this.recordlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.recordlist_layout);
        }
        data.sort(this.SortByCanYu);
        //this.top.getChildByName('lb_fangka').getComponent(cc.Label).string='总消耗房卡:'+roomCardTotalCount;
        for (var i = 0; i < data.length; i++) {
            var playerData = data[i];
            //先判断下是否已经存在
            var isExist = false;
            for (var j = 0; j < this.recordlist_layout.children.length; j++) {
                if (this.recordlist_layout.children[j].pid == playerData['player'].pid) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            var nodePrefab = cc.instantiate(this.recordlist_demo);
            nodePrefab.active = true;
            this.recordlist_layout.addChild(nodePrefab);
            playerData.pid = playerData['player'].pid;
            nodePrefab.getChildByName('lb_fangka').getComponent(cc.Label).string = "钻石：" + playerData.roomCard + "个/" + playerData.roomCardSize + "局";
            nodePrefab.getChildByName('lb_quanka').getComponent(cc.Label).string = "圈卡：" + playerData.clubCard + "张/" + playerData.clubCardSize + "局";
            nodePrefab.getChildByName('lb_canyu').getComponent(cc.Label).string = "参    与：" + playerData['size'] + "局";
            nodePrefab.getChildByName('lb_yingjia').getComponent(cc.Label).string = "大赢家：" + playerData.winner + "场";
            if (typeof playerData.sportsPoint != "undefined") {
                if (playerData.sportsPoint > 0) {
                    nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = "比赛分：+" + playerData.sportsPoint;
                } else {
                    nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = "比赛分：" + playerData.sportsPoint;
                }
                if (typeof playerData['player'].clubName != "undefined") {
                    nodePrefab.getChildByName('lb_clubName').getComponent(cc.Label).string = playerData['player'].clubName;
                } else {
                    nodePrefab.getChildByName('lb_clubName').getComponent(cc.Label).string = "";
                }
            } else {
                nodePrefab.getChildByName('lb_pl').getComponent(cc.Label).string = "";
                nodePrefab.getChildByName('lb_clubName').getComponent(cc.Label).string = "";
            }

            nodePrefab.getChildByName('lb_point').getComponent(cc.Label).string = playerData.point;
            if (playerData.point > 0) {
                nodePrefab.getChildByName('lb_point').getComponent(cc.Label).string = '+' + playerData.point;
            } else {
                nodePrefab.getChildByName('lb_point').getComponent(cc.Label).string = playerData.point;
                nodePrefab.getChildByName('lb_point').color = cc.color(70, 169, 77);
            }
            nodePrefab.getChildByName('lb_name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerData['player'].pid, playerData['player'].name);
            nodePrefab.getChildByName('lb_id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(playerData['player'].pid) });
            if (playerData['player'].iconUrl) {
                this.WeChatManager.InitHeroHeadImage(playerData['player'].pid, playerData['player'].iconUrl);
                var WeChatHeadImage = nodePrefab.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.ShowHeroHead(playerData['player'].pid, playerData['player'].iconUrl);
            }
            nodePrefab.getChildByName('btn_detail').playerData = playerData;
        }
    },
    Click_btn_search: function Click_btn_search() {
        this.recordlist_scrollView.scrollToTop();
        //this.recordlist_layout.removeAllChildren();
        this.DestroyAllChildren(this.recordlist_layout);
        var shuru = this.editbox.string;
        /*if(shuru==""){
            return;
        }*/
        this.recordPage = 1;
        this.GetClubRecord(true);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.DestroyAllChildren(this.recordlist_layout);
            this.CloseForm();
        } else if ('btn_next' == btnName) {
            this.lastRecordPage = this.recordPage;
            this.recordPage++;
            this.GetClubRecord(true);
        } else if ('btn_last' == btnName) {
            if (this.recordPage <= 1) {
                return;
            }
            this.lastRecordPage = this.recordPage;
            this.recordPage--;
            this.GetClubRecord(true);
        } else if ('btn_detail' == btnName) {
            this.FormManager.ShowForm('ui/club/UIClubRecordUser', this.clubId, this.roomIDList, btnNode.playerData, this.isAll, this.getType, this.isShowAllClub, this.unionId);
        } else if ('btn_search' == btnName) {
            this.Click_btn_search();
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
            this.GetClubRecord(true);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();