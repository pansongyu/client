(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/yhmj/yhmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9afe4ahOmxO4okuV2w2y+4l', 'yhmj_winlost_child', __filename);
// script/ui/uiGame/yhmj/yhmj_winlost_child.js

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
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), HuList.maiMaList || [], HuList.zhongList || [], HuList.endPoint);
        this.ShowOtherScore(PlayerNode.getChildByName('other'), HuList);
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        var absNum = Math.abs(huInfo["showPoint"]);
        if (absNum > 10000) {
            var shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["showPoint"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["showPoint"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["showPoint"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["showPoint"];
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

    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, zhongList, endPoint) {
        zhongList = zhongList || [];
        ShowNode.active = !(zhongList.length <= 0 && maList.length <= 0);
        for (var i = 1; i <= 16; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
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
            //更改为没中码都显示码牌
            // if (typeof (endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0) {
            if (zhongList.indexOf(cardType) > -1) {
                node.color = cc.color(255, 255, 0);
            } else {
                node.color = cc.color(255, 255, 255);
            }
            // } else {
            //     node.color = cc.color(255, 255, 255);
            // }
        }
    },
    ShowOtherScore: function ShowOtherScore(ShowNode, huInfo) {
        var gangFen = huInfo["gangPoint"];
        if (gangFen > 0) {
            ShowNode.getChildByName('lb_gangfen').active = true;
            ShowNode.getChildByName('lb_gangfen').getComponent("cc.Label").string = "杠分:" + gangFen;
        } else {
            ShowNode.getChildByName('lb_gangfen').active = false;
        }

        var huPaiPoint = huInfo["huPaiPoint"];
        if (huPaiPoint > 0) {
            ShowNode.getChildByName('lb_hupaifen').active = true;
            ShowNode.getChildByName('lb_hupaifen').getComponent("cc.Label").string = "胡牌分:" + huPaiPoint;
        } else {
            ShowNode.getChildByName('lb_hupaifen').active = false;
        }

        var maiMaPoint = huInfo["maiMaPoint"];
        if (maiMaPoint > 0) {
            ShowNode.getChildByName('lb_maimafen').active = true;
            ShowNode.getChildByName('lb_maimafen').getComponent("cc.Label").string = "买马分:" + maiMaPoint;
        } else {
            ShowNode.getChildByName('lb_maimafen').active = false;
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
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {};

        huTypeDict["PH"] = "平胡";
        huTypeDict["TH"] = "天胡";
        huTypeDict["DH"] = "地胡";
        huTypeDict["SSL"] = "十三烂";
        huTypeDict["QXSSL"] = "七星十三烂";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["QYSZH"] = "清一色真胡";
        huTypeDict["QYSJH"] = "清一色假胡";
        huTypeDict["ZYSZH"] = "字一色真胡";
        huTypeDict["ZYSJH"] = "字一色假胡";
        huTypeDict["QYSPPH"] = "清一色碰碰胡";
        huTypeDict["ZYSPPH"] = "字一色碰碰胡";
        huTypeDict["QD"] = "七对";
        huTypeDict["QYSQD"] = "清一色七对";
        huTypeDict["ZYSQD"] = "字一色七对";
        huTypeDict["GF"] = "杠分";
        huTypeDict["ZMS"] = "中马数";
        huTypeDict["ZMF"] = "中码分";
        huTypeDict["QS"] = "前烧";
        huTypeDict["BYP"] = "绑一炮";
        huTypeDict["HS"] = "后烧";
        huTypeDict["GSKH"] = "杠上开花";

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
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "*2");
            } else if (this.IsNotShowScore(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
            } else {
                var huTypeStr = huPoint == 0 ? this.LabelName(huType) : this.LabelName(huType) + "：" + huPoint;
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeStr);
                // this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
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
        //# sourceMappingURL=yhmj_winlost_child.js.map
        