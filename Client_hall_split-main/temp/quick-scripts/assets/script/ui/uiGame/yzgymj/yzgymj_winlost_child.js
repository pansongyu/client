(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yzgymj/yzgymj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'de588l+/5hGaaXQ+hQR8frp', 'yzgymj_winlost_child', __filename);
// script/ui/uiGame/yzgymj/yzgymj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		huaNum: cc.Node
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var maPaiLst = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示竞技点
		if (typeof HuList.sportsPoint != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},
	LabelName: function LabelName(huType) {
		var LabelArray = {
			XiaoXi: "小喜+",
			DaXi: "大喜+",
			GSKH: "杠开+",
			QGH: "抢杠胡+",
			HDLY: "海底捞月+",
			HYS: "混一色+",
			QYS: "清一色+",
			DaSanFeng: "大三风+",
			XiaoSanFeng: "小三风+",
			YTL: "一条龙+",
			SanZhao: "三招+",
			SiZhao: "四招+",
			DDHu: "对对胡+",
			QDHu: "七对+",
			HDDHu: "双七对+",
			CHDDHu: "双双七对+",
			CCHDDHu: "豪华七对+",
			HuPai: "胡牌+",
			WuHuaGuo: "无花果+",
			MenQing: "门清+",
			Hua: "花+",
			DiFen: "底分+",
			DDC: "大吊车*",
			WuDaZiMo: "无搭自摸*",
			BaoSanZui: "包三嘴",
			ZhengGuoDuan: "整锅端"
		};
		return LabelArray[huType];
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		var huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		var lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
		var zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
		var difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
		lianZhuang.string = "";
		zhuang.string = "";
		difen.string = "";
		ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
		var huTypeMap = huInfo["huTypeMap"];
		for (var huType in huTypeMap) {
			var huPoint = huTypeMap[huType];
			if (huType == "DiFen") {
				difen.string = this.LabelName(huType) + huPoint;
			} else if (huType == "LianZhuang") {
				lianZhuang.string = this.LabelName(huType) + huPoint;
			} else if (huType == "PiaoFen") {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), "插" + huPoint + "盘");
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "番");
			}
		}
	},
	ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
		huacardscrollView.active = true;
		if (hualist.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		} else {
			this.huaNum.active = false;
			this.huaNum.getComponent(cc.Label).string = "";
		}
		var view = huacardscrollView.getChildByName("view");
		var ShowNode = view.getChildByName("huacard");
		var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");

		UICard_ShowCard.Show20HuaList(hualist);
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
        //# sourceMappingURL=yzgymj_winlost_child.js.map
        