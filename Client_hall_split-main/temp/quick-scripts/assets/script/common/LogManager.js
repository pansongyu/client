(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/LogManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9f61cGZv4ROqZ1Q7jYR/KJt', 'LogManager', __filename);
// script/common/LogManager.js

"use strict";

/*
    Log管理器
*/

var LogManager = function LogManager(isDevelopment) {
	this.Init(isDevelopment);
};

/**
 * Area filter
 */
LogManager.prototype.Init = function () {

	this.logFilePath = "";

	this.id = 0;
	this.debugLogList = [];
	this.sendLogList = [];
	this.outPutLogList = [];

	//默认开启,可以接收初始化阶段的log
	this.isOpenLog = true;

	//超过多少条清除一半长度
	this.MaxLogCount = 2000;

	this.HookLogs();

	cc.log("create LogManager");
};

LogManager.prototype.HookLogs = function () {
	var self = this;

	cc.log.hook('cc', function () {
		for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
			argList[_key] = arguments[_key];
		}

		self.AddSysLog(argList, "log");
	}, 'log');

	// cc.log.hook('cc', function (...argList) {
	//        self.AddSysLog(argList, "info");
	//    }, 'info');

	cc.warn.hook('cc', function () {
		for (var _len2 = arguments.length, argList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			argList[_key2] = arguments[_key2];
		}

		self.AddSysLog(argList, "warn");
	}, 'warn');

	cc.error.hook('cc', function () {
		for (var _len3 = arguments.length, argList = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			argList[_key3] = arguments[_key3];
		}

		self.AddSysLog(argList, "error");
	}, 'error');
};

//格式化 字典和列表为字符串
LogManager.prototype.GetMsg = function (argList) {
	var count = argList.length;

	//转化字典和列表参数
	for (var index = 1; index < count; index++) {
		var value = argList[index];
		if (!value) {
			continue;
		}

		var valueType = Object.prototype.toString.call(value).slice("[object ".length, -1);

		if (valueType == "Array") {
			value = JSON.stringify(value);
		} else if (valueType == "Object") {
			value = JSON.stringify(value);
		}
		argList[index] = value;
	}
	return cc.js.formatStr.apply(null, argList);
}, LogManager.prototype.AddSysLog = function (argList, logType) {
	if (this.isOpenLog || logType == "error" || logType == "info") {

		var msg = "";
		try {
			msg = this.GetMsg(argList);
		} catch (error) {
			cc.error("error:%s", error.stack);
			msg = "AddSysLog error";
		}
		this.id += 1;
		this.sendLogList.push([msg, logType, this.id]);
		this.outPutLogList.push([msg, logType, this.id]);
		this.debugLogList.push([msg, logType, this.id]);

		if (this.sendLogList.length >= this.MaxLogCount) {
			this.sendLogList = this.sendLogList.slice(Math.floor(this.MaxLogCount / 2), this.sendLogList.length);
		}

		if (this.debugLogList.length >= this.MaxLogCount) {
			this.debugLogList = this.debugLogList.slice(Math.floor(this.MaxLogCount / 2), this.debugLogList.length);
		}

		if (this.outPutLogList.length >= this.MaxLogCount) {
			this.outPutLogList = this.outPutLogList.slice(Math.floor(this.MaxLogCount / 2), this.outPutLogList.length);
		}
	}
};

//是否开启发送LOG到log服务器
LogManager.prototype.IsOpenLog = function (isOpenLog) {
	this.isOpenLog = isOpenLog;
};

LogManager.prototype.GetNowDateTimeStr = function () {
	var dateStr = "";
	var myDate = new Date();
	var dataList = [myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate()];

	for (var index in dataList) {

		var value = dataList[index];
		if (value < 10) {
			value = "0" + value;
		}
		if (index != dataList.length - 1) {

			dateStr += value + "-";
		} else {

			dateStr += value;
		}
	}
	return dateStr;
};

//原生平台可以输出log文件
LogManager.prototype.OutPutLog = function () {

	if (!cc.sys.isNative) {
		return;
	}
	var timeStr = new Date().toLocaleString();

	var logText = "";
	for (var index = 0, count = this.outPutLogList.length - 1; index <= count; index++) {

		var logType = this.outPutLogList[index][1];
		var logID = this.outPutLogList[index][2];
		if (logType == "error") {
			logText += [timeStr, "\t[" + logID, "]\t###", this.outPutLogList[index][0], "\n"].join("");
		} else {
			logText += [timeStr, "\t[" + logID, "]\t", this.outPutLogList[index][0], "\n"].join("");
		}
	}

	if (!logText) {
		return;
	}

	this.outPutLogList = [];

	var fileUtils = jsb.fileUtils;

	if (!this.logFilePath) {
		var clientPath = fileUtils.getWritablePath();
		if (!clientPath) {
			return;
		}
		//输出Log路径
		this.logFilePath = clientPath + "Log/";
	}

	if (!fileUtils.isDirectoryExist(this.logFilePath)) {
		fileUtils.createDirectory(this.logFilePath);
	}
	var logName = this.GetNowDateTimeStr();
	//Log文件完整路径
	var logPathFileName = [this.logFilePath, logName, ".txt"].join("");

	fileUtils.writeStringToFile(logText, logPathFileName);
};

//--------------回掉函数---------------


//发送log到服务器
LogManager.prototype.SendLogToServer = function () {
	//TODO:send log to server
	this.sendLogList = [];
};

//截取多少条数据
LogManager.prototype.GetLogMsgList = function (count) {
	if (!count) {
		count = this.sendLogList.length;
	}
	return this.sendLogList.splice(0, count);
};

LogManager.prototype.ClearLogMsgList = function () {
	this.sendLogList = [];
};

//debug层显示信息
LogManager.prototype.GetDebugMsgList = function (count) {
	if (!count) {
		count = this.debugLogList.length;
	}
	return this.debugLogList.splice(0, count);
};

var g_LogManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function (isDevelopment) {
	if (!g_LogManager) {
		g_LogManager = new LogManager(isDevelopment);
	}
	return g_LogManager;
};

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
        //# sourceMappingURL=LogManager.js.map
        