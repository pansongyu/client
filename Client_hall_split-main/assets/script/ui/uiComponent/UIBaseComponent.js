/*
    UIBaseComponent 界面附加组件基类(可以直接又编辑器拖拽预制到界面上的组件,addChild到界面的node上,可以理解为与BseForm同等级关系,非父子关系)
*/

var app = require("app");


var UIBaseComponent = cc.Class({

    extends: require("BaseForm"),

    properties: {

    },

    // 每个子类必修重载的函数
    OnLoad: function () {
        this.OnCreate("UIBaseComponent");
    },


    //显示界面
    ShowForm:function(...argList){

        //开启界面重新注册已经注册的监听事件
        for(let eventName in this._eventFuncDict){
            app.Client.RegEvent(eventName, this._eventFuncDict[eventName], this);
        }

        try{
            this.OnShow.apply(this, argList);
        }
        catch(error){
            this.ErrLog("ShowForm error:%s", error.stack);
        }


    },

    //关闭界面
    CloseForm:function(){

        //关闭界面则取消所有事件监听
        app.Client.UnRegTargetEvent(this);

        this.OnClose();

    },

    //开启或者关闭界面
    ShowOrCloseForm:function(argList){
        this.ErrLog("ShowOrCloseForm cant call")
    },

    //-------------获取接口-------------------

    //--------------子类重载接口---------------
});

module.exports = UIBaseComponent;


