(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/gymj/gymj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2c7ceaQB6dP16Gh/XEsJZqV', 'gymj_winlost_child', __filename);
// script/ui/uiGame/gymj/gymj_winlost_child.js

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
		var zhuaNiaoList = setEnd["zhuaNiaoList"] || [];
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, zhuaNiaoList);
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		/*if (posResultList[index]['isFeiTing']) {
  	this.node.getChildByName("user_info").getChildByName("ting").active = true;
  } else {
  	this.node.getChildByName("user_info").getChildByName("ting").active = false;
  }*/
		this.node.getChildByName("user_info").getChildByName("ting").active = false;
		if (posResultList[index]["isBaoTing"]) {
			this.node.getChildByName("user_info").getChildByName("feiting").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("feiting").active = false;
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
		var zhuaNiaoList = arguments[5];

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},
	ShowPlayerHuaCard: function ShowPlayerHuaCard(huacardscrollView, hualist) {
		huacardscrollView.active = true;
		// if (hualist.length > 0) {
		//     this.huaNum.active = true;
		//     this.huaNum.getComponent(cc.Label).string = hualist.length + "个";
		// }
		// else {
		//     this.huaNum.active = false;
		//     this.huaNum.getComponent(cc.Label).string = "";
		// }
		var view = huacardscrollView.getChildByName("view");
		var ShowNode = view.getChildByName("huacard");
		var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
		UICard_ShowCard.ShowHuaList(hualist);
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
	ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName) {
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
		var huInfo = huInfoAll['endPoint'].huTypeMap;
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			if (huPoint > 0) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			}
			/*let suffixStr = this.StringAddSuffix(huType);
   this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + suffixStr + huPoint);
   console.log("ShowPlayerJieSuan", huType, huPoint);*/
		}
	},
	StringAddSuffix: function StringAddSuffix(huType) {
		var zhuangStr = "：";
		var numStr = "：";
		var multipleStr = "x";
		var zhuangList = ["TianHu", "TuiDaoHu", "DuiDuiHu", "ZhengBuDa", "LuanBuDa"];
		var numList = ["Hua", "DianGang", "JieGang", "AnGang", "Gang", "ZhuangJia"];
		var multipleList = ["ZiMo", "JiePao"];
		if (zhuangList.indexOf(huType) > -1) {
			return zhuangStr;
		} else if (numList.indexOf(huType) > -1) {
			return numStr;
		} else if (multipleList.indexOf(huType) > -1) {
			return multipleStr;
		} else {
			console.error("遗漏的huType", huType);
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
		var multi2 = ["JiaJiaJuShu"];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti2: function IsShowMulti2(huType) {
		var multi2 = ["HaoHuaQiDui", //
		"ShuangHaoHuaQiDui", //
		"SanHaoHuaQiDui", //
		"TianHu", //
		"FeiTing", //
		"TingPaiDianPao", //
		"DaFeiJi"];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function LabelName(huType) {
		var huTypeDict = {
			// 牌型
			QYS: "清一色",
			WuHua: "无花",
			GSKH: "杠上开花",
			QDHu: "小七对",
			TianHu: "天胡",
			DiHu: "地胡",
			RenHu: "人胡",
			DianGang: "点杠",
			AnGang: "暗杠",
			Gang: "湾杠",
			JieGang: "直杠",
			Hua: "花"
		};
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
        //# sourceMappingURL=gymj_winlost_child.js.map
        