"use strict";
cc._RF.push(module, '733afJB0GdEUY9bff909Ecf', 'bsl_detail_child');
// script/ui/uiGame/bsl/bsl_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},
	ShowPlayerData: function ShowPlayerData(resultsList, playerAll, idx) {
		console.error("resultsList:  ", resultsList);
		console.error("playerAll:  ", playerAll);
		console.error("idx:  ", idx);
		this.node.getChildByName("icon_win").active = false;
		this.node.getChildByName("user_info").getChildByName("fangzhu").active = false;
		var data = resultsList[idx];
		this.node.getChildByName("user_info").getChildByName("fangzhu").active = data["isOwner"];
		var userInfo = this.node.getChildByName("user_info");
		if (userInfo) {
			userInfo.getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
			userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
			for (var index in playerAll) {
				var player = playerAll[index];
				if (player.pid == data.pid) {
					userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
					break;
				}
			}
		}
		this.node.getChildByName("lb_win").getComponent(cc.Label).string = data.winnerCount || 0;
		this.node.getChildByName("lb_lose").getComponent(cc.Label).string = data.loseCount || 0;
		this.node.getChildByName("lb_count_gou").getComponent(cc.Label).string = data.jieGuoCount || '';
		if (data.point >= 0) {
			this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + data.point;
			this.node.getChildByName("lb_win_num").active = true;
			this.node.getChildByName("lb_lose_num").active = false;
		} else {
			this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = data.point;
			this.node.getChildByName("lb_win_num").active = false;
			this.node.getChildByName("lb_lose_num").active = true;
		}
		//比赛分
		if (typeof data.sportsPoint != "undefined") {
			this.node.getChildByName("lb_sportsPoint").active = true;
			if (data.sportsPoint > 0) {
				this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + data.sportsPoint;
			} else {
				this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = data.sportsPoint;
			}
		} else {
			this.node.getChildByName("lb_sportsPoint").active = false;
		}
		var maxPoint = 0;
		for (var i = 0; i < resultsList.length; i++) {
			var _data = resultsList[i];
			if (_data.point > maxPoint) {
				maxPoint = _data.point;
			}
		}
		//显示大赢家图标
		this.node.getChildByName("icon_win").active = data.point >= maxPoint;
	}
});

cc._RF.pop();