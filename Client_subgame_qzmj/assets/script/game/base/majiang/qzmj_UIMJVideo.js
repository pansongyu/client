var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		bg_jinpai: cc.Node,
		bg_jinpai2: cc.Node,
		seat01: cc.Node,
		seat02: cc.Node,
		seat03: cc.Node,
		seat04: cc.Node,
		nd_out01: cc.Prefab,
		nd_out02: cc.Prefab,
		nd_out03: cc.Prefab,
		nd_out04: cc.Prefab,
		touxiang1: cc.Node,
		touxiang2: cc.Node,
		touxiang3: cc.Node,
		touxiang4: cc.Node,
		help_seat01: cc.Animation,
		help_seat02: cc.Animation,
		help_seat03: cc.Animation,
		help_seat04: cc.Animation,
		control_list: cc.Node,
		KaiJinEffect: cc.Node,
		kaijin1: cc.Node,
		kaijin2: cc.Node,
		wanfa: cc.Label,
	},

	OnCreateInit: function () {
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.WeChatManager = app[app.subGameName + "_WeChatManager"]();
		this.NetManager.RegNetPack("SPlayer_PlayBackData", this.OnPack_PlayBackData, this);
		this.KaiJinEffect.getComponent(cc.Animation).on('finished', this.KaiJinFinished, this);
		this.InitDownCard();
		this.InitShowCard();
		this.curTabId = 0;
		this.curRoomID = 0;
	},

	OnShow: function () {
		let switchGameData = cc.sys.localStorage.getItem("switchGameData");
		let playBackCode = JSON.parse(switchGameData).backCode;
		this.GetPlayBackDataByCode(playBackCode);
	},

	GetPlayBackDataByCode: function (playBackCode) {
		this.wanfa.string = "";
		this.HideTouXiang();
		this.HideJin();
		this.HideSeat();
		this.jin1 = -1;
		this.jin2 = -1;
		this.jinJin = -1;
		this.playerList = false;  //玩家列表
		this.playerCount = 0;    //玩家个数
		this.playkey = 0;       //回放帧
		this.playBack = false;  //回放日志
		this.NextPlayTime = 0;   //下帧播放时间
		this.pause = false;      //暂停
		this.fadeOutTime = 5;    //淡出时间
		this.dPos = -1;   //庄家
		this.minplay = 0;  //快退最多能退到的帧数
		this.PlayBackList = new Array();
		this.NetManager.SendPack("game.CPlayerPlayBack", {
			"playBackCode": playBackCode,
			"chekcPlayBackCode": false
		}, this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
	},

	OnVideoFailed: function (serverPack) {
		this.SetWndProperty("UIMessageNoExist", "active", true);
	},
	OnPack_PlayBackData: function (serverPack) {
		let playBackNum = serverPack.playBackNum;
		let key = serverPack.id;
		this.PlayBackList[key] = serverPack.msg;
		if (this.PlayBackList.length == playBackNum) {
			let PlayBackJson = '';
			for (let i = 0; i < playBackNum; i++) {
				PlayBackJson += this.PlayBackList[i];
			}
			let playBack = eval('(' + PlayBackJson + ')');
			this.playBack = playBack.playbackList;
			this.NextPlayTime = Math.round(new Date().getTime() / 1000) - 1;
			this.schedule(this.Play, 0.5);
		}
	},
	OnPack_VideoData: function (serverPack) {
		this.playerList = this.Str2Json(serverPack.playerList);
		this.dPos = serverPack.dPos;
		this.playerCount = this.playerList.length;
		let roomKey = serverPack.roomKey;
		let setID = serverPack.setID;
		let setAll = serverPack.setCount;
		this.curRoomID = serverPack.roomID;
		this.curTabId = serverPack.tabId;
		this.SetRoomInfo(this.playerCount, roomKey, setID, setAll);
		this.ShowPlayerInfo(this.playerList);
		this.InitAllNdOut();
	},
	InitDownCard: function () {
		//位置一
		let downcard01 = this.seat01.getChildByName('downcard');
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(downcard01.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			downcard01.addChild(down_node);
		}
		//位置二
		let downcard02 = this.seat02.getChildByName('downcard');
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(downcard02.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			down_node.x = 200 - (i - 1) * 30;
			downcard02.addChild(down_node);
		}
		//位置三
		let downcard03 = this.seat03.getChildByName('downcard');
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(downcard03.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			downcard03.addChild(down_node);
		}
		//位置四
		let downcard04 = this.seat04.getChildByName('downcard');
		for (let i = 2; i <= 5; i++) {
			let down_node = cc.instantiate(downcard04.getChildByName('down01'));
			down_node.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			down_node.x = -60 - (i - 1) * 27;
			downcard04.addChild(down_node);
		}
	},
	InitShowCard: function () {
		//位置一，统一生成16张牌。提高兼容性
		let showcard01 = this.seat01.getChildByName('showcard');
		for (let i = 1; i <= 16; i++) {
			let show_node = cc.instantiate(showcard01.getChildByName('sp_in'));
			show_node.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - 17), 2);
			showcard01.addChild(show_node);
		}
		//位置二
		let showcard02 = this.seat02.getChildByName('showcard');
		for (let i = 1; i <= 16; i++) {
			let show_node = cc.instantiate(showcard02.getChildByName('sp_in'));
			show_node.name = this.ComTool.StringAddNumSuffix("card", i, 2);
			show_node.x = -6 + (i + 1) * 7.7;
			show_node.y = 430 - (i + 1) * 30;
			showcard02.addChild(show_node);
		}
		//位置三
		let showcard03 = this.seat03.getChildByName('showcard');
		for (let i = 1; i <= 16; i++) {
			let show_node = cc.instantiate(showcard03.getChildByName('sp_in'));
			show_node.name = this.ComTool.StringAddNumSuffix("card", i, 2);
			showcard03.addChild(show_node);
		}
		//位置四
		let showcard04 = this.seat04.getChildByName('showcard');
		for (let i = 1; i <= 16; i++) {
			let show_node = cc.instantiate(showcard04.getChildByName('sp_in'));
			show_node.name = this.ComTool.StringAddNumSuffix("card", i, 2);
			show_node.x = -107 + (i + 1) * 7.8;
			show_node.y = -430 + (i + 1) * 32;
			show_node.zIndex = Math.abs(i - 17);
			showcard04.addChild(show_node);
		}
	},
	InitAllNdOut: function () {
		this.DeleteAllNdOut();
		let childNum = 6;
		if (this.playerCount == 2) {
			childNum = 12;
		}
		for (let i = 0; i < this.playerCount; i++) {
			this.InitNdOut(this.Pos2Pos(i) + 1, childNum);
		}
	},
	InitNdOut: function (pos, childNum) {
		let nd_outLineNum = 4;//总共4排
		let nd_outChild = false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName + '/nd_out');
		if (pos == 1) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				if (i == 4 && childNum == 6) {
					childNum = 11;  //第4牌，需要11个蹲牌
					//   nd_outNodeChild.x=nd_outNode.getChildByName('out3').x+200;
				}
				if (i == 4 && childNum == 12) {
					nd_outNodeChild.x = nd_outNode.getChildByName('out3').x;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name = "pai" + j;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		} else if (pos == 2) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				if (i == 4 && childNum == 6) {
					childNum = 11;  //第4牌，需要11个蹲牌
					//   nd_outNodeChild.y=nd_outNode.getChildByName('out3').y+80;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name = "pai" + j;
					nd_outChild.x = nd_outChild.x - (j - 1) * 3;
					nd_outNodeChild.addChild(nd_outChild, Math.abs(j - 12));
				}
			}
		} else if (pos == 3) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				if (i == 4 && childNum == 6) {
					childNum = 11;  //第4牌，需要11个蹲牌
					//    nd_outNodeChild.x=nd_outNode.getChildByName('out3').x-200;
				}
				if (i == 4 && childNum == 12) {
					nd_outNodeChild.x = nd_outNode.getChildByName('out3').x;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name = "pai" + Math.abs(j - (childNum + 1));
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		} else if (pos == 4) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				if (i == 4 && childNum == 6) {
					childNum = 11;  //第4牌，需要11个蹲牌
					//    nd_outNodeChild.y=nd_outNode.getChildByName('out3').y-80;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name = "pai" + j;
					nd_outChild.x = nd_outChild.x - (j - 1) * 3;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		}
	},

	SetRoomInfo: function (playercount, roomKey, setID, setAll) {
		this.SetWndProperty("room_data/label_player_num", "text", playercount + "人场");
		this.SetWndProperty("room_data/label_player_ju", "text", "局数：" + setID + "/" + setAll);
		this.SetWndProperty("room_data/label_player_roomkey", "text", "房间号：" + roomKey);
	},
	SetPlayInfo: function () {
		let playnow = this.playkey + 1;
		let max = this.playBack.length;
		if (playnow > max) {
			playnow = max;
		}
		if (playnow < 0) {
			playnow = 0;
		}
		this.SetWndProperty("playinfo", "text", playnow + "/" + max);
	},
	ShowPlayerInfo(playerList) {
		let count = playerList.length;
		for (let i = 0; i < count; i++) {
			//用户头像创建
			let heroID = playerList[i]["pid"];
			let headImageUrl = playerList[i]["iconUrl"];
			if (heroID && headImageUrl) {
				this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
			}
			//用户头像创建
			let touxiang = this.PosGetTouXiang(playerList[i].pos);
			touxiang.active = true;
			if (this.dPos == playerList[i].pos) {
				touxiang.getChildByName('zhuangjia').active = true;
			} else {
				touxiang.getChildByName('zhuangjia').active = false;
			}
			let sp_info = touxiang.getChildByName('sp_info');
			sp_info.getChildByName('lb_name').getComponent("cc.Label").string = playerList[i].name;
			let WeChatHeadImage = touxiang.getChildByName('head_img').getComponent(app.subGameName + "_WeChatHeadImage");
			WeChatHeadImage.ShowHeroHead(playerList[i].pid);
		}
	},
	HideTouXiang: function () {
		this.seat01.getChildByName('touxiang').active = false;
		this.seat02.getChildByName('touxiang').active = false;
		this.seat03.getChildByName('touxiang').active = false;
		this.seat04.getChildByName('touxiang').active = false;

		this.seat01.getChildByName('touxiang').getChildByName("trusteeship").active=false;
		this.seat02.getChildByName('touxiang').getChildByName("trusteeship").active=false;
		this.seat03.getChildByName('touxiang').getChildByName("trusteeship").active=false;
		this.seat04.getChildByName('touxiang').getChildByName("trusteeship").active=false;
	},
	HideJin: function () {
		//this.bg_jinpai2.active=false;
		this.bg_jinpai.getChildByName('card').getComponent(cc.Sprite).spriteFrame = null;
	},
	HideSeat: function () {
		this.SetWndProperty("UIMessageNoExist", "active", false);
		this.SetWndProperty("playinfo", "text", '');
		for (let i = 0; i < 4; i++) {
			let ShowNode = this.PosGetSeat(i);
			ShowNode.getChildByName('showcard').active = false;
			ShowNode.getChildByName('nd_out').active = false;
			ShowNode.getChildByName('downcard').active = false;
		}
	},
	SetWanFa: function (cfg) {
		this.wanfa.string = this.WanFa(cfg);
	},
	ShowTrusteeship:function(posID, isTrusteeship){
    	let touxiang=this.PosGetTouXiang(posID);
	    touxiang.getChildByName('trusteeship').active=isTrusteeship;
    },
	PlayData: function () {
		let data = this.playBack[this.playkey];
		if (!data) {
			return false;
		}
		console.log(data);
		this.HideTips();
		this.SetPlayInfo();
		let type = data.name;
		let res = data.res;
		let waitSecond = 0;//本帧播放时间
		if (type.indexOf("MJ_Config") >= 0) {
			waitSecond = 0;
			this.SetWanFa(res.cfg);
		} else if (type.indexOf("MJ_SetStart") >= 0) {
			waitSecond = 2;
			// this.ShowBase(res);
			this.SetCards(data.setPosCard, res.setInfo.cardRestSize);
		} else if (type.indexOf("MJ_Applique") >= 0) {
			waitSecond = 1;
			this.PlayBuHua(res);
		} else if (type.indexOf("MJ_Jin") >= 0) {
			this.minplay = this.playkey + 1;
			waitSecond = 3;
			this.PlayJin(res);
		} else if (type.indexOf("MJ_SetPosCard") >= 0) {
			waitSecond = 1;
			this.SetCards(res.setPosList);
		} else if (type.indexOf("MJ_PosGetCard") >= 0) {
			waitSecond = 1;
			this.SetCards(data.setPosCard, res.cardRestSize);
		} else if (type.indexOf("MJ_PosOpCard") >= 0) {
			waitSecond = 1;
			this.SetCards(data.setPosCard);
			this.PlayPosOpCard(res);
		} else if (type.indexOf("MJ_FenBing") >= 0) {
			waitSecond = 1;
			this.PlayEffect("FenBing");
		} else if (type.indexOf("MJ_StartRound") >= 0) {
			waitSecond = 1;
			this.PlayPosOpList(res);
		} else if (type.indexOf("MJ_BuHua") >= 0) {
		}
		else if (type.indexOf("MJ_SetEnd") >= 0) {
			waitSecond = 4000000;
			this.PlayEnd(res);
		} else {
			this.pause == true;
			return;
		}
		this.playkey += 1;
		this.NextPlayTime = Math.round(new Date().getTime() / 1000) + waitSecond;
	},
	Play: function () {
		this.fadeOutTime = this.fadeOutTime - 0.5;
		if (this.fadeOutTime <= 0 && this.fadeOutTime > -2) {
			this.HideControl();
		}
		let now = Math.round(new Date().getTime() / 1000);
		if (this.NextPlayTime == 0 || now < this.NextPlayTime) {
			return
		}
		if (this.pause == true) {
			return
		}
		this.PlayData();
	},
	PlayBuHua: function (res) {
		let actionPos = this.Pos2Pos(res.pos);
		this.HelpAction(actionPos);
		let soundPath = "";
		soundPath = ["boy", "_" + app.subGameName + "_", "buhua"].join("");
		this.SoundManager.PlaySound(soundPath);
		if (actionPos == 0) {
			this.AddWndEffect("sp_seat01/Effects", "BuHua", "BuHua", 1);
		}
		else if (actionPos == 1) {
			this.AddWndEffect("sp_seat02/Effects", "BuHua", "BuHua", 1);
		}
		else if (actionPos == 2) {
			this.AddWndEffect("sp_seat03/Effects", "BuHua", "BuHua", 1);
		}
		else if (actionPos == 3) {
			this.AddWndEffect("sp_seat04/Effects", "BuHua", "BuHua", 1);
		}
		let handCard = res.set_Pos.handCard;
		let cardIDList = res.set_Pos.shouCard;
		let outCard = res.set_Pos.outCard;
		let imageString = this.PosGetEatCardString(res.pos);
		let ShowNode = this.PosGetSeat(res.pos);

		this.ShowPlayerShowCard(ShowNode.getChildByName('showcard'), cardIDList, handCard, this.jin1, this.jin2, imageString);
		this.ShowPlayerOutCard(ShowNode.getChildByName('nd_out'), outCard, this.jin1, this.jin2, this.PosGetOutCardString(res.pos));
		this.SetWndProperty("room_data/label_num", "text", "剩余：" + res.cardRestSize);
	},
	PlayEnd: function (res) {
		let data = res.setEnd;
		let posResultList = data.posResultList;
		let huPos = false;
		let huType = false;
		for (let i = 0; i < posResultList.length; i++) {
			let poshutype = this.ShareDefine.HuTypeStringDict[posResultList[i].huType];
			if (poshutype != this.ShareDefine.HuType_NotHu) {
				huPos = i;
				huType = poshutype;
				break;
			}
		}
		let soundName = "";
		if (huType == this.ShareDefine.HuType_LiuJinDao) {
			soundName = ["boy", "_liujindao"].join("");
		} else if (huType == this.ShareDefine.HuType_QiangJin) {
			soundName = ["boy", "_qiangjin"].join("");
		} else if (huType == this.ShareDefine.HuType_SanJinDao) {
			soundName = ["boy", "_sanjindao"].join("");
		} else if (huType == this.ShareDefine.HuType_SanYou) {
			soundName = ["boy", "_sanyou"].join("");
		} else if (huType == this.ShareDefine.HuType_ShuangYou) {
			soundName = ["boy", "_shuangyou"].join("");
		} else if (huType == this.ShareDefine.HuType_SiJinDao) {
			soundName = ["boy", "_sijindao"].join("");
		} else if (huType == this.ShareDefine.HuType_WuJinDao) {
			soundName = ["boy", "_wujindao"].join("");
		} else if (huType == this.ShareDefine.HuType_DanYou) {
			soundName = ["boy", "_youjin"].join("");
		} else if (huType == this.ShareDefine.HuType_ShiSanYao) {
			soundName = ["boy", "_shisanyao"].join("");
		} else if (huType == this.ShareDefine.HuType_DDHu) {
			soundName = ["boy", "_qidui"].join("");
		} else if (huType == this.ShareDefine.HuType_QGH) {
			soundName = ["boy", "_qiangganghu"].join("");
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			soundName = ["boy", "_zimo"].join("");
		} else if (huType == this.ShareDefine.HuType_TianHu) {
			soundName = ["boy", "_tianhu"].join("");
		} else if (huType == this.ShareDefine.HuType_JinQue) {
			soundName = ["boy", "_jinque"].join("");
		} else if (huType == this.ShareDefine.HuType_JinLong) {
			soundName = ["boy", "_jinlong"].join("");
		} else if (huType == this.ShareDefine.HuType_YiZhangHua) {
			soundName = ["boy", "_yizhanghua"].join("");
		} else if (huType == this.ShareDefine.HuType_WHuaWGang) {
			soundName = ["boy", "_wuhuawugang"].join("");
		} else if (huType == this.ShareDefine.HuType_HunYiSe) {
			soundName = ["boy", "_hunyise"].join("");
		} else if (huType == this.ShareDefine.HuType_QingYiSe) {
			soundName = ["boy", "_qingyise"].join("");
		} else {
			soundName = ["boy", "_pinghu"].join("");
		}
		if (soundName) {
			this.SoundManager.PlaySound(soundName);
		}

		let ShowPos = this.Pos2Pos(huPos) + 1;
		if (huType == this.ShareDefine.HuType_ZiMo) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "Zimo", "Zimo", 1);
		} else if (huType == this.ShareDefine.HuType_QGH) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "QiangGangHu", "QiangGangHu", 1);
		} else if (huType == this.ShareDefine.HuType_SanJinDao) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "SanJinDao", "SanJinDao", 1);
		} else if (huType == this.ShareDefine.HuType_SiJinDao) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "SiJinDao", "SiJinDao", 1);
		} else if (huType == this.ShareDefine.HuType_WuJinDao) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "WuJinDao", "WuJinDao", 1);
		} else if (huType == this.ShareDefine.HuType_LiuJinDao) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "LiuJinDao", "LiuJinDao", 1);
		} else if (huType == this.ShareDefine.HuType_DanYou) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "DanYou", "DanYou", 1);
		} else if (huType == this.ShareDefine.HuType_ShuangYou) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "ShuangYou", "ShuangYou", 1);
		} else if (huType == this.ShareDefine.HuType_SanYou) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "SanYou", "SanYou", 1);
		} else if (huType == this.ShareDefine.HuType_QiangJin) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "QiangJin", "QiangJin", 1);
		} else if (huType == this.ShareDefine.HuType_ShiSanYao) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "ShiSanYao", "ShiSanYao", 1);
		} else if (huType == this.ShareDefine.HuType_DDHu) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "Zimo", "Zimo", 1);
		} else if (huType == this.ShareDefine.HuType_TianHu) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "tianhu", "tianhu", 1);
		} else if (huType == this.ShareDefine.HuType_PingHu) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "hu", "hu", 1);
		} else if (huType == this.ShareDefine.HuType_JinQue) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "jinque", "jinque", 1);
		} else if (huType == this.ShareDefine.HuType_JinLong) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "jinlong", "jinlong", 1);
		} else if (huType == this.ShareDefine.HuType_YiZhangHua) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "yizhanghua", "yizhanghua", 1);
		} else if (huType == this.ShareDefine.HuType_WHuaWGang) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "wuhuawugang", "wuhuawugang", 1);
		} else if (huType == this.ShareDefine.HuType_HunYiSe) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "hunyise", "hunyise", 1);
		} else if (huType == this.ShareDefine.HuType_QingYiSe) {
			this.AddWndEffect("sp_seat0" + ShowPos + "/Effects", "qingyise", "qingyise", 1);
		}
	},
	PlayPosOpList: function (res) {
		let opList = res.room_SetWait.opPosList[0].opList;
		if (opList.length > 0) {
			if (opList[0] == 'Out') {
				return; //打牌动作，不用显示
			}
			let pos = this.Pos2Pos(res.room_SetWait.opPosList[0].waitOpPos);
			this.ShowTips(pos, opList);
		}
	},
	HideTips: function () {
		for (let i = 1; i <= 4; i++) {
			let node = this.node.getChildByName('sp_seat0' + i).getChildByName('tips');
			node.active = false;
		}
	},
	ShowTips: function (pos, opList) {
		let node = this.node.getChildByName('sp_seat0' + (pos + 1)).getChildByName('tips');
		for (let i = 0; i < node.children.length; i++) {
			node.children[i].active = false;
		}
		node.active = true;
		for (let i = 0; i < opList.length; i++) {
			if (opList[i] == 'Ting') {
				node.getChildByName('btn_ting').active = true;
				node.getChildByName('btn_cancel').active = true;
			} else if (opList[i] == 'Hu' ||
				opList[i] == 'PingHu' ||
				opList[i] == 'QiangGangHu' ||
				opList[i] == 'TianHu' ||
				opList[i] == 'DiHu' ||
				opList[i] == 'DDHu' ||
				opList[i] == 'QingYiSe' ||
				opList[i] == 'ZiYiSe' ||
				opList[i] == 'DaDuiPeng' ||
				opList[i] == 'SSBK' ||
				opList[i] == 'DanDiao' ||
				opList[i] == 'JiePao' ||
				opList[i] == 'HunYiSe' ||
				opList[i] == 'LuanFeng' ||
				opList[i] == 'QuanFeng' ||
				opList[i] == 'BaHua' ||
				opList[i] == 'MenQing' ||
				opList[i] == 'QiangJin' ||
				opList[i] == 'SiJinDao' ||
				opList[i] == 'SanJinDao' ||
				opList[i] == 'QiangJin' ||
				opList[i] == 'ShuangYou' ||
				opList[i] == 'SanJinYou' ||
				opList[i] == 'DanYou' ||
				opList[i] == 'HaiDiLao') {
				node.getChildByName('btn_hu').active = true;
				node.getChildByName('btn_cancel').active = true;
			} else if (opList[i] == 'Gang' || opList[i] == 'AnGang' || opList[i] == 'JieGang') {
				node.getChildByName('btn_gang').active = true;
				node.getChildByName('btn_cancel').active = true;
			} else if (opList[i] == 'Chi') {
				node.getChildByName('btn_chi').active = true;
				node.getChildByName('btn_cancel').active = true;
			} else if (opList[i] == 'Peng') {
				node.getChildByName('btn_pen').active = true;
				node.getChildByName('btn_cancel').active = true;
			} else if (opList[i] == 'Pass') {
				node.getChildByName('btn_next').active = true;
				node.getChildByName('btn_cancel').active = true;
			}
		}
	},
	PlayPosOpCard(res) {
		this.SoundManager.PlaySound("dapai");
		let pos = this.Pos2Pos(res.pos);
		let pai = res.opCard;
		let opType = this.ShareDefine.OpTypeStringDict[res.opType];
		if (opType == this.ShareDefine.OpType_Gang || opType == this.ShareDefine.OpType_JieGang || opType == this.ShareDefine.OpType_AnGang) {
			if (pos == 0) {
				this.AddWndEffect("sp_seat01/Effects", "Gang", "Gang", 1);
			}
			else if (pos == 1) {
				this.AddWndEffect("sp_seat02/Effects", "Gang", "Gang", 1);
			}
			else if (pos == 2) {
				this.AddWndEffect("sp_seat03/Effects", "Gang", "Gang", 1);
			}
			else if (pos == 3) {
				this.AddWndEffect("sp_seat04/Effects", "Gang", "Gang", 1);
			}
			let soundName = soundName = ["boy", "_gang"].join("");
			this.SoundManager.PlaySound(soundName);
		}
		else if (opType == this.ShareDefine.OpType_Peng) {
			if (pos == 0) {
				this.AddWndEffect("sp_seat01/Effects", "Peng", "Peng", 1);
			}
			else if (pos == 1) {
				this.AddWndEffect("sp_seat02/Effects", "Peng", "Peng", 1);
			}
			else if (pos == 2) {
				this.AddWndEffect("sp_seat03/Effects", "Peng", "Peng", 1);
			}
			else if (pos == 3) {
				this.AddWndEffect("sp_seat04/Effects", "Peng", "Peng", 1);
			}
			let soundName = "";
			soundName = ["boy", "_peng"].join("");
			this.SoundManager.PlaySound(soundName);
		}
		else if (opType == this.ShareDefine.OpType_Out) {
			let soundPath = "";
			soundPath = ["boy", "_", parseInt(pai / 100)].join("");
			this.SoundManager.PlaySound(soundPath);
		}
		this.HelpAction(pos);
	},

	HelpAction: function (pos) {
		this.help_seat01.node.getChildByName("sp1").active = 1;
		this.help_seat01.node.getChildByName("sp2").active = 0;
		this.help_seat02.node.getChildByName("sp1").active = 1;
		this.help_seat02.node.getChildByName("sp2").active = 0;
		this.help_seat03.node.getChildByName("sp1").active = 1;
		this.help_seat03.node.getChildByName("sp2").active = 0;
		this.help_seat04.node.getChildByName("sp1").active = 1;
		this.help_seat04.node.getChildByName("sp2").active = 0;
		if (pos == 0) {
			this.help_seat01.node.getChildByName("sp2").active = 1;
		}
		else if (pos == 1) {
			this.help_seat02.node.getChildByName("sp2").active = 1;
		}
		else if (pos == 2) {
			this.help_seat03.node.getChildByName("sp2").active = 1;
		}
		else if (pos == 3) {
			this.help_seat04.node.getChildByName("sp2").active = 1;
		}
	},
	PlayEffect: function (effectName) {
		this.AddWndEffect("ZiMoEffect", effectName, effectName, 1)
	},
	PlayFaPai: function () {
		for (let i = 0; i < 13; i++) {
			let childName = this.ComTool.StringAddNumSuffix("card", i + 1, 2);
			let playNode = this.seat01.getChildByName('showcard').getChildByName(childName);
			let animation = playNode.getComponent(cc.Animation);
			animation.on('finished', this.OnFinished, "");
			animation.play("UICard01_OpenCard");
		}
	},
	ShowBase: function (res) {
		if (res.jin > 0) {
			this.jin1 = res.jin1;
		} else {
			this.jin1 = -1;
		}
		if (res.jin2 > 0) {
			this.jin2 = res.jin2;
		} else {
			this.jin2 = -1;
		}
		this.SetCards(res.setInfo.setPosList);
	},
	SetEndShouCard: function (posHuList) {
		let count = posHuList.length;
		for (let i = 0; i < count; i++) {
			let ShowNode = this.PosGetSeat(posHuList[i].pos);
			let cardIDList = posHuList[i].shouCard;
			let handCard = posHuList[i].handCard;
			let imageString = this.PosGetEatCardString(posHuList[i].posID);
			this.ShowPlayerShowCard(ShowNode.getChildByName('showcard'), cardIDList, handCard, this.jin1, this.jin2, imageString);
		}

	},
	SetCards: function (setPosList, num) {
		let count = setPosList.length;
		for (let i = 0; i < count; i++) {
			let ShowNode = this.PosGetSeat(setPosList[i].posID);
			let cardIDList = setPosList[i].shouCard;
			let outCard = setPosList[i].outCard;
			let publicCardList = [];
			if (setPosList[i].hasOwnProperty('publicCardStrs')) {
				publicCardList = eval('(' + setPosList[i].publicCardStrs + ')');
			}
			this.ShowTrusteeship(setPosList[i].posID, setPosList[i].isTrusteeship);
			let handCard = setPosList[i].handCard;
			let imageString = this.PosGetEatCardString(setPosList[i].posID);
			this.ShowPlayerShowCard(ShowNode.getChildByName('showcard'), cardIDList, handCard, this.jin1, this.jin2, imageString);
			this.ShowPlayerOutCard(ShowNode.getChildByName('nd_out'), outCard, this.jin1, this.jin2, this.PosGetOutCardString(setPosList[i].posID));
			this.ShowPlayerPublichCard(ShowNode.getChildByName('downcard'), publicCardList, imageString);
			if (handCard > 0) {
				this.HelpAction(this.Pos2Pos(setPosList[i].posID));
			}
		}
		if (num >= 0) {
			this.SetWndProperty("room_data/label_num", "text", "剩余：" + num);
		}
	},
	PlaySetStart: function (res) {
	},
	PlayJin: function (res) {
		this.jin1 = res["jin"];
		this.jin2 = res["jin2"];
		this.jinJin = res["jinJin"];
		let jin1 = this.jin1;
		let jin2 = this.jin2;
		this.KaiJinEffect.active = 1;
		this.KaiJinEffect.getComponent(cc.Animation).play("kaijinAction");
		if (jin1 > 0 && jin2 > 0) {
			this.ShowKaiJinSprite(jin1, this.kaijin1);
			this.ShowKaiJinSprite(jin2, this.kaijin2);
			this.kaijin1.x = -50;
			this.kaijin1.y = 0;
			this.kaijin2.x = 50;
			this.kaijin2.y = 0;
			this.kaijin1.active = true;
			this.kaijin2.active = true;
		} else if (jin1 > 0) {
			this.ShowKaiJinSprite(jin1, this.kaijin1);
			this.kaijin1.x = 0;
			this.kaijin1.y = 0;
			this.kaijin1.active = true;
		}
	},
	KaiJinFinished: function (event) {
		this.KaiJinEffect.active = false;
		let jin1 = this.jin1;
		let jin2 = this.jin2;
		var seq = cc.sequence(cc.moveTo(0.1, -598, 190), cc.callFunc(this.ShowJin, this, "KaiJin"));
		if (jin1 > 0 && jin2 > 0) {
			this.kaijin2.runAction(cc.moveTo(0.1, -514, 190));
			this.kaijin1.runAction(seq);
		} else if (jin1 > 0) {
			this.kaijin1.runAction(seq);
		}
	},
	ShowJin: function () {
		this.kaijin1.active = 0;
		this.kaijin2.active = 0;
		let jin1 = this.jin1;
		let jin2 = this.jin2;
		let jinJin = this.jinJin;
		let btnNode = this.GetWndNode("bg_jinpai");
		if (jin1 == 0) {
			btnNode.active = false;
			let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
			wndSprite.spriteFrame = '';
		} else {
			btnNode.active = true;
			let cardType = Math.floor(jin1 / 100);
			let imageName = ["CardShow", cardType].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (imageInfo) {
				let imagePath = imageInfo["FilePath"];
				let that = this;
				app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
					.then(function (spriteFrame) {
						if (!spriteFrame) {
							that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath);
							return;
						}
						btnNode.getChildByName('card').color = cc.color(255, 255, 0);
						let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
						wndSprite.spriteFrame = spriteFrame;
					})
					.catch(function (error) {
						that.ErrLog("JinShow(%s) error:%s", imagePath, error.stack);
					})
			}
			else {
				this.ErrLog('failed load imageName%s', imageName, cardType);
				return;
			}
		}
		let btnNode2 = this.GetWndNode("bg_jinpai2");
		if (jin2 == 0 && jinJin == 0) {
			btnNode2.active = false;
			let wndSprite2 = btnNode2.getChildByName('card').getComponent(cc.Sprite);
			wndSprite2.spriteFrame = '';
		} else {
			btnNode2.active = true;
			let cardType2 = Math.floor((jin2 || jinJin) / 100);
			let imageName2 = ["CardShow", cardType2].join("");
			let imageInfo2 = this.IntegrateImage[imageName2];
			if (imageInfo2) {
				let imagePath2 = imageInfo2["FilePath"];
				let that = this;
				app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath2, cc.SpriteFrame)
					.then(function (spriteFrame) {
						if (!spriteFrame) {
							that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath2);
							return;
						}
						btnNode2.getChildByName('card').color = cc.color(255, 255, 0);
						let wndSprite2 = btnNode2.getChildByName('card').getComponent(cc.Sprite);
						wndSprite2.spriteFrame = spriteFrame;
					})
					.catch(function (error) {
						that.ErrLog("JinShow(%s) error:%s", imagePath2, error.stack);
					})
			}
			else {
				this.ErrLog('failed load imageName2%s', imageName2, cardType2);
				return;
			}
		}

	},
	ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2, imageString) {
		ShowNode.active = 1;
		let UICard_ShowCard = ShowNode.getComponent(app.subGameName + "_UIMJCard_ShowCard");
		UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2, imageString);
	},
	ShowPlayerOutCard: function (ShowNode, outcard, jin1, jin2, imageString) {
		ShowNode.active = 1;
		let UIPlay_Out = ShowNode.getComponent(app.subGameName + "_UIMJPlay_Out");
		UIPlay_Out.ShowOutCard2(outcard, jin1, jin2, imageString);
	},
	ShowPlayerPublichCard: function (ShowNode, publicCardList, imageString) {
		ShowNode.active = 1;
		let UICard_Down = ShowNode.getComponent(app.subGameName + "_UIMJCard_Down");
		UICard_Down.ShowDownCard(publicCardList, imageString);
	},
	DeleteAllNdOut: function () {
		for (let i = 0; i < this.playerCount; i++) {
			let showpos = this.Pos2Pos(i) + 1;
			let wndName = this.ComTool.StringAddNumSuffix("sp_seat", showpos, 2);
			let nd_outNode = this.GetWndNode(wndName + '/nd_out');
			for (let j = 1; j <= 4; j++) {
				nd_outNode.getChildByName('out' + j).removeAllChildren();
			}
		}
	},
	OnClose: function () {
		this.DeleteAllNdOut();
	},
	OnClick: function (btnName, btnNode) {
		this.fadeOutTime = 5;
		if (btnName == "btn_return") {
			app[app.subGameName + "Client"].ExitGame();
			// this.ShowOrCloseForm('game/base/ui/majiang/'+app.subGameName+'_UIMJVideo');
			//    this.CloseForm();
		} else if (btnName == "btn_back") {
			this.OnClickPause();
			if (this.minplay >= this.playkey) {
				return;
			}
			this.playkey = this.playkey - 2;  //扣一针,播放完一帧帧数会加一，所有要回到上一帧，帧数要-2
			this.PlayData();
		} else if (btnName == "btn_play") {
			this.OnClickPlay();
		} else if (btnName == "btn_pause") {
			this.OnClickPause();
		} else if (btnName == "btn_forward") {
			this.OnClickPause();
			this.PlayData();
		} else if (btnName == "btnSure") {
			app[app.subGameName + "Client"].ExitGame();
		} else if (btnName == "btn_last") {
			if (this.curTabId <= 1) {
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('当前已经是第一局');
				return;
			}
			this.curTabId--;
			let self = this;
			let sendPack = {};
			sendPack.roomId = this.curRoomID;
			sendPack.tabId = this.curTabId;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetPlayBackCode", sendPack, function (serverPack) {
					let playDataGame = app[app.subGameName + "_ShareDefine"]().GametTypeID2PinYin[serverPack.gameId];
					if (playDataGame != app.subGameName) {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('获取回放数据不是该游戏的');
						return;
					}
					self.GetPlayBackDataByCode(serverPack.playBackCode);
				},
				function (error) {
					self.curTabId++;
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('获取回放数据失败,检查是否已经是否第一局');
				});
		} else if (btnName == "btn_next") {
			this.curTabId++;
			let self = this;
			let sendPack = {};
			sendPack.roomId = this.curRoomID;
			sendPack.tabId = this.curTabId;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "GetPlayBackCode", sendPack, function (serverPack) {
					let playDataGame = app[app.subGameName + "_ShareDefine"]().GametTypeID2PinYin[serverPack.gameId];
					if (playDataGame != app.subGameName) {
						app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('获取回放数据不是该游戏的');
						return;
					}
					self.GetPlayBackDataByCode(serverPack.playBackCode);
				},
				function (error) {
					self.curTabId--;
					app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('获取回放数据失败,检查是否已经是否最后一局');
				});
		}else {
			this.ShowControl();
		}
	},
	OnClickPause: function () {
		this.pause = true;
		this.control_list.getChildByName('btn_play').active = true;
		this.control_list.getChildByName('btn_pause').active = false;
	},
	OnClickPlay: function () {
		this.pause = false;
		this.control_list.getChildByName('btn_play').active = false;
		this.control_list.getChildByName('btn_pause').active = true;
	},
	HideControl: function () {
		var action = cc.fadeOut(2.0);
		this.control_list.runAction(action);
	},
	ShowControl: function () {
		var action = cc.fadeIn(0.5);
		this.control_list.runAction(action);
	},
	//---------计时器，开局发牌逻辑--------------
	OnUpdate: function () {

	},
	/*
	位置重新定位,万恶二人移动位置
	 */
	Pos2Pos: function (pos) {
		if (this.playerCount > 2) {
			return pos;
		}
		if (pos == 1) {
			return 2;
		}
		return 0;
	},

	PosGetSeat: function (pos) {
		let showPos = this.Pos2Pos(pos);
		if (showPos == 0) {
			return this.seat01;
		} else if (showPos == 1) {
			return this.seat02;
		} else if (showPos == 2) {
			return this.seat03;
		} else if (showPos == 3) {
			return this.seat04;
		}
	},
	PosGetEatCardString: function (pos) {
		let showPos = this.Pos2Pos(pos);
		if (showPos == 0) {
			return 'EatCard_Self_';
		} else if (showPos == 1) {
			return 'EatCard_Down_';
		} else if (showPos == 2) {
			return 'EatCard_Self_';
		} else if (showPos == 3) {
			return 'EatCard_Up_';
		}
	},
	PosGetOutCardString: function (pos) {
		let showPos = this.Pos2Pos(pos);
		if (showPos == 0) {
			return 'OutCard_Self_';
		} else if (showPos == 1) {
			return 'OutCard_Down_';
		} else if (showPos == 2) {
			return 'OutCard_Self_';
		} else if (showPos == 3) {
			return 'OutCard_Up_';
		}
	},
	PosGetTouXiang: function (pos) {
		let showPos = this.Pos2Pos(pos);
		if (showPos == 0) {
			return this.touxiang1;
		} else if (showPos == 1) {
			return this.touxiang2;
		} else if (showPos == 2) {
			return this.touxiang3;
		} else if (showPos == 3) {
			return this.touxiang4;
		}
	},
	Str2Json: function (jsondata) {
		if (jsondata === "") {
			return false;
		}
		var json = JSON.parse(jsondata);
		return json;
	},
	ShowKaiJinSprite: function (jin, btnNode) {
		let cardType = Math.floor(jin / 100);
		let imageName = ["CardShow", cardType].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (imageInfo) {
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("ShowKaiJinSprite(%s) load spriteFrame fail", imagePath);
						return;
					}
					btnNode.color = cc.color(255, 255, 0);
					let wndSprite = btnNode.getComponent(cc.Sprite);
					wndSprite.spriteFrame = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("ShowKaiJinSprite(%s) error:%s", imagePath, error.stack);
				})
		}
		else {
			this.ErrLog('failed load imageName%s', imageName, cardType);
			return;
		}
	},


});