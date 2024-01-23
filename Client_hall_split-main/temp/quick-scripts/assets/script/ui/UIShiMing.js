(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/UIShiMing.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '37f028wJ1VB+ZLWm+8TkKwo', 'UIShiMing', __filename);
// script/ui/UIShiMing.js

"use strict";

var app = require("app");
cc.Class({
	extends: require("BaseForm"),

	properties: {
		EditBoxName: cc.EditBox,
		EditBoxIDCard: cc.EditBox,
		btn_tijiao: cc.Node,
		tip1: cc.Label,
		tip2: cc.Label,
		layout: cc.Node,
		sp_tag: cc.Node
	},

	OnCreateInit: function OnCreateInit() {
		this.NetManager = app.NetManager();
		this.NetManager.RegNetPack("game.cplayerrealauthen", this.OnPack_ShiMing, this);
		this.HeroManager = app.HeroManager();
		this.AuthUrl = "http://qh.qinghuaimajiang.com/verify_id_name";
	},

	OnShow: function OnShow() {
		var appName = cc.sys.localStorage.getItem('appName');
		if (appName == "baodao") {
			app.SysNotifyManager().ShowSysMsg('实名未开启');
			this.CloseForm();
			return;
		}
		this.playerID = app.HeroManager().GetHeroProperty("pid");
		var realNumber = app.HeroManager().GetHeroProperty("realNumber");
		var realName = app.HeroManager().GetHeroProperty("realName");
		if (realNumber && realName) {
			this.layout.active = false;
			this.btn_tijiao.active = false;
			this.sp_tag.active = true;
		} else {
			this.layout.active = true;
			this.btn_tijiao.active = true;
			this.sp_tag.active = false;
		}
	},
	Btn_tjjiao: function Btn_tjjiao() {
		var name = this.EditBoxName.string;
		var idcard = this.EditBoxIDCard.string;
		if (name.length < 2) {
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
			//this.tip1.string='*姓名输入错误';
			this.EditBoxName.string = "";
			return;
		}
		if (idcard.length < 2) {
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
			//this.tip2.string='*身份证输入错误';
			this.EditBoxIDCard.string = "";
			return;
		}
		if (this.isChn(name) === false) {
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
			//this.tip1.string='*姓名输入错误';
			this.EditBoxName.string = "";
			return;
		} else {
			this.tip1.string = '';
		}

		if (this.isCardNo(idcard) === false) {
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
			//this.tip2.string='*身份证输入错误';
			this.EditBoxIDCard.string = "";
			return;
		} else {
			this.tip2.string = '';
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

		var signString = idcard.toString() + this.playerID.toString() + "wanzi" + year.toString() + month.toString() + day.toString();
		var sign = app.MD5.hex_md5(signString);
		this.SendHttpRequest(this.AuthUrl, "?is_number=" + idcard + "&name=" + encodeURI(name) + "&playerid=" + this.playerID + "&sign=" + sign, "GET", {});
		//this.NetManager.SendPack("game.CPlayerRealAuthen", {"playerId":this.playerID, "realName":name,"realNumber":idcard});
	},
	OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
		try {
			var serverPack = JSON.parse(httpResText);
			if (serverUrl == this.AuthUrl) {
				if (serverPack.code == 200) {
					//认证成功
					var name = this.EditBoxName.string;
					var idcard = this.EditBoxIDCard.string;
					this.NetManager.SendPack("game.CPlayerRealAuthen", { "playerId": this.playerID, "realName": name, "realNumber": idcard });
				} else if (serverPack.code == 300) {
					this.ShowSysMsg("名字和身份号码不匹配");
					return;
				} else if (serverPack.code == 301) {
					this.ShowSysMsg("身份证号，姓名缺一不可");
					return;
				} else if (serverPack.code == 302) {
					this.ShowSysMsg("无效链接");
					return;
				} else if (serverPack.code == 304) {
					this.ShowSysMsg(httpResText);
					return;
				}
			}
		} catch (error) {}
	},
	OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},
	OnPack_ShiMing: function OnPack_ShiMing(serverPack) {
		console.log("OnPack_ShiMing:", serverPack);
		if (serverPack.realName && serverPack.realNumber) {
			app.HeroManager().SetHeroProperty("realName", serverPack.realName);
			app.HeroManager().SetHeroProperty("realNumber", serverPack.realNumber);
			this.WaitForConfirm("UISHIMING_SUCCESS", [], [], this.ShareDefine.ConfirmOK);
		} else {
			this.WaitForConfirm("UISHIMING_FAIL", [], [], this.ShareDefine.ConfirmOK);
		}
	},

	isCardNo: function isCardNo(card) {
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if (reg.test(card) === false) {
			return false;
		}
		return true;
	},
	isChn: function isChn(str) {
		var reg = /^[\u4E00-\u9FA5]+$/;
		if (!reg.test(str)) {
			return false;
		}
		return true;
	},

	OnConFirm: function OnConFirm(clickType, msgID, backArgList) {

		if (msgID == "UISHIMING_SUCCESS") {
			this.btn_tijiao.active = false;
			this.layout.active = false;
			this.sp_tag.active = true;
		} else if (msgID == "UISHIMING_FAIL") {
			this.EditBoxName.string = "";
			this.EditBoxIDCard.string = "";
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
        //# sourceMappingURL=UIShiMing.js.map
        