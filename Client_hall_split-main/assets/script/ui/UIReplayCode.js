var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_shurukuang:cc.Node,
    },

    OnCreateInit: function () {
        this.NetManager = app.NetManager();
        this.FormManager = app.FormManager();
    },

    OnShow: function () {
		this.ResetNumber();
    },
    
    ResetNumber:function(){
        let children = this.sp_shurukuang.children;
        for(let idx = 0; idx < children.length; idx++){
            let sp_bg = children[idx];
            sp_bg.getChildByName("lb_num").getComponent(cc.Label).string = "";
            sp_bg.getChildByName("lb_num").active=false;
        }
        this.labelString = [];
    },
    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(!btnName){
            this.ErrLog("UIJoin Buttn OnClick(%s) not find btnName", btnName);
        }
        if(btnName === "btn_clear"){
            this.Click_Btn_Clear();
        }
        else if(btnName === "btn_close"){
            this.Click_btn_close();
        }
        else if(btnName === "btn_reset"){
            this.ResetNumber();
        }
         else if(btnName === "btn_chakan"){
            this.Click_btn_chakan();
        }
        else{
            this.Click_BtnNumber(btnName);
        }
    },
    Click_btn_close:function () {
        this.labelString = [];
        this.OnClick_Close();
    },

    Click_Btn_Clear:function () {
        if(this.labelString.length == 0){
            return
        }
        let node = this.GetWndNode("sp_shuru/shurukuang/sp_bg" + this.labelString.length + "/lb_num");
        node.getComponent(cc.Label).string = "";
        node.active=false;
        this.labelString.pop();
    },
    Click_btn_chakan:function(){
         if(this.labelString.length==0){
            return;
         }
         let code = this.labelString.join("");
         this.NetManager.SendPack("game.CPlayerPlayBack", {"playBackCode":code,"chekcPlayBackCode":true},this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
    },
    Click_BtnNumber:function (btnName) {
        if(this.labelString.length >= 11){
            return;
        }
        let num = Math.floor(btnName.substring(btnName.length - 1));
        this.labelString.push(num);
	    let code = this.labelString.join("");

        let children = this.sp_shurukuang.children;
        for(let idx = 0; idx < children.length; idx++){
            let sp_bg = children[idx];
            let lb_num = sp_bg.getChildByName("lb_num").getComponent(cc.Label);
            if(lb_num.string == ""){
                let data = this.labelString[this.labelString.length -1];
                lb_num.string = data.toString();
                lb_num.node.active=true;
                break;
            }
        }
        /*if(this.labelString.length == 7){
            this.NetManager.SendPack("game.CPlayerPlayBack", {"playBackCode":code,"chekcPlayBackCode":true},this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
        }*/
    },
    OnPack_VideoData:function(serverPack){
        let code = this.labelString.join("");
        // let gameName = app.ShareDefine().GametTypeID2PinYin[gameType];
        app.Client.VideoCheckSubGame(serverPack.Name.toLowerCase(), code);
    },
    OnVideoFailed:function(serverPack){
        app.SysNotifyManager().ShowSysMsg("MSG_REPLAY_ERROR");
    },
});
