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

    OnShow:function(url){
        this.url=url;
    },
    

    //---------点击函数---------------------

    OnClick:function(btnName, eventData){

        if(btnName == "btnSure"){
            cc.sys.openURL(this.url);
            this.CloseForm();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }
        else{
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

});
