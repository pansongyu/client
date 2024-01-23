"use strict";
cc._RF.push(module, '9dc15o6etNO+5x+qXQeVvIu', 'UILSGameHelp');
// script/game/FJSSZ/ui/UILSGameHelp.js

"use strict";

var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		content: cc.Node,
		scroll_Right: cc.ScrollView
	},
	OnCreateInit: function OnCreateInit() {
		this.curShowViewName = "";
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		var allGameHelpConfig = this.SysDataManager.GetTableDict("GameHelp");
		this.ConfigList = [];
		this.gameType = '';
		for (var key in allGameHelpConfig) {
			this.ConfigList.push(allGameHelpConfig[key]);
		}
	},
	OnShow: function OnShow() {
		var gameType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'fjssz';

		this.gameType = gameType;
		this.ReShow();
	},
	ReShow: function ReShow() {
		this.ShowGameRule(this.gameType);
	},
	ShowGameRule: function ShowGameRule(ruleStr) {
		this.scroll_Right.scrollToBottom();
		if (ruleStr == "") {
			this.node.active = 0;
			console.error("没传帮助参数,无法读表");
			return;
		}
		if (this.curShowViewName == ruleStr) {
			this.scroll_Right.scrollToBottom();
			return;
		}
		this.content.removeAllChildren();
		this.curShowViewName = ruleStr;

		for (var i = 0; i < this.ConfigList.length; i++) {
			if (this.ConfigList[i].gameName == this.curShowViewName) {
				if (this.ConfigList[i].img != "null") {
					// if (this.ConfigList[i].img == "null") {
					this.CreateImg(this.ConfigList[i].img, i);
				} else {
					var desc = this.ConfigList[i].desc;
					var reg = /\/n/g;
					desc = desc.replace(reg, "\n");
					reg = /\/t/g;
					desc = desc.replace(reg, "\t");
					var fontSize = this.ConfigList[i].fontSize;
					var colorList = this.ConfigList[i].fontColor.split(",");
					if (colorList.length != 4) {
						console.error("GameHelp Config color error id is :" + this.ConfigList[i].id);
						continue;
					}
					var color = new cc.color(colorList[0], colorList[1], colorList[2], colorList[3]);
					// let color = new cc.Color(colorList[0], colorList[1], colorList[2]);
					this.CreateLabel(desc, fontSize, color, this.ConfigList[i].isTitle, i);
				}
			}
		}
		this.UpdateContent();
		this.scroll_Right.scrollToBottom();
	},
	CreateLabel: function CreateLabel(str, fontSize, color, isTitle, index) {
		var node = new cc.Node();
		node.name = "label" + index;
		node.dataIndex = index;
		var curLabel = node.addComponent(cc.Label);
		curLabel.fontSize = fontSize;
		curLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
		curLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
		curLabel.cacheMode = cc.Label.CacheMode.CHAR;
		if (isTitle) curLabel.lineHeight = 60;else curLabel.lineHeight = 40;
		node.anchorX = 0;
		node.x = -(this.content.width / 2);
		node.width = this.content.width;
		curLabel.enableWrapText = true;
		curLabel.isSystemFontUsed = true;
		curLabel.string = str;
		node.color = color;
		// node.color = cc.color(114, 20, 15, 255);
		node.y = node.y - 200;
		this.content.addChild(node);
	},
	CreateImg: function CreateImg(path, index) {
		var self = this;
		var node = new cc.Node();
		node.name = "img" + index;
		node.dataIndex = index;
		node.addComponent(cc.Sprite);
		node.anchorX = 0;
		node.x = -(this.content.width / 2);
		app[app.subGameName + "_ControlManager"]().CreateLoadPromise(path, cc.SpriteFrame).then(function (spriteFrame) {
			if (!spriteFrame) {
				console.error("gameHelp CreateImg(%s) load spriteFrame fail", path);
				return;
			}
			var curSprite = node.getComponent(cc.Sprite);
			curSprite.spriteFrame = spriteFrame;
			self.content.addChild(node);
			self.UpdateContent();
		}).catch(function (error) {
			node.destroy();
			console.error("gameHelp CreateImg(%s) error:%s", path, error.stack);
		});
	},
	UpdateContent: function UpdateContent() {
		var childs = this.content.children;
		if (0 == childs.length) {
			return;
		}
		//childs.sort(this.sortChild);//creator自己排序不会去刷新ui得设置下zIndex在sortAllChildren
		var needHeight = 0;
		for (var i = 0; i < childs.length; i++) {
			needHeight += childs[i].height;
			childs[i].zIndex = childs[i].dataIndex;
		}
		this.content.height = needHeight + 50;
		this.content.sortAllChildren();
		this.scroll_Right.scrollToBottom();
	},
	sortChild: function sortChild(a, b) {
		return a.dataIndex > b.dataIndex;
	}
});

cc._RF.pop();