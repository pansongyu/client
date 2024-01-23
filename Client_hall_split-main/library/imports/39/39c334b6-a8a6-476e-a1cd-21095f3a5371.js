"use strict";
cc._RF.push(module, '39c33S2qKZHbqHNIQlfOlNx', 'UIClubMain_2');
// script/ui/club_2/UIClubMain_2.js

"use strict";

/*
皮肤界面
 */
var app = require("app");

cc.Class({
    extends: require("UIClubMainBase"),

    properties: {
        roomBg: [cc.SpriteFrame],
        roomBg_zhongzhi_green: [cc.SpriteFrame],
        roomBg_zhongzhi_blue: [cc.SpriteFrame],

        defaultHead: cc.Prefab,
        left_on: cc.SpriteFrame,
        left_off: cc.SpriteFrame,
        clubBg: [cc.SpriteFrame],
        icon_signal: [cc.SpriteFrame],
        btn_outRaceSprite: [cc.SpriteFrame],
        zhuozi: [cc.Prefab],
        zhuozi_xingyun_puke: [cc.Prefab],
        zhuozi_xingyun: [cc.Prefab],

        zhuozi_zhongzhi: [cc.Prefab],

        table_majiang_xinyung: [cc.SpriteFrame],
        table_puke_xinyung: [cc.SpriteFrame],
        table_dazhuo_xinyung: [cc.SpriteFrame],
        icon_benquan: cc.Prefab
    },
    OnCreateInit: function OnCreateInit() {
        this.left = this.node.getChildByName("left_main");
        this.left_layout = this.left.getChildByName("mark").getChildByName("layout");
        this.clubDemo = this.left.getChildByName("mark").getChildByName("btn_demo");

        this.mark = this.node.getChildByName("right_main").getChildByName("mark");
        this.right_layout = this.mark.getChildByName("view").getChildByName("layout");
        this.roomDemo = this.mark.getChildByName("demo");

        this.clubName = this.node.getChildByName("top").getChildByName("clubName").getComponent(cc.Label);
        this.clubId = this.node.getChildByName("top").getChildByName("clubId").getComponent(cc.Label);

        this.page_tip = this.node.getChildByName("right_main").getChildByName("page");
        this.page_demo = this.node.getChildByName("right_main").getChildByName("page_demo");

        this.bg_signal = this.node.getChildByName("top").getChildByName("img_bjl_wifi").getChildByName("bg_signal");
        this.lb_signal = this.node.getChildByName("top").getChildByName("img_bjl_wifi").getChildByName("lb_signal").getComponent(cc.Label);

        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.clubDemo.active = false;
        this.roomDemo.active = false;
        this.discountType = [];
        //this.RegEvent("OnClubPlayerNtf", this.Event_PlayerNtf);
        this.RegEvent('OnAllClubData', this.Event_AllClubDataNtf);

        this.RegEvent('LoadClub', this.Event_LoadClub);

        this.WeChatManager = app.WeChatManager();
        this.SDKManager = app.SDKManager();
        this.RegEvent("ChangeRankedInfo", this.ChangeRankedInfo, this);
        this.RegEvent("OnClubRoomData", this.Event_InitClubRoom, this);
        this.RegEvent("OnRoomStateChange", this.Event_RoomStatusChange, this);
        this.RegEvent("OnRoomPlayerChange", this.Event_RoomPlayerChange, this);
        this.RegEvent("OnRoomSetChange", this.Event_RoomSetChange, this);
        // this.RegEvent("OnRoomStartChange", this.Event_RoomStartChange, this);
        this.RegEvent("OnClubRoomCardNtf", this.Event_ClubCardNtf, this);
        this.RegEvent("OnClubPlayerNtf", this.Event_ClubPlayerNtf, this);

        this.RegEvent("OnDiamondsNotEnough", this.Event_OnDiamondsNotEnough, this);

        this.RegEvent("OnRefreshRoomList", this.Event_RefreshRoomList, this);

        this.RegEvent("OnUnionSportsPoint", this.Event_UnionSportsPoint, this);

        this.RegEvent("OnPromotionLevelPowerChange", this.Event_PromotionLevelPowerChange, this);

        this.RegEvent("EvtSpeedTest", this.OnEvent_SpeedTest, this);
        this.RegEvent("OnClubPlayerNtfToManager", this.Event_ClubPlayerNtfToManager, this);
        this.RegEvent("OnUnionMatchState", this.Event_UnionMatchState, this);
        this.RegEvent("OnUnionStateChange", this.Event_UnionStateChange, this);
        this.RegEvent("OnOutSportsPoint", this.Event_OutSportsPoint, this);
        this.RegEvent("OnSportsPointWarning", this.Event_SportsPointWarning, this);
        this.RegEvent("CodeError", this.Event_CodeError, this);
        this.RegEvent("ReJoin", this.Event_ReJoin, this);
        this.RegEvent("OutRoom", this.Event_OutRoom, this);
        this.mark.on(cc.Node.EventType.TOUCH_START, this.OnTouch, this);
        this.mark.on(cc.Node.EventType.TOUCH_END, this.OnTouch, this);
        this.mark.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouch, this);
        this.mark.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouch, this);
        var roomScrollView = this.node.getChildByName("right_main").getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-right', this.GetNextRoomPage, this);
    },
    Event_UnionMatchState: function Event_UnionMatchState(event) {
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        if (event.clubId != this.nowClubID || event.unionId != this.unionId || event.pid != selfPid) {
            return;
        }
        if (event.operate == 0) {
            //同意
            if (event.type == 2) {
                //退赛
                app.SysNotifyManager().ShowSysMsg('赛事管理已同意您的退赛申请');
            } else if (event.type == 3) {
                //重赛
                app.SysNotifyManager().ShowSysMsg('赛事管理已同意您的复赛申请');
            }
        } else {
            //拒绝
            if (event.type == 2) {
                //退赛
                app.SysNotifyManager().ShowSysMsg('赛事管理拒绝您的退赛申请');
            } else if (event.type == 3) {
                //重赛
                app.SysNotifyManager().ShowSysMsg('赛事管理拒绝您的复赛申请');
            }
        }
        //根据状态显示赛事状态按钮文字
        var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
        var lbBtnName = unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label);
        if (event.matchState == 1) {
            //比赛进行中
            lbBtnName.string = "我要退赛";
            unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 1;
            unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 0;
        } else {
            //退赛申请中
            lbBtnName.string = "重赛中";
            unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 0;
            unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 1;
        }
    },
    SendPackUnionApply: function SendPackUnionApply() {
        var self = this;
        var sendPack = app.ClubManager().GetUnionSendPackHead();
        app.NetManager().SendPack('union.CUnionApply', sendPack, function (serverPack) {
            //根据状态显示赛事状态按钮文字
            var unionNode = self.node.getChildByName('bottom').getChildByName('unionNode');
            var lbBtnName = unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label);
            if (lbBtnName.string == "我要退赛") {
                app.SysNotifyManager().ShowSysMsg('您已申请退赛，当前无法进行比赛，请取消退赛申请或联系赛事举办方');
            } else if (lbBtnName.string == "重赛中") {
                app.SysNotifyManager().ShowSysMsg('您的重赛申请等待审批中，请联系赛事举办方');
            }
            if (serverPack == 1) {
                //比赛进行中
                lbBtnName.string = "我要退赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 1;
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 0;
            } else {
                //退赛申请中
                lbBtnName.string = "重赛中";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 0;
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 1;
            }
        }, function (error) {});
    },
    //需要重写
    CheckSkinType: function CheckSkinType(clubData) {
        if (clubData.unionId > 0) {
            //必须是赛事才有此功能
            var ClubNewCuntom = cc.sys.localStorage.getItem("ClubNewCuntom");
            if (ClubNewCuntom != "1") {
                //玩家没有自己设置
                if (clubData.skinTable > -1) {
                    cc.sys.localStorage.setItem("ClubNewTb", clubData.skinTable); //将盟主设置的赋值给玩家
                }
                if (clubData.skinBackColor > -1) {
                    cc.sys.localStorage.setItem("ClubNewBg", clubData.skinBackColor); //将盟主设置的赋值给玩家
                    this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.clubBg[clubData.skinBackColor];
                }
            }
        }
        if (clubData.skinType != 2) {
            app.FormManager().CloseAllClubForm();
            app.ClubManager().ShowClubFrom();
            // app.SysNotifyManager().ShowSysMsg("盟主切换了赛事皮肤，请重新打开房间列表界面", [], 4);
        }
    },
    OnShow: function OnShow() {
        this.isRejoin = false;
        this.joining = false;
        //分页加载变量
        var last_club_data = app.ClubManager().GetLastClubData();
        if (last_club_data != null) {
            this.nowClubID = last_club_data.club_data.id;
        } else {
            var clubData = app.ClubManager().GetClubData();
            this.nowClubID = clubData[0].id;
        }

        this.ScrollDataPage = 1;
        cc.sys.localStorage.setItem('club_moban', 2);
        if (!this.nowClubID) {
            this.nowClubID = -1;
        }
        this.ShowRoomKeyList = [];
        this.CreateRoomKeyList = [];
        this.FormManager.ShowForm("UINoticeBar");
        this.FormManager.CloseForm("bottom");
        this.roomList = [];
        this.DestroyAllChildren(this.left_layout);
        this.DestroyAllChildren(this.right_layout);
        this.left.active = false;
        var clubBg = cc.sys.localStorage.getItem("ClubNewBg");
        if (clubBg == null || typeof clubBg == "undefined") {
            cc.sys.localStorage.setItem("ClubNewBg", "4");
            clubBg = 4;
        }
        this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.clubBg[clubBg];
        var that = this;
        var isToggleHideRoom = cc.sys.localStorage.getItem('isToggleHideRoom');
        if (isToggleHideRoom == "1") {
            this.node.getChildByName('top').getChildByName('ToggleHideRoom').getComponent(cc.Toggle).isChecked = true;
        } else {
            this.node.getChildByName('top').getChildByName('ToggleHideRoom').getComponent(cc.Toggle).isChecked = false;
        }
        this.inRoom = false;

        this.saixuantype = "game";
        this.saixuanid = -1;

        if (app.ClubManager().GetIsLoadClub() == false) {
            app.ClubManager().SendReqClubData(); //无加载亲友圈重新加载
        } else {
            this.UpdateClubList(); //已经加载亲友圈无需再加载
        }
        this.CheckInRoom();
        app.LocationOnStartMgr().OnGetLocation();
    },
    Event_InitClubRoom: function Event_InitClubRoom(serverPack) {
        if (serverPack.clubId != this.nowClubID) {
            console.log("serverPack clubId:" + serverPack.clubId + ",nowClubID:" + this.nowClubID);
            return;
        }
        var beginTable = 0;
        this.roomList = [];
        this.roomKeyList = [];
        for (var i = 0; i < serverPack.roomList.length; i++) {
            if (this.roomKeyList.indexOf(serverPack.roomList[i].roomKey) > -1) {
                continue; //分包服务端可能下发两个房间。这边过过重处理
            }
            this.roomKeyList.push(serverPack.roomList[i].roomKey);
            serverPack.roomList[i].posList = [];
            if (serverPack.roomList[i].setId > 0) {
                if (beginTable >= this.tableNum && this.tableNum > 0) {
                    continue;
                }
                this.roomList.push(serverPack.roomList[i]);
                beginTable++;
            } else {
                this.roomList.push(serverPack.roomList[i]);
            }
        }
        //初始化出空节点，然后根据桌子的X值来动态渲染
        this.ShowRoomKeyList = [];
        this.CreateRoomKeyList = [];
        this.InitNullTable(this.roomList);
    },
    ChangeRankedInfo: function ChangeRankedInfo(clubData) {
        //中至排行榜开关
        this.rankedOpenZhongZhi = clubData.rankedOpenZhongZhi;
        this.rankedOpenEntryZhongZhi = clubData.rankedOpenEntryZhongZhi;
        var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
        unionNode.getChildByName("btn_paihangbang").active = this.unionPostType > 0 || clubData.rankedOpenEntryZhongZhi > 0;
    },
    Event_LoadClub: function Event_LoadClub(clubData) {
        //let clubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
        if (!clubData) {
            app.SysNotifyManager().ShowSysMsg('该亲友圈已解散或您已退出，点击前往查看更多亲友圈');
            var clubDatas = app.ClubManager().GetClubData();
            if (clubDatas.length == 0) {
                this.FormManager.ShowForm("ui/club/UIClubNone");
            } else {
                this.FormManager.ShowForm("ui/club/UIClubList");
            }
            this.CloseForm();
            return;
        }
        var cityInfo = this.selectCityConfig[clubData.cityId];
        this.node.getChildByName("top").getChildByName("lb_cityName").getComponent(cc.Label).string = cityInfo.Name;

        this.clubName.string = clubData.name;
        this.clubId.string = "ID:" + clubData.clubsign;
        this.nowClubID = clubData.id;
        this.nowUnionID = clubData.unionId;
        this.nowCLubSign = clubData.clubsign;
        this.nowClubName = clubData.name;

        app.ClubManager().SetUnionSendPackHead(clubData.unionId, clubData.id);
        app.ClubManager().SetLastClubData(clubData.id, clubData.clubsign, clubData.name, clubData.showUplevelId, clubData.showClubSign);
        this.Event_RefreshRoomList(); //加载房间
        this.isShowClubSign = clubData.showClubSign;
        this.showLostConnect = clubData.showLostConnect;

        this.CheckSkinType(clubData);
        this.tableNum = clubData.tableNum;
        this.myisminister = clubData.minister;
        this.myisPartner = clubData.promotion;
        this.levelPromotion = clubData.levelPromotion; //大于0是推广员
        this.isPromotionManage = clubData.isPromotionManage; //推官员管理
        this.promotionManagePid = clubData.promotionManagePid;
        this.sort = clubData.sort;
        this.unionId = clubData.unionId;
        this.unionType = clubData.unionType;
        this.unionPostType = -1;
        this.unionName = "";
        this.unionSign = -1;
        this.gameIdList = clubData.gameIdList;
        this.sportsDoubleList = clubData.sportsDoubleList;

        //中至排行榜开关
        this.rankedOpenZhongZhi = clubData.rankedOpenZhongZhi;
        this.rankedOpenEntryZhongZhi = clubData.rankedOpenEntryZhongZhi;
        /**
        * 踢人（0:不允许,1:允许）
        */
        this.kicking = clubData.kicking;
        /**
        * 从属修改（0:不允许,1:允许）
        */
        this.modifyValue = clubData.modifyValue;
        /**
        * 显示分成（0:不允许,1:允许）
        */
        this.showShare = clubData.showShare;
        /**
        * 是否能邀请玩家（0:不允许,1:允许）
        */
        this.invite = clubData.invite;

        //中至排行榜开关
        this.rankedOpenZhongZhi = clubData.rankedOpenZhongZhi;
        this.rankedOpenEntryZhongZhi = clubData.rankedOpenEntryZhongZhi;

        var self = this;
        var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
        var moreNode = this.node.getChildByName('top').getChildByName('right_btn').getChildByName('moreNode');
        moreNode.getChildByName('childMore').getChildByName('btn_findroom').active = true;
        moreNode.getChildByName('childMore').getChildByName('btn_caseSprots').active = false;
        if (this.unionId > 0) {
            this.InitLeftGameBtn(clubData.gameIdList);
            this.unionName = clubData.unionName;
            this.ownerClubName = clubData.ownerClubName;
            this.unionPostType = clubData.unionPostType;
            /*unionNode.getChildByName("btn_unionRoomList").active = false;
            if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
                unionNode.getChildByName("btn_unionRoomList").active = true;
            }*/
            if (this.unionPostType == app.ClubManager().UNION_MANAGE || this.unionPostType == app.ClubManager().UNION_CREATE) {
                //unionNode.getChildByName("btn_unionRoomList").active = true;
                var allSelectCityData = app.HeroManager().GetCurSelectCityData();
                var curUserCityId = allSelectCityData[0]['selcetId'];
                if (clubData.cityId != curUserCityId) {
                    //如果是联盟的盟主或者管理需要切换到对应的城市
                    app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": clubData.cityId }, function (event) {
                        app.Client.allGameIdFormServer = event.split(",");
                        var curSelectGameList = app.Client.GetAllGameId();
                        var argDict = {
                            "gameList": curSelectGameList
                        };

                        app.HeroManager().UpdateCity(clubData.cityId);
                        cc.sys.localStorage.setItem("myCityID", clubData.cityId);

                        app.Client.OnEvent("ShowGameListByLocation", argDict);
                        app.SysNotifyManager().ShowSysMsg('已为您切换到当前赛事所在的城市:[' + cityInfo.Name + "]", [], 3);
                    }, function (event) {
                        console.log("获取游戏id失败");
                    });
                }
            }
            unionNode.getChildByName("btn_paihangbang").active = this.unionPostType > 0 || clubData.rankedOpenEntryZhongZhi > 0;
            this.unionSign = clubData.unionSign;
            unionNode.active = true;
            var sportsPointStr = clubData.sportsPoint;
            if (clubData.sportsPoint >= 1000000) {
                sportsPointStr = (clubData.sportsPoint / 10000).toFixed(1).toString() + '万';
            }
            unionNode.getChildByName('img_bjl').getChildByName('lb_pl').getComponent(cc.Label).string = sportsPointStr;
            if (clubData.unionType == 1) {
                //中至的皮肤
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_4').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_3').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').getComponent(cc.Label).string = clubData.eliminatePoint;
            } else if (typeof clubData.personalSportsPointWarning == "undefined") {
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_4').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_3').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').getComponent(cc.Label).string = clubData.outSportsPoint;
            } else {
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_4').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_3').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').getComponent(cc.Label).string = clubData.personalSportsPointWarning;
            }
            //服务端下发结束的时间，转成倒计时
            this.endRoundTime = clubData.endRoundTime;
            var endRoundTimeStr = app.ServerTimeManager().GetCDTimeStringBySec(this.endRoundTime, app.ShareDefine().DayHourMinuteSecond);
            unionNode.getChildByName('img_bjl').getChildByName('lb_raceTime').getComponent(cc.Label).string = endRoundTimeStr;
            //根据状态显示赛事状态按钮文字
            if (clubData.unionState == 1) {
                //比赛进行中
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label).string = "我要退赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 1;
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 0;
            } else {
                //退赛申请中
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label).string = "重赛中";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 0;
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 1;
            }
            if (this.unionPostType == app.ClubManager().UNION_CREATE) {
                //创建者无法退赛
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label).string = "我要退赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).interactable = 1;
                unionNode.getChildByName("btn_outRace").getComponent(cc.Button).enableAutoGrayEffect = 0;
                unionNode.getChildByName("btn_outRace").active = true;
            } else {
                unionNode.getChildByName("btn_outRace").active = true;
            }
            unionNode.getChildByName("btn_outRace").active = true;
            //是否开启保险箱功能
            if (clubData.caseStatus > 0) {
                moreNode.getChildByName('childMore').getChildByName('btn_caseSprots').active = true;
            }
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_sportsPointMsg').active = true;
            this.ShowUnionTip();
            this.ShowUnionRankTip(clubData);
            //判断赛事是否停用
            this.ShowUnionStateType(clubData.unionStateType);
        } else {
            unionNode.active = false;
            unionNode.getChildByName("btn_paihangbang").active = false;
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_sportsPointMsg').active = false;
            if (this.myisminister == app.ClubManager().Club_MINISTER_MGR || this.myisminister == app.ClubManager().Club_MINISTER_MGRSS || this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
                var _allSelectCityData = app.HeroManager().GetCurSelectCityData();
                var _curUserCityId = _allSelectCityData[0]['selcetId'];
                if (clubData.cityId != _curUserCityId) {
                    //如果是亲友圈的圈主或者管理需要切换到对应的城市
                    app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": clubData.cityId }, function (event) {
                        app.Client.allGameIdFormServer = event.split(",");
                        var curSelectGameList = app.Client.GetAllGameId();
                        var argDict = {
                            "gameList": curSelectGameList
                        };

                        app.HeroManager().UpdateCity(clubData.cityId);
                        cc.sys.localStorage.setItem("myCityID", clubData.cityId);

                        app.Client.OnEvent("ShowGameListByLocation", argDict);
                        app.SysNotifyManager().ShowSysMsg('已为您切换到当前亲友圈所在的城市:[' + cityInfo.Name + "]", [], 3);
                    }, function (event) {
                        console.log("获取游戏id失败");
                    });
                }
            }
        }
        if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').active = true;
            //moreNode.getChildByName('childMore').getChildByName('btn_control').active=true;
            //moreNode.getChildByName('childMore').getChildByName('btn_control').active=false;
            moreNode.getChildByName('childMore').getChildByName('btn_weixin').active = true;
            if (this.unionId > 0) {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_roomlist').active = false;
                moreNode.getChildByName('childMore').getChildByName('btn_roomManger').active = false;
            } else {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_roomlist').active = true;
                moreNode.getChildByName('childMore').getChildByName('btn_roomManger').active = true;
            }
            //赛事按钮仅圈主可见
            if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER || this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_union').active = true;
            } else {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_union').active = false;
            }
            moreNode.getChildByName('childMore').getChildByName('btn_jinzhitongzhuo').active = true;
            moreNode.getChildByName('childMore').getChildByName('btn_message').active = true;
            moreNode.active = true;
        } else {
            if (this.levelPromotion > 0 || this.isPromotionManage > 0) {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').active = true;
            } else {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').active = false;
            }

            //moreNode.getChildByName('childMore').getChildByName('btn_control').active=true;
            //moreNode.getChildByName('childMore').getChildByName('btn_control').active=false;
            moreNode.getChildByName('childMore').getChildByName('btn_weixin').active = false;
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_roomlist').active = false;
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_union').active = false;
            moreNode.getChildByName('childMore').getChildByName('btn_roomManger').active = false;
            moreNode.getChildByName('childMore').getChildByName('btn_jinzhitongzhuo').active = false;
            moreNode.getChildByName('childMore').getChildByName('btn_message').active = false;
            moreNode.active = true;
        }
        moreNode.getChildByName('childMore').getChildByName('btn_control').active = true; //this.myisminister== app.ClubManager().Club_MINISTER_CREATER;
        // moreNode.getChildByName('childMore').getChildByName('btn_roomManger').active=true;
        //单级推广员
        if (this.myisPartner == app.ClubManager().Club_PARTNER_ONE || this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            //    moreNode.getChildByName('childMore').getChildByName('btn_promoterOld').active=true;
            moreNode.getChildByName('childMore').getChildByName('btn_promoterOld').active = false;
        } else {
            moreNode.getChildByName('childMore').getChildByName('btn_promoterOld').active = false;
        }
        //多级推广员
        if (this.isPromotionManage > 0 || this.levelPromotion > 0 || this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_promoter').active = true;
        } else {
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_promoter').active = false;
        }
        //如果是合伙人并且是普通成员也要显示更多按钮
        if (this.myisPartner == app.ClubManager().Club_PARTNER_ONE || this.myisminister == app.ClubManager().Club_MINISTER_GENERAL) {
            moreNode.active = true;
            moreNode.getChildByName('childMore').getChildByName('btn_roomManger').active = false;
        }
        //玩家列表是否存在请求未处理
        if (clubData.existApply) {
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').getChildByName('img_hd').active = true;
        } else {
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').getChildByName('img_hd').active = false;
        }
        //if (this.unionId > 0) {
        if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL || this.isPromotionManage > 0 || this.levelPromotion > 0) {
            moreNode.getChildByName('childMore').getChildByName('btn_jinzhitongzhuo').active = true;
        } else {
            moreNode.getChildByName('childMore').getChildByName('btn_jinzhitongzhuo').active = false;
        }
        //}
    },
    InitLeftGameBtn: function InitLeftGameBtn() {
        var left_wanfa = this.node.getChildByName("left_wanfa");
        left_wanfa.getChildByName("btn_youxi").getChildByName("on").active = true;
        left_wanfa.getChildByName("btn_difen").getChildByName("on").active = true;
        this.ShowGameBtn();
        left_wanfa.active = true;
    },
    ShowGameBtn: function ShowGameBtn() {
        this.node.getChildByName("left_wanfa").getChildByName("btn_youxi").getChildByName("on").active = true;
        this.node.getChildByName("left_wanfa").getChildByName("btn_difen").getChildByName("on").active = false;
        var gameIdList = this.gameIdList;
        var layout = this.node.getChildByName("left_wanfa").getChildByName("mark").getChildByName("layout");
        layout.removeAllChildren();
        var demo = this.node.getChildByName("left_wanfa").getChildByName("btn_saixuan");
        var addquanbu = cc.instantiate(demo);
        addquanbu.getChildByName("lb_name").getComponent(cc.Label).string = "全部";
        addquanbu.getChildByName("on").getChildByName("lb_name").getComponent(cc.Label).string = "全部";
        addquanbu.getChildByName("on").active = true;
        addquanbu.saixuantype = 'game';
        addquanbu.saixuanid = -1; //全部筛选出来
        addquanbu.active = true;
        this.lastSaiXuanNode = addquanbu;
        layout.addChild(addquanbu);
        for (var i = 0; i < gameIdList.length; i++) {
            var add = cc.instantiate(demo);
            add.getChildByName("lb_name").getComponent(cc.Label).string = this.GameId2Name(gameIdList[i]);
            add.getChildByName("on").getChildByName("lb_name").getComponent(cc.Label).string = this.GameId2Name(gameIdList[i]);
            add.getChildByName("on").active = false;
            add.saixuantype = 'game';
            add.saixuanid = gameIdList[i]; //全部筛选出来
            add.active = true;
            layout.addChild(add);
        }
    },
    ShowDiFenBtn: function ShowDiFenBtn() {
        this.node.getChildByName("left_wanfa").getChildByName("btn_youxi").getChildByName("on").active = false;
        this.node.getChildByName("left_wanfa").getChildByName("btn_difen").getChildByName("on").active = true;
        var sportsDoubleList = this.sportsDoubleList;
        var layout = this.node.getChildByName("left_wanfa").getChildByName("mark").getChildByName("layout");
        layout.removeAllChildren();
        var demo = this.node.getChildByName("left_wanfa").getChildByName("btn_saixuan");
        var addquanbu = cc.instantiate(demo);
        addquanbu.getChildByName("lb_name").getComponent(cc.Label).string = "全部";
        addquanbu.getChildByName("on").getChildByName("lb_name").getComponent(cc.Label).string = "全部";
        addquanbu.getChildByName("on").active = true;
        addquanbu.saixuantype = 'difen';
        addquanbu.saixuanid = -1; //全部筛选出来
        addquanbu.active = true;
        layout.addChild(addquanbu);
        this.lastSaiXuanNode = addquanbu;
        for (var i = 0; i < sportsDoubleList.length; i++) {
            var add = cc.instantiate(demo);
            add.getChildByName("lb_name").getComponent(cc.Label).string = sportsDoubleList[i];
            add.getChildByName("on").getChildByName("lb_name").getComponent(cc.Label).string = sportsDoubleList[i];
            add.getChildByName("on").active = false;
            add.saixuantype = 'difen';
            add.saixuanid = sportsDoubleList[i]; //全部筛选出来
            add.active = true;
            layout.addChild(add);
        }
    },
    UpdateClubList: function UpdateClubList() {
        this.DestroyAllChildren(this.left_layout);
        this.clubDatas = app.ClubManager().GetClubData();
        for (var i = 0; i < this.clubDatas.length; i++) {
            if (this.nowClubID < 0) {
                this.nowClubID = this.clubDatas[i].id;
            }
            var club = cc.instantiate(this.clubDemo);
            club.getChildByName('name').getComponent(cc.Label).string = this.clubDatas[i].name;
            club.getChildByName('quanzhu').getComponent(cc.Label).string = "竞技赛主:" + this.clubDatas[i].clubCreateName;
            club.active = true;
            club.name = "btn_club_" + this.clubDatas[i].id;
            club.clubId = this.clubDatas[i].id;
            club.clubSign = this.clubDatas[i].clubsign;
            club.clubName = this.clubDatas[i].name;
            club.unionId = this.clubDatas[i].unionId;
            this.left_layout.addChild(club);
        }
        //每次刷新判断下是否皮肤是当前界面，如果不是需要关闭重新打开
        app.ClubManager().SendReqClubDataById(this.nowClubID);
    },
    SaiXuanRoom: function SaiXuanRoom() {
        this.ShowRoomKeyList = [];
        this.CreateRoomKeyList = [];
        var saixuanRoomList = [];
        for (var i = 0; i < this.roomList.length; i++) {
            if (this.saixuantype == "game") {
                if (this.saixuanid == -1) {
                    saixuanRoomList.push(this.roomList[i]);
                } else {
                    if (this.roomList[i].gameId == this.saixuanid) {
                        saixuanRoomList.push(this.roomList[i]);
                    }
                }
            } else if (this.saixuantype == "difen") {
                if (this.saixuanid == -1) {
                    saixuanRoomList.push(this.roomList[i]);
                } else {
                    if (this.roomList[i].sportsDouble == this.saixuanid) {
                        saixuanRoomList.push(this.roomList[i]);
                    }
                }
            }
        }
        this.InitNullTable(saixuanRoomList);
        this.CheckRoomDisplay();
    },
    Event_RoomStatusChange: function Event_RoomStatusChange(serverPack) {
        if (typeof serverPack.clubId != "undefined" && serverPack.clubId != this.nowClubID) {
            return;
        }
        if (typeof serverPack.unionId != "undefined" && serverPack.unionId != this.unionId) {
            return;
        }
        var roomData = serverPack.roomInfoItem;
        var isClose = roomData.isClose;
        var length = this.roomList.length;
        var isChange = false;
        for (var i = 0; i < length; i++) {
            if (roomData.roomKey == this.roomList[i].roomKey) {
                if (isClose == true) {
                    this.RemoveRoomKey(roomData.roomKey);
                    this.roomList.splice(i, 1);
                    this.RemoveChildFromScroll(roomData);
                    break;
                } else {
                    this.roomList[i] = roomData;
                    isChange = true;
                    var childNode = this.GetRoomNode(roomData.roomKey);
                    if (childNode != null) {
                        if (childNode.isDisplay == true) {
                            this.UpdateChildInScroll(roomData);
                        } else {
                            this.SortAllRoom(childRoom, roomData);
                            this.CheckRoomDisplay();
                        }
                    }
                    break;
                }
            }
        }
        //新增一个房间
        if (isChange == false && isClose == false) {
            this.roomList.push(roomData);
            this.roomKeyList.push(roomData.roomKey);
            if (this.saixuanid == -1) {
                this.AddChildToScroll(roomData);
            } else if (this.saixuantype == "game" && this.saixuanid == roomData.gameId) {
                this.AddChildToScroll(roomData);
            } else if (this.saixuantype == "difen" && this.saixuanid == roomData.sportsDouble) {
                this.AddChildToScroll(roomData);
            }
        }
    },
    OnClose: function OnClose() {
        this.FormManager.CloseForm("ui/club/UIClubInRoom");
    },
    OnClick: function OnClick(btnName, btnNode) {
        if (this.joining == true) {
            return;
        }
        if ('btn_join' == btnName) {
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        } else if ("btn_close_left" == btnName) {
            this.left.active = false;
            this.node.getChildByName("left_wanfa").active = true;
        } else if ("btn_changeclub" == btnName) {
            this.left.active = true;
            this.node.getChildByName("left_wanfa").active = false;
        } else if ('btn_ksjr' == btnName) {
            if (this.inRoom == false) {
                this.FormManager.ShowForm("ui/club/UIQuickJoinRoom", this.nowClubID, this.unionId);
            } else {
                var curGameTypeStr = app.ShareDefine().GametTypeID2PinYin[this.inRoomInfo.gameId];
                app.Client.SetGameType(curGameTypeStr);
                this.FormManager.ShowForm("UIDownLoadGame", curGameTypeStr, 0, null, 0, 0, true);
            }
        } else if ('btn_shuaxin' == btnName) {
            this.Event_RefreshRoomList();
        } else if ('btn_huanpi' == btnName) {
            this.FormManager.ShowForm("ui/club/UIClubHuanPi");
        } else if (btnName.startsWith("join_room_")) {
            var roomKey = btnNode.roomKey; //房间号
            var gameName = btnNode.gameType.toLowerCase(); //游戏名
            app.Client.JoinRoomCheckSubGame(gameName, roomKey, this.nowClubID);
        } else if (btnName.startsWith("btn_club_")) {
            var clubId = btnNode.clubId;
            var unionId = btnNode.unionId;
            var CLubSign = btnNode.clubSign;
            var clubName = btnNode.clubName;
            // let skinType=btnNode.skinType;
            // let showUplevelId=btnNode.showUplevelId;
            // let showClubSign=btnNode.showClubSign;

            this.clubName.string = clubName;
            this.clubId.string = "ID:" + CLubSign;
            this.nowClubID = clubId;
            this.nowUnionID = unionId;
            this.unionId = unionId;
            this.nowCLubSign = CLubSign;
            this.nowClubName = clubName;

            this.RefreshLeft();
            //切换亲友圈把房间列表清空
            var roomScrollView = this.node.getChildByName("right_main").getChildByName("mark");
            roomScrollView.getComponent(cc.ScrollView).scrollToLeft();
            this.DestroyAllChildren(this.right_layout);

            app.ClubManager().SendReqClubDataById(this.nowClubID);
            this.roomList = [];
            //this.Event_RefreshRoomList();
            //app.ClubManager().SendGetAllRoom(this.nowClubID);//莫名请求2次，关闭一次
            //如果是比赛场，关闭桌边栏目
            if (this.unionId > 0) {
                this.left.active = false;
            }
        } else if (btnName == "btn_joinroom") {
            var self = this;
            if (this.joining == true) {
                this.scheduleOnce(function () {
                    self.joining = false;
                }, 1.5);
                return false;
            }
            this.joining = true;
            this.Click_btn_JiaRu(btnNode);
            this.scheduleOnce(function () {
                self.joining = false;
            }, 1.5);
        } else if (btnName == "btn_back") {
            //this.FormManager.ShowForm("bottom");
            if (this.FormManager.IsFormShow("UINewMain")) {
                this.FormManager.GetFormComponentByFormName("UINewMain").ShowAddClubSprite();
            } else {
                this.FormManager.ShowForm('UINewMain');
            }

            this.CloseForm();
        } else if (btnName == "btn_control") {
            if (this.unionId > 0) {
                app.SysNotifyManager().ShowSysMsg('请先退出赛事。');
                return;
            }
            if (this.nowClubID > 0) {
                var clubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
                this.myisminister = clubData.minister;
                this.FormManager.ShowForm('ui/club/UIClubManagerNew', this.nowClubID, this.unionId, this.myisminister);
                // if(this.myisminister>0){
                //     this.FormManager.ShowForm('ui/club/UIClubManager',this.nowClubID,'memberlist');
                // }else{
                //     this.FormManager.ShowForm('ui/club/UIClubManager',this.nowClubID);
                // }
            } else {
                app.SysNotifyManager().ShowSysMsg('您尚未加入任何亲友圈');
            }
        } else if ('btn_promoter' == btnName) {
            //多级推广员
            var newPath = 'ui/club/UIPromoterAllManager';
            if (this.unionType == 1) {
                newPath = 'ui/club_2/UIPromoterAllManager_2';
            }
            this.FormManager.ShowForm(newPath, this.nowClubID, this.unionId, this.levelPromotion, this.unionPostType, this.myisminister, this.unionName, this.unionSign, this.isPromotionManage, this.promotionManagePid, this.kicking, this.modifyValue, this.showShare, this.invite);
        } else if ('btn_promoterOld' == btnName) {
            //单级推广员

            app.SysNotifyManager().ShowSysMsg('小伙伴功能将于6月17号下线，请及时处理相关数据，推荐使用推广员功能');

            if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
                this.FormManager.ShowForm('ui/club/UIPromoterManager', this.nowClubID, this.unionId, this.myisPartner, this.unionPostType, this.myisminister, this.unionSign, "btn_PromoterList");
            } else {
                //如果只是合伙人身份
                this.FormManager.ShowForm('ui/club/UIPromoterManager', this.nowClubID, this.unionId, this.myisPartner, this.unionPostType, this.myisminister, this.unionSign, "btn_PromoterXiaShuList");
            }
        } else if (btnName == "btn_userlist") {
            if (this.nowClubID > 0) {
                this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').getChildByName('img_hd').active = false;
                this.FormManager.ShowForm('ui/club/UIClubUserList', this.nowClubID, this.unionId, this.unionName, this.unionSign);
            } else {
                app.SysNotifyManager().ShowSysMsg('您尚未加入任何亲友圈');
            }
        } else if (btnName == "btn_roomlist") {
            var nowClubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
            var data = {};
            data.gameList = app.Client.GetAllGameId();
            if (0 == data.gameList.length) {
                console.log('btn_createRoom Error Club Not Set GameList');
                return;
            }
            //let gameType = this.ShareDefine.GametTypeID2PinYin[data.gameList[0]];
            var _clubData = {};
            _clubData.clubId = this.nowClubID;
            _clubData.cityId = nowClubData.cityId;
            _clubData.roomKey = '0';
            _clubData.gameIndex = 0; //用来判断保存还是创建
            _clubData.enableGameType = ''; //不禁用的按钮
            data.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoom', data, '', _clubData);
        } else if (btnName == "btn_message") {
            var _clubData2 = app.ClubManager().GetClubDataByClubID(this.nowClubID);
            this.myisminister = _clubData2.minister;
            if (this.myisminister > 0) {
                this.FormManager.ShowForm('ui/club/UIClubMessage', this.nowClubID, this.unionId);
            } else {
                app.SysNotifyManager().ShowSysMsg('您不是管理员');
            }
        } else if (btnName == "btn_sportsPointMsg") {
            this.FormManager.ShowForm('ui/club/UIClubUserMessageNew', this.nowClubID, this.unionId, this.unionName, this.unionSign);
        } else if ('btn_create' == btnName) {
            this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
            var heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
            var limit = app.Config ? app.Config.clubCreateNum : 100;
            if (heroRoomCard >= limit) {
                app.FormManager().ShowForm('ui/club/UIClubCreate', this.allSelectCityData[0].selcetId);
            } else {
                app.SysNotifyManager().ShowSysMsg('钻石不足' + limit + '，无法创建亲友圈');
            }

            /*app.NetManager().SendPack("family.CPlayerCheckFamilyOwner",{},function(success){
                app.FormManager().ShowForm('ui/club/UIClubCreate', success);
            },function(error){
                //Not_Family_Owner(5113),//不是代理
                //NotExist_Family(5110), // 工会不存在
                app.SysNotifyManager().ShowSysMsg('不是代理或工会不存在，请联系客服');
            });*/
        } else if ('btn_wanfa' == btnName) {
            var wanfaNode = btnNode.parent.getChildByName('wanfa');
            if (wanfaNode.active == true) {
                wanfaNode.active = false;
            } else {
                wanfaNode.active = true;
            }
        } else if ('btn_detail' == btnName) {
            var sendPack = {
                "clubId": this.nowClubID,
                "roomKey": btnNode.parent.roomKey
            };
            var packName = "club.CClubRoomInfoDetails";
            var _self = this;
            if (this.unionId > 0) {
                sendPack.unionId = this.unionId;
                packName = "union.CUnionRoomInfoDetails";
            }
            app.NetManager().SendPack(packName, sendPack, function (serverPack) {
                _self.FormManager.ShowForm('ui/club/UIClubRoomJoin', serverPack);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取房间详细配置失败", [], 3);
            });
        } else if ('btn_findroom' == btnName) {
            this.FormManager.ShowForm('ui/club/UIClubFindRoom', this.nowClubID, this.unionId);
        } else if ('btn_caseSprots' == btnName) {
            var _sendPack = {
                "clubId": this.nowClubID,
                "unionId": this.unionId
            };
            var _self2 = this;
            app.NetManager().SendPack("club.CClubGetCaseSprotsInfo", _sendPack, function (serverPack) {
                _self2.FormManager.ShowForm('ui/club/UICaseSprots', serverPack, _self2.nowClubID);
            }, function () {});
        } else if ('btn_zhanji' == btnName || 'btn_unionRecord' == btnName) {
            if (this.nowClubID > 0) {
                var _clubData3 = app.ClubManager().GetClubDataByClubID(this.nowClubID);
                this.myisminister = _clubData3.minister;
                if (this.myisminister > 0) {
                    this.FormManager.ShowForm('ui/club/UIClubRecordList', this.nowClubID, this.unionId, this.nowClubName, this.unionPostType, this.myisminister);
                } else {
                    this.FormManager.ShowForm("ui/club/UIClubRecordUserDay", this.nowClubID, this.unionId);
                    // app.SysNotifyManager().ShowSysMsg('亲友圈战绩仅管理员可查看');
                }
            } else {
                app.SysNotifyManager().ShowSysMsg('您尚未加入任何亲友圈');
            }
        } else if (btnName == "btn_jiemian") {
            this.CloseForm();
            this.FormManager.ShowForm('ui/club/UIClub');
        } else if (btnName == "btn_more") {
            var childMore = this.node.getChildByName('top').getChildByName('right_btn').getChildByName('moreNode').getChildByName('childMore');
            childMore.active = !childMore.active;
            var moreNode = this.node.getChildByName('top').getChildByName('right_btn').getChildByName('moreNode');
            moreNode.getComponent(cc.Sprite).enabled = childMore.active;
        } else if (btnName == "btn_jinzhitongzhuo") {
            this.FormManager.ShowForm('ui/club/UIClubForbid', this.nowClubID);
        } else if (btnName == "btn_union") {
            if (this.unionId > 0) {
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    this.FormManager.ShowForm('ui/club_2/UIUnionManager_2', this.nowClubID, this.unionId, this.unionName, this.unionPostType, this.myisminister, this.unionSign);
                } else {
                    this.FormManager.ShowForm('ui/club/UIUnionManager', this.nowClubID, this.unionId, this.unionName, this.unionPostType, this.myisminister, this.unionSign);
                }
            } else {
                this.FormManager.ShowForm('ui/club/UIUnionNone', this.nowClubID);
            }
        } else if (btnName == "btn_unionRoomList") {
            if (this.unionId > 0) {
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    this.FormManager.ShowForm('ui/club_2/UIUnionManager_2', this.nowClubID, this.unionId, this.unionName, this.unionPostType, this.myisminister, this.unionSign, "btn_Wanfa");
                } else {
                    this.FormManager.ShowForm('ui/club/UIUnionManager', this.nowClubID, this.unionId, this.unionName, this.unionPostType, this.myisminister, this.unionSign, "btn_Wanfa");
                }
            } else {
                this.FormManager.ShowForm('ui/club/UIUnionNone', this.nowClubID);
            }
        } else if (btnName == "btn_outRace") {
            var btnNameStr = btnNode.getChildByName("lb_btnName").getComponent(cc.Label).string;
            if (btnNameStr == "我要退赛") {
                this.SetWaitForConfirm('MSG_OUT_RACE', app.ShareDefine().Confirm);
            } else {
                this.SendPackUnionApply();
            }
        } else if (btnName == "img_bjl") {
            if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion == 0) {
                //普通成员
                return;
            }
            if (this.unionId > 0) {
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    this.FormManager.ShowForm('ui/club_2/UIUnionManagerZhongZhi', this.nowClubID, this.unionId, this.unionName, this.unionPostType, this.myisminister, this.unionSign, this.levelPromotion);
                }
            }
        } else if (btnName == "btn_youxi") {
            this.ShowGameBtn();
        } else if (btnName == "btn_difen") {
            this.ShowDiFenBtn();
        } else if (btnName == "btn_saixuan") {
            this.saixuantype = btnNode.saixuantype;
            this.saixuanid = btnNode.saixuanid;
            this.SaiXuanRoom();
            this.lastSaiXuanNode.getChildByName("on").active = false;
            btnNode.getChildByName("on").active = true;
            this.lastSaiXuanNode = btnNode;
        } else if (btnName == "btn_paihangbang") {
            if (this.unionId > 0) {
                if (app.ClubManager().GetUnionTypeByLastClubData() == 1) {
                    this.FormManager.ShowForm('ui/club_2/UIUnionRankZhongZhi', this.nowClubID, this.unionId, this.unionName, this.unionPostType, this.myisminister, this.unionSign, this.levelPromotion, this.rankedOpenZhongZhi, this.rankedOpenEntryZhongZhi);
                }
            }
        } else {
            //this.left.active=false;
            /*this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active=true;
            this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active=false;*/
        }
    }
});

cc._RF.pop();