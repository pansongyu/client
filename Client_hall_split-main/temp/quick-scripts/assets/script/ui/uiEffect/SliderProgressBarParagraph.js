(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiEffect/SliderProgressBarParagraph.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b28581mdslEdohv+ypBQGV/', 'SliderProgressBarParagraph', __filename);
// script/ui/uiEffect/SliderProgressBarParagraph.js

"use strict";

/*
 SliderProgressBarParagraph.js 滑动进度分段带进度条显示
 */

var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		ScrollThreshold: 0.5,
		EventNode: cc.Node,
		ProgressBar: cc.ProgressBar
	},

	// use this for initialization
	OnLoad: function OnLoad() {
		this.JS_Name = this.node.name + "_SliderProgressBarParagraph";

		this.ComTool = app.ComTool();

		this.slider = this.node.getComponent(cc.Slider);

		this.paragraphPositionDict = {};

		this.LocalDataManager = app.LocalDataManager();
	},

	InitData: function InitData(keyIDList) {
		var showDataList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
		var isSendEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		this.paragraphPositionDict = {};

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
		}

		if (showDataList.length) {
			this.ShowBackgroundLabel(showDataList);
		}
		//初始化默认从0开始
		this.slider.progress = 0;

		if (isSendEvent) {
			this.OnSliderEvent(this.slider);
		}
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

	OnSliderEvent: function OnSliderEvent(slider) {
		this.ResetProgress();

		if (this.ProgressBar) {
			this.ProgressBar.progress = this.slider.progress;
		}
	},

	ResetProgress: function ResetProgress() {

		var nowProgress = this.slider.progress;

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
					this.EventNode.emit("SliderParagraph", { "KeyID": paragraphPositionDict["KeyID"], "Node": this.node, "Progress": progress });
				}
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
				this.OnSliderEvent(this.slider);
				return;
			}
		}
		this.ErrLog("SetChooseKeyID(%s) not find:", keyID, this.paragraphPositionDict);
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
        //# sourceMappingURL=SliderProgressBarParagraph.js.map
        