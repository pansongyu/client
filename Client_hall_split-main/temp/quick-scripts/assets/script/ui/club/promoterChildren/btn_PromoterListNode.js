(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/promoterChildren/btn_PromoterListNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96c38Eh+DRKh49zwdyS5eks', 'btn_PromoterListNode', __filename);
// script/ui/club/promoterChildren/btn_PromoterListNode.js

"use strict";

var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        unSelectSprite: cc.SpriteFrame,
        selectSprite: cc.SpriteFrame
    },
    onLoad: function onLoad() {
        var memberScrollView = this.node.getChildByName("memberScrollView").getComponent(cc.ScrollView);
        memberScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
    },
    InitData: function InitData(clubId, unionId, unionPostType, myisminister, myisPartner) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.myisPartner = myisPartner;
        this.curPage = 1;
        this.GetClubPromoter(true);
    },
    GetClubPromoter: function GetClubPromoter(isRefresh) {
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pageNum = this.curPage;
        var self = this;
        app.NetManager().SendPack("club.CClubPromotionList", sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取成员列表失败", [], 3);
        });
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetClubPromoter(false);
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var memberScrollView = this.node.getChildByName("memberScrollView");
        var content = memberScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            memberScrollView.getComponent(cc.ScrollView).scrollToTop();
            content.removeAllChildren();
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            //先判断下是否已经存在,对于有可能从前面插入数据的需要差重
            var isExist = false;
            for (var j = 0; j < content.children.length; j++) {
                if (content.children[j].pid == serverPack[i].pid) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) continue;
            var child = cc.instantiate(demo);
            child.pid = serverPack[i].pid;
            child.playerData = serverPack[i];
            if (serverPack[i].iconUrl) {
                app.WeChatManager().InitHeroHeadImage(serverPack[i].pid, serverPack[i].iconUrl);
                var WeChatHeadImage = child.getChildByName('img_head').getComponent("WeChatHeadImage");
                WeChatHeadImage.ShowHeroHead(serverPack[i].pid, serverPack[i].iconUrl);
            }
            var nameTemp = serverPack[i].name;
            if (nameTemp.length >= 6) {
                nameTemp = serverPack[i].name.substr(0, 6) + "...";
            }
            child.getChildByName("lb_userName").getComponent(cc.Label).string = nameTemp;
            child.getChildByName("lb_userId").getComponent(cc.Label).string = serverPack[i].pid;
            child.getChildByName("lb_playerNum").getComponent(cc.Label).string = serverPack[i].number;
            child.getChildByName("lb_active").getComponent(cc.Label).string = serverPack[i].calcActiveValue;
            child.getChildByName("lb_activeNum").getComponent(cc.Label).string = serverPack[i].curActiveValue;
            if (serverPack[i].promotion == 1) {
                child.getChildByName("controlNode").getChildByName("btn_xieren").active = true;
                child.getChildByName("controlNode").getChildByName("btn_shangren").active = false;
            } else if (serverPack[i].promotion == 2) {
                child.getChildByName("controlNode").getChildByName("btn_xieren").active = false;
                child.getChildByName("controlNode").getChildByName("btn_shangren").active = true;
            } else {
                child.getChildByName("controlNode").getChildByName("btn_xieren").active = false;
                child.getChildByName("controlNode").getChildByName("btn_shangren").active = false;
            }
            child.active = true;
            content.addChild(child);
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
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_addPromoter' == btnName) {
            app.FormManager().ShowForm("ui/club/UIClubPromoterAdd", this.clubId);
        } else if (btnName == "btn_ShowBtn" || btnName == "btn_control") {
            var selfHeroID = app.HeroManager().GetHeroProperty("pid");
            //自己不能操作自己
            if (btnNode.parent.pid == selfHeroID) {
                return;
            }
            var allUserNode = btnNode.parent.parent.children;
            var controlNode = btnNode.parent.getChildByName("controlNode");
            for (var i = 0; i < allUserNode.length; i++) {
                var userControlNode = allUserNode[i].getChildByName("controlNode");
                if (userControlNode && controlNode != userControlNode) {
                    userControlNode.active = false;
                    userControlNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                    userControlNode.parent.height = 80;
                }
            }
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.selectSprite;
                btnNode.parent.height = 190;
            } else {
                btnNode.parent.getComponent(cc.Sprite).spriteFrame = this.unSelectSprite;
                btnNode.parent.height = 80;
            }
        } else if ('btn_xieren' == btnName) {
            var sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.pid = btnNode.parent.parent.pid;
            var self = this;
            app.NetManager().SendPack("club.CClubPromotionAppointOrLeaveOffice", sendPack, function (serverPack) {
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_shangren").active = true;
                app.SysNotifyManager().ShowSysMsg("卸任成功", [], 3);
            }, function () {});
        } else if ('btn_shangren' == btnName) {
            var _sendPack = {};
            _sendPack.clubId = this.clubId;
            _sendPack.pid = btnNode.parent.parent.pid;
            var _self = this;
            app.NetManager().SendPack("club.CClubPromotionAppointOrLeaveOffice", _sendPack, function (serverPack) {
                btnNode.active = false;
                btnNode.parent.getChildByName("btn_xieren").active = true;
                app.SysNotifyManager().ShowSysMsg("上任成功", [], 3);
            }, function () {});
        } else if ('btn_xiashu' == btnName) {
            app.FormManager().ShowForm("ui/club/UIPromoterXiaShuList", this.clubId, btnNode.parent.parent.playerData.pid, this.myisminister, this.myisPartner);
        } else if ('btn_jisuan' == btnName) {
            app.FormManager().ShowForm("ui/club/UIPromoterSetActive", btnNode.parent.parent.playerData, this.clubId);
        } else if ('btn_yichang' == btnName) {
            app.FormManager().ShowForm("ui/club/UIPromoterSetActiveNum", btnNode.parent.parent.playerData, this.clubId);
        } else if ('btn_mingxi' == btnName) {
            app.FormManager().ShowForm("ui/club/UIPromoterMsg", this.clubId, this.unionId, this.unionPostType, this.myisminister, this.myisPartner, btnNode.parent.parent.pid);
        } else if ('btn_baobiao' == btnName) {
            app.FormManager().ShowForm("ui/club/UIPromoterSetActiveReport", this.clubId, btnNode.parent.parent.playerData.pid);
        } else if ('btn_delPromoter' == btnName) {
            this.SetWaitForConfirm('MSG_DEL_PROMOTER', app.ShareDefine().Confirm, [], [this.clubId, btnNode.parent.parent.pid], "删除推广员后，该玩家将被踢出亲友圈");
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArgs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArgs);
        ConfirmManager.ShowConfirm(type, msgID, msgArgs, content);
    },
    OnConFirm: function OnConFirm(clickType, msgID, cbArgs) {
        if ('Sure' != clickType) {
            return;
        }
        if ('MSG_DEL_PROMOTER' == msgID) {
            var clubId = cbArgs[0];
            var pid = cbArgs[1];
            var sendPack = {};
            sendPack.clubId = clubId;
            sendPack.pid = pid;
            var self = this;
            app.NetManager().SendPack("club.CClubPromotionDelete", sendPack, function (serverPack) {
                self.curPage = 1;
                self.GetClubPromoter(true);
                app.SysNotifyManager().ShowSysMsg("成功移除", [], 3);
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
        //# sourceMappingURL=btn_PromoterListNode.js.map
        