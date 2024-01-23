/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		sp_in: cc.Node,
		downNode: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
		this.sp_in = this.node.getChildByName("showcard").getChildByName("sp_in");
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = setEnd.dPos;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		let posCount = posResultList.length;
		for (let i = 0; i < posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.zhuaNiaoList);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index]["isTing"]);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, zhuaNiaoList) {
		this.showLabelNum = 1;
		this.posResultInfo = HuList;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		// this.ShowDetailScores(PlayerNode.getChildByName('scores'));
		this.ShowPiaoMaiState(PlayerNode);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcardntcp'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcardntcp'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},

	ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
		ShowNode.active = 1;
		let count = 0;
		if (typeof (cardIDList) != "undefined") {
			count = cardIDList.length;
		}

		let handCardNode = ShowNode.getChildByName('handCard')
		handCardNode.removeAllChildren();
		for (let index = 0; index < count; index++) {
			let cardID = cardIDList[index];
			let cardNode = cc.instantiate(this.sp_in);
			handCardNode.addChild(cardNode);
			this.ShowJinBg(cardID, cardNode, jin1, jin2);
			this.ShowImage(cardNode, cardID, jin1, jin2);
		}
	
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = 1;
			this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, handCard, jin1, jin2);
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			if (this.sp_in.getChildByName("da")) {
				this.sp_in.getChildByName("da").active = false;
			}
			this.sp_in.UserData = null;
		}
	},
	ShowJinBg: function (cardID, childNode, jin1 = 0, jin2 = 0) {
		if (jin1 == 0) {
			if (this.RoomMgr == null) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) return;
			let roomSet = room.GetRoomSet();
			if (roomSet) {
				jin1 = roomSet.get_jin1();
				jin2 = roomSet.get_jin2();
			}
		}
		if (cardID > 0) {
			if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
				childNode.color = cc.color(255, 255, 125);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = true;
				}
			} else {
				childNode.color = cc.color(255, 255, 255);
				if (childNode.getChildByName("da")) {
					childNode.getChildByName("da").active = false;
				}
			}
		} else {
			childNode.color = cc.color(255, 255, 255);
			if (childNode.getChildByName("da")) {
				childNode.getChildByName("da").active = false;
			}
		}
	},
	ShowPlayerDownCard: function (ShowNode, publicCardList, jin1 = 0, jin2 = 0) {
		ShowNode.active = 1;
		let count = 0;
		if (typeof (publicCardList) != "undefined") {
			count = publicCardList.length;
		}

		let handCardNode = ShowNode.getChildByName('downCard')
		handCardNode.removeAllChildren();
		for (let index = 0; index < count; index++) {
			let publicInfoList = publicCardList[index];
			let cardIDList = publicInfoList.slice(3, publicInfoList.length);
			//操作类型
			let opType = publicInfoList[0];
			//如果是暗杠,前面3个盖牌，最后一个显示牌
			if (opType == this.ShareDefine.OpType_AnGang) {
				cardIDList = [0, 0, 0, cardIDList[3]];
			}

			let downNode = cc.instantiate(this.downNode);
			ShowNode.addChild(downNode);

			downNode.active = true;
			let cardCount = cardIDList.length;
			for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
				let cardID = cardIDList[cardIndex];
				let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
				let childNode = cc.find(paiChildName, downNode);
				if (!childNode) {
					continue
				}
				childNode.active = true;
				this.ShowImage(childNode, cardID);
			}
			//设置多余的卡牌位置空
			for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
				let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
				let childNode = cc.find(paiChildName, downNode);
				if (!childNode) {
					continue
				}
				let cardSprite = childNode.getComponent(cc.Sprite);
				cardSprite.spriteFrame = null;
				childNode.active = false;
			}
		}
	},

	ShowImage: function (childNode, cardID) {
		//显示贴图
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}

		let imagePath = "ui/uiGame/ntcp/card/" + Math.floor(cardID / 100);
		if (app['majiang_' + imagePath]) {
			childSprite.spriteFrame = app['majiang_' + imagePath];
		} else {
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					childSprite.spriteFrame = spriteFrame;
					app['majiang_' + imagePath] = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				});
		}
	},

	ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		let isTing = HuList["isTing"];
		// let isDisoolve = HuList["isDisoolve"];

		ShowNode.getChildByName('ting').active = isTing;
		// ShowNode.getChildByName('jiesanzhe').active = isDisoolve;


	},
	ShowPlayerHuaCard: function (huacardscrollView, hualist) {
		huacardscrollView.active = true;
		// if (hualist.length > 0) {
		//     this.huaNum.active = true;
		//     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		// }
		// else {
		//     this.huaNum.active = false;
		//     this.huaNum.getComponent(cc.Label).string = "";
		// }
		let view = huacardscrollView.getChildByName("view");
		let ShowNode = view.getChildByName("huacard");
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);
	},
	ShowPlayerRecord: function (ShowNode, huInfo) {
		let absNum = Math.abs(huInfo["point"]);
		if (absNum > 10000) {
			let shortNum = (absNum / 10000).toFixed(2);
			if (huInfo["point"] > 0) {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
			} else {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
			}
		} else {
			if (huInfo["point"] > 0) {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
			} else {
				ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
			}
		}
		//显示比赛分
		if (typeof (huInfo.sportsPointTemp) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPointTemp > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
			}
		} else if (typeof (huInfo.sportsPoint) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPoint > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPoint;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPoint;
			}
		} else {
			ShowNode.getChildByName('tip_sportspoint').active = false;
		}
	},
	ShowPlayerHuImg: function (huNode, huTypeName, isTing) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		//默认颜色描边
		huNode.color = new cc.Color(252, 236, 117);
		huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
		huNode.getComponent(cc.LabelOutline).Width = 2;
		if (typeof (huType) == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点炮';
			huNode.color = new cc.Color(192, 221, 245);
			huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
			huNode.getComponent(cc.LabelOutline).Width = 2;
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else if (huType == this.ShareDefine.HuType_GSKH) {
			huNode.getComponent(cc.Label).string = '杠上花';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},

	ShowDetailScores: function (scoreNodes) {
		scoreNodes.getChildByName("lb_huPoint").getComponent(cc.Label).string = "胡牌: " + this.posResultInfo["huPoint"];
		scoreNodes.getChildByName("lb_gangPoint").getComponent(cc.Label).string = "杠分: " + this.posResultInfo["gangPoint"];
		scoreNodes.getChildByName("lb_piaoPoint").getComponent(cc.Label).string = "漂分: " + this.posResultInfo["piaoPoint"];
		scoreNodes.getChildByName("lb_genPoint").getComponent(cc.Label).string = "跟庄: " + this.posResultInfo["genPoint"];
	},

	ShowPiaoMaiState: function (PlayerNode) {
		let lb_piaoFen = PlayerNode.getChildByName("lb_piaoFen").getComponent(cc.Label);
		let lb_mai = PlayerNode.getChildByName("lb_mai").getComponent(cc.Label);

		let piaoFenStr = "";
		// if (this.posResultInfo["piaoFen"] == 0) piaoFenStr = "不漂" + this.posResultInfo["piaoFen"];
		// else if (this.posResultInfo["piaoFen"] != -1) piaoFenStr = "漂" + this.posResultInfo["piaoFen"];
		lb_piaoFen.string = piaoFenStr;

		let maiStr = "";
		// if (this.posResultInfo["piaoFen"] == 1) maiStr = "买";
		// else if (this.posResultInfo["piaoFen"] == 0) maiStr = "不买";
		lb_mai.string = maiStr;
	},

	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = huInfoAll["huTypeMap"];
		if (!huInfo) {
			huInfo = huInfoAll.endPoint.huTypeMap;
		}
		// let huInfo = huInfoAll.huTypeMap;
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
			if (this.IsShowMulti(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
			} else if (this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "个");
			}
			else if (this.IsNoShowScore(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	//分数
	IsShowScore: function (huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},

	IsNoShowScore: function (huType) {
		this.noShowScore = [
			"ChengBao",
			"BeiChengBao",
		]
		let multi2 = this.noShowScore || [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},

	//个数
	IsShowNum: function (huType) {
		let multi2 = [
			// "JieGang",		//接杠
			// "Gang",			//补杠
			// "AnGang",		//暗杠
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti: function (huType) {
		let multi2 = [
			// "QingYiSe",		//清一色
			// "HunYiSe",		//混一色
			// "Long",			//一条龙
			// "PPHu",			//对对胡
			// "QD",			//七对
			// "HHQD",			//豪华七对
			// "GSKH",			//杠上开花
			// "DDC",			//大吊车
			// "ZhuangFan",	//庄翻
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function (huType) {
		let huTypeDict = this.GetHuTypeDict();

		return huTypeDict[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function () {
		let huTypeDict = {};
		huTypeDict["DiHu"] = "底胡";
		huTypeDict["YZ"] = "丫子";
		huTypeDict["ZM"] = "自摸";
		huTypeDict["TZH"] = "塌子胡";
		huTypeDict["DD"] = "单吊";
		huTypeDict["GK"] = "杠开";
		huTypeDict["QH"] = "清胡";
		huTypeDict["DWQ"] = "单文钱";
		huTypeDict["SWQ"] = "双文钱";
		huTypeDict["SanWQ"] = "三文钱";
		huTypeDict["SiWQ"] = "四文钱";
		huTypeDict["CH"] = "成胡";
		huTypeDict["Xi"] = "喜";
		huTypeDict["SL"] = "双龙";
		huTypeDict["SLJH"] = "三老聚会";
		huTypeDict["MP"] = "闷飘";
		huTypeDict["PH"] = "飘胡";
		huTypeDict["PHT"] = "飘胡";
		huTypeDict["TH"] = "天胡";
		huTypeDict["DH"] = "地胡";
		huTypeDict["XiEr"] = "喜儿";
		huTypeDict["QX"] = "穷喜";
		huTypeDict["TT"] = "天听";
		huTypeDict["HDLY"] = "海底捞月";
		huTypeDict["LDF"] = "输底胡";

		return huTypeDict;
	},
	// GetHuTypeDict -end-



});