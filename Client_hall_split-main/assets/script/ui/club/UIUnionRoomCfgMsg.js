/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    //初始化
    OnCreateInit:function(){
    },

    //---------显示函数--------------------

    OnShow:function(wanfaStr, unionCfgStr){
        this.node.getChildByName("wanfa_1").getComponent(cc.Label).string = wanfaStr;
        this.node.getChildByName("wanfa_2").getComponent(cc.Label).string = unionCfgStr;
    },

    OnClose:function(){
    },

    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
            this.CloseForm();
		}
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},


});
