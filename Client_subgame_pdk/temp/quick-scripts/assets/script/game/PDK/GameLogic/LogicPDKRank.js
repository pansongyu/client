(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/PDK/GameLogic/LogicPDKRank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk694-f736-4cf5-bb2d-b9fc3b08728e', 'LogicPDKRank', __filename);
// script/game/PDK/GameLogic/LogicPDKRank.js

'use strict';

var app = require("pdk_app");

var LogicPDKRank = app.BaseClass.extend({

    Init: function Init() {
        this.dunTypes = ['DOWN', 'SELECTED', 'DUN1', 'DUN2', 'DUN3'];

        this.JS_Name = "Logic" + app.subGameName.toUpperCase() + "Rank";

        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.Define = app[app.subGameName.toUpperCase() + "Define"]();
        this.HUA_LEN = 4;
        this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        this.RoomPosMgr = app[app.subGameName.toUpperCase() + "RoomPosMgr"]();
        this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
        this.NetManager = app[app.subGameName + "_NetManager"]();
        this.LogicPDKGame = app["Logic" + app.subGameName.toUpperCase() + "Game"]();
        this.SetPos = app[app.subGameName.toUpperCase() + "SetPos"]();

        this.InitCount();
        this.lastShouCard = [];

        this.cardStateList = [];
        for (var idx = 0; idx < this.dunTypes.length; idx++) {
            var state = this.dunTypes[idx];
            this.cardStateList[state] = [];
        }
        this.Log("Init");
    },

    InitDunState: function InitDunState() {
        var shouCardList = this.SetPos.GetSetPosProperty("shouCard");
        this.specialType = this.SetPos.GetSetPosProperty("special");
        this.isSpecial = false;

        if (shouCardList.length > 13) {
            this.isSixteen = true;
        } else {
            this.isSixteen = false;
        }

        //如果和上一把牌相同，重新获取getRoomInfo
        if (this.lastShouCard.length) {
            var count = 0;
            for (var i = 0; i < shouCardList.length; i++) {
                var card = shouCardList[i];
                if (this.lastShouCard.indexOf(card) != -1) {
                    count++;
                }
            }
            if (count == 13) {
                var roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
                this.RoomMgr.SendGetRoomInfo(roomID);
                this.lastShouCard = [];
                return;
            }
        }
        this.lastShouCard = shouCardList;

        cc.log("LogicPDKRank 初始化");
        for (var idx = 0; idx < shouCardList.length; idx++) {
            this.cardStateList['DOWN'][idx] = shouCardList[idx];
        }

        this.cardStateList['DUN1'] = [];
        this.cardStateList['DUN2'] = [];
        this.cardStateList['DUN3'] = [];
        this.cardStateList['SELECTED'] = [];

        cc.log("LogicPDKRank 初始化完成");

        this.InitCount();
    },

    GetIsSixteen: function GetIsSixteen() {
        return this.isSixteen;
    },

    InitCount: function InitCount() {
        this.duiziCount = 0;
        this.liangduiCount = 0;
        this.santiaoCount = 0;
        this.shunziCount = 0;
        this.tonghuaCount = 0;
        this.huluCount = 0;
        this.zhadanCount = 0;
        this.tonghuaCount = 0;
        this.tonghuaShunCount = 0;
        this.wutongCount = 0;
    },

    GetSpecialType: function GetSpecialType() {
        return this.specialType;
    },

    SetSpecialCard: function SetSpecialCard() {
        this.isSpecial = true;
    },

    GetDunLength: function GetDunLength(dun) {
        return this.cardStateList[dun].length;
    },

    getDunListByType: function getDunListByType(type) {
        return this.cardStateList[type];
    },

    clearSelectedCards: function clearSelectedCards() {
        if (this.cardStateList['SELECTED'].length) {
            this.cardStateList['SELECTED'] = [];
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    SetCardSelected: function SetCardSelected(cardIdx) {
        //查询
        var cardType = this.cardStateList["DOWN"][cardIdx - 1];
        var pos = this.cardStateList['SELECTED'].indexOf(cardType);
        if (pos) {
            console.log('CheckDuiZi this.cardStateList[SELECTED]', this.cardStateList['SELECTED']);
            this.cardStateList['SELECTED'].push(cardType);
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        } else {
            this.Log("can not find cardtype %d", cardType);
        }
    },

    DeleteCardSelected: function DeleteCardSelected(cardIdx) {

        var cardType = this.cardStateList["DOWN"][cardIdx - 1];
        var pos = this.cardStateList['SELECTED'].indexOf(cardType);
        if (pos > -1) {
            this.cardStateList['SELECTED'].splice(pos, 1);
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    CheckDaoShui: function CheckDaoShui(dun) {
        var tempSelectCards = [];
        var DaoShui = 0; //倒水
        var NotDaoShui = 1; //没倒水

        for (var i = 0; i < this.cardStateList[dun].length; i++) {
            tempSelectCards.push(this.cardStateList[dun][i]);
        }for (var i = 0; i < this.cardStateList["SELECTED"].length; i++) {
            tempSelectCards.push(this.cardStateList["SELECTED"][i]);
            if (dun == "DUN1" && i == 2) break;else if ((dun == "DUN2" || dun == "DUN3") && i == 4) break;
        }

        if (dun == "DUN1" && tempSelectCards.length != 3) return NotDaoShui;else if (dun == "DUN1" && tempSelectCards.length == 3) {
            if (this.cardStateList["DUN2"].length != 5 && this.cardStateList["DUN3"].length != 5) return NotDaoShui;
        }

        if (dun == "DUN2" && tempSelectCards.length != 5) return NotDaoShui;else if (dun == "DUN2" && tempSelectCards.length == 5) {
            if (this.cardStateList["DUN3"].length != 5 && this.cardStateList["DUN1"].length != 3) return NotDaoShui;
        }

        if (dun == "DUN3" && tempSelectCards.length != 5) return NotDaoShui;

        if (dun == "DUN1") {
            if (this.cardStateList["DUN2"].length == 0 && this.cardStateList["DUN3"].length == 0) return NotDaoShui;

            if (this.cardStateList["DUN2"].length != 0) {
                if (app["Logic" + app.subGameName.toUpperCase() + "Game"]().CheckCardBigOrSmall(tempSelectCards, this.cardStateList["DUN2"]) == 0) return DaoShui;
            }
            if (this.cardStateList["DUN3"].length != 0) {
                if (app["Logic" + app.subGameName.toUpperCase() + "Game"]().CheckCardBigOrSmall(tempSelectCards, this.cardStateList["DUN3"]) == 0) return DaoShui;
            }
        } else if (dun == "DUN2") {
            if (this.cardStateList["DUN3"].length == 0 && this.cardStateList["DUN1"].length == 0) return NotDaoShui;

            if (this.cardStateList["DUN1"].length != 0) {
                if (app["Logic" + app.subGameName.toUpperCase() + "Game"]().CheckCardBigOrSmall(this.cardStateList["DUN1"], tempSelectCards) == 0) return DaoShui;
            }
            if (this.cardStateList["DUN3"].length != 0) {
                if (app["Logic" + app.subGameName.toUpperCase() + "Game"]().CheckCardBigOrSmall(tempSelectCards, this.cardStateList["DUN3"]) == 0) return DaoShui;
            }
        } else if (dun == "DUN3") {
            if (this.cardStateList["DUN1"].length == 0 && this.cardStateList["DUN2"].length == 0) return NotDaoShui;

            if (this.cardStateList["DUN1"].length != 0) {
                if (app["Logic" + app.subGameName.toUpperCase() + "Game"]().CheckCardBigOrSmall(this.cardStateList["DUN1"], tempSelectCards) == 0) return DaoShui;
            }
            if (this.cardStateList["DUN2"].length != 0) {
                if (app["Logic" + app.subGameName.toUpperCase() + "Game"]().CheckCardBigOrSmall(this.cardStateList["DUN2"], tempSelectCards) == 0) return DaoShui;
            }
        }
        return NotDaoShui;
    },
    AutoSetDun: function AutoSetDun() {

        if (this.isSixteen) {
            return;
        }

        if (this.cardStateList['DUN1'].length == 3 && this.cardStateList['DUN2'].length == 5 || this.cardStateList['DUN1'].length == 3 && this.cardStateList['DUN3'].length == 5 || this.cardStateList['DUN2'].length == 5 && this.cardStateList['DUN3'].length == 5) {

            var downList = [];
            downList = this.cardStateList['DOWN'];

            this.cardStateList['DOWN'] = [];
            this.clearSelectedCards();

            if (this.cardStateList['DUN1'].length < 3) {
                for (var idx = 0; idx < downList.length; idx++) {
                    this.cardStateList['DUN1'].push(downList[idx]);
                }
            } else if (this.cardStateList['DUN2'].length < 5) {
                for (var _idx = 0; _idx < downList.length; _idx++) {
                    this.cardStateList['DUN2'].push(downList[_idx]);
                }
            } else if (this.cardStateList['DUN3'].length < 5) {
                for (var _idx2 = 0; _idx2 < downList.length; _idx2++) {
                    this.cardStateList['DUN3'].push(downList[_idx2]);
                }
            }

            if (this.CheckDaoShui('DUN3') == 0) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("MSG_CARD_DAOSHUI");
                this.cardStateList['SELECTED'] = [];
                this.ClearDun('DUN3', false);
            }
            if (this.CheckDaoShui('DUN2') == 0) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("MSG_CARD_DAOSHUI");
                this.cardStateList['SELECTED'] = [];
                this.ClearDun('DUN2', false);
            }
            if (this.CheckDaoShui('DUN1') == 0) {
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("MSG_CARD_DAOSHUI");
                this.cardStateList['SELECTED'] = [];
                this.ClearDun('DUN1', false);
            }

            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    SetDun: function SetDun(dun) {
        //未选中或墩位已满
        if (this.cardStateList['SELECTED'] == []) {

            return;
        }

        if (this.CheckDaoShui(dun) == 0) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("MSG_CARD_DAOSHUI");
            this.cardStateList['SELECTED'] = [];
            this.ClearDun(dun, true);
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
            return;
        }

        for (var i = 0; i < this.cardStateList['SELECTED'].length; i++) {

            //选中的太多了
            if (dun == "DUN1" && this.cardStateList[dun].length >= 3) continue;
            if (dun == "DUN2" && this.cardStateList[dun].length >= 5) continue;
            if (dun == "DUN3" && this.cardStateList[dun].length >= 5) continue;

            var selectCardType = this.cardStateList['SELECTED'][i];
            var dunPos = this.cardStateList[dun].indexOf(selectCardType);
            var downPos = this.cardStateList["DOWN"].indexOf(selectCardType);

            if (dunPos == -1 && downPos > -1) {
                this.cardStateList['DOWN'].splice(downPos, 1);
                this.cardStateList[dun].push(selectCardType);
            }
        };

        this.cardStateList['SELECTED'] = [];
        app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    },

    pushDownCards: function pushDownCards(pokers) {
        this.cardStateList['DOWN'] = [];

        for (var idx = 0; idx < pokers.length; idx++) {
            var card = pokers[idx].cardX16;
            this.cardStateList['DOWN'].push(card);
        }

        app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    },

    ClearDun: function ClearDun(dun, trigger) {
        for (var i = 0; i < this.cardStateList[dun].length; i++) {
            var cardType = this.cardStateList[dun][i];
            var downPos = this.cardStateList["DOWN"].indexOf(cardType);
            if (-1 == downPos) {
                this.cardStateList['DOWN'].push(cardType);
            } else {
                this.ErrLog("failed to clear because down has this cardType %s", cardType);
            }
        };
        this.cardStateList[dun] = [];
        if (trigger) {
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    ClearOneCard: function ClearOneCard(dun, idx) {

        //如果该位置上没牌
        // console.log("SELECTED数组 + ", this.cardStateList['SELECTED']);
        if (!this.cardStateList[dun][idx]) {
            if (this.cardStateList['SELECTED'].length) {
                this.SetDun(dun);
            } else {
                return;
            }
        } else {
            var cardType = this.cardStateList[dun][idx];
            var downPos = this.cardStateList["DOWN"].indexOf(cardType);
            if (-1 == downPos) {
                for (var i = 0; i < this.cardStateList[dun].length; i++) {
                    if (cardType == this.cardStateList[dun][i]) {
                        this.cardStateList[dun].splice(i, 1);
                    }
                }
                this.cardStateList['DOWN'].push(cardType);
            } else {
                this.ErrLog("failed to clear because down has this cardType %s", cardType);
            }
        }

        app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    },

    CheckAllRanked: function CheckAllRanked() {
        var bAllRanked = true;
        if (this.isSixteen) {
            if (this.cardStateList["DOWN"].length > 3) {
                bAllRanked = false;
            }
        } else {
            if (this.cardStateList["DOWN"].length > 0) {
                bAllRanked = false;
            }
        }

        return bAllRanked;
    },

    CheckSelected: function CheckSelected(cardType) {
        // console.log("SELECTED数组 + ", this.cardStateList['SELECTED']);
        var downPos = this.cardStateList["SELECTED"].indexOf(cardType);
        if (-1 == downPos) {
            return false;
        }
        return true;
    },
    SendRankList: function SendRankList(dun) {
        var room = this.RoomMgr.GetEnterRoom();
        var roomID = room.GetRoomProperty("roomID");
        var pid = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        var posIdx = this.RoomPosMgr.GetClientPos();

        var sendPack = {
            roomID: roomID, //房间id
            pid: pid, //玩家id
            posIdx: posIdx, //玩家位置
            isSpecial: this.isSpecial,
            dunPos: {
                first: this.cardStateList["DUN1"],
                second: this.cardStateList["DUN2"],
                third: this.cardStateList["DUN3"]
            }
        };
        this.NetManager.SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "Ranked", sendPack, function () {}, function (error) {
            var roomid = app[app.subGameName.toUpperCase() + "RoomMgr"]().GetEnterRoom().GetRoomProperty("roomID");
            app[app.subGameName.toUpperCase() + "RoomMgr"]().SendGetRoomInfo(roomid);
        });
        this.ClearDun('DUN1', true);
        this.ClearDun('DUN2', true);
        this.ClearDun('DUN3', true);
        return true;
    },

    CheckDuiZi: function CheckDuiZi() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var duizis = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetDuiZi(downList);

        if (duizis.length > 0) {
            var duizi = [];

            if (this.duiziCount >= duizis.length) this.duiziCount = 0;

            if (1 == duizis.length) {
                duizi = duizis[0];
            } else {
                duizi = duizis[this.duiziCount];
            }
            this.duiziCount++;

            this.cardStateList['SELECTED'] = duizi;
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    CheckLiangDui: function CheckLiangDui() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var duizis = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetDuiZi(downList);

        if (this.liangduiCount >= duizis.length) this.liangduiCount = 0;

        if (duizis.length >= 2) {
            var fristDui = duizis[this.liangduiCount];
            var scendDui = [];
            for (var i = 0; i < duizis.length; i++) {
                scendDui = duizis[i];
                var bRet = this.LogicPDKGame.CheckSameValue(fristDui, scendDui);
                if (!bRet) break;
            }

            this.liangduiCount++;
            if (this.liangduiCount >= duizis.length) this.liangduiCount = 0;

            var liangdui = fristDui.concat(scendDui);
            this.cardStateList['SELECTED'] = liangdui;
        }
        if (this.cardStateList['SELECTED'].length < 4) {
            //对子数量不足
            console.log("this.cardStateList[SELECTED]", this.cardStateList['SELECTED']);
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase() + "_DUIZI_NOT_ENOUGH");
            return;
        }
        app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    },

    CheckSanTiao: function CheckSanTiao() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var santiaos = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetSanTiao(downList);

        if (santiaos.length) {
            var santiao = [];
            if (1 == santiaos.length) {
                santiao = santiaos[0];
            } else {
                santiao = santiaos[this.santiaoCount];
            }
            this.santiaoCount++;

            if (this.santiaoCount >= santiaos.length) this.santiaoCount = 0;
            this.cardStateList['SELECTED'] = santiao;
        } else {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase() + "_SANTIAO_NOT_ENOUGH");
        }
        app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    },

    CheckShunzi: function CheckShunzi() {

        this.cardStateList['SELECTED'] = [];
        var shunzis = [];
        var downList = this.cardStateList['DOWN'];
        shunzis = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetShunzi(downList);

        if (shunzis.length) {

            var shunzi = [];

            if (this.shunziCount >= shunzis.length) this.shunziCount = 0;

            if (1 == shunzis.length) {
                shunzi = shunzis[0];
            } else {
                shunzi = shunzis[this.shunziCount];
            }
            this.shunziCount++;

            this.cardStateList['SELECTED'] = shunzi;

            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        } else {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase() + "_SHUNZI_NOT_ENOUGH");
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    CheckTonghua: function CheckTonghua() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var tonghuas = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetTonghua(downList);

        if (tonghuas.length) {
            var tonghua = [];

            if (this.tonghuaCount >= tonghuas.length) this.tonghuaCount = 0;

            if (1 == tonghuas.length) {
                tonghua = tonghuas[0];
            } else {
                tonghua = tonghuas[this.tonghuaCount];
            }
            this.tonghuaCount++;

            this.cardStateList['SELECTED'] = tonghua;
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    CheckHulu: function CheckHulu() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var duizis = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetDuiZi(downList);
        var santiaos = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetSanTiao(downList);
        var hulus = [];
        for (var i = 0; i < duizis.length; i++) {
            var dui = duizis[i];
            for (var j = 0; j < santiaos.length; j++) {
                var san = santiaos[j];
                if (!this.LogicPDKGame.CheckSameValue(dui, san)) {
                    var hulu = dui.concat(san);
                    hulus[hulus.length] = hulu;
                }
            }
        }

        this.huluCount++;

        if (this.huluCount >= hulus.length) this.huluCount = 0;

        this.cardStateList['SELECTED'] = hulus[this.huluCount];
        app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    },

    CheckZhaDang: function CheckZhaDang() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var zhadangs = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetZhaDang(downList);

        if (zhadangs.length > 0) {
            var zhadan = [];

            if (this.zhadanCount >= zhadangs.length) this.zhadanCount = 0;

            if (1 == zhadangs.length) {
                zhadan = zhadangs[0];
            } else {
                zhadan = zhadangs[this.zhadanCount];
            }
            this.zhadanCount++;

            this.cardStateList['SELECTED'] = zhadan;
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        } else {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase() + "_ZHADAN_NOT_ENOUGH");
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    CheckTongHuaShun: function CheckTongHuaShun() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var tonghuaShuns = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetTongHuaShunEx(downList);

        if (tonghuaShuns.length) {
            var tonghuashun = [];

            if (this.tonghuaShunCount >= tonghuaShuns.length) this.tonghuaShunCount = 0;

            if (1 == tonghuaShuns.length) {
                tonghuashun = tonghuaShuns[0];
            } else {
                tonghuashun = tonghuaShuns[this.tonghuaShunCount];
            }
            this.tonghuaShunCount++;

            this.cardStateList['SELECTED'] = tonghuashun;
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        } else {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase() + "_TONGHUASHUN_NOT_ENOUGH");
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        }
    },

    CheckWuTong: function CheckWuTong() {
        this.cardStateList['SELECTED'] = [];
        var downList = this.cardStateList['DOWN'];
        var wutongs = app["Logic" + app.subGameName.toUpperCase() + "Game"]().GetWuTong(downList);

        if (wutongs.length) {
            var wutong = [];

            if (this.wutongCount >= wutongs.length) this.wutongCount = 0;

            if (1 == wutongs.length) {
                wutong = wutongs[0];
            } else {
                wutong = wutongs[this.wutongCount];
            }
            this.wutongCount++;

            this.cardStateList['SELECTED'] = wutong;
            app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
        } else {
            //app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(app.subGameName.toUpperCase()+"_TONGHUASHUN_NOT_ENOUGH"); 
            //app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
            console.log('没有五同');
        }
    },
    SetDunEx: function SetDunEx(dun, catlist) {
        this.cardStateList['SELECTED'] = catlist;
        for (var i = 0; i < this.cardStateList['SELECTED'].length; i++) {

            //选中的太多了
            if (dun == "DUN1" && this.cardStateList[dun].length >= 3) continue;
            if (dun == "DUN2" && this.cardStateList[dun].length >= 5) continue;
            if (dun == "DUN3" && this.cardStateList[dun].length >= 5) continue;

            var selectCardType = this.cardStateList['SELECTED'][i];
            var dunPos = this.cardStateList[dun].indexOf(selectCardType);
            var downPos = this.cardStateList["DOWN"].indexOf(selectCardType);

            if (dunPos == -1 && downPos > -1) {
                this.cardStateList['DOWN'].splice(downPos, 1);
                this.cardStateList[dun].push(selectCardType);
            }
        };
        this.cardStateList['SELECTED'] = [];
        //app[app.subGameName + "Client"].OnEvent("EVT_DUN_UPDATE");
    }

});

var g_LogicPDKRank = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_LogicPDKRank) {
        g_LogicPDKRank = new LogicPDKRank();
    }
    return g_LogicPDKRank;
};

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
        //# sourceMappingURL=LogicPDKRank.js.map
        