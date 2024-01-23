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
        this.ShareDefine = app.ShareDefine();
    },

    //---------显示函数--------------------

    OnShow:function(){


    },

    OnClose:function(){
    },

    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
			app.Client.LogOutGame(1);
            this.CloseForm();
		}
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},


});
