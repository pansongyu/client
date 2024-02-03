(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/pdk_UIRoomRecord.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fa981WrItdDpY+dtUti4FH9', 'pdk_UIRoomRecord', __filename);
// script/game/PDK/pdk_UIRoomRecord.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        this.headNodes = this.GetWndNode("node/headNodes");
        this.zongfenNode = this.GetWndNode("node/zongfen");
        this.jiFenLayout = this.GetWndNode("node/jifenNode/layout");
        this.demo = this.node.getChildByName("demo");

        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.Room = app[app.subGameName.toUpperCase() + "Room"]();
        this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.SoundManager = app[app.subGameName + "_SoundManager"]();
        this.HeroManager = app[app.subGameName + "_HeroManager"]();
        this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
        this.Define = app[app.subGameName.toUpperCase() + "Define"]();

        this.bigWinner = 0;
    },

    OnShow: function OnShow(serverPack) {
        this.HideAll();
        this.InitHeadAndFen(serverPack["userInfo"]);
        this.ShowJiFen(serverPack["setInfo"]);
    },
    HideAll: function HideAll() {
        for (var _i = 0; _i < 3; _i++) {
            this.headNodes.children[_i].active = false;
        }
        for (var i = 0; i < 3; i++) {
            var node = this.zongfenNode.getChildByName("point" + i);
            node.active = false;
        }
        this.jiFenLayout.removeAllChildren();
    },
    InitHeadAndFen: function InitHeadAndFen(userInfo) {
        for (var pos in userInfo) {
            var player = userInfo[pos];
            //显示玩家头像
            var headNode = this.headNodes.getChildByName("headNode" + pos);
            headNode.active = true;
            headNode.getChildByName('touxiang').getComponent(app.subGameName + "_WeChatHeadImage").ShowHeroHead(player["pid"]);

            //显示玩家总分
            var pointNode = this.zongfenNode.getChildByName("point" + pos);
            pointNode.active = true;
            pointNode.getComponent(cc.Label).string = player["totalPoint"];
        }
    },
    ShowJiFen: function ShowJiFen(setInfo) {
        for (var i = 0; i < setInfo.length; i++) {
            var setID = setInfo[i]["setID"];
            var pointMap = setInfo[i]["point"];
            var jiFenDemo = cc.instantiate(this.demo);
            jiFenDemo.getChildByName("setID").getComponent(cc.Label).string = "第" + setID + "局";
            for (var pos in pointMap) {
                jiFenDemo.getChildByName("point" + pos).getComponent(cc.Label).string = pointMap[pos];
                jiFenDemo.getChildByName("point" + pos).active = true;
            }
            if (setID % 2 == 1) {
                jiFenDemo.getComponent(cc.Sprite).spriteFrame = "";
            }
            jiFenDemo.active = true;
            this.jiFenLayout.addChild(jiFenDemo);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_jixu") {}
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
        //# sourceMappingURL=pdk_UIRoomRecord.js.map
        