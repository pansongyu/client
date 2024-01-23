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
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

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
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, zhuaNiaoList = null) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), HuList.maiMaList || [], HuList.zhongList || [], HuList.huType);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), zhuaNiaoList, [], HuList.huType);
        this.ShowOtherScore(PlayerNode.getChildByName('other'), HuList);
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

    ShowPlayerNiaoPai: function (ShowNode, maList, zhuaNiaoList, huType) {
        for (let i = 1; i <= 10; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (huType == "NotHu" || huType == "JiePao") {
            ShowNode.active = false;
            return
        } else {
            ShowNode.active = true;
        }
        for (let i = 0; i < maList.length; i++) {
            let cardType = maList[i];
            let node = ShowNode.getChildByName("card" + (i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            //更改为没中码都显示码牌
            if (zhuaNiaoList.indexOf(cardType) > -1) {
                node.color = cc.color(255, 255, 0);
            } else {
                node.color = cc.color(255, 255, 255);
            }
        }
    },
    ShowOtherScore: function (ShowNode, huInfo) {
        let gangFen = huInfo["gangPoint"];
        if (gangFen > 0) {
            ShowNode.getChildByName('lb_gangfen').active = true;
            ShowNode.getChildByName('lb_gangfen').getComponent("cc.Label").string = "杠分:+" + gangFen;
        } else {
            ShowNode.getChildByName('lb_gangfen').active = false;
        }

        let huPaiPoint = huInfo["huCardPoint"];
        if (huPaiPoint > 0) {
            ShowNode.getChildByName('lb_hupaifen').active = true;
            ShowNode.getChildByName('lb_hupaifen').getComponent("cc.Label").string = "胡牌分+:" + huPaiPoint;
        } else {
            ShowNode.getChildByName('lb_hupaifen').active = false;
        }

        let otherPoint = huInfo["jiaPoint"];
        if (otherPoint >= 0) {
            ShowNode.getChildByName('lb_ewaifen').active = true;
            ShowNode.getChildByName('lb_ewaifen').getComponent("cc.Label").string = "加分:+" + otherPoint;
        } else {
            ShowNode.getChildByName('lb_ewaifen').active = true;
            ShowNode.getChildByName('lb_ewaifen').getComponent("cc.Label").string = "加分:" + (otherPoint);
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
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else if (huType == this.ShareDefine.HuType_SiJinDao) {
            huNode.getComponent(cc.Label).string = '四金倒';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function (huType) {
        let huTypeDict = {};

		huTypeDict["GSKH"] = "杠上开花";
		huTypeDict["GSP"] = "杠放";
		huTypeDict["ZiMo"] = "自摸";
		huTypeDict["QGH"] = "抢杠胡";
		huTypeDict["DiHu"] = "地胡";
		huTypeDict["TianHu"] = "天胡";
		huTypeDict["SSL"] = "十三不靠";
		huTypeDict["QDHu"] = "七对胡";
		huTypeDict["BianJiaDiao"] = "夹子";
		huTypeDict["DanTing"] = "报胡";
		huTypeDict["QueYiSe"] = "缺一";
		huTypeDict["JieGang"] = "直杠";
		huTypeDict["Gang"] = "续杠";
		huTypeDict["AnGang"] = "暗杠";
		huTypeDict["JiePao"] = "炮胡";
		huTypeDict["PaoFen"] = "跑";
		huTypeDict["PiaoFen"] = "拉";
		huTypeDict["KanFen"] = "坐";
		huTypeDict["QXSSL"] = "七星十三不靠";
		huTypeDict["SSY"] = "十三幺";
		huTypeDict["Hua"] = "花";
		huTypeDict["PingHu"] = "平胡";

        return huTypeDict[huType];
    },
    IsNotShowScore: function (huType) {
        let multi2 = [
            "DiYuXJiaBei"
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    IsShowMulti2: function (huType) {
        let multi2 = [
            "AnGang",
            "JieGang",
            "Gang"
        ];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "x" + huPoint);
            } else if (this.IsNotShowScore(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + huPoint + "分加倍");
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
});
