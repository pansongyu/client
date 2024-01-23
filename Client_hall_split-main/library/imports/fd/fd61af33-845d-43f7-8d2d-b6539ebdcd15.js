"use strict";
cc._RF.push(module, 'fd61a8zhF1D940ttlOevc0V', 'mymj_winlost_child');
// script/ui/uiGame/mymj/mymj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        bg_dingque: [cc.SpriteFrame],
        bg_piaofen: [cc.SpriteFrame]
    },

    // use this for initialization
    OnLoad: function OnLoad() {
        this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerData: function ShowPlayerData(setEnd, playerAll, index) {
        console.log("单局结算数据", setEnd, playerAll, index);
        var jin1 = setEnd.jin;
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
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, setEnd.fanXingList);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);
        this.lb_winListNum = this.node.getChildByName('jiesuan').getChildByName('lb_winListNum').getComponent(cc.Label);
        this.lb_winListNum.string = posResultList[index]["winList"].join("");

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }

        //显示飘
        var piaoFen = posResultList[index]['piaoFen'];
        if (piaoFen > -1) {
            this.node.getChildByName("user_info").getChildByName("piaofen").active = true;
            this.node.getChildByName("user_info").getChildByName("piaofen").getComponent(cc.Sprite).spriteFrame = this.bg_piaofen[piaoFen];
        } else {
            this.node.getChildByName("user_info").getChildByName("piaofen").active = false;
        }
        //显示定缺
        var duan = posResultList[index]['duan'];
        var dingQue = this.ShareDefine.OpTypeStringDict[duan] - 86;
        if (dingQue > -1) {
            this.node.getChildByName("user_info").getChildByName("duan").active = true;
            this.node.getChildByName("user_info").getChildByName("duan").getComponent(cc.Sprite).spriteFrame = this.bg_dingque[dingQue];
        } else {
            this.node.getChildByName("user_info").getChildByName("duan").active = false;
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
        var fanShu = huInfo["fanShu"] || 0;
        // if (gangFen > 0) {
        ShowNode.getChildByName('lb_fanshu').active = true;
        ShowNode.getChildByName('lb_fanshu').getComponent("cc.Label").string = "番数：" + fanShu;
        // } else {
        //     ShowNode.getChildByName('lb_gangfen').active = false;
        // }

        var gangFen = huInfo["gangFen"] || 0;
        // if (gangPoin > 0) {
        ShowNode.getChildByName('lb_gangfen').active = true;
        ShowNode.getChildByName('lb_gangfen').getComponent("cc.Label").string = "杠分：" + gangFen;
        // } else {
        //     ShowNode.getChildByName('lb_xiapao').active = false;
        // }

        var huFen = huInfo["huFen"];
        // if (huFen >= 0) {
        ShowNode.getChildByName('lb_hufen').active = true;
        ShowNode.getChildByName('lb_hufen').getComponent("cc.Label").string = "胡分：" + huFen;
        // } else {
        //     ShowNode.getChildByName('lb_hufen').active = false;
        // }

        // let otherPoint = huInfo["otherPoint"];
        // if (otherPoint >= 0) {
        //     ShowNode.getChildByName('lb_ewaifen').active = true;
        //     ShowNode.getChildByName('lb_ewaifen').getComponent("cc.Label").string = "额外分:+" + otherPoint;
        // } else {
        //     ShowNode.getChildByName('lb_ewaifen').active = true;
        //     ShowNode.getChildByName('lb_ewaifen').getComponent("cc.Label").string = "额外分:x" + Math.abs(otherPoint);
        // }
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
        this.huStringMap["ChaJiao"] = "查叫";
        this.huStringMap["ChaHuaZhu"] = "查花猪";

        if (Object.hasOwnProperty.call(this.huStringMap, huTypeName)) {
            huNode.getComponent(cc.Label).string = this.huStringMap[huTypeName];
        } else {
            huNode.getComponent(cc.Label).string = '';
        }

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
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {};

        huTypeDict["DDZ"] = "大对子";
        huTypeDict["MQ"] = "门清";
        huTypeDict["ZZ"] = "中张";
        huTypeDict["QD"] = "七对";
        huTypeDict["DYJ"] = "带幺九";
        huTypeDict["DDD"] = "大单吊";
        huTypeDict["QingD"] = "清对";
        huTypeDict["JD"] = "将对";
        huTypeDict["LQD"] = "龙七对";
        huTypeDict["QQD"] = "清七对";
        huTypeDict["QYJ"] = "清幺九";
        huTypeDict["JQD"] = "将七对";
        huTypeDict["SBLH"] = "十八罗汉";
        huTypeDict["QSBLH"] = "清十八罗汉";
        huTypeDict["GSH"] = "杠上花";
        huTypeDict["GSP"] = "杠上炮";
        huTypeDict["QGH"] = "抢杠胡";
        huTypeDict["JGG"] = "金钩钩";
        huTypeDict["HDL"] = "海底捞";
        huTypeDict["HDP"] = "海底炮";
        huTypeDict["TH"] = "天胡";
        huTypeDict["DH"] = "地胡";
        huTypeDict["G"] = "根";
        huTypeDict["GF"] = "杠分";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["QLQD"] = "清龙七对";
        huTypeDict["T"] = "躺牌";

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
        // this.ShowPiaoFen(ShowNode, huInfoAll);
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "*" + huPoint);
            } else if (this.IsNotShowScore(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    ShowPiaoFen: function ShowPiaoFen(ShowNode, huInfoAll) {
        var piaoFen = huInfoAll["piaoFen"];
        var str = "";
        if (piaoFen <= -1) {
            return;
        } else if (piaoFen == 0) {
            str = "不漂";
        } else {
            str = "漂" + piaoFen;
        }
        this.ShowLabelName(ShowNode.getChildByName('label_lists'), str);
    }
});

cc._RF.pop();