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

    OnShow:function(httpurl){
        this.httpurl=httpurl;
    },

    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
			cc.sys.openURL(this.httpurl);
		}else if(btnName == "btn_close"){
            this.CloseForm();
        }
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},

    /**
     * 点击确定
     */
    AfterOnClick:function(eventType){

        this.CloseForm();

	    this.ConfirmManager.OnConFirmResult(eventType);

        // 如果还有消息则继续显示
        if(this.msgInfoList.length){
            this.ShowMsgInfo();
        }
    },

});
