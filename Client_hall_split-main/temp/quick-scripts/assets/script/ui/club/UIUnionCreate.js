(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUnionCreate.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5dbc1UueRFA1KA7oxvocdMo', 'UIUnionCreate', __filename);
// script/ui/club/UIUnionCreate.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {},

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.unionNameEditBox = this.node.getChildByName("unionNameEditBox").getComponent(cc.EditBox);
        this.sportsPointEditBox = this.node.getChildByName("sportsPointEditBox").getComponent(cc.EditBox);
        this.outSportsEditBox = this.node.getChildByName("outSportsEditBox").getComponent(cc.EditBox);
        this.prizeRankEditBox = this.node.getChildByName("prizeRankEditBox").getComponent(cc.EditBox);
        this.prizeValueEditBox = this.node.getChildByName("prizeValueEditBox").getComponent(cc.EditBox);

        this.joinToggleContainer = this.node.getChildByName("joinToggleContainer");
        this.quitToggleContainer = this.node.getChildByName("quitToggleContainer");
        this.matchRateToggleContainer = this.node.getChildByName("matchRateToggleContainer");
        this.prizeToggleContainer = this.node.getChildByName("prizeToggleContainer");
    },
    //---------显示函数--------------------

    OnShow: function OnShow(clubId) {
        this.clubId = clubId;
        this.sportsPointEditBox.string = "2000";
        this.outSportsEditBox.string = "0";
        this.prizeRankEditBox.string = "0";
        this.prizeValueEditBox.string = "0";

        this.joinToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        this.quitToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        this.matchRateToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        this.prizeToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_create' == btnName) {
            if (this.unionNameEditBox.string == "") {
                app.SysNotifyManager().ShowSysMsg("赛事名称不能为空", [], 3);
                return;
            }
            if (this.unionNameEditBox.string.length > 16) {
                app.SysNotifyManager().ShowSysMsg("赛事名称不能超过16个字符", [], 3);
                return;
            }
            if (app.UtilsWord().CheckContentDirtyEx(this.unionNameEditBox.string)) {
                app.SysNotifyManager().ShowSysMsg("赛事名称包含敏感词汇", [], 3);
                return;
            }
            if (!app.ComTool().StrIsNum(this.sportsPointEditBox.string) || isNaN(parseFloat(this.sportsPointEditBox.string)) || parseFloat(this.sportsPointEditBox.string) < 0) {
                app.SysNotifyManager().ShowSysMsg("裁判力度必须是大于0的纯数字", [], 3);
                return;
            }
            if (!app.ComTool().StrIsNum(this.outSportsEditBox.string) || isNaN(parseFloat(this.outSportsEditBox.string))) {
                app.SysNotifyManager().ShowSysMsg("赛事淘汰必须是纯数字", [], 3);
                return;
            }
            if (parseFloat(this.outSportsEditBox.string) > parseFloat(this.sportsPointEditBox.string)) {
                app.SysNotifyManager().ShowSysMsg("赛事淘汰不能大于裁判力度", [], 3);
                return;
            }
            if (isNaN(parseInt(this.prizeRankEditBox.string)) || parseInt(this.prizeRankEditBox.string) < 0 || parseInt(this.prizeRankEditBox.string) > 50) {
                app.SysNotifyManager().ShowSysMsg("奖励排名必须是大于0小于50的纯数字", [], 3);
                return;
            }
            if (isNaN(parseInt(this.prizeValueEditBox.string)) || parseInt(this.prizeValueEditBox.string) < 0) {
                app.SysNotifyManager().ShowSysMsg("奖励数量必须是大于0的纯数字", [], 3);
                return;
            }
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.unionName = this.unionNameEditBox.string;
            if (this.joinToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.join = 0;
            } else {
                sendPack.join = 1;
            }
            if (this.quitToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.quit = 0;
            } else {
                sendPack.quit = 1;
            }
            sendPack.initSports = parseFloat(this.sportsPointEditBox.string);
            if (this.matchRateToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.matchRate = 0;
            } else if (this.matchRateToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked) {
                sendPack.matchRate = 1;
            } else {
                sendPack.matchRate = 2;
            }
            sendPack.outSports = parseFloat(this.outSportsEditBox.string);
            if (this.prizeToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked) {
                sendPack.prizeType = 2;
            } else {
                sendPack.prizeType = 1;
            }
            sendPack.ranking = parseInt(this.prizeRankEditBox.string);
            sendPack.value = parseInt(this.prizeValueEditBox.string);
            var self = this;
            app.NetManager().SendPack("union.CUnionCreate", sendPack, function (serverPack) {
                self.CloseForm();
                app.FormManager().CloseForm("ui/club/UIUnionNone");
                // app.FormManager().CloseForm("ui/club/UIClubMain");
                app.ClubManager().CloseClubFrom();
            }, function () {});
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
        //# sourceMappingURL=UIUnionCreate.js.map
        