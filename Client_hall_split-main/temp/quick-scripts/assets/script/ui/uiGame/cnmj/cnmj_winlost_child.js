(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/cnmj/cnmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b1901gC+ERLI4SthUVKM1L5', 'cnmj_winlost_child', __filename);
// script/ui/uiGame/cnmj/cnmj_winlost_child.js

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
		this.posResultInfo = HuList;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		// this.ShowDetailScores(PlayerNode.getChildByName('scores'));
		this.ShowPiaoMaiState(PlayerNode);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacardscrollView'), HuList.huaList);
	},
	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		var isTing = HuList["isTing"];
		// let isDisoolve = HuList["isDisoolve"];

		ShowNode.getChildByName('ting').active = isTing;
		// ShowNode.getChildByName('jiesanzhe').active = isDisoolve;

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
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNode.getComponent(cc.Label).string = '接炮';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else if (huType == this.ShareDefine.HuType_GSKH) {
			huNode.getComponent(cc.Label).string = '杠上花';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},

	ShowDetailScores: function ShowDetailScores(scoreNodes) {
		scoreNodes.getChildByName("lb_huPoint").getComponent(cc.Label).string = "胡牌: " + this.posResultInfo["huPoint"];
		scoreNodes.getChildByName("lb_gangPoint").getComponent(cc.Label).string = "杠分: " + this.posResultInfo["gangPoint"];
		scoreNodes.getChildByName("lb_piaoPoint").getComponent(cc.Label).string = "漂分: " + this.posResultInfo["piaoPoint"];
		scoreNodes.getChildByName("lb_genPoint").getComponent(cc.Label).string = "跟庄: " + this.posResultInfo["genPoint"];
	},

	ShowPiaoMaiState: function ShowPiaoMaiState(PlayerNode) {
		var lb_piaoFen = PlayerNode.getChildByName("lb_piaoFen").getComponent(cc.Label);
		var lb_mai = PlayerNode.getChildByName("lb_mai").getComponent(cc.Label);

		var piaoFenStr = "";
		// if (this.posResultInfo["piaoFen"] == 0) piaoFenStr = "不漂" + this.posResultInfo["piaoFen"];
		// else if (this.posResultInfo["piaoFen"] != -1) piaoFenStr = "漂" + this.posResultInfo["piaoFen"];
		lb_piaoFen.string = piaoFenStr;

		var maiStr = "";
		// if (this.posResultInfo["piaoFen"] == 1) maiStr = "买";
		// else if (this.posResultInfo["piaoFen"] == 0) maiStr = "不买";
		lb_mai.string = maiStr;
	},

	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		// let huInfo = huInfoAll.endPoint.huTypeMap;
		var huInfo = huInfoAll.huTypeMap;
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
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function LabelName(huType) {
		var huTypeDict = {};
		huTypeDict["QDHu"] = "七对";
		huTypeDict["QYSQD"] = "清七对";
		huTypeDict["HDDHu"] = "龙七对";
		huTypeDict["QYSHDDHu"] = "清龙七对";
		huTypeDict["PPH"] = "对对胡";
		huTypeDict["QYSPPH"] = "清大对";
		huTypeDict["GSKH"] = "杠开";
		huTypeDict["PingHu"] = "平胡";
		huTypeDict["ZhongZhang"] = "中张";
		huTypeDict["MenQing"] = "门清";
		huTypeDict["DD"] = "金钩钩";
		huTypeDict["WuJingHu"] = "无鬼";
		huTypeDict["GSKH"] = "杠上花";
		huTypeDict["GSP"] = "杠上炮";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["DiHu"] = "地胡";
		huTypeDict["ZiMo"] = "自摸";
		huTypeDict["QGH"] = "抢杠胡";
		huTypeDict["SiGuiYi"] = "归";
		huTypeDict["QYS"] = "清一色";
		huTypeDict["QiangJin"] = "抢提胡";
		huTypeDict["PiaoFen"] = "飘分";

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
        //# sourceMappingURL=cnmj_winlost_child.js.map
        