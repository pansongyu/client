(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiEffect/WeChatHeadImage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f42b8ZzNWFKKI/QT/n8cR1+', 'WeChatHeadImage', __filename);
// script/ui/uiEffect/WeChatHeadImage.js

"use strict";

var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {
		var heroID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		this.heroID = heroID;
		this.getHeadTime = 0;
		this.isGetHead = false;
		this.JS_Name = this.node.name + "_WeChatHeadImage";
		app.Client.RegEvent("RefreshHeadImageSprite", this.Event_RefreshHeadImageSprite, this);
	},

	/*//显示
 onEnable:function(){
 	app.Client.RegEvent("RefreshHeadImageSprite", this.Event_RefreshHeadImageSprite, this);
 },
 	//关闭时
 onDisable:function(){
 	app.Client.UnRegTargetEvent(this);
 },
 */
	Event_RefreshHeadImageSprite: function Event_RefreshHeadImageSprite(event) {
		var heroIDList = event["HeroIDList"] || [];
		if (heroIDList.InArray(this.heroID)) {
			var spriteFrame = app.WeChatManager().GetHeroHeadSpriteFrame(this.heroID);
			this.isGetHead = true;
			this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
		}
	},
	OnReloadHeroHead: function OnReloadHeroHead(heroID) {
		var heroSex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	},
	//显示微信头像
	ShowHeroHead: function ShowHeroHead(heroID, headImageUrl) {
		var heroSex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		if (this.isGetHead == true) {
			return;
		}
		var that = this;
		if (this.getHeadTime > 3) {
			if (headImageUrl) {
				if (headImageUrl.indexOf('thirdwx.qlogo.cn') > 0) {
					headImageUrl = headImageUrl + "?a.png";
				}
				app.ControlManager().CreateLoadPromiseByUrl(headImageUrl).then(function (texture) {
					if (texture instanceof cc.Texture2D) {
						if (!cc.isValid(that.node)) {
							return;
						}
						that.isGetHead = true;
						var _spriteFrame = new cc.SpriteFrame(texture);
						that.node.getComponent(cc.Sprite).spriteFrame = _spriteFrame;
					} else {
						that.ErrLog("texture not Texture2D");
					}
				}).catch(function (error) {
					that.ErrLog("OnHttpPack_HeadImagePathInfo error:%s", error.stack);
				});
			}
			return;
		}
		this.heroID = heroID;
		var spriteFrame = app.WeChatManager().GetHeroHeadSpriteFrame(heroID);
		if (spriteFrame) {
			this.isGetHead = true;
			this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
		} else {
			setTimeout(function () {
				that.getHeadTime++;
				that.ShowHeroHead(heroID, headImageUrl);
			}, 500);
		}
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
        //# sourceMappingURL=WeChatHeadImage.js.map
        