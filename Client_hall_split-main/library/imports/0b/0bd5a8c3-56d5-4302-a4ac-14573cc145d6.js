"use strict";
cc._RF.push(module, '0bd5ajDVtVDAqSsFFc8wUXW', 'pyzhw_winlost_child');
// script/ui/uiGame/pyzhw/pyzhw_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index, dPos) {
		var player = setEnd.posResultList[index];

		var pos = player.pos;
		var point = player.point;
		var m_hwPoint = player["m_hwPoint"];
		var m_hwPointBeiZhuo = player["m_hwPointBeiZhuo"];

		this.node.getChildByName("lb_zhuohong").getComponent("cc.Label").string = m_hwPoint;
		this.node.getChildByName("lb_beizhuo").getComponent("cc.Label").string = m_hwPointBeiZhuo;

		//玩家分数
		var winNode = this.node.getChildByName("lb_win_num");
		var loseNode = this.node.getChildByName("lb_lose_num");
		winNode.active = false;
		loseNode.active = false;

		this.node.getChildByName("user_info").getChildByName("img_zhuang").active = pos == dPos;
		if (point > 0) {
			winNode.active = true;
			winNode.getComponent(cc.Label).string = "+" + point;
			this.node.getChildByName("win").active = true;
			this.node.getChildByName("lost").active = false;
		} else {
			loseNode.active = true;
			loseNode.getComponent(cc.Label).string = point;
			this.node.getChildByName("win").active = false;
			this.node.getChildByName("lost").active = true;
		}

		//比赛分
		var lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
		if (player.sportsPoint) {
			if (player.sportsPoint > 0) {
				lb_sportsPointTitle.active = true;
				lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
			} else {
				lb_sportsPointTitle.active = true;
				lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
			}
		} else {
			lb_sportsPointTitle.active = false;
		}

		var playerInfo = null;
		for (var i = 0; i < playerAll.length; i++) {
			if (player.pid == playerAll[i].pid) {
				playerInfo = playerAll[i];
				break;
			}
		}

		var head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
		head.ShowHeroHead(playerInfo.pid);
		//玩家名字
		var playerName = "";
		playerName = playerInfo.name;
		if (playerName.length > 9) {
			playerName = playerName.substring(0, 9) + '...';
		}
		var name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
		name.string = playerName;

		var id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
		id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
		this.ShowSpecData(setEnd, playerAll, index);
	},
	ShowSpecData: function ShowSpecData(setEnd, playerAll, index) {
		console.log("ShowSpecData", setEnd, playerAll);
	}
});

cc._RF.pop();