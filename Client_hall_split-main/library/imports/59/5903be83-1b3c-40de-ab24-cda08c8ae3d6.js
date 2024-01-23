"use strict";
cc._RF.push(module, '5903b6DGzxA3qskzaCMiuPW', 'njmj_winlost_child');
// script/ui/uiGame/njmj/njmj_winlost_child.js

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
        var maList = setEnd["maList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maList);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

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
        var maList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName("scrollview").getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan').getChildByName("scrollview"), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maList, HuList, HuList.huType);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isBaoTing = HuList["isBaoTing"];
        var isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('ting').active = isBaoTing;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        //买码飘分
        var piaoFen = huInfoAll["piaoFen"];
        var piaoFenStr = "";
        if (piaoFen == 1) {
            piaoFenStr = "买";
        } else if (piaoFen == 0) {
            piaoFenStr = "不买";
        } else {
            piaoFenStr = "";
        }
        if (piaoFenStr != "") {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + piaoFenStr + "]");
        }

        this.noShowScore = ["Zhuang", "GenZhuangShengJi", "HuangZhuangShengJi"]; // 不显示分数的胡类型
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

    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, huInfo, huType) {
        var zhongList = huInfo["zhongList"];
        ShowNode.active = false;
        for (var i = 1; i <= 8; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (maList.length == 0) {
            console.error("ShowPlayerNiaoPai", maList);
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
        for (var _i = 0; _i < maList.length; _i++) {
            var cardType = maList[_i];
            var node = ShowNode.getChildByName("card" + (_i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            if (zhongList.indexOf(cardType) > -1) {
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
        huTypeDict["QYS"] = "清一色";
        huTypeDict["WuHua"] = "无花";
        huTypeDict["GSKH"] = "大杠开花";
        huTypeDict["QDHu"] = "七对";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["DiHu"] = "地胡";
        huTypeDict["DianGang"] = "点杠";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["Gang"] = "碰杠";
        huTypeDict["JieGang"] = "直杠";
        huTypeDict["HDDHu"] = "豪华七对";
        huTypeDict["CHDDHu"] = "双豪华";
        huTypeDict["CCHDDHu"] = "三豪华";
        huTypeDict["FaFen"] = "罚分";
        huTypeDict["HuaGang"] = "花杠";
        huTypeDict["YingHua"] = "硬花";
        huTypeDict["RuanHua"] = "软花";
        huTypeDict["QYSKuaiZHao"] = "清一色快照";
        huTypeDict["KuaiZHao"] = "普通快照";
        huTypeDict["Hu"] = "胡";
        huTypeDict["MenQing"] = "门清";
        huTypeDict["AGSKH"] = "小杠开花";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["PPHu"] = "碰碰胡";
        huTypeDict["WuHua"] = "无花果";
        huTypeDict["HDLY"] = "海底捞月";
        huTypeDict["BianJiaDiao"] = "压绝";
        huTypeDict["DD"] = "全求独钓";
        huTypeDict["ZYS"] = "四连风";
        huTypeDict["Zhuang"] = "比下胡";
        huTypeDict["QYSKuaiZHao"] = "清一色快照";
        huTypeDict["KuaiZHao"] = "普通快照";
        huTypeDict["BaoHu"] = "包牌";
        huTypeDict["PiaoHua"] = "花砸2";

        return huTypeDict;
    }
    // GetHuTypeDict -end-
});

cc._RF.pop();