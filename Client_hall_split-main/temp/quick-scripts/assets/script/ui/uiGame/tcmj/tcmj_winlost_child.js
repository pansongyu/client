(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/tcmj/tcmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'be4921DtIxBlLWV7QHwj9rv', 'tcmj_winlost_child', __filename);
// script/ui/uiGame/tcmj/tcmj_winlost_child.js

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
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		var huType = posResultList[index]['huType'];
		this.ShowPlayerHuImg(huNode, huType);
		var huaCard = this.node.getChildByName("huacardscrollView").getChildByName("view");
		huaCard.active = false;
		var layout = huaCard.getChildByName("content");
		for (var _i = 0; _i < layout.children.length; _i++) {
			layout.children[_i].getComponent(cc.Sprite).spriteFrame = "";
			layout.children[_i].children[0].active = false;
		}
		var banGangMap = setEnd["banGangMap"];
		var banGangList = [];
		if (this.ShareDefine.HuTypeStringDict[huType] != this.ShareDefine.HuType_NotHu && this.ShareDefine.HuTypeStringDict[huType] != this.ShareDefine.HuType_DianPao) {
			if (JSON.stringify(banGangMap) == "{}") {
				return;
			}
			var banGangCom = layout.getComponent("UIMJCard_ShowHua");
			for (var key in banGangMap) {
				var value = banGangMap[key];
				banGangList.push({ "cardID": key, "isBanGang": value });
			}
			huaCard.active = true;
			console.log("banGangList", banGangList);
			banGangCom.ShowBanGangMap(banGangList, jin1, jin2);
		}
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, banGangList);

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
		var banGangList = arguments[5];

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示比赛分
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
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList["piaoHua"]);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		if (banGangList.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = banGangList.length + "个";
		}
	},
	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, piaoHua) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);
		ShowNode.getChildByName('piaofen').getComponent("cc.Label").string = "飘" + piaoHua + "分";
	},
	LabelName: function LabelName(huType) {
		var huTypeDict = {
			Hu: "胡",
			DiHua: "底花",
			YingHua: "硬花",
			PiHu: "平胡",
			MengQing: "门清",
			MenQing: "门清",
			WuHuaGuo: "无花果",
			LZP: "辣子牌",
			QYS: "清一色",
			HYS: "混一色",
			PPHu: "碰碰胡",
			QD: "门清",
			GSKH: "杠上开花",
			DDC: "大吊车",
			QGHu: "抢杠胡",
			GangHua: "杠",
			WuHuaGuoZhuaChong: "无花果抓冲"
		};
		return huTypeDict[huType];
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
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);
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
        //# sourceMappingURL=tcmj_winlost_child.js.map
        