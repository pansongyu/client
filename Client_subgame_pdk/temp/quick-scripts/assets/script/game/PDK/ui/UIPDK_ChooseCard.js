(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/ui/UIPDK_ChooseCard.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk138-53d8-494e-a17b-340e2c97b38c', 'UIPDK_ChooseCard', __filename);
// script/game/PDK/ui/UIPDK_ChooseCard.js

"use strict";

/*
 UIChooseCard 界面基类(又FormManager控制创建和销毁)
 */
var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        card01: cc.Node,
        card02: cc.Node,
        card03: cc.Node,
        card04: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
    },

    OnShow: function OnShow(huPaiList) {
        this.card01.active = 0;
        this.card02.active = 0;
        this.card03.active = 0;
        this.card04.active = 0;

        var count = huPaiList.length;
        for (var i = 0; i < count; i++) {
            var cardType = huPaiList[i];
            var cardPath = this.ComTool.StringAddNumSuffix("card", i + 1, 2);
            var imageName = ["CardShow", huPaiList[i]].join("");
            var wndNode = this.GetWndNode(cardPath);
            wndNode.CardType = cardType;

            this.SetWndProperty(cardPath, "active", 1);
            this.SetWndProperty(cardPath, "image", imageName);
        }
    },

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName.startsWith("card")) {
            this.Click_EmitAnGang(btnNode);
        } else {
            this.ErrLog("OnClick btnName:%s not find  ", btnName);
        }
    },
    Click_EmitAnGang: function Click_EmitAnGang(btnNode) {
        var cardType = btnNode.CardType;
        var sendCardID = [cardType, "01"].join("");
        this.RoomMgr.SendPosAction(sendCardID, this.ShareDefine.OpType_AnGang);
        this.FormManager.GetFormComponentByFormName("UICard01").CloseSpTiShi();
        this.CloseForm();
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
        //# sourceMappingURL=UIPDK_ChooseCard.js.map
        