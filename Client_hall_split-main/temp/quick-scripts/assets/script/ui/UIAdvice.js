(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIAdvice.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'afc98XIM09PObJH3IQ8vuBS', 'UIAdvice', __filename);
// script/ui/UIAdvice.js

"use strict";

/*
 UIYinSiZhenCe 登陆界面
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},
    OnCreateInit: function OnCreateInit() {
        this.NetManager = app.NetManager();
        this.AdviceUrl = "http://qh.qinghuaimajiang.com/proposal/";
    },

    OnShow: function OnShow() {
        this.playerID = app.HeroManager().GetHeroProperty("pid");
    },
    click_btn_tijiao: function click_btn_tijiao() {
        var toggleGroup = this.node.getChildByName("ToggleContainer");
        var stype = 0;
        if (toggleGroup.getChildByName("toggle1").getComponent(cc.Toggle).isChecked == true) {
            stype = 1;
        } else if (toggleGroup.getChildByName("toggle2").getComponent(cc.Toggle).isChecked == true) {
            stype = 2;
        } else if (toggleGroup.getChildByName("toggle3").getComponent(cc.Toggle).isChecked == true) {
            stype = 3;
        }
        var proposal = this.node.getChildByName("EditBoxContent").getComponent(cc.EditBox).string;
        var phone = this.node.getChildByName("EditBoxPhone").getComponent(cc.EditBox).string;
        if (proposal == "") {
            this.ShowSysMsg("请点击输入框填写您宝贵的意见或建议");
            return;
        }

        //找后台验证实名信息是否合法
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }

        var signString = this.playerID.toString() + stype.toString() + "wanzi" + year.toString() + month.toString() + day.toString();
        var sign = app.MD5.hex_md5(signString);
        this.SendHttpRequest(this.AdviceUrl, "?stype=" + stype + "&proposal=" + encodeURI(proposal) + "&playerid=" + this.playerID + "&phone=" + phone + "&sign=" + sign, "GET", {});
    },
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);
            if (serverUrl == this.AdviceUrl) {
                if (serverPack.code == 200) {
                    //认证成功
                    this.ShowSysMsg("保存成功，非常感觉您的意见建议");
                    this.CloseForm();
                } else if (serverPack.code == 300) {
                    this.ShowSysMsg("保存失败!请稍后重试");
                    return;
                } else if (serverPack.code == 301) {
                    this.ShowSysMsg("玩家id，状态，投诉内容缺一不可！");
                    return;
                } else if (serverPack.code == 302) {
                    this.ShowSysMsg("签名错误！");
                    return;
                }
            }
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_tijiao") {
            this.click_btn_tijiao();
        } else if (btnName == "btn_close") {
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
        //# sourceMappingURL=UIAdvice.js.map
        