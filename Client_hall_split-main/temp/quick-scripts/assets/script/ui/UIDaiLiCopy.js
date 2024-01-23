(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIDaiLiCopy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '56888KiPBlBKLRDy/uoxZJK', 'UIDaiLiCopy', __filename);
// script/ui/UIDaiLiCopy.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        step1: cc.Node,
        step2: cc.Node,
        step3: cc.Node,
        edit_name: cc.EditBox,
        edit_phone: cc.EditBox,
        edit_yzm: cc.EditBox,
        edit_jieshao: cc.EditBox,
        toggle: cc.Toggle,
        hint: cc.Node,
        lb_time: cc.Label,
        step2WeiXin: cc.Label,
        step2WeiXinRich: cc.RichText,
        step3WeiXinRich: cc.RichText,
        weixin: cc.Label
    },
    OnCreateInit: function OnCreateInit() {
        var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
        if (httpPath[httpPath.length - 1] == "/") {
            httpPath = httpPath.substring(0, httpPath.length - 1);
        }
        this.POSTURL = httpPath + "/index.php?module=ApplicationAgent&action=setApply";
        this.GETURL = httpPath + "/index.php?module=ApplicationAgent&action=getApply&playerID=" + app.HeroManager().GetHeroProperty("pid");
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf, this);
    },
    OnShow: function OnShow() {
        this.step1.active = false;
        this.step2.active = false;
        this.step3.active = false;
        this.hint.active = false;
        //刷新客服号码
        if (!app['KeFuHao']) {
            app['KeFuHao'] = "请设置客服号";
        }
        this.weixin.string = app['KeFuHao'].toString();
        this.step2WeiXin.string = "客服微信号:" + app['KeFuHao'].toString();
        this.step2WeiXinRich.string = "<color=#512d0a>添加客服微信:</c><color=#da4130>" + app['KeFuHao'].toString() + "</color><color=#512d0a>加快审批</color>";
        this.step3WeiXinRich.string = "<color=#512d0a>添加客服微信:</c><color=#da4130>" + app['KeFuHao'].toString() + "</color><color=#512d0a></color>";
        this.SendHttpRequest(this.GETURL, "", "GET", {});
        this.updateTime = new Date().getTime();
    },

    OnEvt_CopyTextNtf: function OnEvt_CopyTextNtf(event) {
        if (0 == event.code) this.ShowSysMsg("已复制微信：" + event.msg);else this.ShowSysMsg("复制失败");
    },

    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 2000, this.OnReceiveHttpPack.bind(this), this.OnConnectHttpFail.bind(this), null, this.OnConnectHttpFail.bind(this));
    },
    /*
    *AppID  AppName AppPrice    DiamondNum  ExtraReward ImageName   goodsType   channelType
      12     金币     29          320000       3002    icon_card6       1           2
    */
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);
            console.log(serverUrl, serverPack);
            if (serverUrl == this.GETURL) {
                if (serverPack.code == 301) {
                    //申请存在或者失败
                    this.step1.active = false;
                    this.step2.active = true;
                    this.step3.active = false;
                    this.hint.active = true;
                } else if (serverPack.code == 200) {
                    //申请不存在
                    this.step1.active = true;
                    this.step2.active = false;
                    this.step3.active = false;
                    this.hint.active = false;
                } else if (serverPack.code == 400) {
                    //申请存在或者失败
                    this.step1.active = false;
                    this.step2.active = false;
                    this.step3.active = true;
                    this.hint.active = true;
                } else {
                    this.ShowSysMsg(serverPack.msg || "系统错误");
                }
            } else if (serverUrl == this.POSTURL) {
                if (serverPack.code == 200) {
                    this.step1.active = false;
                    this.step2.active = true;
                    this.step3.active = false;
                    this.hint.active = true;
                    this.SendHttpRequest(this.GETURL, "", "GET", {});
                } else if (serverPack.code == 300) {
                    this.ShowSysMsg("手机格式错误");
                } else if (serverPack.code == 301) {
                    this.ShowSysMsg("姓名不能为空");
                } else if (serverPack.code == 302) {
                    this.ShowSysMsg("申请保存失败");
                } else if (serverPack.code == 303) {
                    this.ShowSysMsg("玩家id不存在");
                } else if (serverPack.code == 304) {
                    this.ShowSysMsg("未获取到数据");
                } else {
                    this.ShowSysMsg(serverPack.msg || "系统错误");
                    this.SendHttpRequest(this.GETURL, "", "GET", {});
                }
            } else if (this.yanzhengUrl == serverUrl) {
                if (serverPack["code"] == 0) {
                    var btn_yanzhengma = this.node.getChildByName('step1').getChildByName('content').getChildByName('code').getChildByName('btn_yzm');
                    btn_yanzhengma.active = false;
                    this.lb_times = 60;
                    this.schedule(this.ShowYanZhengMaTime, 1);
                    this.scheduleOnce(function () {
                        btn_yanzhengma.active = true;
                        this.lb_times = 0;
                    }, 60);
                } else {
                    this.ShowSysMsg(serverPack.msg);
                }
            }
            this.mictime = serverPack.mictime;
            var timeString = app.ServerTimeManager().GetMictimeStringBySec(this.mictime, this.ShareDefine.ShowHourMinSec);
            this.lb_time.string = timeString;
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},
    //---------刷新函数--------------------
    OnUpdate: function OnUpdate() {
        if (this.mictime) {
            var time = new Date().getTime();
            if (time < this.updateTime) {
                var timeString = app.ServerTimeManager().GetMictimeStringBySec(this.mictime, this.ShareDefine.ShowHourMinSec, 1);
                // let num = parseInt(timeString);
                // if(!num){
                //     this.CloseForm();
                //     return;
                // }
                this.lb_time.string = timeString;
            } else {
                this.updateTime += 500;
            }
        }
    },
    EnterAdmin: function EnterAdmin(btnName, btnNode) {
        var httpPath = app.Client.GetClientConfigProperty("WebSiteUrl");
        if (httpPath[httpPath.length - 1] == "/") {
            httpPath = httpPath.substring(0, httpPath.length - 1);
        }
        cc.sys.openURL(httpPath + "/index.php?module=Publics&action=Login");
    },
    CopyNumber: function CopyNumber(btnName, btnNode) {
        var str = "";
        if ("btn_fzwxh" == btnName.currentTarget.name) {
            str = app["KeFuHao"];
        } else if ("btn_fzgzh" == btnName.currentTarget.name) {
            str = app["KeFuHao"];
        }
        if (cc.sys.isNative) {
            var argList = [{ "Name": "msg", "Value": str.toString() }];
            app.NativeManager().CallToNative("copyText", argList);
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_xieyi' == btnName) {
            app.FormManager().ShowForm('UIDaiLiXieYi');
        } else if ('btn_tijiao' == btnName) {
            /*
            edit_name:cc.EditBox,
            edit_phone:cc.EditBox,
            edit_jieshao:cc.EditBox,
             */
            if (this.toggle.isChecked) {
                var name = this.edit_name.string;
                if (name == "") {
                    this.ShowSysMsg("请输入姓名");
                    return;
                }
                var phone = this.edit_phone.string;
                if (phone == "") {
                    this.ShowSysMsg("请输入手机号码");
                    return;
                }
                var jieshao = this.edit_jieshao.string;
                var unicode = 0;
                var zijie = 0;
                for (var i = 0; i < jieshao.length; i++) {
                    unicode = jieshao.charCodeAt(i);
                    if (unicode < 127) {
                        //判断是单字符还是双字符
                        zijie += 1;
                    } else {
                        //chinese
                        zijie += 2;
                    }
                }
                if (zijie < 30) {
                    this.ShowSysMsg("最少为30个字符（15个汉字）");
                    return;
                }
                var SendPack = {
                    "playerID": app.HeroManager().GetHeroProperty("pid"),
                    "realName": name,
                    "phone": phone,
                    "beizhu": jieshao
                };
                //开始请求客户端配置
                // key=md5('玩家id'.'wanzi'.date('Y-m-d'))
                var signString = app.HeroManager().GetHeroID() + 'wanzi' + app.ComTool().GetNowDateDayStr();
                var sign = app.MD5.hex_md5(signString);
                var para = "&playerID=" + app.HeroManager().GetHeroProperty("pid") + "&realName=" + encodeURI(name) + "&phone=" + phone + "&beizhu=" + encodeURI(jieshao) + "&key=" + sign;
                this.SendHttpRequest(this.POSTURL, para, "GET", {});
            } else {
                this.ShowSysMsg("合作协议未同意");
            }
        } else if ('btn_copy' == btnName) {
            var str = this.weixin.string;
            if (cc.sys.isNative) {
                var argList = [{ "Name": "msg", "Value": str.toString() }];
                var promisefunc = function promisefunc(resolve, reject) {
                    app.NativeManager().CallToNative("copyText", argList);
                };
                return new app.bluebird(promisefunc);
            }
        } else if (btnName == "btn_yzm") {
            this.click_btn_yzm();
        }
    },
    checkPhone: function checkPhone(phone) {
        if (!/^1[3456789]\d{9}$/.test(phone)) {
            return false;
        }
        return true;
    },

    click_btn_yzm: function click_btn_yzm() {
        var node = this.node.getChildByName('step1').getChildByName('content').getChildByName('phone').getChildByName('editbox');
        var phone = node.getComponent(cc.EditBox).string;
        if (!phone) {
            this.ShowSysMsg('请填写手机号码');
            return;
        }
        if (this.checkPhone(phone) == false) {
            this.ShowSysMsg('电话号码有误');
            return;
        }
        this.yanzhengUrl = app.Client.GetClientConfigProperty("WebSiteUrl") + "/SendCode";
        var SendPack = {

            "mobile": phone,
            "sms_temple": "SMS_154085055"
        };

        this.SendHttpRequest(this.yanzhengUrl, "?mobile=" + phone + "&sms_temple=SMS_154085055", "GET", {});
    },
    ShowYanZhengMaTime: function ShowYanZhengMaTime() {
        var lb_time = this.node.getChildByName('step1').getChildByName('content').getChildByName('code').getChildByName('tip_yzm').getComponent(cc.Label);
        this.lb_times = this.lb_times - 1;
        if (this.lb_times <= 0) {
            this.unschedule(this.ShowYanZhengMaTime);
            lb_time.string = "";
            return;
        }
        lb_time.string = this.lb_times + "秒后可再发送";
    }
    // Click_Toggle:function(){
    //     this.bent_tijiao.interactable = this.toggle.isChecked;
    // },
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
        //# sourceMappingURL=UIDaiLiCopy.js.map
        