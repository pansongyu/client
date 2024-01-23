"use strict";
cc._RF.push(module, 'fjsszbf7-1cce-44cd-b5a9-817316a9746d', 'fjssz_UIMessage_Drift');
// script/ui/fjssz_UIMessage_Drift.js

"use strict";

/*
    UIMessage_Drift 浮动提示界面
*/

var app = require("fjssz_app");

cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

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