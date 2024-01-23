"use strict";
cc._RF.push(module, 'b9ad3uTKEtDrp7dMlGYdD9F', 'UILSDunCards');
// script/game/FJSSZ/UILSDunCards.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var app = require("fjssz_app");
var UILSDunCards = /** @class */ (function (_super) {
    __extends(UILSDunCards, _super);
    function UILSDunCards() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.posVec = [];
        _this.angleVec = [];
        return _this;
    }
    UILSDunCards.prototype.onLoad = function () {
        for (var i = 1; i <= 13; i++) {
            var node = this.node.getChildByName("dun_card" + i);
            this.posVec.push(cc.v2(node.x, node.y));
            this.angleVec.push(0 /*node.angle*/);
            node.zIndex = i;
        }
        if (this.node.getChildByName("img_special")) {
            this.node.getChildByName("img_special").zIndex = cc.macro.MAX_ZINDEX;
        }
        if (this.node.getChildByName("show")) {
            this.node.getChildByName("show").zIndex = cc.macro.MAX_ZINDEX;
        }
        if (this.node.getChildByName("reset")) {
            this.node.getChildByName("reset").zIndex = cc.macro.MAX_ZINDEX;
        }
    };
    UILSDunCards.prototype.startAni = function () {
        this.stopWaitAnim();
        this.schedule(this.playWaitAnim.bind(this), 2, 99999, 0.0);
        var names = ["dun_card3", "dun_card8", "dun_card13"];
        for (var dunIndex = 0; dunIndex < names.length; dunIndex++) {
            var node = this.node.getChildByName(names[dunIndex]).getChildByName("tag");
            if (node)
                node.active = false;
        }
        this.resetIndex();
    };
    UILSDunCards.prototype.stopWaitAnim = function () {
        this.unscheduleAllCallbacks();
        for (var i = 1; i <= 13; i++) {
            var node = this.node.getChildByName("dun_card" + i);
            node.x = this.posVec[i - 1].x;
            node.y = this.posVec[i - 1].y;
            node.angle = this.angleVec[i - 1];
            node.stopAllActions();
        }
    };
    UILSDunCards.prototype.resetAngle = function () {
        for (var i = 1; i <= 13; i++) {
            var node = this.node.getChildByName("dun_card" + i);
            node.x = this.posVec[i - 1].x;
            node.y = this.posVec[i - 1].y;
            node.angle = 0;
        }
    };
    UILSDunCards.prototype.playWaitAnim = function () {
        // let m = this.node.getChildByName("dun_card11")
        // for (let i = 1; i <= 13; i++) {
        // 	let node = this.node.getChildByName("dun_card" + i)
        //     if (i <= 3) {
        //         cc.tween(node).delay(0.4)
        //         .to(0.2, {position:this.posVec[i-1]})
        //         .to(0.15, {angle:this.angleVec[i-1]})
        //         .delay(1)
        //         .to(0.2, {angle:0,position:cc.v2(m.x,m.y)})
        //         .start()
        //     }
        //     else if (i <= 8) {
        //         cc.tween(node).delay(0.2)
        //         .to(0.2, {position:this.posVec[i-1]})
        //         .to(0.15, {angle:this.angleVec[i-1]})
        //         .delay(1.2)
        //         .to(0.2, {angle:0,position:cc.v2(m.x,m.y)})
        //         .start()
        //     }
        //     else{
        //         cc.tween(node)
        //         .to(0.2, {position:this.posVec[i-1]})
        //         .to(0.15, {angle:this.angleVec[i-1]})
        //         .delay(1.4)
        //         .to(0.2, {angle:0,position:cc.v2(m.x,m.y)})
        //         .start()
        //     }
        // }
    };
    UILSDunCards.prototype.showCardType = function (dunIndex, cardType) {
        var names = ["dun_card3", "dun_card8", "dun_card13"];
        var node = this.node.getChildByName(names[dunIndex]).getChildByName("tag");
        if (!node)
            return;
        if (cardType == 9 || cardType == 10) {
            cardType = 8;
        }
        cc.loader.loadRes("texture/game/ls/play/cardType_" + cardType, cc.SpriteFrame, function (error, spriteFrame) {
            if (error) {
                return;
            }
            node.active = true;
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    };
    UILSDunCards.prototype.fanPaiAction = function (dunIndex) {
        var s = [[1, 3], [4, 8], [9, 13]];
        var s2 = s[dunIndex];
        if (!s2)
            return;
        for (var i = s2[0]; i <= s2[1]; i++) {
            var node = this.node.getChildByName("dun_card" + i);
            node.stopAllActions();
            if (node.zIndex < 1000)
                node.zIndex = 1000 + node.zIndex;
            cc.tween(node)
                .to(0.1, { scale: 1.3 })
                .delay(0.45)
                .to(0.1, { angle: 0 })
                .delay(0.2)
                .to(0.1, { scale: 1.0 })
                .call(function () {
                //if(node.zIndex >= 1000) node.zIndex = node.zIndex - 1000
            })
                .start();
        }
    };
    UILSDunCards.prototype.touch = function () {
        var _this = this;
        if (this.node.parent.parent && this.node.parent.parent.name == "sp_seat00") {
            var ranked = app[app.subGameName.toUpperCase() + "RoomSet"]().GetRoomSetProperty("ranked");
            cc.log(ranked);
            if (!ranked || !ranked.dunPos || !ranked.dunPos.first)
                return;
            var dunPos = ranked.dunPos;
            var cards = dunPos.first.concat(dunPos.second).concat(dunPos.third);
            for (var i = 1; i <= 13; i++) {
                var node = this.node.getChildByName("dun_card" + i);
                app.playuissz.ShowResultCard(cards[i - 1] || 0, node);
            }
            this.scheduleOnce(function () {
                for (var i = 1; i <= 13; i++) {
                    var node = _this.node.getChildByName("dun_card" + i);
                    node.getChildByName("poker_back").active = true;
                }
            }, 5);
        }
    };
    UILSDunCards.prototype.reset = function () {
        if (this.node.parent.parent && this.node.parent.parent.name == "sp_seat00") {
            var ranked = app[app.subGameName.toUpperCase() + "RoomSet"]().GetRoomSetProperty("ranked");
            cc.log(ranked);
            if (!ranked || !ranked.dunPos || !ranked.dunPos.first)
                return;
            app.playuissz.Click_btn_baipai();
        }
    };
    UILSDunCards.prototype.resetIndex = function () {
        var s = [[1, 3], [4, 8], [9, 13]];
        for (var dunIndex = 0; dunIndex < 3; dunIndex++) {
            var s2 = s[dunIndex];
            if (!s2)
                continue;
            for (var i = s2[0]; i <= s2[1]; i++) {
                var node = this.node.getChildByName("dun_card" + i);
                node.stopAllActions();
                if (node.zIndex >= 1000)
                    node.zIndex = node.zIndex - 1000;
                node.rotation = 0;
            }
        }
    };
    UILSDunCards.prototype.update = function (dt) {
        var showActive = true;
        var showReset = true;
        var node = this.node.getChildByName("dun_card1");
        if (!this.node.parent.parent || this.node.parent.parent.name != "sp_seat00") {
            showActive = false;
            showReset = false;
        }
        else if (node.getChildByName("poker_back").active == false) {
            showActive = false;
        }
        var RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        var room = RoomMgr.GetEnterRoom();
        var roomState = room.GetRoomProperty("state");
        if (roomState != app[app.subGameName + "_ShareDefine"]().RoomState_Playing) {
            showActive = false;
            showReset = false;
        }
        var ClientPos = RoomMgr.GetEnterRoom().GetRoomPosMgr().GetClientPos();
        var myPosInfo = RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(ClientPos);
        if (!myPosInfo || !myPosInfo.isCardReady) {
            showReset = false;
        }
        if (this.node.getChildByName("show")) {
            this.node.getChildByName("show").active = showActive;
        }
        if (this.node.getChildByName("reset")) {
            this.node.getChildByName("reset").active = showReset;
        }
    };
    UILSDunCards = __decorate([
        ccclass
    ], UILSDunCards);
    return UILSDunCards;
}(cc.Component));
exports.default = UILSDunCards;

cc._RF.pop();