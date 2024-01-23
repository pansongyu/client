(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dcwdmj/dcwdmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '51bf9wo8KZFSqi6JG9mP4vd', 'dcwdmj_winlost_child', __filename);
// script/ui/uiGame/dcwdmj/dcwdmj_winlost_child.js

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
		var LabelArray = {
			PH: "平胡",
			MMF: "买马分",
			JM: "奖码",
			LP: "烂牌",
			QYY: "全有赢",
			QXLH: "七星烂胡",
			PPH: "碰碰胡",
			LH: "烂胡",
			YJP: "幺九牌",
			QD: "七对",
			GK: "杠开",
			WB: "无宝",
			GKLF: "杠开连翻",
			TianHu: "天湖",
			ZJBS: "庄家",
			YB: "有宝"
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
		var huTypeMap = huInfo.huTypeMap;
		for (var huType in huTypeMap) {
			var huPoint = huTypeMap[huType];
			if (huType == "QYY" || huType == "ZJBS") {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "x2");
			} else if (huType == "QD" || huType == "GKLF") {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint + "x4");
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
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
        //# sourceMappingURL=dcwdmj_winlost_child.js.map
        