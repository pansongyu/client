(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UISign.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dc501nvSlBNE5xw4o2clA66', 'UISign', __filename);
// script/ui/UISign.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        icon_ledou: cc.SpriteFrame,
        icon_zuanshi: cc.SpriteFrame,
        layout: cc.Node,
        btn_lingqu: cc.Button,
        jiangli: cc.Node
    },
    //初始化
    OnCreateInit: function OnCreateInit() {
        this.FormManager = app.FormManager();
        this.signin = this.SysDataManager.GetTableDict("signin");
    },
    OnShow: function OnShow() {
        this.jiangli.active = false;
        this.ReSetLingQu();
        var that = this;
        app.NetManager().SendPack("game.CPlayerSign", { "type": 1 }, function (event) {
            var signCount = event.signCount - 1;
            var isTodaySign = event.isTodaySign;

            that.signDay = signCount;
            if (isTodaySign) {
                //true为已今日已领取
                that.SetWndImageByFilePath('btn_lingqu', 'texture/sign/btn_lingqu02');
                that.btn_lingqu.interactable = false;
            } else {
                that.SetWndImageByFilePath('btn_lingqu', 'texture/sign/btn_lingqu');
                that.btn_lingqu.interactable = true;
            }
            if (signCount > 0) {
                for (var i = 1; i <= signCount; i++) {
                    var node = that.layout.getChildByName('day' + i);
                    node.getChildByName('zhezhao').active = true;
                }
            }
        }, function () {});
    },
    ReSetLingQu: function ReSetLingQu(loginNum) {
        this.loginnum = loginNum;
        for (var key in this.signin) {
            var day = this.signin[key].Day;
            var type = this.signin[key].Type;
            var uniformitemId = this.signin[key].UniformitemId;
            if (type == 'SignIn') {
                var UniCount = this.signin[key].Count;
                this.ShowJiangLi(day, UniCount, uniformitemId);
            }
        }
    },
    ShowJiangLi: function ShowJiangLi(day, count, uniformitemId) {
        var node = this.layout.getChildByName('day' + day);
        if (node) {
            node.getChildByName('num').getComponent(cc.Label).string = "x" + count;
            if (uniformitemId == 1) {
                node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.icon_ledou;
            } else {
                node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.icon_zuanshi;
            }

            node.getChildByName("zhezhao").active = false;
        }
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, eventData) {
        if ('btn_lingqu' == btnName) {
            if (!this.signDay >= 7) {
                return;
            }
            var that = this;
            app.NetManager().SendPack("game.CPlayerSign", { "type": 2 }, function (event) {
                for (var key in that.signin) {
                    var day = that.signin[key].Day;
                    var type = that.signin[key].Type;
                    var uniformitemId = that.signin[key].UniformitemId;
                    if (type == 'SignIn' && day == that.signDay + 1) {
                        var UniCount = that.signin[key].Count;
                        if (uniformitemId == 1) {
                            that.jiangli.getChildByName('bg_icon').getChildByName('icon').getComponent(cc.Sprite).spriteFrame = that.icon_ledou;
                        } else {
                            that.jiangli.getChildByName('bg_icon').getChildByName('icon').getComponent(cc.Sprite).spriteFrame = that.icon_zuanshi;
                        }
                        that.jiangli.getChildByName('lb_num').getComponent(cc.Label).string = 'X' + UniCount;
                        that.jiangli.active = true;
                        that.SetWndImageByFilePath('btn_lingqu', 'texture/sign/btn_lingqu02');
                        that.btn_lingqu.interactable = false;
                        var node = that.layout.getChildByName('day' + (that.signDay + 1));
                        node.getChildByName('zhezhao').active = true;
                    }
                }
            }, function () {
                app.SysNotifyManager().ShowSysMsg("已经领取");
            });
        } else if ('jiangli' == btnName) {
            this.jiangli.active = false;
        } else if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
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
        //# sourceMappingURL=UISign.js.map
        