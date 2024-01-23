var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        lb_notice:cc.Node,
    },

    // use this for initialization
    OnCreateInit: function () {
        
    },
    OnShow:function(){
        let gameName = app.subGameName;
        if(gameName.indexOf("mj")>-1){
            this.lb_notice.active = true;
        }
        else {
            this.lb_notice.active = false;
        }
        app[app.subGameName + "Client"].OnEvent("Card01AutoPlay",[]);
    },
    OnClick:function(btnName, btnNode){
        if('btn_cancel' == btnName){
            app[app.subGameName + "_GameManager"]().CancelAutoPlay();
            this.CloseForm();
        }
    }
});
