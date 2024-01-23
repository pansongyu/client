(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/UtilsNum.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1a001NinC9Gl4L3X6Ft1qdI', 'UtilsNum', __filename);
// script/common/UtilsNum.js

"use strict";

var app = require('app');

var UtilsNum = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init: function Init() {
        this.JS_Name = "UtilsNum";
        console.log("UtilsNum init ");
        this.Log("Init");
    },

    CheckNumContinue: function CheckNumContinue(source) {
        var t;
        var ta;
        var r = [];

        source.forEach(function (v) {
            console.log(t, v); // 跟踪调试用
            if (t === v) {
                ta.push(t);
                t++;
                return;
            }

            ta = [v];
            t = v + 1;
            r.push(ta);
        });

        return r;
    }

});

var g_UtilsNum = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_UtilsNum) {
        g_UtilsNum = new UtilsNum();
    }
    return g_UtilsNum;
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
        //# sourceMappingURL=UtilsNum.js.map
        