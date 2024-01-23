(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/SceneReload.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '830f2XOVzlFXaDSksSAbWSW', 'SceneReload', __filename);
// script/scene/SceneReload.js

"use strict";

/*
    客户端启动场景，不受场景管理
*/

var app = require("app");

var SceneReload = cc.Class({
    extends: cc.Component,

    properties: {},

    //加载
    onLoad: function onLoad() {
        var _this = this;

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
        //初始化状态
        this.initState = this.State_InitClient;

        //所有表数据字典
        this.allTableDataDict = {};

        //下载的客户端配置
        this.clientConfig = {};

        //从全局空间获取客户端ClientManager
        this.Client = app.Client;
        this.Client.OnInitClientData("", 1);
        this.InitTable();
        this.LoadFirstConfig();

        cc.sys.localStorage.setItem("curRunGame", "hall");
        cc.sys.localStorage.setItem("curRunHall", "hall_qmyl");

        this.scheduleOnce(function () {
            var SceneType = app.SceneManager().GetSceneType();
            _this.ErrLog("reloadScene scheduleOnce SceneType:" + SceneType);
            if (SceneType == "reloadScene" || SceneType == "") {
                app.Client.LogOutGame(1);
            }
        }, 6);
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

        return true;
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
        this.UseLocalConfig();
    },
    UseLocalConfig: function UseLocalConfig() {
        app["GateServerInfo"] = { "GateServerIP": "0.0.0.0", "GateServerPort": 0 };
        this.initState = this.State_LoadText;
        this.clientConfig = JSON.parse(JSON.stringify(this.localConfig));
    },

    //http请求回复
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);

            if (serverPack["IsSuccess"] == 1) {
                this.clientConfig = serverPack["ClientConfig"];
                //追加本地标示
                this.clientConfig["GameID"] = this.localConfig["GameID"];
                this.clientConfig["ConfigVersion"] = this.localConfig["ConfigVersion"];

                this.initState = this.State_LoadText;
                this.SysLog("LoadClientConfig success");
            } else {
                this.clientConfig = {};
                this.initState = this.State_LoadResFail;
                this.ErrLog("LoadClientConfig fail");

                this.errorNode.active = 1;
            }
        } catch (error) {
            this.ErrLog("OnReceiveHttpPack:%s", error.stack);
            this.initState = this.State_LoadResFail;
            this.clientConfig = {};
        }
    },

    MultiPoint: function MultiPoint(serverIP) {
        if (serverIP == "") {
            return "";
        }
        if (app.Client.GetClientConfigProperty("IsGaoFang") == 0) {
            //不接入高防
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
        if (AccountActive > 100) {
            serverIP = 'a100.' + serverIP;
        } else if (AccountActive > 50) {
            serverIP = 'i50.' + serverIP;
        } else if (AccountActive > 10) {
            serverIP = 'x10.' + serverIP;
        }

        return serverIP;
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

    //加载表数据回掉
    OnLoadTable: function OnLoadTable() {
        var _this2 = this;

        var that = this;
        var allCount = Object.keys(this.AllTableDict).length;

        //加载完所有表格
        if (this.loadTableCount >= allCount) {
            this.initState = this.State_StartGame;
        }

        var _loop = function _loop(index) {

            var tableName = _this2.AllTableNameList.pop();
            //已经发送所有表请求
            if (!tableName) {
                return "break";
            }
            var keyNameList = _this2.AllTableDict[tableName];
            var tablePath = 'jsonData/' + tableName;

            _this2.Client.ControlManager.CreateLoadPromise(tablePath, cc.RawAsset).then(function (textData) {
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

    //每帧回掉
    update: function update(dt) {
        //没有初始化客户端实例
        if (!this.Client) {
            return;
        }

        switch (this.initState) {
            case this.State_LoadText:
                this.OnLoadTable();
                break;

            case this.State_StartGame:
                this.initState = this.State_RunGame;
                this.Client.OnInitClientFinish(this.allTableDataDict, this.clientConfig);
                this.ReloadInitModel();
                var accountID = app.LocalDataManager().GetConfigProperty("Account", "AccountID");
                app.NetManager().InitConnectAccountID(accountID);
                console.log("开始重新连接  accountID：" + accountID);
                app.NetManager().InitConnectServer();
                break;
            case this.State_RunGame:

                break;
            default:
                break;
        }
    },
    //重新载入需要重新初始化脚本
    ReloadInitModel: function ReloadInitModel() {
        var needInitModel = [
        // "SysNotifyManager",
        // "WeChatManager",
        // //资源模块
        // // "SceneManager",
        // "EffectManager",
        // "SoundManager",
        //数据管理器
        "HeroAccountManager",
        // "RoomRecordManager",
        // //-----汇总数据管理器----
        "ClubManager", "PlayerHelpManager"];

        for (var i = 0; i < needInitModel.length; i++) {
            require(needInitModel[i]).GetModel().Init();
        }
    }
});

module.exports = SceneReload;

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
        //# sourceMappingURL=SceneReload.js.map
        