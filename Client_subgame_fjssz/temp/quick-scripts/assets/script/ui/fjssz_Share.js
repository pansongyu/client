(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_Share.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'edfdfh4tBRP97WQ5YLd0K+Z', 'fjssz_Share', __filename);
// script/ui/fjssz_Share.js

"use strict";

var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},
	OnCreateInit: function OnCreateInit() {
		this.SDKManager = app[app.subGameName + "_SDKManager"]();
	},
	ShareWX: function ShareWX() {
		if (this.sharetype == 0) {
			this.node.active = false;
			this.SDKManager.ShareScreen('0');
		} else {
			this.SDKManager.Share(this.title, this.gamedesc, this.weChatAppShareUrl, "0");
		}
	},
	ShareDD: function ShareDD() {
		if (this.sharetype == 0) {
			this.node.active = false;
			this.SDKManager.ShareScreenDD();
		} else {
			this.SDKManager.ShareDD(this.title, this.gamedesc, this.weChatAppShareUrl);
		}
	},
	ShareMW: function ShareMW() {
		if (this.sharetype == 0) {
			this.node.active = false;
			this.SDKManager.ShareScreenMW();
		} else {
			this.SDKManager.ShareMW(this.title, this.gamedesc, this.weChatAppShareUrl);
		}
	},
	/*
  * 0:图片分享，1:链接分享
  */
	OnShow: function OnShow() {
		var sharetype = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var roomID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var gamedesc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
		var weChatAppShareUrl = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

		this.node.active = true;
		this.sharetype = sharetype;
		this.roomID = roomID;
		this.title = title;
		this.gamedesc = gamedesc;
		this.weChatAppShareUrl = weChatAppShareUrl;
	},
	//---------点击函数---------------------
	OnClick: function OnClick(btnName, btnNode) {
		if (!btnName) {
			console.error("UIJoin Buttn OnClick(%s) not find btnName", btnName);
		} else if (btnName === "btn_close") {
			this.CloseForm();
		} else if (btnName == "btn_wx") {
			this.ShareWX();
			this.CloseForm();
		} else if (btnName == "btn_dd") {
			this.ShareDD();
			this.CloseForm();
		} else if (btnName == "btn_mw") {
			this.ShareMW();
			this.CloseForm();
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
        //# sourceMappingURL=fjssz_Share.js.map
        