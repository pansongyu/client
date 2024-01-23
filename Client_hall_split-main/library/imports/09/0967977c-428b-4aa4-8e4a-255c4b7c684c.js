"use strict";
cc._RF.push(module, '09679d8QotKpI5KJVxLfGhM', 'lfphmj_winlost_child');
// script/ui/uiGame/lfphmj/lfphmj_winlost_child.js

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
        this.SoundManager = app.SoundManager();
        this.FormManager = app.FormManager();
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
        this.index = index;
        this.huLuoBoMap = setEnd["huLuoBoMap"];
        this.allLiuSuiListDict = {};
        for (var i = 0; i < setEnd["posResultList"].length; i++) {
            var posResult = setEnd["posResultList"][i];
            var pos = posResult["pos"];
            var liuSuiList = posResult["liuSuiList"];
            if (!this.allLiuSuiListDict[pos]) {
                this.allLiuSuiListDict[pos] = [];
            }
            this.allLiuSuiListDict[pos] = liuSuiList;
        }
        var posHuArray = new Array();
        this.posCount = posResultList.length;
        for (var _i = 0; _i < this.posCount; _i++) {
            var posInfo = posResultList[_i];
            var _pos = posInfo["pos"];
            var posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[_pos] = posHuType;
        }
        var PlayerInfo = playerAll[index];
        this.node.active = true;
        var maiMaList = setEnd["maiMaList"] || [];
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maiMaList);
        // let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        // this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

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
        this.ShowPlayerHuType(PlayerNode.getChildByName('jiesuan').getChildByName('hutype'), HuList);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        // this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'), maiMaList, HuList.endPoint, HuList.huType);
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

        var huStrDict = {
            1: "",
            2: "番",
            3: ""
        };
        /*let huTypeDict = this.GetHuTypeDict();
        let huInfo = huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPointList = huInfo[huType];
            let point = huPointList[0];
            let pointStr = huStrDict[huPointList[1]];
            let huPoint = huPoint = point + pointStr;
            this.ShowHuType(ShowNode, huTypeDict, huType, huPoint);
        }*/
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
    ShowPlayerHuType: function ShowPlayerHuType(ShowNode, huInfo) {
        var huType = huInfo["huType"];
        if (huType == "PingHu") {
            ShowNode.getComponent(cc.Label).string = "胡牌";
        } else if (huType == "ChaJiao") {
            ShowNode.getComponent(cc.Label).string = "查叫";
        } else {
            ShowNode.getComponent(cc.Label).string = "";
        }
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
    GetHuTypeDict: function GetHuTypeDict() {
        var huTypeDict = {
            QDHu: "七对胡",
            HDDHu: "龙七对",
            CHDDHu: "双龙七对",
            CCHDDHu: "三龙七对",
            PPH: "大对子",
            JieGang: "明杠",
            Gang: "补杠",
            AnGang: "暗杠",
            QYS: "清一色",
            TianHu: "天胡",
            PingHu: " 平胡",
            TianTing: " 报叫",
            ShaBao: "杀报",
            ErDa: " 卡二条",
            DD: "金钩钓",
            GSKH: " 杠上花",
            GSP: " 杠上炮",
            DiHu: " 地胡",
            ChaKan: "查叫",
            QGH: "抢杠胡",
            DaTou: "多头杠",
            FangGang: "转雨",
            SiGuiYi: "多头"
        };
        return huTypeDict;
    },
    //控件点击回调
    OnClick_BtnWnd: function OnClick_BtnWnd(eventTouch, eventData) {
        try {
            this.SoundManager.PlaySound("BtnClick");
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
            var huLuoBoMap = this.huLuoBoMap;
            this.FormManager.ShowForm("ui/uiGame/lfphmj/lfphmj_UIDuijuliushui", liuShui, huLuoBoMap);
        }
    }
});

cc._RF.pop();