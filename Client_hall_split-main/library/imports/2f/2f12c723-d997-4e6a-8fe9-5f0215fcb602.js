"use strict";
cc._RF.push(module, '2f12ccj2ZdOao/pXwIV/LYC', 'zgqzmj_winlost_child');
// script/ui/uiGame/zgqzmj/zgqzmj_winlost_child.js

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
        this.posCount = posResultList.length;
        for (var i = 0; i < this.posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        var maiMaList = setEnd["maiMaList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maiMaList);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);
        this.lb_winListNum = this.node.getChildByName('jiesuan').getChildByName("scoreDetails").getChildByName('lb_winListNum').getComponent(cc.Label);
        this.lb_winListNum.string = posResultList[index]["winList"].join("");

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
        var maiMaList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maiMaList, HuList.endPoint, HuList.huType);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isMingBai = HuList["isMingBai"];
        var isBaoDing = HuList["isBaoDing"];
        var isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('baipai').active = isMingBai;
        ShowNode.getChildByName('baoding').active = isBaoDing;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
    },
    IsNoShowScore: function IsNoShowScore(huType) {
        var multi2 = this.noShowScore || [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = this.multi2 || [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    initData: function initData() {
        this.multi2 = [];
        this.noShowScore = ["Zhuang", "GenZhuangShengJi", "HuangZhuangShengJi", "ChaDaJiao"]; // 不显示分数的胡类型
        this.maxShowLabelNum = 8;
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        //买码飘分
        var huTypeDict = this.GetHuTypeDict();
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            // let point = huPointList[0];
            // let pointStr = huStrDict[huPointList[1]];
            // let huPoint = huPoint = point + pointStr;
            this.ShowHuType(ShowNode, huTypeDict, huType, huPoint);
        }
    },
    ShowHuType: function ShowHuType(ShowNode, huTypeDict, huType, huPoint) {
        if (this.IsShowMulti2(huType)) {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
        } else if (this.IsNoShowScore(huType)) {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType]);
        } else {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + ":" + huPoint);
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

    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maiMaList, endPoint, huType) {
        var zhongMaList = endPoint["zhongMaList"];
        ShowNode.active = false;
        for (var i = 1; i <= 8; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (maiMaList.length == 0) {
            console.error("ShowPlayerNiaoPai", maiMaList);
            return;
        }
        huType = this.ShareDefine.HuTypeStringDict[huType];
        //没胡得人不显示
        if (huType == this.ShareDefine.HuType_DianPao || huType == this.ShareDefine.HuType_NotHu) {
            return;
        }
        ShowNode.active = true;
        // if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
        // }else{
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
        //     return;
        // }
        for (var _i = 0; _i < maiMaList.length; _i++) {
            var cardType = maiMaList[_i];
            var node = ShowNode.getChildByName("card" + (_i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            if (zhongMaList.indexOf(cardType) > -1) {
                node.color = cc.color(255, 255, 0);
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
        this.huStringMap = {};
        this.huStringMap["HuOne"] = "接炮1";
        this.huStringMap["HuTwo"] = "接炮2";
        this.huStringMap["HuThree"] = "接炮3";
        this.huStringMap["HuFour"] = "接炮4";
        this.huStringMap["HuFive"] = "接炮5";
        this.huStringMap["ZiMoOne"] = "自摸1";
        this.huStringMap["ZiMoTwo"] = "自摸2";
        this.huStringMap["ZiMoThree"] = "自摸3";
        this.huStringMap["ZiMoFour"] = "自摸4";
        this.huStringMap["ZiMoFive"] = "自摸5";

        if (Object.hasOwnProperty.call(this.huStringMap, huTypeName)) {
            huNode.getComponent(cc.Label).string = this.huStringMap[huTypeName];
        } else {
            huNode.getComponent(cc.Label).string = '';
        }

        // let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        // if (typeof (huType) == "undefined") {
        //     huNode.getComponent(cc.Label).string = '';
        // } else if (huType == this.ShareDefine.HuType_DianPao) {
        //     huNode.getComponent(cc.Label).string = '点泡';
        // } else if (huType == this.ShareDefine.HuType_JiePao) {
        //     huNode.getComponent(cc.Label).string = '接炮';
        // } else if (huType == this.ShareDefine.HuType_ZiMo) {
        //     huNode.getComponent(cc.Label).string = '自摸';
        // } else if (huType == this.ShareDefine.HuType_QGH) {
        //     huNode.getComponent(cc.Label).string = '抢杠胡';
        // } else {
        //     huNode.getComponent(cc.Label).string = '';
        // }
    },
    // GetHuTypeDict -start-
    GetHuTypeDict: function GetHuTypeDict() {
        var huTypeDict = {};
        huTypeDict["GF"] = "杠分";
        huTypeDict["PH"] = "平胡";
        huTypeDict["DDZ"] = "大对子";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["QDD"] = "清大对";
        huTypeDict["QD"] = "七对";
        huTypeDict["LQD"] = "龙七对";
        huTypeDict["SLQD"] = "双龙七对";
        huTypeDict["QQD"] = "清七对";
        huTypeDict["QLQ"] = "青龙七";
        huTypeDict["QSL"] = "清双龙";
        huTypeDict["PIAO"] = "飘";
        huTypeDict["ZM"] = "自摸";
        huTypeDict["GUI"] = "归";
        huTypeDict["BJ"] = "报叫";
        huTypeDict["SB"] = "杀报";
        huTypeDict["TH"] = "天胡";
        huTypeDict["DH"] = "地胡";
        huTypeDict["KET"] = "卡二条";
        huTypeDict["GSH"] = "杠上花";
        huTypeDict["GSP"] = "杠上炮";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["JGG"] = "金钩钩";
        huTypeDict["LB"] = "萝卜";

        huTypeDict["ZM"] = "自摸";
        huTypeDict["ZMJD"] = "自摸加底";
        huTypeDict["ZMJF"] = "自摸加番";
        huTypeDict["CJF"] = "查叫分";
        huTypeDict["JGD"] = "金钩钓";

        return huTypeDict;
    }
    // GetHuTypeDict -end-
});

cc._RF.pop();