"use strict";
cc._RF.push(module, 'd9de6zXlnNC96G2xBMy+8Vu', 'jyessz_winlost_child');
// script/ui/uiGame/jyessz/jyessz_winlost_child.js

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
        var jin1 = setEnd.jin || setEnd.jin1 || 0;
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
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, setEnd.huCardID);
        var huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        // this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);

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
    UpdatePlayData: function UpdatePlayData(PlayerNode, HuList, PlayerInfo, huCardID) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, huCardID, HuList.huType);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
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
    ShowPlayerInfo: function ShowPlayerInfo(ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        //所属推广员ID
        if (ShowNode.getChildByName('label_upLevel')) {
            if (HuList["upLevelId"] > 0) {
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "所属推广员ID:" + HuList["upLevelId"];
            } else {
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "";
            }
        }
        ShowNode.getChildByName('icon_ting').active = HuList["isTing"] || false;
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
        huTypeDict["ZiMo"] = "自摸";
        huTypeDict["DDHDZ"] = "对倒胡大张";
        huTypeDict["BianZi"] = "边子";
        huTypeDict["JiaZi"] = "夹子";
        huTypeDict["DanDiao"] = "单吊";
        huTypeDict["SiMenQian"] = "四门钱";
        huTypeDict["SanMenQian"] = "三门钱";
        huTypeDict["ShuangMenQian"] = "双门钱";
        huTypeDict["DanMenQian"] = "单门钱";
        huTypeDict["H111222333"] = "111222333";
        huTypeDict["DaWang"] = "大王";
        huTypeDict["Peng"] = "碰";
        huTypeDict["AnKe"] = "暗刻";
        huTypeDict["Gang"] = "直杠/碰杠";
        huTypeDict["HouMoAnGang"] = "后摸暗杠";
        huTypeDict["QiShouAnGang"] = "起手暗杠";
        huTypeDict["DiHu"] = "底";
        huTypeDict["QH"] = "全荤";
        huTypeDict["MH"] = "闷荤";
        huTypeDict["TianHu"] = "天胡";
        huTypeDict["ZhiTing"] = "直听";
        huTypeDict["HaiLao"] = "海捞";
        huTypeDict["QiongHen"] = "穷狠";
        huTypeDict["MenQian"] = "双门钱";
        huTypeDict["JiaBei"] = "(加倍)";
        huTypeDict["BuJiaBei"] = "(不加)";

        huTypeDict["HuShu"] = "";
        huTypeDict["FenShu"] = "";

        huTypeDict["DianPaoHu"] = "点炮胡";

        return huTypeDict[huType];
    },
    IsNotShowScore: function IsNotShowScore(huType) {
        var multi2 = ["JiaBei", "BuJiaBei"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    IsShowMulti2: function IsShowMulti2(huType) {
        var multi2 = ["QH", "MH", "TianHu", "ZhiTing", "HaiLao", "QiongHen", "MenQian"];
        var isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    ShowPlayerJieSuan: function ShowPlayerJieSuan(ShowNode, huInfoAll) {
        var huInfo = huInfoAll["huTypeMap"];
        if (typeof huInfo == "undefined") {
            huInfo = huInfoAll["endPoint"]["huTypeMap"];
        }
        for (var huType in huInfo) {
            var huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "x" + huPoint);
            } else if (this.IsNotShowScore(huType)) {
                this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
            } else {
                if (huType == "HuShu") {
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), "=(" + huPoint + "胡");
                } else if (huType == "FenShu") {
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), " " + huPoint + "分)");
                } else {
                    if (huPoint == 0) {
                        this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
                    } else {
                        this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + huPoint);
                    }
                }
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    ShowPlayerShowCard: function ShowPlayerShowCard(ShowNode, cardIDList, handCard, huType) {
        ShowNode.active = 1;
        var huPlayer = false;
        var cardIDListTemp = this.ComTool.DeepCopy(cardIDList);
        var cardIndex = cardIDListTemp.indexOf(handCard);
        if (cardIndex > -1) {
            cardIDListTemp.splice(cardIndex, 1);
            huPlayer = true;
        }
        this.ShowDownImg(cardIDListTemp, handCard, ShowNode, huPlayer, huType);
    },
    ShowPlayerDownCard: function ShowPlayerDownCard(ShowNode, publishcard) {
        ShowNode.active = 1;
        // let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        // UICard_DownCard.ShowDownCard(publishcard, this.posCount, jin1, jin2);
        this.ShowDownCard(publishcard, ShowNode);
    },
    ShowPlayerHuaCard: function ShowPlayerHuaCard(ShowNode, hualist) {
        if (hualist.length == 0) {
            ShowNode.active = false;
            return;
        }
        ShowNode.active = 1;
        // let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowHua");
        // UICard_ShowCard.ShowHuaList(hualist);
        this.ShowHuaList(hualist, ShowNode);
    },
    //多花用参数传花数，默认8花
    ShowHuaList: function ShowHuaList(cardIDList, ShowNode) {
        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (var i = 0; i < ShowNode.children.length; i++) {
            ShowNode.children[i].active = false;
        }
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = ShowNode.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                childNode = cc.instantiate(ShowNode.getChildByName("card01"));
                childNode.name = "card" + (index + 1);
                ShowNode.addChild(childNode);
                // continue;
            }
            childNode.active = true;
            this.SpriteShow(childNode, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= 8; cardIndex++) {
            var _childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode = ShowNode.getChildByName(_childName);
            if (!_childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", _childName);
                continue;
            }
            _childNode.active = 0;
        }
    },

    //直接渲染
    ShowDownImg: function ShowDownImg(cardIDList) {
        var handCard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var ShowNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var huPlayer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var huType = arguments[4];

        var count = 0;
        if (typeof cardIDList != "undefined") {
            count = cardIDList.length;
        }
        for (var index = 0; index < count; index++) {
            var cardID = cardIDList[index];
            var childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            var childNode = ShowNode.getChildByName("handCards").getChildByName(childName);
            if (!childNode) {
                this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                continue;
            }
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            childNode.active = 1;
            this.SpriteShow(childNode, cardID);
        }
        //设置多余的卡牌位置空
        for (var cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            var _childName2 = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            var _childNode2 = ShowNode.getChildByName("handCards").getChildByName(_childName2);
            if (!_childNode2) {
                continue;
            }
            _childNode2.active = 0;
        }

        //进卡不能控制显影只能设置空图片
        if (handCard > 0 && handCard != 10000 && huPlayer) {
            ShowNode.getChildByName("sp_in").active = 1;
            this.SpriteShow(ShowNode.getChildByName("sp_in"), handCard);
            if (ShowNode.getChildByName("sp_in").getChildByName("hu")) {
                ShowNode.getChildByName("sp_in").getChildByName("hu").active = this.ShareDefine.HuType_NotHu != huType && this.ShareDefine.HuType_DianPao != huType;
            }
        } else {
            ShowNode.getChildByName("sp_in").getComponent(cc.Sprite).spriteFrame = "";
            if (ShowNode.getChildByName("sp_in").getChildByName("da")) {
                ShowNode.getChildByName("sp_in").getChildByName("da").active = false;
            }
            if (ShowNode.getChildByName("sp_in").getChildByName("hu")) {
                ShowNode.getChildByName("sp_in").getChildByName("hu").active = false;
            }
        }
    },

    ShowDownCard: function ShowDownCard(publicCardList) {
        var ShowNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var count = 0;
        if (typeof publicCardList != "undefined") {
            count = publicCardList.length;
        }
        for (var index = 0; index < count; index++) {
            var publicInfoList = publicCardList[index];
            var cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            var opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            var ShowZheZhao = false;
            // 如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_JieGang || opType == this.ShareDefine.OpType_Peng) {
                ShowZheZhao = true;
            }

            var childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            var childNode = ShowNode.getChildByName(childName);
            if (!childNode) {
                continue;
            }
            childNode.active = true;
            var cardCount = cardIDList.length;
            for (var cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                var cardID = cardIDList[cardIndex];
                var paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                var childPath = [childName, paiChildName].join("/");
                var _childNode3 = cc.find(childPath, ShowNode);
                if (!_childNode3) {
                    continue;
                }
                this.SpriteShow(_childNode3, cardID);
                if (cardIndex == 3 && ShowZheZhao) {
                    _childNode3.color = cc.color(180, 180, 180);
                } else {
                    _childNode3.color = cc.color(255, 255, 255);
                }
            }
            //设置多余的卡牌位置空
            for (var _cardIndex = cardCount + 1; _cardIndex <= 4; _cardIndex++) {
                var _paiChildName = this.ComTool.StringAddNumSuffix("card", _cardIndex, 2);
                var _childPath = [childName, _paiChildName].join("/");
                var _childNode4 = cc.find(_childPath, ShowNode);
                if (!_childNode4) {
                    continue;
                }
                var cardSprite = _childNode4.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }
        }

        //隐藏掉剩余的卡牌
        for (var _index = count + 1; _index <= 8; _index++) {
            var _childName3 = this.ComTool.StringAddNumSuffix("down", _index, 2);
            var _childNode5 = ShowNode.getChildByName(_childName3);
            if (!_childNode5) {
                continue;
            }
            _childNode5.active = false;
        }
    },
    SpriteShow: function SpriteShow(childNode, cardID) {
        var FilePath = "ui/uiGame/jyessz/poker/";
        var childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return;
        }

        //取卡牌ID的前2位
        var imagePath = [FilePath, Math.floor(cardID / 100)].join("");
        // if (!imagePath) {
        //     this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
        //     return
        // }
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
});

cc._RF.pop();