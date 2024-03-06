"use strict";
cc._RF.push(module, 'fd2faf3TetH6bMDCvpa8kBv', 'UIClubMainBase');
// script/ui/club/UIClubMainBase.js

"use strict";

var app = require("app");

var BaseClubMainForm = cc.Class({
    extends: require("BaseForm"),

    OnCreateInit: function OnCreateInit() {
        this.left = this.node.getChildByName("left_main");
        this.left_layout = this.left.getChildByName("mark").getChildByName("layout");
        this.clubDemo = this.left.getChildByName("mark").getChildByName("btn_demo");

        this.mark = this.node.getChildByName("right_main").getChildByName("mark");
        this.right_layout = this.mark.getChildByName("view").getChildByName("layout");
        this.roomDemo = this.mark.getChildByName("demo");

        this.fangka = this.node.getChildByName("bottom").getChildByName("fangka");
        this.fangkaLabel = this.fangka.getChildByName("label").getComponent(cc.Label);

        this.lb_name = this.node.getChildByName("bottom").getChildByName("userinfo").getChildByName("lb_name").getComponent(cc.Label);
        this.lb_id = this.node.getChildByName("bottom").getChildByName("userinfo").getChildByName("lb_id").getComponent(cc.Label);
        this.clubName = this.node.getChildByName("top").getChildByName("clubName").getComponent(cc.Label);
        this.clubId = this.node.getChildByName("top").getChildByName("clubId").getComponent(cc.Label);

        this.page_tip = this.node.getChildByName("right_main").getChildByName("page");
        this.page_demo = this.node.getChildByName("right_main").getChildByName("page_demo");

        this.bg_signal = this.node.getChildByName("top").getChildByName("img_bjl_wifi").getChildByName("bg_signal");
        this.lb_signal = this.node.getChildByName("top").getChildByName("img_bjl_wifi").getChildByName("lb_signal").getComponent(cc.Label);

        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.WeChatHeadImage1 = this.node.getChildByName('bottom').getChildByName('userinfo').getChildByName('head').getComponent("WeChatHeadImage");
        this.clubDemo.active = false;
        this.roomDemo.active = false;
        this.discountType = [];
        //this.RegEvent("OnClubPlayerNtf", this.Event_PlayerNtf);
        this.RegEvent('OnAllClubData', this.Event_AllClubDataNtf);

        this.RegEvent('LoadClub', this.Event_LoadClub);

        this.WeChatManager = app.WeChatManager();
        this.SDKManager = app.SDKManager();
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

        // let that=this;
        // cc.game.on(cc.game.EVENT_HIDE, function(event){
        //     that.left.active=true;
        //     that.node.getChildByName('bottom').getChildByName('btn_qhqyq').active=false;
        //     that.node.getChildByName('bottom').getChildByName('btn_ycqyq').active=true;
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function(event){
        //     that.left.active=false;
        //     that.node.getChildByName('bottom').getChildByName('btn_qhqyq').active=true;
        //     that.node.getChildByName('bottom').getChildByName('btn_ycqyq').active=false;
        // });

        var roomScrollView = this.node.getChildByName("right_main").getChildByName("mark").getComponent(cc.ScrollView);
        roomScrollView.node.on('scroll-to-right', this.GetNextRoomPage, this);
    },
    Event_CodeError: function Event_CodeError(event) {
        var code = event["Code"];
        if (code == this.ShareDefine.ErrorPassword) {
            //密码错误
            var dataDict = JSON.parse(event.Result.Msg);
            app.SysNotifyManager().ShowSysMsg('密码错误或已失效,请重新输入', [], 3);
            localStorage.setItem("password_" + dataDict.clubId + "_" + dataDict.tagId, "");
        }
    },
    //-----------------显示函数------------------
    OnShow: function OnShow() {
        var _this = this;

        this.isRejoin = false;
        this.joining = false;
        this.CheckRoomDisplayList = [];
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
        this.ShowUserInfo();
        this.FormManager.ShowForm("UINoticeBar");
        this.FormManager.CloseForm("bottom");
        this.roomList = [];
        //this.left_layout.removeAllChildren();
        //this.right_layout.removeAllChildren();
        this.DestroyAllChildren(this.left_layout);
        this.DestroyAllChildren(this.right_layout);
        //app.ClubManager().SendReqClubData();
        this.left.active = true;
        this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = false;
        this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = false;

        // this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active=true;
        // this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active=false;
        this.left.active = false;
        // this.node.getChildByName("left_wanfa").active=true;
        this.node.getChildByName("left_wanfa").active = false; //这两句是为了防止。左边的遮罩挡住进入房间的按钮。比较操蛋
        this.node.getChildByName('bottom').getChildByName('btn_qhwh').active = false;
        this.node.getChildByName('bottom').getChildByName('btn_qhwh').getChildByName('baocun').active = false;
        var clubBg = cc.sys.localStorage.getItem("ClubNewBg");
        if (clubBg == null || typeof clubBg == "undefined") {
            cc.sys.localStorage.setItem("ClubNewBg", "4");
            clubBg = 4;
        }
        this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.clubBg[clubBg];
        this.gameList = app.Client.GetAllGameId();
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
        // 
        var isToggleHideRoom = cc.sys.localStorage.getItem('isToggleHideRoom');
        if (isToggleHideRoom == "1") {
            this.node.getChildByName('top').getChildByName('ToggleHideRoom').getComponent(cc.Toggle).isChecked = true;
        } else {
            this.node.getChildByName('top').getChildByName('ToggleHideRoom').getComponent(cc.Toggle).isChecked = false;
        }
        this.inRoom = false;
        if (app.ClubManager().GetIsLoadClub() == false) {
            app.ClubManager().SendReqClubData(); //无加载亲友圈重新加载
        } else {
            this.UpdateClubList(); //已经加载亲友圈无需再加载
        }
        this.CheckInRoom();
        //親友圈顯示的時候定位一下
        app.LocationOnStartMgr().OnGetLocation();

        this.schedule(this.RunRoomDisplay, 0.5);
        this.scheduleOnce(function () {
            _this.Click_btn_qhwh();
        }, 0.2);
    },
    CheckInRoom: function CheckInRoom() {
        var self = this;
        app.NetManager().SendPack("room.CBaseRoomConfig", {}, function (event) {
            self.inRoom = true;
            self.inRoomInfo = event;
            self.FormManager.ShowForm("ui/club/UIClubInRoom", event);
        }, function (event) {
            console.log("没在房间");
        });
    },
    Event_OnDiamondsNotEnough: function Event_OnDiamondsNotEnough(event) {
        app.SysNotifyManager().ShowSysMsg(event.name + "钻石小于" + event.diamondsValue + ",请联系盟主圈主充值");
    },
    OnTouch: function OnTouch(event) {
        if ('touchstart' == event.type) {} else if ('touchend' == event.type || 'touchcancel' == event.type) {
            //滑动结束动。检测哪些节点需要渲染
            this.CheckRoomDisplay();
        } else if ('touchmove' == event.type) {}
    },
    GetDiscountTypeData: function GetDiscountTypeData(serverPack) {
        this.discountType = serverPack;
    },
    ChangeBg: function ChangeBg() {
        var clubBg = cc.sys.localStorage.getItem("ClubNewBg");
        if (clubBg == null || typeof clubBg == "undefined") {
            cc.sys.localStorage.setItem("ClubNewBg", "4");
            clubBg = 4;
        }
        console.log("ChangeBg clubBg:" + clubBg);
        this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.clubBg[clubBg];
    },
    ShowUserInfo: function ShowUserInfo() {
        var heroName = app.HeroManager().GetHeroProperty("name");
        this.lb_name.string = this.ComTool.GetBeiZhuName(heroID, heroName);
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var headImageUrl = app.HeroManager().GetHeroProperty("headImageUrl");
        this.lb_id.string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) });
        this.WeChatHeadImage1.OnLoad();
        this.WeChatHeadImage1.ShowHeroHead(heroID, headImageUrl);
    },
    Event_AllClubDataNtf: function Event_AllClubDataNtf() {
        this.UpdateClubList();
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
        var cityInfo = this.selectCityConfig[clubData.cityId] || { Name: "" };
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
        /*if(!cc.sys.isNative){
            this.tableNum=5;
        }*/
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
        var self = this;
        var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
        var moreNode = this.node.getChildByName('top').getChildByName('right_btn').getChildByName('moreNode');
        moreNode.getChildByName('childMore').getChildByName('btn_findroom').active = true;
        moreNode.getChildByName('childMore').getChildByName('btn_caseSprots').active = false;

        if (this.unionId > 0) {
            //获取比赛场缓存玩法本地存储ID
            var localStorage = cc.sys.localStorage;
            this.unionMyWanFa = localStorage.getItem("mywanfa_" + this.unionId + "_" + this.nowClubID);
            //隐藏亲友圈的按钮
            this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_qhwh').active = true;
            this.node.getChildByName("top").getChildByName("btn_changeclub").active = true;
            this.left.active = false;
            //获取比赛场缓存玩法本地存储ID
            this.unionName = clubData.unionName;
            this.ownerClubName = clubData.ownerClubName;
            this.unionPostType = clubData.unionPostType;
            unionNode.getChildByName("btn_unionRoomList").active = false;
            if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
                unionNode.getChildByName("btn_unionRoomList").active = true;
            }
            if (this.unionPostType == app.ClubManager().UNION_MANAGE || this.unionPostType == app.ClubManager().UNION_CREATE) {
                unionNode.getChildByName("btn_unionRoomList").active = true;
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
                unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = this.btn_outRaceSprite[1];
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(78, 78, 78);
            } else if (clubData.unionState == 2) {
                //复赛申请中
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label).string = "申请复赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = this.btn_outRaceSprite[0];
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(124, 64, 32);
            } else if (clubData.unionState == 3) {
                //退赛申请中
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.Label).string = "取消退赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = this.btn_outRaceSprite[0];
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(124, 64, 32);
            }
            if (this.unionPostType == app.ClubManager().UNION_CREATE) {
                //创建者无法退赛
                unionNode.getChildByName("btn_outRace").active = false;
            } else {
                unionNode.getChildByName("btn_outRace").active = true;
            }
            //是否开启保险箱功能
            // if (clubData.caseStatus > 0) {
            moreNode.getChildByName('childMore').getChildByName('btn_caseSprots').active = true;
            // }
            this.node.getChildByName('bottom').getChildByName('btn_shop').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_RoomMgr').active = false;
            this.node.getChildByName('bottom').getChildByName('fangka').active = false;
            this.node.getChildByName('bottom').getChildByName('userinfo').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_zhanji').active = false;
            this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_sportsPointMsg').active = true;
            this.ShowUnionTip();
            this.ShowUnionRankTip(clubData);
            //判断赛事是否停用
            this.ShowUnionStateType(clubData.unionStateType);
        } else {
            unionNode.active = false;
            this.left.active = false;
            this.node.getChildByName("top").getChildByName("btn_changeclub").active = false;
            this.node.getChildByName('bottom').getChildByName('btn_qhwh').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = true;
            this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = false;
            this.node.getChildByName('bottom').getChildByName('userinfo').active = true;
            this.node.getChildByName('bottom').getChildByName('btn_shop').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_RoomMgr').active = true;
            this.node.getChildByName('bottom').getChildByName('fangka').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_zhanji').active = true;
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
            if (this.unionId <= 0) {
                this.node.getChildByName('bottom').getChildByName('btn_RoomMgr').active = true;
                this.node.getChildByName('bottom').getChildByName('btn_zhanji').active = true;
            }
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
            this.node.getChildByName('bottom').getChildByName('btn_RoomMgr').active = false;
            // this.node.getChildByName('bottom').getChildByName('btn_zhanji').active=false;

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
    Event_RefreshRoomList: function Event_RefreshRoomList() {
        this.ScrollDataPage = 1;
        this.ShowRoomKeyList = [];
        this.CreateRoomKeyList = [];
        app.ClubManager().SendGetAllRoom(this.nowClubID);
    },
    Event_UnionSportsPoint: function Event_UnionSportsPoint(event) {
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        if (this.unionId > 0 && this.nowClubID == event.clubId && selfPid == event.pid) {
            if (event.sportsPoint >= 1000000) {
                event.sportsPoint = (event.sportsPoint / 10000).toFixed(1).toString() + '万';
            }
            this.node.getChildByName('bottom').getChildByName('unionNode').getChildByName('img_bjl').getChildByName('lb_pl').getComponent(cc.Label).string = event.sportsPoint;
        }
    },
    Event_PromotionLevelPowerChange: function Event_PromotionLevelPowerChange(event) {
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        if (this.nowClubID == event.clubId && selfPid == event.pid) {
            this.kicking = event.kicking;
            this.modifyValue = event.modifyValue;
            this.showShare = event.showShare;
            this.invite = event.invite;
            this.levelPromotion = event.levelPromotion;
        }
    },
    Event_ClubPlayerNtfToManager: function Event_ClubPlayerNtfToManager(event) {
        if (event.clubId != this.nowClubID) {
            return;
        }
        this.node.getChildByName('top').getChildByName('right_btn').getChildByName('btn_userlist').getChildByName('img_hd').active = true;
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
            unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = this.btn_outRaceSprite[1];
            unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
            unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(78, 78, 78);
        } else if (event.matchState == 2) {
            //复赛申请中
            lbBtnName.string = "申请复赛";
            unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = this.btn_outRaceSprite[0];
            unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
            unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(124, 64, 32);
        } else if (event.matchState == 3) {
            //退赛申请中
            lbBtnName.string = "取消退赛";
            unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = this.btn_outRaceSprite[0];
            unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
            unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(124, 64, 32);
        }
    },
    Event_UnionStateChange: function Event_UnionStateChange(event) {
        if (event.unionId == this.unionId) {
            if (event.stateType == 0) {
                this.endRoundTime = event.endRoundTime;
            }
            this.ShowUnionStateType(event.stateType);
        }
    },
    Event_OutSportsPoint: function Event_OutSportsPoint(event) {
        if (event.unionId == this.unionId) {
            var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
            unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').getComponent(cc.Label).string = event.outSports;
        }
    },
    Event_SportsPointWarning: function Event_SportsPointWarning(event) {
        if (event.unionId == this.unionId) {
            var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
            if (event.type == 0) {
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_4').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_3').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').getComponent(cc.Label).string = event.taoTaiValue;
            } else {
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_4').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').active = true;
                unionNode.getChildByName('img_bjl').getChildByName('lb_title_3').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_taotaifen').active = false;
                unionNode.getChildByName('img_bjl').getChildByName('lb_spWarning').getComponent(cc.Label).string = event.personalSportsPointWarning;
            }
        }
    },
    Event_InitClubRoom: function Event_InitClubRoom(serverPack) {
        if (serverPack.clubId != this.nowClubID) {
            console.log("serverPack clubId:" + serverPack.clubId + ",nowClubID:" + this.nowClubID);
            return;
        }
        var beginTable = 0;
        this.roomList = [];
        this.roomKeyList = [];
        var unionMyWanFa = this.MyUnionMyWanFaArray();
        for (var i = 0; i < serverPack.roomList.length; i++) {
            if (this.roomKeyList.indexOf(serverPack.roomList[i].roomKey) > -1) {
                continue; //分包服务端可能下发两个房间。这边过过重处理
            }
            this.roomKeyList.push(serverPack.roomList[i].roomKey);
            if (unionMyWanFa.length > 0 && unionMyWanFa.indexOf(serverPack.roomList[i].tagId.toString()) == -1) {
                continue;
            }
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
    GameType2Name: function GameType2Name(gameType) {
        var gameTypeID = this.ShareDefine.GametTypeNameDict[gameType];
        return this.ShareDefine.GametTypeID2Name[gameTypeID];
    },
    GameId2Name: function GameId2Name(gameId) {
        return this.ShareDefine.GametTypeID2Name[gameId];
    },
    GameId2PinYin: function GameId2PinYin(gameId) {
        return this.ShareDefine.GametTypeID2PinYin[gameId];
    },
    GetWanFa: function GetWanFa(gameType, gameCfg) {
        var wanfa = app.RoomCfgManager().WanFa(gameType, gameCfg);
        return wanfa;
    },
    isShowLiXian: function isShowLiXian(islixian) {
        //默认都不显示离线
        return false;
    },
    InitHead: function InitHead(node, playerNum, posList) {
        var clubTable = this.GetCLubTable();
        if (clubTable < 3) {
            node.getChildByName('head_layout').getChildByName('user1').active = false;
            node.getChildByName('head_layout').getChildByName('user2').active = false;
            node.getChildByName('head_layout').getChildByName('user3').active = false;
            node.getChildByName('head_layout').getChildByName('user4').active = false;
            var key = clubTable * 3;
            if (playerNum == 2) {
                node.getComponent(cc.Sprite).spriteFrame = this.roomBg[key + 0];
            } else if (playerNum == 3) {
                node.getComponent(cc.Sprite).spriteFrame = this.roomBg[key + 1];
            } else if (playerNum >= 4) {
                node.getComponent(cc.Sprite).spriteFrame = this.roomBg[key + 2];
            }
            for (var i = 0; i < posList.length; i++) {
                if (i > 3) {
                    break;
                }
                var heroID = posList[i]["pid"];
                if (heroID > 0) {
                    var name = posList[i]["name"];
                    var headImageUrl = posList[i]["headImageUrl"];
                    var usernode = node.getChildByName('head_layout').getChildByName('user' + (i + 1));
                    usernode.active = true;
                    usernode.getChildByName('name').getChildByName('lb').getComponent(cc.Label).string = name.substr(0, 4);
                    if (heroID > 0) {
                        var touxiang = usernode.getChildByName('mask').getChildByName('head');
                        this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                        var WeChatHeadImage = touxiang.getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                        //显示离线玩家
                        if (this.showLostConnect == 0) {
                            usernode.getChildByName('mask').getChildByName('lixian').active = this.isShowLiXian(posList[i].isLostConnect);
                        } else {
                            usernode.getChildByName('mask').getChildByName('lixian').active = false;
                        }
                        var benquan = usernode.getChildByName("benquan");
                        if (posList[i].clubID == this.nowClubID && this.isShowClubSign == true) {
                            if (benquan) {
                                benquan.active = true;
                            } else {
                                var addbenquan = cc.instantiate(this.icon_benquan);
                                addbenquan.name = "benquan";
                                usernode.addChild(addbenquan);
                            }
                        } else {
                            if (benquan) {
                                benquan.active = false;
                            }
                        }
                    }
                }
            }
        } else if (clubTable == 4) {
            //幸运的皮肤
            for (var _i = 1; _i <= 8; _i++) {
                //最多8人桌子
                var head = node.getChildByName('head_layout').getChildByName('user' + _i);
                if (head) {
                    head.active = false;
                }
            }
            for (var _i2 = 0; _i2 < posList.length; _i2++) {
                var _heroID = posList[_i2]["pid"];
                if (_heroID > 0) {
                    var _name = posList[_i2]["name"];
                    var _headImageUrl = posList[_i2]["headImageUrl"];
                    var _usernode = node.getChildByName('head_layout').getChildByName('user' + (_i2 + 1));
                    _usernode.active = true;
                    _usernode.getChildByName('name').getChildByName('lb').getComponent(cc.Label).string = _name.substr(0, 4);
                    if (_heroID > 0) {
                        var _touxiang = _usernode.getChildByName('mask').getChildByName('head');
                        this.WeChatManager.InitHeroHeadImage(_heroID, _headImageUrl);
                        var _WeChatHeadImage = _touxiang.getComponent("WeChatHeadImage");
                        _WeChatHeadImage.OnLoad();
                        _WeChatHeadImage.ShowHeroHead(_heroID, _headImageUrl);
                        //显示离线玩家
                        if (this.showLostConnect == 0) {
                            _usernode.getChildByName('mask').getChildByName('lixian').active = this.isShowLiXian(posList[_i2].isLostConnect);
                        } else {
                            _usernode.getChildByName('mask').getChildByName('lixian').active = false;
                        }
                        var _benquan = _usernode.getChildByName("benquan");
                        if (posList[_i2].clubID == this.nowClubID && this.isShowClubSign == true) {
                            if (_benquan) {
                                _benquan.active = true;
                            } else {
                                var _addbenquan = cc.instantiate(this.icon_benquan);
                                _addbenquan.name = "benquan";
                                _usernode.addChild(_addbenquan);
                            }
                        } else {
                            if (_benquan) {
                                _benquan.active = false;
                            }
                        }
                    }
                }
            }
        } else if (clubTable == 3) {
            for (var _i3 = 1; _i3 <= 8; _i3++) {
                //最多8人桌子
                var _head = node.getChildByName('head_layout').getChildByName('user' + _i3);
                if (_head) {
                    _head.active = false;
                }
            }

            for (var _i4 = 0; _i4 < posList.length; _i4++) {
                if (_i4 > 3) {
                    break;
                }
                var _heroID2 = posList[_i4]["pid"];
                if (_heroID2 > 0) {
                    var _name2 = posList[_i4]["name"];
                    var _headImageUrl2 = posList[_i4]["headImageUrl"];
                    var _usernode2 = node.getChildByName('head_layout').getChildByName('user' + (_i4 + 1));
                    _usernode2.active = true;
                    _usernode2.getChildByName('name').getChildByName('lb').getComponent(cc.Label).string = _name2.substr(0, 4);
                    if (_heroID2 > 0) {
                        var _touxiang2 = _usernode2.getChildByName('mask').getChildByName('head');
                        this.WeChatManager.InitHeroHeadImage(_heroID2, _headImageUrl2);
                        var _WeChatHeadImage2 = _touxiang2.getComponent("WeChatHeadImage");
                        _WeChatHeadImage2.OnLoad();
                        _WeChatHeadImage2.ShowHeroHead(_heroID2, _headImageUrl2);
                        //显示离线玩家
                        if (this.showLostConnect == 0) {
                            _usernode2.getChildByName('mask').getChildByName('lixian').active = this.isShowLiXian(posList[_i4].isLostConnect);
                        } else {
                            _usernode2.getChildByName('mask').getChildByName('lixian').active = false;
                        }
                        var _benquan2 = _usernode2.getChildByName("benquan");
                        if (posList[_i4].clubID == this.nowClubID && this.isShowClubSign == true) {
                            if (_benquan2) {
                                _benquan2.active = true;
                            } else {
                                var _addbenquan2 = cc.instantiate(this.icon_benquan);
                                _addbenquan2.name = "benquan";
                                _usernode2.addChild(_addbenquan2);
                            }
                        } else {
                            if (_benquan2) {
                                _benquan2.active = false;
                            }
                        }
                    }
                }
            }
        } else if (clubTable == 5 || clubTable == 6) {
            //中至的两套皮肤
            for (var _i5 = 1; _i5 <= 10; _i5++) {
                //最多8人桌子
                var _head2 = node.getChildByName('head_layout').getChildByName('user' + _i5);
                if (_head2) {
                    _head2.active = false;
                }
            }

            for (var _i6 = 0; _i6 < posList.length; _i6++) {
                if (_i6 > 3) {
                    break;
                }
                var _heroID3 = posList[_i6]["pid"];
                if (_heroID3 > 0) {
                    var _name3 = posList[_i6]["name"];
                    var _headImageUrl3 = posList[_i6]["headImageUrl"];
                    var _usernode3 = node.getChildByName('head_layout').getChildByName('user' + (_i6 + 1));
                    _usernode3.active = true;
                    _usernode3.getChildByName('name').getChildByName('lb').getComponent(cc.Label).string = _name3.substr(0, 4);
                    if (_heroID3 > 0) {
                        var _touxiang3 = _usernode3.getChildByName('mask').getChildByName('head');
                        this.WeChatManager.InitHeroHeadImage(_heroID3, _headImageUrl3);
                        var _WeChatHeadImage3 = _touxiang3.getComponent("WeChatHeadImage");
                        _WeChatHeadImage3.OnLoad();
                        _WeChatHeadImage3.ShowHeroHead(_heroID3, _headImageUrl3);
                        //显示离线玩家
                        if (this.showLostConnect == 0) {
                            _usernode3.getChildByName('mask').getChildByName('lixian').active = this.isShowLiXian(posList[_i6].isLostConnect);
                        } else {
                            _usernode3.getChildByName('mask').getChildByName('lixian').active = false;
                        }
                        var _benquan3 = _usernode3.getChildByName("benquan");
                        if (posList[_i6].clubID == this.nowClubID && this.isShowClubSign == true) {
                            if (_benquan3) {
                                _benquan3.active = true;
                            } else {
                                var _addbenquan3 = cc.instantiate(this.icon_benquan);
                                _addbenquan3.name = "benquan";
                                _usernode3.addChild(_addbenquan3);
                            }
                        } else {
                            if (_benquan3) {
                                _benquan3.active = false;
                            }
                        }
                    }
                }
            }
        }
    },
    Event_ClubPlayerNtf: function Event_ClubPlayerNtf(event) {
        var status = event.clubPlayerInfo.status;
        var pid = event.clubPlayerInfo.shortPlayer.pid;
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        if (selfPid == pid) {
            if (app.ClubManager().Enum_Join == status || app.ClubManager().Enum_Kick == status || app.ClubManager().Enum_Leave == status) {
                app.ClubManager().SendGetAllRoom(this.nowClubID);
                app.ClubManager().SendReqClubData();
            }
        }
    },
    Event_ClubCardNtf: function Event_ClubCardNtf(serverPack) {
        var clubData = app.ClubManager().GetClubData();
        var datas = serverPack.roomCardAttentions;
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        this.clubCardNtfs = [];
        for (var i = 0; i < clubData.length; i++) {
            for (var j = 0; j < datas.length; j++) {
                if (this.nowClubID == clubData[i].id) {
                    //只刷当前亲情圈
                    if (clubData[i].id == datas[j].clubId && datas[j].roomcard <= datas[j].roomcardattention) {
                        var isMag = app.ClubManager().IsManager(datas[j].clubId, selfPid);
                        if (isMag) this.clubCardNtfs.push(datas[j]);
                        break;
                    }
                }
            }
        }

        if (0 != this.clubCardNtfs.length) {
            this.SetWaitForConfirm('MSG_CLUB_RoomCard_Not_Enough', this.ShareDefine.ConfirmOK, [this.clubCardNtfs[0].clubName, this.clubCardNtfs[0].roomcardattention], [this.clubCardNtfs[0].clubId]);
        }
    },
    RemoveRoomKey: function RemoveRoomKey(roomKey) {
        var index = this.roomKeyList.indexOf(roomKey);
        if (index > -1) {
            this.roomKeyList.splice(index, 1);
        }
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
                            //this.CheckRoomDisplay();
                            this.CheckRoomDisplayList.push("1");
                        }
                    }
                    break;
                }
            }
        }
        //新增一个房间
        if (isChange == false && isClose == false) {
            var unionMyWanFa = this.MyUnionMyWanFaArray();
            if (unionMyWanFa.length > 0 && unionMyWanFa.indexOf(roomData.tagId.toString()) == -1) {
                return;
            }
            this.roomList.push(roomData);
            this.roomKeyList.push(roomData.roomKey);
            this.AddChildToScroll(roomData);
            this.CheckRoomDisplayList.push("1");
            //this.CheckRoomDisplay();
        }
    },

    MyUnionMyWanFaArray: function MyUnionMyWanFaArray() {
        var unionMyWanFa = [];
        if (this.unionId > 0) {
            this.unionMyWanFa = localStorage.getItem("mywanfa_" + this.unionId + "_" + this.nowClubID);
            if (typeof this.unionMyWanFa != "undefined" && this.unionMyWanFa != "" && this.unionMyWanFa != null) {
                unionMyWanFa = this.unionMyWanFa.split(",");
            }
        }
        return unionMyWanFa;
    },

    Event_RoomSetChange: function Event_RoomSetChange(serverPack) {
        var roomData = serverPack;
        var length = this.roomList.length;
        var tempData = null;
        for (var i = 0; i < length; i++) {
            if (roomData.roomKey == this.roomList[i].roomKey) {
                this.roomList[i].setId = roomData.setId;
                this.roomList[i].sort = roomData.sort;
                tempData = this.roomList[i];
                break;
            }
        }
        if (tempData != null) {
            var childNode = this.GetRoomNode(tempData.roomKey);
            if (childNode != null) {
                if (childNode.isDisplay == true) {
                    this.UpdateChildInScroll(tempData);
                } else {
                    this.SortAllRoom(childNode, tempData);
                    //this.CheckRoomDisplay();
                    this.CheckRoomDisplayList.push("1");
                }
            }
        }
    },
    Event_RoomPlayerChange: function Event_RoomPlayerChange(serverPack) {
        var newRoomData = null;
        for (var i = 0; i < this.roomList.length; i++) {
            if (serverPack.roomKey == this.roomList[i].roomKey) {
                if (!this.roomList[i].posList) {
                    this.roomList[i].posList = [];
                }
                this.roomList[i].posList[serverPack['pos'].pos] = serverPack['pos'];
                this.roomList[i].sort = serverPack['sort'];
                newRoomData = this.roomList[i];
                break;
            }
        }
        if (newRoomData != null) {
            var childNode = this.GetRoomNode(newRoomData.roomKey);
            if (childNode != null) {
                if (childNode.isDisplay == true) {
                    this.UpdateChildInScroll(newRoomData);
                } else {
                    this.SortAllRoom(childNode, newRoomData);
                    //this.CheckRoomDisplay();
                    this.CheckRoomDisplayList.push("1");
                }
            }
        }
    },
    ShowPageTip: function ShowPageTip(page, pageNum) {
        //this.page_tip.removeAllChildren();
        this.DestroyAllChildren(this.page_tip);
        for (var i = 1; i <= pageNum; i++) {
            var pagedemo = cc.instantiate(this.page_demo);
            if (i == page) {
                pagedemo.getChildByName('on').active = true;
            }
            pagedemo.active = true;
            this.page_tip.addChild(pagedemo);
        }
    },
    GetNextRoomPage: function GetNextRoomPage() {
        this.ScrollDataPage += 1;
        // app.ClubManager().SendGetAllRoom(this.nowClubID, this.ScrollDataPage);
    },
    GetClubTb: function GetClubTb() {
        var ClubTb = cc.sys.localStorage.getItem("ClubNewTb");
        if (ClubTb == null || typeof ClubTb == "undefined") {
            cc.sys.localStorage.setItem("ClubNewTb", "4");
            ClubTb = 4;
        }
        return ClubTb;
    },
    InitNullTable: function InitNullTable(roomList) {
        var roomScrollView = this.node.getChildByName("right_main").getChildByName("mark");
        roomScrollView.getComponent(cc.ScrollView).scrollToLeft();
        this.DestroyAllChildren(this.right_layout);
        var ClubTb = this.GetClubTb();
        if (ClubTb < 3) {
            this.right_layout.height = 500;
            this.right_layout.getComponent(cc.Layout).spacingY = 40;
        } else if (ClubTb == 3) {
            this.right_layout.height = 550;
            this.right_layout.getComponent(cc.Layout).spacingY = 5;
        } else if (ClubTb == 5 || ClubTb == 6) {
            this.right_layout.height = 550;
            this.right_layout.getComponent(cc.Layout).spacingY = 5;
        } else if (ClubTb == 4) {
            this.right_layout.height = 550;
            this.right_layout.getComponent(cc.Layout).spacingY = 5;
            this.right_layout.getComponent(cc.Layout).spacingX = 100;
        }
        for (var i = 0; i < roomList.length; i++) {
            //先排查是否重复
            var isExist = false;
            for (var j = 0; j < this.right_layout.children.length; j++) {
                if (this.right_layout.children[j].roomKey == roomList[i].roomKey) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) {
                console.log("InitNullTable 房间已经在列表了----" + roomList[i].roomKey);
                continue;
            }
            var club = new cc.Node();
            if (ClubTb < 3) {
                club.width = 296;
                club.height = 212;
                club.isDisplay = false;
            } else if (ClubTb == 3) {
                club.width = 387;
                club.height = 255;
                club.isDisplay = false;
            } else if (ClubTb == 5 || ClubTb == 6) {
                club.width = 387;
                club.height = 255;
                club.isDisplay = false;
            } else if (ClubTb == 4) {
                club.width = 324;
                club.height = 255;
                club.isDisplay = false;
            }
            club.roomKey = roomList[i].roomKey;
            club.playerNum = roomList[i].playerNum;
            club.gameId = roomList[i].gameId;
            club.tagId = roomList[i].tagId;
            club.sort = roomList[i].sort;
            club.zIndex = this.GetZindex(roomList[i].sort, roomList[i].tagId);
            club.zIndexNum = this.GetZindex(roomList[i].sort, roomList[i].tagId);
            club.active = true;
            this.right_layout.addChild(club);
        }
        //全部加入后再排序一遍
        for (var _i7 = 0; _i7 < this.right_layout.children.length; _i7++) {
            for (var _j = 0; _j < this.roomList.length; _j++) {
                if (this.roomList[_j].roomKey == this.right_layout.children[_i7].roomKey) {
                    this.SortAllRoom(this.right_layout.children[_i7], this.roomList[_j]);
                }
            }
        }
        this.CheckRoomDisplay();
    },
    GetRoomData: function GetRoomData(roomKey) {
        for (var j = 0; j < this.roomList.length; j++) {
            if (this.roomList[j].roomKey == roomKey) {
                return this.roomList[j];
            }
        }
    },
    GetRoomNode: function GetRoomNode(roomKey) {
        for (var i = 0; i < this.right_layout.children.length; i++) {
            if (this.right_layout.children[i].roomKey == roomKey) {
                return this.right_layout.children[i];
            }
        }
        return null;
    },

    RunRoomDisplay: function RunRoomDisplay() {
        if (this.CheckRoomDisplayList.length > 0) {
            this.CheckRoomDisplayList = [];
            this.CheckRoomDisplay();
        }
    },
    CheckRoomDisplay: function CheckRoomDisplay() {
        var roomScrollView = this.node.getChildByName("right_main").getChildByName("mark");
        var ScrollOffset = roomScrollView.getComponent(cc.ScrollView).getScrollOffset();
        var gundongX = ScrollOffset.x;
        this.right_layout.getComponent(cc.Layout).updateLayout();
        var batchRoomKey = [];
        //let batchRoomNode=[];
        for (var i = 0; i < this.right_layout.children.length; i++) {
            if (this.right_layout.children[i].x + gundongX < 4000) {
                //需要渲染
                if (this.right_layout.children[i].isDisplay == false) {
                    //开始渲染,把空节点替换成真实节点
                    //let club ="";
                    this.right_layout.children[i].isDisplay = true; //标记为已经加载，避开高并发二次加载问题
                    //let ClubTb=this.GetClubTb();
                    //let zIndexNum=this.right_layout.children[i].zIndexNum;
                    var roomKey = this.right_layout.children[i].roomKey;
                    var playerNum = this.right_layout.children[i].playerNum;
                    var gameId = this.right_layout.children[i].gameId;
                    var tagId = this.right_layout.children[i].tagId;
                    var sort = this.right_layout.children[i].sort;
                    var nullNode = this.right_layout.children[i];
                    if (this.ShowRoomKeyList.indexOf(roomKey) > -1) {
                        if (nullNode) {
                            nullNode.destroy();
                        }
                        continue;
                    }
                    this.ShowRoomKeyList.push(roomKey);
                    nullNode.active = false; //先隐藏，异步读出桌子了，再出来
                    batchRoomKey.push(parseInt(roomKey));
                    //batchRoomNode.push(nullNode);
                    //this.ShowRoomData(club,this.GetRoomData(roomID));
                }
            }
        }
        if (batchRoomKey.length > 0) {
            this.ShowRoomDataBatch(batchRoomKey);
        }
        this.right_layout.getComponent(cc.Layout).updateLayout();
    },

    ChangeTableColor: function ChangeTableColor(club, tagId, gameId) {
        var ClubTb = this.GetClubTb();
        if (ClubTb == 4) {
            //幸运的桌子
            var bg_table_color = club.getChildByName("bg_table_color"); //麻将
            if (bg_table_color) {
                bg_table_color.getComponent(cc.Sprite).spriteFrame = this.table_majiang_xinyung[tagId % 10];
                return;
            }
            var bg_table_color_puke = club.getChildByName("bg_table_color_puke"); //扑克
            if (bg_table_color_puke) {
                bg_table_color_puke.getComponent(cc.Sprite).spriteFrame = this.table_puke_xinyung[tagId % 10];
                return;
            }
            var bg_table_color_dazhuo = club.getChildByName("bg_table_color_dazhuo"); //5人以上桌子
            if (bg_table_color_dazhuo) {
                bg_table_color_dazhuo.getComponent(cc.Sprite).spriteFrame = this.table_dazhuo_xinyung[tagId % 10];
                return;
            }
        }
    },
    ShowRoomDataBatch: function ShowRoomDataBatch(batchRoomKey) {
        var packName = "";
        var clubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
        this.nowUnionID = clubData.unionId;
        if (this.nowUnionID > 0) {
            packName = "union.CUnionGetRoomData";
        } else {
            packName = "club.CClubGetRoomData";
        }
        var that = this;
        app.NetManager().SendPack(packName, { 'clubId': this.nowClubID, 'unionId': this.nowUnionID, 'roomKey': batchRoomKey }, function (serverPack) {
            console.log("logTime2:" + new Date().getTime());
            for (var i = 0; i < serverPack.roomList.length; i++) {
                that.UpdateRoomData(serverPack.roomList[i]);
            }
        }, function (error) {
            console.log("获取房间poslist失败");
        });
    },

    UpdateRoomData: function UpdateRoomData(serverPack) {
        var roomData = serverPack;
        var length = this.roomList.length;
        var tempData = null;
        for (var i = 0; i < length; i++) {
            if (roomData.roomKey == this.roomList[i].roomKey) {
                this.roomList[i].password = roomData.password;
                this.roomList[i].roomName = roomData.roomName;
                this.roomList[i].roomSportsThreshold = roomData.roomSportsThreshold;
                this.roomList[i].setCount = roomData.setCount;
                this.roomList[i].posList = roomData.posList;
                tempData = this.roomList[i];
                break;
            }
        }
        if (tempData == null) {
            for (var _i8 = 0; _i8 < this.right_layout.children.length; _i8++) {
                if (this.right_layout.children[_i8].roomKey == roomData.roomKey) {
                    this.right_layout.children[_i8].destroy();
                    break;
                }
            }
            return;
        }
        for (var _i9 = 0; _i9 < this.right_layout.children.length; _i9++) {
            if (this.right_layout.children[_i9].roomKey == tempData.roomKey) {
                if (this.CreateRoomKeyList.indexOf(tempData.roomKey) > -1) {
                    break; //这个桌子已经创建过
                }
                this.CreateRoomKeyList.push(tempData.roomKey);
                this.ShowRoomData(this.CreateTable(this.right_layout.children[_i9]), tempData);
                break;
            }
        }
    },
    CreateTable: function CreateTable(nullNode) {
        var club = "";
        var ClubTb = this.GetClubTb();
        var zIndexNum = nullNode.zIndexNum;
        var zIndex = nullNode.zIndex;
        var roomKey = nullNode.roomKey;
        var playerNum = nullNode.playerNum;
        var gameId = nullNode.gameId;
        var tagId = nullNode.tagId;
        var sort = nullNode.sort;

        if (ClubTb < 3) {
            club = cc.instantiate(this.roomDemo);
        } else if (ClubTb == 3) {
            var zhuoziKey = parseInt(playerNum) - 2;
            if (zhuoziKey < 0) {
                zhuoziKey = 0;
            }
            if (zhuoziKey >= 6) {
                zhuoziKey = 6; //目前桌子最多只有7个
            }
            club = cc.instantiate(this.zhuozi[zhuoziKey]);
            club.on('click', this.OnJoinBtnClick, this);
            club.getChildByName("btn_detail").on('click', this.OnBtnClickDetail, this);
        } else if (ClubTb == 4) {
            var _zhuoziKey = parseInt(playerNum) - 2;
            if (_zhuoziKey < 0) {
                _zhuoziKey = 0;
            }
            if (_zhuoziKey >= 6) {
                _zhuoziKey = 6; //目前桌子最多只有7个
            }
            if (playerNum > 3) {
                //超过3人的。调用默认的皮肤
                club = cc.instantiate(this.zhuozi_xingyun[_zhuoziKey]);
            } else {
                //2,3人的，如果是跑得快或者斗地主，调用扑克圆桌
                var gamePY = this.ShareDefine.GametTypeID2PinYin[gameId] || "";
                if (gamePY.indexOf("pdk") > -1 || gamePY.indexOf("ddz") > -1) {
                    club = cc.instantiate(this.zhuozi_xingyun_puke[_zhuoziKey]);
                } else {
                    club = cc.instantiate(this.zhuozi_xingyun[_zhuoziKey]);
                }
            }
            this.ChangeTableColor(club, tagId, gameId);
            club.on('click', this.OnJoinBtnClick, this);
            club.getChildByName("btn_detail").on('click', this.OnBtnClickDetail, this);
        } else if (ClubTb == 5 || ClubTb == 6) {
            var _zhuoziKey2 = parseInt(playerNum) - 2;
            if (_zhuoziKey2 < 0) {
                _zhuoziKey2 = 0;
            }
            if (_zhuoziKey2 >= this.zhuozi_zhongzhi.length) {
                _zhuoziKey2 = this.zhuozi_zhongzhi.length - 1; //目前桌子最多只有7个
            }
            club = cc.instantiate(this.zhuozi_zhongzhi[_zhuoziKey2]);
            //2,3人的，如果是跑得快或者斗地主，调用扑克圆桌
            var _gamePY = this.ShareDefine.GametTypeID2PinYin[gameId];
            var isPuke = false;
            if (_gamePY.indexOf("pdk") > -1 || _gamePY.indexOf("ddz") > -1 || playerNum > 4) {
                isPuke = true; //扑克游戏
            }

            //修改桌子颜色，桌子最多6个人，超过6人不修改桌子颜色
            if (playerNum <= 10) {

                if (ClubTb == 5) {
                    if (club.getChildByName("bg")) {
                        club.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.roomBg_zhongzhi_green[playerNum - 2];
                    }
                    //绿色
                    else club.getComponent(cc.Sprite).spriteFrame = this.roomBg_zhongzhi_green[playerNum - 2];
                } else if (ClubTb == 6) {
                    //蓝色
                    if (club.getChildByName("bg")) {
                        club.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.roomBg_zhongzhi_blue[playerNum - 2];
                    } else club.getComponent(cc.Sprite).spriteFrame = this.roomBg_zhongzhi_blue[playerNum - 2];
                }
            }

            club.on('click', this.OnJoinBtnClick, this);
            club.getChildByName("btn_detail").on('click', this.OnBtnClickDetail, this);
        }
        club.zIndexNum = zIndexNum;
        club.zIndex = zIndexNum;
        club.roomKey = roomKey;
        club.playerNum = playerNum;
        club.gameId = gameId;
        club.tagId = tagId;
        club.sort = sort;
        club.isDisplay = true;
        club.active = false; //暂时不显示，等回调了再显示
        this.right_layout.addChild(club); //添加进去，开始渲染
        if (nullNode) {
            nullNode.destroy();
        }
        return club;
    },
    ShowRoomData: function ShowRoomData(childRoom, roomData) {
        if (this.ShowRoomKeyList.indexOf(roomData.roomKey) == -1) {
            this.ShowRoomKeyList.push(roomData.roomKey);
        }
        var toggleHideRoom = this.node.getChildByName("top").getChildByName("ToggleHideRoom");
        var GamePlayManager = require('GamePlayManager');

        var game_nameNode = childRoom.getChildByName('game_name');
        var img_sp = childRoom.getChildByName('img_sp');
        // img_sp.active = false;
        if (this.GetCLubTable() == 4) {
            if (game_nameNode) {
                if (roomData.roomName == "") {
                    game_nameNode.getComponent(cc.Label).fontSize = 28;
                } else {
                    game_nameNode.getComponent(cc.Label).fontSize = 15;
                }
            }
        }
        //赛事的不显示gameName，显示门槛
        if (this.unionId > 0) {
            if (game_nameNode) {
                game_nameNode.active = false;
            }
            img_sp.active = true;
            var lb_spStart = img_sp.getChildByName("lb_spStart").getComponent(cc.Label);
            lb_spStart.string = roomData.roomSportsThreshold;
        } else {
            if (game_nameNode) {
                game_nameNode.active = true;
            }
            img_sp.active = false;
        }
        //显示锁标记
        if (typeof roomData["password"] != "undefined") {
            if (roomData["password"] != "") {
                childRoom.getChildByName("tip_lock").active = true;
            } else {
                childRoom.getChildByName("tip_lock").active = false;
            }
        } else {
            childRoom.getChildByName("tip_lock").active = false;
        }
        childRoom.isDisplay = true;
        if (game_nameNode) {
            game_nameNode.getComponent(cc.Label).string = this.ShareDefine.GametTypeID2Name[roomData.gameId];
        }
        var roomNameNode = childRoom.getChildByName('lb_roomName');
        if (roomNameNode) {
            roomNameNode.getComponent(cc.Label).string = roomData.roomName;
        }
        var keyNode = childRoom.getChildByName('bg_key').getChildByName('key');
        if (keyNode) {
            keyNode.getComponent(cc.Label).string = roomData.tagId;
        }
        var jushuNode = childRoom.getChildByName('jushu');
        if (jushuNode) {
            jushuNode.x = 0;
        }
        var paishuNode = childRoom.getChildByName('paishu');
        if (paishuNode) {
            paishuNode.active = false;
            paishuNode.getComponent(cc.Label).string = "";
        }
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
        if (jushuNode) {
            jushuNode.getComponent(cc.Label).string = jushuStr;
        }
        childRoom.name = "join_room_" + roomData.roomKey;
        childRoom.roomKey = roomData.roomKey;
        childRoom.gameId = roomData.gameId;
        childRoom.tagId = roomData.tagId;
        childRoom.sort = roomData.sort;
        childRoom.name = "btn_joinroom";
        var haveRen = 0;
        for (var j = 0; j < roomData.posList.length; j++) {
            if (roomData.posList[j].pid > 0) {
                haveRen++;
            }
        }
        this.SortAllRoom(childRoom, roomData);
        if (roomData.setId > 0 && toggleHideRoom.getComponent(cc.Toggle).isChecked) {
            //如果勾选了隐藏已开房间，则开始的房间不加入显示
            childRoom.active = false;
        } else {
            childRoom.active = true;
            this.InitHead(childRoom, roomData.playerNum, roomData.posList);
        }
    },
    GetZindex: function GetZindex(sort, tagId) {
        if (!cc.sys.isNative) {
            this.sort = 3; //网页版连接显示测试排序使用
        }
        if (this.sort == 0) {
            //已开-人满-有人-空桌
            var zIndexNum = 255;
            if (sort == 0) {
                //开始的
                zIndexNum = 0;
            } else if (sort == 1) {
                //人满
                zIndexNum = tagId;
            } else if (sort == 2) {
                //未满
                zIndexNum = 100 + tagId;
            } else if (sort == 3) {
                //空桌
                zIndexNum = 200 + tagId;
            }
            return zIndexNum;
        }
        if (this.sort == 1) {
            //空桌固定序号-人满-已开（默认） 
            var _zIndexNum = 100;
            if (sort == 0) {
                _zIndexNum = 150; //开始的
            } else if (sort == 1) {
                _zIndexNum = 120; //人满
            } else if (sort == 2) {
                //未满人
                _zIndexNum = tagId;
            } else if (sort == 3) {
                //空配置
                _zIndexNum = tagId;
            }
            return _zIndexNum;
        }

        if (this.sort == 2) {
            //排序 未开-已开-空桌
            var _zIndexNum2 = 255;
            if (sort == 0) {
                //开始的
                _zIndexNum2 = 100 + tagId;
            } else if (sort == 1) {
                //人满
                _zIndexNum2 = tagId;
            } else if (sort == 2) {
                //未满人
                _zIndexNum2 = tagId;
            } else if (sort == 3) {
                //空配置
                _zIndexNum2 = 200 + tagId;
            }
            return _zIndexNum2;
        }
        if (this.sort == 3) {
            //排序 有人-空桌-人满-已开
            var _zIndexNum3 = 500;
            if (sort == 0) {
                //开始的
                _zIndexNum3 = 400 + tagId;
            } else if (sort == 1) {
                //人满
                _zIndexNum3 = 300 + tagId;
            } else if (sort == 2) {
                //未满人
                _zIndexNum3 = tagId;
            } else if (sort == 3) {
                //空配置
                _zIndexNum3 = 200 + tagId;
            }
            return _zIndexNum3;
        }
        return tagId;
    },
    SortAllRoom: function SortAllRoom(childRoom, roomData) {
        if (childRoom == null) {
            return;
        }
        childRoom.zIndex = this.GetZindex(roomData.sort, roomData.tagId);
        childRoom.parent.sortAllChildren();
    },
    UpdateChildInScroll: function UpdateChildInScroll(roomData) {
        var childRoom = null;
        for (var i = 0; i < this.right_layout.children.length; i++) {
            if (roomData.roomKey == this.right_layout.children[i].roomKey) {
                childRoom = this.right_layout.children[i];
                break;
            }
        }
        if (childRoom != null) {
            this.ShowRoomData(childRoom, roomData);
        } else {
            console.log("找不到需要修改的房间：" + roomData.roomKey);
        }
    },
    RemoveChildFromScroll: function RemoveChildFromScroll(roomData) {
        var childRoom = null;
        for (var i = 0; i < this.right_layout.children.length; i++) {
            if (roomData.roomKey == this.right_layout.children[i].roomKey) {
                childRoom = this.right_layout.children[i];
                break;
            }
        }
        if (childRoom != null) {
            this.DestroyFromParent(childRoom);
            //把原来隐藏的空配置显示出来
            /*if (roomData.sort == 2) {
                for (let i = 0; i < this.right_layout.children.length; i++) {
                    if(roomData.tagId==this.right_layout.children[i].tagId && this.right_layout.children[i].sort == 3){
                        this.right_layout.children[i].active = true;
                        if (this.sort == 1 || typeof(this.sort) == "undefined") {
                            this.right_layout.children[i].zIndex = this.right_layout.children[i].tagId;
                        }else{
                            this.right_layout.children[i].zIndex = 200 - this.right_layout.children[i].tagId;
                        }
                        this.right_layout.sortAllChildren();
                        break;
                    }
                }
            }*/
        } else {
            console.log("找不到需要移除的房间：" + roomData.roomKey);
        }
    },
    GetCLubTable: function GetCLubTable() {
        var clubTable = cc.sys.localStorage.getItem("ClubNewTb");
        if (clubTable == null || typeof clubTable == "undefined") {
            cc.sys.localStorage.setItem("ClubNewTb", "5");
            clubTable = 5;
        }
        return clubTable;
    },
    AddChildToScroll: function AddChildToScroll(roomData) {
        //先排查是否重复
        var isExist = false;
        for (var j = 0; j < this.right_layout.children.length; j++) {
            if (this.right_layout.children[j].roomKey == roomData.roomKey) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            console.log("AddChildToScroll 房间已经在列表了----" + roomData.roomKey);
            return;
        }
        var clubTable = this.GetCLubTable();
        var childRoom = "";
        if (clubTable < 3) {
            childRoom = cc.instantiate(this.roomDemo);
        } else if (clubTable == 3) {
            var zhuoziKey = parseInt(roomData.playerNum) - 2;
            if (zhuoziKey < 0) {
                zhuoziKey = 0;
            }
            childRoom = cc.instantiate(this.zhuozi[zhuoziKey]);
            childRoom.on('click', this.OnJoinBtnClick, this);
            childRoom.getChildByName("btn_detail").on('click', this.OnBtnClickDetail, this);
            //childRoom.emit('click', {"node":childRoom});
        } else if (clubTable == 4) {
            var _zhuoziKey3 = parseInt(roomData.playerNum) - 2;
            if (_zhuoziKey3 < 0) {
                _zhuoziKey3 = 0;
            }
            if (roomData.playerNum > 3) {
                childRoom = cc.instantiate(this.zhuozi_xingyun[_zhuoziKey3]);
            } else {
                //2,3人的，如果是跑得快或者斗地主，调用扑克圆桌
                var gamePY = this.ShareDefine.GametTypeID2PinYin[roomData.gameId];
                if (gamePY.indexOf("pdk") > -1 || gamePY.indexOf("ddz") > -1) {
                    childRoom = cc.instantiate(this.zhuozi_xingyun_puke[_zhuoziKey3]);
                } else {
                    childRoom = cc.instantiate(this.zhuozi_xingyun[_zhuoziKey3]);
                }
            }
            //幸运皮肤，改变桌布颜色开始
            this.ChangeTableColor(childRoom, roomData.tagId, roomData.gameId);
            childRoom.on('click', this.OnJoinBtnClick, this);
            childRoom.getChildByName("btn_detail").on('click', this.OnBtnClickDetail, this);
        } else if (clubTable == 5 || clubTable == 6) {
            var _zhuoziKey4 = parseInt(roomData.playerNum) - 2;
            if (_zhuoziKey4 < 0) {
                _zhuoziKey4 = 0;
            }
            // cc.log("至尊丹东",zhuoziKey,this.zhuozi_zhongzhi.length)
            childRoom = cc.instantiate(this.zhuozi_zhongzhi[_zhuoziKey4]);
            childRoom.on('click', this.OnJoinBtnClick, this);
            childRoom.getChildByName("btn_detail").on('click', this.OnBtnClickDetail, this);
        }
        this.right_layout.addChild(childRoom);
        this.right_layout.getComponent(cc.Layout).updateLayout();
        this.ShowRoomData(childRoom, roomData);
        childRoom.active = true;
    },
    ReSortRoomList: function ReSortRoomList() {
        var that = this;
        this.roomList.sort(function (a, b) {
            if (a.setId == 0 && b.setId == 0) {
                return that.PosCount(b.posList) - that.PosCount(a.posList);
            } else {
                return a.setId - b.setId;
            }
        });
        return this.roomList;
    },
    PosCount: function PosCount(posList) {
        var poscount = 0;
        for (var i = 0; i < posList.length; i++) {
            if (posList[i]) {
                if (posList[i].pid > 0) {
                    poscount++;
                }
            }
        }
        if (poscount == 4) {
            return -1;
        }
        return poscount;
    },
    RefreshLeft: function RefreshLeft() {
        if (this.clubDatas.length == 0) {
            this.nowClubID = -1;
            this.nowUnionID = -1;
        }
        //刷新房卡
        for (var i = 0; i < this.left_layout.children.length; i++) {
            var node = this.left_layout.children[i];
            if (node.name == "btn_club_" + this.nowClubID) {
                node.getComponent(cc.Sprite).spriteFrame = this.left_on;
            } else {
                node.getComponent(cc.Sprite).spriteFrame = this.left_off;
            }
        }
    },
    UpdateClubList: function UpdateClubList() {
        this.DestroyAllChildren(this.left_layout);
        this.clubDatas = app.ClubManager().GetClubData();
        var selfPid = app.HeroManager().GetHeroProperty("pid");
        var joinState = app.ClubManager().Enum_Join;

        if (this.clubDatas.length == 0) {
            this.fangka.active = false;
        } else {
            this.fangka.active = false;
        }
        for (var i = 0; i < this.clubDatas.length; i++) {
            if (this.nowClubID < 0) {
                this.nowClubID = this.clubDatas[i].id;
            }
            var club = cc.instantiate(this.clubDemo);
            club.getChildByName('name').getComponent(cc.Label).string = this.clubDatas[i].name;
            club.getChildByName('id').getComponent(cc.Label).string = "ID:" + this.clubDatas[i].clubsign;
            club.getChildByName('renshu').getComponent(cc.Label).string = "*";
            if (this.clubDatas[i].unionId > 0) {
                //已经加入赛事不显示圈卡
                // club.getChildByName('quanka').active = true;
                // club.getChildByName('icon_qk').active = false;
            } else {
                    // club.getChildByName('quanka').active = false;
                    // club.getChildByName('icon_qk').active = false;
                    //club.getChildByName('quanka').getComponent(cc.Label).string=this.clubDatas[i].playerClubCard;
                }
            club.active = true;
            club.name = "btn_club_" + this.clubDatas[i].id;
            club.clubId = this.clubDatas[i].id;
            club.clubSign = this.clubDatas[i].clubsign;
            club.clubName = this.clubDatas[i].name;
            club.unionId = this.clubDatas[i].unionId;
            club.skinType = this.clubDatas[i].skinType;
            this.left_layout.addChild(club);
        }
        //每次刷新判断下是否皮肤是当前界面，如果不是需要关闭重新打开
        this.RefreshLeft();
        app.ClubManager().SendReqClubDataById(this.nowClubID);
    },
    Event_OutRoom: function Event_OutRoom() {
        this.inRoom = false;
        this.inRoomInfo = null;
        this.FormManager.CloseForm("ui/club/UIClubInRoom");
    },
    //this.roomList
    CheckRoomIsStart: function CheckRoomIsStart(roomKey) {
        for (var i = 0; i < this.roomList.length; i++) {
            if (this.roomList[i].roomKey == roomKey) {
                if (this.roomList[i].setId > 0) {
                    return true;
                }
                return false;
                break;
            }
        }
        return false;
    },
    Event_ReJoin: function Event_ReJoin(event) {
        if (this.isRejoin == true) {
            return;
        }
        this.isRejoin = true;
        this.Click_btn_JiaRu(event);
        var self = this;
        this.scheduleOnce(function () {
            self.isRejoin = false;
        }, 2);
    },
    Click_btn_JiaRu: function Click_btn_JiaRu(btnNode) {
        var roomKey = btnNode.roomKey; //房间号
        var tagId = btnNode.tagId;
        var gameName = this.GameId2PinYin(btnNode.gameId).toLowerCase(); //游戏名
        //是否需要密码
        var isPassword = btnNode.getChildByName("tip_lock").active;
        //检查本地是否有密码
        var password = "";
        if (isPassword) {
            password = localStorage.getItem("password_" + this.nowClubID + "_" + tagId);
            if (password == null || typeof password == "undefined" || password == "") {
                //弹出密码框
                this.FormManager.ShowForm('ui/club/UIClubRoomPassword', btnNode, this.nowClubID);
                return;
            }
        }
        if (this.inRoom == false) {
            //提示数字密码
            app.Client.JoinRoomCheckSubGame(gameName, roomKey, this.nowClubID, undefined, password);
        } else {
            if (roomKey != this.inRoomInfo.roomKey) {
                //如果原来的房间已经开始。需要报错提示
                if (this.CheckRoomIsStart(this.inRoomInfo.roomKey) == false) {
                    this.changeInfo = { "gameName": gameName, "roomKey": roomKey, "password": password };
                    this.SetWaitForConfirm('MSG_CLUB_CHANGEROOM', this.ShareDefine.Confirm, [], []);
                } else {
                    var curGameType = this.GameId2PinYin(this.inRoomInfo.gameId).toLowerCase();
                    this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[this.inRoomInfo.gameId]]);
                }
            } else {
                //进入原来的房间
                var curGameTypeStr = this.GameId2PinYin(this.inRoomInfo.gameId).toLowerCase();
                app.Client.SetGameType(curGameTypeStr);
                this.FormManager.ShowForm("UIDownLoadGame", curGameTypeStr, 0, null, 0, 0, true);
            }
        }
    },
    Click_btn_weixin: function Click_btn_weixin() {},
    SortPlayerByIsminister: function SortPlayerByIsminister(a, b) {
        //app.ClubManager().Enum_NotAgree
        if (a.status == app.ClubManager().Enum_NotAgree) {
            return -1;
        } else if (b.status == app.ClubManager().Enum_NotAgree) {
            return 1;
        }
        if (a.isminister && b.isminister) return a.time - b.time;else if (!a.isminister && !b.isminister) {
            if (a.status == app.ClubManager().Enum_NotAgree) {
                return -1;
            } else if (b.status == app.ClubManager().Enum_NotAgree) {
                return 1;
            }
            return a.time - b.time;
        } else if (a.isminister && !b.isminister) return -1;else if (!a.isminister && b.isminister) return 1;
    },
    OnJoinBtnClick: function OnJoinBtnClick(event) {
        var self = this;
        if (this.joining == true) {
            this.scheduleOnce(function () {
                self.joining = false;
            }, 1.5);
            return false;
        }
        this.joining = true;
        var btnNode = event.node;
        this.Click_btn_JiaRu(btnNode);
        this.scheduleOnce(function () {
            self.joining = false;
        }, 1.5);
    },
    Click_btn_qhwh: function Click_btn_qhwh() {
        var isSelect = false;
        if (isSelect == false) {
            var sendPack = {};
            sendPack.clubId = this.nowClubID;
            var packName = "union.CUnionRoomConfigItemList";
            if (this.unionId > 0) {
                sendPack.unionId = this.unionId;
            } else {
                this.ShowSysMsg("您还没有选择比赛场");
                return;
            }
            var self = this;
            app.NetManager().SendPack(packName, sendPack, function (serverPack) {
                self.UpdateLeftWanFa(serverPack);
            }, function () {
                self.ShowSysMsg("网络开小差，请稍后再试");
            });
        } else {
            this.SaveQHWF(); //保存玩法
        }
    },
    SortByTagId: function SortByTagId(a, b) {
        return b.tagId - a.tagId;
    },
    UpdateLeftWanFa: function UpdateLeftWanFa(serverPack) {
        var mark = this.node.getChildByName("left_wanfa").getChildByName("mark");
        var content = mark.getChildByName("layout");
        mark.getComponent(cc.ScrollView).scrollToTop();
        this.DestroyAllChildren(content);
        var demo = this.node.getChildByName("left_wanfa").getChildByName("demo");
        demo.active = false;
        //this.unionMyWanFa;
        var unionMyWanFa = this.MyUnionMyWanFaArray();
        serverPack.sort(this.SortByTagId);
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            child.tagId = serverPack[i].tagId;
            child.configId = serverPack[i].configId;
            child.roomKey = serverPack[i].roomKey;
            child.gameId = serverPack[i].gameId;
            if (typeof serverPack[i].name != "undefined") {
                child.getChildByName("lb_roomName").getComponent(cc.Label).string = serverPack[i].name;
            } else {
                var roomName = app.ShareDefine().GametTypeID2Name[serverPack[i].gameId];
                child.getChildByName("lb_roomName").getComponent(cc.Label).string = roomName;
            }
            child.getChildByName("lb_tagid").getComponent(cc.Label).string = serverPack[i].tagId;
            var roomInfoStr = "";
            if (serverPack[i].setCount > 100 && serverPack[i].setCount < 200) {
                var total = serverPack[i].size * (serverPack[i].setCount % 100);
                roomInfoStr = serverPack[i].size + "人/" + total + "庄";
                if (this.ShareDefine.GametTypeID2PinYin[roomData.gameId] == "yzyzmj") {
                    jushuStr = "第" + roomData.setId + "/" + roomData.setCount % 100 + "圈";
                }
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
            } else {
                roomInfoStr = serverPack[i].size + "人/" + serverPack[i].setCount + "局";
            }
            child.getChildByName("lb_renshu").getComponent(cc.Label).string = roomInfoStr;
            child.active = true;
            //初始化按钮
            if (unionMyWanFa.length > 0 && unionMyWanFa.indexOf(child.tagId.toString()) != -1) {
                child.getChildByName("Toggle").getComponent(cc.Toggle).isChecked = true;
            } else if (unionMyWanFa.length == 0) {
                child.getChildByName("Toggle").getComponent(cc.Toggle).isChecked = true;
            } else {
                child.getChildByName("Toggle").getComponent(cc.Toggle).isChecked = false;
            }
            content.addChild(child);
        }
        //初始化全选按钮
        if (unionMyWanFa.length > 0 && unionMyWanFa.length == serverPack.length) {
            this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan").getChildByName("checkmark").active = true;
        } else {
            this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan").getChildByName("checkmark").active = false;
        }
        this.node.getChildByName("left_wanfa").active = true;

        this.node.getChildByName('bottom').getChildByName('btn_qhwh').active = true;

        this.left.active = false;
        this.node.getChildByName('bottom').getChildByName('btn_qhwh').getChildByName('baocun').active = true;
    },
    click_btn_QHWF: function click_btn_QHWF() {
        var quanxuan = this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan").getChildByName("checkmark").active;
        var mark = this.node.getChildByName("left_wanfa").getChildByName("mark");
        var content = mark.getChildByName("layout");
        for (var i = 0; i < content.children.length; i++) {
            content.children[i].getChildByName("Toggle").getComponent(cc.Toggle).isChecked = !quanxuan;
        }
        this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan").getChildByName("checkmark").active = !quanxuan;
    },
    SaveQHWF: function SaveQHWF(sender) {
        var quanxuan = false;
        if (sender && sender.target.name == "btn_quanwan") {
            sender.target.getChildByName("checkmark").active = true;
            quanxuan = true;
        }
        var unionMyWanFa = [];
        var mark = this.node.getChildByName("left_wanfa").getChildByName("mark");
        var content = mark.getChildByName("layout");
        for (var i = 0; i < content.children.length; i++) {
            if (quanxuan) {
                content.children[i].getChildByName("Toggle").getComponent(cc.Toggle).isChecked = true;
            }
            if (content.children[i].getChildByName("Toggle").getComponent(cc.Toggle).isChecked == true) {
                unionMyWanFa.push(content.children[i].tagId);
            }
        }
        if (unionMyWanFa.length == 0 && content.children.length > 0) {
            // this.ShowSysMsg("请至少选择一种玩法", 1);
            if (sender) sender.getComponent(cc.Toggle).isChecked = true;
            var p = this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan");
            p.getChildByName("checkmark").active = false;
            return;
        }

        if (unionMyWanFa.length == content.children.length) {
            //用户全选了
            unionMyWanFa = []; //空就代表了全选
            var _p = this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan");
            _p.getChildByName("checkmark").active = true;
        } else {
            var _p2 = this.node.getChildByName("left_wanfa").getChildByName("btn_quanwan");
            _p2.getChildByName("checkmark").active = false;
        }

        //比对一下旧的
        var localStorage = cc.sys.localStorage;
        if (unionMyWanFa.join(",") == localStorage.getItem("mywanfa_" + this.unionId + "_" + this.nowClubID)) {
            //跟旧的一样，直接关闭
            // this.node.getChildByName("left_wanfa").active=false;
            this.node.getChildByName('bottom').getChildByName('btn_qhwh').getChildByName('baocun').active = false;
            return;
        }

        if (unionMyWanFa.length > 0) {
            localStorage.setItem("mywanfa_" + this.unionId + "_" + this.nowClubID, unionMyWanFa.join(","));
        } else {
            localStorage.setItem("mywanfa_" + this.unionId + "_" + this.nowClubID, "");
        }

        // this.node.getChildByName("left_wanfa").active=false;
        this.node.getChildByName('bottom').getChildByName('btn_qhwh').getChildByName('baocun').active = false;
        this.Event_RefreshRoomList();
    },
    OnBtnClickDetail: function OnBtnClickDetail(event) {
        var btnNode = event.node;
        var sendPack = {
            "clubId": this.nowClubID,
            "roomKey": btnNode.parent.roomKey
        };
        var packName = "club.CClubRoomInfoDetails";
        var self = this;
        if (this.unionId > 0) {
            sendPack.unionId = this.unionId;
            packName = "union.CUnionRoomInfoDetails";
        }
        app.NetManager().SendPack(packName, sendPack, function (serverPack) {
            self.FormManager.ShowForm('ui/club/UIClubRoomJoin', serverPack);
        }, function () {
            app.SysNotifyManager().ShowSysMsg("获取房间详细配置失败", [], 3);
        });
    },

    OnClick: function OnClick(btnName, btnNode) {
        if (this.joining == true) {
            return;
        }
        if ('btn_join' == btnName) {
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        } else if ('btn_qhqyq' == btnName) {
            this.left.active = true;
            this.node.getChildByName("left_wanfa").active = false;
            this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = false;
            this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = true;
        } else if ('btn_ycqyq' == btnName) {
            this.left.active = false;
            this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = true;
            this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = false;
        } else if ("btn_close_left" == btnName) {
            this.left.active = false;
            if (this.unionId > 0) {
                this.node.getChildByName('bottom').getChildByName('btn_qhwh').getChildByName('baocun').active = false;
                this.node.getChildByName('bottom').getChildByName('btn_qhwh').active = true;
            } else {
                this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = true;
                this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = false;
            }
        } else if ("btn_changeclub" == btnName) {
            this.left.active = true;
            this.node.getChildByName("left_wanfa").active = false;
            this.node.getChildByName('bottom').getChildByName('btn_qhwh').active = false;
        } else if ('btn_ksjr' == btnName) {
            if (this.inRoom == false) {
                this.FormManager.ShowForm("ui/club/UIQuickJoinRoom", this.nowClubID, this.unionId);
            } else {
                var curGameTypeStr = app.ShareDefine().GametTypeID2PinYin[this.inRoomInfo.gameId];
                app.Client.SetGameType(curGameTypeStr);
                this.FormManager.ShowForm("UIDownLoadGame", curGameTypeStr, 0, null, 0, 0, true);
            }
        } else if (btnName == "btn_qhwh") {
            this.Click_btn_qhwh();
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
            var skinType = btnNode.skinType;
            // let showUplevelId=btnNode.showUplevelId;
            // let showClubSign=btnNode.showClubSign;
            if (this.mySkinType() != skinType) {
                //切换了不一样的皮肤。换UI显示
                app.ClubManager().SetLastClubData(clubId, CLubSign, clubName);
                app.FormManager().CloseAllClubForm();
                app.ClubManager().ShowClubFrom();
                return;
            }
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
        } else if (btnName == "btn_weixin") {
            if (this.nowClubID > 0) {
                var clubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
                this.myisminister = clubData.minister;
                if (this.myisminister > 0) {
                    this.FormManager.ShowForm("ui/club/UIYaoQing", this.nowClubID);
                } else {
                    app.SysNotifyManager().ShowSysMsg('您不是管理员无法直接邀请');
                }
            } else {
                app.SysNotifyManager().ShowSysMsg('您尚未加入任何亲友圈');
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
                var _clubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
                this.myisminister = _clubData.minister;
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
            var _clubData2 = {};
            _clubData2.clubId = this.nowClubID;
            _clubData2.cityId = nowClubData.cityId;
            _clubData2.roomKey = '0';
            _clubData2.gameIndex = 0; //用来判断保存还是创建
            _clubData2.enableGameType = ''; //不禁用的按钮
            data.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoom', data, '', _clubData2);
        } else if (btnName == "btn_roomManger" || btnName == "btn_RoomMgr") {
            var _clubData3 = app.ClubManager().GetClubDataByClubID(this.nowClubID);
            this.myisminister = _clubData3.minister;
            if (this.myisminister > 0) {
                this.FormManager.ShowForm('ui/club/UIClubRoomList', this.nowClubID);
            } else {
                app.SysNotifyManager().ShowSysMsg('您不是管理员');
            }
        } else if (btnName == "btn_message") {
            var _clubData4 = app.ClubManager().GetClubDataByClubID(this.nowClubID);
            this.myisminister = _clubData4.minister;
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
            wanfaNode.active = false;
            // if(wanfaNode.active==true){
            //     wanfaNode.active=false;
            // }else{
            //     wanfaNode.active=true;
            // }
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
        } else if ('btn_qhwf_wanfa' == btnName) {
            var _sendPack2 = {
                "clubId": this.nowClubID,
                "roomKey": btnNode.parent.roomKey
            };
            var _packName = "club.CClubRoomInfoDetails";
            var _self3 = this;
            if (this.unionId > 0) {
                _sendPack2.unionId = this.unionId;
                _packName = "union.CUnionRoomInfoDetails";
            }
            app.NetManager().SendPack(_packName, _sendPack2, function (serverPack) {
                _self3.FormManager.ShowForm('ui/club/UIClubRoomWanFa', serverPack);
            }, function () {
                app.SysNotifyManager().ShowSysMsg("获取房间详细配置失败", [], 3);
            });
        } else if ('btn_zhanji' == btnName || 'btn_unionRecord' == btnName) {
            if (this.nowClubID > 0) {
                var _clubData5 = app.ClubManager().GetClubDataByClubID(this.nowClubID);
                this.myisminister = _clubData5.minister;
                if (this.myisminister > 0) {
                    this.FormManager.ShowForm('ui/club/UIClubRecordList', this.nowClubID, this.unionId, this.nowClubName, this.unionPostType, this.myisminister);
                } else {
                    this.FormManager.ShowForm("ui/club/UIClubRecordUserDay", this.nowClubID, this.unionId);
                    // app.SysNotifyManager().ShowSysMsg('亲友圈战绩仅管理员可查看');
                }
            } else {
                app.SysNotifyManager().ShowSysMsg('您尚未加入任何亲友圈');
            }
        } else if (btnName == "btn_addRoomCard" || btnName == "btn_shop") {
            if (this.nowClubID < 0) {
                app.SysNotifyManager().ShowSysMsg('您尚未加入任何亲友圈');
                return;
            }
            this.FormManager.ShowForm('ui/club/UIClubStore', this.nowClubID, this.nowClubName);
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
        } else {
            //this.left.active=false;
            /*this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active=true;
            this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active=false;*/
        }
    },
    OnClose: function OnClose() {
        app.ClubManager().OutClubUI();
        this.unschedule(this.RunRoomDisplay);
        this.FormManager.CloseForm("ui/club/UIClubInRoom");
        this.left.active = true;
        this.node.getChildByName('bottom').getChildByName('btn_qhqyq').active = false;
        this.node.getChildByName('bottom').getChildByName('btn_ycqyq').active = false;
    },
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
            if (this.inRoom) {
                if ('MSG_CLUB_CHANGEROOM' == msgID) {
                    this.Click_btn_goRoom();
                }
            }
            return;
        }
        var self = this;
        if ('MSG_CLUB_DissolveRoomCfg' == msgID) {
            var _roomData = backArgList[0];
            var jesanState = app.ClubManager().Enum_RoomCfg_Delete;
            app.ClubManager().SendSetRoomCfg(this.clubId, _roomData.gameIndex, jesanState);
        } else if ('MSG_CLUB_DissolveRoom' == msgID) {
            app.ClubManager().SendCloseClub(this.clubId);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        } else if ('MSG_CLUB_EXIT' == msgID) {
            app.ClubManager().SendPlayerStateChange(this.clubId, app.HeroManager().GetHeroProperty("pid"), app.ClubManager().Enum_Leave);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        } else if ('MSG_CLUB_RoomCard_Not_Enough' == msgID) {
            var clubId = backArgList[0];
            for (var i = 0; i < this.clubCardNtfs.length; i++) {
                if (this.clubCardNtfs[i].clubId == clubId) {
                    this.clubCardNtfs.splice(i, 1);
                    break;
                }
            }
            if (0 != this.clubCardNtfs.length) {
                var data = this.clubCardNtfs[0];
                setTimeout(function () {
                    app.SysNotifyManager().ShowSysMsg('MSG_CLUB_RoomCard_Not_Enough', [data.clubName, data.roomcardattention]);
                }, 200);
            }
        } else if ('MSG_CLUB_KICKPlayer' == msgID) {
            var _data = backArgList[0];
            app.ClubManager().SendPlayerStateChange(_data.clubId, _data.pid, _data.kickState);
        } else if ('MSG_CLUB_CHANGEROOM' == msgID) {
            app.Client.ChangeRoomCheckSubGame(this.changeInfo.gameName, this.changeInfo.roomKey, this.nowClubID, undefined, this.changeInfo.password);
        } else if ("MSG_OUT_RACE" == msgID) {
            this.SendPackUnionApply();
        } else if ('MSG_GO_ROOM' == msgID) {
            this.Click_btn_goRoom();
        }
    },
    Click_btn_goRoom: function Click_btn_goRoom() {
        var curGameType = this.ShareDefine.GametTypeID2PinYin[this.inRoomInfo.gameId];
        app.Client.SetGameType(curGameType);
        this.FormManager.ShowForm("UIDownLoadGame", curGameType, 0, null, 0, 0, true);
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
            } else if (lbBtnName.string == "申请复赛") {
                app.SysNotifyManager().ShowSysMsg('您的复赛申请等待审批中，请联系赛事举办方');
            } else if (lbBtnName.string == "取消退赛") {
                app.SysNotifyManager().ShowSysMsg('取消申请退赛成功');
            }
            if (serverPack == 1) {
                //比赛进行中
                lbBtnName.string = "我要退赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = self.btn_outRaceSprite[1];
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(78, 78, 78);
            } else if (serverPack == 2) {
                //复赛申请中
                lbBtnName.string = "申请复赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = self.btn_outRaceSprite[0];
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(124, 64, 32);
            } else if (serverPack == 3) {
                //退赛申请中
                lbBtnName.string = "取消退赛";
                unionNode.getChildByName("btn_outRace").getComponent(cc.Sprite).spriteFrame = self.btn_outRaceSprite[0];
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").color = new cc.Color(255, 255, 255);
                unionNode.getChildByName("btn_outRace").getChildByName("lb_btnName").getComponent(cc.LabelOutline).color = new cc.Color(124, 64, 32);
            }
        }, function (error) {});
    },

    OnEventToggleHideRoom: function OnEventToggleHideRoom(event) {
        if (event.isChecked) {
            cc.sys.localStorage.setItem('isToggleHideRoom', "1");
        } else {
            cc.sys.localStorage.setItem('isToggleHideRoom', "2");
        }
        for (var i = 0; i < this.right_layout.children.length; i++) {
            for (var j = 0; j < this.roomList.length; j++) {
                if (this.roomList[j].roomKey == this.right_layout.children[i].roomKey) {
                    if (this.right_layout.children[i].isDisplay == true) {
                        this.ShowRoomData(this.right_layout.children[i], this.roomList[j]);
                    }
                }
            }
        }
    },
    OnEvent_SpeedTest: function OnEvent_SpeedTest(event) {
        var YanCi = event['yanci'];
        this.lb_signal.string = YanCi + " ms";
        if (YanCi < 300) {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.icon_signal[3];
        } else if (YanCi < 500) {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.icon_signal[2];
        } else if (YanCi < 1000) {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.icon_signal[1];
        } else {
            this.bg_signal.getComponent(cc.Sprite).spriteFrame = this.icon_signal[0];
        }
    },
    ShowUnionTip: function ShowUnionTip() {
        var isNoTip = cc.sys.localStorage.getItem(this.unionId + "_NoTipUnion");
        if (parseInt(isNoTip) == 1) {
            return;
        }
        var showTipUnionTime = cc.sys.localStorage.getItem(this.unionId + "_ShowTipUnion");
        if (showTipUnionTime == null || typeof showTipUnionTime == "undefined") {
            cc.sys.localStorage.setItem(this.unionId + "_ShowTipUnion", app.ServerTimeManager().GetServerTimeData());
            app.FormManager().ShowForm("ui/club/UIUnionTip", this.unionId, this.unionName, this.ownerClubName, this.nowClubName);
            return;
        }
        var day = app.ComTool().GetDayDiffByTick(parseInt(showTipUnionTime), app.ServerTimeManager().GetServerTimeData());
        if (day > 0) {
            cc.sys.localStorage.setItem(this.unionId + "_ShowTipUnion", app.ServerTimeManager().GetServerTimeData());
            app.FormManager().ShowForm("ui/club/UIUnionTip", this.unionId, this.unionName, this.ownerClubName, this.nowClubName);
        }
    },
    ShowUnionRankTip: function ShowUnionRankTip(clubData) {
        if (clubData.existRound == 1) {
            app.ClubManager().SetClubDataByClubID(clubData.id, "existRound", 0);
            app.FormManager().ShowForm("ui/club/UIUnionRankTip", this.unionName, clubData.unionRankingItem);
        }
    },
    ShowUnionStateType: function ShowUnionStateType(unionStateType) {
        var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
        if (unionStateType == 0) {
            //启用
            unionNode.getChildByName('img_bjl').getChildByName('lb_raceTime').active = true;
            unionNode.getChildByName('img_bjl').getChildByName('lb_title_1').getComponent(cc.Label).string = "赛事进行中";
        } else if (unionStateType == 1) {
            //停用
            unionNode.getChildByName('img_bjl').getChildByName('lb_raceTime').active = false;
            unionNode.getChildByName('img_bjl').getChildByName('lb_title_1').getComponent(cc.Label).string = "赛事停用中";
        } else if (unionStateType == 2) {
            //盟主配置的奖励不足
            if (this.unionPostType == app.ClubManager().UNION_CREATE) {
                app.SysNotifyManager().ShowSysMsg('您所设置赛事奖励所需道具不足，请重新修改奖励数量，赛事所需奖励将从您的身上预扣除');
            }
            unionNode.getChildByName('img_bjl').getChildByName('lb_raceTime').active = false;
            unionNode.getChildByName('img_bjl').getChildByName('lb_title_1').getComponent(cc.Label).string = "赛事停用中";
        }
        unionNode.getChildByName('img_bjl').getChildByName('lb_raceTime').active = false;
        unionNode.getChildByName('img_bjl').getChildByName('lb_title_1').active = false;
    },
    //---------刷新函数--------------------
    OnUpdate: function OnUpdate() {
        var serverTimeTick = app.ServerTimeManager().GetServerTimeData();
        if (this.endRoundTime || this.endRoundTime < serverTimeTick) {
            var endRoundTimeStr = app.ServerTimeManager().GetCDTimeStringBySec(this.endRoundTime, app.ShareDefine().DayHourMinuteSecond);
            var unionNode = this.node.getChildByName('bottom').getChildByName('unionNode');
            unionNode.getChildByName('img_bjl').getChildByName('lb_raceTime').getComponent(cc.Label).string = endRoundTimeStr;
        }
    },
    //需要重写
    CheckSkinType: function CheckSkinType(clubData) {}
});

module.exports = BaseClubMainForm;

cc._RF.pop();