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
    OnCreateInit:function(){
        this.node.getComponent(cc.Animation).on('finished', this.Event_Finished, this);
    //    this.UIMessage_Drift.on('finished',this.Event_Finished,this);
    },
    Event_Finished:function () {
        this.CloseForm();
    },
    //---------显示函数--------------------
    OnShow:function(msgID, msgArgList, content){
        this.SetWndProperty(["bg1", "LabelMessage"].join("/"), "text", content);
        //this.UIMessage_Drift.play();
        this.node.getComponent(cc.Animation).play("UIMessage_Drift_Action");
     },
});
