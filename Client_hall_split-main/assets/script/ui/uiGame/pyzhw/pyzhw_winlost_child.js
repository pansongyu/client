/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {},

	// use this for initialization
	OnLoad: function () {

	},
	ShowPlayerData: function (setEnd, playerAll, index, dPos) {
		let player = setEnd.posResultList[index];

		let pos = player.pos;
		let point = player.point;
		let m_hwPoint = player["m_hwPoint"];
		let m_hwPointBeiZhuo = player["m_hwPointBeiZhuo"];

		this.node.getChildByName("lb_zhuohong").getComponent("cc.Label").string = m_hwPoint;
		this.node.getChildByName("lb_beizhuo").getComponent("cc.Label").string = m_hwPointBeiZhuo;

		//玩家分数
		let winNode = this.node.getChildByName("lb_win_num");
		let loseNode = this.node.getChildByName("lb_lose_num");
		winNode.active = false;
		loseNode.active = false;

		this.node.getChildByName("user_info").getChildByName("img_zhuang").active = (pos == dPos);
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
		let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
		if (player.sportsPoint) {
			if (player.sportsPoint > 0) {
				lb_sportsPointTitle.active = true;
				lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
			}
			else {
				lb_sportsPointTitle.active = true;
				lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
			}
		} else {
			lb_sportsPointTitle.active = false;
		}

		let playerInfo = null;
		for (let i = 0; i < playerAll.length; i++) {
			if (player.pid == playerAll[i].pid) {
				playerInfo = playerAll[i];
				break;
			}
		}

		let head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
		head.ShowHeroHead(playerInfo.pid);
		//玩家名字
		let playerName = "";
		playerName = playerInfo.name;
		if (playerName.length > 9) {
			playerName = playerName.substring(0, 9) + '...';
		}
		let name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
		name.string = playerName;

		let id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
		id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
		this.ShowSpecData(setEnd, playerAll, index);
	},
	ShowSpecData: function (setEnd, playerAll, index) {
		console.log("ShowSpecData", setEnd, playerAll);
	},
});
