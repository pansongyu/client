var app = require("app");
cc.Class({
	extends: require("BaseForm"),

	properties: {
		roomID: cc.Node,
		jushu: cc.Node,
		endTime: cc.Node,

		MJPlayers: cc.Node,


		page_search: cc.EditBox,
	},

	OnCreateInit: function () {
		this.FormManager = app.FormManager();
		this.ComTool = app.ComTool();
		this.SDKManager = app.SDKManager();
		this.NetManager = app.NetManager();
		this.WeChatManager = app.WeChatManager();
		this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
		this.RegEvent("GameRecord", this.Event_GameRecord, this);
		this.lastChildName = null;
		this.lastRoomId = 0;
		this.bg_niaopai = this.node.getChildByName("bg_niaopai");
		//加载麻将资源，防止异步坑爹的bug
		this.LoadAllImages();
	},
	LoadAllImages: function () {
		let i = 11;
		for (; i <= 58; i++) {
			let imageName = ["EatCard_Self_", i].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (!imageInfo) {
				continue;
			}
			if (app['majiang_' + imageName]) {
				continue;
			}
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenMaJiang(%s) load spriteFrame fail", imagePath);
					return;
				}
				//记录精灵图片对象
				app['majiang_' + imageName] = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenMaJiang(%s) error:%s", imagePath, error.stack);
			})
		}
	},
	OnShow: function (roomId, playerAll, gameType, unionId = 0, roomKey = null, defaultPage = 1) {
		this.page = defaultPage;
		this.gameType = this.ShareDefine.GametTypeID2PinYin[gameType];
		let path = "ui/uiGame/" + this.gameType + "/UIRecordAllResult_" + this.gameType;
		this.FormManager.ShowForm("UITop", path);
		this.gameTypeID = gameType;
		this.gameType = app.ShareDefine().GametTypeID2PinYin[gameType];
		this.playerAll = playerAll;
		this.roomId = roomId;
		this.unionId = unionId;
		this.roomKey = roomKey;
		this.MJPlayers.active = true;
		this.Players = this.MJPlayers;
		this.getWndNodePath = "MJPlayers";

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
		//this.Players.removeAllChildren();
		this.DestroyAllChildren(this.Players);
		Player1Node.name = 'player1';
		this.Players.addChild(Player1Node);


		if (this.MJPlayers.active) {
			//添加手牌
			let ShowCardNode = this.GetWndNode(this.getWndNodePath + '/player1/showcard');
			let sp_in = ShowCardNode.getChildByName('sp_in');
			for (let i = 1; i <= this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount']; i++) {
				let cardNode = cc.instantiate(sp_in);
				cardNode.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - (this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount'] + 1)), 2);
				ShowCardNode.addChild(cardNode);
			}
			//添加吃牌
			let DownCardNode = this.GetWndNode(this.getWndNodePath + '/player1/downcard');
			let downNode01 = DownCardNode.getChildByName('down01');
			for (let i = 2; i <= 5; i++) {
				let downNode = cc.instantiate(downNode01);
				downNode.name = this.ComTool.StringAddNumSuffix("down", i, 2);
				DownCardNode.addChild(downNode);
			}
		}
		this.InitPlayers();
		this.alldata = false;
		this.maxpage = 0;
		this.NetManager.SendPack("game.CPlayerSetRoomRecord", {"roomID": this.roomId}, this.Event_GameRecord.bind(this));
	},
	InitPlayers: function () {
		let AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
		for (let i = 2; i <= this.playerAll.length; i++) {
			let PlayerSon = cc.instantiate(AddNode);
			PlayerSon.name = 'player' + i;
			PlayerSon.active = false;
			this.Players.addChild(PlayerSon);
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
		//第几局 第几轮
		let {dataJsonRes, roomID} = roomEndResult;
		try {
			dataJsonRes = JSON.parse(dataJsonRes);
			
			let roomKeyStr = "";
			if (this.roomKey != null) {
				roomKeyStr = "房间号:" + this.roomKey;
			}
			if (dataJsonRes['currentCirCle'] != null) {
				this.jushu.getComponent(cc.Label).string = roomKeyStr + `第${dataJsonRes['setId']}局 第${dataJsonRes['currentCirCle']}手`;
			}
		} catch (e) {
			console.error(e);
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
	},
	SetPageLabel: function () {
		this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
		this.SetWndProperty("page2/editbox_page", "text", this.page);
	},
	InitShowPlayerInfo: function (setEnd) {
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
			PlayerNode.getComponent(this.nowChildName).ShowPlayerData(setEnd, this.playerAll, i);
			count++;
		}
		let maList = setEnd["zhuaMaList"] || [];
		this.ShowNiaoPai(maList);

	},
	ShowNiaoPai: function (cardIDList) {
		if(cardIDList.length==0){
			this.bg_niaopai.active=false;
			return;
		}
		this.bg_niaopai.active=true;
		let niaopaiNode = this.bg_niaopai.getChildByName("niaopai");
		for(let i=0;i<niaopaiNode.children.length;i++){
			niaopaiNode.children[i].active=false;
		}
		for (let i = 0; i < cardIDList.length; i++) {
			let node = niaopaiNode.getChildByName("card" + (i + 1));
			this.ShowImage(node, Math.floor(cardIDList[i] / 100));
			node.active = true;
		}

	},
	ShowImage: function (btnNode, cardID) {
		let imageName = ["EatCard_Self_", cardID].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (imageInfo) {
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						console.error("ShowImage(%s) load spriteFrame fail", imagePath);
						return;
					}
					let wndSprite = btnNode.getComponent(cc.Sprite);
					wndSprite.spriteFrame = spriteFrame;
				})
				.catch(function (error) {
					console.error("ShowImage(%s) error:%s", imagePath, error.stack);
				})
		}
		else {
			console.error('failed load imageName%s', imageName, cardID);
			return;
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
		//记录当前的switchData,退出的时候要调用
		let switchRecord = {
			action: "OpenUIRecordAllResult",
			playerAll: this.playerAll,
			roomId: this.roomId,
			unionId: this.unionId,
			roomKey: this.roomKey,
			gameType: this.gameTypeID,
			page: this.page
		};
		cc.sys.localStorage.setItem("switchRecord", JSON.stringify(switchRecord));
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
		let cityId = app.HeroManager().GetHeroProperty("cityId");
		let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl") + heroID + "&cityid=" + cityId;
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
});
