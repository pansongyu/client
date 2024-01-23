(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/UtilsWord.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '80660ZGkdBMU52dyNkePKBG', 'UtilsWord', __filename);
// script/common/UtilsWord.js

"use strict";

var app = require('app');

var UtilsWord = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init: function Init() {
        this.JS_Name = "UtilsWord";
        this.SysDataManager = app.SysDataManager();
        this.dirtyWord = this.SysDataManager.GetTableDict("keywords");
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
    //检查字符串是否有敏感字符
    CheckContentDirtyEx: function CheckContentDirtyEx(string) {
        for (var idx in this.dirtyWord) {
            if (-1 != string.indexOf(this.dirtyWord[idx].id)) {
                return true;
            }
        }

        return false;
    },

    //检查分享的字符串是否有敏感字符
    CheckShareContent: function CheckShareContent(string) {}

});

var g_UtilsWord = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_UtilsWord) {
        g_UtilsWord = new UtilsWord();
    }
    return g_UtilsWord;
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
        //# sourceMappingURL=UtilsWord.js.map
        