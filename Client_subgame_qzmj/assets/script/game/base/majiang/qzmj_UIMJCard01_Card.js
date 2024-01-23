/*
 UICard01 卡牌显示逻辑
 */

let app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseComponent"),
	properties: {
		EventNode: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.LocalDataManager = app.LocalDataManager();
		this.JS_Name = this.node.name + "_UIMJCard01_Card";
		this.animation = this.node.getComponent(cc.Animation);
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.cardID = 0;
		this.jin1 = 0;
		this.jin2 = 0;
		this.pokerSpriteFrame = "";
		this.isOpenPoker = false;
		this.down = false;//是否摊牌
		//this.animation.on('finished', this.OnFinished, this);
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.BaseWidth = this.node.width;
		this.BaseHeight = this.node.height;
		this.is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		//	this.LoadAllImages();
	},
	LoadAllImages: function () {
		let i = 11;
		for (; i <= 58; i++) {
			let imageName = ["CardShow", i].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (!imageInfo) {
				continue;
			}
			if (app['majiang_' + imageName]) {
				continue;
			}
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				})
		}
		i = 11;
		for (; i <= 58; i++) {
			let imageName = ["Card2DShow", i].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (!imageInfo) {
				continue;
			}
			if (app['majiang_' + imageName]) {
				continue;
			}
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				})
		}

	},
	GetCardID: function () {
		if (!this.cardID) {
			this.ErrLog("(%s)GetCardID not cardID", this.node.name);
			return 0
		}
		return this.cardID
	},

	//直接显示卡牌s
	ShowHandCard: function (cardID, jin1 = 0, jin2 = 0, down = false) {
		let pokerSprite = this.node.getComponent(cc.Sprite);
		pokerSprite.spriteFrame = "";
		this.pokerSpriteFrame = "";
		this.isOpenPoker = true;
		this.cardID = cardID;
		this.down = down;//摊牌标记
		this.jin1 = jin1;
		this.jin2 = jin2;
		this.LoadImage();
	},

	//直接显示卡牌
	ShowCard: function (cardID, jin1 = 0, jin2 = 0, down = false) {
		this.pokerSpriteFrame = "";
		this.isOpenPoker = true;
		this.cardID = cardID;
		this.down = down;//摊牌标记
		this.jin1 = jin1;
		this.jin2 = jin2;
		this.LoadImage();
	},
	ShowDa: function (cardID, daList) {
		let childNode = this.node;
		let touda = daList[0];
		let erda = daList[1];
		let beida = daList[2];
		let daId = 0;
		if (touda.length > 0) {
			for (let i = 0; i < touda.length; i++) {
				if (cardID == touda[i]) {
					daId = 1;
					break;
				}
			}
		}
		if (erda.length > 0) {
			for (let i = 0; i < erda.length; i++) {
				if (cardID == erda[i]) {
					daId = 2;
					break;
				}
			}
		}
		if (beida.length > 0) {
			for (let i = 0; i < beida.length; i++) {
				if (cardID == beida[i]) {
					daId = 3;
					break;
				}
			}
		}
		if (daId > 0) {
			let imageName = "da_" + daId;
			let imageInfo = this.IntegrateImage[imageName];
			if (!imageInfo) {
				this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
				return
			}
			let imagePath = imageInfo["FilePath"];
			let that = this;
			let childSprite = childNode.getComponent(cc.Sprite);
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					childSprite.spriteFrame = spriteFrame;
				})
				.catch(function (error) {
						that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
					}
				);
			childNode.active = true;
		} else {
			childNode.active = false;
		}
	},
	//开局发牌阶段
	OpenCard: function (cardID, jin1 = 0, jin2 = 0) {
		this.pokerSpriteFrame = "";
		this.isOpenPoker = false;
		this.down = false;
		this.cardID = cardID;
		this.jin1 = jin1;
		this.jin2 = jin2;
		let pokerSprite = this.node.getComponent(cc.Sprite);
		pokerSprite.spriteFrame = null;
		if (this.is3DShow == 1) {
			//	this.animation.play("UICard01_OpenCard");
		} else {
			//	this.animation.play("UICard01_Open2dCard");
		}

		this.LoadImage();


		this.isOpenPoker = true;
		this.ShowPokerImage();

	},

	//开局整理牌
	OpenCard2: function (cardID, jin1, jin2 = 0) {
		this.pokerSpriteFrame = "";
		this.isOpenPoker = false;
		this.down = false;
		this.cardID = cardID;
		this.jin1 = jin1;
		this.jin2 = jin2;
		let pokerSprite = this.node.getComponent(cc.Sprite);
		pokerSprite.spriteFrame = null;
		if (this.is3DShow == 1) {
			//	this.animation.play("UICard01_OpenCard2");
		} else {
			//	this.animation.play("UICard01_Open2dCard2");
		}
		this.LoadImage();

		this.isOpenPoker = true;
		this.ShowPokerImage();
	},

	LoadImage: function () {
		//取卡牌ID的前2位
		let imageName = '';
		if (this.down == false) {
			if (this.is3DShow == 1 || this.is3DShow == 2) {
				imageName = ["CardShow", Math.floor(this.cardID / 100)].join("");
			} else if (this.is3DShow == 0) {
				imageName = ["Card2DShow", Math.floor(this.cardID / 100)].join("");
			}
		} else {
			if (this.is3DShow == 1 || this.is3DShow == 2) {
				imageName = ["EatCard_Self_", Math.floor(this.cardID / 100)].join("");
			} else if (this.is3DShow == 0) {
				imageName = ["OutCard2D_Self_", Math.floor(this.cardID / 100)].join("");
			}
		}
		let imageInfo = this.IntegrateImage[imageName];
		if (!imageInfo) {
			this.ErrLog("LoadImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		if (app['majiang_' + imageName]) {
			this.pokerSpriteFrame = app['majiang_' + imageName];
			this.ShowPokerImage();
		} else {
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					app['majiang_' + imageName] = spriteFrame;
					that.pokerSpriteFrame = spriteFrame;
					that.ShowPokerImage();
				})
				.catch(function (error) {
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				})
		}
	},

	OnFinished: function () {
		this.isOpenPoker = true;
		this.ShowPokerImage();
	},
	ShowPokerImage: function () {
		this.ShowJinBg();
		if (this.cardID == 0) {
			return;
		}
		if (!this.pokerSpriteFrame) {
			this.ErrLog("XiaoFu ShowPokerImage1:%s", this.pokerSpriteFrame, this.cardID);
			return
		}
		if (!this.isOpenPoker) {
			return
		}
		let pokerSprite = this.node.getComponent(cc.Sprite);
		pokerSprite.spriteFrame = this.pokerSpriteFrame;
		this.node.width = this.BaseWidth;
		this.node.height = this.BaseHeight;

	},
	ShowJinBg: function () {
		if (Math.floor(this.cardID / 100) == Math.floor(this.jin1 / 100) || Math.floor(this.cardID / 100) == Math.floor(this.jin2 / 100)) {
			if (this.node.getChildByName("jin")) {
				this.node.getChildByName("jin").active = true;
			} else {
				this.node.color = cc.color(255, 255, 0);
			}
		} else {
			if (this.node.getChildByName("jin")) {
				this.node.getChildByName("jin").active = false;
			} else {
				this.node.color = cc.color(255, 255, 255);
			}
		}
	}
});
