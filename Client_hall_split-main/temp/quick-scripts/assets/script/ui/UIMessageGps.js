(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIMessageGps.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fd9ffnIBRxEGpA5pYwCqANx', 'UIMessageGps', __filename);
// script/ui/UIMessageGps.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {},

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.RegEvent("EVT_DingWei", this.OnDingWei);
    },

    //---------显示函数--------------------

    OnShow: function OnShow() {
        this.DingWeing = false;
    },
    OnDingWei: function OnDingWei(event) {
        var data = event;
        if (data["state"] == 1) {
            //定位失败
            this.ShowSysMsg('定位失败');
            this.DingWeing = false;
        } else {
            this.ShowSysMsg('定位成功');
            this.CloseForm();
        }
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, eventData) {
        if (btnName == "btnSure") {
            if (cc.sys.isNative) {
                app.NativeManager().CallToNative("gpsSetting", []);
            }
            app.FormManager().CloseForm("UIMessageGps");
        }
        if (btnName == "btnDingWei") {
            //手动定位
            if (this.DingWeing == true) {
                this.ShowSysMsg("定位中");
                return;
            }
            this.DingWeing = true;
            app.LocationOnStartMgr().OnGetLocation();
        } else if (btnName == "btnCancel") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
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
        //# sourceMappingURL=UIMessageGps.js.map
        