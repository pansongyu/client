var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        join_list: cc.Node,
        join_list2: cc.Node,
        bg_join: cc.SpriteFrame,
        bg_touxiang: cc.SpriteFrame,
        bg: [cc.SpriteFrame],
    },

    OnCreateInit: function() {
        this.FormManager = app.FormManager();
        this.ShareDefine = app.ShareDefine();
        this.HeroManager = app.HeroManager();
        this.heroName = this.HeroManager.GetHeroProperty("name");
        this.heroId = this.HeroManager.GetHeroProperty("pid");
        this.WeChatManager = app.WeChatManager();
        this.ComTool = app.ComTool();
        this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
        this.RegEvent("OnRoomStateChange", this.Event_RoomStatusChange, this);
        this.RegEvent("OnRoomPlayerChange", this.Event_RoomPlayerChange, this);
        this.RegEvent("OnRoomSetChange", this.Event_RoomSetChange, this);
        this.RegEvent("OutRoom", this.Event_OutRoom, this);
    },
    Event_OutRoom: function() {
        this.inRoom = false;
        this.inRoomInfo = null;
    },
    OnShow: function(roomData) {
        this.inRoom = false;
        this.CheckInRoom();
        this.clubId = roomData.clubId;
        this.unionId = roomData.unionId;
        this.gameId = roomData.gameId;
        let gameId = roomData.gameId;
        this.isShowUplevelId=app.ClubManager().GetCurClubShowUplevelId();
        let gameType = app.ShareDefine().GametTypeID2PinYin[gameId];
        let playerList = roomData.posList;
        let roomCfg = roomData.roomCfg;
        let roomID = roomData.roomID;
        let roomKey = roomData.roomKey;
        let playerNum = roomCfg.playerNum;
        let clubName = roomData.name;
        let setId = roomData.setId;
        this.tagId = roomData.tagId;
        this.roomSetId = setId;
        this.isManage = roomData.isManage; //是否管理员、创造者 0:不是,1:是
        if (this.isManage == 0) {
            this.node.getChildByName('left').getChildByName('btn_jiesan').active = false;
        } else {
            // if (this.isManage == 1) {
            //     if(setId==0){
            //         this.node.getChildByName('left').getChildByName('btn_jiesan').active=true;
            //     }else{
            //         this.node.getChildByName('left').getChildByName('btn_jiesan').active=false;
            //     }
            // }else{
            this.node.getChildByName('left').getChildByName('btn_jiesan').active = true;
            // }
        }

        //显示锁标记
        if (typeof(roomCfg["password"]) != "undefined") {
            if (roomCfg["password"] != "") {
                this.node.getChildByName("tip_lock").active = true;
            } else {
                this.node.getChildByName("tip_lock").active = false;
            }
        } else {
            this.node.getChildByName("tip_lock").active = false;
        }


        this.playerNum = playerNum;
        this.playerList = playerList;
        this.gameType = gameType.toLowerCase();
        this.gameCfg = roomData.roomCfg;
        this.roomKey = roomKey;
        this.roomID = roomID;

        this.uiStr = "right/join_list2";
        this.join_list.active = false;
        this.join_list2.active = true;
        if (this.playerNum > 4) {
            this.uiStr = "right/join_list";
            this.join_list.active = true;
            this.join_list2.active = false;
        } else {
            if (this.playerNum == 2) {
                this.join_list2.getChildByName("zhuozi").getComponent(cc.Sprite).spriteFrame = this.bg[0];
            } else if (this.playerNum == 3) {
                this.join_list2.getChildByName("zhuozi").getComponent(cc.Sprite).spriteFrame = this.bg[1];
            } else if (this.playerNum == 4) {
                this.join_list2.getChildByName("zhuozi").getComponent(cc.Sprite).spriteFrame = this.bg[2];
            }
        }

        if (setId > 0) {
            this.SetWndProperty(this.uiStr + "/zhuozi/lb_state", "text", '游戏中...');
        } else {
            this.SetWndProperty(this.uiStr + "/zhuozi/lb_state", "text", '等待中...');
        }
        this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_clubname", "text", clubName);
        this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_roomkey", "text", "房间号:" + roomKey);
        if (roomCfg.setCount > 100 && roomCfg.setCount < 200) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:" + roomCfg.setCount % 100 + "圈");
        } else if (roomCfg.setCount == 201) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:1拷");
        } else if (roomCfg.setCount == 310) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:1课:10分");
        } else if (roomCfg.setCount == 311) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:1课:100分");
        } else if (roomCfg.setCount == 312) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:局麻");
        } else if (roomCfg.setCount == 401 && gameId == this.ShareDefine.GameType_JXFZGP) { //江西抚州关牌
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:1次");
        } else if (roomCfg.setCount >= 400 && gameId == this.ShareDefine.GameType_GD) {
            let setCount = roomCfg.setCount % 400;
            if (setCount == 14) {
                this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:过A");
            } else {
                this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:过" + setCount);
            }
        } else if (roomCfg.setCount >= 400 && gameId == this.ShareDefine.GameType_WHMJ) {
            let setCount = roomCfg.setCount % 400;
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:" + setCount + "底");
        } else if (roomCfg.setCount >= 600 && gameId == this.ShareDefine.GameType_MASMJ) {
            let setCount = roomCfg.setCount % 600;
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:" + setCount + "倒");
        } else if (roomCfg.setCount == 501 && gameId == this.ShareDefine.GameType_GLWSK) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "");
        } else {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_setcount", "text", "局数:" + roomCfg.setCount);
        }

        this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_gamename", "text", this.GameType2Name(this.gameType));
        let playerIngNum = 0;
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i]["pid"] > 0) {
                playerIngNum++;
            }
        }
        let renshuStr = "人数:" + playerIngNum + "/" + this.playerNum;
        this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_renshu", "text", renshuStr);
        this.SetWndProperty("left/wanfaScrollView/view/roominfo/rich_wanfa", "text", this.GetWanFa(roomCfg));
        //如果是联盟的房间
        if (this.unionId > 0) {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointMK", "active", true);
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointBS", "active", true);
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointCost", "active", true);
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointMK", "text", roomCfg.roomSportsThreshold);
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointBS", "text", roomCfg.sportsDouble);
            let PLDecStr = "";
            if (roomCfg.roomSportsType == 0) {
                if (typeof(roomCfg.bigWinnerConsumeList) == "undefined" || roomCfg.bigWinnerConsumeList.length <= 0) {
                    PLDecStr = "大赢家赢比赛分>=" + roomCfg.geWinnerPoint + "时，消耗" + roomCfg.roomSportsBigWinnerConsume;
                } else {
                    for (let i = 0; i < roomCfg.bigWinnerConsumeList.length; i++) {
                        PLDecStr += "大赢家赢比赛分>" + roomCfg.bigWinnerConsumeList[i].winScore + "时，消耗比赛分" + roomCfg.bigWinnerConsumeList[i].sportsPoint;
                        if (i < (roomCfg.bigWinnerConsumeList.length - 1)) {
                            PLDecStr += "，";
                        }
                    }
                }
                if(roomCfg.twoMode){
                    PLDecStr += "；每人付" + roomCfg.roomSportsEveryoneConsume;
                }
            } else {
                PLDecStr = "每人付" + roomCfg.roomSportsEveryoneConsume;
            }
            if (roomCfg.dianbo && parseInt(roomCfg.dianbo)) {
                PLDecStr += "，携带分"+ roomCfg.dianbo
            }
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointCost", "text", PLDecStr);
        } else {
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointMK", "active", false);
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointBS", "active", false);
            this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_SportsPointCost", "active", false);
        }

        //参数传递,邀请使用
        var GamePlayManager = require('GamePlayManager');
        let btn_yaoqing = this.node.getChildByName('left').getChildByName('btn_yaoqing');
        var WeChatShare = GamePlayManager.WeChatShare(roomData.gameType, roomData.roomCfg);
        btn_yaoqing.title = WeChatShare['title'];
        btn_yaoqing.weChatAppShareUrl = WeChatShare['url'];
        btn_yaoqing.setCount = roomCfg.setCount; //多少局
        btn_yaoqing.roomKey = roomData.roomKey; //房间号
        btn_yaoqing.createType = roomData.createType; //房间号
        btn_yaoqing.clubName = roomData.name; //房间号
        btn_yaoqing.joinPlayerCount = roomCfg.playerNum; //几人场
        let haveRen = 0;
        for (let j = 0; j < roomData.posList.length; j++) {
            if (roomData.posList[j].pid > 0) {
                haveRen++;
            }
        }
        let payType = '';
        if (roomData.roomCfg.paymentRoomCardType == 2) {
            payType = ',胜家付' + roomCfg.clubWinnerPayConsume + '圈卡';
        } else if (roomData.roomCfg.paymentRoomCardType == 1) {
            payType = ',AA付' + roomCfg.clubWinnerPayConsume + '圈卡';
        } else if (roomData.roomCfg.paymentRoomCardType == 0) {
            payType = ',管理付';
        }
        btn_yaoqing.que = roomCfg.playerNum - haveRen;
        btn_yaoqing.wanfa = this.GetWanFa(roomData.roomCfg) + payType;
        //参数传递,邀请使用


        this.InitUser();
        this.ShowJoinPlayer();
    },
    CheckInRoom: function() {
        let self = this;
        app.NetManager().SendPack("room.CBaseRoomConfig", {}, function(event) {
            self.inRoom = true;
            self.inRoomInfo = event;
        }, function(event) {
            console.log("没在房间");
        });
    },
    Event_RoomSetChange: function(serverPack) {
        let roomData = serverPack;
        if (roomData.roomKey == this.roomKey) {
            let index = 4;
            if (this.playerNum > 4) {
                index = 10;
            }
            for (let i = 0; i < index; i++) {
                this.SetWndProperty(this.uiStr + "/user" + i + "/btn_tichu", "active", false);
            }
            this.SetWndProperty(this.uiStr + "/zhuozi/lb_state", "text", '游戏中...');
            if (this.isManage < 1) {
                this.node.getChildByName('left').getChildByName('btn_jiesan').active = false;
            }
        }
    },
    Event_RoomStatusChange: function(serverPack) {
        //this.roomList
        let roomData = serverPack.roomInfoItem;
        let isClose = roomData.isClose;
        if (roomData.roomKey == this.roomKey) {
            if (isClose == true) {
                app.SysNotifyManager().ShowSysMsg("房间已经结束");
                this.CloseForm();
            }
        }
    },
    Event_RoomPlayerChange: function(serverPack) {
        serverPack = serverPack;
        console.log(serverPack);
        if (serverPack.roomKey != this.roomKey) {
            return;
        }
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].pos == serverPack['pos'].pos) {
                this.playerList[i] = serverPack['pos'];
            }
        }
        let playerIngNum = 0;
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i]["pid"] > 0) {
                playerIngNum++;
            }
        }
        let renshuStr = "人数:" + playerIngNum + "/" + this.playerNum;
        this.SetWndProperty("left/wanfaScrollView/view/roominfo/lb_renshu", "text", renshuStr);
        this.ShowJoinPlayer();
    },
    InitUser: function() {
        let index = 4;
        if (this.playerNum > 4) {
            index = 10;
        }
        for (let i = 0; i < index; i++) {
            this.SetWndProperty(this.uiStr + "/user" + i, "active", false);
            this.SetWndProperty(this.uiStr + "/user" + i + "/btn_tichu", "active", false);
            this.SetWndProperty(this.uiStr + "/user" + i + "/icon_OK", "active", false);
            this.SetWndProperty(this.uiStr + "/user" + i + "/lixian", "active", false);
            this.SetWndProperty(this.uiStr + "/user" + i + "/lb_username", "text", '');
            this.SetWndProperty(this.uiStr + "/user" + i + "/lb_clubname", "text", '');
            this.SetWndProperty(this.uiStr + "/user" + i + "/lb_upname", "text", '');
            this.SetWndProperty(this.uiStr + "/user" + i + "/lb_upname", "queryPid",0);
            this.SetWndProperty(this.uiStr + "/user" + i + "/lb_upname", "queryClubId",0);

            let touxiang = this.GetWndNode(this.uiStr + "/user" + i + "/btn_join");
            touxiang.getComponent(cc.Sprite).spriteFrame = this.bg_join;
        }
        let userlist = this.UserPosList();
        for (let i = 0; i < userlist.length; i++) {
            this.SetWndProperty(this.uiStr + "/user" + userlist[i], "active", true);
        }
    },
    GameType2Name: function(gameType) {
        let gameCfg = this.gameCfg;
        let gamename = '';
        if (gameType.toLowerCase() == 'sss') {
            if (gameCfg.sign == 2) {
                gamename = '庄家拼罗松';
            } else {
                gamename = '2-8人拼罗松';
            }
            return gamename;
        } else if (gameType.toLowerCase() == 'nn') {
            if (gameCfg.sign == 0) {
                gamename = '自由抢庄 牛';
            } else if (gameCfg.sign == 1) {
                gamename = '拼十上庄 牛';
            } else if (gameCfg.sign == 2) {
                gamename = '固定庄家 牛';
            } else if (gameCfg.sign == 3) {
                gamename = '通比 牛';
            } else if (gameCfg.sign == 4) {
                gamename = '明牌抢庄 牛';
            } else if (gameCfg.sign == 5) {
                gamename = '轮庄 牛';
            }
            return gamename;
        } else if (gameType.toLowerCase() == 'sg') {
            if (gameCfg.sign == 0) {
                gamename = '自由抢庄 三公';
            } else if (gameCfg.sign == 1) {
                gamename = '三公上庄 三公';
            } else if (gameCfg.sign == 2) {
                gamename = '固定庄家 三公';
            } else if (gameCfg.sign == 3) {
                gamename = '通比三公';
            } else if (gameCfg.sign == 4) {
                gamename = '加倍抢庄 三公';
            }
            return gamename;
        } else {
            let gameTypeID = this.ShareDefine.GametTypeNameDict[gameType.toUpperCase()];
            return this.ShareDefine.GametTypeID2Name[gameTypeID];
        }
    },
    GetWanFa: function(gameCfg) {
        return app.RoomCfgManager().WanFa(this.gameType, gameCfg);
    },
    ShowJoinPlayer: function() {
        let playerList = this.playerList;
        for (let i = 0; i < playerList.length; i++) {
            let showpos = this.DataPos2ShowPos(playerList[i].pos);
            if (playerList[i]) {
                let PlayerInfo = playerList[i];
                let heroID = PlayerInfo["pid"];
                let headImageUrl = PlayerInfo["headImageUrl"];
                // let userNode = this.node.getChildByName("right").getChildByName("join_list2").getChildByName("user"+showpos);
                let touxiang = this.GetWndNode(this.uiStr + '/user' + showpos + '/btn_join');
                if (heroID > 0) {
                    if (headImageUrl) {
                        this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                        let WeChatHeadImage = touxiang.getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
                    } else {
                        touxiang.getComponent(cc.Sprite).spriteFrame = this.bg_touxiang;
                    }
                } else {
                    touxiang.getComponent(cc.Sprite).spriteFrame = this.bg_join;
                }
                if (typeof(PlayerInfo['name']) == "undefined") {
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_username', 'text', "");
                } else {
                    //显示用户名
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_username', 'text', PlayerInfo['name']);
                }

                if(PlayerInfo['clubName'] && this.isShowUplevelId==true){
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_clubname', 'text', "圈:"+PlayerInfo['clubName']);
                }else{
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_clubname', 'text', "");
                }
                if(PlayerInfo['upLevelName'] && this.isShowUplevelId==true){
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_upname', 'text', "上级:"+PlayerInfo['upLevelName']);

                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_upname', 'queryPid',PlayerInfo['pid']);
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_upname', 'queryClubId',PlayerInfo['clubID']);

                }else{
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_upname', 'text', "");
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_upname', 'queryPid',0);
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/lb_upname', 'queryClubId',0);
                }

                this.SetWndProperty(this.uiStr + '/user' + showpos + '/lixian', 'active', PlayerInfo["isLostConnect"]);

                //显示准备手势
                if (PlayerInfo["gameReady"]) {
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/icon_OK', 'active', true);
                } else {
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/icon_OK', 'active', false);
                } //显示踢人按钮
                if (this.isManage > 0 && heroID > 0 && this.roomSetId == 0) {
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/btn_tichu', 'active', true);
                } else {
                    this.SetWndProperty(this.uiStr + '/user' + showpos + '/btn_tichu', 'active', false);
                }
            }
        }
    },
    UserPosList: function() {
        let playerNum = this.playerNum;
        let userlist = [];
        if (playerNum == 2) {
            userlist = [0, 1];
        } else if (playerNum == 3) {
            userlist = [0, 1, 2];
        } else if (playerNum == 4) {
            userlist = [0, 1, 2, 3];
        } else if (playerNum == 5) {
            userlist = [0, 2, 4, 6, 8];
        } else if (playerNum == 6) {
            userlist = [0, 2, 4, 6, 8, 9];
        } else if (playerNum == 7) {
            userlist = [0, 1, 3, 4, 5, 7, 9];
        } else if (playerNum == 8) {
            userlist = [0, 1, 3, 4, 5, 6, 7, 9];
        } else if (playerNum == 9) {
            userlist = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        } else if (playerNum == 10) {
            userlist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
        return userlist;
    },
    DataPos2ShowPos: function(datapos) {
        let userlist = this.UserPosList();
        return userlist[datapos];
    },
    ShowPos2DataPos: function(showpos) {
        let datapos = -1;
        let userlist = this.UserPosList();
        for (let i = 0; i < userlist.length; i++) {
            if (userlist[i] == showpos) {
                datapos = i;
                break;
            }
        }
        return datapos;
    },
    GetHasPlayerNum: function() {
        let nowJoin = 0;
        for (let i = 0; i < this.playerList.length; i++) {
            if (0 != this.playerList[i].pid)
                nowJoin++;
        }
        return nowJoin;
    },
    Click_btn_YaoQing: function(btnNode) {
        let weChatAppShareUrl = btnNode.weChatAppShareUrl;
        let setCount = btnNode.setCount; //多少局
        let roomKey = btnNode.roomKey; //房间号
        let joinPlayerCount = btnNode.joinPlayerCount; //几人场
        let title = "";
        //title=title.replace('{房间号}',roomKey);
        let gamedesc = "";
        let que = btnNode.que;
        title = "[" + btnNode.clubName + "]亲友团," + roomKey + " " + (joinPlayerCount - que) + "等" + que + "进团";
        console.log("Click_btn_weixin:", title);
        console.log("Click_btn_weixin:", gamedesc);
        console.log("Click_btn_weixin:", weChatAppShareUrl);
        this.FormManager.ShowForm('UIRoomCopy', roomKey, title, gamedesc, weChatAppShareUrl);
    },
    OnClick: function(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_join' == btnName) {
            let nowJoin = this.GetHasPlayerNum();
            if (nowJoin >= this.playerNum) {
                app.SysNotifyManager().ShowSysMsg("房间人数已满");
                return;
            }
            let userNodeName = btnNode.parent.name;
            let pos = this.ShowPos2DataPos(userNodeName.replace('user', ''));
            for (let i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i]) {
                    if (this.playerList[i].pos == pos && this.playerList[i].pid > 0) {
                        //已经有玩家，不能加入
                        return;
                    }
                }
            }
            //是否需要密码
            let isPassword = this.node.getChildByName("tip_lock").active;
            //检查本地是否有密码
            let password = "";
            if (isPassword) {
                password = localStorage.getItem("password_" + this.clubId + "_" + this.tagId);
                if (password == null || typeof(password) == "undefined" || password == "") {
                    //弹出密码框
                    this.node.roomKey = this.roomKey;
                    this.node.tagId = this.tagId;
                    this.node.gameId = this.gameId;
                    this.FormManager.ShowForm('ui/club/UIClubRoomPassword', this.node, this.clubId);
                    return;
                }
            }
            if (this.inRoom == false) {
                app.Client.JoinRoomCheckSubGame(this.gameType, this.roomKey, this.clubId, undefined, password);
            } else {
                this.ShowSysMsg("您已经在别的房间，不能加入该房间");
            }
            this.CloseForm();
        } else if ('btn_tichu' == btnName) {
            let userName = btnNode.parent.getChildByName("lb_username").getComponent(cc.Label).string;
            this.SetWaitForConfirm("MSG_TICHU_CLUBROOM", app.ShareDefine().ConfirmYN, [userName, this.roomKey], [btnNode]);
        } else if ('btn_jiesan' == btnName) {
            this.SetWaitForConfirm("MSG_DISSOLVE_CLUBROOM", app.ShareDefine().ConfirmYN, [this.roomKey], []);
        } else if ('btn_yaoqing' == btnName) {
            this.Click_btn_YaoQing(btnNode);
        }else if('lb_upname'==btnName){
           let self = this;
           app.NetManager().SendPack("union.CUnionGetMembePromotionList",{"clubId":this.clubId,"unionId":this.unionId,"queryPid":btnNode.queryPid,"queryClubId":btnNode.queryClubId}, function(serverPack){
                app.FormManager().ShowForm("ui/club/UIClubPromotionDetail",serverPack,1,1);
            }, function(){
                console.log("union.CUnionGetMembePromotionList 获取失败");
            });

        }
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function(msgID, type, msgArg = [], cbArg = []) {
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_DISSOLVE_CLUBROOM' == msgID) {
            if (this.unionId > 0) {
                app.NetManager().SendPack("union.CUnionDissolveRoom", {
                    "unionId": this.unionId,
                    "clubId": this.clubId,
                    "roomKey": this.roomKey
                });
            } else {
                app.NetManager().SendPack("club.CClubDissolveRoom", {
                    "clubId": this.clubId,
                    "roomKey": this.roomKey
                });
            }
            this.CloseForm();
        } else if ('MSG_TICHU_CLUBROOM' == msgID) {
            let btnNode = backArgList[0];
            let userNodeName = btnNode.parent.name;
            let showpos = userNodeName.replace('user', '');
            let datapos = this.ShowPos2DataPos(showpos);
            if (this.unionId > 0) {
                app.NetManager().SendPack("union.CUnionKickRoom", {
                    "unionId": this.unionId,
                    "clubId": this.clubId,
                    "roomKey": this.roomKey,
                    "posIndex": datapos
                });
            } else {
                app.NetManager().SendPack("club.CClubKickRoom", {
                    "clubId": this.clubId,
                    "roomKey": this.roomKey,
                    "posIndex": datapos
                });
            }
        }
    },
});