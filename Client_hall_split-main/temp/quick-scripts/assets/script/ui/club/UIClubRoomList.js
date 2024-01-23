(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubRoomList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1d30f+GgvhHjpiW4sL8VW4K', 'UIClubRoomList', __filename);
// script/ui/club/UIClubRoomList.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        roomlist_scrollView: cc.ScrollView,
        roomlist_layout: cc.Node,
        roomlist_demo: cc.Node,
        roomlist_bottom: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.RegEvent("OnClubRoomCfgs", this.Event_RoomCfgs);
        this.RegEvent("OnClubRoomCfgChange", this.Event_RoomCfgChange);
        this.discountType = [];
    },

    //---------显示函数--------------------

    OnShow: function OnShow(clubId) {
        this.clubId = clubId;
        this.roomlist_demo.active = false;
        this.roomlist_scrollView.scrollToTop();
        //this.roomlist_layout.removeAllChildren();
        this.DestroyAllChildren(this.roomlist_layout);
        app.ClubManager().SendGetRoomCfg(this.clubId);
        //this.ShowRoomList();
        var that = this;
        // app.NetManager().SendPack('discount.CDiscountList',{clubId:clubId},function(serverPack){
        //     that.GetDiscountTypeData(serverPack);
        // },function(error){
        //     console.error(error);
        // });
        // app.NetManager().SendPack('game.CPlayerAllGameList',{},function(serverPack){
        //     that.gameList = serverPack.gameList;
        // },function(error){
        //     console.error(error);
        // });
    },
    GetDiscountTypeData: function GetDiscountTypeData(serverPack) {
        console.log("GetDiscountTypeData", serverPack);
        this.discountType = serverPack;
    },
    Event_RoomCfgChange: function Event_RoomCfgChange(event) {
        var clubId = event.clubId;
        if (this.clubId != clubId) return;
        var isCreate = event.isCreate;
        var nomarlState = app.ClubManager().Enum_RoomCfg_Nomarl;
        var disableState = app.ClubManager().Enum_RoomCfg_Disable;
        var delState = app.ClubManager().Enum_RoomCfg_Delete;
        var reviseState = app.ClubManager().Enum_RoomCfg_Revise;
        var roomData = event.clubCreateGameSet;

        var waitRoomCount = event.waitRoomCount;
        var playingRoomCount = event.playingRoomCount;
        this.roomlist_bottom.getChildByName('wait').getChildByName('num').getComponent(cc.Label).string = waitRoomCount;
        this.roomlist_bottom.getChildByName('game').getChildByName('num').getComponent(cc.Label).string = playingRoomCount;

        if (isCreate) this.roomCfgs.push(roomData);else {
            for (var i = 0; i < this.roomCfgs.length; i++) {
                if (roomData.bRoomConfigure.gameIndex == this.roomCfgs[i].bRoomConfigure.gameIndex) {
                    if (delState == roomData.status) this.roomCfgs.splice(i, 1);else this.roomCfgs[i] = roomData;
                    break;
                }
            }
        }
        var cfg = null;
        if (!isCreate && delState != roomData.status) cfg = roomData;
        //还没修改this.roomCfgs
        this.ShowRoomList(cfg);
    },
    Event_RoomCfgs: function Event_RoomCfgs(event) {
        var clubId = event.clubId;
        if (this.clubId != clubId) return;
        this.roomCfgs = event.clubCreateGameSets;
        this.ShowRoomList();
        var waitRoomCount = event.waitRoomCount;
        var playingRoomCount = event.playingRoomCount;
        this.roomlist_bottom.getChildByName('wait').getChildByName('num').getComponent(cc.Label).string = waitRoomCount;
        this.roomlist_bottom.getChildByName('game').getChildByName('num').getComponent(cc.Label).string = playingRoomCount;
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_CLUB_DissolveRoomCfg' == msgID) {
            var roomData = backArgList[0];
            var jesanState = app.ClubManager().Enum_RoomCfg_Delete;
            app.ClubManager().SendSetRoomCfg(this.clubId, roomData.gameIndex, jesanState);
        } else if ('MSG_CLUB_DissolveRoom' == msgID) {
            app.ClubManager().SendCloseClub(this.clubId);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        } else if ('MSG_CLUB_EXIT' == msgID) {
            app.ClubManager().SendPlayerStateChange(this.clubId, app.HeroManager().GetHeroProperty("pid"), app.ClubManager().Enum_Leave);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        } else if ('MSG_CLUB_KICKPlayer' == msgID) {
            var data = backArgList[0];
            app.ClubManager().SendPlayerStateChange(data.clubId, data.pid, data.kickState);
        }
    },
    ShowRoomList: function ShowRoomList() {
        var roomCfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (!roomCfg) {
            this.roomlist_scrollView.scrollToTop();
            //this.roomlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.roomlist_layout);
            for (var i = 0; i < this.roomCfgs.length; i++) {
                var nodePrefab = cc.instantiate(this.roomlist_demo);
                nodePrefab.name = this.roomCfgs[i].bRoomConfigure.gameIndex.toString();
                nodePrefab.roomData = this.roomCfgs[i];
                var gameType = this.roomCfgs[i].gameType;
                var cfg = this.roomCfgs[i].bRoomConfigure;
                var nameData = app.RoomCfgManager().GetRoomData(gameType, cfg);
                gameType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;

                nodePrefab.getChildByName('name').getComponent(cc.Label).string = app.RoomCfgManager().GetGameName(gameType, true);
                nodePrefab.getChildByName('renshu').getComponent(cc.Label).string = this.roomCfgs[i].bRoomConfigure.playerNum.toString();
                var payType = '';
                if (this.roomCfgs[i].bRoomConfigure.paymentRoomCardType == 2) {
                    payType = ',大赢家付' + this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume + '圈卡';
                } else if (this.roomCfgs[i].bRoomConfigure.paymentRoomCardType == 1) {
                    payType = ',AA付' + this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume + '圈卡';
                } else if (this.roomCfgs[i].bRoomConfigure.paymentRoomCardType == 0) {
                    payType = ',管理付';
                }
                nodePrefab.getChildByName('wanfa').getComponent(cc.Label).string = app.RoomCfgManager().WanFa(this.roomCfgs[i].gameType, cfg) + payType;
                nodePrefab.getChildByName('zhuoshu').getComponent(cc.Label).string = this.roomCfgs[i].roomCount;
                nodePrefab.active = true;
                this.roomlist_layout.addChild(nodePrefab);
            }
        } else {
            var childs = this.roomlist_layout.children;
            var idxStr = roomCfg.bRoomConfigure.gameIndex.toString();
            for (var _i = 0; _i < childs.length; _i++) {
                if (idxStr == childs[_i].name) {
                    childs[_i].roomData = roomCfg;
                    var _gameType = roomCfg.gameType;
                    var _cfg = roomCfg.bRoomConfigure;
                    var _nameData = app.RoomCfgManager().GetRoomData(_gameType, _cfg);
                    _gameType = '' != _nameData.smallName1 ? _nameData.smallName1 : _nameData.bigName1;
                    var gameName = app.RoomCfgManager().GetGameName(_gameType, true);
                    var nameLabel = childs[_i].getChildByName('name').getComponent(cc.Label);
                    nameLabel.string = gameName;
                    var renLabel = childs[_i].getChildByName('renshu').getComponent(cc.Label);
                    renLabel.string = roomCfg.bRoomConfigure.playerNum.toString();
                    var wanfaLabel = childs[_i].getChildByName('wanfa').getComponent(cc.Label);
                    _gameType = roomCfg.gameType;
                    var _payType = '';
                    if (_cfg.paymentRoomCardType == 2) {
                        _payType = ',胜家付' + this.roomCfgs[_i].bRoomConfigure.clubWinnerPayConsume + '圈卡';
                    } else if (_cfg.paymentRoomCardType == 1) {
                        _payType = ',AA付' + this.roomCfgs[_i].bRoomConfigure.clubWinnerPayConsume + '圈卡';
                    } else if (_cfg.paymentRoomCardType == 0) {
                        _payType = ',管理付';
                    }
                    wanfaLabel.string = app.RoomCfgManager().WanFa(_gameType, _cfg) + _payType;
                    var zhuoLabel = childs[_i].getChildByName('zhuoshu').getComponent(cc.Label);
                    zhuoLabel.string = roomCfg.roomCount;
                    break;
                }
            }
        }
    },

    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_jiesan' == btnName) {
            var roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            this.SetWaitForConfirm('MSG_CLUB_DissolveRoomCfg', this.ShareDefine.Confirm, [], [roomData]);
        } else if ('btn_qiyong' == btnName) {
            var manage = btnNode.parent;
            manage.getComponent(cc.Sprite).enabled = false;
            manage.getChildByName('btn_jiesan').active = false;
            manage.getChildByName('btn_jinyong').active = false;
            manage.getChildByName('btn_qiyong').active = false;
            manage.getChildByName('btn_xiugai').active = false;

            var _roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            var qiyongState = app.ClubManager().Enum_RoomCfg_Nomarl;
            app.ClubManager().SendSetRoomCfg(this.clubId, _roomData.gameIndex, qiyongState);
        } else if ('btn_jinyong' == btnName) {
            var _manage = btnNode.parent;

            _manage.getComponent(cc.Sprite).enabled = false;
            _manage.getChildByName('btn_jiesan').active = false;
            _manage.getChildByName('btn_jinyong').active = false;
            _manage.getChildByName('btn_qiyong').active = false;
            _manage.getChildByName('btn_xiugai').active = false;

            var _roomData2 = btnNode.parent.parent.roomData.bRoomConfigure;
            var jinyongState = app.ClubManager().Enum_RoomCfg_Disable;
            app.ClubManager().SendSetRoomCfg(this.clubId, _roomData2.gameIndex, jinyongState);
        } else if ('btn_manage' == btnName) {
            var _manage2 = btnNode.parent;
            var status = _manage2.parent.roomData.status;

            _manage2.getChildByName('btn_jiesan').active = !_manage2.getChildByName('btn_jiesan').active;
            _manage2.getComponent(cc.Sprite).enabled = _manage2.getChildByName('btn_jiesan').active;
            if (status == 0) {
                _manage2.getChildByName('btn_qiyong').active = false;
                _manage2.getChildByName('btn_jinyong').active = !_manage2.getChildByName('btn_jinyong').active;
            } else {
                _manage2.getChildByName('btn_qiyong').active = !_manage2.getChildByName('btn_qiyong').active;
                _manage2.getChildByName('btn_jinyong').active = false;
            }

            _manage2.getChildByName('btn_xiugai').active = !_manage2.getChildByName('btn_xiugai').active;
        } else if ('btn_xiugai' == btnName) {
            var changeRoomData = btnNode.parent.parent.roomData;
            var changeClubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            var curCityId = changeClubData.cityId;
            var changeData = {};
            var selectGameList = [];
            selectGameList.push(app.ShareDefine().GametTypeNameDict[changeRoomData.gameType.toUpperCase()]);
            changeData.gameList = selectGameList;
            if (0 == changeData.gameList.length) {
                this.ErrLog('btn_createRoom Error Club Not Set GameList');
                return;
            }
            var nameData = app.RoomCfgManager().GetRoomData(changeRoomData.gameType, changeRoomData.bRoomConfigure);
            changeClubData = {};
            changeClubData.clubId = this.clubId;
            changeClubData.cityId = curCityId;
            // changeClubData.roomKey = changeRoomData.roomKey;
            changeClubData.gameIndex = changeRoomData.bRoomConfigure.gameIndex; //用来判断保存还是创建
            var selectType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;
            changeClubData.enableGameType = selectType; //不禁用的按钮
            changeData.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoom', changeData, '', changeClubData);
        } else if ('btn_createRoom' == btnName) {
            var nowClubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            var data = {};
            data.gameList = app.Client.GetAllGameId();
            if (0 == data.gameList.length) {
                console.log('btn_createRoom Error Club Not Set GameList');
                return;
            }
            //let gameType = this.ShareDefine.GametTypeID2PinYin[data.gameList[0]];
            var clubData = {};
            clubData.clubId = this.clubId;
            clubData.cityId = nowClubData.cityId;
            clubData.roomKey = '0';
            clubData.gameIndex = 0; //用来判断保存还是创建
            clubData.enableGameType = ''; //不禁用的按钮
            data.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoom', data, '', clubData);
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
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
        //# sourceMappingURL=UIClubRoomList.js.map
        