(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionPLSet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a236aV4NSlLWZwW1TN9pdmG', 'UIUnionPLSet', __filename);
// script/ui/club/UIUnionPLSet.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        this.localData = {};
        this.content = this.node.getChildByName("pointScrollView").getChildByName("view").getChildByName("content");
        this.roomNameEditBox = this.content.getChildByName("line_1").getChildByName("roomNameEditBox").getComponent(cc.EditBox);
        this.PLStartEditBox = this.content.getChildByName("line_2").getChildByName("PLStartEditBox").getComponent(cc.EditBox);
        this.PLDoubleEditBox = this.content.getChildByName("line_2").getChildByName("PLDoubleEditBox").getComponent(cc.EditBox);
        this.toggle1 = this.content.getChildByName("line_4").getChildByName("PLCostToggleContainer").getChildByName("toggle1").getComponent(cc.Toggle);
        this.toggle2 = this.content.getChildByName("line_4").getChildByName("PLCostToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle);
        this.aaPLCostEditBox = this.content.getChildByName("line_4").getChildByName("aaPLCostEditBox").getComponent(cc.EditBox);
        this.AutoDissolveEditBox = this.content.getChildByName("line_3").getChildByName("AutoDissolveEditBox").getComponent(cc.EditBox);
        this.NewDissolveEditBox = this.content.getChildByName("line_3").getChildByName("NewDissolveEditBox").getComponent(cc.EditBox);
        this.PrizePoolEditBox = this.content.getChildByName("line_6").getChildByName("PrizePoolEditBox").getComponent(cc.EditBox);
        this.passwordEditBox = this.content.getChildByName("line_6").getChildByName("line_7").getChildByName("passwordEditBox").getComponent(cc.EditBox);
        this.quJiandemo = this.node.getChildByName("quJiandemo");
        this.lineQuJian = this.content.getChildByName("line_5");
        if (app.Client.GetClientConfigProperty("dianbo")) {
            this.NewDissolveEditBox.node.active = true;
            this.content.getChildByName("line_3").getChildByName("lb_8").active = true;
        } else {
            this.NewDissolveEditBox.node.active = false;
            this.NewDissolveEditBox.string = 0;
            this.content.getChildByName("line_3").getChildByName("lb_8").active = false;
        }
        var contaier = this.content.getChildByName("line_4").getChildByName("PLCostToggleContainer");
        contaier.getComponent(cc.ToggleContainer).enabled = !app.Client.GetClientConfigProperty("TwoMode");
    },

    OnShow: function OnShow(unionData, realGameType, sendPack) {
        this.realGameType = realGameType;
        this.unionData = unionData;
        this.sendPack = sendPack;
        this.sendPack.clubId = this.unionData.clubId;
        this.sendPack.gameIndex = this.unionData.roomKey;
        this.quJiandemo.active = false;
        this.DestroyAllChildren(this.lineQuJian);
        this.node.getChildByName("pointScrollView").getComponent(cc.ScrollView).scrollToTop();
        var gameName = app.ShareDefine().GametTypeID2Name[sendPack.gameType];
        if (this.unionData.cfgData == null) {
            this.roomNameEditBox.string = gameName;
            //优先读取本地保存
            if (this.GetLocalConfig("PLStartEditBox")) {
                this.PLStartEditBox.string = this.GetLocalConfig("PLStartEditBox");
            } else {
                this.PLStartEditBox.string = "0";
            }
            if (this.GetLocalConfig("PLDoubleEditBox")) {
                this.PLDoubleEditBox.string = this.GetLocalConfig("PLDoubleEditBox");
            } else {
                this.PLDoubleEditBox.string = "1";
            }
            if (this.GetLocalConfig("aaPLCostEditBox")) {
                this.aaPLCostEditBox.string = this.GetLocalConfig("aaPLCostEditBox");
            } else {
                this.aaPLCostEditBox.string = "0";
            }
            if (this.GetLocalConfig("AutoDissolveEditBox")) {
                this.AutoDissolveEditBox.string = this.GetLocalConfig("AutoDissolveEditBox");
            } else {
                this.AutoDissolveEditBox.string = "-10000";
            }
            if (this.GetLocalConfig("NewDissolveEditBox")) {
                this.NewDissolveEditBox.string = this.GetLocalConfig("NewDissolveEditBox");
            } else {
                this.NewDissolveEditBox.string = "0";
            }
            if (this.GetLocalConfig("PrizePoolEditBox")) {
                this.PrizePoolEditBox.string = this.GetLocalConfig("PrizePoolEditBox");
            } else {
                this.PrizePoolEditBox.string = "0";
            }

            if (this.GetLocalConfig("passwordEditBox")) {
                if (typeof this.GetLocalConfig("passwordEditBox") != "undefined") {
                    this.passwordEditBox.string = this.GetLocalConfig("passwordEditBox");
                } else {
                    this.passwordEditBox.string = "";
                }
            } else {
                this.passwordEditBox.string = "";
            }
            if (this.GetLocalConfig("PLCostType")) {
                if (parseInt(this.GetLocalConfig("PLCostType")) == 0) {
                    this.toggle1.isChecked = true;
                    if (this.GetLocalConfig("twoMode")) {
                        this.toggle2.isChecked = true;
                    }
                } else {
                    this.toggle2.isChecked = false;
                }
            } else {
                this.toggle1.isChecked = true;
            }
        } else {
            var bRoomConfigure = this.unionData.cfgData.bRoomConfigure;
            this.roomNameEditBox.string = bRoomConfigure.roomName.toString();
            this.PLStartEditBox.string = bRoomConfigure.roomSportsThreshold.toString();
            this.PLDoubleEditBox.string = bRoomConfigure.sportsDouble.toString();
            this.aaPLCostEditBox.string = bRoomConfigure.roomSportsEveryoneConsume.toString();
            this.AutoDissolveEditBox.string = bRoomConfigure.autoDismiss.toString();
            this.NewDissolveEditBox.string = bRoomConfigure.dianbo.toString();
            if (typeof bRoomConfigure.prizePool == "undefined") {
                bRoomConfigure.prizePool = 0;
            }
            this.PrizePoolEditBox.string = bRoomConfigure.prizePool.toString();
            if (typeof bRoomConfigure.password != "undefined") {
                this.passwordEditBox.string = bRoomConfigure.password;
            } else {
                this.passwordEditBox.string = "";
            }

            if (parseInt(bRoomConfigure.roomSportsType) == 0) {
                this.toggle1.isChecked = true;
                if (bRoomConfigure.twoMode) {
                    this.toggle2.isChecked = true;
                }
                var bigWinnerConsumeList = bRoomConfigure.bigWinnerConsumeList;
                if (typeof bigWinnerConsumeList != "undefined") {
                    for (var i = 0; i < bigWinnerConsumeList.length; i++) {
                        var child = cc.instantiate(this.quJiandemo);
                        child.name = "qujian_" + i;
                        child.getChildByName("winScoreEditBox").getComponent(cc.EditBox).string = bigWinnerConsumeList[i].winScore;
                        child.getChildByName("costEditBox").getComponent(cc.EditBox).string = bigWinnerConsumeList[i].sportsPoint;
                        var sportsPointCost = 0;
                        if (typeof bigWinnerConsumeList[i].sportsPointCost != "undefined") {
                            sportsPointCost = bigWinnerConsumeList[i].sportsPointCost;
                        }
                        child.getChildByName("PrizePoolEditBox").getComponent(cc.EditBox).string = sportsPointCost;
                        child.active = true;
                        this.lineQuJian.addChild(child);
                    }
                }
            } else {
                this.toggle2.isChecked = true;
            }
        }
    },
    GetSelectCfg: function GetSelectCfg() {
        this.localData = {};
        this.sendPack.unionId = this.unionData.unionId;
        this.sendPack.roomName = this.roomNameEditBox.string;
        if (!isNaN(parseFloat(this.PLStartEditBox.string)) && app.ComTool().StrIsNum(this.PLStartEditBox.string) && parseFloat(this.PLStartEditBox.string) >= -10000) {
            this.sendPack.roomSportsThreshold = this.PLStartEditBox.string;
            this.localData.PLStartEditBox = this.PLStartEditBox.string;
        } else {
            app.SysNotifyManager().ShowSysMsg("比赛分门槛请输入大于等于-10000的数字", [], 3);
            return null;
        }
        if (!isNaN(parseFloat(this.PLDoubleEditBox.string)) && app.ComTool().StrIsNum(this.PLDoubleEditBox.string) && parseFloat(this.PLDoubleEditBox.string) >= 0) {
            this.sendPack.sportsDouble = this.PLDoubleEditBox.string;
            this.localData.PLDoubleEditBox = this.PLDoubleEditBox.string;
        } else {
            app.SysNotifyManager().ShowSysMsg("比赛分倍数请输入大于等于0的数字", [], 3);
            return null;
        }
        if (!isNaN(parseFloat(this.aaPLCostEditBox.string)) && app.ComTool().StrIsNum(this.aaPLCostEditBox.string) && parseFloat(this.aaPLCostEditBox.string) >= 0) {
            this.sendPack.roomSportsEveryoneConsume = this.aaPLCostEditBox.string;
            this.localData.aaPLCostEditBox = this.aaPLCostEditBox.string;
        } else {
            app.SysNotifyManager().ShowSysMsg("每人消耗请输入大于等于0的数字", [], 3);
            return null;
        }
        if (!isNaN(parseFloat(this.AutoDissolveEditBox.string)) && app.ComTool().StrIsNum(this.AutoDissolveEditBox.string) && parseFloat(this.AutoDissolveEditBox.string) >= -10000) {
            this.sendPack.autoDismiss = this.AutoDissolveEditBox.string;
            this.localData.AutoDissolveEditBox = this.AutoDissolveEditBox.string;
        } else {
            app.SysNotifyManager().ShowSysMsg("自动解散请输入大于等于-10000的数字", [], 3);
            return null;
        }
        if (!isNaN(parseFloat(this.NewDissolveEditBox.string)) && app.ComTool().StrIsNum(this.NewDissolveEditBox.string) && parseFloat(this.NewDissolveEditBox.string) >= 0) {
            this.sendPack.dianbo = this.NewDissolveEditBox.string;
            this.localData.NewDissolveEditBox = this.NewDissolveEditBox.string;
        } else {
            this.sendPack.dianbo = 0;
        }
        if (!isNaN(parseFloat(this.PrizePoolEditBox.string)) && app.ComTool().StrIsNum(this.PrizePoolEditBox.string) && parseFloat(this.PrizePoolEditBox.string) >= 0) {
            this.sendPack.prizePool = this.PrizePoolEditBox.string;
            this.localData.PrizePoolEditBox = this.PrizePoolEditBox.string;
        } else {
            app.SysNotifyManager().ShowSysMsg("赛事成本请输入大于等于0的数字", [], 3);
            return null;
        }
        //this.passwordEditBox.string = bRoomConfigure.password;

        if (this.passwordEditBox.string > 0) {
            if (this.passwordEditBox.string.toString().length < 6) {
                app.SysNotifyManager().ShowSysMsg("请输入6位数字密码", [], 3);
                return null;
            }
            if (!app.ComTool().StrIsNum(this.passwordEditBox.string)) {
                app.SysNotifyManager().ShowSysMsg("请输入6位数字密码", [], 3);
                return null;
            }

            this.sendPack.password = this.passwordEditBox.string;
            this.localData.passwordEditBox = this.passwordEditBox.string;
        } else {
            this.sendPack.password = "";
            this.localData.passwordEditBox = "";
        }
        if (this.toggle1.isChecked) {
            this.sendPack.roomSportsType = 0;
            this.localData.PLCostType = 0;
            if (this.toggle2.isChecked) {
                this.localData.twoMode = true;
                this.sendPack.twoMode = true;
            }
            //获取区间
            var bigWinnerConsumeList = [];
            for (var i = 0; i < this.lineQuJian.children.length; i++) {
                var dataTemp = {};
                var childTemp = this.lineQuJian.children[i];
                var winScoreEditBoxTemp = childTemp.getChildByName("winScoreEditBox").getComponent(cc.EditBox);
                if (!app.ComTool().StrIsNum(winScoreEditBoxTemp.string)) {
                    app.SysNotifyManager().ShowSysMsg("请输入纯数字比赛分", [], 3);
                    return null;
                }
                var costEditBoxTemp = childTemp.getChildByName("costEditBox").getComponent(cc.EditBox);
                if (!app.ComTool().StrIsNum(costEditBoxTemp.string)) {
                    app.SysNotifyManager().ShowSysMsg("请输入纯数字比赛分", [], 3);
                    return null;
                }
                var prizePoolEditBoxTemp = childTemp.getChildByName("PrizePoolEditBox").getComponent(cc.EditBox);
                if (!app.ComTool().StrIsNum(prizePoolEditBoxTemp.string) && parseFloat(this.prizePoolEditBoxTemp.string) >= 0) {
                    app.SysNotifyManager().ShowSysMsg("赛事成本请输入大于等于0的数字", [], 3);
                    return null;
                }
                dataTemp.winScore = parseFloat(winScoreEditBoxTemp.string);
                dataTemp.sportsPoint = parseFloat(costEditBoxTemp.string);
                dataTemp.sportsPointCost = parseFloat(prizePoolEditBoxTemp.string);
                bigWinnerConsumeList.push(dataTemp);
            }
            if (bigWinnerConsumeList.length == 0) {
                app.SysNotifyManager().ShowSysMsg("请至少添加一个区间", [], 3);
                return null;
            }
            this.sendPack.bigWinnerConsumeList = bigWinnerConsumeList;
            this.localData.bigWinnerConsumeList = bigWinnerConsumeList;
        } else if (this.toggle2.isChecked) {
            this.sendPack.roomSportsType = 1;
            this.localData.PLCostType = 1;
        } else {
            app.SysNotifyManager().ShowSysMsg("至少选择一种模式", [], 3);
            return;
        }
        return this.sendPack;
    },
    //获取创建缓存
    GetLocalConfig: function GetLocalConfig(configName) {
        var roomKey = this.unionData.roomKey;
        return cc.sys.localStorage.getItem(this.realGameType + '_' + roomKey + '_' + configName);
    },
    SetLocalConfig: function SetLocalConfig(configName, configInfo) {
        var roomKey = this.unionData.roomKey;
        cc.sys.localStorage.setItem(this.realGameType + '_' + roomKey + '_' + configName, configInfo);
    },
    StartSetLocalCfg: function StartSetLocalCfg() {
        //记录到本地缓存
        for (var item in this.localData) {
            var configData = this.localData[item];
            var dataType = typeof configData === "undefined" ? "undefined" : _typeof(configData);
            this.SetLocalConfig(item, configData);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_last") {
            this.CloseForm();
        } else if (btnName == "btn_save") {
            if (this.GetSelectCfg() != null) {
                var self = this;
                app.NetManager().SendPack("union.CUnionCreateRoom", this.sendPack, function (serverPack) {
                    if (self.sendPack.gameIndex > 0) {
                        app.SysNotifyManager().ShowSysMsg("修改房间成功", [], 3);
                    } else {
                        app.SysNotifyManager().ShowSysMsg("创建房间成功", [], 3);
                    }
                    self.StartSetLocalCfg();
                    self.CloseForm();
                    app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("UICreatRoom");
                    app.FormManager().CloseForm("UITop");
                    app.FormManager().CloseForm("UICreatRoom");
                }, function () {
                    app.SysNotifyManager().ShowSysMsg("创建房间失败", [], 3);
                });
            }
        } else if (btnName == "btn_addQuJian") {
            var child = cc.instantiate(this.quJiandemo);
            var childCount = this.lineQuJian.children.length;
            if (childCount >= 10) {
                app.SysNotifyManager().ShowSysMsg("最多只能创建10个区间", [], 3);
                return;
            }
            for (var i = 0; i < this.lineQuJian.children.length; i++) {
                this.lineQuJian.children[i].name = "qujian_" + i;
            }
            child.name = "qujian_" + childCount;
            if (childCount == 0) {
                child.getChildByName("winScoreEditBox").getComponent(cc.EditBox).string = "0";
            } else {
                var lastEndScore = this.lineQuJian.getChildByName("qujian_" + (childCount - 1)).getChildByName("winScoreEditBox");
                child.getChildByName("winScoreEditBox").getComponent(cc.EditBox).string = lastEndScore.getComponent(cc.EditBox).string;
            }
            child.getChildByName("costEditBox").getComponent(cc.EditBox).string = "0";
            child.getChildByName("PrizePoolEditBox").getComponent(cc.EditBox).string = "0";
            child.active = true;
            this.lineQuJian.addChild(child);
            this.node.getChildByName("pointScrollView").getComponent(cc.ScrollView).scrollToBottom();
        } else if (btnName == "btn_delQuJian") {
            btnNode.parent.removeFromParent();
            btnNode.parent.destroy();
            for (var _i = 0; _i < this.lineQuJian.children.length; _i++) {
                this.lineQuJian.children[_i].name = "qujian_" + _i;
            }
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    OnEditingDidEnd: function OnEditingDidEnd(event) {
        var clickNode = event.node.parent;
        var clickIndex = parseInt(clickNode.name.substring(7));
        var lastEndScore = null;
        if (clickIndex > 0) {
            lastEndScore = this.lineQuJian.getChildByName("qujian_" + (clickIndex - 1)).getChildByName("winScoreEditBox").getComponent(cc.EditBox);
        }
        if (!app.ComTool().StrIsNum(event.string)) {
            app.SysNotifyManager().ShowSysMsg("请输入纯数字比赛分", [], 3);
            if (clickIndex == 0) {
                event.node.getComponent(cc.EditBox).string = "0";
            } else {
                event.node.getComponent(cc.EditBox).string = lastEndScore.string;
            }
            return;
        }
        //如果不是第一个区间,需要判断是否比上一个区间大
        if (clickIndex > 0) {
            if (parseFloat(event.string) < parseFloat(lastEndScore.string)) {
                app.SysNotifyManager().ShowSysMsg("请输入比上一个区间大的比赛分", [], 3);
                if (clickIndex == 0) {
                    event.node.getComponent(cc.EditBox).string = "0";
                } else {
                    event.node.getComponent(cc.EditBox).string = lastEndScore.string;
                }
                return;
            }
        }
        var childCount = this.lineQuJian.children.length;
        for (var i = childCount - 1; i >= clickIndex; i--) {
            var childTemp = this.lineQuJian.children[i];
            var winScoreEditBoxTemp = childTemp.getChildByName("winScoreEditBox").getComponent(cc.EditBox);
            if (parseInt(winScoreEditBoxTemp.string) < parseInt(event.string)) {
                childTemp.removeFromParent();
                childTemp.destroy();
            }
        }
        for (var _i2 = 0; _i2 < this.lineQuJian.children.length; _i2++) {
            this.lineQuJian.children[_i2].name = "qujian_" + _i2;
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
        //# sourceMappingURL=UIUnionPLSet.js.map
        