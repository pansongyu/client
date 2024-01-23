var app = require("nn_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		sp_boy: cc.SpriteFrame,
		sp_girl: cc.SpriteFrame,
	},

	//初始化
	OnCreateInit: function () {
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();

		this.ZorderLv = 8;
		this.lb_name = this.GetWndComponent("bg/bg_popup/bg_label1/sp_female/lb_name", cc.Label);
		this.lb_ID = this.GetWndComponent("bg/bg_popup/bg_label1/sp_id/lb_ID", cc.Label);
		this.lb_count = this.GetWndComponent("bg/bg_popup/bg_label2/lb_count", cc.Label);
		this.lb_number = this.GetWndComponent("bg/bg_popup/bg_label3/lb_number", cc.Label);
		this.lb_play = this.GetWndComponent("bg/bg_popup/bg_label4/lb_play", cc.Label);
		this.sp_head = this.GetWndComponent("bg/bg_popup/bg_label1/sp_head", cc.Sprite);
		this.sp_female = this.GetWndComponent("bg/bg_popup/bg_label1/sp_female", cc.Sprite);
	},

	OnShow: function () {
		this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let ownerID = this.RoomMgr.GetEnterRoom().GetRoomProperty("ownerID");
		let AllPlayerInfo = this.RoomPosMgr.GetRoomAllPlayerInfo();
		let playerCOunt = this.RoomPosMgr.GetRoomPlayerCount();
		for (let i = 0; i < playerCOunt; i++) {
			if (AllPlayerInfo[i].pid == ownerID) {
				this.lb_ID.string = this.ComTool.GetPid(AllPlayerInfo[i].pid);
				this.lb_name.string = AllPlayerInfo[i].name;
				let WeChatHeadImage = this.sp_head.getComponent(app.subGameName + "_WeChatHeadImage");
				WeChatHeadImage.ShowHeroHead(AllPlayerInfo[i].pid);
				if (AllPlayerInfo[i].sex == app[app.subGameName + "_ShareDefine"]().HeroSex_Boy) {
					this.sp_female.spriteFrame = this.sp_boy;
				} else {
					this.sp_female.spriteFrame = this.sp_girl;
				}
				break;
			}
		}
		this.ShowCountOrNumber();
		let roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
		let sign = roomCfg["sign"];
		let gameStr = "自由抢庄";
		let gameName = "zyqz_nn";
		if (sign == 1) {
			gameName = "nnsz_nn";
			gameStr = "双十上庄";
		} else if (sign == 2) {
			gameName = "gdzj_nn";
			gameStr = "固定庄家";
		} else if (sign == 3) {
			gameName = "tbnn_nn";
			gameStr = "通比双十";
		} else if (sign == 4) {
			gameName = "mpqz_nn";
			gameStr = "明牌抢庄";
		} else if (sign == 5) {
			gameName = "lz_nn";
			gameStr = "轮庄双十";
		}
		this.lb_play.string = gameStr + this.WanFa(null, gameName);
	},
	ShowHero_NameOrID: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let ownerID = room.GetRoomProperty("ownerID");
		let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		var playerInfo = null;
		for (var i = 0; i < playerAllList.length; i++) {
			playerInfo = playerAll[playerAllList[i]];
			if (playerInfo.pid == ownerID) {
				this.lb_name.string = playerInfo.name;
			}
		}
		let heroID = app.HeroManager().GetHeroProperty("pid");
		this.lb_ID.string = this.ComTool.GetPid(heroID);
		let WeChatHeadImage = this.sp_head.getComponent(app.subGameName + "_WeChatHeadImage");
		WeChatHeadImage.ShowHeroHead(heroID);
	},
	ShowSex: function () {
		let sex = app.HeroAccountManager().GetAccountProperty("Sex");
		if (sex == app[app.subGameName + "_ShareDefine"]().HeroSex_Boy) {
			this.sp_female.spriteFrame = this.sp_boy;
		} else {
			this.sp_female.spriteFrame = this.sp_girl;
		}
	},
	ShowCountOrNumber: function () {
		let joinPlayerCount = -1;
		let room = this.RoomMgr.GetEnterRoom();
		if (this.RoomPosMgr) {
			let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
			let playerAllList = Object.keys(playerAll);
			joinPlayerCount = playerAllList.length;
		} else {
			joinPlayerCount = room.GetRoomProperty('posList').length;
		}

		this.lb_count.string = joinPlayerCount + "人";
		let current = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("setCount");
		let setID = this.RoomMgr.GetEnterRoom().GetRoomProperty("setID");
		if (current == 100) {
			this.lb_number.string = "1考";
		} else {
			this.lb_number.string = current + "局";
		}

		console.log(this.RoomMgr.GetEnterRoom().GetRoomDataInfo());
	},
});
