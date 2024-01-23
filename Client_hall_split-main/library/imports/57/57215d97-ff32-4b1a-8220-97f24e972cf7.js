"use strict";
cc._RF.push(module, '572152X/zJLGoIgl/JOlyz3', 'btn_SetSkinTypeNode');
// script/ui/club/unionChildren/btn_SetSkinTypeNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {},
    onLoad: function onLoad() {},
    InitData: function InitData(clubId, unionId) {
        var sendPack = {};
        sendPack.clubId = clubId;
        var self = this;
        this.curSkinType = -1;
        app.NetManager().SendPack("union.CUnionGetSkinInfo", sendPack, function (serverPack) {
            self.ShowSkinInfoByType(serverPack.skinType);
            self.SetUpLevelAndQuan(serverPack);
        }, function () {});
    },
    SetUpLevelAndQuan: function SetUpLevelAndQuan(info) {
        this.node.getChildByName("skinScrollView").getChildByName("toggle_shangji").getComponent(cc.Toggle).isChecked = info.showUplevelId == 1;
        this.node.getChildByName("skinScrollView").getChildByName("toggle_benquan").getComponent(cc.Toggle).isChecked = info.showClubSign == 1;
    },
    ShowSkinInfoByType: function ShowSkinInfoByType(skinType) {
        this.curSkinType = skinType;

        var content = this.node.getChildByName("skinScrollView").getChildByName("view").getChildByName("content");
        for (var i = 0; i < content.children.length; i++) {
            if (content.children[i].name.startsWith("btn_skin_")) {
                if (skinType == parseInt(content.children[i].name.replace('btn_skin_', ''))) {
                    content.children[i].getChildByName("imgSelect").active = true;
                } else {
                    content.children[i].getChildByName("imgSelect").active = false;
                }
            }
        }
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
    SetShangJiAndQuan: function SetShangJiAndQuan() {
        var shangji = this.node.getChildByName("skinScrollView").getChildByName("toggle_shangji").getComponent(cc.Toggle).isChecked;
        var benquan = this.node.getChildByName("skinScrollView").getChildByName("toggle_benquan").getComponent(cc.Toggle).isChecked;
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        if (shangji == true) {
            sendPack.showUplevelId = 1;
        } else {
            sendPack.showUplevelId = 0;
        }
        if (benquan == true) {
            sendPack.showClubSign = 1;
        } else {
            sendPack.showClubSign = 0;
        }
        var self = this;
        app.NetManager().SendPack("union.CUnionChangeSkinShowInfo", sendPack, function (event) {
            app.ClubManager().SetCurClubShowUplevelId(sendPack.showUplevelId);
            app.ClubManager().SetCurClubShowClubSign(sendPack.showClubSign);
        }, function (error) {});
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName.startsWith("btn_skin_")) {
            if (this.curSkinType == -1) {
                return;
            }
            var skinType = parseInt(btnName.replace('btn_skin_', ''));
            if (this.curSkinType != skinType) {
                this.SetWaitForConfirm('MSG_SETSKINTYPE', app.ShareDefine().Confirm, [], [skinType], "是否切换赛事皮肤");
            }
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_SETSKINTYPE' == msgID) {
            var skinType = backArgList[0];
            var sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.skinType = skinType;
            var self = this;
            app.NetManager().SendPack("union.CUnionChangeSkin", sendPack, function (serverPack) {
                self.ShowSkinInfoByType(serverPack.skinType);
            }, function () {});
        }
    }
});

cc._RF.pop();