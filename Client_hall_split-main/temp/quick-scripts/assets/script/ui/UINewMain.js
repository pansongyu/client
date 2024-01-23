(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UINewMain.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c7fb0nMNvZJ4bnfUVrYPGku', 'UINewMain', __filename);
// script/ui/UINewMain.js

"use strict";

var app = require("app");
var SubgameManager = require('SubgameManager');
cc.Class({
    extends: require("BaseForm"),
    properties: {
        resVersion: cc.Label,
        appVersion: cc.Label,
        lb_heroName: cc.Label,
        lb_heroID: cc.Label,
        node_head: cc.Node,
        gameLayout: cc.Node,
        rightTop: cc.Node,
        btn_GameDemo: cc.Node,
        lb_curCity: cc.Label,
        btn_joinClub: cc.Node,
        joinClubSprite: [cc.SpriteFrame],
        logo: cc.Node,
        logoSprite: [cc.SpriteFrame]
    },
    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.NetManager = app.NetManager();
        this.curType = {
            'mahjong': 0,
            'poker': 1,
            'other': 2
        };
        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.curGameType = this.curType.other;
        //this.node.getChildByName('left').getChildByName('layout').active=false;
        //this.RegEvent("CLOSEMOREPOP", this.CloseMorePop, this);
        this.RegEvent("GetCurRoomID", this.Event_GetCurRoomID, this);
        this.RegEvent("CodeError", this.Event_CodeError, this);
        this.RegEvent("OutRoom", this.Event_OutRoom, this);
        this.RegEvent("HeroProperty", this.Event_HeroProperty, this);
        this.RegEvent("OnGetClipboardTextNtf", this.Event_GetClipboardText, this);
        this.RegEvent("ShowGameListByLocation", this.Event_ShowGameListByLocation, this);
        this.NetManager.RegNetPack("SBase_Dissolve", this.OnPack_DissolveRoom, this);
        if (this.IsIphoneX() == true) {
            var widge = this.node.getChildByName('bottom').getChildByName('left').getComponent(cc.Widget);
            widge.left = 80;
            var widge2 = this.node.getChildByName('bottom').getChildByName('layout').getComponent(cc.Widget);
            widge2.left = 123;
        }
        this.WeChatHeadImage1 = this.node_head.getComponent("WeChatHeadImage");
        if (!cc.sys.isNative) {
            app.NativeManager().CallToNative("checkHaveLocationPermission", []);
        }
        this.RegEvent("OnUpdateGameEnd", this.ReloadGameList, this);
        //检测用户是否是闲聊登录直接绑定
        var XlOpenID = app['XlOpenID'];
        if (XlOpenID) {
            app['XlOpenID'] = "";
            app.NetManager().SendPack("game.CPlayerXLUnionid", { "xlUnionid": XlOpenID });
        }
        //检测系统
        if (cc.sys.isNative) {
            var isIos = app.ComTool().IsIOS();
            var isAndroid = app.ComTool().IsAndroid();
            if (isIos) {
                app.NetManager().SendPack("player.CPlayerAppOs", { "type": 2 });
            } else if (isAndroid) {
                app.NetManager().SendPack("player.CPlayerAppOs", { "type": 1 });
            }
        }
        if (app["tanchuang"] == 1) {

            //检测活动
            app.NetManager().SendPack("popup.CPopupList", { "type": 1 }, function (event) {
                if (event.length > 0) {
                    app.FormManager().ShowForm("UIActivity", event);
                }
            }, function () {});
            /*app.NetManager().SendPack("game.CPlayerCheckPhone", {}, function(event){
                if (event == "0") {
                    app.FormManager().ShowForm("UIBangdingshouji");
                }
            }, function(error){
                console.error(error);
            });*/
            app["tanchuang"] = 0;
        }
        //初始化备注
        this.ComTool.GetBeiZhu(true);
        app.LocationOnStartMgr().OnGetLocation();
        //检查用户是否需要下载IOS上架包
        this.CheckIOSDown();
        var layout = this.node.getChildByName('bottom').getChildByName('layout');
        if (app.Config) {
            layout.getChildByName('btn_more').active = !!app.Config.more;
            layout.getChildByName('btn_qiandao').active = !!app.Config.signIn;
            layout.getChildByName('btn_share').active = app.Config.share && app.Config.share.length > 3;
            var layoutR = this.node.getChildByName('bottom').getChildByName('layoutRight');
            layoutR.getChildByName('btn_daili').active = !!app.Config.promoter;
        }
        var activeCount = 0;
        for (var index = 0; index < layout.childrenCount; index++) {
            var element = layout.children[index];
            if (element.active) activeCount++;
        }
        if (activeCount >= 7) {
            layout.getComponent(cc.Layout).spacingX = 45 - (activeCount - 6) * 10;
        }
        if (!app.Config.promoter) {
            layout = this.node.getChildByName('bottom').getChildByName("left").getChildByName('layout');
            layout.getChildByName('btn_zengsong').active = false;
            layout.getChildByName('btn_bangdingtuiguang').active = false;
        }
        layout = this.node.getChildByName('bottom').getChildByName("left").getChildByName('layout');
        layout.getChildByName('btn_wanfa').active = !!app.Config.wanfa;
    },
    OnPack_DissolveRoom: function OnPack_DissolveRoom(serverPack) {
        this.Event_OutRoom();
    },
    CheckIOSDown: function CheckIOSDown() {
        if (cc.sys.isNative) {
            var isIos = app.ComTool().IsIOS();
            // isIos=true;
            if (isIos) {
                var pack = cc.sys.localStorage.getItem("myPack");
                var pack2 = cc.sys.localStorage.getItem("myPack2");
                //   pack=null;
                //   pack2=null;
                if (pack != "hall_split" && pack2 != "hall_split") {
                    //不是IOS上架包
                    var version = cc.sys.localStorage.getItem('version');
                    //    version="1.1.1";
                    if (version) {
                        if (version.indexOf(".10.") > -1) {
                            //0.10.0，这种版本号给国搜使用
                            return;
                        }
                        var AccountActive = app.LocalDataManager().GetConfigProperty("Account", "AccountActive");
                        //AccountActive=2000;
                        if (AccountActive > 1000) {
                            //活跃度超过1000，没有下载上架包的用户下载上架包
                            this.IOSUrl = "http://code.qicaiqh.com/mygame_ios.php?game=hall_split&pid=" + app.HeroManager().GetHeroProperty("pid");
                            this.SendHttpRequest(this.IOSUrl, "", "GET", {});
                        }
                    }
                }
            }
        }
    },

    //-----------------显示函数------------------
    OnShow: function OnShow() {
        this.ChangeLogo();
        app.SceneManager().PlayMusic();
        var self = this;
        // app.ForceUpdateMgr().Check();
        this.scheduleOnce(function () {
            app.ForceUpdateMgr().Check();
            // self.ReloadGameList();
        }, 2); //延迟2秒再次检测是否更新
        this.ReloadHeroData();
        app.Client.SetGameType('');
        //请求亲友圈数据
        //app.ClubManager().SendReqClubData();
        app.ClubManager().SendGetClubInviteList();
        app.ClubManager().SendGetUnionInviteList();
        this.curRoomID = 0;
        this.curRoomKey = 0;
        this.curGameTypeStr = '';
        this.node.getChildByName('bottom').getChildByName('left').getChildByName('layout').active = false;
        app.GameManager().SetGetRoomIDByUI(true);
        //检测是否标记不用检测在房间
        var checkRoom = true;
        if (typeof app["notCheckRoom"] != "undefined") {
            if (app["notCheckRoom"] == true) {
                checkRoom = false;
                app["notCheckRoom"] = false;
            }
        }
        if (checkRoom == true) {
            app.NetManager().SendPack("game.C1101GetRoomID", {});
        }
        //获取后台开关是否需要检测子游戏热更
        // this.CheckHotUpdate="http://qh.qinghuaimajiang.com/index.php?module=Api&action=OnlineStatus";
        // this.SendHttpRequest(this.CheckHotUpdate,"", "GET",{});

        if (cc.sys.isNative) {
            this.appVersion.string = '';
            this.resVersion.string = "resV" + app.HotUpdateMgr().getLocalVersion();
        } else {
            this.appVersion.string = '';
            this.resVersion.string = '';
        }
        app.GameManager().SetAutoPlayIng(false);
        this.FormManager.CloseForm("UIAutoPlay");
        this.FormManager.ShowForm("UINoticeBar");

        this.getGameId(); //获取游戏ID

        this.ShowHero_NameOrID();
        app.Client.SetFirstLogin();

        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowClubCard();

        this.ShowAddClubSprite();

        //检测分享  
        var myDate = new Date();
        var date = myDate.getDate();
        var setDay = this.LocalDataManager.GetConfigProperty("SysSetting", "Date");
        // if(date!=setDay){
        //     this.FormManager.ShowForm('UITanChuang');
        //     this.LocalDataManager.SetConfigProperty("SysSetting", "Date",date);
        // }
        //更新活跃度
        // app.NetManager().SendPack("base.C1005PlayerInfo", {});
        var heroID = app.HeroManager().GetHeroProperty("pid");
        // if (cc.sys.isNative) {
        //     this.ChouJiangUrl='http://fb.qicaiqh.com/index.php?module=Api&action=GetLuckGoods';
        //     this.WenJuanUrl="http://fb.qicaiqh.com/mu?module=Api&action=GetQuestionnaire&pid="+heroID;
        //     this.IpUrl='http://fb.qicaiqh.com/myip.php';
        //     this.KeFuUrl = "http://fb.qicaiqh.com/index.php?module=Api&action=Contact";
        // }else{
        //     this.ChouJiangUrl='http://tfb.qicaiqh.com/index.php?module=Api&action=GetLuckGoods';
        //     this.WenJuanUrl="http://tfb.qicaiqh.com/mu?module=Api&action=GetQuestionnaire&pid="+heroID;
        //     this.IpUrl='http://tfb.qicaiqh.com/myip.php';

        // }
        // this.SendHttpRequest(this.IpUrl, "?playerID="+heroID, "GET",{});
        var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
        if (httpPath[httpPath.length - 1] == "/") {
            httpPath = httpPath.substring(0, httpPath.length - 1);
        }
        this.KeFuUrl = httpPath + "/index.php?module=Api&action=Contact";
        this.SendHttpRequest(this.KeFuUrl, "", "GET", {});
        // this.SendHttpRequest(this.WenJuanUrl, "","GET",{});
        var that = this;
        app.NetManager().SendPack("family.CPlayerCheckFamilyOwner", {}, function (success) {
            that.node.getChildByName('bottom').getChildByName('left').getChildByName('layout').getChildByName('btn_zengsong').active = !!app.Config.promoter;
        }, function (error) {
            that.node.getChildByName('bottom').getChildByName('left').getChildByName('layout').getChildByName('btn_zengsong').active = false;
        });
        //this.RunSwitchGameAction();
        //this.RunRecordAction();
        //检测是否实名
        // if(app["isShowShiMing"]!=1){
        //     let realNumber=app.HeroManager().GetHeroProperty("realNumber"); 
        //     let realName=app.HeroManager().GetHeroProperty("realName"); 
        //     if(!realNumber || !realName){
        //         app["isShowShiMing"]=1;
        //         let appName=cc.sys.localStorage.getItem('appName');
        //         if (appName!="baodao") {
        //             this.FormManager.ShowForm("UIShiMing");
        //         }
        //     }
        // }
    },

    getGameId: function getGameId() {

        //固定城市Id,获取gameId
        var SelectId = cc.sys.localStorage.getItem("myCityID", 0);
        var cityId = app.Client.GetClientConfigProperty("CityID");
        if (cityId && Number(cityId) > 100) {
            SelectId = Number(cityId);
            this.node.getChildByName("rightTop").getChildByName("btn_location").active = false;
        }
        var self = this;
        app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": SelectId }, function (event) {
            app.HeroManager().UpdateCity(SelectId); //记录选择的城市
            app.Client.allGameIdFormServer = event.split(","); //记录获取的游戏Id
            var curSelectGameList = app.Client.GetAllGameId();
            var argDict = {
                "gameList": curSelectGameList
            };
            //记录用户选择的城市，城市节点使用
            self.isShowCity = true;
            cc.sys.localStorage.setItem("myCityID", SelectId);
            self.Event_ShowGameListByLocation(argDict);
        }, function (event) {
            console.log("UINewMain:获取游戏id失败");
        });

        //显示选择城市界面
        this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
        if (this.allSelectCityData.length == 0 || this.isFirstLogin() == true) {
            this.isShowCity = false;
            var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
            this.CityUrl = httpPath + "/index.php?module=Home&action=CityList";
            this.SendHttpRequest(this.CityUrl, "", "GET", {});
            //this.FormManager.ShowForm("UISelectCity");
            this.scheduleOnce(function () {
                if (this.isShowCity == false) {
                    this.FormManager.ShowForm("UISelectCity");
                }
            }, 4); //延迟4秒如果没成功定位城市，弹出定位城市UISelectCity

            this.lb_curCity.string = "";
        } else {
            //非常规切换可能导致配表丢失
            if (!this.selectCityConfig) {
                this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
            }
            if (!this.selectCityConfig) {
                app.SysNotifyManager().ShowSysMsg('游戏配置丢失，请重启游戏');
            } else {
                var cityInfo = this.selectCityConfig[this.allSelectCityData[0]['selcetId']];
                console.log("curSelectID === " + this.allSelectCityData[0]['selcetId']);

                /*if(this.allSelectCityData[0]['selcetId']==1100300 || this.allSelectCityData[0]['selcetId']==1100301){
                    //南阳自动退出游戏
                    cc.game.end();
                }*/

                if (cityInfo) {
                    console.log("curSelectName === " + cityInfo.Name);
                    this.lb_curCity.string = cityInfo.Name;
                } else {
                    console.log("selectCityConfig == " + JSON.stringify(this.selectCityConfig));
                    console.log("配表中找不到该城市，检查配表。id：" + this.allSelectCityData[0]['selcetId']);
                }
                var curSelectGameList = app.Client.GetAllGameId();
                console.log("curSelectGameList === " + JSON.stringify(curSelectGameList));
                var argDict = {
                    "gameList": curSelectGameList
                };
                this.Event_ShowGameListByLocation(argDict);
            }
        }
    },

    isFirstLogin: function isFirstLogin() {
        var isFirstLogin = cc.sys.localStorage.getItem("isFirstLogin");
        if (isFirstLogin == null || typeof isFirstLogin == "undefined") {
            cc.sys.localStorage.setItem("isFirstLogin", "1");
            return true;
        } else {
            return false;
        }
    },
    RunRecordAction: function RunRecordAction() {
        console.log("RunRecordAction 111");
        // let allSwitchGameData = app.PlayerDataManager().GetSwitchGameData();
        var allSwitchGameData = [];
        var switchRecord = cc.sys.localStorage.getItem("switchRecord");
        console.log("RunRecordAction switchRecord:" + switchRecord);
        if (switchRecord != "") {
            console.log("RunRecordAction switchRecord parse");
            allSwitchGameData.push(JSON.parse(switchRecord));
        }
        console.log("RunRecordAction switchRecord allSwitchGameData length:" + allSwitchGameData.length);
        for (var i = 0; i < allSwitchGameData.length; i++) {
            if (!allSwitchGameData[i]) return;
            var action = allSwitchGameData[i].action;
            console.log("RunRecordAction switchRecord action:" + action);
            switch (action) {
                case 'OpenUIRecordAllResult':
                    app.FormManager().ShowForm("UIRecordAllResult", allSwitchGameData[i].roomId, allSwitchGameData[i].playerAll, allSwitchGameData[i].gameType, allSwitchGameData[i].unionId, allSwitchGameData[i].roomKey, allSwitchGameData[i].page);
                    break;
                default:
                    console.log('未知动作: ' + action);
                    break;
            }
        }
        app.PlayerDataManager().ClearSwitchGameData();
        cc.sys.localStorage.setItem("switchRecord", "");
    },
    RunSwitchGameAction: function RunSwitchGameAction() {
        console.log("RunSwitchGameAction 111");
        //返回大厅检测下是否有需要处理的数据
        // let allSwitchGameData = app.PlayerDataManager().GetSwitchGameData();
        var allSwitchGameData = [];
        var switchGameData = cc.sys.localStorage.getItem("switchGameData");
        if (switchGameData != "") {
            allSwitchGameData.push(JSON.parse(switchGameData));
        }
        for (var i = 0; i < allSwitchGameData.length; i++) {
            if (!allSwitchGameData[i]) return;
            console.log("allSwitchGameData[i].action");
            var action = allSwitchGameData[i].action;
            switch (action) {
                case 'showForm':
                    this.FormManager.ShowForm(allSwitchGameData[i].fromName);
                    break;
                case 'openClub':
                    this.OnClick("btn_joinClub", null);
                    break;
                case 'OpenUIRecordAllResult':
                    var smallName = app.ShareDefine().GametTypeID2PinYin[allSwitchGameData[i].gameType];
                    var path = "ui/uiGame/" + smallName + "/UIRecordAllResult_" + smallName;
                    app.FormManager().ShowForm(path, allSwitchGameData[i].roomId, allSwitchGameData[i].playerList, allSwitchGameData[i].gameType, allSwitchGameData[i].unionId, allSwitchGameData[i].page);
                    break;
                default:
                    console.log('未知动作: ' + action);
                    break;
            }
        }
        app.PlayerDataManager().ClearSwitchGameData();
        cc.sys.localStorage.setItem("switchGameData", "");
    },

    ReloadGameList: function ReloadGameList() {
        var curSelectGameList = app.Client.GetAllGameId();
        console.log("ReloadGameList GameList === " + JSON.stringify(curSelectGameList));
        var argDict = {
            "gameList": curSelectGameList
        };
        this.Event_ShowGameListByLocation(argDict);
    },

    ReloadHeroData: function ReloadHeroData() {
        //请求刷新玩家数据
        console.log("请求刷新玩家数据");
        app.NetManager().SendPack("player.CPlayerChanged", {});
    },

    Event_ShowGameListByLocation: function Event_ShowGameListByLocation(event) {
        var _this = this;

        this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
        if (this.allSelectCityData.length == 0) {
            this.FormManager.ShowForm("UISelectCity");
            this.lb_curCity.string = "";
        } else {
            var cityInfo = this.selectCityConfig[this.allSelectCityData[0]['selcetId']];
            if (!cityInfo) {
                this.FormManager.ShowForm("UISelectCity");
                this.lb_curCity.string = "";
                return;
            }
            this.lb_curCity.string = cityInfo.Name;
        }
        //this.gameLayout.removeAllChildren();
        this.DestroyAllChildren(this.gameLayout);
        var gameList = event.gameList;
        if (gameList.length == 0) {
            //重新获取
            app.Client.GetAllGameIdFromServer(true);
        }
        var appName = this.GetAppName();

        var _loop = function _loop() {
            var gameName = app.ShareDefine().GametTypeID2PinYin[gameList[i]];
            var btn_game = cc.instantiate(_this.btn_GameDemo);
            btn_game.name = "btn_" + gameName;
            if (cc.sys.isNative) {
                if (SubgameManager.isSubgameDownLoad(gameName)) {
                    btn_game.getChildByName("loadingMask").active = false;
                    btn_game.getChildByName("lb_download").getComponent(cc.Label).string = "";
                    btn_game.getChildByName("img_xiazai").active = false;
                    //已下载，判断是否需要更新
                    SubgameManager.needUpdateSubgame(gameName, function (success) {
                        if (success) {
                            //子游戏需要更新;
                            btn_game.getChildByName("img_gengxin").active = true;
                        } else {
                            //子游戏不需要更新;
                            btn_game.getChildByName("img_gengxin").active = false;
                        }
                    }, function () {
                        console.log("子游戏更新失败");
                        btn_game.getChildByName("img_gengxin").active = false;
                    });
                } else {
                    btn_game.getChildByName("loadingMask").active = false;
                    // btn_game.getChildByName("lb_download").getComponent(cc.Label).string = "未下载";
                    btn_game.getChildByName("img_xiazai").active = true;
                    btn_game.getChildByName("img_gengxin").active = false;
                }
            } else {
                btn_game.getChildByName("loadingMask").active = false;
                // btn_game.getChildByName("lb_download").getComponent(cc.Label).string = "未下载";
            }
            if (!_this.gametypeConfig[gameList[i]]) {
                console.log("未找到游戏id：" + gameList[i]);
                return "continue";
            }
            var imgName = _this.gametypeConfig[gameList[i]]["imgUrl"];
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
            //     if (!btn_game || !cc.isValid(btn_game)) return
            //     btn_game.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            // });
            btn_game.active = true;
            _this.gameLayout.addChild(btn_game);
        };

        for (var i = 0; i < gameList.length; i++) {
            var _ret = _loop();

            if (_ret === "continue") continue;
        }
        this.ShowRoomCard();
        this.ShowClubCard();
    },

    Event_HeroProperty: function Event_HeroProperty(event) {
        var argDict = event;
        if (argDict["Property"] == "gold") {
            this.ShowFastCount();
        } else if (argDict["Property"] == "roomCard") {
            this.ShowRoomCard();
        } else if (argDict["Property"] == "clubCard") {
            this.ShowClubCard();
        } else if (argDict["Property"] == "name") {
            this.lb_heroName.string = argDict["name"].substr(0.9);
        } else if (argDict["Property"] == "headimg") {
            var heroID = app.HeroManager().GetHeroProperty("pid");
            this.WeChatHeadImage1.ShowHeroHead(heroID);
        }
    },

    Event_GetClipboardText: function Event_GetClipboardText(event) {
        if (0 == event.code) this.ShowSysMsg("已获取剪切板信息：" + event.msg);else this.ShowSysMsg("剪切板没有东西");
    },
    ShowFastCount: function ShowFastCount() {
        var gold = app.HeroManager().GetHeroProperty('gold');
        this.rightTop.getChildByName('ledou').getChildByName('label').getComponent(cc.Label).string = gold;
    },
    ShowRoomCard: function ShowRoomCard() {
        var heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.rightTop.getChildByName('fangka').getChildByName('label').getComponent(cc.Label).string = heroRoomCard;
    },
    ShowClubCard: function ShowClubCard() {
        var heroClubCard = app.HeroManager().GetHeroProperty("clubCard");
        this.rightTop.getChildByName('quanka').getChildByName('label').getComponent(cc.Label).string = heroClubCard;
    },
    ShowHero_NameOrID: function ShowHero_NameOrID() {
        var i = 0;
        var isGetHeroData = false;
        while (i < 30 || !isGetHeroData) {
            var heroName = app.HeroManager().GetHeroProperty("name");
            if (typeof heroName == "string") {
                var heroID = app.HeroManager().GetHeroProperty("pid");
                this.lb_heroName.string = this.ComTool.GetBeiZhuName(heroID, heroName, 9);
                this.lb_heroID.string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) });
                if (this.WeChatHeadImage1) {
                    this.WeChatHeadImage1.ShowHeroHead(heroID);
                }
                isGetHeroData = true;
                break;
            } else {
                i++;
            }
        }
        //如果还是没取到玩家信息，重新登录
        if (!isGetHeroData) {
            this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", {});
            console.log("玩家信息获取失败，切换账号");
            app.Client.LogOutGame(1);
        }
    },

    ShowAddClubSprite: function ShowAddClubSprite() {
        var last_club_data = app.ClubManager().GetLastClubData();
        if (last_club_data != null) {
            this.isEnterLastClub = true;
            this.btn_joinClub.getComponent(cc.Sprite).spriteFrame = this.joinClubSprite[1];
            this.btn_joinClub.getChildByName("lb_clubName").getComponent(cc.Label).string = last_club_data.club_data.name;
        } else {
            var self = this;
            app.NetManager().SendPack("club.CGetClubListMin2", {}, function (serverPack) {
                if (serverPack.length == 0) {
                    self.isEnterLastClub = false;
                    self.btn_joinClub.getComponent(cc.Sprite).spriteFrame = self.joinClubSprite[0];
                    self.btn_joinClub.getChildByName("lb_clubName").getComponent(cc.Label).string = "";
                } else {
                    // app.ClubManager().SetLastClubData(serverPack[0].id, serverPack[0].clubsign, serverPack[0].name);//, serverPack[0].showUplevelId, serverPack[0].showClubSign
                    self.isEnterLastClub = true;
                    self.btn_joinClub.getComponent(cc.Sprite).spriteFrame = self.joinClubSprite[1];
                    self.btn_joinClub.getChildByName("lb_clubName").getComponent(cc.Label).string = serverPack[0].name;
                }
            }, function () {
                self.isEnterLastClub = false;
                self.btn_joinClub.getComponent(cc.Sprite).spriteFrame = '';
                self.btn_joinClub.getChildByName("lb_clubName").getComponent(cc.Label).string = "";
            });
        }
    },

    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 2000, this.OnReceiveHttpPack.bind(this), this.OnConnectHttpFail.bind(this), null, this.OnConnectHttpFail.bind(this));

        // var url = [serverUrl, argString].join("")

        // var dataStr = JSON.stringify(sendPack);

        // //每次都实例化一个，否则会引起请求结束，实例被释放了
        // var httpRequest = new XMLHttpRequest();

        // httpRequest.timeout = 2000;


        // httpRequest.open(requestType, url, true);
        // //服务器json解码
        // httpRequest.setRequestHeader("Content-Type", "application/json");
        // var that = this;
        // httpRequest.onerror = function(){
        //     that.ErrLog("httpRequest.error:%s", url);
        //     that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        // };
        // httpRequest.ontimeout = function(){

        // };
        // httpRequest.onreadystatechange = function(){
        //     //执行成功
        //     if (httpRequest.status == 200){
        //         if(httpRequest.readyState == 4){
        //             that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
        //         }
        //     }
        //     else{
        //         that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        //         that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
        //     }
        // };
        // httpRequest.send(dataStr);
    },
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);
            if (serverUrl == this.KeFuUrl) {
                app['KeFuHao'] = serverPack.data[0].contact;
            } else if (serverUrl == this.IpUrl) {
                if (serverPack["IsSuccess"] == 1) {
                    //发送ip给服务端
                    this.NetManager.SendPack("game.CPlayerIpAddress", { "ip": serverPack.myip });
                }
            } else if (serverUrl == this.ChouJiangUrl) {
                this.choujiangSprs = [];
                for (var i = 0; i < serverPack.data.length; i++) {
                    this.CreateUrlSpriteFrame(serverPack.data[i].url, serverPack.data[i].id, serverPack.data);
                }
            } else if (serverUrl == this.IOSUrl) {
                if (serverPack["IsSuccess"] == 1) {
                    this.FormManager.ShowForm("UIMessageUpdate", serverPack.url);
                }
            } else if (serverUrl == this.WenJuanUrl) {
                if (serverPack.code == 200) {
                    this.FormManager.ShowForm("UIWenJuan", serverPack.data);
                }
            } else if (serverUrl == this.CityUrl) {
                if (serverPack.code == 200) {
                    var SelectId = serverPack.data[0].cityid;
                    if (SelectId == 0) {
                        return;
                    }
                    if (this.selectCityConfig[SelectId]["Type"] != 3) {
                        return;
                    }
                    var self = this;
                    app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": SelectId }, function (event) {
                        app.Client.allGameIdFormServer = event.split(",");
                        var curSelectGameList = app.Client.GetAllGameId();
                        var argDict = {
                            "gameList": curSelectGameList
                        };
                        //记录用户选择的城市，城市节点使用
                        self.isShowCity = true;
                        cc.sys.localStorage.setItem("myCityID", self.SelectId);
                        self.Event_ShowGameListByLocation(argDict);
                    }, function (event) {
                        //console.log("获取游戏id失败");
                    });
                } else {
                    this.isShowCity = true;
                    this.FormManager.ShowForm("UISelectCity");
                }
            } else if (serverUrl == this.CheckHotUpdate) {
                if (serverPack.code == 300) {
                    app['isNeedCheckHotUpdate'] = false;
                    console.log("后台设置无需检测更新:" + app['isNeedCheckHotUpdate']);
                } else {
                    app['isNeedCheckHotUpdate'] = true;
                }
            }
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},

    //创建url贴图对象
    CreateUrlSpriteFrame: function CreateUrlSpriteFrame(resServerUrl, id, data) {
        var that = this;
        cc.loader.load({ url: resServerUrl, type: 'png' }, function (err, texture) {
            if (texture instanceof cc.Texture2D) {
                var spriteFrame = new cc.SpriteFrame(texture);
                var tempObj = { "id": id, "spriteFrame": spriteFrame };
                that.choujiangSprs.push(tempObj);
                if (that.choujiangSprs.length == 12) {
                    that.FormManager.ShowForm("UIChouJiang", data, that.choujiangSprs);
                }
            } else {
                that.ErrLog("texture not Texture2D");
            }
        });

        // return app.ControlManager().CreateLoadPromiseByUrl(resServerUrl)
        //     .then(function(texture){
        //         if(texture instanceof cc.Texture2D){
        //             let spriteFrame = new cc.SpriteFrame(texture);
        //             let tempObj = {"id":id,"spriteFrame":spriteFrame};
        //             that.choujiangSprs.push(tempObj);
        //             if (that.choujiangSprs.length == 12) {
        //                 that.FormManager.ShowForm("UIChouJiang",data,that.choujiangSprs);
        //             }
        //         }
        //         else{
        //             that.ErrLog("texture not Texture2D");
        //             return null;
        //         }
        //     })
        //     .catch(function(error){
        //         that.ErrLog("CreateUrlSpriteFrame error:%s", error.stack);
        //         return null;
        //     })
    },
    Event_OutRoom: function Event_OutRoom() {
        this.curRoomID = 0;
        this.curRoomKey = 0;
        this.curGameTypeStr = "";
    },
    Event_GetCurRoomID: function Event_GetCurRoomID(event) {
        var serverPack = event;
        this.curRoomID = serverPack.roomID;
        this.curRoomKey = serverPack.roomKey;
        console.log("Event_GetCurRoomID curRoomID === " + this.curRoomID);
        console.log("Event_GetCurRoomID curRoomKey === " + this.curRoomKey);
        if (0 != this.curRoomID) {
            this.curGameTypeStr = serverPack.gameType.toLowerCase();

            console.log("Event_GetCurRoomID curGameTypeStr === " + this.curGameTypeStr);
            var checkRoom = true;
            var isOutRoom = cc.sys.localStorage.getItem("isOutRoom");
            console.log("Event_GetCurRoomID isOutRoom:" + isOutRoom);
            if (isOutRoom == null || typeof isOutRoom == "undefined") {
                cc.sys.localStorage.setItem("isOutRoom", '1');
            } else {
                if (isOutRoom == '0') {
                    checkRoom = false;
                    cc.sys.localStorage.setItem("isOutRoom", '1');
                }
            }
            if (checkRoom == true) {
                var curGameType = this.ShareDefine.GametTypeNameDict[this.curGameTypeStr.toUpperCase()];
                this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[curGameType]]);
            }
        }
    },
    Event_CodeError: function Event_CodeError(event) {
        var codeInfo = event;
        if (codeInfo["Code"] == this.ShareDefine.NotFind_Room) {
            app.SysNotifyManager().ShowSysMsg('DissolveRoom');
            this.curRoomID = 0;
            this.curRoomKey = 0;
            this.curGameTypeStr = '';
        } else if (codeInfo["Code"] == 1502) {
            app.SysNotifyManager().ShowSysMsg('抽奖活动暂未开启');
        }
    },
    OnClose: function OnClose() {},
    //---------点击函数---------------------
    InitGameBtnList: function InitGameBtnList(serverPack) {
        this.FormManager.ShowForm("UICreatRoom", serverPack, this.gameName);
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_club' == btnName) {
            var self = this;
            app.NetManager().SendPack("club.CGetClubListMin", {}, function (serverPack) {
                if (serverPack.length == 0) {
                    self.FormManager.ShowForm("ui/club/UIClubNone");
                } else {
                    // let clubMoban=cc.sys.localStorage.getItem('club_moban');
                    // if(clubMoban==1){
                    //     self.FormManager.ShowForm("ui/club/UIClub");
                    // }else{
                    // self.FormManager.ShowForm("ui/club/UIClubMain");
                    // }
                    self.FormManager.ShowForm("ui/club/UIClubList", serverPack);
                }
            }, function () {});
            return;
        } else if ('btn_joinClub' == btnName) {
            //if (this.isEnterLastClub) {
            if (true) {
                var _self = this;
                app.NetManager().SendPack("club.CGetClubListMin2", {}, function (serverPack) {
                    if (serverPack.length == 0) {
                        _self.FormManager.ShowForm("ui/club/UIClubNone");
                    } else {
                        app.ClubManager().ShowClubFrom();
                    }
                }, function () {});
            } else {
                // this.FormManager.ShowForm('ui/club/UIJoinClub');
                this.FormManager.ShowForm("ui/club/UIClubNone");
            }
            return;
        } else if ('btn_join' == btnName) {
            if (0 != this.curRoomID) {
                var curGameType = this.ShareDefine.GametTypeNameDict[this.curGameTypeStr.toUpperCase()];
                this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[curGameType]]);
                return;
            }
            this.FormManager.ShowForm("UIJoin");
            return;
        } else if ('btn_create' == btnName) {
            if (0 != this.curRoomID) {
                var _curGameType = this.ShareDefine.GametTypeNameDict[this.curGameTypeStr.toUpperCase()];
                this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[_curGameType]]);
                return;
            }
            this.FormManager.ShowForm("UIMoreGame");
        } else if ('btn_lxc' == btnName) {
            if (0 != this.curRoomID) {
                var _curGameType2 = this.ShareDefine.GametTypeNameDict[this.curGameTypeStr.toUpperCase()];
                this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[_curGameType2]]);
                return;
            }
            this.gameName = 'wzmj';
            this.FormManager.ShowForm("UIPractice");
        } else if ('btn_head' == btnName) {
            this.FormManager.ShowForm("UIUserInfo");
        } else if ('btn_more' == btnName) {
            this.node.getChildByName('bottom').getChildByName('left').getChildByName('layout').active = !this.node.getChildByName('bottom').getChildByName('left').getChildByName('layout').active;
        } else if ('btn_jubao' == btnName) {
            cc.sys.openURL("http://qh.qinghuaimajiang.com/index.php?module=Report&action=Index&playerID=" + app.HeroManager().GetHeroID());
        } else if ('btn_shop' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIBangDingTuiGuang");

            this.FormManager.ShowForm("UIStore");
        } else if ('btn_record' == btnName) {
            this.FormManager.ShowForm("UIRecordAll");
        } else if ('btn_bangdingtuiguang' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIStore");

            this.FormManager.ShowForm("UIBangDingTuiGuang");
        } else if ('btn_share' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIStore");
            this.FormManager.CloseForm("UIBangDingTuiGuang");

            this.FormManager.ShowForm('UIShare');
            // if (cc.sys.isNative) {
            //     app.NativeManager().CallToNative("getClipboardText",[]);
            // }
        } else if ('btn_qiandao' == btnName) {
            this.FormManager.ShowForm("UISign");
        } else if ('btn_set' == btnName) {
            this.FormManager.ShowForm("UISetting01");
        } else if ('btn_daili' == btnName) {
            this.FormManager.ShowForm("UIDaiLiCopy");
        } else if ('btn_fanxian' == btnName) {
            app.FormManager().ShowForm('UITask');
        } else if ('btn_service' == btnName) {
            this.ShowSysMsg("请联系系统管理员");
            var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
            if (httpPath[httpPath.length - 1] == "/") {
                httpPath = httpPath.substring(0, httpPath.length - 1);
            }
            httpPath = httpPath + "/index.php?module=Api&action=Contact";
            console.log(httpPath);
            var that = this;
            app.NetRequest().SendHttpRequestGet(httpPath, "", {}, 15000, function (serverUrl, responseText, httpRequest) {
                var data = JSON.parse(responseText);
                if (data && data.data[0] && data.data[0].contact) {
                    that.ShowSysMsg(data.data[0].contact);
                }
            });
            return;
        } else if ('btn_shiming' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIStore");
            this.FormManager.CloseForm("UIBangDingTuiGuang");

            this.FormManager.ShowForm("UIShiMing");
        } else if ('btn_wanfa' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIStore");
            this.FormManager.CloseForm("UIBangDingTuiGuang");
            this.FormManager.ShowForm("UIGameHelp", 'xymj');
        } else if ('btn_advice' == btnName) {
            //btn_advice
            var myCityID = cc.sys.localStorage.getItem("myCityID");
            var signString = app.HeroManager().GetHeroID() + myCityID.toString() + "wanzi" + app.ComTool().GetNowDateDayStr2();
            var sign = app.MD5.hex_md5(signString);
            cc.sys.openURL("http://fb.qinghuaimajiang.com/feedback/" + app.HeroManager().GetHeroID() + "/" + myCityID + "/?key=" + sign);
        } else if ('btn_paihang' == btnName) {
            this.FormManager.ShowForm('UIPaiHang');
        } else if ('btn_addGold' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.ShowForm("UIStore", 'btn_table0');
        } else if ('btn_addRoomCard' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIBangDingTuiGuang");
            this.FormManager.ShowForm("UIStore", 'btn_table1');
        } else if ('btn_addQuanCard' == btnName) {
            console.log("亲友圈未做，此功能暂时关闭");
            // this.FormManager.ShowForm('ui/club/UIClubStore');
        } else if ('btn_shezhi' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIStore");
            this.FormManager.CloseForm("UIBangDingTuiGuang");

            this.FormManager.ShowForm("UISetting01");
        } else if ('btn_shiming' == btnName) {
            this.FormManager.CloseForm("UIRecordAll");
            this.FormManager.CloseForm("UIStore");
            this.FormManager.CloseForm("UIBangDingTuiGuang");

            this.FormManager.ShowForm("UIShiMing");
        } else if ('btn_LoginOut' == btnName) {
            this.Click_Btn_QieHuan();
        } else if ('btn_location' == btnName) {
            this.FormManager.ShowForm("UISelectCity");
        } else if ('btn_shouji' == btnName) {
            this.FormManager.ShowForm("UIBangdingshouji");
        } else if ('btn_zengsong' == btnName) {
            this.FormManager.ShowForm("UIZengSong");
        } else if ('btn_huodong' == btnName) {
            //检测活动
            app.NetManager().SendPack("popup.CPopupList", { "type": 1 }, function (event) {
                if (event.length > 0) {
                    app.FormManager().ShowForm("UIActivity", event);
                }
            }, function () {});
        } else if ('btn_choujiang' == btnName) {
            var _self2 = this;
            app.NetManager().SendPack("luckdraw.CLuckDrawCheck", {}, function (success) {
                _self2.SendHttpRequest(_self2.ChouJiangUrl, "", "GET", {});
            }, function (error) {
                // self.ShowSysMsg("抽奖活动暂未开启");
            });
        } else if ('btn_uploadImg_test' == btnName) {
            var uploadImgURL = app.Client.GetClientConfigProperty("uploadImgURL");
            var argList = [{ "Name": "uploadImgURL", "Value": uploadImgURL }];
            app.NativeManager().CallToNative("openPhotoAlbum", argList); //上传头像
        } else if ('btn_createRoom' == btnName) {
            if (0 != this.curRoomID) {
                //&& this.gameName != this.curGameTypeStr
                var _curGameType3 = this.ShareDefine.GametTypeNameDict[this.curGameTypeStr.toUpperCase()];
                this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[_curGameType3]]);
                return;
            }
            this.FormManager.ShowForm("UICreatRoom", { "gameList": app.Client.GetAllGameId() }, this.gameName);
        } else if (btnName.startsWith("btn_")) {
            this.gameName = btnName.replace('btn_', '');
            if (0 != this.curRoomID) {
                //&& this.gameName != this.curGameTypeStr
                var _curGameType4 = this.ShareDefine.GametTypeNameDict[this.curGameTypeStr.toUpperCase()];
                this.SetWaitForConfirm('MSG_GO_ROOM', this.ShareDefine.Confirm, [this.ShareDefine.GametTypeID2Name[_curGameType4]]);
                return;
            }
            this.FormManager.ShowForm("UICreatRoom", { "gameList": app.Client.GetAllGameId() }, this.gameName);
        } else if (btnName == "logo") {
            // let count = parseInt(this.node.getChildByName("editbox").getComponent(cc.EditBox).string) || 1;
            // for (let idx = 0; idx < count; idx++) {
            //     app.LocationOnStartMgr().OnGetLocation();
            // }
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    CloseMorePop: function CloseMorePop() {
        //    this.node_more.active=false;
    },
    Click_btn_goRoom: function Click_btn_goRoom() {
        app.Client.SetGameType(this.curGameTypeStr);
        this.FormManager.ShowForm("UIDownLoadGame", this.curGameTypeStr, this.curRoomKey, null, 0, 0, true);
        // let event = {};
        // event = {};
        // event.roomID = this.curRoomID;
        // app.Client.OnEvent_LoginGetCurRoomID(event);
    },
    Click_Btn_QieHuan: function Click_Btn_QieHuan() {
        this.SetWaitForConfirm('UIMoreQieHuanZhangHao', this.ShareDefine.ConfirmDIY, [], [], "确定要切换账号吗？", "切换账号", "退出游戏");
    },
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var lbSure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
        var lbCancle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content, lbSure, lbCancle);
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {

        if (clickType != "Sure") {
            if (msgID == "UIMoreQieHuanZhangHao") {
                cc.game.end();
            }
            return;
        }
        if (msgID == "UIMoreQieHuanZhangHao") {
            this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", {});
            this.LocalDataManager.SetConfigProperty("Account", "AccountMobile", {});
            console.log("切换账号");
            app.Client.LogOutGame(1);
        } else if ('MSG_GO_ROOM' == msgID) {
            this.Click_btn_goRoom();
        } else if ("MSG_EXIT_GAME") {
            cc.game.end();
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
        //# sourceMappingURL=UINewMain.js.map
        