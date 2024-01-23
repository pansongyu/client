var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		content: cc.Node,
		scroll_Right: cc.ScrollView,
	},
	OnCreateInit: function () {
		this.curShowViewName = "";
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		let allGameHelpConfig = this.SysDataManager.GetTableDict("GameHelp");
		this.ConfigList = [];
		this.gameType = '';
		for (let key in allGameHelpConfig) {
			this.ConfigList.push(allGameHelpConfig[key]);
		}
	},
	OnShow: function (gameType = 'fjssz') {
		this.gameType = gameType;
		this.ReShow();
	},
	ReShow: function () {
		this.ShowGameRule(this.gameType);
	},
	ShowGameRule: function (ruleStr) {
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

		for (let i = 0; i < this.ConfigList.length; i++) {
			if (this.ConfigList[i].gameName == this.curShowViewName) {
				if (this.ConfigList[i].img != "null") {
					// if (this.ConfigList[i].img == "null") {
					this.CreateImg(this.ConfigList[i].img, i);
				}
				else {
					let desc = this.ConfigList[i].desc;
					let reg = /\/n/g;
					desc = desc.replace(reg, "\n");
					reg = /\/t/g;
					desc = desc.replace(reg, "\t");
					let fontSize = this.ConfigList[i].fontSize;
					let colorList = this.ConfigList[i].fontColor.split(",");
					if (colorList.length != 4) {
						console.error("GameHelp Config color error id is :" + this.ConfigList[i].id);
						continue;
					}
					let color = new cc.color(colorList[0], colorList[1], colorList[2], colorList[3]);
					// let color = new cc.Color(colorList[0], colorList[1], colorList[2]);
					this.CreateLabel(desc, fontSize, color, this.ConfigList[i].isTitle, i);
				}
			}
		}
		this.UpdateContent();
		this.scroll_Right.scrollToBottom();
	},
	CreateLabel: function (str, fontSize, color, isTitle, index) {
		let node = new cc.Node();
		node.name = "label" + index;
		node.dataIndex = index;
		let curLabel = node.addComponent(cc.Label);
		curLabel.fontSize = fontSize;
		curLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
		curLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
		curLabel.cacheMode = cc.Label.CacheMode.CHAR;
		if (isTitle)
			curLabel.lineHeight = 60;
		else
			curLabel.lineHeight = 40;
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
	CreateImg: function (path, index) {
		let self = this;
		let node = new cc.Node();
		node.name = "img" + index;
		node.dataIndex = index;
		node.addComponent(cc.Sprite);
		node.anchorX = 0;
		node.x = -(this.content.width / 2);
		app[app.subGameName + "_ControlManager"]().CreateLoadPromise(path, cc.SpriteFrame)
			.then(function (spriteFrame) {
				if (!spriteFrame) {
					console.error("gameHelp CreateImg(%s) load spriteFrame fail", path);
					return;
				}
				let curSprite = node.getComponent(cc.Sprite);
				curSprite.spriteFrame = spriteFrame;
				self.content.addChild(node);
				self.UpdateContent();
			})
			.catch(function (error) {
				node.destroy();
				console.error("gameHelp CreateImg(%s) error:%s", path, error.stack);
			})
	},
	UpdateContent: function () {
		let childs = this.content.children;
		if (0 == childs.length) {
			return;
		}
		//childs.sort(this.sortChild);//creator自己排序不会去刷新ui得设置下zIndex在sortAllChildren
		let needHeight = 0;
		for (let i = 0; i < childs.length; i++) {
			needHeight += childs[i].height;
			childs[i].zIndex = childs[i].dataIndex;
		}
		this.content.height = needHeight + 50;
		this.content.sortAllChildren();
		this.scroll_Right.scrollToBottom();
	},
	sortChild: function (a, b) {
		return a.dataIndex > b.dataIndex;
	}
});