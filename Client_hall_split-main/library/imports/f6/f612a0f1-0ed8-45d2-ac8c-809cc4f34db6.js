"use strict";
cc._RF.push(module, 'f612aDxDthF0qyMgJzE8022', 'UIMoreGame');
// script/ui/UIMoreGame.js

"use strict";

var app = require("app");
var SubgameManager = require('SubgameManager');
cc.Class({
    extends: require("BaseForm"),

    properties: {
        RightNode: cc.Node,
        pafabItem: cc.Node,
        btn_tuijian: cc.Node,
        btn_majiang: cc.Node,
        btn_poker: cc.Node
    },
    OnCreateInit: function OnCreateInit() {
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.gameListConfig = app.SysDataManager().GetTableDict("gameList");
        this.RegEvent("OnUpdateGameEnd", this.ShowAllGameByType, this);
    },
    //-----------------显示函数------------------
    OnShow: function OnShow() {
        var clubData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var unionData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        this.clubData = clubData;
        this.unionData = unionData;
        this.FormManager.ShowForm('UITop', "UIMoreGame");
        this.curShowType = 0; //0是推荐，1是麻将，2是扑克
        this.ShowAllGameByType();
        this.pafabItem.active = false;
    },
    ShowAllGameByType: function ShowAllGameByType() {
        var _this = this;

        if (this.curShowType == 0) {
            this.btn_tuijian.getChildByName("icon").active = true;
            this.btn_majiang.getChildByName("icon").active = false;
            this.btn_poker.getChildByName("icon").active = false;
        } else if (this.curShowType == 1) {
            this.btn_tuijian.getChildByName("icon").active = false;
            this.btn_majiang.getChildByName("icon").active = true;
            this.btn_poker.getChildByName("icon").active = false;
        } else if (this.curShowType == 2) {
            this.btn_tuijian.getChildByName("icon").active = false;
            this.btn_majiang.getChildByName("icon").active = false;
            this.btn_poker.getChildByName("icon").active = true;
        }

        //this.RightNode.removeAllChildren();
        this.DestroyAllChildren(this.RightNode);
        var appName = this.GetAppName();
        var allGameId = app.Client.GetAllGameId(true);

        var _loop = function _loop() {
            var Type = _this.gametypeConfig[id]["Type"];
            // if (this.curShowType == 0) {
            if (allGameId.indexOf(id) < 0) return "continue";
            // }
            if (_this.curShowType != 0 && Type != _this.curShowType) return "continue";
            //未开发的游戏不显示在真机上
            // if(cc.sys.isNative){
            //     //读取gamelist表，只显示已开放的游戏,备注:gameList的id需要加1
            //     let gameId = parseInt(id) + 1;
            //     let isOpen = this.gameListConfig[gameId].isOpen;
            //     if (isOpen == 0) {
            //         console.log("游戏："+id+"未开放");
            //         continue;
            //     }else{
            //         console.log("游戏："+id+"开放");
            //     }
            // }
            var gameName = app.ShareDefine().GametTypeID2PinYin[id];
            var gameItem = cc.instantiate(_this.pafabItem);
            gameItem.name = "btn_" + gameName;
            if (cc.sys.isNative) {
                if (SubgameManager.isSubgameDownLoad(gameName)) {
                    gameItem.getChildByName("img_xiazai").active = false;
                    //已下载，判断是否需要更新
                    SubgameManager.needUpdateSubgame(gameName, function (success) {
                        if (success) {
                            //子游戏需要更新;
                            gameItem.getChildByName("img_gengxin").active = true;
                        } else {
                            //子游戏不需要更新;
                            gameItem.getChildByName("img_gengxin").active = false;
                        }
                    }, function () {
                        console.log("子游戏更新失败");
                        gameItem.getChildByName("img_gengxin").active = false;
                    });
                } else {
                    gameItem.getChildByName("img_xiazai").active = true;
                    gameItem.getChildByName("img_gengxin").active = false;
                }
            }
            var imgName = _this.gametypeConfig[id]["imgUrl"];
            if (appName == "baodao") {
                if (gameName == "nn" || gameName == "fqpls") {
                    //NN跟fqpls
                    imgName = imgName + "_baodao";
                }
            }
            // let imagePath = "texture/newmain/allgame/" + imgName;
            // //加载图片精灵
            // cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
            //     if(error){
            //         console.log("加载图片精灵失败  " + imagePath);
            //         return
            //     }
            //     gameItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            // });
            gameItem.active = true;
            _this.RightNode.addChild(gameItem);
        };

        for (var id in this.gametypeConfig) {
            var _ret = _loop();

            if (_ret === "continue") continue;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_tuijian' == btnName) {
            this.curShowType = 0;
            this.ShowAllGameByType();
        } else if ('btn_majiang' == btnName) {
            this.curShowType = 1;
            this.ShowAllGameByType();
        } else if ('btn_poker' == btnName) {
            this.curShowType = 2;
            this.ShowAllGameByType();
        } else if (btnName.startsWith("btn_")) {
            var _gameName = btnName.replace('btn_', '');
            var clubId = 0;
            var cityId = 0;
            if (this.clubData) {
                clubId = this.clubData.clubId;
                cityId = this.clubData.cityId;
            }
            if (cc.sys.isNative) {
                app.FormManager().ShowForm("UIDownLoadGame", _gameName, 0, null, 0, 0, false, clubId, this.unionData);
            } else {
                var clubDataTemp = null;
                if (this.clubData) {
                    clubDataTemp = {};
                    clubDataTemp.clubId = this.clubData.clubId;
                    clubDataTemp.cityId = cityId;
                    clubDataTemp.roomKey = '0';
                    clubDataTemp.gameIndex = 0; //用来判断保存还是创建
                    clubDataTemp.enableGameType = ''; //不禁用的按钮
                }
                app.FormManager().CloseForm('UIMoreGame');
                app.FormManager().CloseForm('UITop');
                app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("UIMoreGame");
                app.FormManager().ShowForm('UICreatRoom', { "gameList": app.Client.GetAllGameId() }, _gameName, clubDataTemp, this.unionData);
            }
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }
});

cc._RF.pop();