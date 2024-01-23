(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/fjssz_ComTool.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjsszb80-5498-4c75-a2a5-1463e854654d', 'fjssz_ComTool', __filename);
// script/common/fjssz_ComTool.js

"use strict";

/*
 * 	ComTool.js
 * 	工具函数管理器模块
 *
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 */

var app = require("fjssz_app");

var sss_ComTool = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init: function Init() {
        this.JS_Name = app.subGameName + "_ComTool";
    },

    //---------------获取贴图路径----------------

    //获取数据对应的贴图资源
    GetImagePathByType: function GetImagePathByType(imageType, userData) {

        if (imageType == "HZShowCard") {
            return "texture/card/show/tiao2";
        } else if (imageType == "HZDownCard") {
            return "texture/card/down/tiao11";
        } else {
            console.error("GetImagePathByType(%s,%s) error", imageType, userData);
            return;
        }
    },

    //获取转化后的玩家ID
    GetPid: function GetPid(pid) {
        var serverID = Math.floor(pid / 100000000000);
        if (!serverID) {
            return pid;
        }
        var playerID = pid - serverID * 100000000000;
        return Math.floor([serverID, playerID].join(""));
    },
    //--------------引擎判断接口-------------
    //是否是安卓微信环境
    IsAndroidWeChatBrowser: function IsAndroidWeChatBrowser() {

        if (cc.sys.os != "Android") {
            return false;
        }
        var browserType = cc.sys.browserType;

        //mqqbrowser 安卓中微信浏览器标示
        if (browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ) {
            return true;
        }
        //怕异常多处理wechat的判断 一般wechat是ios中微信标示
        else if (browserType == cc.sys.BROWSER_TYPE_WECHAT) {
                return true;
            }

        return false;
    },

    //是否是微信浏览器环境
    IsWeChatBrowser: function IsWeChatBrowser() {

        var browserType = cc.sys.browserType;

        //mqqbrowser 安卓中微信浏览器标示
        if (browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ) {
            return true;
        }
        //怕异常多处理wechat的判断 一般wechat是ios中微信标示
        else if (browserType == cc.sys.BROWSER_TYPE_WECHAT) {
                return true;
            }

        return false;
    },

    /**
     * 是否是ios平台
     * @returns {Boolean}
     */
    IsIOS: function IsIOS() {
        var browserType = cc.sys.browserType;
        if (browserType) {
            return false;
        }
        return cc.sys.os == cc.sys.OS_IOS;
    },
    IsIpad: function IsIpad() {
        var browserType = cc.sys.browserType;
        if (browserType) {
            return false;
        }
        return cc.sys.isNative && cc.sys.platform == cc.sys.IPAD;
    },
    //是否是安卓
    IsAndroid: function IsAndroid() {
        var browserType = cc.sys.browserType;
        if (browserType) {
            return false;
        }
        return cc.sys.os == cc.sys.OS_ANDROID;
    },

    //是否是win
    IsWindows: function IsWindows() {
        var browserType = cc.sys.browserType;
        if (browserType) {
            return false;
        }
        return cc.sys.os == cc.sys.OS_WINDOWS;
    },
    //----------------列表方法---------------

    //删除列表重复项
    DeleteListRepeat: function DeleteListRepeat(targetList) {
        var returnList = [];
        var findDict = {};
        var prefix = "";

        var count = targetList.length;
        for (var index = 0; index < count; index++) {
            var value = targetList[index];

            //因为findDict[222] findDict["222"]等价，所以加入string判断
            if (typeof value == "string") {
                prefix = "_str";
            } else {
                prefix = "";
            }
            prefix += value;
            if (!findDict[prefix]) {
                returnList.push(value);
                findDict[prefix] = 1;
            }
        }
        return returnList;
    },

    //第1个列表与第2个列表的交集
    TowListIntersect: function TowListIntersect(aList, bList) {
        var returnList = [];
        var aCount = aList.length;

        for (var index = 0; index < aCount; index++) {
            var value = aList[index];
            if (bList.InArray(value)) {
                returnList.push(value);
            }
        }
        return returnList;
    },

    //第1个列表与第2个列表的差集
    TowListSubtraction: function TowListSubtraction(aList, bList) {
        var returnList = [];
        var aCount = aList.length;

        for (var index = 0; index < aCount; index++) {

            var value = aList[index];
            if (!bList.InArray(value)) {
                returnList.push(value);
            }
        }
        return returnList;
    },

    //2个列表的并集
    TowListUnion: function TowListUnion(aList, bList) {
        var returnList = aList.concat(bList);
        return this.DeleteListRepeat(returnList);
    },

    //随机筛选列表指定个数出来
    ListSample: function ListSample(targetList, choiceCount) {
        var returnList = [];

        //需要拷贝一份避免原列表被修改
        var tempList = targetList.slice();
        var length = tempList.length;

        //需要拷贝一份列表,避免返回列表后原列表数据被修改
        if (length <= choiceCount) {
            return tempList;
        }

        for (var i = 0; i < choiceCount; i++) {
            var index = Math.floor(Math.random() * (length - i));
            returnList.push(tempList[index]);
            tempList.splice(index, 1);
        }
        return returnList;
    },

    //列表随机1个出来
    ListChoice: function ListChoice(targetList) {
        var length = targetList.length;
        if (length < 1) {
            return null;
        }
        return targetList[Math.floor(Math.random() * length)];
    },

    //求列表的最大值
    ListMaxNum: function ListMaxNum(targetList) {
        return Math.max.apply(null, targetList);
    },

    //求列表的最小值
    ListMinNum: function ListMinNum(targetList) {
        return Math.min.apply(null, targetList);
    },
    //----------------字符串方法------------------

    //增加字符串数字后缀 ("btnFight", 1, 2)) - > "btnFight01"
    StringAddNumSuffix: function StringAddNumSuffix(targetString, num, suffixLen) {
        var numString = "" + num;
        if (suffixLen) {
            var numLen = numString.length;
            numString = numLen < suffixLen ? Array(suffixLen - numLen + 1).join(0) + num : numString;
        }

        return [targetString, numString].join("");
    },

    //替换字符串中的文本("第{1}次", 10)) - > "第10次"
    StringReplace: function StringReplace(targetString, argList) {

        var formatStr = targetString;
        var argumentsLen = argList.length;
        for (var index = 1; index <= argumentsLen; index++) {
            formatStr = formatStr.replace(new RegExp("\\{" + index + "\\}", "g"), argList[index - 1]);
        }
        return formatStr;
    },

    //去除左空格
    StringLeftTrim: function StringLeftTrim(targetString) {
        return targetString.replace(/(^\s*)/g, "");
    },
    //去除右空格
    StringRightTrim: function StringRightTrim(targetString) {
        return targetString.replace(/(\s*$)/g, "");
    },
    //去除2边空格
    StringTrim: function StringTrim(targetString) {
        return targetString.replace(/(^\s*)|(\s*$)/g, "");
    },
    //---------------对象方法----------------
    //深拷贝(列表,字典)
    DeepCopy: function DeepCopy(target) {
        return JSON.parse(JSON.stringify(target));
    },

    /**
        * 圆盘概率随机
        * @param curIDList
        * @param curRateList(必须是整数列表)
        * @param maxRate
        */
    GetDiskRandValue: function GetDiskRandValue(curIDList, curRateList, maxRate) {
        //默认万分率随机
        if (!maxRate) {
            maxRate = 0;
            for (var index in curRateList) {
                var rate = curRateList[index];
                maxRate += rate;
            }
        }
        var listLength = curIDList.length;
        if (!listLength) {
            console.error("GetDiskRandValue curIDList empty");
            return null;
        }
        if (listLength != curRateList.length) {
            console.error("GetDiskRandValue (%s) != (%s)", curIDList, curRateList);
            return null;
        }
        var oddsNum = this.RandInt(1, maxRate);

        var sortList = curRateList.map(function (rate, index) {
            var id = curIDList[index];
            return [rate, id];
        });
        //从小到大排序,相等按追加顺序排序
        sortList.sort(function (aList, bList) {
            return aList[0] > bList[0] ? 1 : -1;
        });

        var rateValue = 0;
        for (var index = 0; index < listLength; index++) {
            rateValue += sortList[index][0];
            if (rateValue < oddsNum) {
                continue;
            }
            return sortList[index][1];
        }

        console.error("curIDList:%s,%s,%s,%s not find value", curIDList, curRateList, oddsNum, sortList);

        return null;
    },
    /**
     * 获得一个随机整数 ：start<= randValue <= end
     * @param {Array} below
     * @return {Number}
     * @remarks {}
     */
    RandInt: function RandInt(start, end) {
        return Math.floor(Math.random() * (end + 1 - start) + start);
    },

    /**
     * 生成一个列表 range(0, 7)=>[0,1,2,3,4,5,6]
     */
    Range: function Range() {
        var start, end, step, len, returnList;
        returnList = [];
        len = arguments.length;

        //一个参数
        if (len == 1) {
            start = 0;
            end = arguments.length <= 0 ? undefined : arguments[0];
            step = 1;
        } else if (len == 2) {
            start = arguments.length <= 0 ? undefined : arguments[0];
            end = arguments.length <= 1 ? undefined : arguments[1];
            step = 1;
        } else {
            start = arguments.length <= 0 ? undefined : arguments[0];
            end = arguments.length <= 1 ? undefined : arguments[1];
            step = arguments.length <= 2 ? undefined : arguments[2];
        }

        if (step < 0) {
            for (start; start > end; start += step) {
                returnList.push(start);
            }
        } else {
            for (start; start < end; start += step) {
                returnList.push(start);
            }
        }
        return returnList;
    },

    /**
     * 获取字典数据格式字符串（支持字典嵌套）
     * @param {Object} curDict
     * @param {Number} tabNum
     * @return {String}
     */
    GetPrintDictStr: function GetPrintDictStr(curDict, tabNum) {
        var key, value, classType, outEx, arg;

        tabNum = tabNum != null ? tabNum : 0;
        var outstr = "{\n";

        for (key in curDict) {
            value = curDict[key];
            classType = Object.prototype.toString.call(value).slice("[object ".length, -1);

            outEx = "";
            if (classType == "Object") {
                if (value.hasOwnProperty("JS_Name")) {
                    outEx = "(" + value.toString() + "),\n";
                } else {
                    outEx = this.GetPrintDictStr(value, tabNum + 1);
                }
            } else if (classType == "Function") {
                outEx = value.constructor.name + ",\n";
            } else {
                arg = "";
                try {
                    arg = JSON.stringify(value);
                } catch (e) {
                    //存在对象循环引用
                    arg = "### cyclic object value:" + value.toString();
                }
                outEx = arg + ",\n";
            }

            outstr += "\t" + this.GetTabStr(tabNum) + JSON.stringify(key) + ":" + outEx;
        }

        outstr += this.GetTabStr(tabNum) + "}";

        if (tabNum) {
            outstr += ",";
        }
        outstr += "\n";

        return outstr;
    },

    /**
     * 返回tab字符串个数
     * @param {Object} num
     * @return {String}
     */
    GetTabStr: function GetTabStr(num) {
        var outstr = "";
        while (num--) {
            outstr += "\t";
        }
        return outstr;
    },

    /**
        * 输出类属性信息
        * @param obj
        */
    OutPutClassProperty: function OutPutClassProperty(obj) {
        var propertyDict = {};
        for (var property in obj) {
            propertyDict[property] = obj[property];
        }
    },

    /**
     *	获取时间天数差
     */
    GetDayDiffByTick: function GetDayDiffByTick(tick_1, tick_2) {
        var dateTime_1, dateTime_2;

        dateTime_1 = new Date(tick_1);
        dateTime_2 = new Date(tick_2);

        try {
            dateTime_1 = Date.parse(dateTime_1.getMonth() + 1 + "/" + dateTime_1.getDate() + "/" + dateTime_1.getFullYear());
            dateTime_2 = Date.parse(dateTime_2.getMonth() + 1 + "/" + dateTime_2.getDate() + "/" + dateTime_2.getFullYear());
            return Math.abs(dateTime_1 - dateTime_2) / (24 * 60 * 60 * 1000);
        } catch (e) {
            console.error("GetDayDiffByTick error(%s)", e.message);
        }
    },

    /**
     * 获取当前时间字符串格式: 2017/3/28 11:11
     */
    GetDateYearMonthDayHourMinuteString: function GetDateYearMonthDayHourMinuteString(time) {
        var date = new Date(time * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        return year + "/" + this.StringAddNumSuffix("", month, 2) + "/" + this.StringAddNumSuffix("", day, 2) + " " + this.StringAddNumSuffix("", hours, 2) + ":" + this.StringAddNumSuffix("", minutes, 2) + ":" + this.StringAddNumSuffix("", seconds, 2);
    },

    /**
     * 获取当前时间字符串格式
     * @returns {String} 2014-11-06
     */
    GetNowDateDayStr: function GetNowDateDayStr() {
        var myDate = new Date();

        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return [this.StringAddNumSuffix("", year, 4), this.StringAddNumSuffix("", month, 2), this.StringAddNumSuffix("", day, 2)].join("-");
    },

    /**
     * 获取当前时间字符串格式
     * @returns {String} 2014-11
     */
    GetNowDateMonthString: function GetNowDateMonthString() {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        return [this.StringAddNumSuffix("", year, 4), this.StringAddNumSuffix("", month, 2)].join("-");
    },
    /**
     * 获取当前时间字符串格式
     * @returns {String} 11-11 17:10
     */
    GetNowDateMonthDayHoursMinutesString: function GetNowDateMonthDayHoursMinutesString() {
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var hours = myDate.getHours();
        var minutes = myDate.getMinutes();
        return this.StringAddNumSuffix("", month, 2) + "-" + this.StringAddNumSuffix("", day, 2) + " " + this.StringAddNumSuffix("", hours, 2) + ":" + this.StringAddNumSuffix("", minutes, 2);
    },

    /**
     * 获取当前时间字符串格式
     * @returns {String} 2014-11-06_193844
     */
    GetNowDateTimeStr: function GetNowDateTimeStr() {

        var myDate = new Date();

        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var hour = myDate.getHours();
        var min = myDate.getMinutes();
        var second = myDate.getSeconds();

        var dateString = [this.StringAddNumSuffix("", year, 4), this.StringAddNumSuffix("", month, 2), this.StringAddNumSuffix("", day, 2)].join("-");
        dateString += "_";

        dateString += [this.StringAddNumSuffix("", hour, 2), this.StringAddNumSuffix("", min, 2), this.StringAddNumSuffix("", second, 2)].join(":");

        return dateString;
    }

});

var g_sss_ComTool = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_sss_ComTool) {
        g_sss_ComTool = new sss_ComTool();
    }
    return g_sss_ComTool;
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
        //# sourceMappingURL=fjssz_ComTool.js.map
        