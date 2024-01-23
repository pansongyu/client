"use strict";
cc._RF.push(module, 'fjssze81-b50a-4fc7-a832-b039dacd055c', 'UIFJSSZ_Result');
// script/game/FJSSZ/ui/UIFJSSZ_Result.js

"use strict";

var app = require("fjssz_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        bg: cc.Node,
        btn_look: cc.Node,

        lb_name: cc.Label,
        la_jifen: cc.Label,

        sp_type_bg1: cc.Node,
        sp_type_bg2: cc.Node,
        sp_type_bg3: cc.Node,

        zimo: cc.Node,
        sihongzhong: cc.Node,
        qiangganghu: cc.Node,
        qidui: cc.Node,
        sp_result: cc.Node,
        nd_meinv: cc.Node,

        huangzuang: cc.Node,

        seat: cc.Sprite,
        benjiasheng: cc.SpriteFrame,
        xiajiasheng: cc.SpriteFrame,
        duijiasheng: cc.SpriteFrame,
        shangjiasheng: cc.SpriteFrame,
        sheng: cc.Sprite,
        sheng1: cc.SpriteFrame,
        sheng2: cc.SpriteFrame,

        sp_man_number: cc.Label,

        lb_manum01: cc.Label,
        lb_manum02: cc.Label,
        lb_manum03: cc.Label,
        lb_manum04: cc.Label,

        btn_head: cc.Node,
        shandianLabel: cc.Label,

        nd_card: cc.Node,

        btn_goon: cc.Node,
        btn_exit: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.FormManager = app[app.subGameName + "_FormManager"]();
        this.MaCount = 8;

        this.btn_look.on("touchstart", this.Event_TouchStart, this);
        this.btn_look.on("touchend", this.Event_TouchEnd, this);
        this.btn_look.on("touchcancel", this.Event_TouchEnd, this);

        this.RegEvent("RoomEnd", this.Event_RoomEnd);

        this.SSSRoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();

        this.WeChatHeadImage = this.btn_head.getComponent(app.subGameName + "_WeChatHeadImage");
    },
    //-----------回调函数------------------
    Event_RoomEnd: function Event_RoomEnd() {
        this.ShowBtnGoonExit();
    },
    Event_TouchStart: function Event_TouchStart() {
        this.bg.active = false;
    },
    Event_TouchEnd: function Event_TouchEnd() {
        this.bg.active = true;
    },

    OnShow: function OnShow() {

        this.ShowBtnGoonExit();

        this.InitShowPlayerInfo();

        this.ShowPlayerZiMo();
    },
    ShowBtnGoonExit: function ShowBtnGoonExit() {
        var state = app[app.subGameName.toUpperCase() + "RoomMgr"]().GetEnterRoom().GetRoomProperty("state");
        if (state == this.ShareDefine.RoomState_End) {
            this.btn_goon.active = 0;
            this.btn_exit.active = 1;
        } else {
            this.btn_goon.active = 1;
            this.btn_exit.active = 0;
        }
    },
    InitShowPlayerInfo: function InitShowPlayerInfo() {
        this.lb_manum01.string = "";
        this.lb_manum02.string = "";
        this.lb_manum03.string = "";
        this.lb_manum04.string = "";

        this.lb_name.string = "";
        this.la_jifen.string = "";
    },
    ShowPlayerZiMo: function ShowPlayerZiMo() {
        var RoomPosMgr = this.SSSRoomMgr.GetEnterRoom().GetRoomPosMgr();
        var clientPos = RoomPosMgr.GetClientPos();
        var clientDownPos = RoomPosMgr.GetClientDownPos();
        var clientFacePos = RoomPosMgr.GetClientFacePos();
        var clientUpPos = RoomPosMgr.GetClientUpPos();

        var roomSet = this.SSSRoomMgr.GetEnterRoom().GetRoomSet();
        var setEnd = roomSet.GetRoomSetProperty("setEnd");
        var posHuList = setEnd["posHuList"];

        var huPos = -1;
        var huType = "";
        var zhongMa = 0;
        var maCardList = [];
        var posCount = posHuList.length;

        var allPosInfo = {};

        for (var index = 0; index < posCount; index++) {
            var posInfo = posHuList[index];
            var pos = posInfo["pos"];
            var posHuType = posInfo["huType"];

            allPosInfo[pos] = posInfo;

            if (posHuType != this.ShareDefine.HuType_NotHu) {
                huPos = pos;
                huType = posHuType;
                zhongMa = posInfo["zhongMa"];
                maCardList = posInfo["maCardList"];
                // break
            }
        }

        this.Check_HuType(huType);
        var clientPoint = allPosInfo[clientPos]["point"];
        var clientDownPoint = allPosInfo[clientDownPos]["point"];
        var clientFacePoint = allPosInfo[clientFacePos]["point"];
        var clientUpPoint = allPosInfo[clientUpPos]["point"];

        var point1 = clientPoint > 0 ? ["+", clientPoint].join("") : clientPoint;
        var point2 = clientDownPoint > 0 ? ["+", clientDownPoint].join("") : clientDownPoint;
        var point3 = clientFacePoint > 0 ? ["+", clientFacePoint].join("") : clientFacePoint;
        var point4 = clientUpPoint > 0 ? ["+", clientUpPoint].join("") : clientUpPoint;

        this.ShowPosInfo(point1, point2, point3, point4);

        this.shandianLabel.string = allPosInfo[clientPos]["flashCnt"];

        //如果有人胡了
        if (huPos != -1) {
            app.SoundManager().PlaySound("shengli");
            this.sp_man_number.string = zhongMa;

            var huPlayerInfo = this.SSSRoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(huPos);
            this.lb_name.string = huPlayerInfo["name"];
            var pid = huPlayerInfo["pid"];
            this.WeChatHeadImage.ShowHeroHead(pid);

            var huPoint = allPosInfo[huPos]["point"];
            this.la_jifen.string = huPoint > 0 ? ["+", huPoint].join("") : huPoint;

            if (huPos == clientPos) {
                this.seat.spriteFrame = this.benjiasheng;
                this.sheng.spriteFrame = this.sheng1;
            } else if (huPos == clientDownPos) {
                this.seat.spriteFrame = this.xiajiasheng;
                this.sheng.spriteFrame = this.sheng2;
            } else if (huPos == clientFacePos) {
                this.seat.spriteFrame = this.duijiasheng;
                this.sheng.spriteFrame = this.sheng2;
            } else if (huPos == clientUpPos) {
                this.seat.spriteFrame = this.shangjiasheng;
                this.sheng.spriteFrame = this.sheng2;
            }
            var roomConfig = this.SSSRoomMgr.GetEnterRoom().GetRoomConfig();
            var zhama = roomConfig["zhama"];
            if (zhama == this.ShareDefine.HZZhaMa_TwoMa || zhama == this.ShareDefine.HZZhaMa_FourMa || zhama == this.ShareDefine.HZZhaMa_SixMa) {
                this.sp_type_bg1.active = 0;
                this.sp_type_bg2.active = 0;
                this.sp_type_bg3.active = 1;
            } else if (zhama == this.ShareDefine.HZZhaMa_Ymqz) {
                this.sp_type_bg1.active = 0;
                this.sp_type_bg2.active = 1;
                this.sp_type_bg3.active = 0;
            } else if (zhama == this.ShareDefine.HZZhaMa_Yzdm) {
                this.sp_type_bg1.active = 1;
                this.sp_type_bg2.active = 0;
                this.sp_type_bg3.active = 0;
            }

            var maCount = maCardList.length;
            if (maCount == 1) {
                var value = ["CardShow", Math.floor(maCardList[0] / 100)].join("");
                var path = "bg/sp_result/sp_dingma/nd_card/sp_card01";
                this.SetWndProperty(path, "active", 1);
                this.SetWndProperty(path, "image", value);
            } else if (maCount > 1) {
                for (var i = 0; i < maCount; i++) {
                    var pai = maCardList[i].toString();
                    var paiType = pai.charAt(1);
                    var _path = this.ComTool.StringAddNumSuffix("bg/sp_result/sp_dingma/nd_card/sp_card", i + 1, 2);
                    if (paiType == 1 || paiType == 5 || paiType == 9) {
                        var _value = ["CardShow", Math.floor(maCardList[i] / 100)].join("");

                        this.SetWndProperty(_path, "active", 1);
                        this.SetWndProperty(_path, "image", _value);
                    } else {
                        this.SetWndProperty(_path, "active", 0);
                    }
                }
            } else {
                this.Log("maCardList not find", maCardList);
            }

            for (var _index = maCount + 1; _index <= this.MaCount; _index++) {
                var _path2 = this.ComTool.StringAddNumSuffix("bg/sp_result/sp_dingma/nd_card/sp_card", _index, 2);
                this.SetWndProperty(_path2, "active", 0);
            }
        }
    },

    ShowPosInfo: function ShowPosInfo(pos1Point, pos2Point, pos3Point, pos4Point) {
        this.lb_manum01.string = pos1Point;
        this.lb_manum02.string = pos2Point;
        this.lb_manum03.string = pos3Point;
        this.lb_manum04.string = pos4Point;
    },

    Check_HuType: function Check_HuType(huType) {
        if (huType == this.ShareDefine.HuType_ZiMo) {
            this.huangzuang.active = 0;
            this.nd_meinv.active = 1;
            this.sp_result.active = 1;

            this.zimo.active = 1;
            this.qiangganghu.active = 0;
            this.qidui.active = 0;
            this.sihongzhong.active = 0;
        } else if (huType == this.ShareDefine.HuType_QGH) {
            this.huangzuang.active = 0;
            this.nd_meinv.active = 1;
            this.sp_result.active = 1;

            this.zimo.active = 0;
            this.qiangganghu.active = 1;
            this.qidui.active = 0;
            this.sihongzhong.active = 0;
        } else if (huType == this.ShareDefine.HuType_FHZ) {
            this.huangzuang.active = 0;
            this.nd_meinv.active = 1;
            this.sp_result.active = 1;

            this.zimo.active = 0;
            this.qiangganghu.active = 0;
            this.qidui.active = 0;
            this.sihongzhong.active = 1;
        }
        //荒庄
        else {
                app.SoundManager().PlaySound("lost");
                this.huangzuang.active = 1;
                this.nd_meinv.active = 0;
                this.sp_result.active = 0;
            }
    },
    //---------设置接口---------------

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_goon") {
            this.Click_btn_goon();
            this.CloseForm();
        } else if (btnName == "btn_exit") {
            this.FormManager.ShowForm("UIResultTotal");
            this.CloseForm();
        } else if (btnName == "btn_look") {} else {
            console.error("OnClick not find btnName", btnName);
        }
    },
    Click_btn_goon: function Click_btn_goon() {
        var room = this.SSSRoomMgr.GetEnterRoom();
        if (!room) {
            console.error("Click_btn_ready not enter room");
            return;
        }
        var roomID = room.GetRoomProperty("roomID");

        // this.SSSRoomMgr.SendContinueGame(roomID);
        app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
    }

});

cc._RF.pop();