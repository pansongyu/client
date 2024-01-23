"use strict";
cc._RF.push(module, 'a0ac4OOsShAK47z7pBJEQjr', 'UIStore');
// script/ui/UIStore.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        prefab: cc.Prefab,
        layout: cc.Node,
        owerScrollView: cc.Node,

        btn_table0: cc.Node,
        btn_table1: cc.Node,
        btn_table2: cc.Node,
        // num_dhq:cc.Label,

        btn_bg: [cc.SpriteFrame]

    },

    OnCreateInit: function OnCreateInit() {
        this.SDKManager = app.SDKManager();
        this.DiamondStore = this.SysDataManager.GetTableDict("DiamondStore");
        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.ComTool = app.ComTool();
        app.NetManager().RegNetPack('game.CPlayerExchange', this.OnExchange, this);
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
        this.RefreshType = {
            'leDou': 1, //乐豆  0
            'roomCard': 2, //房卡  1
            'exchange': 3, //兑换  2
            'owerRoomCard': 4 //我的钻石  2
        };
        this.httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
        this.httpPath = this.httpPath.replace("http://", "");
        if (this.httpPath[this.httpPath.length - 1] == "/") {
            this.httpPath = this.httpPath.substring(0, this.httpPath.length - 1);
        }
        this.isIos = this.ComTool.IsIOS();
        this.dataLeDouList = [];
        this.dataRoomCardList = [];
        this.dataExchangeList = [];
        this.dataOwerRoomCardList = [];
        this.InitUIDataByConfig();
    },

    InitUIDataByConfig: function InitUIDataByConfig() {
        for (var key in this.DiamondStore) {
            /* if(this.isIos && 0 == channelType)
                 continue;
             else if(!this.isIos && 1 == channelType)
                 continue;*/
            if (this.DiamondStore[key]['goodsType'] == this.RefreshType.leDou) {
                this.dataLeDouList.push(this.DiamondStore[key]);
            } else if (this.DiamondStore[key]['goodsType'] == this.RefreshType.roomCard) {
                this.dataRoomCardList.push(this.DiamondStore[key]);
            } else if (this.DiamondStore[key]['goodsType'] == this.RefreshType.exchange) {
                this.dataExchangeList.push(this.DiamondStore[key]);
            }
        }
    },

    UpdateLayOutView: function UpdateLayOutView() {
        this.layout.active = true;
        this.owerScrollView.active = false;
        //this.layout.removeAllChildren();
        this.DestroyAllChildren(this.layout);
        var itemCount = 0;
        var needList = [];
        if (this.curRefreshTabel == this.RefreshType.leDou) needList = this.dataLeDouList;else if (this.curRefreshTabel == this.RefreshType.roomCard) needList = this.dataRoomCardList;else if (this.curRefreshTabel == this.RefreshType.exchange) needList = this.dataExchangeList;

        itemCount = needList.length;
        var itmes_count = 0;
        var constItemNum = this.prefab.data.children.length;
        if (itemCount < constItemNum) itmes_count = 1;else if (0 == itemCount % constItemNum) itmes_count = parseInt(itemCount / constItemNum);else {
            itmes_count = parseInt(itemCount / constItemNum);
            itmes_count++;
        }

        for (var i = 0; i < itmes_count; i++) {
            var itmes = cc.instantiate(this.prefab);
            itmes.active = true;
            for (var j = 0; j < constItemNum; j++) {
                itmes.children[j].name = 'item' + j;
                itmes.children[j].active = false;
            }

            itmes.name = 'items' + i;
            this.layout.addChild(itmes);
        }
        var curRowIndex = 0;
        var curColIndex = 0;
        var path = '';
        //---------------------路径不对
        var basePath = 'texture/store/';
        for (var _i = 0; _i < itemCount; _i++) {
            var curItems = this.layout.children[curRowIndex];
            var item = curItems.children[curColIndex];
            var nodePath = 'sp_buy/right/layout/items' + curRowIndex + '/item' + curColIndex;
            var iconPath = '/bg_icon/icon';
            this.SetWndImageByFilePath(nodePath + iconPath, basePath + needList[_i]['ImageName']);
            var buyNode = item.getChildByName('btn_buy');
            var numNode = buyNode.getChildByName('num');
            var titleStr = '';
            var num = needList[_i]['AppPrice'];
            var numStr = num;
            titleStr = needList[_i]['DiamondNum'];
            var UnitPath = "/btn_buy/num/zuanshi";
            var gPath = "/num/g";
            var UnitType = "";
            var gType = "";
            /*if(titleStr >= 100000){
                titleStr = (titleStr/10000).toFixed().toString();
                gType = "img_wg";
            }else{
                gType = "img_g";
            }*/
            gType = "img_g";
            if (this.curRefreshTabel == this.RefreshType.leDou) {
                UnitType = "icon_diamonds01";
            } else if (this.curRefreshTabel == this.RefreshType.roomCard) {
                UnitType = "img_yuan";
            }

            this.SetWndImageByFilePath(nodePath + gPath, basePath + gType);
            this.SetWndImageByFilePath(nodePath + UnitPath, basePath + UnitType);
            item.getChildByName('num').getComponent(cc.Label).string = titleStr;
            numNode.getComponent(cc.Label).string = numStr;
            var RewardStr = needList[_i]['ExtraReward'];
            var lb_Reward = '';
            if (RewardStr == 0) {
                item.getChildByName("title").active = false;
            } else {
                item.getChildByName("title").active = true;
            }
            /*if(RewardStr >= 10000){
                RewardStr = (RewardStr/10000).toFixed().toString();
                lb_Reward = "多送" + RewardStr + "万个";
            }else{
                lb_Reward = "多送" + RewardStr + "个";
            }*/
            lb_Reward = "多送" + RewardStr + "个";
            item.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = lb_Reward;
            item.on('click', this.OnBuyBtnClick, this);
            buyNode.on('click', this.OnBuyBtnClick, this);

            item.active = true;
            numNode.getChildByName("zuanshi").x = numNode.width / 2 - 5;
            item.getChildByName('num').getChildByName("g").x = item.getChildByName('num').width / 2;
            // console.log("ddada"+tem.getChildByName("title").getChildByName("label"))
            curColIndex++;
            if (curColIndex == constItemNum) {
                curColIndex = 0;
                curRowIndex++;
            }
        }
    },
    OnShow: function OnShow() {
        var openViewName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'btn_table1';

        var appName = cc.sys.localStorage.getItem('appName');
        if (appName == "baodao") {
            app.SysNotifyManager().ShowSysMsg('商城未开启');
            this.CloseForm();
            return;
        }

        //显示当前城市
        this.ShowLoaclCity();
        app.FormManager().ShowForm('UITop', "UIStore");
        // this.FormManager.CloseForm('ui/club/UIClubCreate');
        // if(this.dataRoomCardList.length>0){
        //     this.ShowData(openViewName);
        // }else{
        this.openViewName = openViewName;
        this.dataRoomCardList = [];
        var that = this;
        var allSelectCityData = app.HeroManager().GetCurSelectCityData();
        app.NetManager().SendPack("family.CPlayerCheckFamilyOwner", {}, function (success) {
            if (success.vip < 0) {
                that.SendHttpRequest('http://' + that.httpPath + '/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=2&cityId=" + allSelectCityData[0]['selcetId'], "GET", {});
            } else {
                if (success.vip == 0) {
                    that.SendHttpRequest('http://' + that.httpPath + '/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=4&cityId=" + allSelectCityData[0]['selcetId'], "GET", {});
                } else if (success.vip == 1) {
                    that.SendHttpRequest('http://' + that.httpPath + '/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=5&cityId=" + allSelectCityData[0]['selcetId'], "GET", {});
                } else if (success.vip == 2) {
                    that.SendHttpRequest('http://' + that.httpPath + '/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=6&cityId=" + allSelectCityData[0]['selcetId'], "GET", {});
                } else if (success.vip == 3) {
                    that.SendHttpRequest('http://' + that.httpPath + '/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=7&cityId=" + allSelectCityData[0]['selcetId'], "GET", {});
                }
            }
        }, function (error) {
            that.SendHttpRequest('http://' + that.httpPath + '/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=2&cityId=" + allSelectCityData[0]['selcetId'], "GET", {});
        });
        // this.SendHttpRequest('http://'+this.httpPath+'/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai", "GET",{});
        // }
    },
    ShowLoaclCity: function ShowLoaclCity() {
        var lb_loaclCity = this.node.getChildByName("img_bjl_dw").getChildByName("lb_loaclCity");
        var allSelectCityData = app.HeroManager().GetCurSelectCityData();
        if (allSelectCityData.length == 0) {
            this.CloseForm();
            app.FormManager().ShowForm("UISelectCity");
            lb_loaclCity.getComponent(cc.Label).string = "";
        } else {
            var cityInfo = this.selectCityConfig[allSelectCityData[0]['selcetId']];
            if (!cityInfo) {
                this.CloseForm();
                app.FormManager().ShowForm("UISelectCity");
                lb_loaclCity.getComponent(cc.Label).string = "";
                return;
            }
            lb_loaclCity.getComponent(cc.Label).string = cityInfo.Name;
        }
    },
    ShowData: function ShowData(openViewName) {
        // this.FormManager.ShowForm("bottom");
        app.Client.OnEvent("EVT_CloseDetail", {});
        this.appID = 0;
        this.curRefreshTabel = -1;
        var path = 'sp_buy/left/';
        if ('' != openViewName) path += openViewName;else path += 'btn_table0';

        this.SimulateOnClick(path);

        //检车用户FamilyID
        var familyID = app.PlayerFamilyManager().GetPlayerFamilyProperty("familyID");
        console.log(familyID);
        if (familyID == 10001 && app.Config && app.Config.promoter) {
            var desc = "您还没有绑定工会,绑定工会可以获得5个钻石,点击前往";
            app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirmFamily.bind(this), "goBandFamily", []);
            app.FormManager().ShowForm("UIMessage", null, this.ShareDefine.ConfirmFamily, 0, 0, desc);
            return;
        }
    },
    OnConFirmFamily: function OnConFirmFamily(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ("goBandFamily" == msgID) {
            app.FormManager().ShowForm("UIBangDingTuiGuang");
            return;
        }
    },
    CheckOnBuyBtnClick: function CheckOnBuyBtnClick(AppID) {
        this.BuyLeDouID = AppID;
        this.SetWaitForConfirm('MSG_EXCHANGE', this.ShareDefine.Confirm, [], []);
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
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ('MSG_EXCHANGE' == msgID) {
            app.NetManager().SendPack("game.CPlayerExchange", { "productID": this.BuyLeDouID });
        } else if ("SWITCH_CITY_STORE" == msgID) {
            if (this.selectCityConfig[backArgList[0]]["Type"] != 3) {
                this.ShowSysMsg("需指定县级市，才能进入游戏");
                return;
            }
            var self = this;
            //根据选择的城市向服务端请求所有游戏
            app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": backArgList[0] }, function (event) {
                app.Client.allGameIdFormServer = event.split(",");
                var curGameList = app.Client.GetAllGameId();
                var argDict = {
                    "gameList": curGameList
                };
                app.Client.OnEvent("ShowGameListByLocation", argDict);
                self.OnShow("btn_table2");
            }, function (event) {
                console.log("获取游戏id失败");
            });
        }
    },
    Event_HeroProperty: function Event_HeroProperty(event) {
        var argDict = event;
        if (argDict["Property"] == "crystal") {
            //this.ShowCrystal();
        }
    },

    /*ShowCrystal:function(){
        let crystal = app.HeroManager().GetHeroProperty("crystal");
        if(crystal >= 10000)
            crystal = (crystal/10000).toFixed(1).toString() + '万';
        this.num_dhq.string = crystal;
    },*/

    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        // app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 2000, 
        //     this.OnReceiveHttpPack.bind(this), 
        //     this.OnConnectHttpFail.bind(this),
        //     null,
        //     this.OnConnectHttpError.bind(this),
        // );
        var url = [serverUrl, argString].join("");
        console.log("serverUrl ==== " + url);
        var dataStr = JSON.stringify(sendPack);

        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var httpRequest = new XMLHttpRequest();

        httpRequest.timeout = 2000;

        httpRequest.open(requestType, url, true);
        //服务器json解码
        httpRequest.setRequestHeader("Content-Type", "application/json");
        var that = this;
        httpRequest.onerror = function () {
            that.ErrLog("httpRequest.error:%s", url);
            that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        };
        httpRequest.ontimeout = function () {};
        httpRequest.onreadystatechange = function () {
            //执行成功
            if (httpRequest.status == 200) {
                if (httpRequest.readyState == 4) {
                    that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
                }
            } else {
                that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
                that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
            }
        };
        httpRequest.send(dataStr);
    },
    /*
    *AppID  AppName AppPrice    DiamondNum  ExtraReward ImageName   goodsType   channelType
      12     金币     29          320000       3002    icon_card6       1           2
    */
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);
            for (var i = 0; i < serverPack.data.length; i++) {
                var data = serverPack.data[i];
                // if (data.goodstype != this.RefreshType.roomCard) continue;//后台增加了普通玩家，普通代理，高级代理
                var push = [];
                push['AppID'] = data.id;
                push['AppName'] = data.moneytypename;
                push['AppPrice'] = data.money / 100; //data.money---单位是分--
                push['DiamondNum'] = data.roomcard; //兑换数量
                push['ExtraReward'] = data.showgive; //showgive---额外奖励
                push['ImageName'] = 'icon_diamonds0' + (i + 1);
                push['goodsType'] = data.goodstype;
                push['channelType'] = 2;
                this.dataRoomCardList.push(push);
            }
            this.ShowData(this.openViewName);
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},

    OnExchange: function OnExchange(serverPack) {
        if ('SUCCESS' == serverPack['msg']) {
            var num = serverPack['DiamondNum'];
            app.SysNotifyManager().ShowSysMsg('MSG_STORE_EXCHANGE_OK', [num]);
        }
    },

    //---------点击函数---------------------
    OnBuyBtnClick: function OnBuyBtnClick(event) {
        var itemsIndex = 0;
        var curIndex = 0;
        var needIndex = 0;
        var parent = null;
        var allSelectCityData = app.HeroManager().GetCurSelectCityData();
        if (event.target.name.startsWith('item')) {
            //点击的是整个item
            parent = event.target.parent;
            itemsIndex = parseInt(parent.name.substring(parent.name.length - 1));
            curIndex = parseInt(event.target.name.substring(event.target.name.length - 1));
        } else {
            //购买按钮
            parent = event.target.parent;
            var granddad = parent.parent;
            itemsIndex = parseInt(granddad.name.substring(granddad.name.length - 1));
            curIndex = parseInt(parent.name.substring(parent.name.length - 1));
        }
        var constItemNum = this.prefab.data.children.length;
        if (0 == itemsIndex) needIndex = curIndex;else needIndex = itemsIndex * constItemNum + curIndex;

        if (this.curRefreshTabel == this.RefreshType.leDou) {
            if (needIndex >= this.dataLeDouList.length) {
                this.ErrLog('dataLeDouList error dataListLength :' + this.dataLeDouList.length + ' needIndex :' + needIndex);
                return;
            }
            this.appID = this.dataLeDouList[needIndex]['AppID'];
            this.CheckOnBuyBtnClick(this.appID);
            // app.NetManager().SendPack("game.CPlayerExchange", {"productID":this.appID});
        } else if (this.curRefreshTabel == this.RefreshType.roomCard) {
            if (needIndex >= this.dataRoomCardList.length) {
                this.ErrLog('dataLeDouList error dataListLength :' + this.dataRoomCardList.length + ' needIndex :' + needIndex);
                return;
            }
            if (app.Config && !app.Config.onlinePay) {
                if (app.Config.payTips && app.Config.payTips.length > 0) {
                    app.SysNotifyManager().ShowSysMsg(app.Config.payTips);
                } else {
                    app.SysNotifyManager().ShowSysMsg('请联系客服,' + (app['KeFuHao'] || ""));
                }
                return;
            }
            this.appID = this.dataRoomCardList[needIndex]['AppID'];
            cc.sys.openURL("http://" + this.httpPath + "/index.php?module=YiHePay&action=Pay&goodsID=" + this.appID + "&playerID=" + app.HeroManager().GetHeroProperty("pid") + "&cityId=" + allSelectCityData[0]['selcetId']);
            // this.SDKManager.Pay(this.appID);
        } else if (this.curRefreshTabel == this.RefreshType.exchange) {
            if (needIndex >= this.dataExchangeList.length) {
                this.ErrLog('dataLeDouList error dataListLength :' + this.dataExchangeList.length + ' needIndex :' + needIndex);
                return;
            }
            var AppID = this.dataExchangeList[needIndex]['AppID'];
            var AppName = this.dataExchangeList[needIndex]['AppName'];
            var AppPrice = this.dataExchangeList[needIndex]['AppPrice'];
            app.FormManager().ShowForm("UIContact", AppID, AppName, AppPrice);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_table0' == btnName) {
            if (this.curRefreshTabel == this.RefreshType.leDou) return;
            /*this.node_table0.active = true;
            this.node_table1.active = false;*/

            this.btn_table0.getComponent(cc.Sprite).spriteFrame = this.btn_bg[0];
            this.btn_table0.getChildByName('on').active = true;
            this.btn_table0.getChildByName('off').active = false;

            this.btn_table1.getComponent(cc.Sprite).spriteFrame = this.btn_bg[1];
            this.btn_table1.getChildByName('on').active = false;
            this.btn_table1.getChildByName('off').active = true;

            this.btn_table2.getComponent(cc.Sprite).spriteFrame = this.btn_bg[1];
            this.btn_table2.getChildByName('on').active = false;
            this.btn_table2.getChildByName('off').active = true;

            this.curRefreshTabel = this.RefreshType.leDou;
            this.UpdateLayOutView();
        } else if ('btn_table1' == btnName) {
            if (this.curRefreshTabel == this.RefreshType.roomCard) return;
            /*this.node_table0.active = false;
            this.node_table1.active = true;*/

            this.btn_table0.getComponent(cc.Sprite).spriteFrame = this.btn_bg[1];
            this.btn_table0.getChildByName('on').active = false;
            this.btn_table0.getChildByName('off').active = true;

            this.btn_table1.getComponent(cc.Sprite).spriteFrame = this.btn_bg[0];
            this.btn_table1.getChildByName('on').active = true;
            this.btn_table1.getChildByName('off').active = false;

            this.btn_table2.getComponent(cc.Sprite).spriteFrame = this.btn_bg[1];
            this.btn_table2.getChildByName('on').active = false;
            this.btn_table2.getChildByName('off').active = true;

            this.curRefreshTabel = this.RefreshType.roomCard;
            this.UpdateLayOutView();
        } else if ('btn_table2' == btnName) {
            if (this.curRefreshTabel == this.RefreshType.owerRoomCard) return;
            /*this.node_table0.active = false;
            this.node_table1.active = true;*/

            this.btn_table0.getComponent(cc.Sprite).spriteFrame = this.btn_bg[1];
            this.btn_table0.getChildByName('on').active = false;
            this.btn_table0.getChildByName('off').active = true;

            this.btn_table1.getComponent(cc.Sprite).spriteFrame = this.btn_bg[1];
            this.btn_table1.getChildByName('on').active = true;
            this.btn_table1.getChildByName('off').active = false;

            this.btn_table2.getComponent(cc.Sprite).spriteFrame = this.btn_bg[0];
            this.btn_table2.getChildByName('on').active = true;
            this.btn_table2.getChildByName('off').active = false;

            this.curRefreshTabel = this.RefreshType.owerRoomCard;
            this.layout.active = false;
            this.owerScrollView.active = true;
            var self = this;
            app.NetManager().SendPack("player.CPlayerCityCurrencyList", {}, function (serverPack) {
                self.ShowOwerRoomCard(serverPack);
            }, function () {});
        } else if ('btn_back' == btnName) {
            this.CloseForm();
        } else if ("btn_selectCity" == btnName) {
            var cityInfo = btnNode.parent.cityInfo;
            this.SetWaitForConfirm('SWITCH_CITY_STORE', this.ShareDefine.Confirm, [], [cityInfo.Id], "是否切换到[" + cityInfo.Name + "]");
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    ShowOwerRoomCard: function ShowOwerRoomCard(serverPack) {
        var owerLayout = this.owerScrollView.getChildByName("view").getChildByName("layoutOwer");
        this.owerScrollView.getComponent(cc.ScrollView).scrollToTop();
        this.DestroyAllChildren(owerLayout);

        var owerDemo = this.node.getChildByName("owerDemo");
        owerDemo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(owerDemo);
            if (this.selectCityConfig[serverPack[i].cityId]["Type"] != 3) {
                continue;
            }
            if (serverPack[i].sign == 1) {
                child.getChildByName("img_dl").active = true;
            } else {
                child.getChildByName("img_dl").active = false;
            }
            var cityInfo = this.selectCityConfig[serverPack[i].cityId];
            child.getChildByName("lb_city").getComponent(cc.Label).string = cityInfo.Name;
            child.getChildByName("lb_num").getComponent(cc.Label).string = serverPack[i].value;
            child.cityInfo = cityInfo;
            child.active = true;
            owerLayout.addChild(child);
        }
    }
});

cc._RF.pop();