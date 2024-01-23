var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
    },

    OnShow:function () {
        // this.SysLog("OnShow");
	    this.lable_time = this.node.getChildByName("lable_time").getComponent(cc.Label);
        this.time = 15;
        this.Animation =  this.node.getComponent(cc.Animation);
        

        this.Animation.play("UIAudio");
    },

    update:function(dt){
        //this.SysLog("update dt:%s" ,dt);
        this.time -= dt;
        this.lable_time.string = '剩余录制' + Math.floor(this.time) + '秒';

        if(this.time < 0){
            app[app.subGameName+"_AudioManager"]().stopRecord();
        }
    },
    
});
