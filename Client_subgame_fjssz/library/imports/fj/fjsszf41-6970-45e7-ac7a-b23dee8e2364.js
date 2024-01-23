"use strict";
cc._RF.push(module, 'fjsszf41-6970-45e7-ac7a-b23dee8e2364', 'fjssz_SceneMain');
// script/scene/fjssz_SceneMain.js

"use strict";

/*
    主场景
*/

var app = require("fjssz_app");

cc.Class({
    extends: require(app.subGameName + "_BaseScene"),

    properties: {},
    //------回掉函数-------------------
    OnCreate: function OnCreate() {},

    //进入场景
    OnSwithSceneEnd: function OnSwithSceneEnd() {},

    //显示动态设置的默认界面
    OnShowDefaultForm: function OnShowDefaultForm() {
        // let formNameList = app[app.subGameName + "_FormManager"]().GetDefaultFormNameList();
        // let count = formNameList.length;
        // if(count){
        // 	for(let index=0; index<count; index++){
        // 		app[app.subGameName + "_FormManager"]().ShowForm(formNameList[index]);
        // 	}
        // }
        // else{
        app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMain");
        // }
        // app[app.subGameName + "_FormManager"]().ClearDefaultFormNameList();
    }
});

cc._RF.pop();