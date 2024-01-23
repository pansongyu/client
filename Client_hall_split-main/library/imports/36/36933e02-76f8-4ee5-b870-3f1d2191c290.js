"use strict";
cc._RF.push(module, '369334CdvhO5bhwPx0hkcKQ', 'PropertyDefine');
// script/define/PropertyDefine.js

"use strict";

/*
 *  PropertyDefine.js
 *  属性枚举
 *
 *  author:hongdian
 *  date:2014-10-28
 *  version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */

//------------转化对称函数--------------
function GetIndexToProperty(propertyToIndex) {

	var indexToProperty = {};
	//转化索引对应属性名
	for (var property in propertyToIndex) {

		var index = propertyToIndex[property];
		if (indexToProperty.hasOwnProperty(index)) {
			throw new Error("index have find property:" + property);
			continue;
		}
		indexToProperty[index] = property;
	}
	return indexToProperty;
};

function TransformPropertyToIndex(messageInfo) {
	var indexToProperty = {};
	for (var messageProperty in messageInfo) {
		var index = messageInfo[messageProperty];

		var infoList = messageProperty.split(" ");
		var length = infoList.length;
		if (length != 3) {
			console.error("messageProperty:% error", messageProperty);
			continue;
		}
		var property = infoList[length - 1];

		if (indexToProperty.hasOwnProperty(index)) {
			console.error("index:% have find", index);
			continue;
		}
		indexToProperty[property] = index;
	}

	return indexToProperty;
}

var PropertyDefine = {
	//索引属性转换函数
	"GetIndexToProperty": GetIndexToProperty,
	"TransformPropertyToIndex": TransformPropertyToIndex
};

//---------------账号属性----------------------
var propertyToIndex = {
	"AccountID": 1,
	"CharAccount": 2,
	"CharAccountPsw": 3,
	"LoginTime": 4,
	"AccountType": 5,
	"IsBind": 6,
	"AccountState": 7,
	"RegisterTime": 8,
	"RegisterIP": 9,
	"PhoneNum": 10,
	"LoginIPList": 11
};

PropertyDefine["AccountPropertyToIndex"] = propertyToIndex;
PropertyDefine["AccountIndexToProperty"] = GetIndexToProperty(propertyToIndex);

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	return PropertyDefine;
};

cc._RF.pop();