/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
    },

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, zhuaNiaoList = null) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), HuList.maList || [], HuList.zhongList || [], HuList.endPoint);
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

    ShowPlayerNiaoPai: function (ShowNode, maList, zhongList, endPoint) {
        zhongList = zhongList || [];
        ShowNode.active = !(zhongList.length <= 0 && maList.length <= 0);
        for (let i = 1; i <= 8; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        // if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
        // }else{
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
        //     return;
        // }
        for (let i = 0; i < maList.length; i++) {
            let cardType = maList[i];
            let node = ShowNode.getChildByName("card" + (i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            //更改为没中码都显示码牌
            if (typeof (endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0) {
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
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
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
    LabelName: function (huType) {
        let huTypeDict = {};

		huTypeDict["QYS"] = "清一色";
		huTypeDict["QDHu"] = "小七对";
		huTypeDict["HDDHu"] = " 豪华七对";
		huTypeDict["CHDDHu"] = "双豪华七对";
		huTypeDict["CCHDDHu"] = "三豪华七对";
		huTypeDict["ZiMo"] = "自摸";
		huTypeDict["DianPao"] = "点炮";
		huTypeDict["DianGang"] = "点杠";
		huTypeDict["DianPeng"] = "点碰";
		huTypeDict["JiePao"] = " 接炮";
		huTypeDict["AnGang"] = "暗杠";
		huTypeDict["Gang"] = "湾杠";
		huTypeDict["JieGang"] = "直杠";
		huTypeDict["GSKH"] = "杠上开花";
		huTypeDict["GSP"] = "杠上炮";
		huTypeDict["PPHu"] = "碰碰胡";
		huTypeDict["HDLY"] = "海底捞月";
		huTypeDict["QueYiSe"] = "缺一色";
		huTypeDict["BanBanHu"] = "板板胡";
		huTypeDict["XiaoFengHu"] = "小胡";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["DiHu"] = "地胡";
		huTypeDict["ShouZhuaYi"] = "大吊车";
		huTypeDict["JiangJiangHu"] = "将将胡";
		huTypeDict["ZhongNiao"] = "中鸟";

        return huTypeDict[huType];
    },
    IsNotShowScore: function (huType) {
        let multi2 = [
            
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    IsShowMulti2: function (huType) {
        let multi2 = [
            
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (huType == "HDLY" || huType == "GSKH") {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
            } else if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "*2");
            } else if (this.IsNotShowScore(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			} else {
                let huTypeStr = huPoint == 0 ? this.LabelName(huType) : this.LabelName(huType) + "：" + huPoint;
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeStr);
				// this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
});
