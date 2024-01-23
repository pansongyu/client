(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/lskjjmj/lskjjmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '279e9k8Wm5G5q8Pxu2fNSAh', 'lskjjmj_winlost_child', __filename);
// script/ui/uiGame/lskjjmj/lskjjmj_winlost_child.js

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
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maiMaList, HuList.endPoint, HuList.huType);
        // this.ShowPlayerPiaoJingList(PlayerNode.getChildByName('zhongma'), HuList.piaoJingList, jin1, jin2);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var isTing = HuList["isTing"];
        var isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('ting').active = isTing;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
    },

    ShowPlayerPiaoJingList: function ShowPlayerPiaoJingList(showNode, piaoJingList, jin1, jin2) {
        for (var i = 1; i <= 8; i++) {
            showNode.getChildByName("card" + i).active = false;
            showNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
            showNode.getChildByName("card" + i).getChildByName("da").active = false;
            showNode.getChildByName("card" + i).getChildByName("icon_fu").active = false;
        }
        for (var _i = 0; _i < piaoJingList.length; _i++) {
            var cardID = piaoJingList[_i];
            var node = showNode.getChildByName("card" + (_i + 1));
            var cardType = Math.floor(cardID / 100);
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;

            this.ShowJinBgByNode(cardID, node, jin1, jin2);
        }
    },

    ShowJinBgByNode: function ShowJinBgByNode(cardID, childNode) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        childNode.color = cc.color(255, 255, 255);
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = false;
        }
        if (childNode.getChildByName("icon_fu")) {
            childNode.getChildByName("icon_fu").active = false;
        }

        if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = true;
            }
        } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
            childNode.color = cc.color(255, 255, 125);
            if (childNode.getChildByName("icon_fu")) {
                childNode.getChildByName("icon_fu").active = true;
            }
        }
    },

    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        //买码飘分
        // let maiMa = huInfoAll["maiMa"];
        // let piaoHua = huInfoAll["piaoHua"];
        // let maiMaStr = "";
        // let piaoHuaStr = "";
        // if(maiMa == 1){
        //     maiMaStr = "买2码";
        // }else if(maiMa == 2){
        //     maiMaStr = "买4码";
        // }else if(maiMa == 0){
        //     maiMaStr = "不买";
        // }else{
        //     maiMaStr = "";
        // }
        // if(piaoHua == -1){
        //     piaoHuaStr = "" ;
        // }else if(piaoHua == 0){
        //     piaoHuaStr = "不飘" ;
        // }else{
        //     piaoHuaStr = "飘" + piaoHua + "分" ;
        // }
        // if(maiMaStr != "" || piaoHuaStr != ""){
        //     if(maiMaStr != "" && piaoHuaStr!= ""){
        //         this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + maiMaStr + " " + piaoHuaStr + "]");
        //     }else{
        //         this.ShowLabelName(ShowNode.getChildByName("label_lists"), "[" + maiMaStr + piaoHuaStr + "]");
        //     }
        // }

        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
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
        for (var _i2 = 0; _i2 < maiMaList.length; _i2++) {
            var cardType = maiMaList[_i2];
            var node = ShowNode.getChildByName("card" + (_i2 + 1));
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
        var huTypeDict = {};

        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["QDHu"] = "七对";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["HYSDDHu"] = "混一色七对";
        huTypeDict["QYSDD"] = "清一色七对";
        huTypeDict["WuJingHu"] = "无金";
        huTypeDict["Jin"] = "翁金";
        huTypeDict["Tong"] = "8张涨";
        huTypeDict["BD"] = "扳倒";
        huTypeDict["HuaGang"] = "139";
        huTypeDict["WuHua"] = "579";
        huTypeDict["JiangJiangHu"] = "幺九将";
        huTypeDict["FengQing"] = "乱三风";
        huTypeDict["Zhong"] = "中发白";
        huTypeDict["ZhongNiao"] = "中发白将";
        huTypeDict["PaoFen"] = "下跑";
        huTypeDict["PingHu"] = "平胡";
        huTypeDict["FengKan"] = "风将";

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
        //# sourceMappingURL=lskjjmj_winlost_child.js.map
        