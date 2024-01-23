/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
    },

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        console.log("单局结算数据", setEnd, playerAll, index);
        let jin1 = setEnd.jin || setEnd.jin1 || 0;
        let jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, setEnd.huCardID);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
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
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, huCardID) {
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
        if (typeof(huInfo.sportsPointTemp) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string = huInfo.sportsPointTemp;
            }
        } else if (typeof(huInfo.sportsPoint) != "undefined") {
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
    ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"],PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);
        
        //所属推广员ID
        if(ShowNode.getChildByName('label_upLevel')){
            if(HuList["upLevelId"] > 0){
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "所属推广员ID:" + HuList["upLevelId"];
            }else{
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "";
            }
        }
        ShowNode.getChildByName('icon_ting').active = HuList["isTing"] || false;
    },

    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        //默认颜色描边
        huNode.color = new cc.Color(252, 236, 117);
        huNode.getComponent(cc.LabelOutline).color = new cc.Color(163, 61, 8);
        huNode.getComponent(cc.LabelOutline).Width = 2;
        if (typeof(huType) == "undefined") {
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
    LabelName: function (huType) {
        let huTypeDict = {};
        huTypeDict["ZiMo"]="自摸";
        huTypeDict["DDHDZ"]="对倒胡大张";
        huTypeDict["BianZi"]="边子";
        huTypeDict["JiaZi"]="夹子";
        huTypeDict["DanDiao"]="单吊";
        huTypeDict["SiMenQian"]="四门钱";
        huTypeDict["SanMenQian"]="三门钱";
        huTypeDict["ShuangMenQian"]="双门钱";
        huTypeDict["DanMenQian"]="单门钱";
        huTypeDict["H111222333"]="111222333";
        huTypeDict["DaWang"]="大王";
        huTypeDict["Peng"]="碰";
        huTypeDict["AnKe"]="暗刻";
        huTypeDict["Gang"]="直杠/碰杠";
        huTypeDict["HouMoAnGang"]="后摸暗杠";
        huTypeDict["QiShouAnGang"]="起手暗杠";
        huTypeDict["DiHu"]="底";
        huTypeDict["QH"]="全荤";
        huTypeDict["MH"]="闷荤";
        huTypeDict["TianHu"]="天胡";
        huTypeDict["ZhiTing"]="直听";
        huTypeDict["HaiLao"]="海捞";
        huTypeDict["QiongHen"]="穷狠";
        huTypeDict["MenQian"]="双门钱";
        huTypeDict["JiaBei"]="(加倍)";
        huTypeDict["BuJiaBei"]="(不加)";

        huTypeDict["HuShu"]="";
        huTypeDict["FenShu"]="";

        huTypeDict["DianPaoHu"]="点炮胡";

        return huTypeDict[huType];
    },
    IsNotShowScore: function (huType) {
        let multi2 = ["JiaBei", "BuJiaBei"];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    IsShowMulti2: function (huType) {
        let multi2 = ["QH", "MH", "TianHu", "ZhiTing", "HaiLao", "QiongHen", "MenQian"];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll["huTypeMap"];
        if (typeof (huInfo) == "undefined") {
            huInfo = huInfoAll["endPoint"]["huTypeMap"];
        }
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "x" + huPoint);
            } else if (this.IsNotShowScore(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
			} else {
                if(huType == "HuShu"){
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), "=(" + huPoint + "胡");
                }else if(huType == "FenShu"){
                    this.ShowLabelName(ShowNode.getChildByName("label_lists"), " " + huPoint + "分)");
                }else{
                    if(huPoint == 0){
                        this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType));
                    }else{
                        this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + huPoint);
                    }
                }
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, huType) {
        ShowNode.active = 1;
        let huPlayer = false;
        let cardIDListTemp = this.ComTool.DeepCopy(cardIDList);
        let cardIndex = cardIDListTemp.indexOf(handCard);
        if(cardIndex > -1){
            cardIDListTemp.splice(cardIndex, 1);
            huPlayer = true;
        }
        this.ShowDownImg(cardIDListTemp, handCard, ShowNode, huPlayer, huType);
    },
    ShowPlayerDownCard: function (ShowNode, publishcard) {
        ShowNode.active = 1;
        // let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        // UICard_DownCard.ShowDownCard(publishcard, this.posCount, jin1, jin2);
        this.ShowDownCard(publishcard, ShowNode);
    },
    ShowPlayerHuaCard: function (ShowNode, hualist) {
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
    ShowHuaList: function (cardIDList, ShowNode) {
        let count = 0;
        if (typeof (cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        cardIDList.sort();
        for (let i = 0; i < ShowNode.children.length; i++) {
            ShowNode.children[i].active = false;
        }
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = ShowNode.getChildByName(childName);
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
        for (let cardIndex = count + 1; cardIndex <= 8; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = ShowNode.getChildByName(childName);
            if (!childNode) {
                this.SysLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            childNode.active = 0;
        }
    },


    //直接渲染
    ShowDownImg: function (cardIDList, handCard = 0, ShowNode = null, huPlayer = false, huType) {
        let count = 0;
        if (typeof(cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = ShowNode.getChildByName("handCards").getChildByName(childName);
            if (!childNode) {
                this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                continue
            }
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            childNode.active = 1;
            this.SpriteShow(childNode, cardID);
        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= this.ChildCount; cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = ShowNode.getChildByName("handCards").getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = 0;
        }

        //进卡不能控制显影只能设置空图片
        if (handCard > 0 && handCard != 10000 && huPlayer) {
            ShowNode.getChildByName("sp_in").active = 1;
            this.SpriteShow(ShowNode.getChildByName("sp_in"), handCard);
            if (ShowNode.getChildByName("sp_in").getChildByName("hu")) {
                ShowNode.getChildByName("sp_in").getChildByName("hu").active = (this.ShareDefine.HuType_NotHu != huType && this.ShareDefine.HuType_DianPao != huType);
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

    ShowDownCard: function (publicCardList, ShowNode = null) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let ShowZheZhao = false;
            // 如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_JieGang || opType == this.ShareDefine.OpType_Peng) {
                ShowZheZhao = true;
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = ShowNode.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, ShowNode);
                if (!childNode) {
                    continue
                }
                this.SpriteShow(childNode, cardID);
                if(cardIndex == 3 && ShowZheZhao){
                    childNode.color = cc.color(180, 180, 180);
                }else{
                    childNode.color = cc.color(255, 255, 255);
                }
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= 4; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, ShowNode);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= 8; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = ShowNode.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    SpriteShow:function(childNode, cardID){
        let FilePath = "ui/uiGame/jyessz/poker/";
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }

        //取卡牌ID的前2位
        let imagePath = [FilePath, Math.floor(cardID / 100)].join("");
        // if (!imagePath) {
        //     this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
        //     return
        // }
        let that = this;
        app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function(spriteFrame){
                        if(!spriteFrame){
                            that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                            return
                        }
                        childSprite.spriteFrame = spriteFrame;
            }).catch(function(error){
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            }
        );
    },
});
