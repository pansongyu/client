"use strict";
cc._RF.push(module, 'bc05ekMLItDjadBWo+TojHp', 'UISelectCity');
// script/ui/UISelectCity.js

"use strict";

var app = require("app");
var SubgameManager = require('SubgameManager');
cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_heroName: cc.Label,
        lb_heroID: cc.Label,
        node_head: cc.Node,
        rightTop: cc.Node,
        searchName: cc.EditBox,

        lb_Secect: [cc.Label],

        loading: cc.Node,

        provinceContent: cc.Node,
        cityContent: cc.Node,
        countyContent: cc.Node,

        provinceItem: cc.Node,
        cityItem: cc.Node,
        countyItem: cc.Node
    },
    OnCreateInit: function OnCreateInit() {
        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.FormManager = app.FormManager();
        this.NetManager = app.NetManager();
        this.allSelectCityData = [];
        this.RegEvent("CodeError", this.Event_CodeError, this);
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
        this.WeChatHeadImage1 = this.node_head.getComponent("WeChatHeadImage");
    },
    //-----------------显示函数------------------
    OnShow: function OnShow() {
        this.isShowAllCity = false;
        this.SelectProvinceNode = null;
        this.SelectCityNode = null;
        this.SelectCountyNode = null;
        this.SelectId = 0;
        this.curSelectProvince = ""; //当前选择的省市县
        this.curSelectCity = "";
        this.curSelectCounty = "";
        this.localProvince = ""; //定位出来的省
        this.localCity = ""; //定位出来的市
        /* this.provinceContent.removeAllChildren();
         this.cityContent.removeAllChildren();
         this.countyContent.removeAllChildren();
        */
        this.DestroyAllChildren(this.provinceContent);
        this.DestroyAllChildren(this.cityContent);
        this.DestroyAllChildren(this.countyContent);

        this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
        // this.allSelectCityData = app.LocalDataManager().GetConfigProperty("SysSetting","SelectCityData");
        if (this.allSelectCityData.length == 0) {
            this.node.getChildByName("btn_close").active = false;
        } else {
            this.node.getChildByName("btn_close").active = true;
        }
        this.loading.active = true;
        this.loading.getComponent(cc.Animation).play("loadingAni");

        this.ShowHero_NameOrID();

        this.ShowFastCount();
        this.ShowRoomCard();
        this.ShowClubCard();

        this.SendHttpRequest('http://code.qicaiqh.com/myipaddress.php', "", "GET", {});

        this.ShowAlreadySelect();
    },

    Event_HeroProperty: function Event_HeroProperty(event) {
        var argDict = event;
        if (argDict["Property"] == "gold") {
            this.ShowFastCount();
        } else if (argDict["Property"] == "roomCard") {
            this.ShowRoomCard();
        } else if (argDict["Property"] == "clubCard") {
            this.ShowClubCard();
        }
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
        var heroName = app.HeroManager().GetHeroProperty("name");
        var heroID = app.HeroManager().GetHeroProperty("pid");
        this.lb_heroName.string = this.ComTool.GetBeiZhuName(heroID, heroName, 9);
        this.lb_heroID.string = app.i18n.t("UIMain_PIDText", { "pid": this.ComTool.GetPid(heroID) });
        this.WeChatHeadImage1.ShowHeroHead(heroID);
    },

    ShowAlreadySelect: function ShowAlreadySelect() {
        for (var i = 0; i < this.allSelectCityData.length; i++) {
            var cityInfo = this.selectCityConfig[this.allSelectCityData[i]['selcetId']];
            this.lb_Secect[i].string = cityInfo.Name;
        }
    },

    ShowAllCity: function ShowAllCity() {
        if (this.isShowAllCity == true) {
            return;
        }
        this.isShowAllCity = true;
        this.loading.active = false;
        var allProvince = [];
        for (var key in this.selectCityConfig) {
            if (this.selectCityConfig[key]["Type"] == 1) {
                allProvince.push(this.selectCityConfig[key]);
            }
        }
        //加载所有省
        var isOnClickSelect = false;
        for (var i = 0; i < allProvince.length; i++) {
            var provinceItem = cc.instantiate(this.provinceItem);
            provinceItem.name = allProvince[i]['Id'].toString();
            provinceItem.getChildByName('lb_province').getComponent(cc.Label).string = allProvince[i]['Name'];
            provinceItem.getChildByName("lb_province").color = new cc.Color(255, 255, 231);
            provinceItem.on('click', this.OnSelectProvince, this);
            provinceItem.active = true;
            this.provinceContent.addChild(provinceItem);
            //优先选择上次选择的城市
            if (this.allSelectCityData.length > 0 && this.allSelectCityData[0]['province'] == allProvince[i]['Id'].toString()) {
                this.OnSelectProvince({ "node": provinceItem });
                isOnClickSelect = true;
            }
            //如果上次没选，优先选择定位城市
            if (this.localProvince == allProvince[i]['Name']) {
                provinceItem.getChildByName('icon_checkmap').active = true;
                if (this.allSelectCityData.length == 0) {
                    this.OnSelectProvince({ "node": provinceItem });
                    isOnClickSelect = true;
                }
            }
            //定位未找到城市并且上次没选择，选择配表中默认的城市
            if (!isOnClickSelect && allProvince[i]['DefaultCity'] == 1) {
                this.OnSelectProvince({ "node": provinceItem });
                isOnClickSelect = true;
            }
            if (allProvince[i]['Popular'] == 1 && !provinceItem.getChildByName('icon_checkmap').active) {
                provinceItem.getChildByName('icon_hot').active = true;
            }
        }
    },

    OnSelectProvince: function OnSelectProvince(event) {
        if (this.SelectProvinceNode != null) {
            this.SelectProvinceNode.getChildByName("icon_checkin_cs").active = false;
            this.SelectProvinceNode.getChildByName("lb_province").color = new cc.Color(255, 255, 231);
        }
        this.SelectProvinceNode = event.node;
        /*this.cityContent.removeAllChildren();
        this.countyContent.removeAllChildren();*/

        this.DestroyAllChildren(this.cityContent);
        this.DestroyAllChildren(this.countyContent);

        var id = event.node.name;
        this.SelectId = id;
        this.curSelectProvince = id;
        event.node.getChildByName("icon_checkin_cs").active = true;
        event.node.getChildByName("lb_province").color = new cc.Color(97, 22, 2);
        var idArr = this.SplitIdToArr(id.toString());
        var allCity = [];

        for (var key in this.selectCityConfig) {
            var tempIdArr = this.SplitIdToArr(this.selectCityConfig[key]["Id"].toString());
            if (this.selectCityConfig[key]["Type"] == 2 && idArr[0] == tempIdArr[0]) {
                allCity.push(this.selectCityConfig[key]);
            }
        }
        //加载选择省所有的市
        var isOnClickSelect = false;
        for (var i = 0; i < allCity.length; i++) {
            var cityItem = cc.instantiate(this.cityItem);
            cityItem.name = allCity[i]['Id'].toString();
            cityItem.getChildByName('lb_city').getComponent(cc.Label).string = allCity[i]['Name'];
            cityItem.getChildByName("lb_city").color = new cc.Color(255, 255, 231);
            cityItem.on('click', this.OnSelectCity, this);
            cityItem.active = true;
            this.cityContent.addChild(cityItem);
            if (i == 0) {
                //先默认第一个，防止漏选城市
                this.OnSelectCity({ "node": cityItem });
            }
            if (this.allSelectCityData.length > 0 && this.allSelectCityData[0]['city'] == allCity[i]['Id'].toString()) {
                this.OnSelectCity({ "node": cityItem });
                isOnClickSelect = true;
            }
            if (this.localCity == allCity[i]['Name']) {
                if (this.allSelectCityData.length == 0) {
                    this.OnSelectCity({ "node": cityItem });
                    isOnClickSelect = true;
                }
            }
            //定位未找到城市并且上次没选择，选择配表中默认的城市
            if (!isOnClickSelect && allCity[i]['DefaultCity'] == 1) {
                this.OnSelectCity({ "node": cityItem });
                isOnClickSelect = true;
            }
        }
    },

    OnSelectCity: function OnSelectCity(event) {
        if (this.SelectCityNode != null) {
            if (this.SelectCityNode.name != "") {
                this.SelectCityNode.getChildByName("icon_checkin_cs").active = false;
                this.SelectCityNode.getChildByName("lb_city").color = new cc.Color(255, 255, 231);
            }
        }
        this.SelectCityNode = event.node;
        //this.countyContent.removeAllChildren();
        this.DestroyAllChildren(this.countyContent);
        var id = event.node.name;
        this.SelectId = id;
        this.curSelectCity = id;
        event.node.getChildByName("icon_checkin_cs").active = true;
        event.node.getChildByName("lb_city").color = new cc.Color(97, 22, 2);
        var idArr = this.SplitIdToArr(id.toString());
        var allCounty = [];
        for (var key in this.selectCityConfig) {
            var tempIdArr = this.SplitIdToArr(this.selectCityConfig[key]["Id"].toString());
            if (this.selectCityConfig[key]["Type"] == 3 && idArr[0] == tempIdArr[0] && idArr[1] == tempIdArr[1]) {
                allCounty.push(this.selectCityConfig[key]);
            }
        }
        //加载选择省所有的市
        var isOnClickSelect = false;
        for (var i = 0; i < allCounty.length; i++) {
            var countyItem = cc.instantiate(this.countyItem);
            countyItem.name = allCounty[i]['Id'].toString();
            countyItem.getChildByName('lb_county').getComponent(cc.Label).string = allCounty[i]['Name'];
            countyItem.getChildByName("lb_county").color = new cc.Color(255, 255, 231);
            countyItem.on('click', this.OnSelectCounty, this);
            countyItem.active = true;
            this.countyContent.addChild(countyItem);
            //先默认第一个，防止漏选城市
            if (i == 0) {
                this.OnSelectCounty({ "node": countyItem });
            }
            if (this.allSelectCityData.length > 0 && this.allSelectCityData[0]['county'] == allCounty[i]['Id'].toString()) {
                this.OnSelectCounty({ "node": countyItem });
            }
            //定位未找到城市并且上次没选择，选择配表中默认的城市
            if (!isOnClickSelect && allCounty[i]['DefaultCity'] == 1) {
                this.OnSelectCounty({ "node": countyItem });
                isOnClickSelect = true;
            }
        }
    },

    OnSelectCounty: function OnSelectCounty(event) {
        console.log("OnSelectCounty id == " + event.node.name);
        if (this.SelectCountyNode != null) {
            if (this.SelectCountyNode.name != "") {
                this.SelectCountyNode.getChildByName("icon_checkin_cs").active = false;
                this.SelectCountyNode.getChildByName("lb_county").color = new cc.Color(255, 255, 231);
            }
        }
        this.SelectCountyNode = event.node;
        event.node.getChildByName("icon_checkin_cs").active = true;
        event.node.getChildByName("lb_county").color = new cc.Color(97, 22, 2);

        this.SelectId = event.node.name;
        this.curSelectCounty = event.node.name;
    },

    //对id进行分割，前三位表示省，中间两位表示市，最后两位表示省
    SplitIdToArr: function SplitIdToArr(id) {
        var ids = id.split('');
        var result = [];
        var tempStr = "";
        for (var i = 0; i < 3; i++) {
            tempStr += ids[i].toString();
        }
        result.push(tempStr);
        tempStr = "";
        for (var i = 3; i < 5; i++) {
            tempStr += ids[i].toString();
        }
        result.push(tempStr);
        tempStr = "";
        for (var i = 5; i < 7; i++) {
            tempStr += ids[i].toString();
        }
        return result;
    },

    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        if (app.ControlManager().IsOpenVpn()) {
            return;
        }

        var url = [serverUrl, argString].join("");

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
        httpRequest.ontimeout = function () {
            that.ShowAllCity();
        };
        httpRequest.onreadystatechange = function () {
            //执行成功
            if (httpRequest.status == 200) {
                if (httpRequest.readyState == 4) {
                    that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
                } else {
                    that.ShowAllCity();
                }
            } else {
                that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
                that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
            }
        };
        httpRequest.send(dataStr);
    },
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        // try{
        var serverPack = JSON.parse(httpResText);
        //获取到当前地址刷新选项
        console.log("当前ip位置：" + serverPack["province"] + "," + serverPack["city"]);
        this.localProvince = serverPack["province"];
        this.localCity = serverPack["city"];
        this.ShowAllCity();
        // }
        // catch (error){
        //     this.ShowAllCity();
        // }
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {
        this.ShowAllCity();
    },
    Event_CodeError: function Event_CodeError(event) {
        var codeInfo = event;
        if (codeInfo["Code"] == this.ShareDefine.NotFind_Room) {
            app.SysNotifyManager().ShowSysMsg('DissolveRoom');
            this.curRoomID = 0;
            this.curGameTypeStr = '';
        }
    },
    OnClose: function OnClose() {},
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_search' == btnName) {
            this.Click_btn_searchName();
            return;
        } else if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_starGame' == btnName) {
            if (this.SelectId == 0) {
                this.ShowSysMsg("请先选择一个城市");
                return;
            }
            if (this.selectCityConfig[this.SelectId]["Type"] != 3) {
                this.ShowSysMsg("需指定县级市，才能进入游戏");
                return;
            }
            // let selectCityData = app.LocalDataManager().GetConfigProperty("SysSetting","SelectCityData");
            // if (selectCityData.length >= 3) {
            //     //最多只记录三个
            //     selectCityData.pop();
            // }
            // let curSelectData = {"province" : this.curSelectProvince,
            //                     "city" : this.curSelectCity,
            //                     "county" : this.curSelectCounty,
            //                     "selcetId" : this.SelectId};
            // selectCityData.unshift(curSelectData);
            // app.LocalDataManager().SetConfigProperty("SysSetting","SelectCityData",selectCityData);
            // let curSelectGameList = this.selectCityConfig[this.SelectId]["Game"];
            //根据选择的城市向服务端请求所有游戏
            var self = this;
            app.NetManager().SendPack("room.CBaseGameIdList", { "selectCityId": this.SelectId }, function (event) {
                app.Client.allGameIdFormServer = event.split(",");
                var curSelectGameList = app.Client.GetAllGameId();
                var argDict = {
                    "gameList": curSelectGameList
                };
                //记录用户选择的城市，城市节点使用
                app.HeroManager().UpdateCity(self.SelectId);
                cc.sys.localStorage.setItem("myCityID", self.SelectId);
                app.Client.OnEvent("ShowGameListByLocation", argDict);
                self.CloseForm();
            }, function (event) {
                console.log("获取游戏id失败");
            });
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

    Click_btn_searchName: function Click_btn_searchName() {
        var name = this.searchName.string;
        var searchData = null;
        for (var key in this.selectCityConfig) {
            if (this.selectCityConfig[key]["Name"] == name) {
                searchData = this.selectCityConfig[key];
                break;
            }
        }
        if (searchData == null) {
            this.ShowSysMsg("找不到该省/市/县，请输入完整的省/市/县");
            return;
        }
        if (searchData["Type"] == 1) {
            for (var _key in this.provinceContent.children) {
                if (this.provinceContent.children[_key]["name"] == searchData["Id"]) {
                    this.OnSelectProvince({ "node": this.provinceContent.children[_key] });
                    break;
                }
            }
        } else if (searchData["Type"] == 2) {
            for (var _key2 in this.provinceContent.children) {
                if (this.provinceContent.children[_key2]["name"] == searchData["Ascription"]) {
                    this.OnSelectProvince({ "node": this.provinceContent.children[_key2] });
                    break;
                }
            }
            for (var _key3 in this.cityContent.children) {
                if (this.cityContent.children[_key3]["name"] == searchData["Id"]) {
                    this.OnSelectCity({ "node": this.cityContent.children[_key3] });
                    break;
                }
            }
        } else if (searchData["Type"] == 3) {
            //先找到对应的省id
            var cityId = searchData["Ascription"];
            var provinceId = this.selectCityConfig[searchData["Ascription"]]["Ascription"];
            for (var _key4 in this.provinceContent.children) {
                if (this.provinceContent.children[_key4]["name"] == provinceId) {
                    this.OnSelectProvince({ "node": this.provinceContent.children[_key4] });
                    break;
                }
            }
            for (var _key5 in this.cityContent.children) {
                if (this.cityContent.children[_key5]["name"] == cityId) {
                    this.OnSelectCity({ "node": this.cityContent.children[_key5] });
                    break;
                }
            }
            for (var _key6 in this.countyContent.children) {
                if (this.countyContent.children[_key6]["name"] == searchData["Id"]) {
                    this.OnSelectCounty({ "node": this.countyContent.children[_key6] });
                    break;
                }
            }
        }
    },

    Click_Btn_QieHuan: function Click_Btn_QieHuan() {
        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), "UIMoreQieHuanZhangHao", []);
        ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, "UIMoreQieHuanZhangHao", []);
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {

        if (clickType != "Sure") {
            return;
        }
        if (msgID == "UIMoreQieHuanZhangHao") {
            this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", {});
            console.log("切换账号");
            app.Client.LogOutGame(1);
        } else if ("MSG_EXIT_GAME") {
            cc.game.end();
        }
    }
});

cc._RF.pop();