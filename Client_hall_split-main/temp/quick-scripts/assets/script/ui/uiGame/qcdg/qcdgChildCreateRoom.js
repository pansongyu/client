(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/qcdg/qcdgChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13fcdxlNFpHbIi0lTUiidA+', 'qcdgChildCreateRoom', __filename);
// script/ui/uiGame/qcdg/qcdgChildCreateRoom.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
创建房间子界面
 */
var app = require("app");

var ygwskChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};

		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');

		var laizi = this.GetIdxByKey('laizi');
		var moyouzhuafen = this.GetIdxByKey('moyouzhuafen');

		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		var fangjian = [];
		for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
			if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
				fangjian.push(_i);
			}
		}
		var kexuanwanfa = [];
		for (var _i2 = 0; _i2 < this.Toggles['kexuanwanfa'].length; _i2++) {
			if (this.Toggles['kexuanwanfa'][_i2].getChildByName('checkmark').active) {
				kexuanwanfa.push(_i2);
			}
		}

		if (isSpiltRoomCard == 1) {
			isSpiltRoomCard = 2;
		}

		sendPack = {
			"laizi": laizi,
			"moyouzhuafen": moyouzhuafen,
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,
			"fangjian": fangjian,
			"kexuanwanfa": kexuanwanfa
		};

		return sendPack;
	},
	RefreshAllToggles: function RefreshAllToggles(gameType) {
		this.gameType = gameType;
		this.Toggles = {};
		this.scroll_Right.stopAutoScroll();
		//this.node_RightLayout.removeAllChildren();
		this.DestroyAllChildren(this.node_RightLayout);
		var isHideZhadanfenshu = false;

		var helpIndex = 1; //01是总帮助
		for (var key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName) {
				var node = null;
				var dataKey = this.gameCreateConfig[key].Key;
				var toggleCount = this.gameCreateConfig[key].ToggleCount;
				var AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
				var spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
				if (this.clubData && 'fangfei' == dataKey) {
					toggleCount = 1; //一个管理付，一个大赢家付
					AtRows = [1];
				} else if (this.unionData && 'fangfei' == dataKey) {
					toggleCount = 1; //一个盟主付`
					AtRows = [1];
				}

				node = cc.instantiate(this.prefab_Toggles);
				node.active = true;
				//需要判断添更加多的Toggle
				var addCount = toggleCount - 1;
				if (addCount < 0) this.ErrLog('gameCreate Config ToggleCount error');else {
					for (var i = 2; i <= toggleCount; i++) {
						var prefabNode = node.getChildByName('Toggle1');
						var newNode = cc.instantiate(prefabNode);
						newNode.name = 'Toggle' + i;
						node.addChild(newNode);
					}
				}

				node.name = 'Toggles_' + dataKey;
				node.x = 10;
				var nodeHelp = node.getChildByName('btn_help');
				nodeHelp.active = false;
				if (this.gameCreateConfig[key].IsShowHelp) {
					nodeHelp.name = 'btn_help0' + helpIndex;
					nodeHelp.on('click', this.OnHelpBtnClick, this);
					nodeHelp.active = true;
					helpIndex++;
				}

				if (!this.Toggles[dataKey]) this.Toggles[dataKey] = [];

				var fristPos = { x: 0, y: 0 };
				var lastPos = { x: 0, y: 0 };
				for (var _i3 = 1; _i3 <= toggleCount; _i3++) {
					var curNode = node.getChildByName('Toggle' + _i3);
					curNode.isFirstNode = false;
					if (curNode) {
						//位置宽高设置下
						//记录下第一个的位置方便换行
						if (1 == _i3) {
							fristPos.x = curNode.x;
							fristPos.y = curNode.y;
							lastPos.x = curNode.x;
							lastPos.y = curNode.y;
							curNode.isFirstNode = true;
						} else if (1 < _i3) {
							//第1个以后都是新增的
							if (AtRows[_i3 - 2] != AtRows[_i3 - 1]) {
								curNode.x = fristPos.x;
								curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
								node.height = node.height + curNode.height + this.rightPrefabSpacing;
								curNode.isFirstNode = true;
							} else {
								// if ('fangfei' == dataKey) {
								//     //房费节点比较长，需要再位移一点
								//     curNode.x = lastPos.x + this.addPrefabWidth + 80;
								// }else{
								//     curNode.x = lastPos.x + this.addPrefabWidth;
								// }
								curNode.x = lastPos.x + parseInt(spacing[_i3 - 1]);
								curNode.y = lastPos.y;
							}
						}
						lastPos.x = curNode.x;
						lastPos.y = curNode.y;

						curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
						var checkNode = curNode.getChildByName('checkmark');
						//默认不勾选
						checkNode.active = false;
						var icon_selectBg = curNode.getChildByName('icon_selectBg');
						var showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
						//尝试获取缓存
						var clubId = 0;
						var roomKey = '0';
						var unionId = 0;
						var unionRoomKey = '0';
						var linshi = null;
						if (this.clubData) {
							clubId = this.clubData.clubId;
							roomKey = this.clubData.gameIndex;
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
						}
						//如果cfg没有的话，就是新建房间，才读本地
						if (this.unionData != null && this.unionData.cfgData == null) {
							clubId = this.unionData.clubId;
							unionId = this.unionData.unionId;
							unionRoomKey = this.unionData.roomKey;
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
						}
						//如果cfg没有的话，就是新建房间，才读本地
						if (this.unionData == null || this.unionData.cfgData == null) {
							//第一次创建俱乐部房间没有roomKey为0
							if (!linshi) linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, '0', unionId, unionRoomKey);
							if (linshi) {
								var linshiList = linshi.split(',');
								for (var j = 0; j < linshiList.length; j++) {
									//缓存可能出BUG(配置删除了按钮数量)
									if (parseInt(linshiList[j]) > toggleCount) {
										linshiList = ['1'];
										break;
									}
								}
								showList = linshiList;
							}
						} else {
							var cfgDataList = this.unionData.cfgData.bRoomConfigure[dataKey];
							if ((typeof cfgDataList === "undefined" ? "undefined" : _typeof(cfgDataList)) == "object") {
								showList = [];
								for (var _j = 0; _j < cfgDataList.length; _j++) {
									//索引要加1
									var realIndex = cfgDataList[_j] + 1;
									showList.push(realIndex);
								}
							} else if (typeof cfgDataList == "number") {
								//单选，就一个数字，加入数组
								var showListTemp = [];
								//索引要加1
								showListTemp.push(cfgDataList + 1);
								showList = showListTemp;
							}
						}

						if (this.clubData && 'fangfei' == dataKey) showList = [1];
						if (this.unionData && 'fangfei' == dataKey) showList = [1];

						//尝试获取缓存
						if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length) this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

						if (1 == this.gameCreateConfig[key].ToggleType) {
							//多选的图片设置下(不放上面是因为路径)
							var imgPath = 'texture/ui/createRoom/icon_checkin02';
							node.addComponent(cc.Toggle);
							this.SetNodeImageByFilePath(checkNode, imgPath);
							this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/createRoom/icon_check02');
						}

						for (var _j2 = 0; _j2 < showList.length; _j2++) {
							if (_i3 == parseInt(showList[_j2])) {
								checkNode.active = true;
								break;
							} else {
								checkNode.active = false;
							}
						}
						this.Toggles[dataKey].push(curNode);
					}
				}
				this.UpdateTogglesLabel(node);
				this.UpdateLabelColor(node);
				this.node_RightLayout.addChild(node);
				var line = this.scroll_Right.node.getChildByName('line');
				var addline = cc.instantiate(line);
				addline.active = true;
				this.node_RightLayout.addChild(addline);
			}
		}
		this.setHelpBtnPos();
		this.scroll_Right.scrollToTop();
		//如果可以滚动，显示滚动提示节点
		if (this.node_RightLayout.height > this.scroll_Right.node.height) {
			this.scrollTip.active = true;
		} else {
			this.scrollTip.active = false;
		}
		this.UpdateOnClickToggle();
	},
	OnToggleClick: function OnToggleClick(event) {
		this.FormManager.CloseForm("UIMessageTip");
		var toggles = event.target.parent;
		var toggle = event.target;
		var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
		var toggleIndex = parseInt(toggle.name.substring('Toggle'.length, toggle.name.length)) - 1;
		var needClearList = [];
		var needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {

			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
		} else if ('kexuanwanfa' == key) {
			if (toggleIndex == 0) {
				if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active == false && this.Toggles["laizi"][0].getChildByName("checkmark").active == true) {
					app.SysNotifyManager().ShowSysMsg("有癞子玩法不能勾选三张炸", [], 3);
					return;
				}
				if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active == false && this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active == true) {
					app.SysNotifyManager().ShowSysMsg("连三张不能勾选三张算炸弹", [], 3);
					return;
				}
			}
			if (toggleIndex == 2) {
				if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active == true && this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active == false) {
					app.SysNotifyManager().ShowSysMsg("三张算炸弹不能勾选有连三张", [], 3);
					return;
				}
			}
		}
		if (toggles.getComponent(cc.Toggle)) {
			//复选框
			needShowIndexList = [];
			for (var i = 0; i < needClearList.length; i++) {
				var mark = needClearList[i].getChildByName('checkmark').active;
				//如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
				if (mark && i != toggleIndex) {
					needShowIndexList.push(i);
				}
				//如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
				else if (!mark && i == toggleIndex) {
						needShowIndexList.push(i);
					}
			}
		}
		this.ClearToggleCheck(needClearList, needShowIndexList);
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
		this.UpdateOnClickToggle();
	},
	UpdateOnClickToggle: function UpdateOnClickToggle() {
		if (this.Toggles["laizi"][0].getChildByName("checkmark").active == true) {
			this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active = false;
			this.UpdateLabelColor(this.Toggles["kexuanwanfa"][0].parent);
		}

		if (this.Toggles["kexuanwanfa"][0].getChildByName("checkmark").active == true) {
			this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active = false;
			this.UpdateLabelColor(this.Toggles["kexuanwanfa"][0].parent);
		}
	}

});

module.exports = ygwskChildCreateRoom;

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
        //# sourceMappingURL=qcdgChildCreateRoom.js.map
        