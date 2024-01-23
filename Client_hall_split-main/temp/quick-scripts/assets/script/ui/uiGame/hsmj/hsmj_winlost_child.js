(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/hsmj/hsmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e4200JO+05PB69uv6cS2/At', 'hsmj_winlost_child', __filename);
// script/ui/uiGame/hsmj/hsmj_winlost_child.js

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
		this.ShareDefine = app.ShareDefine();
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
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		var jin1 = setEnd.jin1;
		var jin2 = setEnd.jin2;
		var dPos = setEnd.dPos;
		var posResultList = setEnd["posResultList"];
		var posHuArray = new Array();
		var posCount = posResultList.length;
		for (var i = 0; i < posCount; i++) {
			var posInfo = posResultList[i];
			var pos = posInfo["pos"];
			var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		var PlayerInfo = playerAll[index];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
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
		var maPaiLst = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示比赛分
		if (typeof HuList.sportsPointTemp != "undefined") {
			if (HuList.sportsPointTemp > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
			}
		} else if (typeof HuList.sportsPoint != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.kouPais, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
	},
	ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
		ShowNode.active = 1;
		var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
		UICard_DownCard.ShowDownCard(publishcard, "EatCard_Self_");
	},
	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, kouPais, handCard, jin1, jin2) {
		ShowNode.active = 1;
		var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
		UICard_ShowCard.ShowShouCardByHsmj(cardIDList, kouPais, handCard, "EatCard_Self_", jin1, jin2);
	},
	LabelName: function LabelName(huType) {
		var huTypeDict = {
			PingHu: "底分",
			Bian_Hu: "边胡",
			Kan_Hu: "坎胡",
			Diao_Hu: "吊胡",
			AnGang: "暗杠",
			JieGang: "接杠",
			Gang: "补杠",
			KouPai: "扣牌",
			Zhuang: "庄家",
			Long: "一条龙"
		};
		return huTypeDict[huType];
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		var huInfo = huInfoAll['endPoint'].huTypeMap;
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
		}
	},
	ShowLabelName: function ShowLabelName(jiesuan, labelText) {
		if (this.showLabelNum > 16) {
			return;
		}
		jiesuan.getChildByName("label_" + this.showLabelNum.toString()).getComponent(cc.Label).string = labelText;
		this.showLabelNum = this.showLabelNum + 1;
	},
	ClearLabelShow: function ClearLabelShow(jiesuan) {
		for (var i = 1; i <= 16; i++) {
			jiesuan.getChildByName("label_" + i.toString()).getComponent(cc.Label).string = '';
		}
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
        //# sourceMappingURL=hsmj_winlost_child.js.map
        