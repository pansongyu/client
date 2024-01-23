(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_BaseChildForm.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz287-ab23-4098-ab4b-1a2a81d79598', 'fjssz_BaseChildForm', __filename);
// script/ui/fjssz_BaseChildForm.js

"use strict";

/*
 BaseChildForm 子界面基类(又界面控制创建和销毁,一般是BaseForm的子界面,或者BaseChildForm的子界面(可以无限嵌套下去))
 */

var app = require("fjssz_app");

var BaseChildForm = cc.Class({

	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		frontNode: cc.Node,
		backNode: cc.Node,
		deviation: 0
	},

	OnCreate: function OnCreate(parent, childComponentName, index, userData) {
		var pos = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

		this.JS_Name = [childComponentName, index].join("_");

		this.Parent = parent;

		//界面数据
		this._dataInfo = {
			"FormName": childComponentName,
			"UserData": userData,
			"ChildIndex": index
		};

		//注册父类事件分发
		this.parentEventFuncDict = {};

		this.InitBaseData();

		this.OnCreateInit();

		this.ShowFormName();

		if (pos) {
			this.node.setPosition(pos);
		}

		this.initClickX = 0;

		this.InitScrollEffect();
	},

	//------------回掉函数----------------

	//被对象池回收
	unuse: function unuse() {
		this.node.stopAllActions();
		this.DeleteFormAllEffect();
		this.ClearFormAllChildComponent();
	},

	//对象池释放复用
	reuse: function reuse() {
		this.node.active = true;
	},

	// 加载创建界面
	OnLoad: function OnLoad() {},

	//销毁界面
	Destroy: function Destroy() {

		this.OnDestroy();
		//销毁节点
		this.node.destroy();
	},

	//显示界面
	ShowForm: function ShowForm() {
		try {
			this.node.active = true;

			for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
				argList[_key] = arguments[_key];
			}

			this.OnShow.apply(this, argList);
		} catch (error) {
			console.error("ShowForm:%s", error.stack);
		}
	},

	//关闭界面
	CloseForm: function CloseForm() {
		this.node.active = false;
		this.OnClose();
	},

	//开启或者关闭界面
	ShowOrCloseForm: function ShowOrCloseForm() {
		console.error("ShowOrCloseForm cant call");
	},

	//响应父类事件
	OnParentEvent: function OnParentEvent(eventName, argDict) {
		var parentEventFunc = this.parentEventFuncDict[eventName];
		if (!parentEventFunc) {
			this.Log("OnParentEvent(%s) not parentEventFunc", eventName);
			return;
		}
		parentEventFunc.apply(this, [argDict]);
	},

	//--------------获取接口-----------------
	//界面是否显示中
	IsFormShow: function IsFormShow() {
		console.error("IsFormShow cant call");
	},

	//-------------获取接口-------------------
	//获取界面父类
	GetParent: function GetParent() {
		return this.Parent;
	},

	//-------------滑动出现删除控件效果-----------------
	InitScrollEffect: function InitScrollEffect() {
		if (this.frontNode) {
			this.frontNode.on("touchmove", this.OnFront_TouchMove, this);
			this.frontNode.on("touchstart", this.OnFront_TouchStart, this);
			this.frontNode.on("touchend", this.OnFront_TouchEnd, this);
			this.frontNode.on("touchcancel", this.OnFront_TouchCancel, this);
		}
	},
	OnFront_TouchEnd: function OnFront_TouchEnd(event) {
		// let MoveNodeParent = this.frontNode.parent;
		// let MoveNodeWorldPositionX = MoveNodeParent.parent.convertToWorldSpaceAR(MoveNodeParent.getPosition()).x + MoveNodeParent.width/2;
		// let DeleteBtnNodeWorldPositionX = this.backNode.parent.convertToWorldSpaceAR(this.backNode.getPosition()).x;
		// this.Log(MoveNodeWorldPositionX, DeleteBtnNodeWorldPositionX);
	},
	OnFront_TouchCancel: function OnFront_TouchCancel() {},
	OnFront_TouchStart: function OnFront_TouchStart(event) {
		var width = cc.director.getWinSize().width / 2;
		var ClickPositionX = event.getLocationX() - width;
		var frontPosition = this.frontNode.getPositionX();
		this.DistanceX = ClickPositionX - frontPosition;
	},
	OnFront_TouchMove: function OnFront_TouchMove(event) {
		if (!this.backNode) {
			console.error("OnFront_TouchMove not find backNode %s", this.backNode);
			return;
		}
		if (!this.DistanceX) {
			console.error("OnFront_TouchMove not find initClickX %s", this.initClickX);
			return;
		}
		var width = cc.director.getWinSize().width / 2;
		var touchPosX = event.getLocation().x - width;
		var nodeX = touchPosX - this.DistanceX;
		if (nodeX >= 0) {
			nodeX = 0;
		}
		var deviation = this.backNode.width + this.deviation;
		if (nodeX <= -deviation) {
			nodeX = -deviation;
		}
		this.frontNode.setPositionX(nodeX);
	},
	//------------快捷功能函数-------------

	//注冊事件函数
	RegEvent: function RegEvent(eventName, func) {
		console.error("RegEvent cant call");
	},

	/**
  * 注册父类相应事件回调函数
  */
	RegParentEvent: function RegParentEvent(event, func) {
		this.parentEventFuncDict[event] = func;
	},

	//-------------点击函数-------------
	//关闭界面
	OnClick_Close: function OnClick_Close() {
		console.error("OnClick_Close cant call");
	},
	//--------------子类重载接口---------------

	//每次显示界面被调用
	OnShow: function OnShow() {}

});

module.exports = BaseChildForm;

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
        //# sourceMappingURL=fjssz_BaseChildForm.js.map
        