(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/sdk/NativeManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f60eeKmoExCL4WjNSBPz3gA', 'NativeManager', __filename);
// script/sdk/NativeManager.js

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

var app = require('app');
/**
 * 类构造
 */
var NativeManager = app.BaseClass.extend({

	Init: function Init() {
		this.OCClassName = "NativeMgr";
		this.JavaClassName = "org/cocos2dx/javascript/NativeMgr";
		this.JavaArgTypeDict = { "Number": "I", "String": "Ljava/lang/String;", "Boolean": "Z", "Float": "F" };
		this.ComTool = app.ComTool();
		this.JS_Name = "NativeManager";
	},

	//调用native平台接口
	//funName:函数名
	//参数顺序列表argList=[{"Name":"Title", "Value":"xx"},{"Name":"Description", "Value":"xx"},{"Name":"URL", "Value":"xx"}]
	//returnType 返回值类型
	CallToNative: function CallToNative(funName, argList, returnType) {
		if (!cc.sys.isNative) {
			this.ErrLog("CallToNative(%s) not native", funName);
			return;
		}
		//加入子游戏名字，以便回调到各个小游戏，大厅统一用hall
		var subGameName = { "Name": "subGameName", "Value": "hall" };
		argList.push(subGameName);
		if (this.ComTool.IsAndroid()) {
			return this.CallToJava(funName, argList, returnType);
		} else if (this.ComTool.IsIOS()) {
			if (funName == "getVersion" || funName == "checkVersion") {
				return;
			}
			return this.CallToOC(funName, argList, returnType);
		} else {
			this.ErrLog("CallToNative:%s error", cc.sys.os);
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
			console.log("argInfo Name == " + argInfo.Name);
			console.log("argInfo Value == " + argInfo.Value);
			if (!argInfo.hasOwnProperty("Value")) {
				this.ErrLog("CallToJava argInfo error", argInfo);
				return;
			}
			var value = argInfo["Value"];
			var argType = Object.prototype.toString.call(value).slice("[object ".length, -1);
			var javaType = this.JavaArgTypeDict[argType];
			if (!javaType) {
				this.ErrLog("CallToJava(%s, %j) error", javaFunName, argList);
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
			this.SysLog("javaFunArgList CallToJava(%s)", JSON.stringify(javaFunArgList));
			return jsb.reflection.callStaticMethod.apply(this, javaFunArgList);
		} catch (error) {
			this.ErrLog("CallToJava(%s,%s,%s) error:%s", javaFunName, JSON.stringify(argList), returnType, error.stack);
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
				this.ErrLog("CallToOC(%s) argInfo error", ocFunName, argInfo);
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
			console.log("javaFunArgList CallToOC(%s)", JSON.stringify(ocFunArgList));
			return jsb.reflection.callStaticMethod.apply(this, ocFunArgList);
		} catch (error) {
			this.ErrLog("CallToOC(%s,%s) error:%s", ocFunName, JSON.stringify(argList), error.stack);
		}
	}
});

var g_NativeManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_NativeManager) {
		g_NativeManager = new NativeManager();
	}
	return g_NativeManager;
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
        //# sourceMappingURL=NativeManager.js.map
        