"use strict";
cc._RF.push(module, 'c5cdbjbi1dLVYZR1HiQRCGx', 'club_room_child');
// script/ui/uiChild/club_room_child.js

"use strict";

/*
 UIGMTool_Child2 GM工具子界面
 */

cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        bg_join: cc.SpriteFrame,
        bg_touxiang: cc.SpriteFrame
    },

    //创建界面回掉
    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.ShareDefine = app.ShareDefine();
        this.HeroManager = app.HeroManager();
        this.heroName = this.HeroManager.GetHeroProperty("name");
        this.heroId = this.HeroManager.GetHeroProperty("pid");
        this.WeChatManager = app.WeChatManager();
        this.ComTool = app.ComTool();
        this.LocalDataManager = app.LocalDataManager();
        this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
        this.GetTuiGuangUrl();
    },
    //获取用户推广Url
    GetTuiGuangUrl: function GetTuiGuangUrl() {
        this.TuiGuangUrl = this.LocalDataManager.GetConfigProperty("SysSetting", "TuiGuangUrl");
        if (this.TuiGuangUrl == '') {
            var heroID = app.HeroManager().GetHeroProperty("pid");
            var ShortHeroID = this.ComTool.GetPid(heroID);
            var long_url = "http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=https://fb.qicaiqh.com:88/" + ShortHeroID + '/';
            app.NetManager().SendPack("game.CShortenGenerate", { "url": long_url }, this.GetShorTuiGuangUrl.bind(this), this.FailTuiGuangUrl.bind(this));
        }
    },
    FailTuiGuangUrl: function FailTuiGuangUrl(serverPack) {
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var ShortHeroID = this.ComTool.GetPid(heroID);
        var randUrl = this.GetRandBaseUrl();
        this.TuiGuangUrl = 'http://' + randUrl + "/" + ShortHeroID + "/";
        this.LocalDataManager.SetConfigProperty("SysSetting", "TuiGuangUrl", this.TuiGuangUrl);
    },
    GetShorTuiGuangUrl: function GetShorTuiGuangUrl(serverPack) {
        if (typeof serverPack.requestUrl == "undefined") {
            return;
        }
        var jsonStr = serverPack.requestUrl;
        jsonStr = jsonStr.replace('[', '');
        jsonStr = jsonStr.replace(']', '');
        var ShareUrl = eval('(' + jsonStr + ')');
        this.TuiGuangUrl = ShareUrl.url_short;
        this.LocalDataManager.SetConfigProperty("SysSetting", "TuiGuangUrl", this.TuiGuangUrl);
    },
    InitShowInfo: function InitShowInfo() {
        var clubroomList = app['clubroomList'];
        var userData = this.GetFormProperty("UserData");
        var roomData = clubroomList[userData];
        this.roomData = roomData;
        this.SetRoomInfo(userData, roomData);
        this.ShowPlayer();
    },
    //显示
    OnShow: function OnShow() {
        this.node.active = true;
        this.InitShowInfo();
    },
    ShowPlayer: function ShowPlayer() {
        this.InitJoinBtn();
        var playerList = this.playerList;
        for (var i = 0; i < playerList.length; i++) {
            if (i > 3) {
                //最多显示5人
                break;
            }
            var PlayerInfo = playerList[i];
            //用户头像创建
            var heroID = PlayerInfo["pid"];
            var headImageUrl = PlayerInfo["headImageUrl"];
            var touxiang = this.GetWndNode('more/join_btn/btn_join' + (i + 1));
            if (heroID > 0) {
                if (headImageUrl) {
                    this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                    var WeChatHeadImage = touxiang.getComponent("WeChatHeadImage");
                    WeChatHeadImage.OnLoad();
                    WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                } else {
                    touxiang.getComponent(cc.Sprite).spriteFrame = this.bg_touxiang;
                }
            } else {
                touxiang.getComponent(cc.Sprite).spriteFrame = this.bg_join;
            }
        }
    },
    ShowRoomJoin: function ShowRoomJoin() {
        this.FormManager.ShowForm('UIClubRoomJoin', this.roomData);
    },
    SetRoomInfo: function SetRoomInfo(key, roomData) {
        var gameType = roomData.gameType;
        var playerList = roomData.posList;
        var roomCfg = roomData.roomCfg;
        var roomID = roomData.roomID;
        var roomKey = roomData.roomKey;
        var playerNum = roomCfg.playerNum;
        var clubName = roomData.clubName;
        var setID = roomData.setID;

        this.playerNum = playerNum;
        this.playerList = new Array();
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i]) {
                if (playerList[i].pid > 0) {
                    this.playerList.push(playerList[i]);
                }
            }
        }

        this.gameType = gameType.toLowerCase();
        this.gameCfg = roomData.roomCfg;
        this.roomKey = roomKey;
        this.roomID = roomID;
        this.SetWndProperty("lb_roomkey", "text", roomKey);
        this.SetWndProperty("lb_clubname", "text", clubName);
        this.SetWndProperty("lb_setcount", "text", setID + '/' + roomCfg.setCount);
        this.SetWndProperty("lb_gamename", "text", this.GameType2Name(gameType));
        this.SetWndProperty("lb_wanfa", "text", this.GetWanFa(roomCfg));
        if (setID > 0) {
            //开始了关闭加入按钮
            this.SetWndProperty('more', 'active', false);
            this.node.height = 60;
        } else {
            this.SetWndProperty('more', 'active', true);
            this.node.height = 130;
        }
    },
    GameType2Name: function GameType2Name(gameType) {
        var gameTypeID = this.ShareDefine.GametTypeNameDict[gameType];
        return this.ShareDefine.GametTypeID2Name[gameTypeID];
    },
    InitJoinBtn: function InitJoinBtn() {
        var playerNum = this.playerNum;
        //初始化头像背景
        for (var i = 1; i <= 5; i++) {
            this.node.getChildByName('more').getChildByName('join_btn').getChildByName('btn_join' + i).getComponent(cc.Sprite).spriteFrame = this.bg_join;
        }
        for (var _i = 1; _i <= playerNum; _i++) {
            if (_i > 5) {
                break;
            }
            this.SetWndProperty("more/join_btn/btn_join" + _i, "active", true);
        }
        var j = playerNum + 1;
        for (; j <= 5; j++) {
            this.SetWndProperty("more/join_btn/btn_join" + j, "active", false);
        }
    },
    getCurSelectRenShu: function getCurSelectRenShu(needIndex) {
        return needIndex;
    },
    GetHasPlayerNum: function GetHasPlayerNum() {
        var nowJoin = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (0 != this.playerList[i].pid) nowJoin++;
        }
        return nowJoin;
    },
    Click_btn_Share: function Click_btn_Share() {
        var GamePlayManager = require('GamePlayManager');
        var gameType = this.gameType;
        var WeChatShare = GamePlayManager.WeChatShare(gameType, this.gameCfg);
        var title = null;
        if (WeChatShare['special']) {
            title = WeChatShare['special'];
        } else {
            title = WeChatShare['title'];
        }
        var weChatAppShareUrl = WeChatShare['url'];
        var setCount = this.gameCfg["setCount"]; //多少局
        var roomKey = this.roomKey; //房间号

        var joinPlayerCount = this.getCurSelectRenShu(this.gameCfg.playerNum); //几人场
        var nowJoin = this.GetHasPlayerNum();
        title = title.replace('{房间号}', roomKey);
        var gamedesc = "";
        gamedesc = joinPlayerCount + "人场";
        gamedesc = gamedesc + "," + setCount + "圈";
        var autoCardIdx = this.gameCfg["paymentRoomCardType"];
        if (0 == autoCardIdx) gamedesc = gamedesc + ",房主出钻";else if (1 == autoCardIdx) gamedesc = gamedesc + ",平分钻石";else gamedesc = gamedesc + ",大赢家出钻";
        var que = joinPlayerCount - nowJoin;
        gamedesc += "," + nowJoin + "缺" + que;
        var teshuwanfan = this.WanFa;
        if (teshuwanfan) {
            gamedesc += "," + teshuwanfan;
        }
        console.log("Click_btn_weixin:", title);
        console.log("Click_btn_weixin:", gamedesc);
        console.log("Click_btn_weixin:", weChatAppShareUrl);

        //this.SDKManager.Share(title, gamedesc, weChatAppShareUrl, "0");
        this.FormManager.ShowForm('UIRoomCopy', roomKey, title, gamedesc, weChatAppShareUrl);
    },
    //启动微信房间分享
    BeginShare: function BeginShare(roomKey, text) {
        this.ShareText = text;
        this.roomKey = roomKey;
        //校服
        var long_url = "http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=https://fb.qicaiqh.com:88/room" + roomKey;
        app.NetManager().SendPack("game.CShortenGenerate", { "url": long_url }, this.SuccessTcnUrl.bind(this), this.FailTcnUrl.bind(this));
    },

    SuccessTcnUrl: function SuccessTcnUrl(serverPack) {
        var shareUrl = "https://fb.qicaiqh.com:88/" + app.ComTool().GetPid(app.HeroManager().GetHeroProperty("pid")) + "/";
        if (this.TuiGuangUrl) {
            text = this.ShareText + "\n" + "下载地址:" + shareUrl;
        } else {
            if (url_short) {
                text = this.ShareText;
            } else {
                text = this.ShareText;
            }
        }
        this.SDKManager.ShareText(text, "0");
    },

    //微信分享获取短域名失败分享
    FailTcnUrl: function FailTcnUrl(event) {
        var shareUrl = "https://fb.qicaiqh.com:88/" + app.ComTool().GetPid(app.HeroManager().GetHeroProperty("pid")) + "/";
        var text = this.ShareText + "\n" + "下载地址:" + shareUrl;
        this.SDKManager.ShareText(text, "0");
    },
    OnClick_Join: function OnClick_Join() {
        var nowJoin = this.GetHasPlayerNum();
        if (nowJoin >= this.playerNum) {
            app.SysNotifyManager().ShowSysMsg("房间人数已满");
            return;
        }
        app.Client.JoinRoomCheckSubGame(this.gameType, this.roomKey);
    },
    GetWanFa: function GetWanFa(gameCfg) {
        var wanfa = app.RoomCfgManager().WanFa(this.gameType, gameCfg);
        this.WanFa = wanfa;
        return wanfa.substring(0, 8) + '...';
    }
    //-------------点击函数-------------

});

cc._RF.pop();