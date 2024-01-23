/*
    自定义基础组件类
*/
var app = require("nn_app");
let ShareDefine = require(app.subGameName + "_ShareDefine").GetModel();
var nn_BaseComponent = cc.Class({

    extends: cc.Component,

    //组件可以在编辑器上显示的属性
    properties: {
        "JS_Name":{
            "default": app.subGameName + "_BaseComponent",
            "visible": false
        },
    },
    //是否开发者模式
    IsDevelopment:function(){
        return ShareDefine.IsDevelopment
    },
    Log:function(...argList){
        if(this.IsDevelopment()){
            //第一个默认是字符串加上文件标示
            argList[0] = this.JS_Name + "\t" + argList[0];
            cc.log.apply(null, argList)
        }
    },

	//网络通信log
	NetLog:function(...argList){
		if(this.IsDevelopment()){
			argList[0] = this.JS_Name + "\t" + argList[0];
			cc.log.apply(null, argList)
		}
	},

    SysLog:function(...argList){
        //第一个默认是字符串加上文件标示
        argList[0] = this.JS_Name + "\t" + argList[0];
        cc.info.apply(null, argList)
    },

    WarnLog:function(...argList){
        if(this.IsDevelopment()){
            //第一个默认是字符串加上文件标示
            argList[0] = this.JS_Name + "\t" + argList[0];
            cc.warn.apply(null, argList)
        }
    },

    ErrLog:function(...argList){
        //第一个默认是字符串加上文件标示
        argList[0] = this.JS_Name + "\t" + argList[0];
        cc.error.apply(null, argList)
    },

    //addChild后调用
    onLoad:function(){
        this.OnLoad();
    },

    //载入调用
    OnLoad:function(){

    },

    //游戏js
    GameTyepStringUp:function(){
        return app.subGameName.toUpperCase();
    },
});

module.exports = nn_BaseComponent;
