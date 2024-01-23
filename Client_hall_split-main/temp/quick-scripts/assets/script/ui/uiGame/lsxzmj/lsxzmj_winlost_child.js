(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/lsxzmj/lsxzmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eca8fPpSLFBZ7ISkGEhEJ+A', 'lsxzmj_winlost_child', __filename);
// script/ui/uiGame/lsxzmj/lsxzmj_winlost_child.js

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
        console.log("单局结算数据", setEnd, playerAll, index);
        var jin1 = setEnd.jin || setEnd.jin1;
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
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
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
        var weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo) {
        var jin1 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var jin2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), HuList.maiMaList || [], HuList.zhongList || [], HuList.huType);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), zhuaNiaoList, [], HuList.huType);
        this.ShowOtherScore(PlayerNode.getChildByName('other'), HuList);
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

    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, zhuaNiaoList, huType) {
        for (var i = 1; i <= 10; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        if (huType == "NotHu" || huType == "JiePao") {
            ShowNode.active = false;
            return;
        } else {
            ShowNode.active = true;
        }
        for (var _i = 0; _i < maList.length; _i++) {
            var cardType = maList[_i];
            var node = ShowNode.getChildByName("card" + (_i + 1));
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
    ShowOtherScore: function ShowOtherScore(ShowNode, huInfo) {
        var huPoint = huInfo["huPoint"] || 0;
        ShowNode.getChildByName('hufenLb').getComponent("cc.Label").string = "胡分:" + this.ToUiScore(huPoint);

        var genZhuangPoint = huInfo["genZhuangPoint"] || 0;
        ShowNode.getChildByName('genzhuangfenLb').getComponent("cc.Label").string = "跟庄分:" + this.ToUiScore(genZhuangPoint);

        var chiPaoPoint = huInfo["chiPaoPoint"] || 0;
        ShowNode.getChildByName('chipaoLb').getComponent("cc.Label").string = "吃炮:" + this.ToUiScore(chiPaoPoint);
    },

    ToUiScore: function ToUiScore(score) {
        if (0 === score) return 0;
        if (!score) return "";

        var symbol = score > 0 ? "+" : "";
        var absNum = Math.abs(score);
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            return symbol + shortNum + "万";
        }

        return symbol + score;
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
        //默认颜色描边
        huNode.color = new cc.Color(252, 236, 117);
        huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
        huNode.getComponent(cc.LabelOutline).Width = 2;
        if (typeof huType == "undefined") {
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
        } else if (huType == this.ShareDefine.HuType_GSKH) {
            huNode.getComponent(cc.Label).string = '杠上开花';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {};

        huTypeDict["TianHu"] = "天胡";
        huTypeDict["DiHu"] = "地胡";
        huTypeDict["GSKH"] = "杠上开花";
        huTypeDict["GSP"] = "杠上流泪";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["ZiMoJiaOne"] = "自摸";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["HDL"] = "海底放炮";
        huTypeDict["HDLY"] = "海底捞月";
        huTypeDict["HongQiPP"] = "红旗飘飘";
        huTypeDict["QDHu"] = "七对";
        huTypeDict["HDDHu"] = "豪华七对";
        huTypeDict["CHDDHu"] = "双豪华七对";
        huTypeDict["CCHDDHu"] = "三豪华七对";
        huTypeDict["XSQD"] = "潇洒七对";
        huTypeDict["XSQDDYG"] = "潇洒七对带一滚";
        huTypeDict["XSQDDEG"] = "潇洒七对带二滚";
        huTypeDict["XSQDDSG"] = "潇洒七对带三滚";
        huTypeDict["LianQiDui"] = "七仙女";
        huTypeDict["QYSQD"] = "潇洒豪华七对";
        huTypeDict["QYSHDDHu"] = "潇洒豪华七对带一滚";
        huTypeDict["QYSCHDDHu"] = "潇洒豪华七对带二滚";
        huTypeDict["QYSCCHDDHu"] = "潇洒豪华七对带三滚";
        huTypeDict["QYSZJHDDHu"] = "潇洒双豪华七对";
        huTypeDict["QYSZJCHDDHu"] = "潇洒双豪华七对带一滚";
        huTypeDict["QYSZJCCHDDHu"] = "潇洒双豪华七对带二滚";
        huTypeDict["LuanJiangCHDDHu"] = "潇洒三豪华七对带一滚";
        huTypeDict["LuanJiangHDDHu"] = "潇洒三豪华七对";
        huTypeDict["QuanQiuR"] = "全求人";
        huTypeDict["Long"] = "一条龙";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["Fa4"] = "四个发财";
        huTypeDict["MenQing"] = "门清";
        huTypeDict["BianZhang"] = "边张";
        huTypeDict["KanZhang"] = "卡张";
        huTypeDict["DD"] = "单吊";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["JiaGun"] = "潇洒带滚碰碰胡";
        huTypeDict["XiaoSa"] = "潇洒碰碰胡";
        huTypeDict["Hua"] = "发财";
        huTypeDict["Gang"] = "补杠";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["JieGang"] = "直杠";
        huTypeDict["Gen"] = "跟庄";
        huTypeDict["HuPoint"] = "胡分";
        huTypeDict["PaoFen"] = "吃炮";
        huTypeDict["PengBanZi"] = "碰";
        huTypeDict["AnKe"] = "暗刻";
        huTypeDict["PingHu"] = "平胡";
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
        var huInfo = huInfoAll.huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + ":" + huPoint);
            } else if (this.IsNotShowScore(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + ":" + huPoint);
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + huPoint + "炮");
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
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
        UICard_DownCard.ShowDownCard(publishcard);
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
        //# sourceMappingURL=lsxzmj_winlost_child.js.map
        