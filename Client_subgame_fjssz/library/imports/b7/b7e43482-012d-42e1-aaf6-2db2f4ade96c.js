"use strict";
cc._RF.push(module, 'b7e43SCAS1C4ar2LbL0rels', 'fjssz_UIRoomTest');
// script/ui/fjssz_UIRoomTest.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        cardPrefab: cc.Prefab,
        icon_mapai: cc.SpriteFrame
    },
    OnCreateInit: function OnCreateInit(cards) {
        this.PokerCard = app[app.subGameName + "_PokerCard"]();
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
        this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.LogicRank = app[app.subGameName.toUpperCase() + "LogicRank"]();
        this.LogicGame = app[app.subGameName.toUpperCase() + "LogicGame"]();

        this.ChooseCardAddOffY = 45;
        // this.InitBtnCardPosY = -30;
        this.InitBtnCardPosY = 0;
        this.cardSpcedX = 10; //卡牌间的距离

        this.cardArr = [];
    },

    OnShow: function OnShow(cards) {

        var c = [];

        this.totalNum = 0;

        // cc.log(cards)

        var bg = this.node.getChildByName("bg");
        for (var i = 0; i < bg.children.length; i++) {
            var element = bg.children[i];
            element.destroy();
        }
        var model = this.node.getChildByName("model");
        model.active = false;

        for (var _i = 0; _i < cards.length; _i++) {
            var _element = cards[_i];
            c.push(_element.key);
        }
        cards = c;
        cards.sort();
        console.log(cards.length);
        var col = 25;var inix = -500;
        var iniy = 250;
        for (var _i2 = 0; _i2 < cards.length; _i2++) {
            var _element2 = cards[_i2];

            console.log(_element2);

            var row = Math.floor(_i2 / 25);
            var col = _i2 % 25;
            //  let cardbutton= cc.instantiate(cc.Button);

            var card = cc.instantiate(this.cardPrefab);
            card.addComponent(cc.Button);

            card.setPosition(inix + col * 40, iniy - row * 80);

            bg.addChild(card);
            card.on('click', this.Click_card, this);
            card.element = _element2;

            this.ShowCard(_element2, card);
            // bg.getComponent(cc.Layout).enabled = false ;
        }

        // cc.log(this.cards)

        // let c = []
        // for (let i = 0; i < cards.length; i++) {
        //     const element = cards[i];
        //     c.push(element.key)
        // }
        // cards = c
        // this.cards = cards
        // cards.sort()
        // this.totalNum = 0
        // this.cardMap = {}
        // for (let i = 0; i < cards.length; i++) {
        //     const element = this.GetValue(cards[i]);
        //     if(!element) continue
        //     if (!this.cardMap[element]) {
        //         this.cardMap[element] = []
        //     }
        //     this.cardMap[element].push(cards[i])
        // }
        // cc.log(this.cardMap)

        // let model = this.node.getChildByName("model")
        // let bg = this.node.getChildByName("bg")
        // for (let i = 0; i < bg.children.length; i++) {
        //     const element = bg.children[i];
        //     element.destroy()
        // }
        // for (const key in this.cardMap) {
        //     if (!Object.hasOwnProperty.call(this.cardMap, key)) continue;
        //     let item = cc.instantiate(model)
        //     item.parent = bg
        //     item.active = true
        //     let name = this.GetName(key)
        //     item.getChildByName("poker").getChildByName("Label").getComponent(cc.Label).string = name
        //     item.name = key
        // }
        // model.active = false
    },
    GetValue: function GetValue(v) {
        //字符串十六进制转int型
        var or = parseInt(v.substring(0, 4));
        v = or;
        if (!v) v = 0;
        v = v % 16;
        if (or > 0x40) {
            return 14;
        }
        if (v == 14) {
            return 1;
        }
        if (v == 15) {
            return 2;
        }
        return v;
    },
    GetName: function GetName(v) {
        if (!v) return "";
        var names = ["扑克A", "扑克2", "扑克3", "扑克4", "扑克5", "扑克6", "扑克7", "扑克8", "扑克9", "扑克10", "扑克J", "扑克Q", "扑克K", "小鬼", "大鬼"];
        return names[v - 1] || "";
    },
    Sure: function Sure() {
        var _this = this;

        //        ["方块",      "草花" ，   "红桃" , "黑桃" ]
        // 1: (4) ["0x0e" 14, "0x1e" 30, "0x2e" 46, "0x3e" 62]
        // 2: (3) ["0x02" 2, "0x12" 18, "0x22" 34]
        // 3: (3) ["0x03" 3, "0x13" 19, "0x23" 35]
        // 4: (3) ["0x04" 4, "0x14" 20， "0x24" 36]
        // 5: (3) ["0x05" 5, "0x15" 21, "0x25" 37] 
        // 6: (3) ["0x06" 6, "0x16" 22, "0x26" 38]
        // 7: (3) ["0x07" 7, "0x17" 23, "0x27" 39]
        // 8: (3) ["0x08" 8, "0x18" 24, "0x28" 40]
        // 9: (3) ["0x09" 9, "0x19" 25, "0x29" 41]
        // 10: (4) ["0x0a" 10, "0x1a" 26, "0x2a" 42, "0x3a"58]
        // 11: (4) ["0x0b" 11, "0x1b" 27, "0x2b" 43, "0x3b"59]
        // 12: (4) ["0x0c" 12, "0x1c" 28, "0x2c" 44, "0x3c" 60]
        // 13: (4) ["0x0d" 13, "0x1d" 29, "0x2d" 45, "0x3d" 61]
        // 14: (8) ["0x42" 66, "0x43" 67, "0x44" 68, "0x45" 69, "0x46" 70, "0x47" 71, "0x48" 72 , "0x49" 73]
        // let bg = this.node.getChildByName("bg")
        console.log('点击了确认按钮');
        var test = [];
        // [0x3e,0x2d,0x1d,0x3b,0x25,0x05,0x24,0x43,0x3c,0x45,0x17,0x47,0x42]
        //  [0x3e,0x12,0x22,0x25,0x08,0x09,0x1b,0x3b,0x2c,0x3c,0x42,0x43,0x45]
        // [0x2e,0x1e,0x13,0x24,0x06,0x16,0x27,0x0a,0x3a,0x0b,0x0c,0x42,0x44]
        // for (let i = 0; i < bg.children.length; i++) {
        //     const element = bg.children[i].name;
        //     if (!this.cardMap[element] || this.cardMap[element].length == 0) continue
        //     let num = parseInt(bg.children[i].getChildByName("num").getComponent(cc.Label).string)
        //     for (let index = 0; index < Math.min(num, this.cardMap[element].length); index++) {
        //         test.push(parseInt(this.cardMap[element][index]))
        //     }
        // }
        if (this.cardArr.length < 13) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("请选择13张牌");
            return;
        }

        for (var i = 0; i < 13; i++) {

            test.push(parseInt(this.cardArr[i]));
        }
        console.log(test);

        if (!this.RoomMgr) return;

        if (!this.roomID) return;
        var that = this;
        // 传9988 设置测试牌
        this.SendChat(5, 9988, this.roomID, JSON.stringify(test), function (msg) {
            console.log(msg);
            if (msg.code == "Success") {
                _this.ShowSysMsg(msg.msg);
                that.CloseForm();
                _this.cardArr = [];
            }
        });
        console.log(test);
    },
    Add: function Add(event) {
        var bg = this.node.getChildByName("bg");
        var key = event.target.parent.name;
        var num = parseInt(bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string);
        num++;
        if (this.totalNum >= 13) return;
        if (num > this.cardMap[key].length) {
            num = this.cardMap[key].length;
        } else {
            this.totalNum++;
        }
        bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string = num;
    },
    Del: function Del(event) {
        var bg = this.node.getChildByName("bg");
        var key = event.target.parent.name;
        var num = parseInt(bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string);
        num--;
        if (num < 0) {
            num = 0;
        } else {
            this.totalNum--;
        }
        bg.getChildByName(key).getChildByName("num").getComponent(cc.Label).string = num;
    },
    SendChat: function SendChat(type, quickID, roomID, content, success) {
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Chat", { "type": type, "quickID": quickID, "targetID": roomID, "content": content }, success);
    },

    ShowCard: function ShowCard(cardType, btnNode) {
        var newPoker = this.PokerCard.SubCardValue(cardType);
        this.PokerCard.GetPokeCard(newPoker, btnNode);

        btnNode.getChildByName("poker_back").active = false;
        btnNode.active = true;
        cc.tween(btnNode).delay(0.1).to(0.01, { opacity: 255 }).start();
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) return;

        var child = btnNode.getChildByName("icon_mapai");
        var kexuanwanfa = room.GetRoomConfigByProperty("kexuanwanfa");
        if (kexuanwanfa.length > 0) {
            if (kexuanwanfa.indexOf(0) > -1) {
                var maPaiValue = room.GetRoomSet().GetRoomSetProperty("mapai");
                if (newPoker == maPaiValue) {
                    child.active = true;
                } else {
                    child.active = false;
                }
            } else {
                child.active = false;
            }
        }
    },
    Click_card: function Click_card(clickNode) {

        var element = clickNode.node.element;

        var isContained = this.cardArr.includes(element);
        if (!isContained) {
            if (this.cardArr.length >= 13) {
                console.log('已选13张');
                return;
            }
            this.cardArr.push(element);
            clickNode.node.y += this.ChooseCardAddOffY;
        } else {
            var index = this.cardArr.indexOf(element);
            if (index !== -1) {
                this.cardArr.splice(index, 1);
            }

            clickNode.node.y -= this.ChooseCardAddOffY;
        }

        console.log(this.cardArr);
        //  clickNode.node.getChildByName("bg_black").active = true;
        // let reg = new RegExp("btn_", "g");
        // if (btnName.indexOf("btn_") != -1) {
        // 	var result = btnName.replace(reg, "");
        // 	btnName = result;
        // }
        // let cardIdx = btnName.toString();
        // btnNode.y = this.InitBtnCardPosY;
        // let bSelected = this.LogicRank.CheckSelected(cardType);
        // if (bSelected) {

        // }
        this.ShowCard(clickNode.node.element, clickNode.node);

        // if (clickNode.node.y == this.InitBtnCardPosY) {
        //     clickNode.node.position = cc.v2(clickNode.node.x, this.ChooseCardAddOffY);
        //     console.log('1111111111');
        //     // clickNode.node.setPosition(clickNode.node.x,this.ChooseCardAddOffY);
        // 	// this.LogicRank.SetCardSelected(cardIdx);
        // 	// this.HuHuanPai();
        // } else {
        // 	// this.LogicRank.DeleteCardSelected(cardIdx);
        //     console.log('2222222222');
        //     clickNode.node.position = cc.v2(clickNode.node.x, this.ChooseCardAddOffY);
        //     // clickNode.node.setPosition(clickNode.node.x,this.InitBtnCardPosY);
        // }
    },
    HuHuanPai: function HuHuanPai() {
        for (var key in this.clickDunDict) {
            if (this.clickDunDict[key][3]) {
                this.LogicRank.ClearOneCard(this.clickDunDict[key][0], this.clickDunDict[key][1]);
                this.LogicRank.AutoSetDun();
                this.reSortCards();
                this.disabledBtn();
            }
            this.clickDunDict[key][2].clickNum = 0;
            this.clickDunDict[key][2].children[0].y = 0;
            this.clickDunDict[key][3] = false;
        }
    }
});

cc._RF.pop();