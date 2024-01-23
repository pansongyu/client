(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yctjmj/yctjmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1b950df7a1Ig5brU05pDas6', 'yctjmj_winlost_child', __filename);
// script/ui/uiGame/yctjmj/yctjmj_winlost_child.js

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
			PingHu: "平胡",
			GangFen: "直杠",
			DianGangFen: "点杠",
			QD: "七小对",
			SSY: "十三幺",
			QYS: "清一色",
			YiTiaoLong: "一条龙",
			HeiSanFeng: "黑三风",
			Jin: "金",
			Zhuang: "庄",
			ZiMo: "自摸"
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
		//显示中马
		var zhongma = ShowNode.getChildByName("zhongma");
		zhongma.active = false;
		/*let maPaiList = huInfoAll["zhongMaList"];
  if (maPaiList.length > 0) {
  	zhongma.active = true;
  	zhongma.getComponent(cc.Label).string = "中" + maPaiList.length + "马";
  }*/

		var lianZhuang = ShowNode.getChildByName('lianzhuang').getComponent(cc.Label);
		var zhuang = ShowNode.getChildByName('zhuang').getComponent(cc.Label);
		var difen = ShowNode.getChildByName('difen').getComponent(cc.Label);
		lianZhuang.string = "";
		zhuang.string = "";
		difen.string = "";
		ShowNode.getChildByName('huawin').getComponent(cc.Label).string = "";
		var huTypeMap = huInfo["huTypeMap"];
		/*for (let huType in huTypeMap) {
  	let huPoint = huTypeMap[huType];
  	if (huType == "DiFen") {
  		difen.string = this.LabelName(huType) + huPoint;
  	} else if (huType == "LianZhuang") {
  		lianZhuang.string = this.LabelName(huType) + huPoint;
  	} else if (huType == "PiaoFen") {
  		this.ShowLabelName(ShowNode.getChildByName("label_lists"), "插" + huPoint + "盘");
  	} else {
  		this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "番");
  	}
  }*/
		for (var huType in huTypeMap) {
			var huPoint = huTypeMap[huType];
			this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
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
        //# sourceMappingURL=yctjmj_winlost_child.js.map
        