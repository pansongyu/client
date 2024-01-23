var app = require("app");
cc.Class({
	extends: require("BaseForm"),

	properties: {
		roomID: cc.Node,
		jushu: cc.Node,
		endTime: cc.Node,
		players: cc.Node,
		cardPrefab: cc.Prefab,
		page_search: cc.EditBox,
	},

	OnCreateInit: function () {
		this.FormManager = app.FormManager();
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.SDKManager = app.SDKManager();
		this.NetManager = app.NetManager();
		this.WeChatManager = app.WeChatManager();
		this.PokerCard = app.PokerCard();
		this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
		this.RegEvent("GameRecord", this.Event_GameRecord, this);
		this.lastChildName = null;
		this.lastRoomId = 0;
	},
	OnShow: function (roomId, playerAll, gameType, unionId = 0) {
		this.gameType = this.ShareDefine.GametTypeID2PinYin[gameType];
		let path = "ui/uiGame/" + this.gameType + "/UIRecordAllResult_" + this.gameType;
		this.FormManager.ShowForm("UITop", path);

		this.playerAll = playerAll;
		this.roomId = roomId;
		this.unionId = unionId;
		this.getWndNodePath = "players";
		//动态生成节点
		this.LoadPrefabByGameType();
	},
	LoadPrefabByGameType: function () {
		let prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_winlost_child";
		let that = this;
		app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab)
			.then(function (prefab) {
				if (!prefab) {
					that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
					return;
				}
				that.InitNode(prefab);
			})
			.catch(function (error) {
					that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
				}
			);
	},
	InitNode: function (prefab) {
		let Player1Node = cc.instantiate(prefab);
		this.nowChildName = Player1Node.name;
		if (this.lastChildName != null && this.lastChildName == this.nowChildName
			&& this.lastRoomId == this.roomId) {
			//子节点跟之前一样，无需重新创建，直接return
			//由于未结束的战绩会时时改变，所以不能return
			// return;
		}
		//清空之前的节点,生成新的节点
		this.lastChildName = this.nowChildName;
		this.lastRoomId = this.roomId;
		this.DestroyAllChildren(this.players);
		Player1Node.name = 'player1';
		this.players.addChild(Player1Node);
		this.InitPlayers();
		this.alldata = false;
		this.page = 1;
		this.maxpage = 0;
		this.NetManager.SendPack("game.CPlayerSetRoomRecord", {"roomID": this.roomId}, this.Event_GameRecord.bind(this));
	},
	InitPlayers: function () {
		let AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
		for (let i = 2; i <= this.playerAll.length; i++) {
			let PlayerSon = cc.instantiate(AddNode);
			PlayerSon.name = 'player' + i;
			PlayerSon.active = false;
			this.players.addChild(PlayerSon);
		}
	},
	ShowRoomInfo: function (roomEndResult) {
		let setID = roomEndResult["setID"];
		let time = roomEndResult["endTime"];
		if (setID > 0) {
			this.jushu.active = true;
			this.jushu.getComponent(cc.Label).string = "第" + setID + "局";
		} else {
			this.jushu.active = false;
		}

		this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);
		if (this.playBackCode > 0) {
			this.node.getChildByName('btn_replay').active = true;
			this.node.getChildByName('btn_share').active = true;
			this.endTime.parent.getChildByName("backCode").getComponent(cc.Label).string = "回放码:" + this.playBackCode;
			cc.find('btn_replay', this.node).actvie = true;
		} else {
			this.node.getChildByName('btn_replay').active = false;
			this.node.getChildByName('btn_share').active = false;
			this.endTime.parent.getChildByName("backCode").getComponent(cc.Label).string = "";
			cc.find('btn_replay', this.node).actvie = false;
		}
	},
	Event_GameRecord: function (serverPack) {
		this.alldata = serverPack.pSetRoomRecords;
		this.maxpage = serverPack.pSetRoomRecords.length;
		this.playBackCode = serverPack.pSetRoomRecords[0].playbackCode;
		this.ShowData(this.page);
	},
	ShowData: function () {
		this.SetPageLabel();
		let data = this.Str2Json(this.alldata[this.page - 1].dataJsonRes);
		this.playBackCode = this.alldata[this.page - 1].playbackCode;
		this.InitShowPlayerInfo(data);
		this.ShowRoomInfo(this.alldata[this.page - 1]);
		console.log("InitShowPlayerInfo", data);
	},
	SetPageLabel: function () {
		this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
		this.SetWndProperty("page2/editbox_page", "text", this.page);
	},
	InitShowPlayerInfo: function (setEnd) {
		let dPos = setEnd["dPos"];
		for (let i = 0; i < this.playerAll.length; i++) {
			let PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (i + 1));
			if (PlayerNode) {
				PlayerNode.active = false;
			} else {
				break;
			}
		}
		let posResultList = setEnd.posResultList;
		let count = 0;
		for (let i = 0; i < posResultList.length; i++) {
			if (!posResultList[i].pid) continue;
			let PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (count + 1));
			PlayerNode.active = true;
			PlayerNode.getComponent(this.nowChildName).ShowPlayerData(setEnd, this.playerAll, i, dPos);
			count++;
		}
	},
	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_close") {
			this.CloseForm();
		} else if (btnName == "btn_last") {
			if (this.page == 1) {
				app.SysNotifyManager().ShowSysMsg("NowFirstPage");
				return;
			}
			this.page -= 1;
			this.ShowData();
		} else if (btnName == "btn_next") {
			if (this.page == this.maxpage) {
				app.SysNotifyManager().ShowSysMsg("NowLastPage");
				return;
			}
			this.page += 1;
			this.ShowData();
		} else if (btnName == "btn_share") {
			this.Click_btn_Share();
		} else if (btnName == "btn_replay") {
			this.NetManager.SendPack("game.CPlayerPlayBack", {
				"playBackCode": this.playBackCode,
				"chekcPlayBackCode": true
			}, this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
			return;
		} else if (btnName == "btn_search") {
			if (isNaN(this.page_search.string) == true) {
				return false;
			}
			let page_search = parseInt(this.page_search.string);
			if (page_search < 1) {
				this.page = 1;
			} else if (page_search >= this.maxpage) {
				this.page = this.maxpage;
			} else {
				this.page = page_search;
			}
			this.ShowData();
		} else {
			this.ErrLog("OnClick not find btnName", btnName);
		}
	},
	OnPack_VideoData: function (serverPack) {
		// let gameName = app.ShareDefine().GametTypeID2PinYin[serverPack];
		app.Client.VideoCheckSubGame(serverPack.Name.toLowerCase(), this.playBackCode);
	},
	OnVideoFailed: function (serverPack) {
		app.SysNotifyManager().ShowSysMsg("MSG_REPLAY_ERROR");
	},
	Click_btn_Share: function () {
		let heroName = app.HeroManager().GetHeroProperty("name");
		let gameId = app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()];
		let gameName = app.ShareDefine().GametTypeID2Name[gameId];
		let title = "回放码为【" + this.playBackCode + "】";
		let desc = "【" + heroName + "】邀请您观看【" + gameName + "】中牌局回放记录";	    

		let heroID = app.HeroManager().GetHeroProperty("pid");
        let cityId=app.HeroManager().GetHeroProperty("cityId");
	    let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl")+heroID+"&cityid="+cityId;
	    
		console.log("回放码==" + this.playBackCode);
		this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
	},
	Str2Json: function (jsondata) {
		if (jsondata === "") {
			return false;
		}
		var json = JSON.parse(jsondata);
		return json;
	},
	GetPokeCard: function (poker, cardNode) {
		if (0 == poker) {
			return;
		}
		let type = "";
		let type1 = "";
		let type2 = "";
		let num = "";
		let cardColor = this.GetCardColor(poker);
		let cardValue = this.GetCardValue(poker);
		let numNode = cardNode.getChildByName("num");
		numNode.active = true;
		if (cardValue == 15) {
			cardValue = 2;
		}
		if (cardColor == 0) {
			type = "bg_diamond1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_red_" + cardValue;
				// type1 = "";
				// type2 = "bg_diamond_" + cardValue;
			}
			num = "red_" + cardValue;
		} else if (cardColor == 16) {
			type = "bg_club1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_blue_" + cardValue;
				// type1 = "";
				// type2 = "bg_club_" + cardValue;
			}
			num = "black_" + cardValue;
		} else if (cardColor == 32) {
			type = "bg_heart1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_red_" + cardValue;
				// type1 = "";
				// type2 = "bg_heart_" + cardValue;
			}
			num = "red_" + cardValue;
		} else if (cardColor == 48) {
			type = "bg_spade1_";
			type1 = type + 1;
			type2 = type + 2;
			// if (cardValue > 10) {
			if (cardValue > 10 && cardValue < 14) {
				type2 = "bg_blue_" + cardValue;
				// type1 = "";
				// type2 = "bg_spade_" + cardValue;
			}
			num = "black_" + cardValue;
		} else if (cardColor == 64) {//双数小鬼   0x42-0x4e
			numNode.active = false;//2,3,4,5,6,7,8,9,a
			if (cardValue % 2 == 0) {//双数小鬼
				type1 = "icon_small_king_01";
				type2 = "icon_small_king";
			} else if (cardValue % 2 == 1) {//单数大鬼
				type1 = "icon_big_king_01";
				type2 = "icon_big_king";
			}
		}
		let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
		let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
		let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
		numSp.spriteFrame = this.PokerCard.pokerDict[num];
		iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
		icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
	},
	//获取牌值
	GetCardValue: function (poker) {
		return poker & this.PokerCard.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function (poker) {
		while (poker >= 80) {
			poker -= 80;
		}
		let color = poker & this.PokerCard.LOGIC_MASK_COLOR;
		return color;
	},
});