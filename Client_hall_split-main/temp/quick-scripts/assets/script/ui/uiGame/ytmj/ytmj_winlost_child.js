(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/ytmj/ytmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6e4f1U/wzJO7pIr6UXbPe5p', 'ytmj_winlost_child', __filename);
// script/ui/uiGame/ytmj/ytmj_winlost_child.js

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
	LabelName: function LabelName(huType) {
		var huTypeDict = {
			Gang: "杠",
			AnGang: "暗杠",
			JieGang: "接杠",
			FeiLong: "四宝飞龙",
			FeiBao: "飞宝",
			PingHu: "平胡",
			PPHu: "碰碰胡",
			ZYS: "字一色",
			QYS: "清一色",
			HYS: "混一色",
			SSL: "十三烂",
			QSSL: "七星十三烂",
			DDHu: "七小对",
			HDDHu: "豪华七小对",
			CHDDHu: "超豪华七小对",
			CCHDDHu: "超级豪华七小对",
			DiHu: "地胡",
			TianHu: "天胡",
			GSKH: "杠上开花",
			QGH: "抢杠胡",
			GSP: "杠上炮",
			DouBao: "兜宝",
			FaBao: "罚宝",
			DD: "单吊"
		};
		return huTypeDict[huType];
	},
	ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, jin2) {
		console.log("ShowPlayerShowCard", cardIDList, handCard, jin1, jin2);
		ShowNode.active = 1;
		var UICard_ShowCard = ShowNode.getComponent("ytmj_UIMJCard_ShowCard");
		UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
	},
	ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard, jin1, jin2) {
		ShowNode.active = 1;
		var UICard_DownCard = ShowNode.getComponent("ytmj_UIMJCard_Down");
		UICard_DownCard.ShowDownCard(publishcard, jin1, jin2);
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
        //# sourceMappingURL=ytmj_winlost_child.js.map
        