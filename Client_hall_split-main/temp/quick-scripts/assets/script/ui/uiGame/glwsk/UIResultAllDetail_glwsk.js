(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/glwsk/UIResultAllDetail_glwsk.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8dbd6xji7JK7Zl/BmmFLZhu', 'UIResultAllDetail_glwsk', __filename);
// script/ui/uiGame/glwsk/UIResultAllDetail_glwsk.js

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

        icon_winLost: [cc.SpriteFrame],
        playersNode: cc.Node
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
    InitShowPlayerInfo: function InitShowPlayerInfo() {
        var _this = this;

        this.playerNameList = [];
        var maxPoint = 0;
        for (var i = 0; i < this.resultsList.length; i++) {
            if (maxPoint < this.resultsList[i].point) {
                maxPoint = this.resultsList[i].point;
            }
        }
        //隐藏节点
        for (var _i = 0; _i < this.playersNode.children.length; _i++) {
            this.playersNode.children[_i].active = false;
        }

        var _loop = function _loop(_i2) {
            var PlayerNode = _this.playersNode.children[_i2];
            var playerinfo = _this.playerAll[_i2];
            var playRecord = _this.resultsList[_i2];

            //显示头像
            var heroID = playerinfo["pid"];
            var headImageUrl = playerinfo["headImageUrl"];
            if (heroID && headImageUrl) {
                _this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
            }
            _this.playerNameList.push(playerinfo["name"]);
            //显示玩家姓名
            PlayerNode.getChildByName("userInfo").getChildByName('lb_name').getComponent(cc.Label).string = playerinfo["name"].substring(0, 5) + "...";
            PlayerNode.getChildByName("userInfo").getChildByName('lb_ID').getComponent(cc.Label).string = "ID:" + _this.ComTool.GetPid(heroID);
            var WeChatHeadImage = PlayerNode.getChildByName("userInfo").getChildByName('head').getComponent("WeChatHeadImage");
            WeChatHeadImage.onLoad();
            WeChatHeadImage.ShowHeroHead(heroID);
            if (_this.isOwer == heroID) {
                PlayerNode.getChildByName("userInfo").getChildByName("icon_fz").active = true;
            } else {
                PlayerNode.getChildByName("userInfo").getChildByName("icon_fz").active = false;
            }

            //分数
            var record = PlayerNode.getChildByName('record');
            //根据分组判断是否显示总积分
            record.getChildByName("paimianfen").getComponent(cc.Label).string = _this.GetPointValues(playRecord.paiMianPoint);
            record.getChildByName("jiangfafen").getComponent(cc.Label).string = _this.GetPointValues(playRecord.jiangFaPoint);
            record.getChildByName("jifen").getComponent(cc.Label).string = _this.GetPointValues(playRecord.zongPoint);
            if (playRecord.point > 0) {
                record.getChildByName("lb_winPoint").active = true;
                record.getChildByName("lb_lostPoint").active = false;
                record.getChildByName("lb_winPoint").getComponent(cc.Label).string = _this.GetPointValues(playRecord.point);
                //胜负
                PlayerNode.getChildByName("userInfo").getChildByName('winlost').getComponent(cc.Sprite).spriteFrame = _this.icon_winLost[0];
            } else {
                record.getChildByName("lb_winPoint").active = false;
                record.getChildByName("lb_lostPoint").active = true;
                record.getChildByName("lb_lostPoint").getComponent(cc.Label).string = _this.GetPointValues(playRecord.point);
                //胜负
                PlayerNode.getChildByName("userInfo").getChildByName('winlost').getComponent(cc.Sprite).spriteFrame = _this.icon_winLost[1];
                if (playRecord.point == 0) {
                    //胜负
                    PlayerNode.getChildByName("userInfo").getChildByName('winlost').getComponent(cc.Sprite).spriteFrame = "";
                }
            }
            var tip6 = _this.node.getChildByName("tipNode").getChildByName("tip6");
            if (typeof playRecord.sportsPoint != "undefined") {
                tip6.active = true;
                record.getChildByName("sportspoint").getComponent(cc.Label).string = _this.GetPointValues(playRecord.sportsPoint);
            } else {
                tip6.active = false;
                record.getChildByName("sportspoint").getComponent(cc.Label).string = "";
            }
            // //显示大赢家
            // if (maxPoint <= record["point"]) {
            //  dataNode.getChildByName("dyj").active = true;
            // } else {
            //  dataNode.getChildByName("dyj").active = false;
            // }
            if (PlayerNode.getChildByName('icon_dissolve') != null) {
                //显示是否解散（-1:正常结束,0:未操作,1:同意操作,2:拒绝操作,3:发起者）
                if (typeof playRecord.dissolveState == "undefined" || playRecord.dissolveState == -1) {
                    PlayerNode.getChildByName('icon_dissolve').active = false;
                } else {
                    var imagePath = "texture/record/img_dissolve" + playRecord.dissolveState;
                    var that = _this;
                    //加载图片精灵
                    cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
                        if (error) {
                            console.log("加载图片精灵失败  " + imagePath);
                            return;
                        }
                        PlayerNode.getChildByName('icon_dissolve').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        PlayerNode.getChildByName('icon_dissolve').active = true;
                    });
                }
            }
            PlayerNode.active = true;
        };

        for (var _i2 = 0; _i2 < this.resultsList.length; _i2++) {
            _loop(_i2);
        }
    },
    GetPointValues: function GetPointValues(point) {
        if (point > 0) {
            return "+" + point;
        }
        return point;
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

        //初始化分享
        this.sharemore.active = false;

        this.roomID.getComponent(cc.Label).string = "房间号:" + roomID;
        //    if(setID==100){
        //    	this.jushu.getComponent(cc.Label).string ="共1考";
        //    }else{
        //    	this.jushu.getComponent(cc.Label).string = app.i18n.t("UIWanFa_setCount", {"setCount": setID});
        // }
        //不显示局数
        this.jushu.active = false;
        this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);

        this.InitShowPlayerInfo();
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
        //# sourceMappingURL=UIResultAllDetail_glwsk.js.map
        