(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/SceneLaunch.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ef9b28XM2VKlZ76Ysch5/rF', 'SceneLaunch', __filename);
// script/scene/SceneLaunch.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
    客户端启动场景，不受场景管理
*/

var app = require("app");

cc.Class({
    extends: cc.Component,

    properties: {
        errorNode: cc.Node,
        LabelRes: cc.Label,
        //给node添加组件cc.ProgressBar
        bar: {
            default: null,
            type: cc.ProgressBar
        },
        barUpdate: {
            default: null,
            type: cc.ProgressBar
        },
        barApkUpdate: {
            default: null,
            type: cc.ProgressBar
        },
        //给node添加组件cc.Label
        lbProcess: {
            default: null,
            type: cc.Label
        },
        lbUpdateProcess: {
            default: null,
            type: cc.Label
        },
        LabelUpdating: cc.Label,
        lbApkUpdateProcess: {
            default: null,
            type: cc.Label
        },
        LabelApkUpdating: cc.Label,
        logo: cc.Node,
        logoSprite: [cc.SpriteFrame],
        xinhua: cc.Node
    },

    //加载
    onLoad: function onLoad() {
        //节点更新回默认节点
        app.LocalDataManager().SetConfigProperty("Account", "AccessPoint", 0);
        //客户端启动初始状态
        this.State_InitClient = 0;
        //显示健康提示语
        this.State_ShowHealthForm = 1;
        //客户端更新资源状态
        this.State_StartUpDate = 2;
        //加载js文件
        this.State_LoadJSFile = 3;
        //等待js文件加载完成回调
        this.State_WaitJSFileLoad = 4;
        //更新完成状态
        this.State_EndUpDate = 5;
        //发送请求gateserver下载配置
        this.State_SendGateHttp = 6;
        //加载txt配置
        this.State_LoadText = 7;
        this.State_LoadRes = 8;
        //进入游戏状态
        this.State_StartGame = 9;
        //已经在运行游戏状态
        this.State_RunGame = 10;
        //需要更新下一个资源中
        this.State_StartUpNextDate = 11;
        //下载资源失败
        this.State_LoadResFail = 12;
        //客户端过期
        this.State_ClientOutOfDate = 13;

        this.initState = this.State_InitClient;

        this.bar.progress = 0;

        this.barUpdate.progress = 0;

        this.lbProcess.string = "0%";

        this.lbUpdateProcess.string = "0%";

        this.barApkUpdate.progress = 0;

        this.lbApkUpdateProcess.string = "0%";

        //所有表数据字典
        this.allTableDataDict = {};

        //下载的客户端配置
        this.clientConfig = {};

        //本地读取的配置
        this.localConfig = {};

        this.gateServerUrl = "";
        this.gateSendPack = null;

        //从全局空间获取客户端ClientManager
        this.Client = app.Client;

        this.Client.OnInitClientData("", 1);

        this.debugModel = null;

        this.InitTable();

        this.InitRes();

        this.InitResDir();

        this.totalCount = this.AllTableNameList.length + this.AllResNameList.length + this.AllResJsonNameList.length;
        if (this.LabelRes) {
            this.LabelRes.string = app.ShareDefine().ClientVersion;
        }

        var nowTick = Date.now();
        this.OutOfDataTick = 0;
        if (this.OutOfDataTick && nowTick >= this.OutOfDataTick) {
            this.initState = this.State_ClientOutOfDate;
        } else {
            if (cc.sys.isNative || true) {
                this.LoadFirstConfig();
            } else {
                this.LoadFirstConfigWeb();
            }
        }
        //重新初始化切换游戏的本地保存数据
        cc.sys.localStorage.setItem("switchGameData", "");
        cc.sys.localStorage.setItem("switchRecord", "");
        cc.sys.localStorage.setItem("curRunGame", "hall");
        cc.sys.localStorage.setItem("packName", "pingxiang");
        this.ChangeLogo();
        app["tanchuang"] = 1;
    },
    ChangeLogo: function ChangeLogo() {
        if (typeof this.logo == "undefined" || this.logo == null || this.logo == false) {
            return;
        }
        if (!this.logo.hasOwnProperty("_components")) {
            return;
        }
        this.logo.getComponent(cc.Sprite).spriteFrame = this.logoSprite[0];
    },
    HideXinHua: function HideXinHua() {
        this.xinhua.active = false;
    },

    GetMsg: function GetMsg(argList) {
        var logText = cc.js.formatStr.apply(null, argList);
        return "SceneLaunch" + "\t" + logText;
    },

    Log: function Log() {
        for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
            argList[_key] = arguments[_key];
        }

        cc.log(this.GetMsg(argList));
    },

    SysLog: function SysLog() {
        for (var _len2 = arguments.length, argList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            argList[_key2] = arguments[_key2];
        }

        cc.log(this.GetMsg(argList));
    },

    ErrLog: function ErrLog() {
        for (var _len3 = arguments.length, argList = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            argList[_key3] = arguments[_key3];
        }

        cc.error(this.GetMsg(argList));
    },

    //初始化加载debug文件
    LoadFirstConfig: function LoadFirstConfig() {
        console.log("LoadFirstConfig start");
        var that = this;
        this.Client.ControlManager.CreateLoadPromise("firstConfig").then(function (textData) {

            if (!that.OnLoadFirstConfig(textData)) {
                that.ErrLog("OnLoadFirstConfig(%s) fail", textData);
                that.initState = that.State_LoadResFail;
            }
        }).catch(function (error) {
            that.ErrLog("OnLoadFirstConfig:%s error", error.stack);
            that.initState = that.State_LoadResFail;
        });
    },

    LoadFirstConfigWeb: function LoadFirstConfigWeb() {
        console.log("LoadFirstConfigWeb start");
        var that = this;
        this.Client.ControlManager.CreateLoadPromise("firstConfigWeb").then(function (textData) {

            if (!that.OnLoadFirstConfig(textData)) {
                that.ErrLog("OnLoadFirstConfig(%s) fail", textData);
                that.initState = that.State_LoadResFail;
            }
        }).catch(function (error) {
            that.ErrLog("OnLoadFirstConfig:%s error", error.stack);
            that.initState = that.State_LoadResFail;
        });
    },

    //解析配置
    OnLoadFirstConfig: function OnLoadFirstConfig(textData) {
        this.localConfig = {};
        try {
            var textDataList = textData.text.split("\n");
            var count = textDataList.length;
            for (var index = 0; index < count; index++) {
                //去除空格
                var dataString = textDataList[index].replace(/(\s*$)/g, "");
                if (!dataString) {
                    continue;
                }
                if (dataString.startsWith("#")) {
                    continue;
                }
                var dataList = dataString.split("=");
                if (dataList.length < 2) {
                    this.ErrLog("OnLoadFirstConfig dataString:%s error", dataString);
                    continue;
                }
                var keyName = dataList.shift().replace(/(\s*$)/g, "");

                //有可能是多个等于号,后续的分割列表合并成一个做为value
                var value = "";
                if (dataList.length != 1) {
                    value = dataList.join("=");
                } else {
                    value = dataList[0];
                }
                value = value.replace(/(\s*$)/g, "");
                //如果是List或者Dict
                if (keyName.endsWith("List") || keyName.endsWith("Dict")) {
                    value = JSON.parse(value);
                }
                this.localConfig[keyName] = value;
            }
        } catch (error) {
            this.ErrLog("OnLoadFirstConfig(%s) error:%s", textData, error.stack);
            return false;
        }

        //跳过从服务器拉取配置
        // let gateServerIP = 0;
        // let dbGateServerInfo = app.LocalDataManager().GetConfigProperty("DebugInfo", "GateServerInfo");
        // //优先使用本地数据库缓存
        // if(dbGateServerInfo && dbGateServerInfo["GateServerIP"]){
        //     gateServerIP = dbGateServerInfo["GateServerIP"];
        // }
        // else{
        //     gateServerIP = this.localConfig["GateServerIP"];
        //     gateServerIP=this.MultiPoint(gateServerIP);
        // }

        // //如果没有配置IP,使用本地配置
        // if(gateServerIP){
        //     let gateServerPort = 0;
        //     //优先使用本地数据库缓存
        //     if(dbGateServerInfo && dbGateServerInfo["GateServerPort"]){
        //         gateServerPort = dbGateServerInfo["GateServerPort"];
        //     }
        //     else{
        //         gateServerPort = this.ListChoice(this.localConfig["GateServerPortList"]);
        //     }
        //     if(!gateServerPort){
        //         this.ErrLog("localConfig and dbGateServerInfo not find gateServerPort:", this.localConfig, dbGateServerInfo);
        //         return false
        //     }
        //     this.gateServerUrl = ["http://", gateServerIP, ":", gateServerPort, "/ClientPack"].join("");
        //     console.error("this.gateServerUrl: ", this.gateServerUrl);
        //     //存放到app作用域
        //     app["GateServerInfo"] = {"GateServerIP":gateServerIP, "GateServerPort":gateServerPort};

        //     this.gateSendPack = {
        //                             "Head":0xFF10,
        //                             "GameID":this.localConfig["GameID"],
        //                             "ConfigVersion":this.localConfig["ConfigVersion"],
        //                         };
        //     //开始请求客户端配置
        //     this.initState = this.State_SendGateHttp;
        //     this.SendHttpRequest(this.gateServerUrl, "?Sign=ddcat", "POST", this.gateSendPack);
        // }
        // //不需要下载远程配置,使用本地配置
        // else{
        app["GateServerInfo"] = { "GateServerIP": "0.0.0.0", "GateServerPort": 0 };
        this.initState = this.State_LoadText;
        this.clientConfig = JSON.parse(JSON.stringify(this.localConfig));
        //}
        //保存到本地供子游戏调用
        cc.sys.localStorage.setItem("localConfig", JSON.stringify(this.localConfig));
        //判断是否显示debug
        this.InitDebug();

        return true;
    },

    //初始化debug
    InitDebug: function InitDebug() {

        var isDebug = app.Client.CheckDebugSign(this.localConfig["debug"]);

        //校验debug签名是否一样
        if (isDebug) {
            this.Client.InitDebug(true);

            var debugModel = this.Client.GetDebugModel();
            if (debugModel) {
                this.node.addChild(debugModel.node, 10000);
                this.debugModel = debugModel;
            }
        } else {
            this.Client.InitDebug(false);
        }
    },

    CheckHotUpdate: function CheckHotUpdate() {
        console.log("apkVersion:" + app.Client.GetClientConfigProperty("apkVersion"));
        if (!cc.sys.isNative) {
            //不是真机，直接调用登录
            app.Client.LoadLogin();
            return;
        }
        this.scheduleOnce(function () {
            var percent = app["updatepercent"];
            console.log("CheckHotUpdate timeout begin");
            if (!percent) {
                console.log("CheckHotUpdate timeout Destroy");
                app.Client.LoadLogin();
                app.HotUpdateMgr().Destroy();
            }
        }, 10);
        app.HotUpdateMgr().Init();
        app.ApkUpdateMgr().CheckVersion(app.Client.GetClientConfigProperty("apkUpdateURL"), app.Client.GetClientConfigProperty("apkVersion"));
    },

    //列表随机
    ListChoice: function ListChoice(targetList) {
        var length = targetList.length;
        if (length < 1) {
            return null;
        }
        return targetList[Math.floor(Math.random() * length)];
    },

    //初始化表数据
    InitTable: function InitTable() {
        this.AllTableDict = {
            "DiamondStore": null,
            "Effect": null,
            "Face": null,
            "FirstCharge": null,
            "gameCreate": null,
            "GameHelp": null,
            "gameList": null,
            "gametype": null,
            "Gift": null,
            "IntegrateImage": null,
            "keywords": null,
            "NewSysMsg": null,
            "practice": null,
            "robot": null,
            "roomcost": null,
            "SceneInfo": null,
            "signin": null,
            "Sound": null,
            "trusteeshipTime": null,
            "selectCity": null,
            "ServiceAgreement": null
        };
        this.AllTableNameList = Object.keys(this.AllTableDict);

        //每次加载几张配置表
        this.PerTimeTableCount = 2;
        this.loadTableCount = 0;
    },

    InitRes: function InitRes() {

        this.AllResDict = {
            //"soccer_font":"font",
            "UILogin": "ui"
        };
        this.AllResNameList = Object.keys(this.AllResDict);

        this.PerTimeResCount = 1;
        this.loadResCount = 0;
    },

    InitResDir: function InitResDir() {

        this.AllResJsonDict = {};
        this.AllResJsonNameList = Object.keys(this.AllResJsonDict);
    },
    UpdateProcess: function UpdateProcess() {

        // let percent = Math.floor((this.loadTableCount + this.loadResCount)*100.0/this.totalCount);
        var percent = app["updatepercent"];
        //this.SysLog("UpdateProcess  percent=%s, active:%s",percent, this.barUpdate.node.active);
        var startCompress = app["startCompress"];
        if (!percent) {
            percent = 0;
        }

        if (percent > 100) {
            percent = 100;
        }

        if (percent > 0.1 && this.barUpdate.node.active == false) {
            this.SysLog("UpdateProcess set active true");
            this.barUpdate.node.active = true;
            this.barApkUpdate.node.active = false;
        }
        //this.SysLog("UpdateProcess  percent=%s, active:%s",percent, this.barUpdate.node.active);
        if (startCompress) {
            this.LabelUpdating.string = "资源包解压中...";
            this.lbUpdateProcess.string = '';
        } else {
            if (percent == 100) {
                this.LabelUpdating.string = "资源更新完成";
                this.lbUpdateProcess.string = percent + "%";
            } else {
                this.LabelUpdating.string = "正在更新资源中";
                this.lbUpdateProcess.string = percent + "%";
            }
        }

        this.barUpdate.progress = percent / 100.0;

        //this.SysLog("percent:%s, processtest:%s", this.barUpdate.progress, this.lbUpdateProcess.string);
    },

    OnEvent_LoadApkProess: function OnEvent_LoadApkProess(event) {
        this.xinhua.active = false;
        var downLoadMgr = app.DownLoadMgr();
        this.SysLog("scene OnEvent_LoadApkProess event=%s,state:%s, progress:%s", event.toString(), event.detail["state"], downLoadMgr.GetDownLoadStateProgress());
        if (event.detail["state"] == downLoadMgr.GetDownLoadStateProgress()) {
            var percent = event.detail["proess"];
            //this.SysLog("scene OnEvent_LoadApkProess progress=%s",percent);
            //app["updatepercent"] = percent;
            if (!percent) {
                percent = 0;
            }
            //this.SysLog("OnEvent_LoadApkProess 22222 percent=%s",percent);
            if (percent == 100) {
                this.LabelApkUpdating.string = "游戏更新完成";
            } else {
                this.LabelApkUpdating.string = "正在更新游戏中";
            }
            this.barApkUpdate.progress = percent / 100.0;
            this.lbApkUpdateProcess.string = percent + "%";
        } else if (event.detail["state"] == downLoadMgr.GetDownLoadStateError()) {
            this.LabelApkUpdating.string = "游戏更新失败,请检查网络！";
        }
    },

    //每帧回掉
    update: function update(dt) {
        //this.SysLog("UpdateProcess  update");
        //没有初始化客户端实例
        if (!this.Client) {
            return;
        }

        if (this.debugModel) {
            this.debugModel.OnUpdate(dt);
        }

        this.UpdateProcess();

        switch (this.initState) {

            case this.State_InitClient:

                break;

            case this.State_SendGateHttp:
                break;
            case this.State_LoadText:
                this.OnLoadTable();
                break;

            case this.State_LoadRes:
                this.OnLoadRes();
                break;

            case this.State_StartGame:
                this.initState = this.State_RunGame;
                if (this.debugModel) {
                    this.node.removeChild(this.debugModel.node);
                }
                this.ReSetClientConfig();
                this.Client.OnInitClientFinish(this.allTableDataDict, this.clientConfig);

                if (this.Client) this.Client.RegEvent("LoadApkProess", this.OnEvent_LoadApkProess, this);
                // let needReloadScene = cc.sys.localStorage.getItem("needReloadScene");
                // if (needReloadScene && needReloadScene != "") {
                //     console.log("直接加载主场景");
                //     app.SceneManager().LoadScene("mainScene");
                // }else{
                //     this.CheckHotUpdate();
                // }
                this.CheckHotUpdate();
                break;

            case this.State_RunGame:
                break;

            case this.State_LoadResFail:
                break;

            case this.State_ClientOutOfDate:
                break;

            default:
                break;
        }
    },
    ReSetClientConfig: function ReSetClientConfig() {
        return;
        /*this.clientConfig['GameServerIP']=this.MultiPoint(this.clientConfig['GameServerIP']);
        this.clientConfig['AccountServerIP']=this.MultiPoint(this.clientConfig['AccountServerIP']);
        this.clientConfig['OrderServerIP']=this.MultiPoint(this.clientConfig['OrderServerIP']);
        this.clientConfig['ResServerIP']=this.MultiPoint(this.clientConfig['ResServerIP']);*/
    },
    MultiPoint: function MultiPoint(serverIP) {
        if (serverIP == "") {
            return "";
        }
        if (!cc.sys.isNative) {
            return serverIP;
        }
        if (this.localConfig["IsGaoFang"] == 0) {
            //fitst配置了高防
            return serverIP;
        }
        var AccessPoint = app.LocalDataManager().GetConfigProperty("Account", "AccessPoint");
        if (AccessPoint > 0) {
            if (AccessPoint == 1) {
                return 'line1.' + serverIP;
            } else if (AccessPoint == 2) {
                return 'line2.' + serverIP;
            } else if (AccessPoint == 3) {
                return 'line3.' + serverIP;
            }
        }
        var AccountActive = app.LocalDataManager().GetConfigProperty("Account", "AccountActive");
        //如果该城市有独立节点，则调用本城市自己的节点
        var myCityID = cc.sys.localStorage.getItem("myCityID");
        if (myCityID) {
            var CityPoints = this.localConfig["CityPoints"];
            if (CityPoints) {
                var CityPointsList = CityPoints.split(',');
                if (CityPointsList.indexOf(myCityID) > -1) {
                    //用户选择的城市有配置独立的节点
                    if (AccountActive > 10) {
                        return 'h' + myCityID + '.' + serverIP; //活跃用户
                    } else {
                        return 'c' + myCityID + '.' + serverIP; //普通用户
                    }
                }
            }
        }
        if (AccountActive > 100) {
            serverIP = 'a100.' + serverIP;
        } else if (AccountActive > 50) {
            serverIP = 'i50.' + serverIP;
        } else if (AccountActive > 10) {
            serverIP = 'x10.' + serverIP;
        }

        return serverIP;
    },

    //加载表数据回掉
    OnLoadTable: function OnLoadTable() {
        var _this = this;

        var that = this;
        var allCount = Object.keys(this.AllTableDict).length;

        //加载完所有表格
        if (this.loadTableCount >= allCount) {
            this.initState = this.State_LoadRes;
        }

        var _loop = function _loop(index) {

            var tableName = _this.AllTableNameList.pop();
            //已经发送所有表请求
            if (!tableName) {
                return "break";
            }
            var keyNameList = _this.AllTableDict[tableName];
            var tablePath = 'jsonData/' + tableName;

            _this.Client.ControlManager.CreateLoadPromise(tablePath, cc.RawAsset).then(function (textData) {
                that.loadTableCount += 1;
                that.allTableDataDict[tableName] = { "Data": textData, "KeyNameList": keyNameList };
            }).catch(function (error) {
                that.ErrLog("tablePath(%s) error:%s", tablePath, error.stack);
                that.initState = that.State_LoadResFail;
            });
        };

        for (var index = 0; index < this.PerTimeTableCount; index++) {
            var _ret = _loop(index);

            if (_ret === "break") break;
        }
    },

    //加载其他资源
    OnLoadRes: function OnLoadRes() {
        var _this2 = this;

        var that = this;
        var allCount = Object.keys(this.AllResDict).length;

        //加载完所有
        if (this.loadResCount >= allCount) {
            this.initState = this.State_StartGame;
        }

        var _loop2 = function _loop2(index) {

            var resName = _this2.AllResNameList.pop();
            //已经发送所有表请求
            if (!resName) {
                return "break";
            }
            var pathName = _this2.AllResDict[resName];
            var resPath = pathName + '/' + resName;

            var resType = "";
            //如果加载河图
            if (pathName == "atlas") {
                resType = cc.SpriteAtlas;
            }

            _this2.Client.ControlManager.CreateLoadPromise(resPath, resType).then(function (fileData) {
                that.loadResCount += 1;
            }).catch(function (error) {
                that.ErrLog("resPath(%s) error:%s", resPath, error.stack);
                that.initState = that.State_LoadResFail;
            });
        };

        for (var index = 0; index < this.PerTimeResCount; index++) {
            var _ret2 = _loop2(index);

            if (_ret2 === "break") break;
        }
    },

    /**
     * 发送HTTP请求
     * * @param requestType POST or GET
     */
    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        // app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 3000, 
        //     this.OnReceiveHttpPack.bind(this), 
        //     this.OnConnectHttpFail.bind(this),
        //     this.UseLocalConfig.bind(this),
        //     this.OnConnectHttpFail.bind(this),
        // );
        if (app.ControlManager().IsOpenVpn()) {
            return;
        }
        var url = [serverUrl, argString].join("");

        var dataStr = JSON.stringify(sendPack);
        var timeOut = false;
        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var httpRequest = new XMLHttpRequest();

        httpRequest.timeout = 3000;

        httpRequest.open(requestType, url, true);
        //服务器json解码
        httpRequest.setRequestHeader("Content-Type", "application/json");

        var that = this;
        httpRequest.onerror = function () {
            that.ErrLog("httpRequest.error:%s", url);
            that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        };
        httpRequest.ontimeout = function () {
            timeOut = true;
            that.UseLocalConfig();
        };
        httpRequest.onreadystatechange = function () {
            if (timeOut == true) {
                return;
            }
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

    //HTTP请求失败
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {
        /*this.ErrLog("OnConnectHttpFail(%s, %s,%s)", serverUrl, readyState, status);
        this.initState = this.State_LoadResFail;
        this.errorNode.active = 1;*/
        this.UseLocalConfig();
        this.ChangeMPID();
    },
    UseLocalConfig: function UseLocalConfig() {
        app["GateServerInfo"] = { "GateServerIP": "0.0.0.0", "GateServerPort": 0 };
        this.initState = this.State_LoadText;
        this.clientConfig = JSON.parse(JSON.stringify(this.localConfig));
        //保存到本地供子游戏调用
        cc.sys.localStorage.setItem("localConfig", JSON.stringify(this.localConfig));
    },
    ChangeMPID: function ChangeMPID() {
        if (app.ComTool().IsIOS()) {
            var vetsion = app.NativeManager().CallToNative("getVersion", [], "String");
            if (typeof vetsion != "undefined") {
                if (vetsion.startsWith("10.")) {
                    this.clientConfig["MPID"] = "dph_majia";
                }
                if (vetsion.startsWith("11.")) {
                    this.clientConfig["MPID"] = "dph_majia2";
                }
                if (vetsion.startsWith("12.")) {
                    this.clientConfig["MPID"] = "dph_majia3";
                }
            }
            var pack4 = cc.sys.localStorage.getItem("myPack4");
            if (pack4 == "hall_split") {
                this.clientConfig["MPID"] = "dph_ios4";
                return;
            }
            var pack5 = cc.sys.localStorage.getItem("myPack5");
            if (pack5 == "hall_split") {
                this.clientConfig["MPID"] = "dph_ios2";
                return;
            }
            var pack = cc.sys.localStorage.getItem("myPack");
            if (pack == "hall_split") {
                this.clientConfig["MPID"] = "dph_ios";
                return;
            }
            var pack2 = cc.sys.localStorage.getItem("myPack2");
            if (pack2 == "hall_split") {
                this.clientConfig["MPID"] = "dph_ios2";
                return;
            }
            var pack3 = cc.sys.localStorage.getItem("myPack3");
            if (pack3 == "hall_split") {
                this.clientConfig["MPID"] = "dph_ios3";
                return;
            }
        }
    },
    //http请求回复
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {

            var serverPack = JSON.parse(httpResText);
            if ((typeof serverPack === "undefined" ? "undefined" : _typeof(serverPack)) == 'object' && serverPack) {
                if (serverPack["IsSuccess"] == 1) {
                    this.clientConfig = serverPack["ClientConfig"];
                    //追加本地标示
                    this.clientConfig["GameID"] = this.localConfig["GameID"];
                    this.clientConfig["ConfigVersion"] = this.localConfig["ConfigVersion"];
                    this.clientConfig["MPID"] = this.localConfig["MPID"];
                    this.initState = this.State_LoadText;
                    this.SysLog("LoadClientConfig success");
                    //保存到本地供子游戏调用
                    cc.sys.localStorage.setItem("localConfig", JSON.stringify(this.clientConfig));
                } else {
                    this.clientConfig = {};
                    this.initState = this.State_LoadResFail;
                    this.errorNode.active = 1;
                }
            } else {
                this.UseLocalConfig();
            }
            this.ChangeMPID();
        } catch (error) {
            this.initState = this.State_LoadResFail;
            this.clientConfig = {};
            this.ChangeMPID();
        }
    },

    OnClick: function OnClick(eventTouch, eventData) {
        var btnNode = eventTouch.currentTarget;
        var btnName = btnNode.name;

        if (btnName == "btn_tryLoad") {
            this.Click_btn_tryLoad();
        } else {
            this.ErrLog("OnClick not find:%s", btnName);
        }
    },

    Click_btn_tryLoad: function Click_btn_tryLoad() {
        this.errorNode.active = 0;

        if (!this.gateServerUrl) {
            this.ErrLog("Click_btn_tryLoad not find gateServerUrl");
            return;
        }

        //开始请求客户端配置
        this.initState = this.State_SendGateHttp;
        this.SendHttpRequest(this.gateServerUrl, "?Sign=ddcat", "POST", this.gateSendPack);
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
        //# sourceMappingURL=SceneLaunch.js.map
        