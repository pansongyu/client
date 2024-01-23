(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIRecordAll.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '10b9cYD71VNT5jiJ9weHUic', 'UIRecordAll', __filename);
// script/ui/UIRecordAll.js

"use strict";

/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIRecordAll_Child: cc.Prefab,
        Scrollow: cc.Node,

        btnNodeGroup: cc.Node,
        pafabItem: cc.Node,
        pafabAllItem: cc.Node,
        lb_page: cc.Label
    },

    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.ComTool = app.ComTool();
        this.loopScrollView = this.getComponent("LoopScrollView");
        this.NetManager = app.NetManager();
        this.HeroManager = app.HeroManager();
        this.heroID = app.HeroManager().GetHeroProperty("pid");
        this.selectGameType = -1;
        this.selectPage = 1;
        this.lastSelectPage = 1;
    },
    OnShow: function OnShow() {
        var clubId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var unionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this.clubId = clubId;
        this.unionId = unionId;
        this.FormManager.ShowForm('UITop', "UIRecordAll");
        /*if(0 == clubId){
            this.NetManager.SendPack("game.CPlayerRoomRecord",{type:1},this.OnPack_CPlayerRoomRecord.bind(this),this.OnPack_CPlayerRoomRecordFail.bind(this));
        }else{
            this.NetManager.SendPack("club.CClubRoomRecord",{type:1,clubId:this.clubId},this.OnPack_CPlayerRoomRecord.bind(this),this.OnPack_CPlayerRoomRecordFail.bind(this));
        }*/
        // let that=this;
        // app.NetManager().SendPack('family.CPlayerGameList',{},function(serverPack){
        //     that.InitgameBtns(serverPack);
        // },function(serverPack){
        //     that.InitgameBtns(serverPack);
        // });
        this.InitgameBtns({ "gameList": app.Client.GetAllGameId() });
        this.node.getChildByName("right").getChildByName("btn_tongji").active = clubId > 0;
    },
    ShowRecord: function ShowRecord(gameType) {
        var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        this.selectGameType = gameType;
        this.selectPage = page;
        for (var i = 0; i < this.btnNodeGroup.children.length; i++) {
            this.btnNodeGroup.children[i].getChildByName('icon').active = false;
        }
        if (gameType == -1) {
            this.btnNodeGroup.getChildByName('btn_quanbu').getChildByName('icon').active = true;
        } else {
            var gemePY = this.ShareDefine.GametTypeID2PinYin[gameType];
            this.btnNodeGroup.getChildByName('btn_' + gemePY).getChildByName('icon').active = true;
        }
        this.NetManager.SendPack("game.CPlayerRoomRecord", { "clubId": this.clubId, 'gameType': gameType, 'pageNum': page }, this.OnPack_CPlayerRoomRecord.bind(this), this.OnPack_CPlayerRoomRecordFail.bind(this));
    },
    InitgameBtns: function InitgameBtns(serverPack) {
        //this.btnNodeGroup.removeAllChildren();
        this.DestroyAllChildren(this.btnNodeGroup);
        this.gameList = {};
        this.gameList['quanbu'] = "全部";
        if (serverPack.gameList && serverPack.gameList != "null") {
            var gameIDList = serverPack.gameList;
            for (var i = 0; i < gameIDList.length; i++) {
                var gamePinYin = this.ShareDefine.GametTypeID2PinYin[gameIDList[i]];
                var gameName = this.ShareDefine.GametTypeID2Name[gameIDList[i]];
                this.gameList[gamePinYin] = gameName;
            }
        } else {
            this.gameList['ddz'] = '斗地主';
        }
        for (var key in this.gameList) {
            var node = null;
            if (key != 'quanbu') {
                node = cc.instantiate(this.pafabItem);
                node.getChildByName('icon_off').getComponent(cc.Label).string = this.gameList[key];
                node.getChildByName('icon').getChildByName('icon_on').getComponent(cc.Label).string = this.gameList[key];
            } else {
                node = cc.instantiate(this.pafabAllItem);
            }
            node.active = true;
            node.name = 'btn_' + key;
            this.btnNodeGroup.addChild(node);
        }
        this.ShowRecord(-1);

        //this.scroll_Left.scrollToTop();
    },
    SortRecodeByTime: function SortRecodeByTime(a, b) {
        // return b.data.endTime - a.data.endTime;
        return b.endTime - a.endTime;
    },
    OnPack_CPlayerRoomRecord: function OnPack_CPlayerRoomRecord(serverPack) {
        console.log("OnPack_CPlayerRoomRecord serverPack:", serverPack);
        if (serverPack.hasOwnProperty('pRoomRecords')) {
            var recodelist = serverPack.pRoomRecords;
            if (recodelist.length <= 0) {
                this.selectPage = this.lastSelectPage;
                return;
            }
            app['recodelist'] = recodelist;
            var sortList = [];
            for (var key in recodelist) {
                sortList.push(recodelist[key]);
            }
            sortList.sort(this.SortRecodeByTime);
            var everyGameKeys = Object.keys(sortList);
            this.lb_page.string = this.selectPage;
            this.ScrollViewData(everyGameKeys);
        } else {
            this.lb_page.string = "1";
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
    },
    OnPack_CPlayerRoomRecordFail: function OnPack_CPlayerRoomRecordFail(serverPack) {
        //this.ScrollViewData({});
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    ScrollViewData: function ScrollViewData(everyGameKeys) {
        this.loopScrollView.InitScrollData("UIRecordAll_Child", this.UIRecordAll_Child, everyGameKeys);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_huifang") {
            this.FormManager.ShowForm("UIReplayCode");
        } else if (btnName == "btn_tongji") {
            this.FormManager.ShowForm("ui/club/UIClubPlayerRecord", this.clubId, this.unionId);
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_zhanji_next") {
            this.lastSelectPage = this.selectPage;
            this.ShowRecord(this.selectGameType, this.selectPage + 1);
        } else if (btnName == "btn_zhanji_last") {
            if (this.selectPage <= 1) {
                return;
            }
            this.lastSelectPage = this.selectPage;
            this.ShowRecord(this.selectGameType, this.selectPage - 1);
        } else if (btnName.startsWith("btn_")) {
            var gameType = btnName.replace('btn_', '');
            gameType = gameType.toUpperCase();
            var gameID = -1;
            if (gameType != 'QUANBU' && gameType != 'quanbu') {
                gameID = this.ShareDefine.GametTypeNameDict[gameType];
            }
            this.ShowRecord(gameID);
        } else {
            this.ErrLog("OnClick(%s) not find btnName", btnName);
        }
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
        //# sourceMappingURL=UIRecordAll.js.map
        