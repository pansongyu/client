"use strict";
cc._RF.push(module, '2ab071afFtLNq3mq7RBTuDu', 'xgkwxmj_winlost_child');
// script/ui/uiGame/xgkwxmj/xgkwxmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		icon_piao: [cc.SpriteFrame]
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
	},
	ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName, isPingHu) {
		/*huLbIcon
  *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
  *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
  */
		var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		if (typeof huType == "undefined") {
			huNode.getComponent(cc.Label).string = '';
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			if (isPingHu) {
				huNode.getComponent(cc.Label).string = '';
			} else {
				huNode.getComponent(cc.Label).string = '点泡';
			}
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			if (isPingHu) {
				huNode.getComponent(cc.Label).string = '胡';
			} else {
				huNode.getComponent(cc.Label).string = '接炮';
			}
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNode.getComponent(cc.Label).string = '自摸';
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNode.getComponent(cc.Label).string = '抢杠胡';
		} else {
			huNode.getComponent(cc.Label).string = '';
		}
	},
	ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
		var jin1 = setEnd.jin1;
		var jin2 = setEnd.jin2;
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
		if (posResultList[index]["isTing"] && posResultList[index]["huType"] == "ZiMo") {
			this.ShowPlayerMaPai(this.node.getChildByName('maPai'), setEnd.maiMa);
		} else {
			this.node.getChildByName('maPai').active = false;
		}
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
		var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isPingHu);

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
		var maPaiLst = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示比赛分
		if (typeof HuList.sportsPointTemp != "undefined") {
			if (HuList.sportsPointTemp > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
			}
		} else if (typeof HuList.sportsPoint != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
	},
	ShowPlayerMaPai: function ShowPlayerMaPai(showNode, maPai) {
		if (maPai <= 0) {
			showNode.active = false;
			return;
		}
		showNode.active = 1;
		var childNode = showNode.getChildByName("card01");
		childNode.active = 1;
		var childSprite = childNode.getComponent(cc.Sprite);
		if (!childSprite) {
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return;
		}
		var imageInfo = this.IntegrateImage["EatCard_Self_" + maPai];
		if (!imageInfo) {
			return;
		}
		var imagePath = imageInfo["FilePath"];
		if (app['majiang_' + "EatCard_Self_" + maPai]) {
			childSprite.spriteFrame = app['majiang_' + "EatCard_Self_" + maPai];
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
	ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

		var isTing = HuList["isTing"];
		ShowNode.getChildByName('img_ting').active = isTing;
		var piao = HuList["piao"];
		if (piao > 0) {
			ShowNode.getChildByName('img_piao').getComponent(cc.Sprite).spriteFrame = this.icon_piao[piao];
			ShowNode.getChildByName('img_piao').active = true;
		} else {
			ShowNode.getChildByName('img_piao').active = false;
		}
	},
	ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
		var absNum = Math.abs(huInfo["xianShiYongPoint"]);
		ShowNode.getChildByName('lb_record_win').active = false;
		ShowNode.getChildByName('lb_record_lost').active = false;
		if (absNum > 10000) {
			var shortNum = (absNum / 10000).toFixed(2);
			if (huInfo["xianShiYongPoint"] > 0) {
				ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + shortNum + "万";
				ShowNode.getChildByName('lb_record_win').active = true;
			} else {
				ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = '-' + shortNum + "万";
				ShowNode.getChildByName('lb_record_lost').active = true;
			}
		} else {
			if (huInfo["xianShiYongPoint"] > 0) {
				ShowNode.getChildByName('lb_record_win').getComponent("cc.Label").string = '+' + huInfo["xianShiYongPoint"];
				ShowNode.getChildByName('lb_record_win').active = true;
			} else {
				ShowNode.getChildByName('lb_record_lost').getComponent("cc.Label").string = huInfo["xianShiYongPoint"];
				ShowNode.getChildByName('lb_record_lost').active = true;
			}
		}
	},
	ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
		var huInfo = huInfoAll['endPoint'].huTypeMap;
		this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (var huType in huInfo) {
			var huPoint = huInfo[huType];
			if (huType == "Point") {
				continue;
			}
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
			// this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
			console.log("ShowPlayerJieSuan", huType, huPoint);
		}
	},
	/*ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
 	let huInfo = huInfoAll['endPoint'].huTypeMap;
 	for (let huType in huInfo) {
 		let huPoint = huInfo[huType];
 		if(huType == "AnGang" || huType == "Gang" || huType == "DianGang" || huType == "JieGang" || huType == "DiFen"
 			 || huType == "BaoHu"){
 			this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
 		}else if (huType == "GSKH") {
 			this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"：x"+huPoint);
 		}else if (huType == "ZiMo" || huType == "Hu" ) {
 			this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"("+huPoint+"家)");
 		}else{
 			this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType));
 		}
 	}
 },*/
	LabelName: function LabelName(huType) {
		var LabelArray = [];
		LabelArray['ShuKan'] = '数坎';
		LabelArray['Jian4cheng2'] = '见4乘2';
		LabelArray['ChuZi'] = '出字';
		LabelArray['QYSSZY'] = '清一色手抓一';
		LabelArray['QYSKWX'] = '清一色卡五星';
		LabelArray['QYSMSG'] = '清一色明四归';
		LabelArray['QYSASG'] = '清一色暗四归';
		LabelArray['ChaKan'] = '插坎';

		LabelArray['AnGang'] = '暗杠';
		LabelArray['JieGang'] = '接杠';
		LabelArray['Gang'] = '碰杠';
		LabelArray['AnGang'] = '暗杠';
		LabelArray['DianGang'] = '点杠';
		LabelArray['PingHu'] = '平胡';
		LabelArray['PPHu'] = '碰碰胡';
		LabelArray['KaWuXing'] = '卡五星';
		LabelArray['LiangDao'] = '亮倒';
		LabelArray['ShouZhuaYi'] = '手抓一';
		LabelArray['QYS'] = '清一色';
		LabelArray['QDHu'] = '七对胡';
		LabelArray['HDDHu'] = '豪华七小对';
		LabelArray['CHDDHu'] = '超级豪华对对胡';
		LabelArray['CCHDDHu'] = '超超级豪华对对胡';
		LabelArray['GSP'] = '杠上炮';
		LabelArray['QGH'] = '抢杠胡';
		LabelArray['DaSanYuan'] = '大三元';
		LabelArray['XiaoSanYuan'] = '小三元';
		LabelArray['MaiMa'] = '买马';
		LabelArray['ZiMo'] = '自摸';
		LabelArray['Hu'] = '胡';
		LabelArray['GSKH'] = '杠上花';
		LabelArray['SiMingGuiYi'] = '四明归一（全频道）';
		LabelArray['AnSiGuiYi'] = '暗四归一（全频道）';
		LabelArray['SiMingGuiYiB'] = '四明归一（半频道）';
		LabelArray['AnSiGuiYiB'] = '暗四归一（半频道）';
		LabelArray['DiFen'] = '底分';
		LabelArray['BaoHu'] = '包胡';
		LabelArray['MaiMa'] = '漂分';
		LabelArray['KanFen'] = '坎分';
		LabelArray['BQGH'] = '被抢杠胡扣分';
		LabelArray['PiaoFen'] = '飘分';
		return LabelArray[huType];
	}
});

cc._RF.pop();