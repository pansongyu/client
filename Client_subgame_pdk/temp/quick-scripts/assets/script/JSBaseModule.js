(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/JSBaseModule.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk720-2e37-49f3-8b0b-a806d974859d', 'JSBaseModule', __filename);
// script/JSBaseModule.js

"use strict";

/*
 * 	JSBaseModule.js
 * 	js基础模块扩展
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

/**
 * 列表增加的方法
 */
Object.defineProperties(Array.prototype, {

	"InArray": {
		//是否可被写入
		writable: false,
		//是否可被枚举
		enumerable: false,
		//是否可配置
		configurable: true,
		/**
   * 判断元素是否存在列表中
   */
		value: function value(_value, isStrict) {
			var index;

			//如果是严格模式
			if (isStrict) {
				return -1 != this.indexOf(_value);
			}
			//this.indexOf有严格的数据类型监测, a=[1,2,3],则"1"不在a里面 ;
			//因为项目需求很多key的形式是字符串，所以使用不严格比较
			for (index = 0; index < this.length; index++) {
				if (this[index] == _value) {
					return true;
				}
			}
			return false;
		}
	},

	"IndexOf": {
		//是否可被写入
		writable: false,
		//是否可被枚举
		enumerable: false,
		//是否可配置
		configurable: true,
		/**
   * 返回在列表中的索引位置
   */
		value: function value(_value2, isStrict) {

			//如果是严格模式
			if (isStrict) {
				return this.indexOf(_value2);
			}

			var index;

			//this.indexOf有严格的数据类型监测, a=[1,2,3],则"1"不在a里面 ;
			//因为项目需求很多key的形式是字符串，所以使用不严格比较
			for (index = 0; index < this.length; index++) {
				if (this[index] == _value2) {
					return index;
				}
			}
			return -1;
		}
	},

	"SortList": {
		//是否可被写入
		writable: false,
		//是否可被枚举
		enumerable: false,
		//是否可配置
		configurable: true,
		/**
   * 判断元素是否存在列表中 [23,12,1,34,116,8,18,37,56,50]
   * a.sort() 排序BUG [1, 116, 12, 18, 23, 34, 37, 50, 56, 8]
   * 如果不取整数排序BUG：2个都是字符串时会依据字符串比较["1", "10", "100", "2", "20", "200", "25", "5", "50"]
   */
		value: function value(reverse) {
			//是否倒序，从大到小
			if (reverse) {
				this.sort(function (a, b) {
					//取整不能使用Math.floor()因为浮动数Math.floor("0.01")=0
					a = +a;
					return a < b ? 1 : -1;
				});
			} else {
				this.sort(function (a, b) {
					a = +a;
					return a > b ? 1 : -1;
				});
			}
		}
	},

	"Remove": {
		writable: false,
		enumerable: false,
		configurable: true,
		/**
   * 删除列表中指定的元素1次，删除元素不存在返回false
   */
		value: function value(_value3, isStrict) {
			var index, isFind;

			if (isStrict) {
				index = this.indexOf(_value3);
				if (index == -1) {
					return false;
				}
			} else {
				isFind = false;
				for (index = 0; index < this.length; index++) {
					if (this[index] == _value3) {
						isFind = true;
						break;
					}
				}
				if (!isFind) {
					return false;
				}
			}
			this.splice(index, 1);
			return true;
		}
	}

});

/**
 * 字典增加的方法
 */
Object.defineProperties(Object.prototype, {

	"Update": {
		writable: false,
		enumerable: false,
		configurable: true,
		/**
   * 一个字典扩充到另一个字典里,存在重复的key会被覆盖
   */
		value: function value(addDict) {
			for (var key in addDict) {
				this[key] = addDict[key];
			}
		}
	},

	"SetDefault": {
		writable: false,
		enumerable: false,
		configurable: true,
		/**
   * 如果key不存在，设置字典默认值,存在返回值
   */
		value: function value(key, _value4) {
			if (!this.hasOwnProperty(key)) {
				this[key] = _value4;
			}
			return this[key];
		}
	}

});

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	return null;
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
        //# sourceMappingURL=JSBaseModule.js.map
        