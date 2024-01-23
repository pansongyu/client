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
        this.RegEvent("EVT_DingWei",this.OnDingWei);
    },

    //---------显示函数--------------------

    OnShow:function(){
        this.DingWeing=false;
    },
    OnDingWei:function(event){
        let data=event;
        if(data["state"]==1){
            //定位失败
            this.ShowSysMsg('定位失败');
            this.DingWeing=false;
        }else{
             this.ShowSysMsg('定位成功');
             this.CloseForm();
        }
    },
    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
			if(cc.sys.isNative){
                app.NativeManager().CallToNative("gpsSetting",[]);
            }
            app.FormManager().CloseForm("UIMessageGps");
		}
        if(btnName == "btnDingWei"){
           //手动定位
          if(this.DingWeing==true){
              this.ShowSysMsg("定位中");
              return;
          }
          this.DingWeing=true;
          app.LocationOnStartMgr().OnGetLocation();
        }
		else if(btnName == "btnCancel"){
			this.CloseForm();
		}
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},

});
