(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xxmj/xxmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7d429tdjIVJyIP0AaOPEYub', 'xxmj_winlost_child', __filename);
// script/ui/uiGame/xxmj/xxmj_winlost_child.js

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
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		ShowNode.getChildByName("paofen").getComponent(cc.Label).string = "";
		var piaofen = huInfoAll["piaoFen"];
		if (piaofen > -1) {
			ShowNode.getChildByName("paofen").getComponent(cc.Label).string = "跑：+" + piaofen;
		}
		var huInfo = huInfoAll['endPoint'].huTypeMap;
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			if (huPoint != 0) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			}
			/*if (this.IsShowMulti2(huType)) {
   	this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*2");
   } else {
   	this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
   }*/
			console.log("ShowPlayerJieSuan", huType);
		}
	},

	IsShowMulti2: function IsShowMulti2(huType) {
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},

	LabelName: function LabelName(huType) {
		var huTypeDict = {
			GSKH: "杠上花",
			QDHu: "七对",
			DianGang: "点杠",
			AnGang: "暗杠",
			Gang: "续杠",
			JieGang: "直杠",
			Zhuang: "庄加底",
			GangPao: "杠跑",
			QiDuiJiaBei: "七对加倍",
			GSHJiaBei: "杠上花加倍",
			ZiMoJiaBei: "自摸加倍",
			PaoFen: "跑分",
			DianPeng: "点碰"
		};
		if (!huTypeDict.hasOwnProperty(huType)) {
			console.error("huType = " + huType + "is not exist");
		}

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
        //# sourceMappingURL=xxmj_winlost_child.js.map
        