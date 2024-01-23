(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zkmj/zkmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4bfa5rL1zhAk7X4OCd9a9Ec', 'zkmj_winlost_child', __filename);
// script/ui/uiGame/zkmj/zkmj_winlost_child.js

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
	UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
		var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var zhuaNiaoList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
		// this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), HuList.maList || [], HuList.zhongList || [], HuList.endPoint);
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

	ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, zhongList, endPoint) {
		zhongList = zhongList || [];
		ShowNode.active = !(zhongList.length <= 0 && maList.length <= 0);
		for (var i = 1; i <= 8; i++) {
			ShowNode.getChildByName('card' + i).active = false;
			ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
		}
		// if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
		//     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
		// }else{
		//     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
		//     return;
		// }
		for (var _i = 0; _i < maList.length; _i++) {
			var cardType = maList[_i];
			var node = ShowNode.getChildByName("card" + (_i + 1));
			this.ShowImage(node, 'EatCard_Self_', cardType);
			node.active = true;
			//更改为没中码都显示码牌
			if (typeof endPoint.huTypeMap["ZhongNiao"] != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0) {
				if (zhongList.indexOf(cardType) > -1) {
					node.color = cc.color(255, 255, 0);
				} else {
					node.color = cc.color(255, 255, 255);
				}
			} else {
				node.color = cc.color(255, 255, 255);
			}
		}
	},
	ShowImage: function ShowImage(childNode, imageString, cardID) {
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}
		//取卡牌ID的前2位
		var imageName = [imageString, cardID].join("");
		var imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return;
		}
		var imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			childSprite.spriteFrame = app['majiang_' + imageName];
		} else {
			var that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
				if (!spriteFrame) {
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return;
				}
				childSprite.spriteFrame = spriteFrame;
			}).catch(function (error) {
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
		}
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
			GF: "杠分",
			ZJD: "庄加底",
			GPF: "杠跑分",
			PF: "跑分",
			QYSJB: "清一色加倍",
			SHFF: "四混翻番",
			QDJB: "七对加倍",
			GK: "开杠加倍",
			ZMJD: "自摸加底",
			QMJD: "缺门加底",
			BFMF: "本风门分"
		};
		if (!huTypeDict.hasOwnProperty(huType)) {
			console.error("huType = " + huType + "is not exist");
		}

		return huTypeDict[huType];
	},
	IsNotShowScore: function IsNotShowScore(huType) {
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	IsShowMulti2: function IsShowMulti2(huType) {
		var multi2 = [];
		var isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		var huInfo = huInfoAll['endPoint'].huTypeMap;
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			if (huType == "HDLY" || huType == "GSKH") {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
			} else if (this.IsShowMulti2(huType)) {
				this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "*2");
			} else if (this.IsNotShowScore(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			} else {
				var huTypeStr = huPoint == 0 ? this.LabelName(huType) : this.LabelName(huType) + "：" + huPoint;
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeStr);
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
			}
			console.log("ShowPlayerJieSuan", huType, huPoint);
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
        //# sourceMappingURL=zkmj_winlost_child.js.map
        