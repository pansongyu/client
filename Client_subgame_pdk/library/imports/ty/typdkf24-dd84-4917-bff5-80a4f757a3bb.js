"use strict";
cc._RF.push(module, 'typdkf24-dd84-4917-bff5-80a4f757a3bb', 'pdk_UIAudio');
// script/ui/pdk_UIAudio.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {

        lable_time: cc.Label
    },

    OnShow: function OnShow() {
        // this.SysLog("OnShow");
        this.time = 15;
        this.Animation = this.node.getComponent(cc.Animation);

        this.Animation.play("UIAudio");
    },

    update: function update(dt) {
        //this.SysLog("update dt:%s" ,dt);
        this.time -= dt;
        this.lable_time.string = '剩余录制' + Math.floor(this.time) + '秒';

        if (this.time < 0) {
            app[app.subGameName + "_AudioManager"]().stopRecord();
        }
    }

});

cc._RF.pop();