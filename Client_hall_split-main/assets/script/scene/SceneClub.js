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
        this.FormManager = app.FormManager();
        this.ClubManager = app.ClubManager();
    },

    //进入场景
    OnSwithSceneEnd:function(){
    },
    //显示动态设置的默认界面
    OnShowDefaultForm:function(){
        this.FormManager.ShowForm("ui/club/UIClub");
        //this.FormManager.ShowForm("ui/club/UIClubCreateRoom");
        let formNameList = this.FormManager.GetDefaultFormNameList();
        let count = formNameList.length;
        if(count){
            for(let index=0; index<count; index++){
                this.FormManager.ShowForm(formNameList[index]);
            }
            this.FormManager.ClearDefaultFormNameList();
        }
    },
    OnEventShow:function(bReConnect){
        let curTime = new Date().getTime();
        if(curTime > this.lastShowTime + 1000){//后台切回来有可能调用两次BUG
            this.lastShowTime = curTime;
            app.Client.OnEvent('OnEventShow', {'bReConnect':bReConnect});
        }
    },
    OnEventHide:function(){
        let curTime = new Date().getTime();
        if(curTime > this.lastHideTime + 1000){//后台切回来有可能调用两次BUG
            this.lastHideTime = curTime;
            app.Client.OnEvent('OnEventHide', {});
        }
    },
});
