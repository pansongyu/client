"use strict";
cc._RF.push(module, '1b4b2Lk+qZEr5Y0nCYAL6nN', 'BackgroundLayer');
// script/scene/Layer/BackgroundLayer.js

"use strict";

/*
    场景背景层
*/
var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "BackgroundLayer"].join("_");
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
	},

	//显示地图背景图
	ShowMap: function ShowMap(mapID) {
		//如果没有地图，则使用编辑器默认编辑的图片
		if (!mapID) {
			return;
		}
		var imageName = '';

		if (!this.IntegrateImage.hasOwnProperty(imageName)) {
			this.ErrLog("ShowMap IntegrateImage.txt not find:%s", imageName);
			return;
		}
		var imagePath = this.IntegrateImage[imageName]["FilePath"];

		//获取到背景node对象
		var bgNode = this.node.getChildByName("bgImage");
		if (!bgNode) {
			this.ErrLog("ShowMap bgImage not find");
			return;
		}
		var sprite = bgNode.getComponent(cc.Sprite);
		if (!sprite) {
			this.ErrLog("ShowMap bgImage not find cc.Sprite");
			return;
		}

		var that = this;
		//加载图片精灵
		cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
			if (error) {
				that.ErrLog("ShowMap imagePath(%s) loader error:%s", imagePath, error);
				return;
			}
			sprite.spriteFrame = spriteFrame;
		});
	}

});

cc._RF.pop();