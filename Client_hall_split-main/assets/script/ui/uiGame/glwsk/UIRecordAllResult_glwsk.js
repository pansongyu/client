var app = require("app");
cc.Class({
	extends: require("BaseForm"),

	properties: {
		roomID: cc.Node,
		jushu: cc.Node,
		endTime: cc.Node,
		players: cc.Node,
		page_search: cc.EditBox,
		cardPrefab:cc.Prefab,
		icon_you: [cc.SpriteFrame],
		icon_rank: [cc.SpriteFrame],
	},
	 //获取控件节点
    GetProperty: function() {
    	this.rankscore1 = this.node.getChildByName("rankscore1");
    	this.rankscore2 = this.node.getChildByName("rankscore2");
    },
	OnCreateInit: function() {
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
		this.GetProperty();
	},
	OnShow: function(roomId, playerAll, gameType, unionId = 0) {
		this.gameType = this.ShareDefine.GametTypeID2PinYin[gameType];
		let path = "ui/uiGame/" + this.gameType + "/UIRecordAllResult_" + this.gameType;
		this.FormManager.ShowForm("UITop", path);
		this.playerAll = playerAll;
		this.roomId = roomId;
		this.unionId = unionId;
		this.getWndNodePath = "players";
		this.rankscore1.active = false;
		this.rankscore2.active = false;
		//动态生成节点
		// this.LoadPrefabByGameType();
		this.InitNode();
	},
	LoadPrefabByGameType: function() {
		let prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_winlost_child";
		let that = this;
		app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab)
			.then(function(prefab) {
				if (!prefab) {
					that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
					return;
				}
				that.InitNode(prefab);
			})
			.catch(function(error) {
				that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
			});
	},
	InitNode: function(prefab) {
		// let Player1Node = cc.instantiate(prefab);
		// this.nowChildName = Player1Node.name;
		// if (this.lastChildName != null && this.lastChildName == this.nowChildName &&
		// 	this.lastRoomId == this.roomId) {
		// 	//子节点跟之前一样，无需重新创建，直接return
		// 	//由于未结束的战绩会时时改变，所以不能return
		// 	// return;
		// }
		//清空之前的节点,生成新的节点
		this.lastChildName = this.nowChildName;
		this.lastRoomId = this.roomId;
		// this.DestroyAllChildren(this.players);
		// Player1Node.name = 'player1';
		// this.players.addChild(Player1Node);
		// this.InitPlayers();
		this.alldata = false;
		this.page = 1;
		this.maxpage = 0;
		this.NetManager.SendPack("game.CPlayerSetRoomRecord", {
			"roomID": this.roomId
		}, this.Event_GameRecord.bind(this));
	},
	InitPlayers: function() {
		let AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
		for (let i = 2; i <= this.playerAll.length; i++) {
			let PlayerSon = cc.instantiate(AddNode);
			PlayerSon.name = 'player' + i;
			PlayerSon.active = false;
			this.players.addChild(PlayerSon);
		}
	},
	ShowRoomInfo: function(roomEndResult) {
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
	Event_GameRecord: function(serverPack) {
		this.alldata = serverPack.pSetRoomRecords;
		this.maxpage = serverPack.pSetRoomRecords.length;
		this.playBackCode = serverPack.pSetRoomRecords[0].playbackCode;
		this.ShowData(this.page);
	},
	ShowData: function() {
		this.SetPageLabel();
		let data = this.Str2Json(this.alldata[this.page - 1].dataJsonRes);
		this.playBackCode = this.alldata[this.page - 1].playbackCode;
		let posEndList = data["posResultList"];
		this.dPos = data["dPos"]
		let winLostList = this.SortGroups(posEndList);
		this.InitShowPlayerInfo(winLostList);
		this.ShowRoomInfo(this.alldata[this.page - 1]);
		console.log("InitShowPlayerInfo", data);
	},
	//分组
	SortGroups: function (posResultList) {
		let allPosResultList = [];
		//按游数排序
		if(!this.CheckIsFenZu(posResultList)){
			let yiYouList = [];
			let erYouList = [];
			let sanYouList = [];
			let siYouList = [];
			let noList = [];
			for (let i = 0; i < posResultList.length; i++) {
				let endType = posResultList[i]["endType"];
				if (endType == "ONE") {
					yiYouList.push(posResultList[i]);
				} else if (endType == "TWO") {
					erYouList.push(posResultList[i]);
				} else if (endType == "THREE") {
					sanYouList.push(posResultList[i]);
				} else if (endType == "FOUR") {
					siYouList.push(posResultList[i]);
				} else{
					noList.push(posResultList[i]);
				}
			}
			allPosResultList = yiYouList.concat(erYouList, sanYouList, siYouList, noList);
			return allPosResultList;
		}

		
		//按分组排序
		let AList = [];
		let BList = [];
		for (let i = 0; i < posResultList.length; i++) {
			let ranksType = posResultList[i]["ranksType"];
			if (ranksType == 1) {
				AList.push(posResultList[i]);
			} else {
				BList.push(posResultList[i]);
			}
		}
		this.rankscore1.active = true;
		this.rankscore1.getChildByName("jifen").getComponent(cc.Label).string = AList[0].zongPoint;
		this.rankscore1.getChildByName("point").getComponent(cc.Label).string = AList[0].setAllPoint;
		if(typeof(AList[0].sportsPoint) != "undefined"){
			this.rankscore1.getChildByName("sportspoint").getComponent(cc.Label).string = AList[0].sportsPoint;
		}else{
			this.rankscore1.getChildByName("sportspoint").getComponent(cc.Label).string = "";
		}

		this.rankscore2.active = true;
		this.rankscore2.getChildByName("jifen").getComponent(cc.Label).string = BList[0].zongPoint;
		this.rankscore2.getChildByName("point").getComponent(cc.Label).string = BList[0].setAllPoint;
		if(typeof(BList[0].sportsPoint) != "undefined"){
			this.rankscore2.getChildByName("sportspoint").getComponent(cc.Label).string = BList[0].sportsPoint;
		}else{
			this.rankscore2.getChildByName("sportspoint").getComponent(cc.Label).string = "";
		}

		allPosResultList = AList.concat(BList);
		return allPosResultList;
	},
	SetPageLabel: function() {
		this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
		this.SetWndProperty("page2/editbox_page", "text", this.page);
	},
	InitShowPlayerInfo: function(posEndList) {
		//隐藏节点
		for (let i = 0; i < this.players.children.length; i++) {
			this.players.children[i].active = false;
		}

		for (let i = 0; i < posEndList.length; i++) {
			let PlayerNode = this.players.children[i];
			let pos = posEndList[i].pos;
			let playerInfo = this.playerAll[pos];
			//显示玩家姓名
			PlayerNode.getChildByName("userInfo").getChildByName('lb_name').getComponent(cc.Label).string = playerInfo["name"].substring(0,5) + "...";
			let WeChatHeadImage = PlayerNode.getChildByName("userInfo").getChildByName('head').getComponent("WeChatHeadImage");
			WeChatHeadImage.onLoad();
			WeChatHeadImage.ShowHeroHead(playerInfo["pid"]);
			//显示分组
			if(!this.CheckIsFenZu(posEndList)){
				PlayerNode.getChildByName("userInfo").getChildByName('rankstype').getComponent(cc.Sprite).spriteFrame = "";
			}else{
				let ranksType = posEndList[i].ranksType; //游数  0为默认值
				if(ranksType == 0){
					PlayerNode.getChildByName("userInfo").getChildByName('rankstype').getComponent(cc.Sprite).spriteFrame = "";
				}else{
					PlayerNode.getChildByName("userInfo").getChildByName('rankstype').getComponent(cc.Sprite).spriteFrame = this.icon_rank[ranksType - 1];
				}
			}
			PlayerNode.getChildByName("userInfo").getChildByName('zhuang').active = (this.dPos == pos);

			//显示剩余手牌
			let shouCard = posEndList[i].shouCard;
			let layout = PlayerNode.getChildByName("shoucard").getChildByName("layout");
			layout.removeAllChildren();
			this.AddShouCard(layout, shouCard);
			
			if(shouCard.length > 0){
				PlayerNode.getChildByName("userInfo").getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[3];
			}else{
				//显示头游
				let endType = posEndList[i].endType; //游数  0为默认值
				let finishOrder = 0;
				if (endType == "ONE") {
					finishOrder = 1;
				} else if (endType == "TWO") {
					finishOrder = 2;
				} else if (endType == "THREE") {
					finishOrder = 3;
				} else if (endType == "FOUR") {
					finishOrder = 4;
				} else {
					finishOrder = -1;
				}
				if (finishOrder > 0) {
					PlayerNode.getChildByName("userInfo").getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[finishOrder - 1];
				} else {
					PlayerNode.getChildByName("userInfo").getChildByName('you').getComponent(cc.Sprite).spriteFrame = '';
				}
			}
			//分数
			let record = PlayerNode.getChildByName('record');
			let tip6 = this.node.getChildByName("tipNode").getChildByName("tip6");
			//根据分组判断是否显示总积分
			record.getChildByName("jifen").active = !this.CheckIsFenZu(posEndList);
			record.getChildByName("jifen").getComponent(cc.Label).string = this.GetPointValues(posEndList[i].zongPoint);
			record.getChildByName("paimianfen").getComponent(cc.Label).string = this.GetPointValues(posEndList[i].paiMianPoint);
			record.getChildByName("jiangfafen").getComponent(cc.Label).string = this.GetPointValues(posEndList[i].jiangFaPoint);

			record.getChildByName("point").active = !this.CheckIsFenZu(posEndList);
			record.getChildByName("point").getComponent(cc.Label).string = this.GetPointValues(posEndList[i].setAllPoint);

			record.getChildByName("sportspoint").active = !this.CheckIsFenZu(posEndList);
			if(typeof(posEndList[i].sportsPoint) != "undefined"){
				tip6.active = true;
				record.getChildByName("sportspoint").getComponent(cc.Label).string = this.GetPointValues(posEndList[i].sportsPoint);
			}else{
				tip6.active = false;
				record.getChildByName("sportspoint").getComponent(cc.Label).string = "";
			}

			// if (posEndList[i].pos == clientPos) {
			// 	if (posEndList[i].point > 0) {
			// 		this.PlayGameSound("win");
			// 	} else if (posEndList[i].point < 0) {
			// 		this.PlayGameSound("lost");
			// 	}

			// }
			PlayerNode.active = true;
		}
	},
	GetPointValues:function(point){
		if(point > 0){
			return "+" + point;
		}
		return point;
	},
	CheckIsFenZu: function(posEndList){
		if(posEndList[0].ranksType == 0){
			return false;
		}
		return true;
	},
	AddShouCard:function(node, cardList){
		this.SortCardByMax(cardList);
		for (let i = 0; i < cardList.length; i++) {
			let cardValue = cardList[i];
			let cardNode = cc.instantiate(this.cardPrefab);
			cardNode.active = true;
			this.GetPokeCard(cardValue, cardNode);
			node.addChild(cardNode);
		}
	},
	SortCardByMax: function (pokers) {
		let self = this;
		pokers.sort(function (a, b) {
			//return (b&0x0F) - (a&0x0F);
			return self.GetCardValue(b) - self.GetCardValue(a);
		});
	},
	//---------点击函数---------------------
	OnClick: function(btnName, btnNode) {
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
	OnPack_VideoData: function(serverPack) {
		// let gameName = app.ShareDefine().GametTypeID2PinYin[serverPack];
		app.Client.VideoCheckSubGame(serverPack.Name.toLowerCase(), this.playBackCode);
	},
	OnVideoFailed: function(serverPack) {
		app.SysNotifyManager().ShowSysMsg("MSG_REPLAY_ERROR");
	},
	Click_btn_Share: function() {
		let heroName = app.HeroManager().GetHeroProperty("name");
		let gameId = app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()];
		let gameName = app.ShareDefine().GametTypeID2Name[gameId];
		let title = "回放码为【" + this.playBackCode + "】";
		let desc = "【" + heroName + "】邀请您观看【" + gameName + "】中牌局回放记录";

		let heroID = app.HeroManager().GetHeroProperty("pid");
		let cityId = app.HeroManager().GetHeroProperty("cityId");
		let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl") + heroID + "&cityid=" + cityId;

		console.log("回放码==" + this.playBackCode);
		this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
	},
	Str2Json: function(jsondata) {
		if (jsondata === "") {
			return false;
		}
		var json = JSON.parse(jsondata);
		return json;
	},
	GetPokeCard: function(poker, cardNode) {
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
		} else if (cardColor == 64) { //双数小鬼   0x42-0x4e
			numNode.active = false; //2,3,4,5,6,7,8,9,a
			if (cardValue % 2 == 0) { //双数小鬼
				type1 = "icon_small_king_01";
				type2 = "icon_small_king";
			} else if (cardValue % 2 == 1) { //单数大鬼
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
	GetCardValue: function(poker) {
		return poker & this.PokerCard.LOGIC_MASK_VALUE;
	},

	//获取花色
	GetCardColor: function(poker) {
		while (poker >= 80) {
			poker -= 80;
		}
		let color = poker & this.PokerCard.LOGIC_MASK_COLOR;
		return color;
	},
});