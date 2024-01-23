(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/ptmj/ptmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f1c71uPQ8ZEaJCDcqhBtYLU', 'ptmj_winlost_child', __filename);
// script/ui/uiGame/ptmj/ptmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {},
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
		var maList = setEnd["zhongList"] || [];
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
	UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var maList = arguments[5];
		var zhongMaList = arguments[6];
		var posResultList = arguments[7];
		var dPos = arguments[8];

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
		this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maList, zhongMaList, HuList, posResultList, dPos);
	},
	ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
		var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		ShowNode.active = 1;
		var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCardByLKMJ(publishcard);
	},
	ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
		/*huacardscrollView.active = true;
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
  UICard_ShowCard.ShowHuaList(hualist);*/
	},
	ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, zhongMaList, huInfo, posResultList, dPos) {
		var pos = huInfo["pos"];
		// let zhongList = huInfo["zhongList"];
		ShowNode.opacity = 0;
		var cardlayout = ShowNode.getChildByName("cardlayout");
		for (var i = 0; i < cardlayout.children.length; i++) {
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
			return;
		}
		ShowNode.opacity = 255;
		for (var _i = 0; _i < maList.length; _i++) {
			var cardType = maList[_i];
			var node = cardlayout.children[_i];
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
		//显示杠分
		var gangFen = huInfo["huPaiPoint"];
		if (gangFen > 0) {
			gangFen = "+" + gangFen;
		}
		//显示胡牌分
		var huPaiFen = huInfo["daiHuPoint"];
		if (huPaiFen > -1) {
			huPaiFen = "+" + huPaiFen;
		}
		//显示带摸分
		var daiMoFen = huInfo["qianPiaoPoint"];
		if (daiMoFen > -1) {
			daiMoFen = "+" + daiMoFen;
		}
		var houPiaoPoint = huInfo["houPiaoPoint"];
		if (houPiaoPoint > -1) {
			houPiaoPoint = "+" + houPiaoPoint;
		}
		// ShowNode.getChildByName("recordstr").active = true;
		// ShowNode.getChildByName("recordstr").getComponent("cc.Label").string = "胡牌：" + huPaiFen + "    " + "逮胡：" + gangFen + "    " + "前漂：" + daiMoFen + "    " + "后漂：" + houPiaoPoint;
	},
	ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName, isTing) {
		/*huLbIcon
  *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
  *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
  */
		var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		//默认颜色描边
		huNode.color = new cc.Color(252, 236, 117);
		huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
		huNode.getComponent(cc.LabelOutline).Width = 2;
		if (typeof huType == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNode.getComponent(cc.Label).string = '点炮';
			huNode.color = new cc.Color(192, 221, 245);
			huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
			huNode.getComponent(cc.LabelOutline).Width = 2;
			// if (isTing) {
			// 	huNode.getComponent(cc.Label).string = "报听点炮";
			// 	huNode.color = new cc.Color(192, 221, 245);
			// 	huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
			// 	huNode.getComponent(cc.LabelOutline).Width = 4;
			// }
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
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		var huInfo = huInfoAll["huTypeMap"];
		// let huInfo = huInfoAll['endPoint']["huTypeMap"] || huInfoAll["huTypeMap"];
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			if (this.IsShowMulti2(huType) || this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
			} else if (this.IsShowNum(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType]);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	//分数
	IsShowScore: function IsShowScore(huType) {
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//个数
	IsShowNum: function IsShowNum(huType) {
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti2: function IsShowMulti2(huType) {
		var multi2 = ["YeShu"];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function LabelName(huType) {
		var huTypeDict = {};
		huTypeDict["Hu"] = "胡";
		huTypeDict["SanJinYou"] = "三金游";
		huTypeDict["DanYou"] = "单游";
		huTypeDict["SanJinDao"] = "三金倒";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["QiangJin"] = "枪金";
		huTypeDict["PingHu"] = "平胡";
		huTypeDict["QGH"] = "抢杠胡";
		huTypeDict["JieGang"] = "接杠";
		huTypeDict["AnGang"] = "暗杠";
		huTypeDict["Gang"] = "补杠";
		huTypeDict["DiFen"] = "底分";
		huTypeDict["LianZhuang"] = "连庄";
		huTypeDict["SanJinYou"] = "三金游";
		return huTypeDict[huType];
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
        //# sourceMappingURL=ptmj_winlost_child.js.map
        