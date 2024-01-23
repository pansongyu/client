(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/sse/UIRecordAllResult_sse.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1b04bYSxDhMepKDsD4uJDEF', 'UIRecordAllResult_sse', __filename);
// script/ui/uiGame/sse/UIRecordAllResult_sse.js

"use strict";

var app = require("app");
cc.Class({
	extends: require("BaseForm"),

	properties: {
		roomID: cc.Node,
		jushu: cc.Node,
		endTime: cc.Node,

		MJPlayers: cc.Node,

		page_search: cc.EditBox
	},

	OnCreateInit: function OnCreateInit() {
		this.FormManager = app.FormManager();
		this.ComTool = app.ComTool();
		this.SDKManager = app.SDKManager();
		this.NetManager = app.NetManager();
		this.WeChatManager = app.WeChatManager();
		this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
		this.RegEvent("GameRecord", this.Event_GameRecord, this);
		this.lastChildName = null;
		this.lastRoomId = 0;
		//加载麻将资源，防止异步坑爹的bug
		this.LoadAllImages();
	},
	LoadAllImages: function LoadAllImages() {
		var _this = this;

		var i = 11;

		var _loop = function _loop() {
			var imageName = ["EatCard_Self_", i].join("");
			var imageInfo = _this.IntegrateImage[imageName];
			if (!imageInfo) {
				return "continue";
			}
			if (app['majiang_' + imageName]) {
				return "continue";
			}
			var imagePath = imageInfo["FilePath"];
			var that = _this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenMaJiang(%s) load spriteFrame fail", imagePath);
					return;
				}
				//记录精灵图片对象
				app['majiang_' + imageName] = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenMaJiang(%s) error:%s", imagePath, error.stack);
			});
		};

		for (; i <= 58; i++) {
			var _ret = _loop();

			if (_ret === "continue") continue;
		}
	},
	OnShow: function OnShow(roomId, playerAll, gameType) {
		var unionId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var roomKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
		var defaultPage = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

		this.page = defaultPage;
		this.gameType = this.ShareDefine.GametTypeID2PinYin[gameType];
		var path = "ui/uiGame/" + this.gameType + "/UIRecordAllResult_" + this.gameType;
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
	LoadPrefabByGameType: function LoadPrefabByGameType() {
		var prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_winlost_child";
		var that = this;
		app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab).then(function (prefab) {
			if (!prefab) {
				that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
				return;
			}
			that.InitNode(prefab);
		}).catch(function (error) {
			that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
		});
	},
	InitNode: function InitNode(prefab) {
		var Player1Node = cc.instantiate(prefab);
		this.nowChildName = Player1Node.name;
		if (this.lastChildName != null && this.lastChildName == this.nowChildName && this.lastRoomId == this.roomId) {}
		//子节点跟之前一样，无需重新创建，直接return
		//由于未结束的战绩会时时改变，所以不能return
		// return;

		//清空之前的节点,生成新的节点
		this.lastChildName = this.nowChildName;
		this.lastRoomId = this.roomId;
		//this.Players.removeAllChildren();
		this.DestroyAllChildren(this.Players);
		Player1Node.name = 'player1';
		this.Players.addChild(Player1Node);

		if (this.MJPlayers.active) {
			//添加手牌
			var ShowCardNode = this.GetWndNode(this.getWndNodePath + '/player1/showcard');
			var sp_in = ShowCardNode.getChildByName('sp_in');
			for (var i = 1; i <= this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount']; i++) {
				var cardNode = cc.instantiate(sp_in);
				cardNode.name = this.ComTool.StringAddNumSuffix("card", i /*Math.abs(i - (this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount'] + 1))*/, 2);
				ShowCardNode.addChild(cardNode);
			}
			ShowCardNode.getChildByName("sp_in").zIndex = 26;
			ShowCardNode.getChildByName("empty").zIndex = 25;
			//添加吃牌
			var DownCardNode = this.GetWndNode(this.getWndNodePath + '/player1/downcard');
			var downNode01 = DownCardNode.getChildByName('down01');
			for (var _i = 2; _i <= 8; _i++) {
				var downNode = cc.instantiate(downNode01);
				downNode.name = this.ComTool.StringAddNumSuffix("down", _i, 2);
				DownCardNode.addChild(downNode);
			}
		}
		this.InitPlayers();
		this.alldata = false;
		this.maxpage = 0;
		this.NetManager.SendPack("game.CPlayerSetRoomRecord", { "roomID": this.roomId }, this.Event_GameRecord.bind(this));
	},
	InitPlayers: function InitPlayers() {
		var AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
		for (var i = 2; i <= this.playerAll.length; i++) {
			var PlayerSon = cc.instantiate(AddNode);
			PlayerSon.name = 'player' + i;
			PlayerSon.active = false;
			this.Players.addChild(PlayerSon);
		}
	},
	ShowRoomInfo: function ShowRoomInfo(roomEndResult) {
		var setID = roomEndResult["setID"];
		var time = roomEndResult["endTime"];
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
		var dataJsonRes = roomEndResult.dataJsonRes,
		    roomID = roomEndResult.roomID;

		try {
			dataJsonRes = JSON.parse(dataJsonRes);

			var roomKeyStr = "";
			if (this.roomKey != null) {
				roomKeyStr = "房间号:" + this.roomKey;
			}
			if (dataJsonRes['currentCirCle'] != null) {
				this.jushu.getComponent(cc.Label).string = roomKeyStr + ("\u7B2C" + dataJsonRes['setId'] + "\u5C40 \u7B2C" + dataJsonRes['currentCirCle'] + "\u624B");
			}
		} catch (e) {
			console.error(e);
		}
	},

	Event_GameRecord: function Event_GameRecord(serverPack) {
		this.alldata = serverPack.pSetRoomRecords;
		this.maxpage = serverPack.pSetRoomRecords.length;
		this.playBackCode = serverPack.pSetRoomRecords[0].playbackCode;
		this.ShowData(this.page);
	},
	ShowData: function ShowData() {
		this.SetPageLabel();
		var data = this.Str2Json(this.alldata[this.page - 1].dataJsonRes);
		this.playBackCode = this.alldata[this.page - 1].playbackCode;
		this.InitShowPlayerInfo(data);
		this.ShowRoomInfo(this.alldata[this.page - 1]);
	},
	SetPageLabel: function SetPageLabel() {
		this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
		this.SetWndProperty("page2/editbox_page", "text", this.page);
	},
	InitShowPlayerInfo: function InitShowPlayerInfo(setEnd) {
		for (var i = 0; i < this.playerAll.length; i++) {
			var PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (i + 1));
			if (PlayerNode) {
				PlayerNode.active = false;
			} else {
				break;
			}
		}
		var posResultList = setEnd.posResultList;
		var count = 0;
		for (var _i2 = 0; _i2 < posResultList.length; _i2++) {
			if (!posResultList[_i2].pid) continue;
			var _PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (count + 1));
			_PlayerNode.active = true;
			_PlayerNode.getComponent(this.nowChildName).ShowPlayerData(setEnd, this.playerAll, _i2);
			count++;
		}
	},
	ShowImage: function ShowImage(btnNode, cardID) {
		var imageName = ["EatCard_Self_", Math.floor(cardID / 100)].join("");
		var imageInfo = this.IntegrateImage[imageName];
		if (imageInfo) {
			var _imagePath = imageInfo["FilePath"];
			var _that = this;
			app.ControlManager().CreateLoadPromise(_imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					console.error("ShowImage(%s) load spriteFrame fail", _imagePath);
					return;
				}
				var wndSprite = btnNode.getComponent(cc.Sprite);
				wndSprite.spriteFrame = spriteFrame;
			}).catch(function (error) {
				console.error("ShowImage(%s) error:%s", _imagePath, error.stack);
			});
		} else {
			console.error('failed load imageName%s', imageName, cardID);
			return;
		}
	},
	//---------点击函数---------------------
	OnClick: function OnClick(btnName, btnNode) {
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
			var page_search = parseInt(this.page_search.string);
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
	OnPack_VideoData: function OnPack_VideoData(serverPack) {
		//记录当前的switchData,退出的时候要调用
		var switchRecord = {
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
	OnVideoFailed: function OnVideoFailed(serverPack) {
		app.SysNotifyManager().ShowSysMsg("MSG_REPLAY_ERROR");
	},
	Click_btn_Share: function Click_btn_Share() {
		var heroName = app.HeroManager().GetHeroProperty("name");
		var gameId = app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()];
		var gameName = app.ShareDefine().GametTypeID2Name[gameId];
		var title = "回放码为【" + this.playBackCode + "】";
		var desc = "【" + heroName + "】邀请您观看【" + gameName + "】中牌局回放记录";
		var heroID = app.HeroManager().GetHeroProperty("pid");
		var cityId = app.HeroManager().GetHeroProperty("cityId");
		var weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl") + heroID + "&cityid=" + cityId;
		console.log("回放码==" + this.playBackCode);
		this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
	},
	Str2Json: function Str2Json(jsondata) {
		if (jsondata === "") {
			return false;
		}
		var json = JSON.parse(jsondata);
		return json;
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
        //# sourceMappingURL=UIRecordAllResult_sse.js.map
        