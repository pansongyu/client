var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
                
        lable_time:cc.Label,
    },

    OnShow:function () {
        // this.SysLog("OnShow");
        this.time = 15;
        this.Animation =  this.node.getComponent(cc.Animation);
        

        this.Animation.play("UIAudio");
    },

    update:function(dt){
        //this.SysLog("update dt:%s" ,dt);
        this.time -= dt;
        this.lable_time.string = '剩余录制' + Math.floor(this.time) + '秒';

        if(this.time < 0){
            app[app.subGameName + "_AudioManager"]().stopRecord();
        }
    },
    
});
