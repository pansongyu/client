"use strict";
cc._RF.push(module, 'a3b61ZqXLZGDr62wf0TmC9A', 'yddgmj_winlost_child');
// script/ui/uiGame/yddgmj/yddgmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		posSprite: [cc.SpriteFrame],
		headKuang: [cc.SpriteFrame],
		cardBg: [cc.SpriteFrame]
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.ComTool = app.ComTool();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		var jin1 = setEnd.jin;
		var jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		var dPos = -1;
		var posResultList = setEnd["posResultList"];
		var posHuArray = new Array();
		this.posCount = posResultList.length;
		for (var i = 0; i < this.posCount; i++) {
			var posInfo = posResultList[i];
			var pos = posInfo["pos"];
			var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
			if (posHuType != this.ShareDefine.HuType_NotHu && posHuType != this.ShareDefine.HuType_DianPao) {
				dPos = pos;
			}
		}
		var PlayerInfo = playerAll[index];
		this.node.active = true;
		var maList = setEnd["maList"] || [];
		var zhongMaList = setEnd["zhongMaList"] || [];
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maList, zhongMaList, posResultList, dPos);
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
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
		var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	ShowHeadKuang: function ShowHeadKuang(index, dPos) {
		var colorPos = this.GetPosColor(index, dPos);
		this.node.getChildByName("user_info").getChildByName("pos").getComponent(cc.Sprite).spriteFrame = this.posSprite[colorPos];
		this.node.getChildByName("user_info").getChildByName("img_txk").getComponent(cc.Sprite).spriteFrame = this.headKuang[colorPos];
	},
	GetPosColor: function GetPosColor(posID, dPos) {
		//0-黄 1-紫 2-蓝 3-绿
		var dDownPos = -1; //庄下家
		var dFacePos = -1; //庄对家
		var dUpPos = -1; //庄上家
		var count = this.posCount;
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
	UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var maList = arguments[5];
		var zhongMaList = arguments[6];
		var posResultList = arguments[7];
		var dPos = arguments[8];

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

	ScoreAddSubtract: function ScoreAddSubtract(score) {
		return score > 0 ? "+" + score : score;
	},

	ShowLoseWinMaIcon: function ShowLoseWinMaIcon(cardNode, isShowWin) {
		cardNode.getChildByName("img_ym2").active = isShowWin;
		cardNode.getChildByName("img_sm2").active = !isShowWin;
	},

	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		var isDisoolve = HuList["isDisoolve"];
		ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		this.noShowScore = []; // 不显示分数的胡类型
		var huInfo = huInfoAll['endPoint'].huTypeMap;
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			var isNoShowScore = this.noShowScore.indexOf(huType) != -1;
			if (isNoShowScore) {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
			} else {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
		var absNum = Math.abs(huInfo["point"]);
		if (absNum > 10000) {
			var shortNum = (absNum / 10000).toFixed(2);
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
		if (typeof huInfo.sportsPointTemp != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPointTemp > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
			}
		} else if (typeof huInfo.sportsPoint != "undefined") {
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

	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, jin2) {
		ShowNode.active = 1;
		var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
		UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
	},
	ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		ShowNode.active = 1;
		var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCardByJDZMJ(publishcard, this.posCount, jin1, jin2);
	},

	ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, zhongMaList, huInfo, posResultList, dPos) {
		var pos = huInfo["pos"];
		// let zhongList = huInfo["zhongList"];
		ShowNode.opacity = 0;
		/*let cardlayout = ShowNode.getChildByName("cardlayout");
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
  }*/
	},
	ShowPlayerAllScore: function ShowPlayerAllScore(ShowNode, huInfo) {
		var huPaiFen = huInfo["huPaiFen"];
		var shangBaoFen = huInfo["shangBaoFen"];
		var gangFen = huInfo["gangFen"];
		if (huPaiFen >= 0) {
			huPaiFen = "+" + huPaiFen;
		}
		if (shangBaoFen >= 0) {
			shangBaoFen = "+" + shangBaoFen;
		}
		if (gangFen >= 0) {
			gangFen = "+" + gangFen;
		}
		var str = "胡牌分:" + huPaiFen + "  " + "上宝分:" + shangBaoFen + "  " + "杠分:" + shangBaoFen;
		ShowNode.getComponent(cc.Label).string = str;
	},
	ShowImage: function ShowImage(childNode, imageString, cardID) {
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}
		//取卡牌ID的前2位
		var imageName = [imageString, cardID].join("");
		var imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		var imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
		} else {
			var that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return;
				}
				childSprite.spriteFrame = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
		}
	},
	ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
		/*huLbIcon
  *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
  *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
  */
		var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		if (typeof huType == "undefined") {
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
	LabelName: function LabelName(huType) {
		var huTypeDict = this.GetHuTypeDict();
		return huTypeDict[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function GetHuTypeDict() {
		var huTypeDict = {
			PingHu: "平胡",
			ShiSanLan: "十三烂",
			QiXingShiSanLan: "七星十三烂",
			QiDui: "七对",
			PPHu: "大七对",
			DeGuo: "德国",
			GSKH: "杠开",
			QuanQiuRen: "全求人",
			TianHu: "天胡",
			DiHu: "地胡",
			ShangBaoFen: "上宝分",
			ZhiGang: "直杠",
			BuGang: "补杠",
			AnGang: "暗杠",
			AnGangJingPai: "暗杠精牌",
			ZhiGangJingPai: "直杠精牌",
			BuGangJingPai: "补杠精牌",
			DianGangJingPai: "点杠精牌",
			GenZhuang: "跟庄",
			ZhuangJiaShuYing: "庄家输赢",
			DianPao: "点炮",
			QGH: "抢杠胡",
			ZiMo: "自摸"
		};
		return huTypeDict;
	}
	// GetHuTypeDict -end-
});

cc._RF.pop();