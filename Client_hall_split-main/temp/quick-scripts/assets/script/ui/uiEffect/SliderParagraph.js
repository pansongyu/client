(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiEffect/SliderParagraph.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '40d593tr4lBmLB77JAWOnAJ', 'SliderParagraph', __filename);
// script/ui/uiEffect/SliderParagraph.js

"use strict";

/*
    SliderParagraph 滑动进度分段
*/

var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		//拆分为几段
		ParagraphCount: 4,
		ScrollThreshold: 0.5,
		EventNode: cc.Node
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		if (this.isOnLoad) //艹尼玛的creator虾几把onload active=false不会onload
			return;
		this.isOnLoad = true;
		this.JS_Name = this.node.name + "_SliderParagraph";

		this.ComTool = app.ComTool();

		this.slider = this.node.getComponent(cc.Slider);

		this.node.on('slide', this.OnSlideEvent, this);

		//获取button对象
		//let buttonNode = this.slider.handle.node;
		//buttonNode.on('touchend', this.OnTouchEnded, this);
		//buttonNode.on('touchcancel', this.OnTouchCancelled, this);

		this.UpdateSecond = 0.1;

		this.paragraphPositionDict = {};
		this.progressValueDict = {};
		this.keyIDList = [];
		this.showDataList = [];

		//设置默认的分段信息
		var keyIDList = this.ComTool.Range(0, this.ParagraphCount + 1);
		this.InitData(keyIDList);
	},

	OnSlideEvent: function OnSlideEvent() {
		this.isSend = false;
	},

	InitData: function InitData(keyIDList) {
		var showDataList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		if (!this.isOnLoad) this.OnLoad();
		this.passSecond = 0;
		this.isSend = false;

		this.paragraphPositionDict = {};
		this.progressValueDict = {};

		var keyCount = keyIDList.length;
		if (!keyCount) {
			this.ErrLog("InitData keyIDList empty", keyIDList);
			return;
		}
		//如果只有一个则设置开始结束一样
		else if (keyCount == 1) {
				keyIDList.push(keyIDList[0]);
				keyCount = keyIDList.length;
			}
		this.keyIDList = keyIDList;
		this.showDataList = showDataList;

		var offProgress = this.ScrollThreshold * 1 / (keyCount - 1);

		for (var index = 0; index < keyCount; index++) {

			var keyID = keyIDList[index];
			var progress = index / (keyCount - 1);

			var minProgress = progress - offProgress;
			var maxProgress = progress + offProgress;

			if (minProgress < 0) {
				minProgress = 0;
			}

			if (maxProgress > 1) {
				maxProgress = 1;
			}

			//分段每个点的进度位置,最小最大进入范围
			this.paragraphPositionDict[index] = {
				"KeyID": keyID,
				"Progress": progress,
				"MinProgress": minProgress,
				"MaxProgress": maxProgress
			};

			this.progressValueDict[progress] = keyID;
		}

		this.ShowBackgroundLabel(showDataList);
		//初始化默认从0开始
		this.slider.progress = 0;
	},

	ShowBackgroundLabel: function ShowBackgroundLabel(showDataList) {

		var backGroundNode = this.node.getChildByName("Background");
		var count = showDataList.length;

		for (var index = count; index > 0; index--) {
			var childName = this.ComTool.StringAddNumSuffix("yuandian", index, 2);
			var childPath = [childName, "lb"].join("/");
			var labelNode = cc.find(childPath, backGroundNode);
			if (!labelNode) {
				this.ErrLog("ShowBackgroundLabel not find:%s,%s", childPath, this.node.name);
				continue;
			}
			var childLabel = labelNode.getComponent(cc.Label);
			childLabel.string = showDataList[index - 1];
		}
	},

	update: function update(passSecond) {
		this.passSecond += passSecond;

		if (this.passSecond >= this.UpdateSecond) {
			this.ResetProgress();
			this.passSecond = 0;
		}
	},

	ResetProgress: function ResetProgress() {

		var nowProgress = this.slider.progress;

		if (this.progressValueDict.hasOwnProperty(nowProgress)) {
			if (this.isSend) {
				return;
			}
			if (this.EventNode) {
				this.EventNode.emit("SliderParagraph", { "KeyID": this.progressValueDict[nowProgress], "Node": this.node });
			}
			this.isSend = true;
			return;
		}

		//遍历所有的坐标进度点
		for (var index in this.paragraphPositionDict) {
			var paragraphPositionDict = this.paragraphPositionDict[index];
			//查找当前进度位置停留值
			if (paragraphPositionDict["MinProgress"] <= nowProgress && nowProgress <= paragraphPositionDict["MaxProgress"]) {

				var progress = paragraphPositionDict["Progress"];
				//如果正在滑动中跳出
				if (this.slider._dragging) {} else {
					this.slider.progress = progress;
				}
				if (this.EventNode) {
					this.EventNode.emit("SliderParagraph", { "KeyID": paragraphPositionDict["KeyID"], "Node": this.node });
				}
				this.isSend = true;
				break;
			}
		}
	},

	//设置滑动到指定key位置
	SetChooseKeyID: function SetChooseKeyID(keyID) {
		for (var index in this.paragraphPositionDict) {
			var paragraphPositionDict = this.paragraphPositionDict[index];
			if (paragraphPositionDict["KeyID"] == keyID) {
				this.slider.progress = paragraphPositionDict["Progress"];
				if (this.EventNode) {
					this.EventNode.emit("SliderParagraph", { "KeyID": keyID, "Node": this.node });
				}
				this.isSend = true;
				return;
			}
		}
		this.ErrLog("SetChooseKeyID(%s) not find", keyID);
	},

	//获取当前选中的keyID
	GetChooseKeyID: function GetChooseKeyID() {
		var nowProgress = this.slider.progress;

		for (var index in this.paragraphPositionDict) {
			var paragraphPositionDict = this.paragraphPositionDict[index];
			//查找当前进度位置停留值
			if (paragraphPositionDict["MinProgress"] <= nowProgress && nowProgress <= paragraphPositionDict["MaxProgress"]) {
				return paragraphPositionDict["KeyID"];
			}
		}
		this.ErrLog("GetChooseKeyID not find:%s", nowProgress, this.paragraphPositionDict);
		return 0;
	},

	GetProgressNodeByKeyID: function GetProgressNodeByKeyID(keyID) {
		var index = this.keyIDList.indexOf(keyID);
		if (index == -1) {
			this.ErrLog("GetProgressNodeByKeyID(%s) not find", keyID);
			return;
		}

		var childName = this.ComTool.StringAddNumSuffix("yuandian", index + 1, 2);
		var backGroundNode = this.node.getChildByName("Background");
		var progressNode = cc.find(childName, backGroundNode);
		if (!progressNode) {
			this.ErrLog("GetProgressNodeByKeyID(%s) not find", childName);
			return;
		}
		return progressNode;
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
        //# sourceMappingURL=SliderParagraph.js.map
        