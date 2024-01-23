/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {},
	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		console.log("单局结算数据", setEnd, playerAll, index);
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = setEnd.dPos;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		let posCount = posResultList.length;
		for (let i = 0; i < posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.fanXingList);
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
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
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, fanXingList) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		//this.ShowPlayerNiaoPai(PlayerNode.getChildByName('niaopai'), maList, HuList, HuList.huType);
		//this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),fanXingList,HuList.zhongList);

		this.ShowPlayerJiePao(PlayerNode.getChildByName('jiepao'),PlayerNode.getChildByName('jiepao_demo'),HuList.jiePaoPosList,HuList.jiePaoCardList);

		// this.ShowPlayerScoreDetail(PlayerNode.getChildByName('scoreDetail'), HuList);
	},
	ShowPlayerJiePao:function(showNode,demo,jiePaoPosList,jiePaoCardList){
		showNode.removeAllChildren();
		for(let i=0;i<jiePaoCardList.length;i++){
			let addNode = cc.instantiate(demo);
			addNode.x=0;
			addNode.y=0;
			showNode.addChild(addNode);
			addNode.active=true;
			this.ShowImage(addNode, 'EatCard_Self_', jiePaoCardList[i]);
			this.ShowJiePao(addNode.getChildByName("lb"),jiePaoPosList[i]);
		}
	},
	ShowJiePao:function(lb,jiepao){
		let lbString="";
		if(jiepao=="zhuangXia"){
			lbString="庄下";
		}else if(jiepao=="zhuangShang"){
			lbString="庄上";
		}else if(jiepao=="zhuangDui"){
			lbString="庄对";
		}else if(jiepao=="zhuangJia"){
			lbString="庄家";
		}
		lb.getComponent(cc.Label).string=lbString;
	},
	// "huPaiPoint":0,胡牌分
	// "gangPoint":0,//杠分
	// "maPoint":0,//码分
	// "chaoZhuangPoint":1,//抄庄分
	// "liuJuPoint":0,//流局分
	ShowPlayerScoreDetail: function (scoreDetailNode, HuList) {
		scoreDetailNode.getChildByName("lb_huPaiPoint").getComponent(cc.Label).string = "胡牌分:" + HuList.huPaiPoint;
		scoreDetailNode.getChildByName("lb_gangPoint").getComponent(cc.Label).string = "杠分:" + HuList.gangPoint;
		scoreDetailNode.getChildByName("lb_maPoint").getComponent(cc.Label).string = "码分:" + HuList.maPoint;
		scoreDetailNode.getChildByName("lb_chaoZhuangPoint").getComponent(cc.Label).string = "抄庄分:" + HuList.chaoZhuangPoint;
		scoreDetailNode.getChildByName("lb_liuJuPoint").getComponent(cc.Label).string = "流局分:" + HuList.liuJuPoint;
	},
	ShowPlayerHuaCard: function (showNode,maList,zhonglist) {
		let zhongMaList = zhonglist;
		for (let i = 1; i <= 6; i++) {
			showNode.getChildByName("card" + i).active = false;
			showNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
		}
		if (maList.length == 0) {
			return;
		}
		for (let i = 0; i < maList.length; i++) {
			let cardType = maList[i];
			let node = showNode.getChildByName("card" + (i + 1));
			this.ShowImage(node, 'EatCard_Self_', cardType);
			node.active = true;
			if (zhongMaList.indexOf(cardType) > -1) {
				node.color = cc.color(255, 255, 0);
			}
		}
	},
	ShowImage: function (childNode, imageString, cardID) {
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        //取卡牌ID的前2位
        let imageName = [imageString, cardID].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                })
                .catch(function (error) {
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                });
        }
    },
	ShowPlayerRecord: function (ShowNode, huInfo) {
		let absNum = Math.abs(huInfo["point"]);
		if (absNum > 10000) {
			let shortNum = (absNum / 10000).toFixed(2);
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
		if (typeof (huInfo.sportsPointTemp) != "undefined") {
			ShowNode.getChildByName('tip_sportspoint').active = true;
			if (huInfo.sportsPointTemp > 0) {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
			} else {
				ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
			}
		} else if (typeof (huInfo.sportsPoint) != "undefined") {
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
	ShowPlayerHuImg: function (huNode, huTypeName, isTing) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
		//默认颜色描边
		huNode.color = new cc.Color(252, 236, 117);
		huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
		huNode.getComponent(cc.LabelOutline).Width = 2;
		if (typeof (huType) == "undefined") {
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
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = huInfoAll['endPoint'].huTypeMap;
		// this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
		for (let huType in huInfo) {
			let huPoint = huInfo[huType];
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
	IsShowScore: function (huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//个数
	IsShowNum: function (huType) {
		let multi2 = [];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	//倍数
	IsShowMulti2: function (huType) {
		let multi2 = [
			"YeShu",  //
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
	},
	LabelName: function (huType) {
		let huTypeDict = this.GetHuTypeDict();
		return huTypeDict[huType];
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function () {
		let huTypeDict = {};
		huTypeDict["GF"]="杠分";
		huTypeDict["ZM"]="自摸";
		huTypeDict["PH"]="炮胡";
		huTypeDict["ZFB"]="中发白";
		huTypeDict["HSF"]="黑三枫";
		huTypeDict["AG"]="暗杠";
		huTypeDict["JG"]="接杠";
		huTypeDict["BG"]="补杠";
		huTypeDict["DG"]="点杠";
		huTypeDict["DP"]="点炮";
		return huTypeDict;
	},
	// GetHuTypeDict -end-

});
