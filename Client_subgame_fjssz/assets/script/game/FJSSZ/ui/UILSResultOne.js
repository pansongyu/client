var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		pre_result: cc.Node,
		frame : cc.SpriteFrame,
	},

	OnCreateInit: function () {
		this.gameName = app["subGameName"];
		this.ZorderLv = this.ZorderLv6;
		this.layout = this.GetWndNode("playerAll");
		this.btn_continue = this.GetWndNode("btnList/btn_continue");

		this.RoomMgr = app[this.gameName.toUpperCase() + "RoomMgr"]();
		this.Room = app[this.gameName.toUpperCase() + "Room"]();
		this.FormManager = app[this.gameName + "_FormManager"]();
		this.ComTool = app[this.gameName + "_ComTool"]();
		this.NetManager = app[this.gameName + "_NetManager"]();
		this.HeroManager = app[this.gameName + "_HeroManager"]();
		this.SDKManager = app[this.gameName + "_SDKManager"]();
		this.RegEvent("NewVersion", this.Event_NewVersion, this);
	},
	Event_NewVersion: function () {
		this.isNewVersion = true;
	},

	OnShow: function () {
		this.isNewVersion = false;
		if (!this.RoomMgr.GetEnterRoom().GetRoomProperty("resultInfo")) {
			this.CloseForm()
			return
		}
		let roomEnd = this.RoomMgr.GetEnterRoom().GetRoomProperty("resultInfo").sRankingResult;
		if (!roomEnd) {
			this.CloseForm()
			return
		}
		app[app.subGameName + "_HotUpdateMgr"]().CheckUpdate(); //检测客户端是否有新版本
		this.roomCfg = this.RoomMgr.GetEnterRoom().GetRoomConfig();
		this.playerNameList = [];
		let recordPosInfosList = roomEnd["posResultList"];
		this.AddPosInfoPre(recordPosInfosList);
		this.ShowPlayerInfo(recordPosInfosList, roomEnd.rankeds, roomEnd.pCard1, roomEnd.pCard2, roomEnd.pCard3);
		
		let  time = this.node.getChildByName("clock").getChildByName("time")
		time.getComponent(cc.Label).string = "10"
		this.unscheduleAllCallbacks()
		this.schedule(this.timer.bind(this), 1, 10, 1.0)
		if (app.playuissz) {
			app.playuissz.needDelayDiss = false
		}
	},
	timer(){
		let time = this.node.getChildByName("clock").getChildByName("time")
		let d = parseInt(time.getComponent(cc.Label).string)
		d--
		if(d < 0){
			this.unscheduleAllCallbacks()
			d = 0
			this.OnClick("btn_continue", this.btn_continue)
		}
		time.getComponent(cc.Label).string = d.toString()
	},
	AddPosInfoPre: function (recordPosInfosList) {
		this.layout.removeAllChildren();
		let playerNum = recordPosInfosList.length;
		for (let i = 0; i < playerNum; i++) {
			let playerNode = cc.instantiate(this.pre_result);
			playerNode.name = "resultDetail" + i;
			playerNode.active = false;
			this.layout.addChild(playerNode);
		}
		this.pre_result.active = false
	},
	ShowSelf: function (point) {
		if (point >= 0) {
			this.node.getChildByName("bg").active = true
			this.node.getChildByName("bg1").active = false
		}
		else{
			this.node.getChildByName("bg1").active = true
			this.node.getChildByName("bg").active = false
		}
	},
	ShowPlayerInfo: function (recordPosInfosList, rankeds,pCard1, pCard2, pCard3) {
		let playerNum = recordPosInfosList.length;
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr()
		let ClientPos = RoomPosMgr.GetClientPos();
		let minPos = -1
		let minScore = 111110;
		for (let i = 0; i < playerNum; i++) {
			let posInfo = recordPosInfosList[i];
			let point = posInfo["point"];
			let player = RoomPosMgr.GetPlayerInfoByPos(posInfo["posIdx"]);
			if (posInfo["posIdx"] == ClientPos) {
				this.ShowSelf(point)
			}
			else{
				this.GetWndNode("playerAll/resultDetail" + i).getComponent(cc.Sprite).spriteFrame = this.frame
			}
			if (point < minScore) {
				minScore = point
				minPos = posInfo["posIdx"]
			}
			let name = player["name"].substring(0, 9);
			let pid = player["pid"];
			let sportsPoint = posInfo["sportsPoint"];
			let path = "playerAll/resultDetail" + i + "/user";
			this.SetWndProperty(path + "/name", "text", name);
			this.SetWndProperty(path + "/id", "text", "ID:" + this.ComTool.GetPid(pid));
			point = Math.floor(point*100)/100
			sportsPoint = Math.floor(sportsPoint*100)/100
			if (point >= 0) {
				this.SetWndProperty(path + "/score_win", "active", true);
				this.SetWndProperty(path + "/score_lose", "active", false);
				this.SetWndProperty(path + "/score_win", "text", "+" + point);
			} else {
				this.SetWndProperty(path + "/score_lose", "active", true);
				this.SetWndProperty(path + "/score_win", "active", false);
				this.SetWndProperty(path + "/score_lose", "text", point);
			}
			//竞技点
			//如果是联盟的房间显示继续游戏按钮
			if (0 != this.roomCfg.unionId) {
				this.SetWndProperty(path + "/score_win", "active", false);
				this.SetWndProperty(path + "/score_lose", "active", false);
				this.SetWndProperty(path + "/img_bsf", "active", true);
				if (posInfo["sportsPoint"] >= 0) {
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_win", "active", true);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_lose", "active", false);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_win", "text", "+" + sportsPoint.toFixed(2));
				} else {
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_win", "active", false);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_lose", "active", true);
					this.SetWndProperty(path + "/img_bsf/lb_sportsPoint_lose", "text", sportsPoint.toFixed(2));
				}
			} else {
				this.SetWndProperty(path + "/img_bsf", "active", false);
			}

			let headCom = this.GetWndComponent(path + "/head", this.gameName + "_WeChatHeadImage");
			headCom.onLoad();
			headCom.ShowHeroHead(pid);
			this.layout.children[i].active = true;
			this.playerNameList.push(name);

			let dunCard = this.node.getChildByName("playerAll").getChildByName("resultDetail" + i).getChildByName("UILSDunCards")
			dunCard.getComponent("UILSDunCards").resetAngle()
			let cards = []
			for (let index = 0; index < rankeds.length; index++) {
				if(rankeds[index].posIdx == posInfo["posIdx"]){
					var dunPos = rankeds[index].dunPos
					cards = dunPos.first.concat(dunPos.second).concat(dunPos.third)
					if(rankeds[index].isSpecial && rankeds[index].special > 0){
						app.playuissz.SetSpecailProperty(dunCard.getChildByName("img_special").getChildByName("special"),rankeds[index].special)
					}
					break
				}
			}
			for (let index = 0; index < pCard2.length; index++) {
				if(pCard2[index].isSpecial) continue
				if(pCard2[index].posIdx == posInfo["posIdx"]){
					dunCard.getComponent("UILSDunCards").showCardType(1, pCard2[index].card)
				}
			}
			for (let index = 0; index < pCard1.length; index++) {
				if(pCard1[index].isSpecial) continue
				if(pCard1[index].posIdx == posInfo["posIdx"]){
					dunCard.getComponent("UILSDunCards").showCardType(0, pCard1[index].card)
				}
			}
			for (let index = 0; index < pCard3.length; index++) {
				if(pCard3[index].isSpecial) continue
				if(pCard3[index].posIdx == posInfo["posIdx"]){
					dunCard.getComponent("UILSDunCards").showCardType(2, pCard3[index].card)
				}
			}
			for (let i = 1; i <= 13; i++) {
				let node = dunCard.getChildByName("dun_card" + i)
				app.playuissz.ShowResultCard(cards[i-1] || 0, node)
			}
		}
		this.node.getChildByName("btnList").getChildByName("btn_qiepai").active = (ClientPos == minPos)
	},
	//-----------------回调函数------------------

	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		cc.log(btnName)
		if (btnName == "btn_close" || btnName == "btn_exit") {
			this.OnClick_Close()
		} else if (btnName == "btn_continue") {
			if (app.playuissz) {
				app.playuissz.Click_btn_goon()
			}
			this.OnClick_Close()
		}else if (btnName == "btn_qiepai") {
			cc.log("切牌")
			if (app.playuissz) {
				app.playuissz.Click_btn_goon()
				app.playuissz.Click_btn_qiepai()
			}
			this.OnClick_Close()
		} else {
			console.error("OnClick(%s) not find btnName", btnName);
		}
	},
});