(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/zgqzmj/UIResultAllDetail_zgqzmj.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f8a2aY2o7BOLr9unSJkOLdv', 'UIResultAllDetail_zgqzmj', __filename);
// script/ui/uiGame/zgqzmj/UIResultAllDetail_zgqzmj.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        roomID: cc.Node,
        jushu: cc.Node,
        endTime: cc.Node,

        btn_close: cc.Node,
        btn_sharelink: cc.Node,

        btn_share: cc.Node,
        btn_ddshare: cc.Node,
        btn_xlshare: cc.Node,

        btn_sharemore: cc.Node,
        sharemore: cc.Node,

        btn_exit: cc.Node,

        btn_pingfenkaiju: cc.Node,
        btn_wolaikaiju: cc.Node,
        btn_dayingjiakaiju: cc.Node,

        mj_layout_player: cc.Node,
        mj_layout_player56: cc.Node,
        poker_layout_player: cc.Node,
        poker_title_list: cc.Node,
        pxcn_title_list: cc.Node,
        zjqzsk_title_list: cc.Node,

        SpriteMale: cc.SpriteFrame,
        SpriteFeMale: cc.SpriteFrame
    },

    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.ComTool = app.ComTool();
        this.SDKManager = app.SDKManager();
        this.isZhanJi = false;
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.RegEvent("CodeError", this.Event_CodeError, this);
        this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
    },
    Event_CodeError: function Event_CodeError(event) {
        var codeInfo = event;
        if (codeInfo["Code"] == this.ShareDefine.NotFind_Room) {
            app.SysNotifyManager().ShowSysMsg('DissolveRoom');
        }
    },
    LoadPrefabByGameType: function LoadPrefabByGameType() {
        var prefabPath = "ui/uiGame/" + this.gameType + "/" + this.gameType + "_detail_child";
        var that = this;
        app.ControlManager().CreateLoadPromise(prefabPath, cc.Prefab).then(function (prefab) {
            if (!prefab) {
                that.ErrLog("LoadPrefabByGameType(%s) load spriteFrame fail", prefabPath);
                return;
            }
            that.InitPlayer(prefab);
        }).catch(function (error) {
            that.ErrLog("LoadPrefabByGameType(%s) error:%s", prefabPath, error.stack);
        });
    },
    InitPlayer: function InitPlayer(prefab) {
        //this.layout_player.removeAllChildren();
        this.DestroyAllChildren(this.layout_player);
        this.PlayerName = [];
        for (var i = 0; i < this.resultsList.length; i++) {
            if (this.resultsList[i].pid == 0) continue;
            this.PlayerName.push(this.playerAll[i].name);
            var addPlayer = cc.instantiate(prefab);
            this.nowChildName = addPlayer.name;
            addPlayer.name = "player" + i;
            this.layout_player.addChild(addPlayer);
            addPlayer.getComponent(this.nowChildName).ShowPlayerData(this.resultsList, this.playerAll, i);
        }
    },
    //-----------回调函数------------------

    OnShow: function OnShow() {
        var basedata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var playerlist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var gameType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var unionId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        this.unionId = unionId;
        var smallName = this.ShareDefine.GametTypeID2PinYin[gameType];
        var path = "ui/uiGame/" + smallName + "/UIResultAllDetail_" + smallName;
        this.FormManager.ShowForm('UITop', path);
        var Type = this.gametypeConfig[gameType]["Type"];
        this.gameType = app.ShareDefine().GametTypeID2PinYin[gameType];
        this.node.getChildByName("bjpk_title_list").active = false;
        if (Type == 1) {
            this.layout_player_path = "mj_layout_player";
            this.mj_layout_player.active = true;
            this.poker_layout_player.active = false;
            this.layout_player = this.mj_layout_player;
            this.poker_title_list.active = false;
            this.pxcn_title_list.active = false;
            this.zjqzsk_title_list.active = false;
        } else {
            this.layout_player_path = "poker_layout_player";
            this.mj_layout_player.active = false;
            this.poker_layout_player.active = true;
            this.layout_player = this.poker_layout_player;
            this.poker_title_list.active = true;
            this.pxcn_title_list.active = false;
            this.zjqzsk_title_list.active = false;
            if (this.unionId > 0) {
                this.poker_title_list.getChildByName("lb_sportsPoint").active = true;
            } else {
                this.poker_title_list.getChildByName("lb_sportsPoint").active = false;
            }
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_PXCN]) {
                this.poker_title_list.active = false;
                this.pxcn_title_list.active = true;
            }
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_ZJQZSK]) {
                this.poker_title_list.active = false;
                this.zjqzsk_title_list.active = true;
            }
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_BJPK] || this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_NN]) {
                this.poker_title_list.active = false;
                this.node.getChildByName("bjpk_title_list").active = true;
                if (this.unionId > 0) {
                    this.node.getChildByName("bjpk_title_list").getChildByName("lb_sportsPoint").active = true;
                } else {
                    this.node.getChildByName("bjpk_title_list").getChildByName("lb_sportsPoint").active = false;
                }
            }
            //扑克用的麻将结算排版
            if (this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_SDH] || this.gameType == app.ShareDefine().GametTypeID2PinYin[app.ShareDefine().GameType_HNDZP]) {
                this.mj_layout_player.active = true;
                this.poker_layout_player.active = false;
                this.layout_player = this.mj_layout_player;
                this.poker_title_list.active = false;
            }
        }
        this.PlayerName = [];
        var roomID = 0;
        var time = 0;
        var setID = 0;
        this.playerAll = false;
        this.resultsList = false;
        this.nowChildName = "";

        roomID = basedata.key;
        this.ShareShortRoomID = roomID;
        this.ShareLongRoomID = basedata.roomId;
        this.resultsList = basedata.resultsList;
        time = basedata.endTime;
        setID = basedata.setId;
        this.playerAll = playerlist;

        if (Type == 1 && this.resultsList.length > 4) {
            this.mj_layout_player.active = false;
            this.mj_layout_player56.active = true;
            this.layout_player = this.mj_layout_player56;
        } else {
            this.mj_layout_player.active = true;
            this.mj_layout_player56.active = false;
            this.layout_player = this.mj_layout_player;
        }

        //初始化分享
        this.sharemore.active = false;

        this.roomID.getComponent(cc.Label).string = "房间号:" + roomID;
        if (setID == 100) {
            this.jushu.getComponent(cc.Label).string = "共1考";
        } else {
            this.jushu.getComponent(cc.Label).string = app.i18n.t("UIWanFa_setCount", { "setCount": setID });
        }
        this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);

        this.LoadPrefabByGameType();
    },
    //---------设置接口---------------

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_share") {
            this.Click_btn_Share();
        } else if (btnName == "btn_ddshare") {
            this.Click_btn_DDShare();
        } else if (btnName == "btn_xlshare") {
            this.Click_btn_XLShare();
        } else if (btnName == "btn_mwshare") {
            this.Click_btn_MWShare();
        } else if (btnName == "btn_sharemore") {
            this.Click_btn_ShareMore();
        } else if (btnName == "btn_closeshare") {
            this.sharemore.active = false;
        } else if (btnName == "btn_sharelink") {
            this.Click_btn_Sharelink();
        } else if (btnName == "btn_exit") {
            app.SceneManager().LoadScene("mainScene");
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick not find btnName", btnName);
        }
    },
    Click_btn_Share: function Click_btn_Share() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreen();
    },
    Click_btn_DDShare: function Click_btn_DDShare() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenDD();
    },
    Click_btn_XLShare: function Click_btn_XLShare() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenXL();
    },
    Click_btn_MWShare: function Click_btn_MWShare() {
        this.sharemore.active = false;
        this.SDKManager.ShareScreenMW();
    },
    Click_btn_ShareMore: function Click_btn_ShareMore() {
        var active = this.sharemore.active;
        if (active == true) {
            this.sharemore.active = false;
        } else {
            this.sharemore.active = true;
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
        //# sourceMappingURL=UIResultAllDetail_zgqzmj.js.map
        