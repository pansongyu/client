"use strict";
cc._RF.push(module, '1c82crwzfNGTruDm1H5/Cgq', 'zhanduiDetailNode');
// script/ui/club_2/unionChild_2/zhanduiDetailNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        zhanduiNode: cc.Node
    },
    onLoad: function onLoad() {
        var rankScrollView = this.node.getChildByName("rankScrollView").getComponent(cc.ScrollView);
        rankScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
        app.Client.RegEvent("UpdateZhanDuiDetailNodeData", this.Event_UpdateZhanDuiDetailNodeData, this);
    },
    InitData: function InitData(clubId, unionId, pid, level, levelPromotion, unionPostType) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.pid = pid;
        this.level = level;
        this.levelPromotion = levelPromotion;
        this.unionPostType = unionPostType;
        this.curPage = 1;
        this.curType = 0;
        var sendPack = {};
        var sendPackName = "club.CClubGetCompetitionTime";
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            self.competitionTimeList = serverPack;
            self.curType = self.competitionTimeList[0].type;
            self.UpdateStatusAndTime(self.competitionTimeList[0]);
            self.GetClubTeamListZhongZhi(true);
        }, function () {});
        this.ShowLevelLabel();
        if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion > 0) {
            //普通成员
            //隐藏部分按钮
            this.node.getChildByName("img_xiadi").getChildByName("btn_changePromotion").active = false;
            this.node.getChildByName("img_xiadi").getChildByName("btn_dissolvezhandui").active = false;
        } else {
            this.node.getChildByName("img_xiadi").getChildByName("btn_changePromotion").active = true;
            this.node.getChildByName("img_xiadi").getChildByName("btn_dissolvezhandui").active = true;
        }
        this.node.getChildByName("img_sjdi").active = false;
    },
    Event_UpdateZhanDuiDetailNodeData: function Event_UpdateZhanDuiDetailNodeData(event) {
        this.curPage = 1;
        this.GetClubTeamListZhongZhi(true);
    },
    ShowLevelLabel: function ShowLevelLabel() {
        var levelStrList = ["战队一级", "战队二级", "战队三级", "战队四级", "战队五级", "战队六级", "战队七级", "战队八级", "战队九级", "战队十级"];
        var levelLabel = this.node.getChildByName("img_xiadi").getChildByName("btn_setLevel").getChildByName("lb_btnName");
        levelLabel.getComponent(cc.Label).string = levelStrList[this.level - 1];

        var img_zddi = this.node.getChildByName("selectzd").getChildByName("img_zddi");
        img_zddi.getChildByName("btn_zd_" + this.level).getComponent(cc.Toggle).isChecked = true;
    },
    GetClubTeamListZhongZhi: function GetClubTeamListZhongZhi(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.type = this.curType;
        sendPack.pageNum = this.curPage;
        sendPack.pid = this.pid;
        var sendPackName = "Club.CClubTeamListZhongZhi";
        var self = this;
        app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {});
    },
    UpdateStatusAndTime: function UpdateStatusAndTime(competitionTime) {
        if (competitionTime.status == 0) {
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").getComponent(cc.Label).string = "已结束";
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").color = new cc.Color(226, 28, 61);
        } else {
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").getComponent(cc.Label).string = "进行中";
            this.node.getChildByName("img_rqdi").getChildByName("lb_statue").color = new cc.Color(11, 230, 42);
        }
        this.node.getChildByName("img_rqdi").getChildByName("lb_time").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayString(competitionTime.beginTime);
        this.node.getChildByName("img_sjdi").removeAllChildren();
        for (var i = 0; i < this.competitionTimeList.length; i++) {
            var tempNode = this.node.getChildByName("btn_timeDemo");
            var child = cc.instantiate(tempNode);
            child.getChildByName("lb_btnTime").getComponent(cc.Label).string = app.ComTool().GetDateYearMonthDayString(this.competitionTimeList[i].beginTime);
            child.competitionTime = this.competitionTimeList[i];
            if (this.curType == this.competitionTimeList[i].type) {
                child.getChildByName("img_sjxz").active = true;
            } else {
                child.getChildByName("img_sjxz").active = false;
            }
            child.active = true;
            this.node.getChildByName("img_sjdi").addChild(child);
        }
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetClubTeamListZhongZhi(false);
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var rankScrollView = this.node.getChildByName("rankScrollView");
        var content = rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.clubTeamListInfoList.length; i++) {
            var matchItem = serverPack.clubTeamListInfoList[i];
            var child = cc.instantiate(demo);
            if (i % 2 == 0) {
                child.getComponent(cc.Sprite).enabled = true;
            } else {
                child.getComponent(cc.Sprite).enabled = false;
            }
            child.playerData = {};
            child.playerData.pid = matchItem.pid;
            child.playerData.name = matchItem.name;
            child.getChildByName("lb_name").getComponent(cc.Label).string = matchItem.name;
            child.getChildByName("lb_id").getComponent(cc.Label).string = matchItem.pid;
            child.getChildByName("lb_level").getComponent(cc.Label).string = this.ShowPositionLabel(matchItem.position);
            child.getChildByName("lb_scorePoint").getComponent(cc.Label).string = matchItem.scorePoint;
            child.getChildByName("lb_sportsPointConsume").getComponent(cc.Label).string = matchItem.sportsPointConsume;
            child.getChildByName("lb_eliminatePoint").getComponent(cc.Label).string = matchItem.eliminatePoint;
            child.getChildByName("lb_consume").getComponent(cc.Label).string = matchItem.consume;
            if (matchItem.position == 2) {
                //推广员不显示调出按钮
                child.getChildByName("btn_outPromoter").active = false;
            } else {
                child.getChildByName("btn_outPromoter").active = true;
            }
            child.active = true;
            content.addChild(child);
        }
    },

    ShowPositionLabel: function ShowPositionLabel(position) {
        var positionStrList = ["普通成员", "推广员管理员", "推广员", "圈主"];
        return positionStrList[position];
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
        if ("btn_timeDemo" == btnName) {
            this.curType = btnNode.competitionTime.type;
            this.curPage = 1;
            this.GetClubTeamListZhongZhi(true);
            this.UpdateStatusAndTime(btnNode.competitionTime);
            this.node.getChildByName("img_sjdi").active = false;
        } else if ('img_rqdi' == btnName) {
            this.node.getChildByName("img_sjdi").active = !this.node.getChildByName("img_sjdi").active;
        } else if ('btn_huizong' == btnName) {
            app.FormManager().ShowForm('ui/club_2/UIPromoterAllReport_2', this.clubId, this.pid);
        } else if ('btn_changePromotion' == btnName) {
            app.FormManager().ShowForm('ui/club_2/UIClubChangePromotion_2', this.clubId, this.pid);
        } else if ('btn_setLevel' == btnName) {
            this.node.getChildByName("selectzd").active = true;
        } else if ('btn_dissolvezhandui' == btnName) {
            this.SetWaitForConfirm('CANCELPROMOTER', app.ShareDefine().Confirm, [], [], "取消后该推广员下的所有玩家归属将发生变化，请确认取消");
        } else if ('btn_detail' == btnName) {} else if ('btn_outPromoter' == btnName) {
            app.FormManager().ShowForm('ui/club_2/UIPromoterSet_2', this.clubId, btnNode.parent.playerData.pid, btnNode.parent.playerData);
        } else if ('selectzd' == btnName) {
            var newLevel = this.GetSelectZhanDuiLevel();
            if (newLevel != this.level) {
                var sendPack = {};
                sendPack.clubId = this.clubId;
                sendPack.pid = this.pid;
                sendPack.value = newLevel;
                var sendPackName = "Club.CClubChangeLevelZhongZhi";
                var self = this;
                app.NetManager().SendPack(sendPackName, sendPack, function (serverPack) {
                    self.level = newLevel;
                    self.ShowLevelLabel();
                    self.zhanduiNode.getComponent("zhanduiNode").GetClubTeamListZhongZhi(true);
                }, function () {});
            }
            btnNode.active = false;
        }
    },

    GetSelectZhanDuiLevel: function GetSelectZhanDuiLevel() {
        var levelTemp = 0;
        var img_zddi = this.node.getChildByName("selectzd").getChildByName("img_zddi");
        for (var i = 0; i < img_zddi.children.length; i++) {
            var toggle = img_zddi.children[i].getComponent(cc.Toggle);
            if (toggle.isChecked) {
                levelTemp = parseInt(img_zddi.children[i].name.replace("btn_zd_", ''));
                break;
            }
        }
        return levelTemp;
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
            sendPack.pid = this.pid;
            app.NetManager().SendPack("club.CClubCancleCaptionOpZhongZhi", sendPack, function (serverPack) {
                self.node.active = false;
            }, function () {});
        }
    }
});

cc._RF.pop();