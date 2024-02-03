"use strict";
cc._RF.push(module, 'typdk3fc-c008-4704-a272-8d6b354f5f9d', 'pdk_UtilsWord');
// script/common/pdk_UtilsWord.js

"use strict";

var app = require("pdk_app");

var pdk_UtilsWord = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init: function Init() {
        this.JS_Name = app.subGameName + "_UtilsWord";
        this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
        this.dirtyWord = this.SysDataManager.GetTableDict("keywords");
        // console.log("UtilsWord init ",this.dirtyWord);
    },
    //检查字符串是否有敏感字符
    CheckContentDirty: function CheckContentDirty(string) {
        for (var idx in this.dirtyWord) {
            if (-1 != string.indexOf(this.dirtyWord[idx].id)) {
                var reg = new RegExp(this.dirtyWord[idx].id, "g");
                string = string.replace(reg, "**");
            }
        }

        return string;
    },

    //检查分享的字符串是否有敏感字符
    CheckShareContent: function CheckShareContent(string) {}

});

var g_pdk_UtilsWord = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_pdk_UtilsWord) {
        g_pdk_UtilsWord = new pdk_UtilsWord();
    }
    return g_pdk_UtilsWord;
};

cc._RF.pop();