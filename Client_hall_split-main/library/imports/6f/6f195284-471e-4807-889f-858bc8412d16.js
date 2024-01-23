"use strict";
cc._RF.push(module, '6f195KERx5IB4ifhYvIQS0W', 'UINoticeBar');
// script/common/UINoticeBar.js

"use strict";

/*
 UIDice.js 摇色子界面
 */

var app = require("app");

cc.Class({
	extends: require("BaseForm"),

	properties: {
		msg: cc.Node
	},

	OnCreateInit: function OnCreateInit() {

		this.NetManager = app.NetManager();

		this.speed = 30;

		this.msgList = [];

		this.NetManager.SendPack("game.CSystemNotice", {}, this.GetNoticeMsg.bind(this));
	},

	OnShow: function OnShow() {

		var argList = Array.prototype.slice.call(arguments);

		this.count = 0;

		this.runMsg();
	},

	runMsg: function runMsg() {

		this.msg.stopAllActions();

		if (!this.msgList.length) return;

		if (this.count >= this.msgList.length) {
			this.count = 0;
		}

		this.msg.getComponent(cc.Label).string = this.msgList[this.count];

		var node = this.node.getChildByName("bg");

		this.msg.x = node.width / 2 + node.x;
		this.msg.y = node.height / 2;

		var mWidth = this.msg.width;

		var moveX = node.x - node.width / 2 - mWidth;

		var time = (node.width + mWidth) / this.speed;

		var self = this;

		var seq = cc.sequence(cc.moveTo(time, cc.v2(moveX, this.msg.y)), cc.callFunc(function () {
			this.runMsg();
		}, this));

		this.msg.runAction(seq);

		this.count++;
	},

	GetNoticeMsg: function GetNoticeMsg(serverPack) {
		var list = serverPack;

		if (!list.length) return;

		var alertTime = Math.round(new Date().getTime() / 1000);
		for (var idx = 0; idx < list.length; idx++) {
			var data = list[idx];
			var endTime = data.endTime;

			if (alertTime > endTime) {
				continue;
			}

			this.msgList.push(data.content);
			if (data.clientType == 3) {
				var beginTime = data.beginTime;
				var checkTime = beginTime - 7200;
				if (alertTime > checkTime && alertTime < beginTime) {
					app.SysNotifyManager().ShowSysMsg(data.content);
				}
			}
		}
		if (this.msgList.length == 0) {
			this.node.active = false;
		} else {
			this.node.active = true;
		}

		this.runMsg();
	}

});

cc._RF.pop();