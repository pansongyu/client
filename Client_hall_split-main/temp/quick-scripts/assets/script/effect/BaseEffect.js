(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/effect/BaseEffect.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1a032ej9/ZD87wmGaIcRL7o', 'BaseEffect', __filename);
// script/effect/BaseEffect.js

"use strict";

/*
    特效基类
*/

var app = require('app');
cc.Class({
    extends: require("BaseComponent"),

    properties: {},

    // 加载
    OnLoad: function OnLoad() {},

    //每帧回调
    update: function update(dt) {},

    OnCreate: function OnCreate(effectName, effectRes, userData, componentName, zorderLv) {
        this.JS_Name = effectName;

        this.animationNameList = [];
        this.animation = this.node.getComponent(cc.Animation);

        var clips = this.animation.getClips();
        var count = clips.length;
        for (var index = 0; index < count; index++) {
            var clip = clips[index];
            this.animationNameList.push(clip.name);
        }

        var defaultClip = this.animation.defaultClip;
        this.defaultAnimationName = "";
        if (defaultClip) {
            this.defaultAnimationName = defaultClip.name;
        }

        this.animation.on('play', this.OnPlay, this);
        this.animation.on('stop', this.OnStop, this);
        this.animation.on('finished', this.OnFinished, this);
        //this.animation.on('lastframe', this.OnLastFrame,   this);
        // this.animation.on('pause',     this.OnPause,       this);
        // this.animation.on('resume',    this.OnResume,      this);

        this.OnCreateInit();
        this.InitEffectData(effectName, effectRes, userData, componentName, zorderLv);
    },

    InitEffectData: function InitEffectData(effectName, effectRes, userData, componentName, zorderLv) {

        //事件分发节点
        this.eventNode = null;

        //父类
        this.Parent = null;

        this.dataInfo = {
            //模型名字
            "EffectName": effectName,
            //创建的模型资源名 ModelRes.txt
            "EffectRes": effectRes,
            //node的组件名(其实就是本类名)
            "ComponentName": componentName,
            //自定义数据
            "UserData": userData,
            //模型層
            "CreateZOrderLv": zorderLv,
            //界面特效控件路径
            "WndPath": ""
        };
    },

    //增加模型到父类
    AddModelToParent: function AddModelToParent(parent, eventNode) {
        var initPos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


        this.eventNode = eventNode;
        this.Parent = parent;

        //追加到父类 执行addChild,会回调执行OnLoad
        this.Parent.addChild(this.node, this.dataInfo["CreateZOrderLv"]);

        //默认都是居中显示特效
        if (initPos) {
            this.node.setPosition(initPos);
        }
    },

    //---------回调函数---------------------

    //动作开始播放 OnPlay->OnFinished -> OnStop;
    OnPlay: function OnPlay(event) {
        // let actionName = event.getCurrentTarget().name;
        // this.Log("OnPlay:%s", actionName);
    },

    //播放结束(循环中不会回掉)
    OnFinished: function OnFinished(event) {
        var argDict = {
            "Model": this,
            "AnimationName": event.getCurrentTarget().name
        };
        this.eventNode.emit("EffectAnimationEnd", argDict);
    },

    //动作被停止(循环中不会回掉)
    OnStop: function OnStop(event) {
        // let actionName = event.getCurrentTarget().name;
        // this.Log("OnStop:%s", actionName);
    },

    //关键帧回掉
    OnModelAnimationEvent: function OnModelAnimationEvent(eventType, hurtPercent) {
        var argDict = {};
        hurtPercent = Math.floor(hurtPercent);
        if (!hurtPercent) {
            hurtPercent = 100;
        }
        switch (eventType) {
            case "zd":
                app.Client.OnEvent("ShakeScene");
                break;

            case "h":
                argDict["GeneralKey"] = this.dataInfo["UserData"];
                argDict["HurtPercent"] = hurtPercent;

                app.Client.OnEvent("SkillHurt", argDict);
                break;

            case "zdh":
                argDict["GeneralKey"] = this.dataInfo["UserData"];
                argDict["HurtPercent"] = hurtPercent;
                app.Client.OnEvent("ShakeScene");
                app.Client.OnEvent("SkillHurt", argDict);
                break;

            default:
                this.ErrLog("OnEffectAnimationEvent eventType error", eventType);
                break;
        }
    },

    //被对象池回收
    unuse: function unuse() {
        this.animation.stop();
        //关闭HP Shadow的显示
        this.CloseEffect();
    },

    //对象池释放复用
    reuse: function reuse() {
        this.node.active = true;
    },

    //--------------操作函数-------------------

    //显示模型
    ShowEffect: function ShowEffect() {

        if (!this.defaultAnimationName) {
            this.ErrLog("ShowEffect not defaultAnimationName");
            return;
        }
        this.node.active = true;

        //获取粒子特效节点
        var particleNode = this.node.getChildByName("Particle");
        if (particleNode) {
            var childrenList = particleNode.children;
            var count = childrenList.length;
            //遍历所有子节点
            for (var index = 0; index < count; ++index) {
                var children = childrenList[index];
                var particle = children.getComponent(cc.ParticleSystem);
                //如果存在粒子这重新播放
                if (particle) {
                    particle.resetSystem();
                }
            }
        }

        return this.animation.play(this.defaultAnimationName);
    },

    //关闭模型
    CloseEffect: function CloseEffect() {
        this.node.active = false;

        //获取粒子特效节点
        var particleNode = this.node.getChildByName("Particle");
        if (particleNode) {
            var childrenList = particleNode.children;
            var count = childrenList.length;
            //遍历所有子节点
            for (var index = 0; index < count; ++index) {
                var children = childrenList[index];
                var particle = children.getComponent(cc.ParticleSystem);
                //如果存在粒子这重新播放
                if (particle) {
                    //闲重置会删除所有例子
                    particle.resetSystem();
                    //在停止发送粒子
                    particle.stopSystem();
                }
            }
        }
    },

    //销毁界面
    Destroy: function Destroy() {

        this.Parent.removeChild(this.node);
        //销毁节点
        this.node.destroy();
    },

    //播放动画动作
    PlayAnimation: function PlayAnimation(actioName) {
        if (this.animationNameList.indexOf(actioName) < 0) {
            this.Log("PlayAnimation(%s) not in :", actioName, this.animationNameList);
            return;
        }

        //停止当前动作
        this.animation.stop();
        //isPlaying isPaused 
        return this.animation.play(actioName);

        //指动画播放多少次后结束
        //animationState.repeatCount = 2;

        // WrapMode
        // Default Number
        // 向 Animation Component 或者 AnimationClip 查找 wrapMode

        // Normal Number
        // 动画只播放一遍

        // Reverse Number
        // 从最后一帧或结束位置开始反向播放，到第一帧或开始位置停止

        // Loop Number
        // 循环播放

        // LoopReverse Number
        // 反向循环播放

        // PingPong Number
        // 从第一帧播放到最后一帧，然后反向播放回第一帧，到第一帧后再正向播放，如此循环

        // PingPongReverse Number
        // 从最后一帧开始反向播放，其他同 PingPong
        //animationState.wrapMode  = 2;
    },

    //设置模型面向
    SetModelDir: function SetModelDir(dir) {

        var scaleX = Math.abs(this.node.scaleX);

        if (dir == "left") {
            this.node.scaleX = -1 * scaleX;
        } else {
            this.node.scaleX = scaleX;
        }
    },

    SetModelProperty: function SetModelProperty(property, value) {

        if ("ZOrderLv" == property) {
            this.node.zIndex = value;
        } else if (this.dataInfo.hasOwnProperty(property)) {
            this.dataInfo[property] = value;
        } else {
            this.ErrLog("SetModelProperty(%s) not find(%s)", this.dataInfo, property);
            return;
        }
    },

    //--------------获取接口-----------------

    //获取模型属性
    GetModelProperty: function GetModelProperty(property) {
        if (!this.dataInfo.hasOwnProperty(property)) {
            this.ErrLog("GetModelProperty(%s) not find(%s)", this.dataInfo, property);
            return;
        }
        return this.dataInfo[property];
    },

    //-----子类重载----------------

    OnCreateInit: function OnCreateInit() {}

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
        //# sourceMappingURL=BaseEffect.js.map
        