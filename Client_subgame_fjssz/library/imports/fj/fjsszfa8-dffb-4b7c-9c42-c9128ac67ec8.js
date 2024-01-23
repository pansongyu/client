"use strict";
cc._RF.push(module, 'fjsszfa8-dffb-4b7c-9c42-c9128ac67ec8', 'BaseClass');
// script/BaseClass.js

"use strict";

/*
    客户端自定义基类
*/
var ShareDefine = require("fjssz_ShareDefine").GetModel();

var BaseClass = cc.Class({

	ctor: function ctor() {
		var argList = Array.prototype.slice.call(arguments);

		this.JS_Name = "BaseClass";
		this.Init.apply(this, argList);
	},

	Init: function Init() {},

	//是否开发者模式
	IsDevelopment: function IsDevelopment() {
		return ShareDefine.IsDevelopment;
	},

	//获取包装后的log文本
	GetLogFormatList: function GetLogFormatList(argList) {
		var len = argList.length;
		var logText = argList[0];
		//第一个不是文本格式
		if (typeof logText != "string") {
			return argList;
		}

		//如果是谷歌浏览器,包装颜色
		if (cc.sys.browserType == "chrome") {
			//如果末尾有携带颜色配置
			var colorType = argList[len - 1];
			var color = ShareDefine.ChromeLogColorDict[colorType];
			//如果存在颜色,替换最后一个参数为颜色值
			if (color) {
				//删除末尾的颜色标示
				argList.pop();

				//文本开头添加颜色标示%c
				logText = "%c" + logText;

				//在文本后面插入一个颜色值
				argList.splice(1, 0, color);
			}
		} else {
			var colorType = argList[len - 1];
			var color = ShareDefine.ChromeLogColorDict[colorType];
			if (color) {
				//删除末尾的颜色标示
				argList.pop();
			}
		}

		//第一个默认是字符串加上文件标示
		argList[0] = this.JS_Name + "\t" + logText;
		return argList;
	},

	//接收不定参
	Log: function Log() {
		if (this.IsDevelopment()) {
			var argList = Array.prototype.slice.call(arguments);
			argList = this.GetLogFormatList(argList);
			cc.log.apply(null, argList);
		}
	},

	//网络通信log
	NetLog: function NetLog() {
		if (this.IsDevelopment()) {
			var argList = Array.prototype.slice.call(arguments);
			argList = this.GetLogFormatList(argList);
			cc.log.apply(null, argList);
		}
	},

	//接收不定参
	SysLog: function SysLog() {
		var argList = Array.prototype.slice.call(arguments);
		argList = this.GetLogFormatList(argList);
		cc.log.apply(null, argList);
	},

	//接收不定参
	WarnLog: function WarnLog() {
		if (this.IsDevelopment()) {
			var argList = Array.prototype.slice.call(arguments);
			argList = this.GetLogFormatList(argList);
			cc.warn.apply(null, argList);
		}
	},

	//接收不定参
	ErrLog: function ErrLog() {
		var argList = Array.prototype.slice.call(arguments);
		argList = this.GetLogFormatList(argList);
		cc.error.apply(null, argList);
	}
});

var DBBaseClass = BaseClass.extend({
	ctor: function ctor() {
		var argList = Array.prototype.slice.call(arguments);

		this.JS_Name = "DBBaseClass";
		this.Init.apply(this, argList);

		this.OnReload();
	},

	//下线初始化
	OnReload: function OnReload() {
		this.isLoadDB = false;
		this.isSendLoadDB = false;

		this.InitReload();
	},

	//加载数据
	LoadInitDB: function LoadInitDB(headName, sendPack) {
		if (this.isLoadDB) {
			return;
		}
		if (this.isSendLoadDB) {
			return;
		}
		this.isSendLoadDB = true;

		//发送请求初始化管理器数据
		app[app.subGameName + "_NetManager"]().SendPack(headName, sendPack, this.OnSuccessInitDBData.bind(this), this.OnFailInitDBData.bind(this));
	},

	//初始化请求回调
	OnSuccessInitDBData: function OnSuccessInitDBData(serverPack) {
		this.isLoadDB = true;
		this.OnInitData(serverPack);
	},

	//初始化请求失败回调
	OnFailInitDBData: function OnFailInitDBData(failInfo) {
		this.isLoadDB = false;
		this.isSendLoadDB = false;

		this.OnFailInitData(failInfo);
	},

	//-------------子类需要实现的函数-------------
	InitReload: function InitReload() {
		console.error("InitReload 必须实现");
	},

	OnInitData: function OnInitData(serverPack) {
		console.error("OnInitData 必须实现");
	},

	OnFailInitData: function OnFailInitData(failInfo) {
		console.error("OnFailInitData 必须实现");
	}

});

module.exports = { "BaseClass": BaseClass, "DBBaseClass": DBBaseClass };

cc._RF.pop();