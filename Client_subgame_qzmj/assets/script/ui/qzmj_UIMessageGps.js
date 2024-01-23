/*
    UIMessage 模态消息界面
*/

var app = require("qzmj_app");

cc.Class({
    extends: require(app.subGameName+"_BaseForm"),

    properties: {
    },

    //初始化
    OnCreateInit:function(){
    },

    //---------显示函数--------------------

    OnShow:function(){
    },

    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
			if(cc.sys.isNative){
                app[app.subGameName+"_NativeManager"]().CallToNative("gpsSetting",{});
            }
            app[app.subGameName+"_FormManager"]().CloseForm(app.subGameName+"_UIMessageGps");
		}
		else if(btnName == "btnCancel"){
			this.CloseForm();
		}
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},

});
