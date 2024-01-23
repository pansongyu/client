(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/HideSplash.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '70b11gCi0xGVpH3p4wzjIYb', 'HideSplash', __filename);
// script/HideSplash.js

"use strict";

var app = require('app');

cc.Class({
    extends: cc.Component,

    // onLoad () {},

    start: function start() {
        console.log("-----大厅 HideSplash start-----0");
        if (app.ComTool().IsAndroid()) {
            console.log("-----大厅 HideSplash start-----1");
            //app.NativeManager().CallToNative("HideNativeSplash", []);
            // var timeoutID = setTimeout(function () {
            // app.NativeManager().CallToNative("HideNativeSplash", []);
            // console.log("-----大厅 HideSplash start-----2");
            // clearTimeout(timeoutID);
            // }, 1000);
        }
    }
}

// update (dt) {},

);

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
        //# sourceMappingURL=HideSplash.js.map
        