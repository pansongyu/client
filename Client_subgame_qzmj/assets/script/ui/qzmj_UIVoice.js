var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName+"_BaseForm"),

    properties: {
        btn_voice:cc.Node,
    },

    OnCreateInit: function () {
        this.btn_voice.on("touchstart",     this.Event_TouchStart,  this)
        this.btn_voice.on("touchend",       this.Event_TouchEnd,    this)
        this.btn_voice.on("touchcancel",    this.Event_TouchEnd,    this)
    },

    OnShow:function () {
        if(app[app.subGameName + "_ShareDefine"]().isCoinRoom || !cc.sys.isNative){
			this.btn_voice.active = false;
		}else{
			this.btn_voice.active = true;
		}
    },

    OnClose:function(){
        this.SysLog("OnClose");
        app[app.subGameName + "_AudioManager"]().OnDestory();
    },


    //-----------------回调函数------------------
    Event_TouchStart:function (event) {
        // this.SysLog("Event_TouchStart");
        app[app.subGameName + "_AudioManager"]().startRecord();
        
    },
    Event_TouchEnd:function (event) {
        // this.SysLog("Event_TouchEnd");
        
        this.FormManager.CloseForm(app.subGameName+"_UIAudio");
        app[app.subGameName + "_AudioManager"]().setTouchEnd(true);
        app[app.subGameName + "_AudioManager"]().stopRecord();
    },

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_chat"){
            this.FormManager.ShowForm(app.subGameName+"_UIChat");
        }
        else if(btnName == "btn_voice"){
            
        }
        else{
            this.ErrLog("OnClick(%s) not find btnName",btnName);
        }
    },
    
});