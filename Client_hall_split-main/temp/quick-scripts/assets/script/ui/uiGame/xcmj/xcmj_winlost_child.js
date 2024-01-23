(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/xcmj/xcmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '639a1pwQYFNFLEBe6pjmnxk', 'xcmj_winlost_child', __filename);
// script/ui/uiGame/xcmj/xcmj_winlost_child.js

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
        this.index = index;
        this.allLiuSuiListDict = {};
        for (var i = 0; i < setEnd["posResultList"].length; i++) {
            var posResult = setEnd["posResultList"][i];
            var pos = posResult["pos"];
            var liuSuiList = posResult["xueLiuPlayerLiuShuiInfos"];
            if (!this.allLiuSuiListDict[pos]) {
                this.allLiuSuiListDict[pos] = [];
            }
            this.allLiuSuiListDict[pos] = liuSuiList;
        }
        var posHuArray = new Array();
        var posCount = posResultList.length;
        for (var _i = 0; _i < posCount; _i++) {
            var posInfo = posResultList[_i];
            var _pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[_pos] = posHuType;
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
        var zhuaNiaoList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), HuList.maiMaList || [], HuList.zhongList || [], HuList.huType);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), zhuaNiaoList, [], HuList.huType);
        // this.ShowOtherScore(PlayerNode.getChildByName('other'), HuList);
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
        for (var _i2 = 0; _i2 < maList.length; _i2++) {
            var cardType = maList[_i2];
            var node = ShowNode.getChildByName("card" + (_i2 + 1));
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
        var huFen = huInfo["huFen"] || 0;
        ShowNode.getChildByName('hupaiLb').getComponent("cc.Label").string = "胡牌分:" + this.ToUiScore(huFen);

        var shangJingFen = huInfo["shangJingFen"] || 0;
        ShowNode.getChildByName('shangjingLb').getComponent("cc.Label").string = "上精分:" + this.ToUiScore(shangJingFen);

        var xiaJingFen = huInfo["xiaJingFen"] || 0;
        ShowNode.getChildByName('xiajingLb').getComponent("cc.Label").string = "下精分:" + this.ToUiScore(xiaJingFen);

        var chaoZhuangFen = huInfo["chaoZhuangFen"] || 0;
        ShowNode.getChildByName('chaozhuangLb').getComponent("cc.Label").string = "抄庄:" + this.ToUiScore(chaoZhuangFen);

        var gangFen = huInfo["gangFen"] || 0;
        ShowNode.getChildByName('gangfenLb').getComponent("cc.Label").string = "杠分:" + this.ToUiScore(gangFen);
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
        // let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        // //默认颜色描边
        // huNode.color = new cc.Color(252, 236, 117);
        // huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
        // huNode.getComponent(cc.LabelOutline).Width = 2;
        // if (typeof(huType) == "undefined") {
        //     huNode.getComponent(cc.Label).string = '';
        // } else if (huType == this.ShareDefine.HuType_DianPao) {
        //     huNode.getComponent(cc.Label).string = '点炮';
        //     huNode.color = new cc.Color(192, 221, 245);
        //     huNode.getComponent(cc.LabelOutline).color = new cc.Color(31, 55, 127);
        //     huNode.getComponent(cc.LabelOutline).Width = 2;
        // } else if (huType == this.ShareDefine.HuType_JiePao) {
        //     huNode.getComponent(cc.Label).string = '接炮';
        // } else if (huType == this.ShareDefine.HuType_ZiMo) {
        //     huNode.getComponent(cc.Label).string = '自摸';
        // } else if (huType == this.ShareDefine.HuType_QGH) {
        //     huNode.getComponent(cc.Label).string = '抢杠胡';
        // } else if (huType == this.ShareDefine.HuType_SiJinDao) {
        //     huNode.getComponent(cc.Label).string = '四金倒';
        // } else {
        //     huNode.getComponent(cc.Label).string = '';
        // }

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
        this.huStringMap["ChaJiao"] = "查叫";
        this.huStringMap["ChaHuaZhu"] = "查花猪";

        if (Object.hasOwnProperty.call(this.huStringMap, huTypeName)) {
            huNode.getComponent(cc.Label).string = this.huStringMap[huTypeName];
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {
            TianHu: "天胡",
            DiHu: "地胡",
            QDHu: "七对",
            QYS: "清一色",
            DD: "独占",
            MenQing: "门清",
            QGH: "抢杠胡",
            ZiMo: "自摸",
            PingHu: "小胡",
            DuanYao: "断幺",
            BianJiaDiao: "压档",
            Long: "通天",
            SiHuo: "四核",
            HeJueZhang: "绝张",
            PPHu: "碰碰胡",
            ChaJiao: "查大叫",
            AnGang: "暗杠",
            JieGang: "明杠",
            Gang: "碰杠",
            GSKH: "杠上开花",
            MaiMa: "翻晃",
            GangNum: "杠分",
            YiSeShuangLong: "双铺子",
            DianPao: "点炮",
            ZiMoJiaOne: "被自摸",
            BQGH: "被抢杠胡",
            JiePao: "接炮",
            AnGangNum: "被暗杠",
            JieGangNum: "被明杠",
            DianGang: "被碰杠"

        };
        return huTypeDict[huType];
    },
    IsNotShowScore: function IsNotShowScore(huType) {
        var multi2 = ["JieGang", "Gang", "AnGang", "PeiZi", "ChaJiao"];
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
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + ":" + huPoint + "分");
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + ":" + huPoint + "番");
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, jin1, jin2) {
        ShowNode.active = 1;
        var UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCardByJAMJ(cardIDList, handCard, jin1, jin2);
    },
    ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
        var jin1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var jin2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        ShowNode.active = 1;
        var UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByJAMJ(publishcard, this.posCount, jin1, jin2);
    },
    //控件点击回调
    OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
        try {
            app.SoundManager().PlaySound("BtnClick");
            var btnNode = eventTouch.currentTarget;
            var btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            console.error("OnClick_BtnWnd:%s", error.stack);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_liushui") {
            console.log(btnNode);
            var liuShui = this.allLiuSuiListDict[this.index];
            app.FormManager().ShowForm("ui/uiGame/xcmj/xcmj_UIDuijuliushui", liuShui, {});
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
        //# sourceMappingURL=xcmj_winlost_child.js.map
        