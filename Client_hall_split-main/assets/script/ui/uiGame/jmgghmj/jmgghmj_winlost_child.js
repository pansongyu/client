/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		posSprite: [cc.SpriteFrame],
		headKuang: [cc.SpriteFrame],
		cardBg: [cc.SpriteFrame],
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = -1;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		this.posCount = posResultList.length;
		for (let i = 0; i < this.posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
			if (posHuType != this.ShareDefine.HuType_NotHu && posHuType != this.ShareDefine.HuType_DianPao) {
				dPos = pos;
			}
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		let maList = setEnd["maList"] || [];
		let zhongMaList = setEnd["zhongMaList"] || [];
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maList, zhongMaList, posResultList, dPos);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		// this.ShowHeadKuang(index, dPos);
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	ShowHeadKuang: function (index, dPos) {
		let colorPos = this.GetPosColor(index, dPos);
		this.node.getChildByName("user_info").getChildByName("pos").getComponent(cc.Sprite).spriteFrame = this.posSprite[colorPos];
		this.node.getChildByName("user_info").getChildByName("img_txk").getComponent(cc.Sprite).spriteFrame = this.headKuang[colorPos];
	},
	GetPosColor: function (posID, dPos) {
		//0-黄 1-紫 2-蓝 3-绿
		let dDownPos = -1;//庄下家
		let dFacePos = -1;//庄对家
		let dUpPos = -1;//庄上家
		let count = this.posCount;
		if (count == 2) {
			dFacePos = dPos == 0 ? 1 : 0;
		} else if (count == 3) {
			dUpPos = (dPos + count - 1) % count;
			dDownPos = (dPos + 1) % count;
		} else {
			dUpPos = (dPos + count - 1) % count;
			dDownPos = (dPos + 1) % count;
			dFacePos = (dPos + 2) % count;
		}
		if (posID == dPos) {
			return 0;
		} else if (posID == dDownPos) {
			return 1;
		} else if (posID == dFacePos) {
			return 2;
		} else if (posID == dUpPos) {
			return 3;
		}
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maList, zhongMaList, posResultList, dPos) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName("scrollview").getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan').getChildByName("scrollview"), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maList, zhongMaList, HuList, posResultList, dPos);
		this.ShowPlayerAllScore(PlayerNode.getChildByName("lb_allscore"), HuList);
	},

	ScoreAddSubtract: function (score) {
		return score > 0 ? "+" + score : score;
	},

	ShowLoseWinMaIcon: function (cardNode, isShowWin) {
		cardNode.getChildByName("img_ym2").active = isShowWin;
		cardNode.getChildByName("img_sm2").active = !isShowWin;
	},

	ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		let isDisoolve = HuList["isDisoolve"];
		ShowNode.getChildByName('jiesanzhe').active = isDisoolve;


	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		this.noShowScore = [];	// 不显示分数的胡类型
		let huInfo = huInfoAll['endPoint'].huTypeMap;
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
			let isNoShowScore = this.noShowScore.indexOf(huType) != -1;
			if (isNoShowScore) {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
			} else {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
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

	ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
		ShowNode.active = 1;
		let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
		UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
	},
	ShowPlayerDownCard: function (ShowNode, publishcard, jin1 = 0, jin2 = 0) {
		ShowNode.active = 1;
		let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCardByJDZMJ(publishcard, this.posCount, jin1, jin2);
	},

	ShowPlayerNiaoPai: function (ShowNode, maList, zhongMaList, huInfo, posResultList, dPos) {
		let pos = huInfo["pos"];
		// let zhongList = huInfo["zhongList"];
		ShowNode.opacity = 0;
		let cardlayout = ShowNode.getChildByName("cardlayout");
		for (let i = 0; i < cardlayout.children.length; i++) {
			cardlayout.children[i].opacity = 0;
			cardlayout.children[i].color = cc.color(255, 255, 255);
		}
		if (maList.length == 0) {
			console.error("ShowPlayerNiaoPai", maList);
			return;
		}
		// huType = this.ShareDefine.HuTypeStringDict[huType];
		//没胡得人不显示
		if (dPos != pos) {
			return
		}
		ShowNode.opacity = 255;
		for (let i = 0; i < maList.length; i++) {
			let cardType = maList[i];
			let node = cardlayout.children[i];
			if (!node) {
				node = cc.instantiate(cardlayout.children[0]);
				node.color = cc.color(255, 255, 255);
				cardlayout.addChild(node);
			}
			node.opacity = 255;
			this.ShowImage(node, "EatCard_Self_", cardType);
			if (zhongMaList.indexOf(cardType) > -1) {
				node.color = cc.color(255, 255, 0);
			}
		}
	},
	ShowPlayerAllScore: function (ShowNode, huInfo) {
		let gangNum = huInfo["gangNum"];
		let gangPoint = huInfo["gangPoint"];
		let paiXingPoint = huInfo["paiXingPoint"];
		let maPoint = huInfo["maPoint"];
		if (gangPoint >= 0) {
			gangPoint = "+" + gangPoint;
		}
		if (paiXingPoint >= 0) {
			paiXingPoint = "+" + paiXingPoint;
		}
		if (maPoint >= 0) {
			maPoint = "+" + maPoint;
		}
		let str = "杠X" + gangNum + "(" + gangPoint + ")" + "  " + "牌型分:" + paiXingPoint + "  " + "马分:" + maPoint;
		ShowNode.getComponent(cc.Label).string = str;
	},
	ShowImage: function (childNode, imageString, cardID) {
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}
		//取卡牌ID的前2位
		let imageName = [imageString, cardID].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
		} else {
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					childSprite.spriteFrame = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				});
		}
	},
	ShowPlayerHuImg: function (huNode, huTypeName) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		if (typeof (huType) == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点泡';
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	LabelName: function (huType) {
		let huTypeDict = this.GetHuTypeDict();
		return huTypeDict[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function () {
		let huTypeDict = {};
		huTypeDict["JI"]="鸡胡";
		huTypeDict["QGH"]="抢杠胡";
		huTypeDict["QiDui"]="七对";
		huTypeDict["PPH"]="碰碰胡";
		huTypeDict["QYS"]="清一色";
		huTypeDict["WFJB"]="无鬼加倍";
		huTypeDict["DSY"]="大三元";
		huTypeDict["DSX"]="大四喜";
		huTypeDict["YJ"]="幺九";
		huTypeDict["SSY"]="十三幺";
		huTypeDict["ZhongMa"]="中马";
		huTypeDict["GSKH"]="杠上开花";
		huTypeDict["JieGang"]="直杠";
		huTypeDict["AnGang"]="暗杠";
		huTypeDict["Gang"]="碰杠";
		huTypeDict["GenZhuang"]="跟庄";
		huTypeDict["LianZhuang"]="连庄";
		huTypeDict["ZiMo"]="自摸加倍";

		return huTypeDict;
	},
	// GetHuTypeDict -end-
});
