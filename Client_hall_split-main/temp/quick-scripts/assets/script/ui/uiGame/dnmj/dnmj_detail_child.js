(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dnmj/dnmj_detail_child.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a80b39Z4RBA5J9mo6bee4KT', 'dnmj_detail_child', __filename);
// script/ui/uiGame/dnmj/dnmj_detail_child.js

"use strict";

/*

 */

var app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {},

	// use this for initialization
	OnLoad: function OnLoad() {},
	ShowPlayerData: function ShowPlayerData(resultsList, playerAll, idx) {
		console.log("总结算数据", resultsList, playerAll, idx);
		var data = resultsList[idx];
		var userInfo = this.node.getChildByName("user_info");
		if (userInfo) {
			userInfo.getChildByName("head_img").getComponent("WeChatHeadImage").ShowHeroHead(data.pid);
			userInfo.getChildByName("label_id").getComponent(cc.Label).string = "ID:" + app.ComTool().GetPid(data.pid);
			for (var index in playerAll) {
				var player = playerAll[index];
				if (player.pid == data.pid) {
					userInfo.getChildByName("lable_name").getComponent(cc.Label).string = player.name;
					// if(player.sex==app.ShareDefine().HeroSex_Boy){
					//     userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame=this.SpriteMale;
					// }else if(player.sex==app.ShareDefine().HeroSex_Girl){
					//     userInfo.getChildByName("sex").getComponent(cc.Sprite).SpriteFrame=this.SpriteFeMale;
					// }
					break;
				}
			}
		}
		var pointList = data["pointList"];
		var jufenLayout = this.node.getChildByName("jufenScrollView").getChildByName("view").getChildByName("content");
		var jufenDemo = this.node.getChildByName("demo_item");
		jufenDemo.opacity = 0;
		for (var i = 0; i < jufenLayout.children.length; i++) {
			jufenLayout.children[i].opacity = 0;
		}
		for (var _i = 0; _i < pointList.length; _i++) {
			var point = pointList[_i];
			var item = jufenLayout.children[_i];
			if (!item) {
				item = cc.instantiate(jufenDemo);
				jufenLayout.addChild(item);
				item.name = "card" + 0;
			}
			item.x = -73;
			item.opacity = 255;
			item.getComponent(cc.Label).string = "第" + (_i + 1) + "局";
			item.getChildByName("num").getComponent(cc.Label).string = point;
		}

		var jiesuan = this.node.getChildByName("jiesuan");
		var show = 1;
		var showLabel = false;
		if (jiesuan) {
			this.huTypesShow(jiesuan, data);
			if (data.point >= 0) {
				jiesuan.getChildByName("lb_win").active = true;
				jiesuan.getChildByName("lb_lost").active = false;
				jiesuan.getChildByName("lb_win").getComponent(cc.Label).string = '+' + data.point;
			} else {
				jiesuan.getChildByName("lb_win").active = false;
				jiesuan.getChildByName("lb_lost").active = true;
				jiesuan.getChildByName("lb_lost").getComponent(cc.Label).string = data.point;
			}
			//比赛分
			if (typeof data.sportsPoint != "undefined") {
				jiesuan.getChildByName("lb_sportsPoint").active = true;
				if (data.sportsPoint > 0) {
					jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "比赛分：+" + data.sportsPoint;
				} else {
					jiesuan.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "比赛分：" + data.sportsPoint;
				}
			} else {
				jiesuan.getChildByName("lb_sportsPoint").active = false;
			}
		}
		var maxPoint = 0;
		var maxDianPao = 0;
		for (var _i2 = 0; _i2 < resultsList.length; _i2++) {
			var _data = resultsList[_i2];
			if (_data.point > maxPoint) {
				maxPoint = _data.point;
			}
			if (_data.dianPaoPoint > maxDianPao) {
				maxDianPao = _data.dianPaoPoint;
			}
		}
		//显示大赢家图标
		if (data.dianPaoPoint >= maxDianPao && maxDianPao > 0) {
			this.node.getChildByName('icon_paoshou').active = true;
		} else {
			this.node.getChildByName('icon_paoshou').active = false;
		}
		if (data.point >= maxPoint) {
			this.node.getChildByName('icon_win').active = true;
			this.node.getChildByName('icon_paoshou').active = false;
		} else {
			this.node.getChildByName('icon_win').active = false;
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
		} else {
			console.error("请检查 xxmj_detail_child预制体是否有 icon_dissolve图集节点");
		}
	},
	huTypesShow: function huTypesShow(jiesuan, huData) {
		jiesuan.getChildByName('top').getChildByName('lb_dianpao').active = false;
		jiesuan.getChildByName('top').getChildByName('lb_jiepao').active = false;
		jiesuan.getChildByName('top').getChildByName('lb_zimo').active = false;
		jiesuan.getChildByName('top').getChildByName('lb_dianpao').getComponent(cc.Label).string = huData.dianPaoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_jiepao').getComponent(cc.Label).string = huData.jiePaoPoint;
		jiesuan.getChildByName('top').getChildByName('lb_zimo').getComponent(cc.Label).string = huData.ziMoPoint;
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
        //# sourceMappingURL=dnmj_detail_child.js.map
        