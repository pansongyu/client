"use strict";
cc._RF.push(module, 'ef2e9jaWxxO7Kh7lwy3/Nbt', 'ScenePoker');
// script/scene/ScenePoker.js

"use strict";

/*
    打牌场景
*/

var app = require("app");

cc.Class({
    extends: require("BaseScene"),

    properties: {},

    //------回掉函数-------------------
    OnCreate: function OnCreate() {
        this.lastShowTime = 0;
        this.lastHideTime = 0;
        this.appIsHide = false;
    },

    //进入场景
    OnSwithSceneEnd: function OnSwithSceneEnd() {},
    OnEventShow: function OnEventShow(bReConnect) {
        this.appIsHide = false;
        var curTime = new Date().getTime();
        if (curTime > this.lastShowTime + 1000) {
            //后台切回来有可能调用两次BUG
            this.lastShowTime = curTime;
            app.Client.OnEvent('OnEventShow', { 'bReConnect': bReConnect });
        }
    },
    OnEventHide: function OnEventHide() {
        this.appIsHide = true;
        var curTime = new Date().getTime();
        if (curTime > this.lastHideTime + 1000) {
            //后台切回来有可能调用两次BUG
            this.lastHideTime = curTime;
            app.Client.OnEvent('OnEventHide', {});
        }
    },
    GetHideState: function GetHideState() {
        return this.appIsHide;
    }
});

cc._RF.pop();