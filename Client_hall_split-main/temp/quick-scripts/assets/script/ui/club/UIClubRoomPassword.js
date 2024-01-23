(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubRoomPassword.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b2c65rLsvdIT6A2EYHnH3Z5', 'UIClubRoomPassword', __filename);
// script/ui/club/UIClubRoomPassword.js

"use strict";

/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_shurukuang: cc.Node
    },
    OnCreateInit: function OnCreateInit() {
        this.labelString = [];
        this.GameManager = app.GameManager();
    },
    OnShow: function OnShow(btnNode, CLubID) {
        this.btnNode = btnNode;
        this.CLubID = CLubID;
        this.ResetNumber();
    },

    ResetNumber: function ResetNumber() {
        var children = this.sp_shurukuang.children;
        for (var idx = 0; idx < children.length; idx++) {
            var sp_bg = children[idx];
            sp_bg.getChildByName("lb_num").getComponent(cc.Label).string = "";
        }
        this.labelString = [];
    },

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (!btnName) {
            this.ErrLog("UIJoin Buttn OnClick(%s) not find btnName", btnName);
        }
        if (btnName === "btn_clear") {
            this.Click_Btn_Clear();
        } else if (btnName === "btn_close") {
            this.Click_btn_close();
        } else if (btnName === "btn_reset") {
            this.ResetNumber();
        } else {
            this.Click_BtnNumber(btnName);
        }
    },

    Click_btn_close: function Click_btn_close() {
        this.labelString = [];
        this.OnClick_Close();
    },

    Click_Btn_Clear: function Click_Btn_Clear() {
        if (this.labelString.length == 0) {
            return;
        }
        var node = this.GetWndNode("sp_shuru/shurukuang/sp_bg" + this.labelString.length + "/lb_num");
        node.getComponent(cc.Label).string = "";
        this.labelString.pop();
    },

    Click_BtnNumber: function Click_BtnNumber(btnName) {
        if (this.labelString.length >= 6) return;
        var num = Math.floor(btnName.substring(btnName.length - 1));
        this.labelString.push(num);
        var roomKey = this.labelString.join("");

        var children = this.sp_shurukuang.children;
        for (var idx = 0; idx < children.length; idx++) {
            var sp_bg = children[idx];
            var lb_num = sp_bg.getChildByName("lb_num").getComponent(cc.Label);
            if (lb_num.string == "") {
                var data = this.labelString[this.labelString.length - 1];
                lb_num.string = data.toString();
                break;
            }
        }
        if (this.labelString.length == 6) {
            //存储密码
            localStorage.setItem("password_" + this.CLubID + "_" + this.btnNode.tagId, roomKey);
            //触发重新加入事件
            app.Client.OnEvent("ReJoin", this.btnNode);
            this.CloseForm();
        }
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
        //# sourceMappingURL=UIClubRoomPassword.js.map
        