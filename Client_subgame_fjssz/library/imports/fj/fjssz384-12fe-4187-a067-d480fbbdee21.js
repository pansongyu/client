"use strict";
cc._RF.push(module, 'fjssz384-12fe-4187-a067-d480fbbdee21', 'fjssz_EffectManager');
// script/common/fjssz_EffectManager.js

"use strict";

/*
    特效管理器
*/
var app = require("fjssz_app");

var sss_EffectManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = app.subGameName + "_EffectManager";
        this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
        this.Effect = this.SysDataManager.GetTableDict("Effect");

        //特效回收池
        this.cacheEffectDict = {};

        //预制缓存字典
        this.loadPrefabDict = {};
    },

    //-----------创建接口--------------------
    //根据模型资源创建模型
    CreateEffectByEffectRes: function CreateEffectByEffectRes(effectName, effectRes) {
        var userData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;


        var that = this;
        // console.log("EFFENT DATA TABLE:",this.Effect);
        if (!this.Effect.hasOwnProperty(effectRes)) {
            console.error("CreateEffectByEffectRes Effect.txt not find(%s)", effectRes);
            return app.bluebird.reject(new Error("CreateEffectByEffectRes effectRes not find"));
        }
        var resInfo = this.Effect[effectRes];
        var prefabPath = resInfo["FilePath"];
        var componentName = resInfo["ComponentName"];
        var zorderLv = resInfo["ZorderLv"];

        return this.CreateEffect(effectName, effectRes, userData, prefabPath, componentName, zorderLv).catch(function (error) {
            that.ErrLog("CreateEffectByEffectRes(%s,%s,%s) error:%s", effectName, effectRes, userData, error.stack);
        });
    },

    //创建模型
    CreateEffect: function CreateEffect(effectName, effectRes, userData, prefabPath, componentName, zorderLv) {
        var that = this;
        var effectNode = null;

        if (this.cacheEffectDict.hasOwnProperty(effectRes)) {
            effectNode = this.cacheEffectDict[effectRes].get();
        }

        //如缓存池中有对象
        if (effectNode) {
            //直接获取脚本组件对象
            var effectComponent = effectNode.getComponent(componentName);
            effectNode.active = false;
            //不需要调用OnCreate接口创建
            effectComponent.InitEffectData(effectName, effectRes, userData, componentName, zorderLv);
            return app.bluebird.resolve(effectComponent);
        } else {
            return this.LoadPrefab(prefabPath).then(function (effePrefabObj) {

                //that.Log("CreateEffect(%s,%s,%s)", effectName, effectRes, prefabPath);
                console.log("CreateEffect effectName:" + effectName);
                console.log("CreateEffect effectRes:" + effectRes);
                console.log("CreateEffect prefabPath:" + prefabPath);
                console.log("CreateEffect componentName:" + componentName);
                var effectNode = cc.instantiate(effePrefabObj);
                //设置模型不可以见,需要模型自动ShowModel
                effectNode.active = false;
                //预制名和组件名相同,获取脚本组件名
                var effectComponent = effectNode.getComponent(componentName);
                if (!effectComponent) {
                    that.ErrLog("CreateEffect(%s,%s) not find Component (%s)", effectName, effectRes, componentName);
                    return null;
                }

                effectComponent.OnCreate(effectName, effectRes, userData, componentName, zorderLv);

                return effectComponent;
            });
        }
    },

    //载入模型预制
    LoadPrefab: function LoadPrefab(prefabPath) {

        var loadPrefabDict = this.loadPrefabDict;

        //缓存处理,预制可能已经加载过了
        if (loadPrefabDict.hasOwnProperty(prefabPath)) {
            return app.bluebird.resolve(loadPrefabDict[prefabPath]);
        }
        var that = this;

        return app[app.subGameName + "_ControlManager"]().CreateLoadPromise(prefabPath).then(function (prefab) {
            loadPrefabDict[prefabPath] = prefab;
            return prefab;
        });
    },

    //----------------操作接口--------------------
    //删除特效
    DeleteEffect: function DeleteEffect(effectComponent) {
        var effectRes = effectComponent.GetModelProperty("EffectRes");

        this.CacheModelNode(effectRes, effectComponent);

        // if(this.NeedCacheEffectResDict.hasOwnProperty(effectRes)){

        // }
        // else{
        //     effectComponent.Destroy();
        // }
    },

    //删除特效通过字典
    DeleteEffectByDict: function DeleteEffectByDict(effectComponentDict) {
        var effectNameList = Object.keys(effectComponentDict);
        var count = effectNameList.length;
        for (var index = 0; index < count; index++) {
            var effectComponent = effectComponentDict[effectNameList[index]];
            var effectRes = effectComponent.GetModelProperty("EffectRes");
            this.CacheModelNode(effectRes, effectComponent);
        }
    },

    //回收节点
    CacheModelNode: function CacheModelNode(effectRes, component) {

        //如果是模型对象缓存
        var componentName = component.GetModelProperty("ComponentName");
        //如果是需要记录到缓冲池的
        if (!this.cacheEffectDict.hasOwnProperty(effectRes)) {
            this.cacheEffectDict[effectRes] = new cc.NodePool(componentName);
        }
        var modelPool = this.cacheEffectDict[effectRes];
        modelPool.put(component.node);
    }

});

var g_sss_EffectManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_sss_EffectManager) {
        g_sss_EffectManager = new sss_EffectManager();
    }
    return g_sss_EffectManager;
};

cc._RF.pop();