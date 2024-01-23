"use strict";
cc._RF.push(module, '9c5fbF7Fy1AcJqhZDswuJqn', 'UIQuickJoinRoom');
// script/ui/club/UIQuickJoinRoom.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

    OnCreateInit: function OnCreateInit() {
        // let mark = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        // mark.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    OnShow: function OnShow(clubId, unionId) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.curPage = 1;
        this.GetRoomCfgList(true);
    },
    MyUnionMyWanFaArray: function MyUnionMyWanFaArray() {
        var unionMyWanFa = [];
        if (this.unionId > 0) {
            this.unionMyWanFa = localStorage.getItem("mywanfa_" + this.unionId + "_" + this.clubId);
            if (typeof this.unionMyWanFa != "undefined" && this.unionMyWanFa != "" && this.unionMyWanFa != null) {
                unionMyWanFa = this.unionMyWanFa.split(",");
            }
        }
        return unionMyWanFa;
    },
    GetRoomCfgList: function GetRoomCfgList(isRefresh) {
        if (isRefresh) {
            this.curPage = 1;
        }
        var sendPack = {};
        sendPack.clubId = this.clubId;
        var self = this;
        var packName = "club.CClubRoomConfigItemList";
        if (this.unionId > 0) {
            packName = "union.CUnionRoomConfigItemList";
            sendPack.unionId = this.unionId;
        }
        app.NetManager().SendPack(packName, sendPack, function (serverPack) {
            self.UpdateScrollView(serverPack, isRefresh);
        }, function () {});
    },
    GetNextPage: function GetNextPage() {
        this.curPage++;
        this.GetRoomCfgList(false);
    },
    SortByTagId: function SortByTagId(a, b) {
        return b.tagId - a.tagId;
    },
    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var mark = this.node.getChildByName("mark");
        var content = mark.getChildByName("layout");
        if (isRefresh) {
            mark.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        var unionMyWanFa = this.MyUnionMyWanFaArray();
        //serverPack.sort(this.SortByTagId);
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            child.configId = serverPack[i].configId;
            child.tagId = serverPack[i].tagId;
            if (unionMyWanFa.length == 1 && unionMyWanFa.indexOf(serverPack[i].tagId.toString()) > -1) {
                //只有一个，直接快速加入
                var gameName = app.ShareDefine().GametTypeID2PinYin[serverPack[i].gameId].toLowerCase(); //游戏名
                app.Client.JoinRoomCheckSubGame(gameName, serverPack[i].roomKey, this.clubId);
                this.CloseForm();
            }

            if (unionMyWanFa.length > 0 && unionMyWanFa.indexOf(serverPack[i].tagId.toString()) == -1) {
                continue;
            }
            child.roomKey = serverPack[i].roomKey;
            child.gameId = serverPack[i].gameId;
            if (typeof serverPack[i].name != "undefined") {
                child.getChildByName("btn_roomCfg").getChildByName("lb_roomName").getComponent(cc.Label).string = serverPack[i].name;
            } else {
                var roomName = app.ShareDefine().GametTypeID2Name[serverPack[i].gameId];
                child.getChildByName("btn_roomCfg").getChildByName("lb_roomName").getComponent(cc.Label).string = roomName;
            }
            var roomInfoStr = "";
            if (serverPack[i].setCount > 100 && serverPack[i].setCount < 200) {
                var total = serverPack[i].size * (serverPack[i].setCount % 100);
                roomInfoStr = serverPack[i].size + "人/" + total + "庄";
            } else if (serverPack[i].setCount == 201) {
                roomInfoStr = serverPack[i].size + "人/1拷";
            } else if (serverPack[i].setCount == 310) {
                roomInfoStr = serverPack[i].size + "人/1课:10分";
            } else if (serverPack[i].setCount == 311) {
                roomInfoStr = serverPack[i].size + "人/1课:100分";
            } else if (serverPack[i].setCount == 312) {
                roomInfoStr = serverPack[i].size + "人/局麻";
            } else if (serverPack[i].setCountt >= 400 && serverPack[i].gameId == this.ShareDefine.GameType_GD) {
                var setCount = serverPack[i].setCount % 400;
                if (setCount == 14) {
                    roomInfoStr = serverPack[i].size + "人/过A";
                } else {
                    roomInfoStr = serverPack[i].size + "人/过" + setCount;
                }
            } else if (serverPack[i].setCountt >= 400 && serverPack[i].gameId == this.ShareDefine.GameType_WHMJ) {
                var _setCount = serverPack[i].setCount % 400;
                roomInfoStr = serverPack[i].size + "人/" + _setCount + "底";
            } else if (serverPack[i].setCountt >= 600 && serverPack[i].gameId == this.ShareDefine.GameType_MASMJ) {
                var _setCount2 = serverPack[i].setCount % 600;
                roomInfoStr = serverPack[i].size + "人/" + _setCount2 + "倒";
            } else {
                roomInfoStr = serverPack[i].size + "人/" + serverPack[i].setCount + "局";
            }
            child.getChildByName("btn_roomCfg").getChildByName("lb_roomInfo").getComponent(cc.Label).string = roomInfoStr;
            if (serverPack[i].tab > 0) {
                child.zIndex = 0;
                child.getChildByName("btn_roomCfg").getChildByName("img_icon").active = true;
            } else {
                child.zIndex = 1;
                child.getChildByName("btn_roomCfg").getChildByName("img_icon").active = false;
            }
            child.getChildByName("btn_roomCfg").getChildByName("lb_tagid").getComponent(cc.Label).string = serverPack[i].tagId;
            if (typeof serverPack[i]["password"] != "undefined") {
                if (serverPack[i]["password"] != "") {
                    child.getChildByName("btn_roomCfg").getChildByName("tip_lock").active = true;
                } else {
                    child.getChildByName("btn_roomCfg").getChildByName("tip_lock").active = false;
                }
            } else {
                child.getChildByName("btn_roomCfg").getChildByName("tip_lock").active = false;
            }

            child.active = true;
            content.addChild(child);
        }
        content.sortAllChildren();
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else if (btnName == "btn_roomCfg") {
            var isPassword = btnNode.getChildByName("tip_lock").active;
            //检查本地是否有密码
            var password = "";
            if (isPassword) {
                password = localStorage.getItem("password_" + this.clubId + "_" + btnNode.parent.tagId);
                if (password == null || typeof password == "undefined" || password == "") {
                    //弹出密码框
                    btnNode.roomKey = btnNode.parent.roomKey;
                    btnNode.tagId = btnNode.parent.tagId;
                    btnNode.gameId = btnNode.parent.gameId;
                    this.FormManager.ShowForm('ui/club/UIClubRoomPassword', btnNode, this.clubId);
                    return;
                }
            }

            var gameName = app.ShareDefine().GametTypeID2PinYin[btnNode.parent.gameId].toLowerCase(); //游戏名
            app.Client.JoinRoomCheckSubGame(gameName, btnNode.parent.roomKey, this.clubId, undefined, password, true);
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    }

});

cc._RF.pop();