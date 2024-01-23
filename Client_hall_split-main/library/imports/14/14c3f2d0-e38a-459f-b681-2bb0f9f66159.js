"use strict";
cc._RF.push(module, '14c3fLQ44pFn7aBK7D59mFZ', 'UIUnionClubUserList_2');
// script/ui/club_2/UIUnionClubUserList_2.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("UIUnionClubUserList"),

    properties: {},
    ShowMemberList: function ShowMemberList(playerlist, isRefresh) {
        if (isRefresh) {
            //this.memberlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.memberlist_layout);
            this.memberlist_scrollView.scrollToTop();
        }
        for (var i = 0; i < playerlist.length; i++) {
            var heroID = playerlist[i].shortPlayer.pid;
            var shortHeroID = this.ComTool.GetPid(heroID);
            var nodePrefab = cc.instantiate(this.memberlist_demo);
            nodePrefab.name = heroID.toString();
            nodePrefab.minister = playerlist[i].minister;
            nodePrefab.playerData = playerlist[i];
            var headImageUrl = playerlist[i].shortPlayer.iconUrl;
            nodePrefab.getChildByName('name').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerlist[i].shortPlayer.pid, playerlist[i].shortPlayer.name);
            nodePrefab.getChildByName('id').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(heroID);
            nodePrefab.getChildByName('promoterName').getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerlist[i].upShortPlayer.pid, playerlist[i].upShortPlayer.name);
            nodePrefab.getChildByName('promoterId').getComponent(cc.Label).string = "ID:" + this.ComTool.GetPid(playerlist[i].upShortPlayer.pid);
            nodePrefab.getChildByName('pl').getComponent(cc.Label).string = playerlist[i].sportsPoint;
            nodePrefab.getChildByName('taotaifen').getComponent(cc.Label).string = playerlist[i].eliminatePoint;

            //根据是否禁止来显示按钮
            if (playerlist[i].isUnionBanGame) {
                nodePrefab.getChildByName('btn_jzyx').active = false;
                nodePrefab.getChildByName('btn_qxjz').active = true;
                nodePrefab.getChildByName("img_jzyx").active = true;
            } else {
                nodePrefab.getChildByName('btn_jzyx').active = true;
                nodePrefab.getChildByName('btn_qxjz').active = false;
                nodePrefab.getChildByName("img_jzyx").active = false;
            }
            nodePrefab.active = true;
            this.memberlist_layout.addChild(nodePrefab);
            if (headImageUrl) {
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                var WeChatHeadImage = nodePrefab.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
            }
        }
    }
});

cc._RF.pop();