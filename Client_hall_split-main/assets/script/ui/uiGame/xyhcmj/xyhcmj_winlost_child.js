/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {},
	// use this for initialization
	OnLoad: function() {
		this.ComTool = app.ComTool();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerData: function(setEnd, playerAll, index) {
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
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.maList || [], setEnd.zhuaNiaoList || []);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		let isTing = posResultList[index]["isBaoTing"] || false;
		this.node.getChildByName("user_info").getChildByName("ting").active = isTing;

		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function(PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maList, zhuaNiaoList) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
		this.ShowPlayerNiaoPai(PlayerNode.getChildByName('niaopai'), maList, zhuaNiaoList, HuList.huType);
		this.ShowOtherScore(PlayerNode.getChildByName('other'), HuList);
	},
	ShowPlayerHuaCard: function(huacardscrollView, hualist) {
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
	ShowPlayerNiaoPai: function(ShowNode, maList, zhuaNiaoList, huType) {
		for (let i = 1; i <= 10; i++) {
			ShowNode.getChildByName('card' + i).active = false;
			ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
		}
		if (huType == "NotHu" || huType == "JiePao") {
			ShowNode.active = false;
			return
		} else {
			ShowNode.active = true;
		}
		for (let i = 0; i < maList.length; i++) {
			let cardType = maList[i];
			let node = ShowNode.getChildByName("card" + (i + 1));
			this.ShowImage(node, 'EatCard_Self_', cardType);
			node.active = true;
			//更改为没中码都显示码牌
			if (zhuaNiaoList.indexOf(cardType) > -1) {
				node.color = cc.color(255, 255, 0);
			} else {
				node.color = cc.color(255, 255, 255);
			}
		}
	},
	ShowPlayerRecord: function(ShowNode, huInfo) {
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
		if (typeof(huInfo.sportsPointTemp) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPointTemp > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
			}
		} else if (typeof(huInfo.sportsPoint) != "undefined") {
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
	ShowOtherScore: function(ShowNode, huInfo) {
		let gangFen = huInfo["gangFen"];
		if (gangFen > 0) {
			ShowNode.getChildByName('lb_gangfen').active = true;
			ShowNode.getChildByName('lb_gangfen').getComponent("cc.Label").string = "杠分:" + gangFen;
		} else {
			ShowNode.getChildByName('lb_gangfen').active = false;
		}

		let zuiShu = huInfo["zuiShu"];
		if (zuiShu > 0) {
			ShowNode.getChildByName('lb_zuifen').active = true;
			ShowNode.getChildByName('lb_zuifen').getComponent("cc.Label").string = "嘴:" + zuiShu;
		} else {
			ShowNode.getChildByName('lb_zuifen').active = false;
		}

		let fanShu = huInfo["fanShu"];
		if (fanShu > 0) {
			ShowNode.getChildByName('lb_fanshu').active = true;
			ShowNode.getChildByName('lb_fanshu').getComponent("cc.Label").string = "番数x" + fanShu;
		} else {
			ShowNode.getChildByName('lb_fanshu').active = false;
		}
	},
	ShowPlayerHuImg: function(huNode, huTypeName) {
		/*huLbIcon
		 *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		 *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		 */
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		//默认颜色描边
		huNode.color = new cc.Color(252, 236, 117);
		huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
		huNode.getComponent(cc.LabelOutline).Width = 2;
		if (typeof(huType) == "undefined") {
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
			huNode.getComponent(cc.Label).string = '杠开';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	ShowPlayerJieSuan: function(ShowNode, huInfoAll) {
		let huInfo = huInfoAll['endPoint'].huTypeMap;
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
			if (this.IsShowMulti2(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
			} else if (this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	//分数
	IsShowScore: function(huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//个数
	IsShowNum: function(huType) {
		let multi2 = [
			"ZiMo",
			"BaoTing",
			"DuanMen",
			"DuYing",
			"MenQing",
			"PaoHu",
			"ZhongFaBai1",
			"ZhongFaBai2",
			"ZhongFaBai3",
			"ZhongFaBai4",
			"Kan1",
			"Kan2",
			"Kan3",
			"Kan4",
			"Que19",
			"GangKai",
			"GangDian",
			"QiangGang",
			"SanPeng",
			"SiGeTou1",
			"SiGeTou2",
			"SiGeTou3",
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti2: function(huType) {
		let multi2 = [
			"TianHu", 
			"DiHu", 
			"YiTiaoLong", 
			"MenQingYiTiaoLong", 
			"HunYiSe", 
			"MenQingHunYiSe", 
			"JiaHun", 
			"MenQingJiaHun", 
			"QingYiSe", 
			"PengPengHu", 
			"MenQingPengPengHu", 
			"QingYiSePengPengHu", 
			"DaDiaoChe", 
			"QiDui", 
			"HaoHuaQiDui", 
			"ChaoHaoHuaQiDui", 
			"QingYiSeQiDui", 
			"QingYiSeYiTiaoLong", 
		];// 显示倍数胡类型
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function(huType) {
		let huTypeDict = {};
		//嘴数
		huTypeDict["ZiMo"]="自摸";
		huTypeDict["BaoTing"]="报听";
		huTypeDict["DuanMen"]="断门";
		huTypeDict["DuYing"]="独赢";
		huTypeDict["MenQing"]="门清";
		huTypeDict["PaoHu"]="炮胡";
		huTypeDict["ZhongFaBai1"]="中发白";
		huTypeDict["ZhongFaBai2"]="中发白";
		huTypeDict["ZhongFaBai3"]="中发白";
		huTypeDict["ZhongFaBai4"]="中发白";
		huTypeDict["Kan1"]="坎";
		huTypeDict["Kan2"]="坎";
		huTypeDict["Kan3"]="坎";
		huTypeDict["Kan4"]="坎";
		huTypeDict["Que19"]="缺幺九";
		huTypeDict["GangKai"]="杠开";
		huTypeDict["GangDian"]="杠点";
		huTypeDict["QiangGang"]="抢杠";
		huTypeDict["SanPeng"]="三碰";
		huTypeDict["SiGeTou1"]="四个头";
		huTypeDict["SiGeTou2"]="四个头";
		huTypeDict["SiGeTou3"]="四个头";

		//牌型
		huTypeDict["TianHu"]="天胡";
		huTypeDict["DiHu"]="地胡";
		huTypeDict["YiTiaoLong"]="一条龙";
		huTypeDict["MenQingYiTiaoLong"]="门清一条龙";
		huTypeDict["HunYiSe"]="混一色";
		huTypeDict["MenQingHunYiSe"]="门清混一色";
		huTypeDict["JiaHun"]="假混";
		huTypeDict["MenQingJiaHun"]="门清假混";
		huTypeDict["QingYiSe"]="清一色";
		huTypeDict["PengPengHu"]="碰碰胡";
		huTypeDict["MenQingPengPengHu"]="门清碰碰胡";
		huTypeDict["QingYiSePengPengHu"]="清一色碰碰胡";
		huTypeDict["DaDiaoChe"]="大吊车";
		huTypeDict["QiDui"]="七对";
		huTypeDict["HaoHuaQiDui"]="豪华七对";
		huTypeDict["ChaoHaoHuaQiDui"]="超豪华七对";
		huTypeDict["QingYiSeQiDui"]="清一色七对";
		huTypeDict["QingYiSeYiTiaoLong"]="清一色一条龙";

		//分数
		huTypeDict["AnGangShu"]="暗杠数";
		huTypeDict["PengGangShu"]="碰杠数";
		huTypeDict["ZhiGangShu"]="直杠数";
		huTypeDict["DianGangShu"]="点杠数";
		return huTypeDict[huType];
	},
	ShowImage: function(childNode, imageString, cardID) {
		let childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
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
				.then(function(spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					childSprite.spriteFrame = spriteFrame;
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function(error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				});
		}
	},
});