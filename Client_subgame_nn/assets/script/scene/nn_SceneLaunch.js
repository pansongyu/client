/*
    客户端启动场景，不受场景管理
*/

var app = require("nn_app");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    //加载
    onLoad: function () {
        //节点更新回默认节点
        app.LocalDataManager().SetConfigProperty("Account", "AccessPoint",0);
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
        this.Client = app[app.subGameName + "Client"];
        this.Client.OnInitClientData("", 1);
        this.InitTable();
        this.LoadFirstConfig();

        cc.sys.localStorage.setItem("curRunGame", app.subGameName);
    },


    GetMsg:function(argList){
        let logText = cc.js.formatStr.apply(null, argList);
        return "SceneLaunch" + "\t" + logText;
    },

    Log:function(...argList){
        cc.log(this.GetMsg(argList));
    },

    SysLog:function(...argList){
        cc.log(this.GetMsg(argList));
    },

    ErrLog:function(...argList){
        cc.error(this.GetMsg(argList));
    },
    
    //初始化加载debug文件
    LoadFirstConfig:function(){
        if (cc.sys.isNative) {
            //线上的直接读取大厅的本地保存
            this.localConfig = cc.sys.localStorage.getItem("localConfig");
            console.log("大厅配置表：" + this.localConfig);
            this.clientConfig = JSON.parse(this.localConfig);
            this.initState = this.State_LoadText;
        }else{
            let that = this;
            this.Client[app.subGameName+"_ControlManager"].CreateLoadPromise("firstConfig")
                .then(function(textData){

                    if(!that.OnLoadFirstConfig(textData)){
                        console.error("OnLoadFirstConfig(%s) fail", textData);
                        that.initState = that.State_LoadResFail;
                    }
                })
                .catch (function(error){
                    console.error("OnLoadFirstConfig:%s error", error.stack);
                    that.initState = that.State_LoadResFail;
                })
        }
    },

    //解析配置
    OnLoadFirstConfig:function(textData){
        this.localConfig = {};
        try{
            let textDataList = textData.text.split("\n");
            let count = textDataList.length;
            for(let index=0; index<count; index++){
                //去除空格
                let dataString = textDataList[index].replace(/(\s*$)/g, "");
                if(!dataString){
                    continue
                }
                if(dataString.startsWith("#")){
                    continue
                }
                let dataList = dataString.split("=");
                if(dataList.length < 2){
                    console.error("OnLoadFirstConfig dataString:%s error", dataString);
                    continue
                }
                let keyName = dataList.shift().replace(/(\s*$)/g, "");

                //有可能是多个等于号,后续的分割列表合并成一个做为value
                let value = "";
                if(dataList.length != 1){
                    value = dataList.join("=");
                }
                else{
                    value = dataList[0];
                }
                value = value.replace(/(\s*$)/g, "");
                //如果是List或者Dict
                if(keyName.endsWith("List") || keyName.endsWith("Dict")){
                    value = JSON.parse(value);
                }
                this.localConfig[keyName] = value;
            }
        }
        catch (error){
            console.error("OnLoadFirstConfig(%s) error:%s", textData, error.stack);
            return false
        }

        let gateServerIP = 0;
        let dbGateServerInfo = app.LocalDataManager().GetConfigProperty("DebugInfo", "GateServerInfo");
        //优先使用本地数据库缓存
        if(dbGateServerInfo && dbGateServerInfo["GateServerIP"]){
            gateServerIP = dbGateServerInfo["GateServerIP"];
        }
        else{
            gateServerIP = this.localConfig["GateServerIP"];
            gateServerIP=this.MultiPoint(gateServerIP);
        }

        //如果没有配置IP,使用本地配置
        if(gateServerIP){
            let gateServerPort = 0;
            //优先使用本地数据库缓存
            if(dbGateServerInfo && dbGateServerInfo["GateServerPort"]){
                gateServerPort = dbGateServerInfo["GateServerPort"];
            }
            else{
                gateServerPort = app[app.subGameName+"_ComTool"]().ListChoice(this.localConfig["GateServerPortList"]);
            }
            if(!gateServerPort){
                console.error("localConfig and dbGateServerInfo not find gateServerPort:", this.localConfig, dbGateServerInfo);
                return false
            }
            this.gateServerUrl = ["http://", gateServerIP, ":", gateServerPort, "/ClientPack"].join("");
            //存放到app作用域
            app["GateServerInfo"] = {"GateServerIP":gateServerIP, "GateServerPort":gateServerPort};

            this.gateSendPack = {
                                    "Head":0xFF10,
                                    "GameID":this.localConfig["GameID"],
                                    "ConfigVersion":this.localConfig["ConfigVersion"],
                                };
            //开始请求客户端配置
            this.initState = this.State_SendGateHttp;
            this.SendHttpRequest(this.gateServerUrl, "?Sign=ddcat", "POST", this.gateSendPack);
        }
        //不需要下载远程配置,使用本地配置
        else{
            app["GateServerInfo"] = {"GateServerIP":"0.0.0.0", "GateServerPort":0};
            this.initState = this.State_LoadText;
            this.clientConfig = JSON.parse(JSON.stringify(this.localConfig));
        }

        return true;
    },

    /**
     * 发送HTTP请求
     * * @param requestType POST or GET
     */
    SendHttpRequest:function(serverUrl, argString, requestType, sendPack){

        var url = [serverUrl, argString].join("")

        var dataStr = JSON.stringify(sendPack);
        let timeOut=false;
        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var httpRequest = new XMLHttpRequest();

        httpRequest.timeout = 3000;


        httpRequest.open(requestType, url, true);
        //服务器json解码
        httpRequest.setRequestHeader("Content-Type", "application/json");

        var that = this;
        httpRequest.onerror = function(){
            console.error("httpRequest.error:%s", url);
            that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        };
        httpRequest.ontimeout = function(){
            timeOut=true;
            that.UseLocalConfig();
        };
        httpRequest.onreadystatechange = function(){
            if(timeOut==true){
                return;
            }
            //执行成功
            if (httpRequest.status == 200){
                if(httpRequest.readyState == 4){
                    that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
                }
            }
            else{
                that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
                console.error("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
            }
        };
        httpRequest.send(dataStr);

    },

    //HTTP请求失败
    OnConnectHttpFail:function(serverUrl, readyState, status){
        this.UseLocalConfig();    
    },
    UseLocalConfig:function(){
        app["GateServerInfo"] = {"GateServerIP":"0.0.0.0", "GateServerPort":0};
        this.initState = this.State_LoadText;
        this.clientConfig = JSON.parse(JSON.stringify(this.localConfig));
    },

    //http请求回复
    OnReceiveHttpPack:function(serverUrl, httpResText){
        try{
            let serverPack = JSON.parse(httpResText);

            if(serverPack["IsSuccess"] == 1){
                this.clientConfig = serverPack["ClientConfig"];
                //追加本地标示
                this.clientConfig["GameID"] = this.localConfig["GameID"];
                this.clientConfig["ConfigVersion"] = this.localConfig["ConfigVersion"];

                this.initState = this.State_LoadText;
            }
            else{
                this.clientConfig = {};
                this.initState = this.State_LoadResFail;
                console.error("LoadClientConfig fail");

                this.errorNode.active = 1;
            }
        }
        catch (error){
            console.error("OnReceiveHttpPack:%s", error.stack);
            this.initState = this.State_LoadResFail;
            this.clientConfig = {};
        }
    },

    MultiPoint:function(serverIP){
        if(serverIP==""){
            return "";
        }
        if(app[app.subGameName + "Client"].GetClientConfigProperty("IsGaoFang")==0){
            //不接入高防
            return serverIP;
        }
        let AccessPoint=app.LocalDataManager().GetConfigProperty("Account", "AccessPoint");
        if(AccessPoint>0){
            if(AccessPoint==1){
                return 'line1.'+serverIP;
            }else if(AccessPoint==2){
                return 'line2.'+serverIP;
            }else if(AccessPoint==3){
                return 'line3.'+serverIP;
            }
        }

        let AccountActive = app.LocalDataManager().GetConfigProperty("Account", "AccountActive");
        //如果该城市有独立节点，则调用本城市自己的节点
        let myCityID = cc.sys.localStorage.getItem("myCityID");
        if(myCityID){
            let CityPoints=app[app.subGameName + "Client"].GetClientConfigProperty("CityPoints");
            if(CityPoints){
                let CityPointsList=CityPoints.split(',');
                if(CityPointsList.indexOf(myCityID)>-1){
                    //用户选择的城市有配置独立的节点
                    if(AccountActive>10){
                        return 'h'+myCityID+'.'+serverIP; //活跃用户
                    }else{
                        return 'c'+myCityID+'.'+serverIP; //普通用户
                    }
                }
            }
        }
        if(AccountActive>100){
            serverIP='a100.'+serverIP;
        }else if(AccountActive>50){
            serverIP='i50.'+serverIP;
        }else if(AccountActive>10){
            serverIP='x10.'+serverIP;
        }


        return serverIP;
    },

    //初始化表数据
    InitTable:function(){
        this.AllTableDict = {
            "gameCreate":null,
            "gameList":null,
            "GameHelp":null,
            "IntegrateImage":null,
            "practice":null,
            "roomcost":null,
            "SceneInfo":null,
            "trusteeshipTime":null,
            "Effect":null,
            "Sound":null,
            "Gift":null,
            "NewSysMsg":null,
            "keywords":null,
        };
        this.AllTableNameList = Object.keys(this.AllTableDict);
        
        //每次加载几张配置表
        this.PerTimeTableCount = 2;
        this.loadTableCount = 0;
    },

    //加载表数据回掉
    OnLoadTable:function(){

        let that = this;
        let allCount = Object.keys(this.AllTableDict).length;
        
        //加载完所有表格
        if(this.loadTableCount >= allCount){
            this.initState = this.State_StartGame;
        }

        for(let index = 0; index < this.PerTimeTableCount; index++){

            let tableName = this.AllTableNameList.pop();
            //已经发送所有表请求
            if(!tableName){
                break
            } 
            let keyNameList = this.AllTableDict[tableName];
            let tablePath = 'jsonData/' + tableName;

            this.Client[app.subGameName+"_ControlManager"].CreateLoadPromise(tablePath, cc.RawAsset)
                                    .then(function(textData){
                                        that.loadTableCount += 1;
                                        that.allTableDataDict[tableName] = {"Data":textData, "KeyNameList":keyNameList};
                                    })
                                    .catch(function(error){
                                        console.error("tablePath(%s) error:%s", tablePath, error.stack);
                                        that.initState = that.State_LoadResFail;
                                    })
        }
    },

    //每帧回掉
    update: function (dt) {
        //没有初始化客户端实例
        if(!this.Client){
            return
        }

        switch (this.initState){
            case this.State_LoadText:
                this.OnLoadTable();
                break
            
            case this.State_StartGame:
                this.initState = this.State_RunGame;
                this.Client.OnInitClientFinish(this.allTableDataDict, this.clientConfig);
                 if (!cc.sys.isNative){
                    //不是真机，直接调用登录
                    this.Client.LoadLogin();
                    return;
                }else{
                    this.ReloadInitModel();
                    let accountID = app.LocalDataManager().GetConfigProperty("Account", "AccountID");
                    app[app.subGameName + "_NetManager"]().InitConnectAccountID(accountID);
                    app[app.subGameName + "_NetManager"]().InitConnectServer();
                }
                break
            case this.State_RunGame:
                
                break
            default:
                break
        }
    },

    //重新载入需要重新初始化脚本
    ReloadInitModel:function(){
        if (!cc.sys.isNative) return;
        let needInitModel = [
                                // "SysNotifyManager",
                                // "WeChatManager",
                                // //资源模块
                                // // "SceneManager",
                                // "EffectManager",
                                // "SoundManager",
                                app.subGameName + "_SceneManager",
                                app.subGameName + "_AudioManager",
                                //数据管理器
	                            app.subGameName + "_HeroAccountManager",
                                // "GameManager",
                                // //-----战斗相关-------
                                // "PlayerRoomManager",
                            ];

        for (var i = 0; i < needInitModel.length; i++) {
            require(needInitModel[i]).GetModel().Init();
        }
    },
});
