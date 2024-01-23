(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scene/Layer/fjssz_BackgroundLayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjsszf95-2f01-42cd-874c-35cc39c72aae', 'fjssz_BackgroundLayer', __filename);
// script/scene/Layer/fjssz_BackgroundLayer.js

"use strict";

/*
    场景背景层
*/
var app = require("fjssz_app");

cc.Class({
	extends: cc.Component,

	properties: {},

	OnCreate: function OnCreate(sceneType) {
		this.JS_Name = [sceneType, "BackgroundLayer"].join("_");
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
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
			console.error("ShowMap IntegrateImage.txt not find:%s", imageName);
			return;
		}
		var imagePath = this.IntegrateImage[imageName]["FilePath"];

		//获取到背景node对象
		var bgNode = this.node.getChildByName("bgImage");
		if (!bgNode) {
			console.error("ShowMap bgImage not find");
			return;
		}
		var sprite = bgNode.getComponent(cc.Sprite);
		if (!sprite) {
			console.error("ShowMap bgImage not find cc.Sprite");
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
        //# sourceMappingURL=fjssz_BackgroundLayer.js.map
        