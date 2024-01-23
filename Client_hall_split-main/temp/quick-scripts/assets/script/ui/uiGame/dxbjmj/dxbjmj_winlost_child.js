(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dxbjmj/dxbjmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8eab4f3fEdLdZn3wbbW1E0l', 'dxbjmj_winlost_child', __filename);
// script/ui/uiGame/dxbjmj/dxbjmj_winlost_child.js

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
		console.log("单局结算数据", setEnd, playerAll, index);
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
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.zhuaNiaoList);
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index]["isTing"]);

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
		var zhuaNiaoList = arguments[5];

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		// this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
		// this.ShowPlayerScoreDetail(PlayerNode.getChildByName('scoreDetail'), HuList);
	},
	// "huPaiPoint":0,胡牌分
	// "gangPoint":0,//杠分
	// "maPoint":0,//码分
	// "chaoZhuangPoint":1,//抄庄分
	// "liuJuPoint":0,//流局分
	ShowPlayerScoreDetail: function ShowPlayerScoreDetail(scoreDetailNode, HuList) {
		scoreDetailNode.getChildByName("lb_huPaiPoint").getComponent(cc.Label).string = "胡牌分:" + HuList.huPaiPoint;
		scoreDetailNode.getChildByName("lb_gangPoint").getComponent(cc.Label).string = "杠分:" + HuList.gangPoint;
		scoreDetailNode.getChildByName("lb_maPoint").getComponent(cc.Label).string = "码分:" + HuList.maPoint;
		scoreDetailNode.getChildByName("lb_chaoZhuangPoint").getComponent(cc.Label).string = "抄庄分:" + HuList.chaoZhuangPoint;
		scoreDetailNode.getChildByName("lb_liuJuPoint").getComponent(cc.Label).string = "流局分:" + HuList.liuJuPoint;
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
			if (isTing) {
				huNode.getComponent(cc.Label).string = "报听点炮";
				huNode.color = new cc.Color(192, 221, 245);
				huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
				huNode.getComponent(cc.LabelOutline).Width = 4;
			}
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
		var huTypeDict = this.GetHuTypeDict();
		return huTypeDict[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function GetHuTypeDict() {
		var huTypeDict = {};
		huTypeDict["GSKH"] = "杠开";
		huTypeDict["ZiMo"] = "自摸";
		huTypeDict["QGH"] = "抢杠";
		huTypeDict["WuJinDao"] = "无宝";
		huTypeDict["PPHu"] = "碰碰胡";
		huTypeDict["DuDiao"] = "精吊";
		huTypeDict["DanYou"] = "杠吊";
		huTypeDict["ShuangYou"] = "双杠吊";
		huTypeDict["HYS"] = "混一色";
		huTypeDict["QYS"] = "清一色";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["DouBao"] = "奖精";
		huTypeDict["FaBao"] = "罚精";
		huTypeDict["DiHu"] = "地胡";
		huTypeDict["QDHu"] = "七对";
		huTypeDict["SSL"] = "十三烂";
		huTypeDict["QXSSL"] = "七星十三烂";
		huTypeDict["JingFen"] = "精分";
		huTypeDict["Gen"] = "抄庄";
		huTypeDict["Gang"] = "补杠";
		huTypeDict["JieGang"] = "接杠";
		huTypeDict["AnGang"] = "暗杠";

		return huTypeDict;
	}
	// GetHuTypeDict -end-

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
        //# sourceMappingURL=dxbjmj_winlost_child.js.map
        