(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/fjssz_BaseComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz6e1-74be-413c-b3ff-895376cbaa10', 'fjssz_BaseComponent', __filename);
// script/fjssz_BaseComponent.js

"use strict";

/*
    自定义基础组件类
*/
var app = require("fjssz_app");
var ShareDefine = require(app.subGameName + "_ShareDefine").GetModel();
var sss_BaseComponent = cc.Class({

    extends: cc.Component,

    //组件可以在编辑器上显示的属性
    properties: {
        "JS_Name": {
            "default": app.subGameName + "_BaseComponent",
            "visible": false
        }
    },
    //是否开发者模式
    IsDevelopment: function IsDevelopment() {
        return ShareDefine.IsDevelopment;
    },
    Log: function Log() {
        if (this.IsDevelopment()) {
            for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
                argList[_key] = arguments[_key];
            }

            //第一个默认是字符串加上文件标示
            argList[0] = this.JS_Name + "\t" + argList[0];
            cc.log.apply(null, argList);
        }
    },

    //网络通信log
    NetLog: function NetLog() {
        if (this.IsDevelopment()) {
            for (var _len2 = arguments.length, argList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                argList[_key2] = arguments[_key2];
            }

            argList[0] = this.JS_Name + "\t" + argList[0];
            cc.log.apply(null, argList);
        }
    },

    SysLog: function SysLog() {
        for (var _len3 = arguments.length, argList = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            argList[_key3] = arguments[_key3];
        }

        //第一个默认是字符串加上文件标示
        argList[0] = this.JS_Name + "\t" + argList[0];
        cc.info.apply(null, argList);
    },

    WarnLog: function WarnLog() {
        if (this.IsDevelopment()) {
            for (var _len4 = arguments.length, argList = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                argList[_key4] = arguments[_key4];
            }

            //第一个默认是字符串加上文件标示
            argList[0] = this.JS_Name + "\t" + argList[0];
            cc.warn.apply(null, argList);
        }
    },

    ErrLog: function ErrLog() {
        for (var _len5 = arguments.length, argList = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            argList[_key5] = arguments[_key5];
        }

        //第一个默认是字符串加上文件标示
        argList[0] = this.JS_Name + "\t" + argList[0];
        cc.error.apply(null, argList);
    },

    //addChild后调用
    onLoad: function onLoad() {
        this.OnLoad();
    },

    //载入调用
    OnLoad: function OnLoad() {},

    //游戏js
    GameTyepStringUp: function GameTyepStringUp() {
        return app.subGameName.toUpperCase();
    }
});

module.exports = sss_BaseComponent;

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
        //# sourceMappingURL=fjssz_BaseComponent.js.map
        