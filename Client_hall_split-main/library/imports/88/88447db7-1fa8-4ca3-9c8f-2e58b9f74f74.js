"use strict";
cc._RF.push(module, '8844723H6hMo5yPLli59090', 'gdjymj_winlost_child');
// script/ui/uiGame/gdjymj/gdjymj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        posSprite: [cc.SpriteFrame],
        headKuang: [cc.SpriteFrame],
        cardBg: [cc.SpriteFrame]
    },

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
        this.posCount = posResultList.length;
        for (var i = 0; i < this.posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        var maList = setEnd["maList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maList, posResultList, dPos);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        this.ShowHeadKuang(index, dPos);
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    ShowHeadKuang: function ShowHeadKuang(index, dPos) {
        var colorPos = this.GetPosColor(index, dPos);
        this.node.getChildByName("user_info").getChildByName("pos").getComponent(cc.Sprite).spriteFrame = this.posSprite[colorPos];
        this.node.getChildByName("user_info").getChildByName("img_txk").getComponent(cc.Sprite).spriteFrame = this.headKuang[colorPos];
    },
    GetPosColor: function GetPosColor(posID, dPos) {
        //0-黄 1-紫 2-蓝 3-绿
        var dDownPos = -1; //庄下家
        var dFacePos = -1; //庄对家
        var dUpPos = -1; //庄上家
        var count = this.posCount;
        if (count == 2) {
            dFacePos = dPos == 0 ? 1 : 0;
        } else if (count == 3) {
            dUpPos = (dPos + count - 1) % count;
            dDownPos = (dPos + 1) % count;
        } else {
            dUpPos = (dPos + count - 1) % count;
            dDownPos = (dPos + 1) % count;
            dFacePos = (dPos + 2) % count;
        }
        if (posID == dPos) {
            return 0;
        } else if (posID == dDownPos) {
            return 1;
        } else if (posID == dFacePos) {
            return 2;
        } else if (posID == dUpPos) {
            return 3;
        }
    },
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var maList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
        var posResultList = arguments[6];
        var dPos = arguments[7];

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName("scrollview").getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan').getChildByName("scrollview"), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maList, HuList, posResultList, dPos);
        this.ShowMaiMaScoreDetails(PlayerNode.getChildByName('maimascores'), HuList.pointMap);
        this.ShowKaiMa(PlayerNode.getChildByName('kaima'), HuList.kaiMaList, HuList.kaiZhongList);
    },

    ShowMaiMaScoreDetails: function ShowMaiMaScoreDetails(scoreNodes, scoreDetails) {
        scoreNodes.getChildByName("lb_zhuangJia").getComponent(cc.Label).string = this.ScoreAddSubtract(scoreDetails["zhuangJia"]);
        scoreNodes.getChildByName("lb_zhuangXia").getComponent(cc.Label).string = this.ScoreAddSubtract(scoreDetails["zhuangXia"]);
        scoreNodes.getChildByName("lb_zhuangDui").getComponent(cc.Label).string = this.ScoreAddSubtract(scoreDetails["zhuangDui"]);
        scoreNodes.getChildByName("lb_zhuangShang").getComponent(cc.Label).string = this.ScoreAddSubtract(scoreDetails["zhuangShang"]);
    },

    ShowKaiMa: function ShowKaiMa(kaimaNodes, kaiMaList, kaiZhongList) {
        kaimaNodes.active = kaiMaList.length != 0;

        var isShowWin1 = kaiMaList.indexOf(kaiZhongList[0]) > -1;
        var isShowWin2 = kaiMaList.indexOf(kaiZhongList[0]) > -1;
        this.ShowLoseWinMaIcon(kaimaNodes.getChildByName("card1"), isShowWin1);
        this.ShowLoseWinMaIcon(kaimaNodes.getChildByName("card2"), isShowWin2);

        kaimaNodes.getChildByName("card1").active = !!kaiMaList[0];
        kaimaNodes.getChildByName("card2").active = !!kaiMaList[1];
        this.ShowImage(kaimaNodes.getChildByName("card1"), 'EatCard_Self_', kaiMaList[0]);
        this.ShowImage(kaimaNodes.getChildByName("card2"), 'EatCard_Self_', kaiMaList[1]);
    },

    ScoreAddSubtract: function ScoreAddSubtract(score) {
        return score > 0 ? "+" + score : score;
    },

    ShowLoseWinMaIcon: function ShowLoseWinMaIcon(cardNode, isShowWin) {
        cardNode.getChildByName("img_ym2").active = isShowWin;
        cardNode.getChildByName("img_sm2").active = !isShowWin;
    },

    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isDisoolve = HuList["isDisoolve"];
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        this.noShowScore = []; // 不显示分数的胡类型
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            var isNoShowScore = this.noShowScore.indexOf(huType) != -1;
            if (isNoShowScore) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
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

    ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, jin2) {
        ShowNode.active = 1;
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
    },
    ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        ShowNode.active = 1;
        var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByJDZMJ(publishcard, this.posCount, jin1, jin2);
    },

    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, huInfo, posResultList, dPos) {
        var pos = huInfo["pos"];
        // let zhongList = huInfo["zhongList"];
        ShowNode.active = false;
        for (var i = 1; i <= 6; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (maList.length == 0) {
            console.error("ShowPlayerNiaoPai", maList);
            return;
        }
        // huType = this.ShareDefine.HuTypeStringDict[huType];
        //没胡得人不显示
        if (dPos != pos) {
            return;
        }
        ShowNode.active = true;
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
            node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = "";
            for (var j = 0; j < posResultList.length; j++) {
                var zhongList = posResultList[j].zhongList;
                if (zhongList.indexOf(cardType) > -1) {
                    var colorPos = this.GetPosColor(j, dPos);
                    node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.cardBg[colorPos];
                    // node.getChildByName("bg").active = true;
                    break;
                }
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
        var huTypeDict = this.GetHuTypeDict();
        return huTypeDict[huType];
    },

    // GetHuTypeDict -start-
    GetHuTypeDict: function GetHuTypeDict() {
        var huTypeDict = {};
        huTypeDict["PH"] = "平胡";
        huTypeDict["GSKH"] = "杠上开花";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["QD"] = "七对";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["HQD"] = "豪七对";
        huTypeDict["YJ"] = "幺九";
        huTypeDict["SSY"] = "十三幺";
        huTypeDict["WGJB"] = "无鬼加倍";
        huTypeDict["SGJB"] = "四鬼加倍";
        huTypeDict["JMF"] = "奖马分";
        huTypeDict["MMF"] = "买马分";
        huTypeDict["GZ"] = "跟庄";
        huTypeDict["AG"] = "暗杠";
        huTypeDict["JG"] = "接杠";
        huTypeDict["BG"] = "补杠";
        huTypeDict["GF"] = "杠分";

        return huTypeDict;
    }
    // GetHuTypeDict -end-
});

cc._RF.pop();