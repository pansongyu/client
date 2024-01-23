(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIUserChangeSection.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '53622OmNoRFkb+wj+19u9E+', 'UIUserChangeSection', __filename);
// script/ui/club/UIUserChangeSection.js

"use strict";

/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_selfNum: cc.Label,
        lb_xiajiNum: cc.Label
    },
    OnCreateInit: function OnCreateInit() {
        this.isChangeStart = true;
    },

    OnShow: function OnShow(data) {
        this.data = data;
        if (this.data.unionSectionId == -1) {
            this.lb_xiajiNum.node.parent.active = false;
        } else {
            this.lb_xiajiNum.node.parent.active = true;
        }
        this.ResetNumber();
    },

    ResetNumber: function ResetNumber() {
        this.isChangeStart = true;
        this.lb_selfNum.string = this.data.shareToSelfValue;
        this.lb_xiajiNum.string = parseFloat(this.data.minAllowShareToValue - this.data.shareToSelfValue).toFixed(2);
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName === "btn_close") {
            this.CloseForm();
        } else if (btnName === "btn_reset") {
            this.ResetNumber();
        } else if (btnName === "btn_save") {
            var data = {};
            data.unionSectionId = this.data.unionSectionId;
            data.shareToSelfValue = parseFloat(this.lb_selfNum.string);
            this.FormManager.GetFormComponentByFormName("ui/club/UIUserSetSection").UpdateShareToSelfValue(data);
            this.CloseForm();
        } else {
            this.Click_BtnNumber(btnName);
        }
    },

    Click_BtnNumber: function Click_BtnNumber(btnName) {
        var num = btnName.substring(btnName.length - 1);
        if (this.isChangeStart) {
            if (num == ".") {
                app.SysNotifyManager().ShowSysMsg("请输入正确的数字", [], 3);
                return;
            }
            this.lb_selfNum.string = num;
        } else {
            if (num == "." && this.lb_selfNum.string.indexOf(".") > -1) {
                app.SysNotifyManager().ShowSysMsg("请输入正确的数字", [], 3);
                return;
            }
            if (this.lb_selfNum.string.split(".").length > 1 && this.lb_selfNum.string.split(".")[1].length >= 2) {
                app.SysNotifyManager().ShowSysMsg("不能输入超过小数点后两位", [], 3);
                return;
            }
            this.lb_selfNum.string += num;
        }
        //分配给自己的不能大于可分配的值
        var xiajiNum = parseFloat(this.data.minAllowShareToValue - parseFloat(this.lb_selfNum.string)).toFixed(2);
        if (xiajiNum < 0) {
            app.SysNotifyManager().ShowSysMsg("分配给自己的不能大于可分配的值", [], 4);
            this.ResetNumber();
            return;
        }
        this.lb_xiajiNum.string = xiajiNum;
        this.isChangeStart = false;
    }
});

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
        //# sourceMappingURL=UIUserChangeSection.js.map
        