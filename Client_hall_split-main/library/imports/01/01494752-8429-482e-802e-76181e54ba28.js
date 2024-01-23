"use strict";
cc._RF.push(module, '01494dShClILoAudhgeVLoo', 'UIClubInRoom');
// script/ui/club/UIClubInRoom.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        data: cc.Node,
        table: cc.Node,
        table_bg: [cc.SpriteFrame]
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.WeChatManager = app.WeChatManager();
        this.RegEvent("OnRoomStateChange", this.Event_RoomStatusChange, this);
        this.RegEvent("OnRoomPlayerChange", this.Event_RoomPlayerChange, this);
        this.RegEvent("OnRoomSetChange", this.Event_RoomSetChange, this);
    },
    Event_RoomStatusChange: function Event_RoomStatusChange(serverPack) {
        var roomData = serverPack.roomInfoItem;
        var isClose = roomData.isClose;
        if (roomData.roomKey == this.roomKey) {
            if (isClose == true) {
                this.CloseForm(); //房间已经结束
            }
        }
    },
    Event_RoomPlayerChange: function Event_RoomPlayerChange(serverPack) {
        if (serverPack.roomKey == this.roomKey) {
            this.roomInfo.posList[serverPack['pos'].pos] = serverPack['pos'];
            this.InitHead();
            this.InitUserName();
            var posList = this.roomInfo.posList;
            this.ShowPlayHead(posList);
            this.ShowUserName(posList, this.roomInfo.playerNum);
        }
    },
    Event_RoomSetChange: function Event_RoomSetChange(serverPack) {
        if (serverPack.roomKey == this.roomKey) {
            this.roomInfo.setId = serverPack.setId;
            this.ShowRoomData(this.roomInfo);
        }
    },
    //---------显示函数--------------------

    OnShow: function OnShow(roomInfo) {
        this.roomInfo = roomInfo;
        this.roomKey = roomInfo.roomKey;
        this.ShowRoomData(roomInfo);
        var realWidth = cc.winSize.width;
        if (realWidth > 1360) {
            this.baseX = 1100 + Math.floor((realWidth - 1360) / 2);
        } else {
            this.baseX = 1100;
        }
        this.data.x = this.baseX;
        this.ShowTableBg(roomInfo.playerNum);
        var posList = roomInfo.posList;
        this.InitHead();
        this.InitUserName();
        this.ShowPlayHead(posList);
        this.ShowUserName(posList, roomInfo.playerNum);
    },
    ShowRoomData: function ShowRoomData(roomData) {
        this.gameId = roomData.gameId;
        this.table.getChildByName("lb_roomName").getComponent(cc.Label).string = roomData.roomName;
        this.table.getChildByName('game_name').getComponent(cc.Label).string = this.ShareDefine.GametTypeID2Name[roomData.gameId];
        this.table.getChildByName('bg_key').getChildByName('key').getComponent(cc.Label).string = roomData.tagId;
        var jushuStr = "";
        if (roomData.setCount > 100 && roomData.setCount < 200) {
            var total = roomData.playerNum * (roomData.setCount % 100);
            var left = total - roomData.setId;
            jushuStr = "剩:" + left + "庄";
        } else if (roomData.setCount == 201) {
            jushuStr = "1拷";
        } else if (roomData.setCount == 310) {
            jushuStr = "1课:10分";
        } else if (roomData.setCount == 311) {
            jushuStr = "1课:100分";
        } else if (roomData.setCount == 312) {
            jushuStr = "局麻";
        } else if (roomData.setCount == 401 && roomData.gameId == this.ShareDefine.GameType_JXFZGP) {
            jushuStr = "1次";
        } else if (roomData.setCount >= 400 && roomData.gameId == this.ShareDefine.GameType_GD) {
            var setCount = roomData.setCount % 400;
            if (setCount == 14) {
                jushuStr = "过A";
            } else {
                jushuStr = "过" + setCount;
            }
        } else if (roomData.setCount >= 400 && roomData.gameId == this.ShareDefine.GameType_WHMJ) {
            jushuStr = roomData.setCount % 400 + "底";
        } else if (roomData.setCount >= 600 && roomData.gameId == this.ShareDefine.GameType_MASMJ) {
            jushuStr = "第" + roomData.setId + "/" + roomData.setCount % 600 + "倒";
        } else {
            jushuStr = "第" + roomData.setId + "/" + roomData.setCount + "局";
        }
        if (this.ShareDefine.GametTypeID2PinYin[roomData.gameId] == "chmj") {
            jushuStr = roomData.setCount >= 30 ? roomData.setCount + "锅" : "第" + roomData.setId + "/" + roomData.setCount + "局";
        }
        if (this.ShareDefine.GametTypeID2PinYin[roomData.gameId] == "zznsb") {
            jushuStr = roomData.setCount == 501 ? "第" + roomData.setId + "/" + "千分局" : "第" + roomData.setId + "/" + roomData.setCount + "局";
        }
        if (this.ShareDefine.GametTypeID2PinYin[roomData.gameId] == "glwsk") {
            jushuStr = "第" + roomData.setId + "局";
        }
        jushuStr += "  " + roomData.playerNum + "人";
        this.table.getChildByName('jushu').getComponent(cc.Label).string = jushuStr;
    },
    InitUserName: function InitUserName() {
        var userNameNode = this.data.getChildByName("mask").getChildByName("userlist");
        for (var i = 0; i < 8; i++) {
            var node = userNameNode.getChildByName("user" + (i + 1));
            node.active = false;
        }
    },
    InitHead: function InitHead() {
        for (var i = 0; i < 4; i++) {
            var usernode = this.table.getChildByName('head_layout').getChildByName('user' + (i + 1));
            usernode.active = false;
        }
    },
    ShowPlayHead: function ShowPlayHead(posList) {
        for (var i = 0; i < posList.length; i++) {
            if (i > 3) {
                break;
            }
            var heroID = posList[i]["pid"];
            if (heroID > 0) {
                var name = posList[i]["name"];
                var headImageUrl = posList[i]["headImageUrl"];
                var usernode = this.table.getChildByName('head_layout').getChildByName('user' + (i + 1));
                usernode.active = true;
                usernode.getChildByName('name').getChildByName('lb').getComponent(cc.Label).string = name.substr(0, 4);
                if (heroID > 0) {
                    var touxiang = usernode.getChildByName('mask').getChildByName('head');
                    this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                    var WeChatHeadImage = touxiang.getComponent("WeChatHeadImage");
                    WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                }
            }
        }
    },
    ShowUserName: function ShowUserName(posList, playerNum) {
        var LuoZuo = 0;
        var userlistNode = this.data.getChildByName("mask").getChildByName("userlist");
        for (var i = 0; i < posList.length; i++) {
            var heroID = posList[i]["pid"];
            if (heroID > 0) {
                LuoZuo++;
                var usernode = userlistNode.getChildByName('user' + (i + 1));
                usernode.active = true;
                var name = posList[i]["name"];
                usernode.getChildByName("lb_name").getComponent(cc.Label).string = name;
            }
        }
        var LuoZuoString = "";
        if (LuoZuo == 1) {
            LuoZuoString = "一人落座";
        } else if (LuoZuo == 2) {
            LuoZuoString = "两人落座";
        } else if (LuoZuo == 3) {
            LuoZuoString = "三人落座";
        } else if (LuoZuo == 4) {
            LuoZuoString = "四人落座";
        } else if (LuoZuo == 5) {
            LuoZuoString = "五人落座";
        } else if (LuoZuo == 6) {
            LuoZuoString = "六人落座";
        } else if (LuoZuo == 7) {
            LuoZuoString = "七人落座";
        } else if (LuoZuo == 8) {
            LuoZuoString = "八人落座";
        }
        if (LuoZuo == playerNum) {
            this.data.getChildByName("btn_showmore").getChildByName("lb_num").getComponent(cc.Label).string = "满座";
        } else {
            this.data.getChildByName("btn_showmore").getChildByName("lb_num").getComponent(cc.Label).string = LuoZuoString;
        }
    },
    ShowTableBg: function ShowTableBg(playerNum) {
        if (playerNum < 2 || typeof playerNum == "undefined") {
            playerNum = 2;
        }
        if (playerNum > 4) {
            playerNum = 4;
        }

        this.table.getComponent(cc.Sprite).spriteFrame = this.table_bg[playerNum - 2];
    },
    ShowMore: function ShowMore() {
        this.data.getChildByName("btn_showmore").getChildByName("lb_num").getComponent(cc.Label).string = "点击隐藏";
        var x = this.baseX - 425;
        var y = this.data.y;
        var action = cc.sequence(cc.moveTo(0.2, cc.v2(x, y)), cc.callFunc(function () {}, this));
        this.data.runAction(action);
    },
    OnClose: function OnClose() {},
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_exitroom' == btnName) {
            if (this.roomInfo.setId > 0) {
                app.SysNotifyManager().ShowSysMsg('房间已经开始，请加入游戏发起解散');
                return;
            }
            //退出房间
            var posList = this.roomInfo.posList;
            var clientPos = -1;
            for (var i = 0; i < posList.length; i++) {
                if (app.HeroManager().GetHeroID() == posList[i]["pid"]) {
                    clientPos = posList[i]["pos"];
                    break;
                }
            }
            var gamePY = app.ShareDefine().GametTypeID2PinYin[this.gameId];
            if (clientPos > -1) {
                var self = this;
                this.NetManager.SendPack("room.CBaseExitRoom", {
                    "roomID": this.roomInfo.roomId,
                    "posIndex": clientPos
                }, function (success) {
                    //正常退出房间，通知大厅跟亲友圈首页
                    app.Client.OnEvent("OutRoom", {});
                    self.CloseForm();
                }, function (error) {
                    app.SysNotifyManager().ShowSysMsg('退出房间失败,请进入房间操作：error02');
                });
            } else {
                app.SysNotifyManager().ShowSysMsg('退出房间失败,请进入房间操作：error01');
                return;
            }
        } else if ('btn_goroom' == btnName) {
            var curGameTypeStr = app.ShareDefine().GametTypeID2PinYin[this.gameId];
            app.Client.SetGameType(curGameTypeStr);
            this.FormManager.ShowForm("UIDownLoadGame", curGameTypeStr, 0, null, 0, 0, true);
        } else if ('btn_showmore' == btnName) {
            if (this.data.x == this.baseX) {
                this.ShowMore();
            } else {
                this.ShowUserName(this.roomInfo.posList);
                this.data.x = this.baseX;
            }
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

cc._RF.pop();