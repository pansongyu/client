var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        roomID: cc.Node,
        jushu: cc.Node,
        endTime: cc.Node,

        MJPlayers: cc.Node,

        PokerPlayers: cc.Node,

        page_search: cc.EditBox,

        room_Beishu: cc.Node,
    },

    OnCreateInit: function () {
        this.FormManager = app.FormManager();
        // this.RegEvent("RoomEnd", this.Event_RoomEnd, this);
        this.maCardNode = this.GetWndNode("sp_cardNode/maCardNode");
        this.maListNode = this.GetWndNode("sp_cardNode/maListNode");
        this.jipaiLayout = this.GetWndNode("sp_cardNode/jipaiLayout");
        this.VerticalScrollView = this.GetWndNode("VerticalScrollView");
        this.verticalScrollViewPlayers = this.GetWndNode("VerticalScrollView/view/players");
        this.xingCardNode = this.GetWndNode("sp_cardNode/xingCardNode");
        this.dipaiLayout = this.node.getChildByName("dipaiLayout");
        this.px6gtTip = this.node.getChildByName("px6gtTip");
        this.ComTool = app.ComTool();
        this.SDKManager = app.SDKManager();
        this.NetManager = app.NetManager();
        this.PokerCard = app.PokerCard();
        this.WeChatManager = app.WeChatManager();
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.RegEvent("GameRecord", this.Event_GameRecord, this);
        this.lastChildName = null;
        this.lastRoomId = 0;
        //加载麻将资源，防止异步坑爹的bug
        this.LoadAllImages();
    },
    LoadAllImages: function () {
        let i = 11;
        for (; i <= 58; i++) {
            let imageName = ["EatCard_Self_", i].join("");
            let imageInfo = this.IntegrateImage[imageName];
            if (!imageInfo) {
                continue;
            }
            if (app['majiang_' + imageName]) {
                continue;
            }
            let imagePath = imageInfo["FilePath"];
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame).then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return;
                }
                //记录精灵图片对象
                app['majiang_' + imageName] = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            })
        }
        //------------------永州扯胡子
        this.IntegrateImagePath = {
            "zi_fangda_19": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_10",
            },
            "zi_fangda_10": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_1",
            },
            "zi_fangda_11": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_2",
            },
            "zi_fangda_12": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_3",
            },
            "zi_fangda_13": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_4",
            },
            "zi_fangda_14": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_5",
            },
            "zi_fangda_15": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_6",
            },
            "zi_fangda_16": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/red_7",
            },
            "zi_fangda_17": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_8",
            },
            "zi_fangda_18": {
                "FilePath": "ui/uiGame/hhhgw/zi/xiaoxue/black_9",
            },

            "zi_fangda_29": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_10",
            },

            "zi_fangda_20": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_1",
            },
            "zi_fangda_21": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_2",
            },
            "zi_fangda_22": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_3",
            },
            "zi_fangda_23": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_4",
            },
            "zi_fangda_24": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_5",
            },
            "zi_fangda_25": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_6",
            },
            "zi_fangda_26": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/red_7",
            },
            "zi_fangda_27": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_8",
            },
            "zi_fangda_28": {
                "FilePath": "ui/uiGame/hhhgw/zi/daxue/black_9",
            },


            "zi_fangda_51": {
                "FilePath": "ui/uiGame/hhhgw/zi/bg_gui",
            },
            "zi_fangda_51": {
                "FilePath": "ui/uiGame/hhhgw/zi/bg_long",
            },
            "zi_fangda_bg": {
                "FilePath": "ui/uiGame/hhhgw/zi/img_pb",
            }
        };
        //------------------永州扯胡子
    },
    OnShow: function (roomId, playerAll, gameType, unionId = 0, roomKey = null, defaultPage = 1) {
        this.page = defaultPage;
        this.FormManager.ShowForm('UITop', "UIRecordAllResult");
        this.gameTypeID = gameType;
        this.gameType = app.ShareDefine().GametTypeID2PinYin[gameType];
        this.HideDiPaiLayout();
        this.HideSpCardNode();
        if (this.gameType == "sss") {
            this.node.getChildByName("btn_replay").active = false;
        } else {
            this.node.getChildByName("btn_replay").active = true;
        }
        this.playerAll = playerAll;
        this.roomId = roomId;
        this.unionId = unionId;
        this.roomKey = roomKey;
        let Type = this.gametypeConfig[gameType]["Type"];
        //pk牌的type需要使用麻将的布局
        let gameNameList = ["bw", "pypp", "ctwsk", "ygwsk", "qcdg", "tsdg", "dhd", "ysdz", "wsk", "sdh", "cdp", "lkwsk",
            "nzdl", "hndzp", "gxcdd", "glpp", "nzwsk", "gz", "xsy", "ctpk", "fczha", "xywsk", "jxyz", "qwwes", "gawsk",
            "jayxddz", "gast", "pysft", "thgz", "bzp", "tgwsk", "sys", "dzzj", "pydd"];
        //特殊处理 包王垂直布局
        if (Type == 1 || gameNameList.indexOf(this.gametypeConfig[gameType]['Name']) > -1) {
            this.MJPlayers.active = true;
            this.PokerPlayers.active = false;
            this.verticalScrollViewPlayers.active = false;
            this.VerticalScrollView.active = false;

            this.Players = this.MJPlayers;
            this.getWndNodePath = "MJPlayers";
        }
        else {
            this.MJPlayers.active = false;
            this.PokerPlayers.active = true;
            this.verticalScrollViewPlayers.active = false;
            this.VerticalScrollView.active = false;
            this.Players = this.PokerPlayers;
            this.getWndNodePath = "PokerScrollView/view/PokerPlayers";
        }

        let verticalScrollviewGameNames = ["jayxddz"];
        if (verticalScrollviewGameNames.indexOf(this.gametypeConfig[gameType]['Name']) > -1) {
            this.MJPlayers.active = false;
            this.PokerPlayers.active = false;
            this.VerticalScrollView.active = true;
            this.verticalScrollViewPlayers.active = true;
            this.Players = this.verticalScrollViewPlayers;
            this.getWndNodePath = "VerticalScrollView/view/players";
        }
        //动态生成节点
        this.LoadPrefabByGameType();
    },
    LoadPrefabByGameType: function () {
        let prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_winlost_child";
        let that = this;
        app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab)
            .then(function (prefab) {
                if (!prefab) {
                    that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
                    return;
                }
                that.InitNode(prefab);
            })
            .catch(function (error) {
                    that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
                }
            );
    },
    //------------------永州扯胡子
    ShowCardImage: function (childNode) {
        childNode.active = true;
        let imageName = ["zi_fangda_", Math.floor(childNode.cardID / 100)].join("");
        if (childNode.cardID == 0) {
            imageName = ["zi_fangda_bg"].join("");
        }
        let imageInfo = this.IntegrateImagePath[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        let that = this;
        childNode.getChildByName("hua").getComponent(cc.Sprite).spriteFrame = "";
        let childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
        this.SpriteShow(childSprite, imagePath);

    },
    SpriteShow: function (childSprite, imagePath) {
        let that = this;
        app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function (spriteFrame) {
                if (!spriteFrame) {
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return
                }
                childSprite.spriteFrame = spriteFrame;
            }).catch(function (error) {
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            }
        );
    },
    //------------------永州扯胡子
    InitNode: function (prefab) {
        let Player1Node = cc.instantiate(prefab);
        this.nowChildName = Player1Node.name;
        if (this.lastChildName != null && this.lastChildName == this.nowChildName
            && this.lastRoomId == this.roomId) {
            //子节点跟之前一样，无需重新创建，直接return
            //由于未结束的战绩会时时改变，所以不能return
            // return;
        }
        //清空之前的节点,生成新的节点
        this.lastChildName = this.nowChildName;
        this.lastRoomId = this.roomId;
        //this.Players.removeAllChildren();
        this.DestroyAllChildren(this.Players);
        Player1Node.name = 'player1';
        this.Players.addChild(Player1Node);


        if (this.MJPlayers.active) {
            //添加手牌
            let ShowCardNode = this.GetWndNode(this.getWndNodePath + '/player1/showcard');
            let sp_in = ShowCardNode.getChildByName('sp_in');
            for (let i = 1; i <= this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount']; i++) {
                let cardNode = cc.instantiate(sp_in);
                cardNode.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - (this.ShareDefine[this.gameType.toUpperCase() + 'RoomDealPerPosCardCount'] + 1)), 2);
                ShowCardNode.addChild(cardNode);
            }
            //添加吃牌
            let DownCardNode = this.GetWndNode(this.getWndNodePath + '/player1/downcard');
            let downNode01 = DownCardNode.getChildByName('down01');
            for (let i = 2; i <= 5; i++) {
                let downNode = cc.instantiate(downNode01);
                downNode.name = this.ComTool.StringAddNumSuffix("down", i, 2);
                DownCardNode.addChild(downNode);
            }
            //添加花牌
            if (this.nowChildName.indexOf("hua") >= 0) {
                let HuaCardNode = this.GetWndNode(this.getWndNodePath + '/player1/huacard');
                let hua01 = HuaCardNode.getChildByName('card01');
                for (let i = 2; i <= 8; i++) {
                    let huaNode = cc.instantiate(hua01);
                    huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
                    HuaCardNode.addChild(huaNode);
                }
            }


            //预制体添加花牌（找不到更好的方法了 先用着--张泽新2020.3.12）
            if (this.gameType == "fdmj" || this.gameType == "dymj") {
                let HuaCardNode = this.GetWndNode(this.getWndNodePath + '/player1/huacard');
                let hua01 = HuaCardNode.getChildByName('card01');
                for (let i = 2; i <= 8; i++) {
                    let huaNode = cc.instantiate(hua01);
                    huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
                    HuaCardNode.addChild(huaNode);
                }
            }
            if (this.gameType == "zpmj" || this.gameType == "namj" || this.gameType == "qzmj" || this.gameType == "zzmj" || this.gameType == "ssmj") {
                let HuaCardNode = this.GetWndNode(this.getWndNodePath + '/player1/huacardscrollView/view/huacard');
                let hua01 = HuaCardNode.getChildByName('card01');
                for (let i = 2; i <= 8; i++) {
                    let huaNode = cc.instantiate(hua01);
                    huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
                    HuaCardNode.addChild(huaNode);
                }
            }


        }
        this.InitPlayers();
        this.alldata = false;
        this.maxpage = 0;
        this.room_Beishu.active = false;
        this.NetManager.SendPack("game.CPlayerSetRoomRecord", {"roomID": this.roomId}, this.Event_GameRecord.bind(this));
    },
    InitPlayers: function () {
        let AddNode = this.GetWndNode(this.getWndNodePath + '/player1');
        for (let i = 2; i <= this.playerAll.length; i++) {
            let PlayerSon = cc.instantiate(AddNode);
            PlayerSon.name = 'player' + i;
            PlayerSon.active = false;
            this.Players.addChild(PlayerSon);
        }
    },
    ShowRoomInfo: function (roomEndResult) {
        let setID = roomEndResult["setID"];
        let time = roomEndResult["endTime"];
        if (setID > 0) {
            this.jushu.active = true;
            this.jushu.getComponent(cc.Label).string = "第" + setID + "局";
        } else {
            this.jushu.active = false;
        }

        this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);
        if (this.playBackCode > 0) {
            this.node.getChildByName('btn_replay').active = true;
            this.node.getChildByName('btn_share').active = true;
            this.endTime.parent.getChildByName("backCode").getComponent(cc.Label).string = "回放码:" + this.playBackCode;
            cc.find('btn_replay', this.node).actvie = true;
        } else {
            this.node.getChildByName('btn_replay').active = false;
            this.node.getChildByName('btn_share').active = false;
            this.endTime.parent.getChildByName("backCode").getComponent(cc.Label).string = "";
            cc.find('btn_replay', this.node).actvie = false;
        }
        //第几局 第几轮
        let {dataJsonRes, roomID} = roomEndResult;
        try {
            dataJsonRes = JSON.parse(dataJsonRes);
            //
            let roomKeyStr = "";
            if (this.roomKey != null) {
                roomKeyStr = "房间号:" + this.roomKey;
            }
            if (dataJsonRes['currentCirCle'] != null) {
                this.jushu.getComponent(cc.Label).string = roomKeyStr + `第${dataJsonRes['setId']}局 第${dataJsonRes['currentCirCle']}手`;
            }
        } catch (e) {
            console.error(e);
        }
    },
    HideDiPaiLayout: function () {
        this.px6gtTip.active = false;
        for (let i = 0; i < this.dipaiLayout.children.length; i++) {
            this.dipaiLayout.children[i].active = false;
        }
        this.dipaiLayout.active = false;
    },
    HideSpCardNode: function () {
        this.maCardNode.active = false;
        this.xingCardNode.active = false;
        this.maListNode.active = false;
        this.jipaiLayout.active = false;
    },
    GetPokeCard: function (poker, cardNode) {
        if (0 == poker) {
            return;
        }
        let type = "";
        let type1 = "";
        let type2 = "";
        let num = "";
        let cardColor = this.GetCardColor(poker);
        let cardValue = this.GetCardValue(poker);
        let numNode = cardNode.getChildByName("num");
        numNode.active = true;
        if (cardValue == 15) {
            cardValue = 2;
        }
        if (cardColor == 0) {
            type = "bg_diamond1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_red_" + cardValue;
                // type1 = "";
                // type2 = "bg_diamond_" + cardValue;
            }
            num = "red_" + cardValue;
        } else if (cardColor == 16) {
            type = "bg_club1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_blue_" + cardValue;
                // type1 = "";
                // type2 = "bg_club_" + cardValue;
            }
            num = "black_" + cardValue;
        } else if (cardColor == 32) {
            type = "bg_heart1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_red_" + cardValue;
                // type1 = "";
                // type2 = "bg_heart_" + cardValue;
            }
            num = "red_" + cardValue;
        } else if (cardColor == 48) {
            type = "bg_spade1_";
            type1 = type + 1;
            type2 = type + 2;
            // if (cardValue > 10) {
            if (cardValue > 10 && cardValue < 14) {
                type2 = "bg_blue_" + cardValue;
                // type1 = "";
                // type2 = "bg_spade_" + cardValue;
            }
            num = "black_" + cardValue;
        } else if (cardColor == 64) {//双数小鬼   0x42-0x4e
            numNode.active = false;//2,3,4,5,6,7,8,9,a
            if (cardValue % 2 == 0) {//双数小鬼
                type1 = "icon_small_king_01";
                type2 = "icon_small_king";
            } else if (cardValue % 2 == 1) {//单数大鬼
                type1 = "icon_big_king_01";
                type2 = "icon_big_king";
            }
        }
        let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
        let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
        let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
        numSp.spriteFrame = this.PokerCard.pokerDict[num];
        iconSp.spriteFrame = this.PokerCard.pokerDict[type1];
        icon1_Sp.spriteFrame = this.PokerCard.pokerDict[type2];
    },
    //获取牌值
    GetCardValue: function (poker) {
        return poker & this.PokerCard.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor: function (poker) {
        while (poker >= 80) {
            poker -= 80;
        }
        let color = poker & this.PokerCard.LOGIC_MASK_COLOR;
        return color;
    },
    Event_GameRecord: function (serverPack) {
        this.alldata = serverPack.pSetRoomRecords;
        this.maxpage = serverPack.pSetRoomRecords.length;
        this.playBackCode = serverPack.pSetRoomRecords[0].playbackCode;
        this.ShowData(this.page);
    },
    ShowData: function () {
        this.SetPageLabel();
        let data = this.Str2Json(this.alldata[this.page - 1].dataJsonRes);
        console.log(data);
        this.playBackCode = this.alldata[this.page - 1].playbackCode;
        this.InitShowPlayerInfo(data);
        this.ShowRoomInfo(this.alldata[this.page - 1]);
        this.ShowPX6GTDiPai(data);
    },
    SetPageLabel: function () {
        this.SetWndProperty("page/editbox_page", "text", this.page + "/" + this.maxpage);
        this.SetWndProperty("page2/editbox_page", "text", this.page);
    },
    InitShowPlayerInfo: function (setEnd) {
        for (let i = 0; i < this.playerAll.length; i++) {
            let PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (i + 1));
            if (PlayerNode) {
                PlayerNode.active = false;
            } else {
                break;
            }
        }
        let posResultList = setEnd.posResultList;
        let count = 0;
        for (let i = 0; i < posResultList.length; i++) {
            if (!posResultList[i].pid) continue;
            let PlayerNode = this.GetWndNode(this.getWndNodePath + '/player' + (count + 1));
            PlayerNode.active = true;
            PlayerNode.getComponent(this.nowChildName).ShowPlayerData(setEnd, this.playerAll, i);
            count++;
        }

    },
    ShowPX6GTDiPai: function (setEnd) {
        for (let i = 0; i < this.dipaiLayout.length; i++) {
            this.dipaiLayout.children[i].active = false;
        }
        //6滚筒显示埋底 6张牌
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_PX6GT) {
            let diPai = setEnd["diPai"];
            if (diPai.length > 0) {
                this.dipaiLayout.active = true;
                let nodeDemo = this.dipaiLayout.children[0];
                for (let i = 0; i < diPai.length; i++) {
                    let card = diPai[i];
                    let cardNode = this.dipaiLayout.children[i];
                    if (!cardNode) {
                        cardNode = cc.instantiate(nodeDemo);
                        this.dipaiLayout.addChild(cardNode);
                    }
                    cardNode.active = true;
                    this.GetPokeCard(card, cardNode);
                }
            }
        }
        //升级显示埋底8张牌
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_SJ) {
            let diPai = setEnd["diPai"];
            // diPai = [2, 22, 25, 26, 28, 29, 30, 65];//测试用
            if (diPai.length > 0) {
                this.dipaiLayout.active = true;
                let nodeDemo = this.dipaiLayout.children[0];
                for (let i = 0; i < diPai.length; i++) {
                    let card = diPai[i];
                    let cardNode = this.dipaiLayout.children[i];
                    if (!cardNode) {
                        cardNode = cc.instantiate(nodeDemo);
                        this.dipaiLayout.addChild(cardNode);
                    }
                    cardNode.active = true;
                    this.GetPokeCard(card, cardNode);
                }
            } else {
                console.error("没有底牌数据", setEnd);
            }
        }
        //------------------永州扯胡子
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_YZCHZ) {
            let maPai = setEnd["maPai"];
            let xingPai = setEnd["xingPai"];
            let allXingNum = setEnd["allXingNum"];
            this.HideSpCardNode();
            if (maPai > 0) {
                this.maCardNode.active = true;
                this.maCardNode.getChildByName("pai").cardID = maPai * 100;
                this.ShowCardImage(this.maCardNode.getChildByName("pai"));
            }
            if (xingPai > 0) {
                this.xingCardNode.active = true;
                this.xingCardNode.getChildByName("pai").cardID = xingPai * 100;
                this.ShowCardImage(this.xingCardNode.getChildByName("pai"));
                this.xingCardNode.getChildByName("num").getComponent(cc.Label).string = "x" + allXingNum;
            }
        }
        //------------------莲花广麻
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_LHGMMJ) {
            let maList = setEnd["maList"];
            let zhongList = setEnd["zhongList"];
            this.maListNode.active = !(zhongList.length <= 0 && maList.length <= 0);
            for (let i = 0; i < this.maListNode.children.length; i++) {
                this.maListNode.getChildByName('card0' + (i + 1)).active = false;
                this.maListNode.getChildByName("card0" + (i + 1)).color = cc.color(255, 255, 255);
            }
            for (let i = 0; i < maList.length; i++) {
                let cardType = maList[i];
                let node = this.maListNode.getChildByName("card0" + (i + 1));
                if (!node) {
                    node = cc.instantiate(this.maListNode.children[0]);
                    node.name = "card0" + (i + 1);
                    this.maListNode.addChild(node);
                }
                this.ShowImage(node, 'EatCard_Self_', cardType);
                node.active = true;
                if (zhongList.indexOf(cardType) > -1) {
                    node.color = cc.color(255, 255, 0);
                } else {
                    node.color = cc.color(255, 255, 255);
                }
            }
        }
        //------------------遵义麻将
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_ZYMJ) {
            let fanJi = setEnd["fanJi"];
            let ShangJi = setEnd["ShangJi"];
            let xiaJi = setEnd["xiaJi"];
            for (let i = 0; i < this.jipaiLayout.children.length; i++) {
                this.jipaiLayout.children[i].getComponent(cc.Label).string = "";
                this.jipaiLayout.children[i].getChildByName("card").getComponent(cc.Sprite).spriteFrame = "";
            }
            this.jipaiLayout.active = true;
            if (fanJi > 0) {
                this.jipaiLayout.children[0].getComponent(cc.Label).string = "翻鸡牌";
                let cardNode = this.jipaiLayout.children[0].getChildByName("card");
                this.ShowImage(cardNode, 'EatCard_Self_', fanJi);
            }
            if (ShangJi > 0) {
                this.jipaiLayout.children[1].getComponent(cc.Label).string = "上鸡牌";
                let cardNode = this.jipaiLayout.children[1].getChildByName("card");
                this.ShowImage(cardNode, 'EatCard_Self_', ShangJi);
            }
            if (xiaJi > 0) {
                this.jipaiLayout.children[2].getComponent(cc.Label).string = "下鸡牌";
                let cardNode = this.jipaiLayout.children[2].getChildByName("card");
                this.ShowImage(cardNode, 'EatCard_Self_', xiaJi);
            }
        }
        // ------------------wxls
        if (app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()] == app.ShareDefine().GameType_WXLS) {
            let publicCard = setEnd["publicCard"];
            if (publicCard == "") {
                this.dipaiLayout.active = false;
                return;
            }
            this.dipaiLayout.active = true;
            let nodeDemo = this.dipaiLayout.children[0];
            let cardNode = this.dipaiLayout.children[0];
            if (!cardNode) {
                cardNode = cc.instantiate(nodeDemo);
                this.dipaiLayout.addChild(cardNode);
            }
            cardNode.active = true;
            this.GetPokeCard(publicCard, cardNode);
        }
        //------------------永州扯胡子
    },
    ShowImage: function (childNode, imageString, cardID) {
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        //取卡牌ID的前2位
        let imageName = [imageString, Math.floor(cardID / 100)].join("");
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
    //---------点击函数---------------------
    OnClick: function (btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_last") {
            if (this.page == 1) {
                app.SysNotifyManager().ShowSysMsg("NowFirstPage");
                return;
            }
            this.page -= 1;
            this.ShowData();
        } else if (btnName == "btn_next") {
            if (this.page == this.maxpage) {
                app.SysNotifyManager().ShowSysMsg("NowLastPage");
                return;
            }
            this.page += 1;
            this.ShowData();
        } else if (btnName == "btn_share") {
            this.Click_btn_Share();
        } else if (btnName == "btn_replay") {
            this.NetManager.SendPack("game.CPlayerPlayBack", {
                "playBackCode": this.playBackCode,
                "chekcPlayBackCode": true
            }, this.OnPack_VideoData.bind(this), this.OnVideoFailed.bind(this));
            return;
        } else if (btnName == "btn_search") {
            if (isNaN(this.page_search.string) == true) {
                return false;
            }
            let page_search = parseInt(this.page_search.string);
            if (page_search < 1) {
                this.page = 1;
            } else if (page_search >= this.maxpage) {
                this.page = this.maxpage;
            } else {
                this.page = page_search;
            }
            this.ShowData();
        } else {
            this.ErrLog("OnClick not find btnName", btnName);
        }
    },
    OnPack_VideoData: function (serverPack) {
        //记录当前的switchData,退出的时候要调用
        let switchRecord = {
            action: "OpenUIRecordAllResult",
            playerAll: this.playerAll,
            roomId: this.roomId,
            unionId: this.unionId,
            roomKey: this.roomKey,
            gameType: this.gameTypeID,
            page: this.page
        };
        cc.sys.localStorage.setItem("switchRecord", JSON.stringify(switchRecord));
        app.Client.VideoCheckSubGame(serverPack.Name.toLowerCase(), this.playBackCode);
    },
    OnVideoFailed: function (serverPack) {
        app.SysNotifyManager().ShowSysMsg("MSG_REPLAY_ERROR");
    },
    Click_btn_Share: function () {
        let heroName = app.HeroManager().GetHeroProperty("name");
        let gameId = app.ShareDefine().GametTypeNameDict[this.gameType.toUpperCase()];
        let gameName = app.ShareDefine().GametTypeID2Name[gameId];
        let title = "回放码为【" + this.playBackCode + "】";
        let desc = "【" + heroName + "】邀请您观看【" + gameName + "】中牌局回放记录";
        let heroID = app.HeroManager().GetHeroProperty("pid");
        let cityId = app.HeroManager().GetHeroProperty("cityId");
        let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl") + heroID + "&cityid=" + cityId;
        console.log("回放码==" + this.playBackCode);
        this.SDKManager.Share(title, desc, weChatAppShareUrl, "0");
    },
    Str2Json: function (jsondata) {
        if (jsondata === "") {
            return false;
        }
        var json = JSON.parse(jsondata);
        return json;
    },
});
