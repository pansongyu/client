/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.SoundManager = app.SoundManager();
        this.FormManager = app.FormManager();
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let jin1 = setEnd.jin;
        let jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        this.index = index;
        this.huLuoBoMap = setEnd["huLuoBoMap"];
        this.allLiuSuiListDict = {};
        for (let i = 0; i < setEnd["posResultList"].length; i++) {
            let posResult = setEnd["posResultList"][i];
            let pos = posResult["pos"];
            let liuSuiList = posResult["liuSuiList"];
            if (!this.allLiuSuiListDict[pos]) {
                this.allLiuSuiListDict[pos] = [];
            }
            this.allLiuSuiListDict[pos] = liuSuiList;
        }
        let posHuArray = new Array();
        this.posCount = posResultList.length;
        for (let i = 0; i < this.posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        let maiMaList = setEnd["maiMaList"] || [];
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
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maiMaList = []) {
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
    ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"], PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);

        let isMingBai = HuList["isMingBai"];
        let isBaoDing = HuList["isBaoDing"];
        let isDisoolve = HuList["isDisoolve"];

        ShowNode.getChildByName('baipai').active = isMingBai;
        ShowNode.getChildByName('baoding').active = isBaoDing;
        ShowNode.getChildByName('jiesanzhe').active = isDisoolve;


    },
    IsNoShowScore: function (huType) {
        let multi2 = this.noShowScore || [];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    IsShowMulti2: function (huType) {
        let multi2 = this.multi2 || [];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    initData: function () {
        this.multi2 = [];
        this.noShowScore = ["Zhuang", "GenZhuangShengJi", "HuangZhuangShengJi", "ChaDaJiao"];    // 不显示分数的胡类型
        this.maxShowLabelNum = 8;
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        //买码飘分

        let huStrDict = {
            1: "",
            2: "番",
            3: "",
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
    ShowHuType: function (ShowNode, huTypeDict, huType, huPoint) {
        if (this.IsShowMulti2(huType)) {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + "*2");
        } else if (this.IsNoShowScore(huType)) {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType]);
        } else {
            this.ShowLabelName(ShowNode.getChildByName("label_lists"), huTypeDict[huType] + ":" + huPoint);
        }
    },
    ShowPlayerRecord: function (ShowNode, huInfo) {
        let absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            let shortNum = (absNum / 10000).toFixed(2);
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
        if (typeof (huInfo.sportsPointTemp) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof (huInfo.sportsPoint) != "undefined") {
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

    ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2) {
        ShowNode.active = 1;
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCard(cardIDList, handCard, jin1, jin2);
    },
    ShowPlayerHuType: function (ShowNode, huInfo) {
        let huType = huInfo["huType"];
        if (huType == "PingHu") {
            ShowNode.getComponent(cc.Label).string = "胡牌";
        } else if (huType == "ChaJiao") {
            ShowNode.getComponent(cc.Label).string = "查叫";
        } else {
            ShowNode.getComponent(cc.Label).string = "";
        }
    },
    ShowPlayerDownCard: function (ShowNode, publishcard, jin1 = 0, jin2 = 0) {
        ShowNode.active = 1;
        let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByJDZMJ(publishcard, this.posCount, jin1, jin2);
    },

    ShowPlayerNiaoPai: function (ShowNode, maiMaList, endPoint, huType) {
        let zhongMaList = endPoint["zhongMaList"];
        ShowNode.active = false;
        for (let i = 1; i <= 8; i++) {
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
            return
        }
        ShowNode.active = true;
        // if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
        // }else{
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
        //     return;
        // }
        for (let i = 0; i < maiMaList.length; i++) {
            let cardType = maiMaList[i];
            let node = ShowNode.getChildByName("card" + (i + 1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active = true;
            if (zhongMaList.indexOf(cardType) > -1) {
                node.color = cc.color(255, 255, 0);
            }
        }
    },
    ShowImage: function (childNode, imageString, cardID) {
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        //取卡牌ID的前2位
        let imageName = [imageString, cardID].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                })
                .catch(function (error) {
                    that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                });
        }
    },
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
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
    GetHuTypeDict: function () {
        let huTypeDict = {
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
            SiGuiYi: "多头",
        };
        return huTypeDict;
    },
    //控件点击回调
    OnClick_BtnWnd: function (eventTouch, eventData) {
        try {
            this.SoundManager.PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            console.error("OnClick_BtnWnd:%s", error.stack);
        }
    },
    OnClick: function (btnName, btnNode) {
        if (btnName == "btn_liushui") {
            console.log(btnNode);
            let liuShui = this.allLiuSuiListDict[this.index];
            let huLuoBoMap = this.huLuoBoMap;
            this.FormManager.ShowForm("ui/uiGame/lfphmj/lfphmj_UIDuijuliushui", liuShui, huLuoBoMap);
        }
    }
});
