"use strict";
cc._RF.push(module, '2c4d3EXqhhOAKJPScn43V0g', 'SceneManager');
// script/scene/SceneManager.js

"use strict";

/*
	场景管理器
*/

var app = require('app');

var SceneManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = "SceneManager";

        this.SceneInfo = app.SysDataManager().GetTableDict("SceneInfo");

        this.backMusicSoundID = -1;
        this.beforeBackMusicSoundName = "";

        this.mapID = 0;
        this.sceneName = "";
        //当前场景的组件对象
        this.sceneComponent = null;

        this.loadingNode = null;

        this.isLoading = false;

        this.isFirstEnterMainScene = true;

        app.Client.RegEvent("ModalLayer", this.OnEvent_ModalLayer, this);
        app.Client.RegEvent("ShakeScene", this.OnEvent_OnShakeScene, this);

        this.Log("Init");
    },

    //---------------回掉事件---------------
    //显示最顶层layer
    OnEvent_ModalLayer: function OnEvent_ModalLayer(event) {
        if (!this.sceneComponent) {
            this.WarnLog("OnEvent_ModalLayer not sceneName");
            return;
        }
        this.sceneComponent.OnTopEvent(event);
    },

    //应用切入后台
    OnEventHide: function OnEventHide() {
        if (!this.sceneComponent) {
            this.WarnLog("OnEventHide not sceneName");
            return;
        }
        this.sceneComponent.OnEventHide();
    },

    //应用显示
    OnEventShow: function OnEventShow(bReConnect) {
        if (!this.sceneComponent) {
            this.WarnLog("OnEventShow not sceneName");
            return;
        }
        this.sceneComponent.OnEventShow(bReConnect);
    },

    OnEvent_OnShakeScene: function OnEvent_OnShakeScene() {
        if (!this.sceneComponent) {
            this.WarnLog("OnEvent_ModalLayer not sceneName");
            return;
        }
        this.sceneComponent.OnShakeScene();
    },
    //---------------外部操作接口----------------

    //切换场景
    LoadScene: function LoadScene(sceneName) {
        var mapID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (!this.SceneInfo.hasOwnProperty(sceneName)) {
            this.ErrLog("LoadScene(%s) SceneInfo.txt not find", sceneName);
            return;
        }

        if (this.isLoading) {
            this.ErrLog("LoadScene(%s) fail doing (%s) loading now", sceneName, this.sceneName);
            return;
        }

        this.isLoading = true;
        this.ReadyLoadScene(sceneName, mapID);
    },
    ReadyLoadScene: function ReadyLoadScene(sceneName, mapID) {
        var lastSceneName = this.sceneName;
        this.Log("LoadScene((%s,%s) -> (%s,%s))", lastSceneName, this.mapID, sceneName, mapID);
        this.mapID = mapID;
        this.sceneName = sceneName;
        var lastSceneScriptName = "";
        var lastSceneScript = null;
        var that = this;
        //如果前一个场景不是启动场景
        if (this.SceneInfo.hasOwnProperty(lastSceneName)) {
            lastSceneScriptName = this.SceneInfo[lastSceneName]["ComponentName"];
            //找到场景对应的脚本组件

            lastSceneScript = cc.find('Canvas').getComponent(lastSceneScriptName);
        }

        var bluebirdObj = app.FormManager().LoadSceneDefaultForm(sceneName);

        //如果返回异步对象,需要登录异步执行完成,在进入切换场景
        if (bluebirdObj) {
            bluebirdObj.then(function () {
                that.StartLoadScene(lastSceneScript, lastSceneScriptName, sceneName);
            }).catch(function (error) {
                that.ErrLog("LoadSceneDefaultForm(%s) error:%s", sceneName, error.stack);

                that.StartLoadScene(lastSceneScript, lastSceneScriptName, sceneName);
            });
        } else {
            this.StartLoadScene(lastSceneScript, lastSceneScriptName, sceneName);
        }
    },
    formPath2RealPath: function formPath2RealPath(formPath) {
        if (formPath.indexOf('/') < 1) {
            return 'ui/' + formPath;
        }
        return formPath;
    },
    RealGamePrefab: function RealGamePrefab(GamePrefab) {
        var is3DShow = app.LocalDataManager().GetConfigProperty("SysSetting", "is3DShow");
        if (is3DShow == 0 && GamePrefab == 'game/ZJMJ/ui/UIZJMJPlay') {
            //2D场景需要切换
            GamePrefab = 'game/ZJMJ/ui/UIZJMJ2DPlay';
        }
        if (is3DShow == 2 && GamePrefab == 'game/ZJMJ/ui/UIZJMJPlay') {
            //2D场景需要切换
            GamePrefab = 'game/ZJMJ/ui/UIZJMJKXPlay';
        }
        if (is3DShow == 3 && GamePrefab == 'game/ZJMJ/ui/UIZJMJPlay') {
            //2D场景需要切换
            GamePrefab = 'game/ZJMJ/ui/UIZJMJ17Play';
        }
        return this.formPath2RealPath(GamePrefab);
    },
    StartLoadScene: function StartLoadScene(lastSceneScript, lastSceneScriptName, sceneName) {
        //预加载有戏场景开始
        // console.log("StartLoadScene sceneName == " + sceneName);
        // console.log("StartLoadScene SceneInfo == " + JSON.stringify(this.SceneInfo));
        var GamePrefab = this.SceneInfo[sceneName].gamePrefab;
        var that = this;
        if (GamePrefab == 0) {
            //退出当前场景
            if (lastSceneScript) {
                lastSceneScript.OnBeforeExitScene();
            }
            //关闭场景界面和模型
            app.FormManager().OnBeforeExitScene(lastSceneScriptName);
            //加载失败,也要切换进场景
            this.sceneComponent = null;
            cc.director.loadScene(sceneName, that.OnLoadSceneEnd.bind(that));
        } else {
            app.ControlManager().CreateLoadPromise(this.RealGamePrefab(GamePrefab)).then(function (prefab) {
                //退出当前场景
                //加载失败,也要切换进场景
                that.sceneComponent = null;
                cc.director.preloadScene(sceneName, function () {

                    if (lastSceneScript) {
                        lastSceneScript.OnBeforeExitScene();
                    }
                    //关闭场景界面和模型
                    app.FormManager().OnBeforeExitScene(lastSceneScriptName);

                    cc.director.loadScene(sceneName, that.OnLoadSceneEnd.bind(that));
                });
                return;
            }).catch(function (error) {
                //
            });
        }
        //预加载有戏场景
    },

    ShowHelp: function ShowHelp(eventID, eventNode) {
        if (this.sceneComponent) {
            this.sceneComponent.ShowHelp(eventID, eventNode);
        }
    },

    //播放背景音乐
    PlayMusic: function PlayMusic(backGroundSound) {
        var backVolume = app.LocalDataManager().GetConfigProperty("SysSetting", "BackVolume");
        //如果关闭音效
        if (!backVolume) {
            return;
        }
        if (!this.SceneInfo.hasOwnProperty(this.sceneName)) {
            this.ErrLog("PlayMusic failed, SceneInfo.txt not find:%s", this.sceneName);
            return;
        }

        if (!backGroundSound) {
            backGroundSound = this.SceneInfo[this.sceneName]["BackGroundSound"];
            //读取缓存的背景音乐
            if (backGroundSound != "" && backGroundSound != "0") {
                backGroundSound = app.LocalDataManager().GetConfigProperty("SysSetting", "MainBackMusic");
            }
            //读取缓存的背景音乐
        }

        if (!backGroundSound) {
            return;
        }

        //如果切换场景时，两个场景播放的背景音乐相同则不需要再次播放
        // if(this.beforeBackMusicSoundName == backGroundSound){
        //     return;
        // }
        //如果背景音乐不同，则先停止上一个场景残留的背景音乐，重新播放新的背景音乐
        this.StopSceneMusic();
        this.beforeBackMusicSoundName = backGroundSound;

        var that = this;
        app.SoundManager().PlayBackMusic(backGroundSound).then(function (soundID) {
            that.backMusicSoundID = soundID;
        });
    },

    PauseSceneMusic: function PauseSceneMusic() {
        if (this.backMusicSoundID != -1) {
            app.SoundManager().PauseSound(this.backMusicSoundID);
        }
    },
    RecoverySceneMusic: function RecoverySceneMusic() {
        if (this.backMusicSoundID != -1) {
            app.SoundManager().ResumeSound(this.backMusicSoundID);
        }
    },
    StopSceneMusic: function StopSceneMusic() {
        if (this.backMusicSoundID != -1) {
            app.SoundManager().StopSoundByAudioID(this.backMusicSoundID);
        }
    },
    UpdateSceneMusic: function UpdateSceneMusic() {
        if (this.backMusicSoundID != -1) {
            var volume = app.LocalDataManager().GetConfigProperty("SysSetting", "BackVolume");
            cc.audioEngine.setVolume(this.backMusicSoundID, volume);
        }
    },
    //------------回掉函数-------------------

    //场景加载完成回掉
    OnLoadSceneEnd: function OnLoadSceneEnd() {
        this.Log("OnLoadSceneEnd sceneName:%s", this.sceneName);

        this.isLoading = false;
        console.log("unload uiwaitform  begein");
        if (this.loadingNode) {
            cc.game.removePersistRootNode(this.loadingNode);
            this.loadingNode.removeFromParent();
            console.log("unload uiwaitform success");
        }

        if (!this.SceneInfo.hasOwnProperty(this.sceneName)) {
            this.ErrLog("OnLoadSceneEnd SceneInfo.txt not find:(%s)", this.sceneName);
            return;
        }
        var sceneScriptName = this.SceneInfo[this.sceneName]["ComponentName"];
        //找到场景对应的脚本组件

        this.sceneComponent = cc.find('Canvas').getComponent(sceneScriptName);

        var node = cc.find('Canvas');
        var c = node.getComponent(cc.Canvas);
        var heightWidth = cc.winSize.height / cc.winSize.width;
        if (app.ComTool().IsIpad() || heightWidth > 0.6) {
            c.fitWidth = true;
        } else {
            c.fitWidth = false;
        }

        /*if(cc.winSize.width/cc.winSize.height>2){
            //宽屏手机，两边各留100像素
            let d=node.getComponent(cc.Widget);
            d.left=100;
            d.right=100;
        }*/

        var FormManager = app.FormManager();

        FormManager.OnSwithSceneEnd(this.sceneName);

        if (this.isFirstEnterMainScene) {
            if (this.sceneName == "mainScene") {
                app.Client.OnFirstEnterMainScene();
                this.isFirstEnterMainScene = false;
            }
        } else {
            app.PlayerHelpManager().OnSwithSceneEnd(this.sceneName);
        }

        this.sceneComponent.OnShowDefaultForm();
        this.sceneComponent.OnSwithSceneEnd();

        this.PlayMusic();
    },

    //定时回掉
    OnTimer: function OnTimer(passSecond) {
        if (this.sceneComponent) {
            this.sceneComponent.OnBaseTimer(passSecond);
        }
    },

    //切换账号
    OnReload: function OnReload() {
        this.isFirstEnterMainScene = true;
    },
    //-----------------获取接口---------------------------

    //获取当前加载的场景名
    GetSceneType: function GetSceneType() {
        return this.sceneName;
    },

    //获取当前场景的组件对象
    GetSceneComponent: function GetSceneComponent() {
        return this.sceneComponent;
    },

    //获取当前场景的地图ID
    GetMapID: function GetMapID() {
        return this.mapID;
    }
});

var g_SceneManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_SceneManager) {
        g_SceneManager = new SceneManager();
    }
    return g_SceneManager;
};

cc._RF.pop();