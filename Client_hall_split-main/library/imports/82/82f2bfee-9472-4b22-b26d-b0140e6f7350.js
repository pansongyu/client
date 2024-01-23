"use strict";
cc._RF.push(module, '82f2b/ulHJLIrJtsBQOb3NQ', 'UIMessageWeiXinShare');
// script/ui/UIMessageWeiXinShare.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        LabelMessage: cc.Label,
        BtnSure: cc.Button
    },

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow() {},

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {

        if (btnName == "btnSure") {
            this.CloseForm();
        }
    }
});

cc._RF.pop();