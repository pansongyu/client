(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/gzth/gzth_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e7184PbdoxGYY37TfjqmmPq', 'gzth_detail_child', __filename);
// script/ui/uiGame/gzth/gzth_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
	extends: require("BasePoker_detail_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},
	ShowPlayerData: function ShowPlayerData(resultsList, playerAll, idx) {
		var data = resultsList[idx];
		var userInfo = this.node.getChildByName("user_info");
		if (userInfo) {
			userInfo.getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
			userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
			for (var index in playerAll) {
				var player = playerAll[index];
				if (player.pid == data.pid) {
					userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
					break;
				}
			}
		}
		// this.node.getChildByName("lb_win").getComponent(cc.Label).string = data.winCount;
		// this.node.getChildByName("lb_lose").getComponent(cc.Label).string = data.loseCount;
		this.node.getChildByName("lb_win").active = false;
		this.node.getChildByName("lb_lose").active = false;
		if (data.point >= 0) {
			this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + data.point;
			this.node.getChildByName("lb_win_num").active = true;
			this.node.getChildByName("lb_lose_num").active = false;
		} else {
			this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = data.point;
			this.node.getChildByName("lb_win_num").active = false;
			this.node.getChildByName("lb_lose_num").active = true;
		}
		//比赛分
		if (typeof data.sportsPoint != "undefined") {
			this.node.getChildByName("lb_sportsPoint").active = true;
			if (data.sportsPoint > 0) {
				this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + data.sportsPoint;
			} else {
				this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = data.sportsPoint;
			}
		} else {
			this.node.getChildByName("lb_sportsPoint").active = false;
		}
		if (this.node.getChildByName('icon_dissolve') != null) {
			//显示是否解散（-1:正常结束,0:未操作,1:同意操作,2:拒绝操作,3:发起者）
			if (typeof data.dissolveState == "undefined" || data.dissolveState == -1) {
				this.node.getChildByName('icon_dissolve').active = false;
			} else {
				var imagePath = "texture/record/img_dissolve" + data.dissolveState;
				var that = this;
				//加载图片精灵
				cc.loader.loadRes(imagePath, cc.SpriteFrame, function (error, spriteFrame) {
					if (error) {
						console.log("加载图片精灵失败  " + imagePath);
						return;
					}
					that.node.getChildByName('icon_dissolve').getComponent(cc.Sprite).spriteFrame = spriteFrame;
					that.node.getChildByName('icon_dissolve').active = true;
				});
			}
		}
		var pointList = data["pointList"];
		var juLayout = this.node.getChildByName("juScrollView").getChildByName("view").getChildByName("content");
		var juStrDict = {
			0: "一",
			1: "二",
			2: "三",
			3: "四",
			4: "五",
			5: "六"
		};
		for (var i = 0; i < juLayout.children.length; i++) {
			juLayout.children[i].opacity = 0;
		}
		for (var _i = 0; _i < pointList.length; _i++) {
			var point = pointList[_i];
			var node = juLayout.children[_i];
			if (!node) {
				var juDemo = juLayout.children[0];
				node = cc.instantiate(juDemo);
				juLayout.addChild(node);
			}
			node.opacity = 255;
			node.name = "ju" + _i;
			node.getChildByName("label").getComponent(cc.Label).string = "第" + juStrDict[_i] + "局";
			if (point > 0) {
				point = "+" + point;
			}
			node.getComponent(cc.Label).string = point;
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
        //# sourceMappingURL=gzth_detail_child.js.map
        