/*
    打牌场景
*/

var app = require("app");

cc.Class({
    extends: require("BaseScene"),

    properties: {
    },

    //------回掉函数-------------------
    OnCreate:function(){
        this.lastShowTime = 0;
        this.lastHideTime = 0;
        this.appIsHide = false;
    },

    //进入场景
    OnSwithSceneEnd:function(){
    },
    OnEventShow:function(bReConnect){
        this.appIsHide = false;
        let curTime = new Date().getTime();
        if(curTime > this.lastShowTime + 1000){//后台切回来有可能调用两次BUG
            this.lastShowTime = curTime;
            app.Client.OnEvent('OnEventShow', {'bReConnect':bReConnect});
        }
    },
    OnEventHide:function(){
        this.appIsHide = true;
        let curTime = new Date().getTime();
        if(curTime > this.lastHideTime + 1000){//后台切回来有可能调用两次BUG
            this.lastHideTime = curTime;
            app.Client.OnEvent('OnEventHide', {});
        }
    },
    GetHideState:function(){
        return this.appIsHide;
    },
});
