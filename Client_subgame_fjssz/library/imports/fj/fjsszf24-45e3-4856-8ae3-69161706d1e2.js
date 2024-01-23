"use strict";
cc._RF.push(module, 'fjsszf24-45e3-4856-8ae3-69161706d1e2', 'fjssz_UIBaseComponent');
// script/ui/uiComponent/fjssz_UIBaseComponent.js

"use strict";

/*
    UIBaseComponent 界面附加组件基类(可以直接又编辑器拖拽预制到界面上的组件,addChild到界面的node上,可以理解为与BseForm同等级关系,非父子关系)
*/

var app = require("fjssz_app");

var UIBaseComponent = cc.Class({

    extends: require(app.subGameName + "_BaseForm"),

    properties: {},

    // 每个子类必修重载的函数
    OnLoad: function OnLoad() {
        this.OnCreate("UIBaseComponent");
    },

    //显示界面
    ShowForm: function ShowForm() {

        //开启界面重新注册已经注册的监听事件
        for (var eventName in this._eventFuncDict) {
            app[app.subGameName + "Client"].RegEvent(eventName, this._eventFuncDict[eventName], this);
        }

        try {
            for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
                argList[_key] = arguments[_key];
            }

            this.OnShow.apply(this, argList);
        } catch (error) {
            console.error("ShowForm error:%s", error.stack);
        }
    },

    //关闭界面
    CloseForm: function CloseForm() {

        //关闭界面则取消所有事件监听
        app[app.subGameName + "Client"].UnRegTargetEvent(this);

        this.OnClose();
    },

    //开启或者关闭界面
    ShowOrCloseForm: function ShowOrCloseForm(argList) {
        console.error("ShowOrCloseForm cant call");
    }

    //-------------获取接口-------------------

    //--------------子类重载接口---------------
});

module.exports = UIBaseComponent;

cc._RF.pop();