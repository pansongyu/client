(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_FormManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz424-5aa1-461e-8950-77b92961c5d5', 'fjssz_FormManager', __filename);
// script/ui/fjssz_FormManager.js

"use strict";

/*
    场景管理器
*/

var app = require("fjssz_app");

var sss_FormManager = app.BaseClass.extend({

	//初始化
	Init: function Init() {
		this.JS_Name = app["subGameName"] + "_FormManager";

		var SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.SceneInfo = app[app.subGameName + "_SysDataManager"]().GetTableDict("SceneInfo");

		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

		//已经创建的界面字典
		this.loadFormDict = {};

		this.showFormDict = {};

		//正在执行创建的界面
		this.createingFormDict = {};

		//界面控件显示条件字典
		// {
		//     formName:{
		//         wndPath:{"WndParentPath":"","WndPath":"aaa/btn01"}
		//     }
		// }
		this.formWndShowInfo = {};

		//切换场景默认需要显示的界面
		this.defaultFormNameList = [];

		//是否关闭功能控制
		this.isCloseFunButton = false;

		this.InitData();

		this.Log("Init");
	},

	InitData: function InitData() {

		// for(let index in this.FormWndShowInfo){
		//     let formWndShowInfo = this.FormWndShowInfo[index];
		//     let formName = formWndShowInfo["FormName"];
		//     let wndPath = formWndShowInfo["WndPath"];

		//     let wndPathNameList = wndPath.split("/");

		//     let wndParentPath = "";

		//     if(wndPathNameList.length == 1){
		//         wndParentPath = "";
		//     }
		//     else{
		//         wndParentPath = wndPathNameList.join("/");
		//     }

		//     let wndInfo = this.formWndShowInfo.SetDefault(formName, {});
		//     if(wndInfo.hasOwnProperty(wndPath)){
		//         console.error("formWndShowInfo(%s) have find(%s)", formName, wndPath);
		//         continue
		//     }
		//     wndInfo[wndPath] = {
		//                         "ConditionType":formWndShowInfo["ConditionType"],
		//                         "ConditionValue":formWndShowInfo["ConditionValue"],
		//                         "ShowType":formWndShowInfo["ShowType"],
		//                         "WndParentPath":wndParentPath,
		//                     };
		// }
	},
	formPath2RealPath: function formPath2RealPath(formPath) {
		if (formPath.indexOf('/') < 1) {
			return 'ui/' + formPath;
		}
		return formPath;
	},
	formPath2formName: function formPath2formName(formPath) {
		if (formPath.indexOf('/') > -1) {
			var split = formPath.split('/');
			return split[split.length - 1];
		} else {
			return formPath;
		}
	},

	//----------------操作接口--------------------

	//创建界面
	CreateForm: function CreateForm(formPath) {
		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		// let formPath = "";

		// let promise = null;
		// for(let idx in this.folder){
		//     formPath = this.folder[idx].folderPath + formName;
		//     promise = app[app.subGameName + "_ControlManager"]().CreateLoadPromise(formPath);
		// }

		var that = this;
		return app[app.subGameName + "_ControlManager"]().CreateLoadPromise(formPath).then(function (prefab) {
			if (that.loadFormDict.hasOwnProperty(formPath)) {
				that.Log("CreateForm(%s)重复创建界面", formPath);
				return that.loadFormDict[formPath];
			}

			var formNode = cc.instantiate(prefab);
			// for (var i = 0; i < formNode._components.length; i++) {
			//     console.log("CreateForm component Name:" + formNode._components[i].name);
			// }
			var formComponent = formNode.getComponent(formName);
			if (!formComponent) {
				that.ErrLog("CreateForm(%s) not find Component", formName);
				return;
			}
			formComponent.OnCreate(formName);
			that.loadFormDict[formPath] = formNode;
			return formComponent;
		}).catch(function (error) {
			that.ErrLog("CreateForm(%s) error:%s", formName, error.stack);
		});
	},
	//显示界面
	ShowForm: function ShowForm() {
		for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
			argList[_key] = arguments[_key];
		}

		if (!argList.length) {
			console.error("ShowForm Need FormName");
			return app.bluebird.resolve(null);
		}
		var formPath = argList.shift();
		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		//如果已经加载过的界面,则设置界面显示
		if (this.loadFormDict.hasOwnProperty(formPath)) {
			var formNode = this.loadFormDict[formPath];
			if (!formNode) {
				console.error("ShowForm Error:formName %s", formName);
				return;
			}
			if (formNode.name != "") {
				var formComponent = formNode.getComponent(formName);
				formComponent.ShowForm(argList);
				return app.bluebird.resolve(formComponent);
			} else {
				delete this.loadFormDict[formPath];
			}
		}

		//如果已经在创建中
		if (this.createingFormDict.hasOwnProperty(formPath)) {
			console.error("ShowForm createingFormDict have find(%s)", formName);
			return app.bluebird.resolve(null);
		}

		this.createingFormDict[formPath] = 1;

		var that = this;

		app[app.subGameName + "Client"].OnEvent("ModalLayer", "CreateForm");

		return this.CreateForm(formPath).then(function (formComponent) {

			delete that.createingFormDict[formPath];

			if (formComponent) {
				formComponent.ShowForm(argList);
			} else {
				that.ErrLog("CreateForm(%s) fail", formPath);
			}

			app[app.subGameName + "Client"].OnEvent("ModalLayer", "CreateFormEnd");

			return formComponent;
		}).catch(function (error) {
			that.ErrLog("ShowForm error:%s", error.stack);
			app[app.subGameName + "Client"].OnEvent("ModalLayer", "CreateFormEnd");
		});
	},
	CloseFormReal: function CloseFormReal(formPath) {
		var isDestory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		this.CloseForm(formPath, isDestory);
		delete this.loadFormDict[formPath];
	},
	//关闭界面
	CloseForm: function CloseForm(formPath) {
		var isDestory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		if (!this.loadFormDict.hasOwnProperty(formPath)) {
			this.Log("CloseForm(%s) not load", formPath);
			return;
		}
		var formNode = this.loadFormDict[formPath];
		if (!formNode) {
			console.error("CloseForm Error:formName %s", formPath);
			return;
		}
		if (formNode.name == "") {
			delete this.loadFormDict[formPath];
			return;
		}
		try {
			var formComponent = formNode.getComponent(formName);
			if (formComponent) {
				formComponent.CloseForm(isDestory);
			} else {
				console.error("CloseForm Error:formName %s,nodeName %s", formName, formNode.name);
			}
		} catch (error) {
			console.error("CloseForm Error:formName %s,nodeName %s formPath %s", formName, formNode.name, formPath);
		}
	},

	//开启和关闭界面
	ShowOrCloseForm: function ShowOrCloseForm() {
		for (var _len2 = arguments.length, argList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			argList[_key2] = arguments[_key2];
		}

		if (!argList.length) {
			console.error("ShowOrCloseForm Need FormName");
			return false;
		}
		var formPath = argList.shift();
		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		if (!this.loadFormDict.hasOwnProperty(formPath)) {
			argList.unshift(formPath);
			//调用更新界面函数
			this.ShowForm.apply(this, argList);
			return true;
		}
		var formNode = this.loadFormDict[formPath];
		var formComponent = formNode.getComponent(formName);
		formComponent.ShowOrCloseForm(argList);
	},
	//获取界面字典里的指定名字对象的同名脚本
	GetFormComponentByFormName: function GetFormComponentByFormName(formPath) {
		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		if (!this.loadFormDict.hasOwnProperty(formPath)) {
			this.Log("GetFormComponentByFormName(%s) not load", formPath);
			return;
		}
		return this.loadFormDict[formPath].getComponent(formName);
	},

	//界面是否显示中
	IsFormShow: function IsFormShow(formPath) {
		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		if (!this.loadFormDict.hasOwnProperty(formPath)) {
			this.Log("IsFormShow(%s) not load", formPath);
			return false;
		}
		return this.loadFormDict[formPath].getComponent(formName).IsFormShow();
	},

	//获取界面控件显示条件字典
	GetFormWndShowInfo: function GetFormWndShowInfo(formPath) {
		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		if (this.isCloseFunButton) {
			return {};
		}

		if (!this.formWndShowInfo.hasOwnProperty(formPath)) {
			this.Log("GetFormWndShowInfo not find:%s", formPath);
			return {};
		}
		return this.formWndShowInfo[formPath];
	},

	SetIsCloseFunButton: function SetIsCloseFunButton() {
		this.isCloseFunButton = !this.isCloseFunButton;
	},

	GetIsCloseFunButton: function GetIsCloseFunButton() {
		return this.isCloseFunButton;
	},

	AddShowingForm: function AddShowingForm(formPath, formComponent) {
		formPath = this.formPath2RealPath(formPath);
		this.showFormDict[formPath] = formComponent;
	},

	RemoveShowingForm: function RemoveShowingForm(formPath) {
		formPath = this.formPath2RealPath(formPath);
		delete this.showFormDict[formPath];
	},

	//显示界面控件功能函数
	ShowFunWnd: function ShowFunWnd(formPath) {
		formPath = this.formPath2RealPath(formPath);
		formName = this.formPath2formName(formPath);
		var formComponent = this.GetFormComponentByFormName(formName);
		if (!formComponent) {
			console.error("ShowFunWnd(%s) not find");
			return;
		}
		var node = formComponent.node;

		var wndInfo = this.GetFormWndShowInfo(formPath);
		var heroLv = this.HeroManager.GetHeroProperty("lv");
		var passMaxTowerLv = 0;

		for (var wndPath in wndInfo) {

			var conditionInfo = wndInfo[wndPath];

			var wndParentPath = conditionInfo["WndParentPath"];
			var conditionType = conditionInfo["ConditionType"];
			var conditionValue = conditionInfo["ConditionValue"];
			var showType = conditionInfo["ShowType"];

			var wndNode = cc.find(wndPath, node);
			if (!wndNode) {
				console.error("ShowFunWnd not find:%s", wndPath);
				continue;
			}

			var wndParent = "";
			if (!wndParentPath) {
				wndParent = node;
			} else {
				wndParent = cc.find(wndParentPath, node);
				if (!wndParent) {
					console.error("ShowFunWnd(%s) not find", wndParentPath);
					continue;
				}
			}

			var isOpen = false;

			if (conditionType == "HeroLv") {
				if (heroLv >= conditionValue) {
					isOpen = true;
				} else {
					isOpen = false;
				}
			} else if (conditionType == "PassMaxTowerLv") {
				if (passMaxTowerLv >= conditionValue) {
					isOpen = true;
				} else {
					isOpen = false;
				}
			} else {
				isOpen = false;
			}

			if (isOpen) {

				if (showType == this.ShareDefine.FormWnd_NotShow) {
					wndNode.active = true;
				} else if (showType == this.ShareDefine.FormWnd_EffectLock) {
					formComponent.DeleteWndEffect(wndPath, "FunLock");
				} else {
					console.error("wndPath(%s) showType:%s error", wndPath, showType);
				}
			} else {
				if (showType == this.ShareDefine.FormWnd_NotShow) {
					wndNode.active = false;
				} else if (showType == this.ShareDefine.FormWnd_EffectLock) {
					formComponent.AddWndEffect(wndPath, "FunLock", "Lock");
				} else {
					console.error("wndPath(%s) showType:%s error", wndPath, showType);
				}
			}
		}
	},

	CheckFunButtonIsOpen: function CheckFunButtonIsOpen(formPath, wndPath) {
		var isNotify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		formPath = this.formPath2RealPath(formPath);
		var formName = this.formPath2formName(formPath);
		var wndInfo = this.GetFormWndShowInfo(formPath);
		if (!wndInfo.hasOwnProperty(wndPath)) {
			return true;
		}
		var conditionType = wndInfo[wndPath]["ConditionType"];
		var conditionValue = wndInfo[wndPath]["ConditionValue"];

		var heroLv = this.HeroManager.GetHeroProperty("lv");
		var passMaxTowerLv = 0;

		if (conditionType == "PassMaxTowerLv") {
			if (passMaxTowerLv >= conditionValue) {
				return true;
			}
			if (isNotify) {
				this.SysNotifyManager.ShowSysMsg("FunBtnNotOpen_PassMaxTowerLv", [conditionValue - 1]);
			}
			return false;
		} else if (conditionType == "HeroLv") {
			if (heroLv >= conditionValue) {
				return true;
			}
			if (isNotify) {
				this.SysNotifyManager.ShowSysMsg("FunBtnNotOpen_HeroLv", [conditionValue]);
			}
			return false;
		} else {
			console.error("CheckFunButtonIsOpen(%s) conditionType:%s error", wndPath, conditionType);
			return false;
		}
	},

	//增加默认显示的界面
	AddDefaultFormName: function AddDefaultFormName(formPath) {
		formPath = this.formPath2RealPath(formPath);
		if (this.defaultFormNameList.InArray(formPath)) {
			return;
		}
		this.defaultFormNameList.push(formPath);
	},

	GetDefaultFormNameList: function GetDefaultFormNameList() {
		return this.defaultFormNameList;
	},

	ClearDefaultFormNameList: function ClearDefaultFormNameList() {
		this.defaultFormNameList = [];
	},
	//------------------回调函数--------------------------

	//开始切换场景
	OnBeforeExitScene: function OnBeforeExitScene(sceneName) {
		var isDestory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		this.Log("OnBeforeExitScene(%s)", sceneName);
		//关闭所有界面
		for (var formPath in this.loadFormDict) {
			this.CloseForm(formPath, isDestory);
		}
	},
	isInArray: function isInArray(value, arrayList) {
		var length = arrayList.length;
		for (var i = 0; i < length; i++) {
			if (value == arrayList[i]) {
				return true;
			}
		}
		return false;
	},
	LoadSceneDefaultForm: function LoadSceneDefaultForm(sceneName) {

		this.Log("LoadSceneDefaultForm(%s)", sceneName);

		var bluebirdList = [];

		var loadFormNameList = [];
		var NoAddScene = ['clubScene', 'fightScene', 'launchScene', 'loginScene', app.subGameName + 'MainScene']; //四个基础场景不用添加uimore，uimark
		var BaseForm = [];
		if (this.isInArray(sceneName, NoAddScene) == false) {
			//添加游戏预制品
			var GamePrefab = this.SceneInfo[sceneName].gamePrefab;
			if (GamePrefab == 0) {
				console.error("LoadSceneDefaultForm sceneName(%s)  not GamePrefabhave find: (%s)", sceneName, GamePrefab);
			}
			BaseForm.unshift(GamePrefab);
			//添加三个必须预制品
			for (var i = 0; i < BaseForm.length; i++) {
				var _formName = BaseForm[i];
				//如果界面已经创建
				if (this.loadFormDict.hasOwnProperty(_formName)) {
					continue;
				}
				//如果界面已经在创建中
				if (this.createingFormDict.hasOwnProperty(_formName)) {
					continue;
				}

				loadFormNameList.push(_formName);
				bluebirdList.push(this.CreateForm(_formName));
			}
		}
		var count = this.defaultFormNameList.length;
		for (var index = 0; index < count; index++) {
			var _formName2 = this.defaultFormNameList[index];

			if (loadFormNameList.InArray(_formName2)) {
				continue;
			}
			loadFormNameList.push(_formName2);
			bluebirdList.push(this.CreateForm(_formName2));
		}

		//如果存在需要加载的界面资源
		if (bluebirdList.length) {

			app[app.subGameName + "Client"].OnEvent("ModalLayer", "CreateForm");

			return app.bluebird.all(bluebirdList).then(function () {
				app[app.subGameName + "Client"].OnEvent("ModalLayer", "CreateFormEnd");
			});
		}
	},

	//切换完场景
	OnSwithSceneEnd: function OnSwithSceneEnd(sceneName) {

		this.Log("OnSwithSceneEnd(%s)", sceneName);

		var BaseForm = [];
		var NoAddScene = ['clubScene', 'fightScene', 'launchScene', 'loginScene', 'fjsszMainScene']; //四个基础场景不用添加uimore，uimark
		if (this.isInArray(sceneName, NoAddScene) == false) {
			//添加游戏预制品
			var GamePrefab = this.SceneInfo[sceneName].gamePrefab;
			if (GamePrefab == 0) {
				console.error("LoadSceneDefaultForm sceneName(%s)  not GamePrefabhave find: (%s)", sceneName, GamePrefab);
			}
			BaseForm.unshift(GamePrefab);
			//显示三个必须预制品
			for (var i = 0; i < BaseForm.length; i++) {
				this.ShowForm(BaseForm[i]);
			}
		}
	},
	_isOrientationH: function _isOrientationH() {
		var frameSize = cc.view.getFrameSize();
		return frameSize.width > frameSize.height;
	}
});

var g_sss_FormManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_sss_FormManager) {
		g_sss_FormManager = new sss_FormManager();
	}
	return g_sss_FormManager;
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
        //# sourceMappingURL=fjssz_FormManager.js.map
        