"use strict";
cc._RF.push(module, 'af454kV169GWZGKKrtgqpZM', 'UIPublic_Record');
// script/ui/UIPublic_Record.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        room_Id: cc.Label,
        end_Time: cc.Label,
        lb_jushu: cc.Label,
        fristLayout: cc.Node,
        secondLayout: cc.Node,
        continueBtnNode: cc.Node,
        exitRoomBtnNode: cc.Node,
        exitBtnNode: cc.Node,
        goSecondBtnNode: cc.Node,

        wolaikaijuBtnNode: cc.Node,
        pingfenkaijuBtnNode: cc.Node,
        dayingjiakaijuBtnNode: cc.Node,

        btn_sharemore: cc.Node,
        sharemore: cc.Node,

        prefab1: cc.Prefab,
        prefab2: cc.Prefab,
        prefab8: cc.Prefab,
        prefab10: cc.Prefab,
        pokerNNPrefab: cc.Prefab,
        pokerZJHPrefab: cc.Prefab,
        pokerSGPrefab: cc.Prefab,
        pdkPrefab: cc.Prefab
    },

    OnCreateInit: function OnCreateInit() {
        this.PokerModle = app.PokerCard();
        this.SDKManager = app.SDKManager();
        this.fristFrame = this.node.getChildByName('fristFrame');
        this.secondFrame = this.node.getChildByName('scendFrame');
        this.fristScorll = this.fristFrame.getChildByName('ScrollView').getComponent(cc.ScrollView);
        this.secondScorll = this.secondFrame.getChildByName('ScrollView').getComponent(cc.ScrollView);
        this.topLabels = [];
        this.bottomLabels = [];
        this.nnStartX = -460;
        this.nnDistance = 131;
        this.zjhStartX = -470;
        this.zjhDistance = 108;
        this.pdkStartX = -366;
        this.pdkDistance = 247;
        var topNode = this.secondFrame.getChildByName('topLabels');
        var bottomNode = this.secondFrame.getChildByName('bottomLabels');
        for (var i = 0; i < 10; i++) {
            var strName = 'label' + i;
            var labelNode = topNode.getChildByName(strName);
            this.topLabels.push(labelNode);
            labelNode = bottomNode.getChildByName(strName);
            this.bottomLabels.push(labelNode);
        }

        this.redColor = new cc.Color(181, 104, 48);
        this.greenColor = new cc.Color(59, 138, 133);
        this.RegEvent("GameRecord", this.Event_GameRecord);
        this.RegEvent("EVT_CloseDetail", this.CloseForm, this);
    },

    OnShow: function OnShow() {
        var datainfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var playerList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var needShowIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

        this.PlayerName = [];
        this.HideAllBtn();
        this.needShowSecond = false; //控制点击数据未到处理
        this.fristFrame.active = false;
        this.secondFrame.active = false;

        this.playerList = null;
        this.datainfo = null;
        this.dataByZhanJi = false;
        this.clubId = 0;
        var setID = 0;
        var endSec = '';
        var roomKey = '';
        var roomID = 0;
        var GamePlayManager = require('GamePlayManager');
        if (-1 != needShowIndex) {
            this.dataByZhanJi = true;
            this.playerList = playerList;
            this.datainfo = datainfo;
            setID = datainfo.setId;
            endSec = datainfo.endTime;
            roomKey = "房间号:" + datainfo.key;
            roomID = datainfo.roomId;
            this.ShareShortRoomID = roomKey;
            this.ShareLongRoomID = roomID;
            if (1 == needShowIndex) this.fristData = datainfo.countRecords;else {
                this.needShowSecond = true;
                app.NetManager().SendPack("game.CPlayerSetRoomRecord", { "roomID": roomID });
            }
        } else {
            this.roomMrg = GamePlayManager.RoomMrg(GamePlayManager.playgame);
            if (!this.roomMrg) {
                this.CloseForm();
                return;
            }
            this.room = this.roomMrg.GetEnterRoom();
            if (!this.room) {
                this.CloseForm();
                return;
            }
            var roomEnd = this.room.GetRoomProperty("roomEnd");
            if (!roomEnd) {
                this.CloseForm();
                return;
            }
            if (GamePlayManager.playgame == "gdy") {
                var sRoomEndResult = roomEnd["sRoomEndResult"];
                setID = sRoomEndResult["setId"];
                endSec = sRoomEndResult['endTime'];
                roomKey = "房间号:" + this.room.GetRoomProperty("key");
                this.fristData = sRoomEndResult['countRecords'];
            } else {
                var record = roomEnd["record"];
                setID = record["setCnt"];
                endSec = record['endSec'];
                roomKey = "房间号:" + this.room.GetRoomProperty("key");
                this.fristData = record['recordPosInfosList'];
            }

            roomID = this.room.GetRoomProperty("roomID");
            this.ShareShortRoomID = roomKey;
            this.ShareLongRoomID = roomID;
            if (GamePlayManager.playgame != 'sss') {
                if (!this.room.GetGameRecord()) {
                    this.roomMrg.sendEveryGameRecord(roomID);
                }
            }
            if (GamePlayManager.playgame == 'sss') {
                this.roomMrg.SendEndRoom(roomID);
            }
            var roomCfg = this.room.GetRoomConfig();
            this.clubId = roomCfg.clubId;
            // if(roomCfg.createType==2){多于判断上面调用了this.HideAllBtn();
            //     this.wolaikaijuBtnNode.active=false;
            //     this.pingfenkaijuBtnNode.active=false;
            //     this.dayingjiakaijuBtnNode.active=false;
            // }
        }
        this.room_Id.string = roomKey;
        this.lb_jushu.string = app.i18n.t("UIWanFa_setCount", { "setCount": setID });
        this.end_Time.string = this.ComTool.GetDateYearMonthDayHourMinuteString(endSec);

        if (-1 == needShowIndex || 1 == needShowIndex) this.UpdateFristFrame();else {
            if (GamePlayManager.playgame == 'sss') {
                app.FormManager().ShowForm("UISSS_Record");
            } else {
                this.UpdateScendFrame();
            }
        }
        //初始化分享
        this.sharemore.active = false;
    },
    HideSecondLabel: function HideSecondLabel() {
        for (var i = 0; i < 8; i++) {
            this.topLabels[i].getComponent(cc.Label).string = '';
            this.bottomLabels[i].getComponent(cc.Label).string = '';
        }
    },
    UpdateFristFrame: function UpdateFristFrame() {
        this.fristScorll.stopAutoScroll();
        this.secondScorll.stopAutoScroll();
        //this.fristLayout.removeAllChildren();
        this.DestroyAllChildren(this.fristLayout);
        var dataCount = 0;
        for (var i = 0; i < this.fristData.length; i++) {
            if (0 != this.fristData[i].pid) dataCount++;
        }
        var usePrefabIndex = 1;
        if (dataCount > 4) usePrefabIndex = 2;
        //先找出大赢家
        var bigBang = -1;
        //console.log();
        var lastPoint = this.fristData[0].point;
        for (var _i = 0; _i < this.fristData.length; _i++) {
            if (this.fristData[_i].pid <= 0) continue;
            if (lastPoint < this.fristData[_i].point) {
                bigBang = _i;
                lastPoint = this.fristData[_i].point;
            }
        }
        if (0 != this.fristData[0].point && -1 == bigBang) bigBang = 0;
        var showTipIndex = 1;
        var node = null;
        var nodeObjs = {};
        for (var _i2 = 0; _i2 < this.fristData.length; _i2++) {
            var allNum = this.fristData[_i2].winCount + this.fristData[_i2].loseCount + this.fristData[_i2].flatCount;
            if (this.fristData[_i2].pid <= 0 || 0 == allNum) continue;
            if (1 == usePrefabIndex) {
                node = cc.instantiate(this.prefab1);
                showTipIndex = 1;
            } else {
                node = cc.instantiate(this.prefab2);
                showTipIndex = 2;
            }
            this.GetFristPrefabAllNode(node, nodeObjs);
            if (_i2 >= showTipIndex) nodeObjs.topTitle.active = false;
            if (bigBang == _i2 || lastPoint == this.fristData[_i2].point) nodeObjs.iconWin.active = true;else nodeObjs.iconWin.active = false;

            this.SetUserInfo(nodeObjs.userInfo, this.fristData[_i2].pid);
            this.SetScore(nodeObjs, _i2);
            this.fristLayout.addChild(node);
        }
        if (this.dataByZhanJi) {
            this.exitBtnNode.active = true;
        } else {
            this.exitRoomBtnNode.active = true;
            this.goSecondBtnNode.active = false;
            if (!app.ShareDefine().isCoinRoom) {
                var roomCfg = this.room.GetRoomConfig();
                if (0 == this.clubId && roomCfg.createType == 1) {
                    /*this.wolaikaijuBtnNode.active=true;
                    this.pingfenkaijuBtnNode.active=true;
                    this.dayingjiakaijuBtnNode.active=true;*/
                    this.wolaikaijuBtnNode.active = false;
                    this.pingfenkaijuBtnNode.active = false;
                    this.dayingjiakaijuBtnNode.active = false;
                }
            } else this.continueBtnNode.active = true;
        }
        this.fristFrame.active = true;
        this.secondFrame.active = false;
    },
    GetFristPrefabAllNode: function GetFristPrefabAllNode(curNode, nodeObjs) {
        nodeObjs.topTitle = curNode.getChildByName('topTitle');
        nodeObjs.userInfo = curNode.getChildByName('user_info');
        nodeObjs.winNum = curNode.getChildByName('lb_win_num');
        nodeObjs.loseNum = curNode.getChildByName('lb_lose_num');
        nodeObjs.win = curNode.getChildByName('lb_win');
        nodeObjs.lose = curNode.getChildByName('lb_lose');
        nodeObjs.ping = curNode.getChildByName('lb_ping');
        nodeObjs.iconWin = curNode.getChildByName('icon_win');
    },
    SetUserInfo: function SetUserInfo(userInfoNode, pid) {
        var player = null;
        var ownerID = 0;
        if (this.dataByZhanJi) {
            for (var i = 0; i < this.playerList.length; i++) {
                if (pid == this.playerList[i].pid) {
                    player = this.playerList[i];
                    break;
                }
            }
            ownerID = this.datainfo.ownerID;
        } else {
            var GamePlayManager = require('GamePlayManager');
            if (GamePlayManager.playgame == 'pdk' || GamePlayManager.playgame == 'sss' || GamePlayManager.playgame == 'xyzb' || GamePlayManager.playgame == 'gdy' || GamePlayManager.playgame == 'wsk') {
                player = this.room.GetRoomPosMgr().GetPlayerInfoByPid(pid);
            } else {
                player = this.room.GetPlayerInfoByPid(pid);
            }
            ownerID = this.room.GetRoomProperty("ownerID");
        }
        if (!player) {
            this.ErrLog('SetUserInfo Error this.playerList.length = ' + this.playerList.length);
            return;
        }
        var playerName = "";
        playerName = player["name"];
        userInfoNode.getChildByName("lable_name").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(pid, playerName);
        userInfoNode.getChildByName("label_id").getComponent(cc.Label).string = this.ComTool.GetPid(pid);
        var wechatSprite = userInfoNode.getChildByName("head_img").getComponent("WeChatHeadImage");
        wechatSprite.OnLoad();
        wechatSprite.ShowHeroHead(pid);

        //判断房主是谁
        var fangzhu = userInfoNode.getChildByName("fangzhu");
        if (ownerID == player.pid) fangzhu.active = true;else fangzhu.active = false;
    },
    SetScore: function SetScore(nodeObjs, dataIndex) {
        var data = this.fristData[dataIndex];
        if (data.point > 0) {
            nodeObjs.winNum.active = true;
            nodeObjs.loseNum.active = false;
            if (data.point > 10000) {
                var needNum = data.point / 10000;
                needNum = needNum.toFixed(1);
                nodeObjs.winNum.getComponent(cc.Label).string = '+' + needNum + '万';
            } else nodeObjs.winNum.getComponent(cc.Label).string = '+' + data.point;
        } else {
            nodeObjs.winNum.active = false;
            nodeObjs.loseNum.active = true;
            if (data.point < -10000) {
                var _needNum = data.point / 10000;
                _needNum = _needNum.toFixed(1);
                nodeObjs.loseNum.getComponent(cc.Label).string = '' + _needNum + '万';;
            } else nodeObjs.loseNum.getComponent(cc.Label).string = data.point;
        }

        nodeObjs.win.getComponent(cc.Label).string = data.winCount;
        nodeObjs.lose.getComponent(cc.Label).string = data.loseCount;
        nodeObjs.ping.getComponent(cc.Label).string = data.flatCount;
    },
    UpdateScendFrame: function UpdateScendFrame() {
        if (!this.recordList) return;

        for (var i = 0; i < this.topLabels.length; i++) {
            this.topLabels[i].active = false;
            this.bottomLabels[i].active = false;
        }

        this.fristScorll.stopAutoScroll();
        this.secondScorll.stopAutoScroll();
        //this.secondLayout.removeAllChildren();
        this.DestroyAllChildren(this.secondLayout);
        this.HideSecondLabel();
        var GamePlayManager = require('GamePlayManager');
        var allPlayer = [];
        if (this.dataByZhanJi) allPlayer = this.playerList;else {
            if ('xyzb' == GamePlayManager.playgame || 'wsk' == GamePlayManager.playgame) {
                allPlayer = this.roomPosMgr.GetRoomAllPlayerInfo();
            } else {
                allPlayer = this.room.GetRoomProperty('posList');
            }
        }
        var allScore = [];
        for (var _i3 = 0; _i3 < allPlayer.length; _i3++) {
            var scoreData = {};
            scoreData.point = 0;
            scoreData.isPlaying = false;
            allScore.push(scoreData);
        }
        var startX = 0;
        var distance = 0;
        var lastUIPos = 0;
        if ('sg' == GamePlayManager.playgame || 'nn' == GamePlayManager.playgame) {
            startX = this.nnStartX;
            distance = this.nnDistance;
        } else if ('zjh' == GamePlayManager.playgame) {
            startX = this.zjhStartX;
            distance = this.zjhDistance;
        } else if ('pdk' == GamePlayManager.playgame || 'xyzb' == GamePlayManager.playgame || 'wsk' == GamePlayManager.playgame) {
            startX = this.pdkStartX;
            distance = this.pdkDistance;
        }
        for (var _i4 = 0; _i4 < this.recordList.length; _i4++) {
            var data = eval('(' + this.recordList[_i4].dataJsonRes + ')');
            var node = null;
            if ('sg' == GamePlayManager.playgame || 'nn' == GamePlayManager.playgame) node = cc.instantiate(this.prefab8);else if ('zjh' == GamePlayManager.playgame) node = cc.instantiate(this.prefab10);else if ('pdk' == GamePlayManager.playgame) node = cc.instantiate(this.pdkPrefab);else if ('xyzb' == GamePlayManager.playgame) node = cc.instantiate(this.pdkPrefab);else if ('wsk' == GamePlayManager.playgame) node = cc.instantiate(this.pdkPrefab);else if ('gdy' == GamePlayManager.playgame) node = cc.instantiate(this.prefab10);
            node.name = 'item' + (_i4 + 1);
            var btn_down = node.getChildByName('btn_down');
            if (btn_down) {
                btn_down.on('click', this.OnPokerDataBtnClick, this);
            }
            node.getChildByName('jushu').getComponent(cc.Label).string = (_i4 + 1).toString();
            var cardNode = node.getChildByName('cardNode');
            lastUIPos = 0;
            for (var j = 0; j < data.posResultList.length; j++) {
                if ('nn' == GamePlayManager.playgame || 'zjh' == GamePlayManager.playgame || 'gdy' == GamePlayManager.playgame || 'sg' == GamePlayManager.playgame) {
                    var scoreNode = node.getChildByName('label' + j);
                    var scoreLabel = scoreNode.getComponent(cc.Label);
                    scoreLabel.string = '';
                    var forLength = data.posResultList[j].cardList.length;
                    if (data.posResultList[j].pid && forLength > 0) {
                        if ('sg' == GamePlayManager.playgame || 'gdy' == GamePlayManager.playgame || 'zjh' == GamePlayManager.playgame) data.posResultList[j].cardList.sort(this.PokerModle.NormalPokerSort);
                        var needIndex = -1;
                        for (var s = 0; s < allPlayer.length; s++) {
                            if (allPlayer[s].pid == data.posResultList[j].pid) {
                                needIndex = s;
                                break;
                            }
                        }
                        if (-1 == needIndex || !data.posResultList[j].isPlaying) continue;

                        scoreNode = node.getChildByName('label' + lastUIPos);
                        scoreNode.x = startX + lastUIPos * distance;
                        scoreLabel = scoreNode.getComponent(cc.Label);

                        this.topLabels[lastUIPos].active = true;
                        this.topLabels[lastUIPos].x = startX + lastUIPos * distance;
                        this.topLabels[lastUIPos].getComponent(cc.Label).string = allPlayer[needIndex].name;

                        this.PlayerName.push(allPlayer[needIndex].name);

                        allScore[needIndex].isPlaying = true;
                        allScore[needIndex].point += data.posResultList[j].point;
                        var pokerNode = cardNode.getChildByName('pos' + lastUIPos);
                        pokerNode.x = startX + lastUIPos * distance;
                        var allPoker = null;
                        //暂时只有拼十用这类
                        var typeData = null;
                        var curCards = data.posResultList[j].cardList;
                        if ('nn' == GamePlayManager.playgame) {
                            allPoker = cc.instantiate(this.pokerNNPrefab);
                            typeData = app.PokerCard().GetNNPokerTypeStr(data.posResultList[j].crawType);
                        } else if ('zjh' == GamePlayManager.playgame) {
                            allPoker = cc.instantiate(this.pokerZJHPrefab);
                            typeData = app.PokerCard().GetZJHPokerTypeStr([], data.posResultList[j].crawType);
                        } else if ('sg' == GamePlayManager.playgame) {
                            allPoker = cc.instantiate(this.pokerSGPrefab);
                            typeData = app.PokerCard().GetSGPokerTypeStr(curCards, data.posResultList[j].crawType);
                        }
                        if (allPoker) {
                            //isCallBacker     addBet
                            var betNode = allPoker.getChildByName('bet');
                            var bankerNode = allPoker.getChildByName('banker');
                            var setLabel = null;
                            if (data.posResultList[j].isCallBacker) {
                                betNode.active = false;
                                bankerNode.active = true;
                                setLabel = bankerNode.getChildByName('label').getComponent(cc.Label);
                                setLabel.string = 'x' + data.posResultList[j].callBackerNum;
                            } else {
                                betNode.active = true;
                                bankerNode.active = false;
                                setLabel = betNode.getChildByName('label').getComponent(cc.Label);
                                setLabel.string = data.posResultList[j].addBet;
                            }
                            for (var p = 0; p < forLength; p++) {
                                var poker = allPoker.getChildByName('card' + p);
                                var pokerValue = data.posResultList[j].cardList[p];
                                app.PokerCard().GetPokeCard(pokerValue, poker, true);
                            }
                            var typeLabel = allPoker.getChildByName('cardType').getChildByName('label');
                            typeLabel.getComponent(cc.Label).string = typeData.typeStr;
                            allPoker.active = true;
                            pokerNode.addChild(allPoker);
                        }
                        if (data.posResultList[j].point > 0) {
                            scoreLabel.string = '+' + data.posResultList[j].point;
                            scoreNode.color = this.redColor;
                        } else {
                            scoreLabel.string = data.posResultList[j].point;
                            scoreNode.color = this.greenColor;
                        }
                        lastUIPos++;
                    }
                } else if (GamePlayManager.playgame == 'pdk') {
                    var playerData = data.posResultList[j];

                    node.getChildByName("player" + (j + 1)).active = true;

                    var beishu = node.getChildByName("player" + (j + 1)).getChildByName("lable1");
                    if (playerData.addDouble <= -1) {
                        beishu.getComponent(cc.Label).string = '1倍';
                    } else {
                        beishu.getComponent(cc.Label).string = playerData.addDouble + '倍';
                    }

                    var score = node.getChildByName("player" + (j + 1)).getChildByName("lable2");
                    if (playerData.point > 0) {
                        score.getComponent(cc.Label).string = '+' + playerData.point;
                        score.color = this.redColor;
                    } else {
                        score.getComponent(cc.Label).string = playerData.point;
                        score.color = this.greenColor;
                    }

                    allScore[j].isPlaying = true;
                    allScore[j].point += playerData.point;

                    var cards = node.getChildByName("player" + (j + 1)).getChildByName("lable3");
                    cards.getComponent(cc.Label).string = '剩余牌数:' + playerData.surplusCardList[playerData.surplusCardList.length - 1];

                    var playerInfo = this.room.GetRoomPosMgr().GetPlayerInfoByPos(playerData.pos);
                    this.topLabels[j].active = true;
                    this.topLabels[j].x = startX + j * distance;
                    this.topLabels[j].getComponent(cc.Label).string = playerInfo.name;
                    this.PlayerName.push(playerInfo.name);
                } else if (GamePlayManager.playgame == 'xyzb' || GamePlayManager.playgame == 'wsk') {
                    var _playerData = data.posResultList[j];

                    node.getChildByName("player" + (j + 1)).active = true;

                    var _beishu = node.getChildByName("player" + (j + 1)).getChildByName("lable1");
                    _beishu.active = false;

                    var _score = node.getChildByName("player" + (j + 1)).getChildByName("lable2");
                    if (_playerData.point > 0) {
                        _score.getComponent(cc.Label).string = '+' + _playerData.point;
                        _score.color = this.redColor;
                    } else {
                        _score.getComponent(cc.Label).string = _playerData.point;
                        _score.color = this.greenColor;
                    }

                    allScore[j].isPlaying = true;
                    allScore[j].point += _playerData.point;

                    var _cards = node.getChildByName("player" + (j + 1)).getChildByName("lable3");
                    _cards.getComponent(cc.Label).string = '';

                    var _needIndex = -1;
                    for (var _s = 0; _s < allPlayer.length; _s++) {
                        if (allPlayer[_s].pid == data.posResultList[j].pid) {
                            _needIndex = _s;
                            break;
                        }
                    }

                    this.topLabels[j].active = true;
                    this.topLabels[j].x = startX + j * distance;
                    this.topLabels[j].getComponent(cc.Label).string = allPlayer[_needIndex].name;
                    this.PlayerName.push(allPlayer[_needIndex].name);
                }
            }

            if (GamePlayManager.playgame == 'pdk') {
                node.getChildByName("room_beishu").getComponent(cc.Label).string = "房间炸弹数:" + data.roomDoubleList;
            }
            if (GamePlayManager.playgame == 'xyzb' || GamePlayManager.playgame == 'wsk') {
                node.getChildByName("room_beishu").active = false;
            }

            if (cardNode) {
                cardNode.active = false;
            }
            this.secondLayout.addChild(node);
        }
        lastUIPos = 0;
        for (var _i5 = 0; _i5 < allScore.length; _i5++) {
            this.bottomLabels[lastUIPos].active = true;
            this.bottomLabels[lastUIPos].x = startX + lastUIPos * distance;
            if (allScore[_i5].isPlaying) {
                if (allScore[_i5].point > 0) {
                    this.bottomLabels[lastUIPos].getComponent(cc.Label).string = '+' + allScore[_i5].point;
                    this.bottomLabels[lastUIPos].color = this.redColor;
                } else {
                    this.bottomLabels[lastUIPos].getComponent(cc.Label).string = allScore[_i5].point;
                    this.bottomLabels[lastUIPos].color = this.greenColor;
                }
                lastUIPos++;
            } else {
                this.bottomLabels[_i5].getComponent(cc.Label).string = '';
            }
        }

        this.fristFrame.active = false;
        this.secondFrame.active = true;
    },
    Event_GameRecord: function Event_GameRecord(serverPack) {
        this.recordList = serverPack.detail.pSetRoomRecords;
        if (!this.needShowSecond) return;

        this.UpdateScendFrame();
    },

    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnPokerDataBtnClick: function OnPokerDataBtnClick(event) {
        var node = event.target;
        var parent = node.parent;
        var cardNode = parent.getChildByName('cardNode');
        if (cardNode.active) {
            node.rotation = 0;
            parent.height = parent.height - cardNode.height;
            cardNode.active = false;
        } else {
            node.rotation = 180;
            parent.height = parent.height + cardNode.height;
            cardNode.active = true;
        }
    },
    HideAllBtn: function HideAllBtn() {
        this.exitBtnNode.active = false;
        this.exitRoomBtnNode.active = false;
        this.goSecondBtnNode.active = false;
        this.wolaikaijuBtnNode.active = false;
        this.pingfenkaijuBtnNode.active = false;
        this.dayingjiakaijuBtnNode.active = false;
        this.continueBtnNode.active = false;
    },
    OnClick: function OnClick(btnName, btnNode) {
        //继续房间使用
        var GamePlayManager = require('GamePlayManager');
        var room = GamePlayManager.Room(GamePlayManager.playgame);
        var roomCfg = {};
        if (room) {
            roomCfg = room.GetRoomConfig();
            roomCfg.isContinue = true;
        }
        //继续房间使用

        if ('btn_close' == btnName) {
            if (!this.dataByZhanJi) {
                this.secondFrame.active = false;
                this.fristFrame.active = true;
            } else this.CloseForm();
        } else if ('btn_goScend' == btnName) {
            if (GamePlayManager.playgame == 'sss') {
                app.FormManager().ShowForm("UISSS_Record");
            } else {
                if (!this.room.GetGameRecord()) this.needShowSecond = true;else {
                    this.UpdateScendFrame();
                }
            }
        } else if (btnName == "btn_share") {
            this.Click_btn_Share();
        } else if (btnName == "btn_ddshare") {
            this.Click_btn_DDShare();
        } else if (btnName == "btn_xlshare") {
            this.Click_btn_XLShare();
        } else if (btnName == "btn_sharemore") {
            this.Click_btn_ShareMore();
        } else if (btnName == "btn_closeshare") {
            this.sharemore.active = false;
        } else if (btnName == "btn_sharelink") {
            this.Click_btn_Sharelink();
        } else if ('btn_continue' == btnName) {
            app.NetManager().SendPack('game.CGoldRoom', { practiceId: app.ShareDefine().practiceId }, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
            this.CloseForm();
        } else if ('btn_exitRoom' == btnName) {
            app.SceneManager().LoadScene("mainScene");
        } else if ('btn_exit' == btnName) {
            this.CloseForm();
        } else if (btnName == "btn_pingfenkaiju") {
            roomCfg.paymentRoomCardType = 1;
            if ('nn' == GamePlayManager.playgame) app.NetManager().SendPack("nn.CNNCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('zjh' == GamePlayManager.playgame) app.NetManager().SendPack("zjh.CZJHCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('sg' == GamePlayManager.playgame) app.NetManager().SendPack("sg.CSGCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('pdk' == GamePlayManager.playgame) app.NetManager().SendPack("pdk.CPDKCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('sss' == GamePlayManager.playgame) app.NetManager().SendPack("sss.CSSSCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('xyzb' == GamePlayManager.playgame) app.NetManager().SendPack("xyzb.CXYZBCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_wolaikaiju") {
            roomCfg.paymentRoomCardType = 0;
            if ('nn' == GamePlayManager.playgame) app.NetManager().SendPack("nn.CNNCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('zjh' == GamePlayManager.playgame) app.NetManager().SendPack("zjh.CZJHCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('sg' == GamePlayManager.playgame) app.NetManager().SendPack("sg.CSGCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('pdk' == GamePlayManager.playgame) app.NetManager().SendPack("pdk.CPDKCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('sss' == GamePlayManager.playgame) app.NetManager().SendPack("sss.CSSSCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('xyzb' == GamePlayManager.playgame) app.NetManager().SendPack("xyzb.CXYZBCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else if (btnName == "btn_dayingjiakaiju") {
            roomCfg.paymentRoomCardType = 2;
            if ('nn' == GamePlayManager.playgame) app.NetManager().SendPack("nn.CNNCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('zjh' == GamePlayManager.playgame) app.NetManager().SendPack("zjh.CZJHCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('sg' == GamePlayManager.playgame) app.NetManager().SendPack("sg.CSGCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('pdk' == GamePlayManager.playgame) app.NetManager().SendPack("pdk.CPDKCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('sss' == GamePlayManager.playgame) app.NetManager().SendPack("sss.CSSSCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));else if ('xyzb' == GamePlayManager.playgame) app.NetManager().SendPack("xyzb.CXYZBCreateRoom", roomCfg, function () {}, this.FailCreate.bind(this));
        } else {
            this.ErrLog("OnClick(%s) not find btnName", btnName);
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
    Click_btn_ShareMore: function Click_btn_ShareMore() {
        var active = this.sharemore.active;
        if (active == true) {
            this.sharemore.active = false;
        } else {
            this.sharemore.active = true;
        }
    },
    FailCreate: function FailCreate(serverPack) {
        if (serverPack['Msg'].indexOf('RoomCard need roomCard') > -1) {
            var desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
            app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
            app.FormManager().ShowForm("UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc);
            return;
        } else {
            this.ErrLog("FailCreate Room Msg:(%s)", serverPack.Msg);
        }
    },
    OnSuccess: function OnSuccess(serverPack) {
        console.log('OnSuccess serverPack', serverPack);
        var roomID = serverPack.roomID;
        var GamePlayManager = require('GamePlayManager');
        if ('sss' == GamePlayManager.playgame) {
            app.NetManager().SendPack('sss.CSSSGetRoomInfo', { "roomID": roomID });
        } else if ('nn' == GamePlayManager.playgame) {
            app.NetManager().SendPack('nn.CNNGetRoomInfo', { "roomID": roomID });
        } else if ('zjh' == GamePlayManager.playgame) {
            app.NetManager().SendPack('zjh.CZJHGetRoomInfo', { "roomID": roomID });
        } else if ('sg' == GamePlayManager.playgame) {
            app.NetManager().SendPack('sg.CSGGetRoomInfo', { "roomID": roomID });
        } else if ('pdk' == GamePlayManager.playgame) {
            app.NetManager().SendPack('pdk.CPDKGetRoomInfo', { "roomID": roomID });
        } else if ('xyzb' == GamePlayManager.playgame) {
            app.NetManager().SendPack('xyzb.CXYZBGetRoomInfo', { "roomID": roomID });
        } else if ('wsk' == GamePlayManager.playgame) {
            app.NetManager().SendPack('wsk.CWSKGetRoomInfo', { "roomID": roomID });
        }
        this.CloseForm();
        // app.ShareDefine().practiceId = this.practiceId;
    },

    OnEnterRoomFailed: function OnEnterRoomFailed(serverPack) {
        app.SceneManager().LoadScene("mainScene");
        console.log('OnEnterRoomFailed serverPack', serverPack);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ("goBuyCard" == msgID) {
            var clientConfig = app.Client.GetClientConfig();
            if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return;
            app.FormManager().ShowForm("UIStore");
            return;
        }
    }
});

cc._RF.pop();