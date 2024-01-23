(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/masmj/masmj_winlost_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ad303A/nNhPEJdj6+6Tb3fS', 'masmj_winlost_child', __filename);
// script/ui/uiGame/masmj/masmj_winlost_child.js

"use strict";

/*
 UICard01-04 牌局吃到的牌显示
 */

var app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        bg_que: [cc.SpriteFrame]

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
        var posCount = posResultList.length;
        for (var i = 0; i < posCount; i++) {
            var posInfo = posResultList[i];
            var pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        var zhuaNiaoList = [];
        if (typeof setEnd.zhuaNiaoList != "undefined") {
            zhuaNiaoList = setEnd.zhuaNiaoList;
        } else {
            zhuaNiaoList = setEnd.maPaiLst;
        }
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, zhuaNiaoList);
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
        var zhuaNiaoList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'),HuList.maList,HuList.zhongList);
    },
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        var dingQue = HuList["dingQue"];
        // let tongDiFlag = HuList["tongDiFlag"];
        // let tuoDiFlag = HuList["tuoDiFlag"];
        // let jieHuFlag = HuList["jieHuFlag"];
        var isDisoolve = HuList["isDisoolve"];

        var dingQueMap = {
            "Not": 0,
            "Wan": 1,
            "Tiao": 2,
            "Tong": 3
        };
        var duan = dingQueMap[dingQue];
        if (duan > 0) {
            ShowNode.getChildByName('dingque').active = true;
            ShowNode.getChildByName('dingque').getComponent(cc.Sprite).spriteFrame = this.bg_que[duan - 1];
        } else {
            ShowNode.getChildByName('dingque').active = false;
        }

        // ShowNode.getChildByName('tongdi').active = tongDiFlag;
        // ShowNode.getChildByName('toudi').active = tuoDiFlag;
        // ShowNode.getChildByName('jiehu').active = jieHuFlag;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;
    },
    ShowPlayerRecord: function ShowPlayerRecord(ShowNode, huInfo) {
        // let absNum = Math.abs(huInfo["point"]);
        // if (absNum > 10000) {
        //     let shortNum = (absNum / 10000).toFixed(2);
        //     if (huInfo["point"] > 0) {
        //         ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
        //     } else {
        //         ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
        //     }
        // } else {
        //     if (huInfo["point"] > 0) {
        //         ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
        //     } else {
        //         ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
        //     }
        // }

        if (huInfo["daoFen"] > 0) {
            ShowNode.getChildByName('tip_daofen').getChildByName('lb_daofen').getComponent("cc.Label").string = '+' + huInfo["daoFen"];
        } else {
            ShowNode.getChildByName('tip_daofen').getChildByName('lb_daofen').getComponent("cc.Label").string = huInfo["daoFen"];
        }

        if (huInfo["moZi"] > 0) {
            ShowNode.getChildByName('tip_mozi').getChildByName('lb_mozi').getComponent("cc.Label").string = '+' + huInfo["moZi"];
        } else {
            ShowNode.getChildByName('tip_mozi').getChildByName('lb_mozi').getComponent("cc.Label").string = huInfo["moZi"];
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
    ShowPlayerNiaoPai: function ShowPlayerNiaoPai(ShowNode, maList, zhongList) {
        if (maList.length == 0) {
            ShowNode.active = false;
            return;
        } else {
            ShowNode.active = true;
        }
        for (var i = 1; i <= 20; i++) {
            ShowNode.getChildByName('card' + i).active = false;
            ShowNode.getChildByName("card" + i).color = cc.color(255, 255, 255);
        }
        for (var _i = 0; _i < maList.length; _i++) {
            var cardType = Math.floor(maList[_i] / 100);
            var node = ShowNode.getChildByName("card" + (_i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            if (zhongList.indexOf(maList[_i]) > -1) {
                node.color = cc.color(255, 255, 0);
            } else {
                node.color = cc.color(255, 255, 255);
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
                app['majiang_' + imageName] = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    },
    ShowPlayerHuImg: function ShowPlayerHuImg(huNode, huTypeName, isJiePao) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        var huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof huType == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点炮';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_FHZ) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_DDHu) {
            if (isJiePao) {
                huNode.getComponent(cc.Label).string = '接炮';
            } else {
                huNode.getComponent(cc.Label).string = '自摸';
            }
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll['endPoint'].huTypeMap;
        // this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "x" + huPoint);
                // this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
            } else if (this.IsShowNum(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType]);
            } else {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    //分数
    IsShowScore: function IsShowScore(huType) {
        var multi2 = [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //个数
    IsShowNum: function IsShowNum(huType) {
        var multi2 = [];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    //倍数
    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = ["ZiMo"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    LabelName: function LabelName(huType) {
        var huTypeDict = {};
        huTypeDict["DDHu"] = "对对胡";
        huTypeDict["QD"] = "七小对";
        huTypeDict["HYS"] = "混一色";
        huTypeDict["ZYS"] = "字一色";
        huTypeDict["DDC"] = "大吊车";
        huTypeDict["YTL"] = "一条龙";
        huTypeDict["AnKe"] = "三张在手";
        huTypeDict["Peng"] = "三张碰出";
        huTypeDict["AnGang"] = "暗杠";
        huTypeDict["MingGang"] = "明杠";
        huTypeDict["ShuangLiuLian"] = "双连六";
        huTypeDict["LiuLian"] = "连六";
        huTypeDict["ShuangWuTong"] = "双五通";
        huTypeDict["WuTong"] = "五通";
        huTypeDict["SanSiHe"] = "三四核";
        huTypeDict["ShuangSiHe"] = "双四核";
        huTypeDict["SiHe"] = "四核";
        huTypeDict["shuangPu"] = "双扑";
        huTypeDict["KuZhiYa"] = "枯枝压";
        huTypeDict["YaDang"] = "压挡";
        huTypeDict["BuDongShou"] = "不动手";
        huTypeDict["ShiLao"] = "十老";
        huTypeDict["QuanLao"] = "全老";
        huTypeDict["ShiXiao"] = "十小";
        huTypeDict["QuanXiao"] = "全小";
        huTypeDict["BaZhi"] = "八支";
        huTypeDict["XiaoHuZi"] = "小胡子";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["WaMo"] = "挖摸";
        huTypeDict["PingMo"] = "平摸";
        huTypeDict["QingShuiDaNa"] = "清水大拿";
        huTypeDict["HunShuiDaNa"] = "混水大拿";
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["MQYS"] = "清一色";

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
        //# sourceMappingURL=masmj_winlost_child.js.map
        