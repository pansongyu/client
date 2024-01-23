(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIMessage_Drift.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bba3cl2zyxB/ascy2FITEO9', 'UIMessage_Drift', __filename);
// script/ui/UIMessage_Drift.js

"use strict";

/*
    UIMessage_Drift 浮动提示界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        //    UIMessage_Drift:cc.Node,
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.node.getComponent(cc.Animation).on('finished', this.Event_Finished, this);
        //    this.UIMessage_Drift.on('finished',this.Event_Finished,this);
    },
    Event_Finished: function Event_Finished() {
        this.CloseForm();
    },
    //---------显示函数--------------------
    OnShow: function OnShow(msgID, msgArgList, content) {
        this.SetWndProperty(["bg1", "LabelMessage"].join("/"), "text", content);
        //this.UIMessage_Drift.play();
        this.node.getComponent(cc.Animation).play("UIMessage_Drift_Action");
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
        //# sourceMappingURL=UIMessage_Drift.js.map
        