(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/define/PackDefine.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'be0a83Pf7RO+I/9fRlGV9K9', 'PackDefine', __filename);
// script/define/PackDefine.js

"use strict";

/*
 *  PackDefine.js
 *  打包定义
 *
 *  author:hongdian
 *  date:2014-10-28
 *  version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */
var PackDefine = {};

//打包类型
var PACK_TYPE = function PACK_TYPE() {
  this.APPLE_CHECK = "APPLE_CHECK"; //苹果审核包
  this.NORMAL = "NORMAL"; //正常包
};

//-----基础---
PACK_TYPE.apply(PackDefine, []);

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
  return PackDefine;
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
        //# sourceMappingURL=PackDefine.js.map
        