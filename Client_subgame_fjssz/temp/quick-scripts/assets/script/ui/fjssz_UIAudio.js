(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_UIAudio.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjsszf24-dd84-4917-bff5-80a4f757a3bb', 'fjssz_UIAudio', __filename);
// script/ui/fjssz_UIAudio.js

"use strict";

var app = require("fjssz_app");
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=fjssz_UIAudio.js.map
        