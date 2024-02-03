(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/pdk_SysDataManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdka7d-2a32-4090-9db5-c4dbbc884731', 'pdk_SysDataManager', __filename);
// script/common/pdk_SysDataManager.js

"use strict";

/*
    客户端系统配置表管理器
*/
var app = require("pdk_app");

var pdk_SysDataManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = app["subGameName"] + "_SysDataManager";

		//字段key开始行
		this.FieldLine = 1;
		//有效配置开始行
		this.DataLine = 2;

		this.Key = 1245;

		this.isNative = false;

		this.tableDict = {};

		this.jsonDict = {};
	},

	// 获取表字典数据
	GetTableDict: function GetTableDict(tableName) {
		//每个小游戏表名字加上游戏简写前缀
		// tableName = app.subGameName + "_" + tableName;
		//如果表为读取，则读取
		if (!this.tableDict[tableName]) {
			console.log("GetTableDict not load  " + tableName);
			return {};
		}
		return this.tableDict[tableName].json;
	},

	//获取json配置文件
	GetJsonData: function GetJsonData(tableName) {
		var dataDict = this.jsonDict[tableName];
		if (!dataDict) {
			console.log("GetJsonData tableName not find  " + tableName);
			return;
		}
		return dataDict;
	},

	// 重载表数据
	ReloadTable: function ReloadTable(tableName) {
		var keyNameList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";


		//可能本身就不存在表数据,初始化空字典
		if (!this.tableDict.hasOwnProperty(tableName)) {
			this.tableDict[tableName] = {};
		}

		var that = this;

		this.ReadTable(tableName).then(function (textData) {

			var dataDict = that.tableDict[tableName];

			//清空原来的字典数据
			var keyList = Object.keys(dataDict);
			var count = keyList.length;
			for (var index = 0; index < count; index++) {
				var keyName = keyList[index];
				delete dataDict[keyName];
			}

			that.OnLoadTableEnd(tableName, keyNameList, textData, dataDict);
		}).catch(function (error) {
			console.log("ReloadTable error:" + tableName + ":" + error.stack);
		});
	},

	// 删除表数据
	DeleteTable: function DeleteTable(tableName) {
		delete this.tableDict[tableName];
	},

	// 读取表数据
	ReadTable: function ReadTable(tableName) {

		var that = this;
		var tablePath = 'configs/' + tableName;

		//创建异步函数
		var promisefunc = function promisefunc(resolve, reject) {
			//加载资源
			cc.loader.loadRes(tablePath, function (error, textData) {

				if (error) {
					reject(error);
					return;
				}

				resolve(textData);
			});
		};
		//返回异步对象
		return new app.bluebird(promisefunc);
	},

	// 表数据读取完成
	OnLoadTableEnd: function OnLoadTableEnd(tableName, keyNameList, textData) {
		var tableInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		this.tableDict[tableName] = textData;
		// console.log("OnLoadTableEnd tableName: " + tableName + ",textData: " + JSON.stringify(textData.json));
	},

	// 转化表为字典
	TransformTextData: function TransformTextData(tableName, textData) {

		if (this.isNative) {
			textData = this.DecodeText(textData);
		}

		var textDataList = textData.text.split("\n");
		var lineCount = textDataList.length;
		if (!lineCount) {
			// this.ErrLog("TransformTextData(%s) not data", tableName);
			return;
		}
		var lineNum = -1;

		var fieldNameList = null;
		var fieldCount = null;

		var tableDataDict = {};

		for (var index_i = 0; index_i < lineCount; index_i++) {
			var textLineDataStr = textDataList[index_i];

			//去除空格
			textLineDataStr = textLineDataStr.replace(/(\s*$)/g, "");
			//读到最后一行，跳出
			if (!textLineDataStr) {
				continue;
			}
			lineNum += 1;
			var textLineDataList = textLineDataStr.split("\t");

			//如果是key行,记录key数据
			if (lineNum === this.FieldLine) {
				fieldNameList = textLineDataList;
				fieldCount = fieldNameList.length;
				continue;
			} else if (lineNum >= this.DataLine) {

				var rowCount = textLineDataList.length;
				if (rowCount != fieldCount) {
					// this.ErrLog("TransformTextData(%s),textLineDataList:%s error need(%s)", tableName, JSON.stringify(textLineDataList), fieldCount);
					continue;
				}
				var rowKey = textLineDataList[0];
				var rowDataDict = {};
				for (var index_j = 0; index_j < rowCount; index_j++) {
					var value = textLineDataList[index_j];
					try {
						value = this.GetTransformValue(value);
					} catch (error) {
						// this.ErrLog("GetTransformValue(%s)(%s), error:%s", tableName, value, error.stack);
						//throw new Error("Read Text Fail:" + tablePath);
						value = undefined;
					}

					rowDataDict[fieldNameList[index_j]] = value;
				}
				if (tableName == "gameCreate" || tableName == "GameHelp") {
					tableDataDict[index_i] = rowDataDict;
				} else {
					tableDataDict[rowKey] = rowDataDict;
				}
			} else {}
		}

		return tableDataDict;
	},

	//解密
	DecodeText: function DecodeText(textData) {

		var buffCount = textData.length;
		var outText = "";

		//遍历字符串解密
		for (var index_j = 0; index_j < buffCount;) {

			var value = textData.substring(index_j, index_j + 4);
			value = parseInt(value, 16) ^ this.Key;
			outText += String.fromCharCode(value);

			index_j += 4;
		}

		return outText;
	},

	/**
  * 获取value转化后的值
  */
	GetTransformValue: function GetTransformValue(valueStr) {
		var startStr = valueStr[0];
		var endStr = valueStr[valueStr.length - 1];
		//如果是列表
		if (startStr === "[" && endStr === "]") {
			return JSON.parse(valueStr);
		} else if (startStr === "{" && endStr === "}") {
			return JSON.parse(valueStr);
		} else if (valueStr.indexOf("return") != -1) {
			return new Function(valueStr);
		} else {
			//去整
			//如果不是纯数字,则为字符串
			if (isNaN(valueStr)) {
				return valueStr;
			} else {
				return Number(valueStr);
			}
		}
	},

	// 获取表字段名对应联合表key字符串
	GetKeyNameStr: function GetKeyNameStr(keyNameList, valueDict) {

		var keyValueList = [];
		var count = keyNameList.length;

		//构建联合表key 字符串
		for (var index = 0; index < count; index++) {
			var keyName = keyNameList[index];
			if (!valueDict.hasOwnProperty(keyName)) {
				// this.ErrLog("GetKeyNameStr valueDict(%s) dont have keyName(%s)", JSON.stringify(valueDict), keyName);
				return null;
			}
			keyValueList.push(valueDict[keyName]);
		}

		return keyValueList.join("_");
	},

	//加载json配置文件
	OnLoadJson: function OnLoadJson(jsonFileName, jsonData) {

		this.jsonDict[jsonFileName] = jsonData;
	},
	//--------------------------联合key接口--------------------------------

	// 获取联合表keylist 对应的keystr
	GetMuchKeyStr: function GetMuchKeyStr(keyList) {
		return keyList.join("_");
	},

	// 表数据输出
	DebugOutput: function DebugOutput() {
		var tableName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";


		var tableInfo = null;

		//如果是指定表
		if (tableName) {
			tableInfo = this.tableDict[tableName];
		} else {
			tableInfo = this.tableDict;
		}
	}

});

var g_pdk_SysDataManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_pdk_SysDataManager) {
		g_pdk_SysDataManager = new pdk_SysDataManager();
	}
	return g_pdk_SysDataManager;
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
        //# sourceMappingURL=pdk_SysDataManager.js.map
        