"use strict";
cc._RF.push(module, 'fjssz2a6-a04c-422f-85a3-35204fcf7800', 'fjssz_NativeManager');
// script/sdk/fjssz_NativeManager.js

"use strict";

/*
 * 	NativeManager.js
 * 	移动端接口管理器
 *
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 * change: "2014-10-28 20:24" hongdian 同步C++
 *
 */

var app = require("fjssz_app");
/**
 * 类构造
 */
var sss_NativeManager = app.BaseClass.extend({

	Init: function Init() {
		this.OCClassName = "NativeMgr";
		this.JavaClassName = "org/cocos2dx/javascript/NativeMgr";
		this.JavaArgTypeDict = { "Number": "I", "String": "Ljava/lang/String;", "Boolean": "Z", "Float": "F" };
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.JS_Name = app.subGameName + "_NativeManager";
	},

	//调用native平台接口
	//funName:函数名
	//参数顺序列表argList=[{"Name":"Title", "Value":"xx"},{"Name":"Description", "Value":"xx"},{"Name":"URL", "Value":"xx"}]
	//returnType 返回值类型
	CallToNative: function CallToNative(funName, argList, returnType) {
		if (!cc.sys.isNative) {
			console.error("CallToNative(%s) not native", funName);
			return;
		}
		//加入子游戏名字，以便回调到各个小游戏，大厅统一用hall
		var subGameName = { "Name": "subGameName", "Value": app.subGameName };
		argList.push(subGameName);
		if (this.ComTool.IsAndroid()) {
			return this.CallToJava(funName, argList, returnType);
		} else if (this.ComTool.IsIOS()) {
			return this.CallToOC(funName, argList, returnType);
		} else {
			console.error("CallToNative:%s error", cc.sys.os);
		}
	},

	/**
  * 调用java接口
  * javaFunName MyAPIManager.java 对应函数名
  * argList argList 函数接受的参数列表
  * returnType returnType 函数返回值类型
  */
	CallToJava: function CallToJava(javaFunName, argList, returnType) {
		//jsb.reflection.callStaticMethod('org/cocos2dx/javascript/SDKManager',
		//'OnWeChatShare','(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',"当当猫","当当猫分享","www.ddmh5.com","0");

		var javaFunArgList = [];

		var javaFunSign = "(";

		var count = argList.length;
		for (var index = 0; index < count; index++) {
			var argInfo = argList[index];
			if (!argInfo.hasOwnProperty("Value")) {
				console.error("CallToJava argInfo error", argInfo);
				return;
			}
			var value = argInfo["Value"];
			var argType = Object.prototype.toString.call(value).slice("[object ".length, -1);
			var javaType = this.JavaArgTypeDict[argType];
			if (!javaType) {
				console.error("CallToJava(%s, %j) error", javaFunName, argList);
				return;
			}

			javaFunSign += javaType;

			javaFunArgList.push(value);
		}

		var returnValueType = this.JavaArgTypeDict[returnType];
		//如果有返回值
		if (returnValueType) {
			javaFunSign += ")" + returnValueType;
		} else {
			javaFunSign += ")V";
		}
		javaFunArgList.unshift(this.JavaClassName, javaFunName, javaFunSign);

		try {
			return jsb.reflection.callStaticMethod.apply(this, javaFunArgList);
		} catch (error) {
			console.error("CallToJava(%s,%s,%s) error:%s", javaFunName, JSON.stringify(argList), returnType, error.stack);
		}
	},

	/**
  * 调用oc接口
  * javaFunName MyAPIManager.java 对应函数名
  * argList argList 函数接受的参数列表
  * returnType returnType 函数返回值类型
  */
	CallToOC: function CallToOC(ocFunName, argList) {
		//jsb.reflection.callStaticMethod(this.OCClassName,''OnWeChatShareWithTitle: Description: URL:Type:','红中麻将','红中麻将分享','www.ddmh5.com',"0");

		var ocFunArgList = [];
		ocFunArgList.push(this.OCClassName);

		var funString = ocFunName;
		var count = argList.length;
		for (var index = 0; index < count; index++) {
			var argInfo = argList[index];
			var name = argInfo["Name"];
			var value = argInfo["Value"];

			if (!name) {
				console.error("CallToOC(%s) argInfo error", ocFunName, argInfo);
				return;
			}
			if (index) {
				funString += name + ":";
			} else {
				funString += "With" + name + ":";
			}

			ocFunArgList.push(value);
		}
		//插入函数签名
		ocFunArgList.splice(1, 0, funString);

		try {
			// this.SysLog("javaFunArgList CallToOC(%s)", JSON.stringify(ocFunArgList));
			return jsb.reflection.callStaticMethod.apply(this, ocFunArgList);
		} catch (error) {
			//console.error("CallToOC(%s,%s) error:%s", ocFunName, JSON.stringify(argList), error.stack);
		}
	}
});

var g_sss_NativeManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_sss_NativeManager) {
		g_sss_NativeManager = new sss_NativeManager();
	}
	return g_sss_NativeManager;
};

cc._RF.pop();