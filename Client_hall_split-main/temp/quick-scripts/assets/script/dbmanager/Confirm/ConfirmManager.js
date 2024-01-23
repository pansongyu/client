(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/dbmanager/Confirm/ConfirmManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a91aek1K/RF8KnPkEyVCXWi', 'ConfirmManager', __filename);
// script/dbmanager/Confirm/ConfirmManager.js

"use strict";

/*
 * 	ConfirmManager.js
 * 	2次确认框管理器
 * 
 *	author:hongdian
 *	date:2014-10-28
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 * 
 * change: "2014-10-28 20:24" hongdian 同步C++
 * 
 */

var app = require('app');
/**
 * 类构造
 */
var ConfirmManager = app.BaseClass.extend({

	/**
  * 初始化函数
  */
	Init: function Init() {
		this.JS_Name = "ConfirmManager";
		//等待玩家确认执行函数
		this._ConfirmFunc = null;

		//等待事件类型
		this._ConfirmMsgID = "";

		//等待事件附加参数列表
		this._ConfirmBackArgList = [];

		this.SysNotifyManager = app.SysNotifyManager();
		this.Log("create ConfirmManager");
	},

	/**
  * 记录等待确认界面事件
  * @param {}  curFunc 回调函数
  * @return {} 0/1
  * @remarks {} PY调用  
  */
	SetWaitForConfirmForm: function SetWaitForConfirmForm(curFunc, msgID, backArgList) {

		//界面不存在
		if (typeof curFunc != "function") {
			this.ErrLog("SetWaitForConfirmForm(%s,%s)error", curFunc, msgID);
			return;
		}
		this._ConfirmFunc = curFunc;
		this._ConfirmMsgID = msgID;
		this._ConfirmBackArgList = backArgList;
	},

	/**
  * 修改事件回调参数列表
  * @param {}  curFunc 回调函数
  * @return {} 0/1
  * @remarks {} PY调用
  */
	SetConfirmArgList: function SetConfirmArgList(backArgList) {
		this._ConfirmBackArgList = backArgList;
	},

	/**
  * 带有"确定"和"取消"按钮的消息提示框
  * @param {}  msgID 提示信息id
  * @return {} 0/1
  * @remarks {} PY调用      
  */
	ShowConfirm: function ShowConfirm(confirmType, msgID, msgArgList) {
		var content = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
		var lbSure = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
		var lbCancle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";

		if (content == "") {
			content = this.SysNotifyManager.GetSysMsgContentByMsgID(msgID, msgArgList);
		}
		app.FormManager().ShowForm("UIMessage", "OnConFirm", confirmType, msgID, msgArgList, content, lbSure, lbCancle);
	},

	/**
  * 关闭全部提示框界面
  * @param {}  self 类本身 
  * @return {} 无
  * @remarks {} 函数详细说明:关闭全部提示框界面
  */
	CloseAllBox: function CloseAllBox() {},

	/**
  * 显示购买按钮
  * @param {}  msgID 提示信息id
  * @return {} 0/1
  * @remarks {} PY调用
  */
	ShowBuyMsg: function ShowBuyMsg(msgID, msgArgList) {
		app.FormManager().ShowForm("UIAmountAffirm", msgID, msgArgList);
	},

	/**
  * 使用道具界面
  * @param {}  msgID 提示信息id
  * @return {} 0/1
  * @remarks {} PY调用
  */
	ShowUseMsg: function ShowUseMsg(msgID, msgArgList) {
		this.ErrLog("ShowUseMsg");
	},

	/**
  * 等待确认框回调函数
  * @param {}  result 
  * @return {} null
  * @remarks {} null
  */
	OnConFirmResult: function OnConFirmResult(clickType) {

		if (!this._ConfirmFunc) {
			return;
		}

		if (typeof this._ConfirmFunc != "function") {
			this.ErrLog("OnConFirm _ConfirmFunc:%s error", this._ConfirmFunc);
			return;
		}
		//清空
		var msgID = this._ConfirmMsgID;
		var func = this._ConfirmFunc;
		var argList = this._ConfirmBackArgList;

		this._ConfirmFunc = null;
		this._ConfirmBackArgList = [];

		func(clickType, msgID, argList);
	}

});

//定义单例
var g_ConfirmManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_ConfirmManager) g_ConfirmManager = new ConfirmManager();

	return g_ConfirmManager;
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
        //# sourceMappingURL=ConfirmManager.js.map
        