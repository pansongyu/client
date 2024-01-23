(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIWebTip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c7537f6XEVKM5Gk3x5bimw0', 'UIWebTip', __filename);
// script/ui/UIWebTip.js

"use strict";

/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        webviewNode: cc.Node
    },
    OnCreateInit: function OnCreateInit() {},
    OnShow: function OnShow() {
        var myDate = new Date();
        var heroID = app.HeroManager().GetHeroID();
        var i = myDate.getMilliseconds();
        this.webviewNode.getComponent(cc.WebView).url = "http://fb.qicaiqh.com:88/online/" + heroID + "?=" + i;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_back") {
            this.CloseForm();
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
        //# sourceMappingURL=UIWebTip.js.map
        