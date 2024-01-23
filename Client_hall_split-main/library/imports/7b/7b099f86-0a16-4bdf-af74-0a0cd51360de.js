"use strict";
cc._RF.push(module, '7b099+GChZL3690CgzVE2De', 'szmjChildCreateRoom');
// script/ui/uiGame/szmj/szmjChildCreateRoom.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
创建房间子界面
 */
var app = require("app");

var szmjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var leixing = this.GetIdxByKey('leixing');
		var hufa = this.GetIdxByKey('hufa');
		var gangbao = this.GetIdxByKey('gangbao');
		var niaoshu = this.GetIdxByKey('niaoshu');
		var haoqi = this.GetIdxByKey('haoqi');
		var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		var fangjian = this.GetIdxsByKey('fangjian');
		var xianShi = this.GetIdxByKey('xianShi');
		var jiesan = this.GetIdxByKey('jiesan');
		var gaoji = this.GetIdxsByKey('gaoji');
		if (leixing == 0) {
			niaoshu = -1;
		}
		if (leixing == 0 && kexuanwanfa.indexOf(6) < 0) {
			haoqi = -1;
		}
		if (leixing == 1 && kexuanwanfa.indexOf(7) < 0) {
			haoqi = -1;
		}

		sendPack = {
			"leixing": leixing,
			"hufa": hufa,
			"gangbao": gangbao,
			"niaoshu": niaoshu,
			"haoqi": haoqi,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,

			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard

		};
		return sendPack;
	},
	UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode) {
		var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var curKey = TogglesNode.name.substring('Toggles_'.length, TogglesNode.name.length);
		var reg = /\/s/g;
		for (var key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName) {
				if (curKey == this.gameCreateConfig[key].Key) {
					var AAfangfeiDatas = [];
					var WinfangfeiDatas = [];
					var FangZhufangfeiDatas = [];
					var clubGuanLiFangFeiDatas = [];
					var clubWinFangFeiDatas = [];
					var clubAAFangFeiDatas = [];
					var unionGuanliFangFeiDatas = [];
					var title = this.gameCreateConfig[key].Title.replace(reg, ' ');
					TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
					var descList = [];
					if ('jushu' != curKey) {
						//局数读roomcost
						descList = this.gameCreateConfig[key].ToggleDesc.split(',');
						if (this.clubData && 'fangfei' == curKey) {
							descList = ['管理付'];
						} else if (this.unionData && 'fangfei' == curKey) {
							descList = ['盟主付'];
						}
						if (descList.length != TogglesNode.children.length - 2) {
							//减去标题和帮助按钮
							this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
							break;
						}
					}
					var jushuIndex = -1;
					var renshuIndex = -1;
					var renshu = []; //0表示读房主支付配置
					if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey) {

						var publicCosts = this.getCostData(renshu);

						if (this.Toggles['renshu']) renshu = this.getCurSelectRenShu();

						var SpiltCosts = this.getCostData(renshu);
						var curCostData = null;
						if (0 == renshu.length) {
							curCostData = publicCosts;
						} else {
							curCostData = SpiltCosts;
						}
						if (this.Toggles['jushu']) {
							jushuIndex = 0;
							for (var i = 0; i < this.Toggles['jushu'].length; i++) {
								var mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
								if (mark) {
									jushuIndex = i;
									break;
								}
								jushuIndex++;
							}
							for (var _i = 0; _i < curCostData.length; _i++) {
								if (curCostData[_i].SetCount > 100) {
									this.Toggles['jushu'][_i].getChildByName('label').getComponent(cc.Label).string = curCostData[_i].SetCount - 100 + '圈';
								} else {
									this.Toggles['jushu'][_i].getChildByName('label').getComponent(cc.Label).string = curCostData[_i].SetCount + '局';
								}
							}
						}
						if (this.Toggles['fangfei'] && -1 != jushuIndex) {
							if (jushuIndex < publicCosts.length) {
								AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
								WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
								FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

								clubGuanLiFangFeiDatas.push(publicCosts[jushuIndex].ClubCostCount);
								clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
								clubAAFangFeiDatas.push(publicCosts[jushuIndex].ClubAaCostCount);
								//赛事房费
								unionGuanliFangFeiDatas.push(publicCosts[jushuIndex].UnionCostCount);
							}
							if (jushuIndex < SpiltCosts.length) {
								AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
								WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
								FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

								clubGuanLiFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCostCount);
								clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
								clubAAFangFeiDatas.push(SpiltCosts[jushuIndex].ClubAaCostCount);
								//赛事房费
								unionGuanliFangFeiDatas.push(SpiltCosts[jushuIndex].UnionCostCount);
							}
						}
					}
					if ('jushu' != curKey) {
						var descInde = 0;
						for (var _i2 = 0; _i2 < TogglesNode.children.length; _i2++) {
							if (TogglesNode.children[_i2].name.startsWith('Toggle')) {
								TogglesNode.children[_i2].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
								descInde++;
							}
						}
					}

					if (0 != AAfangfeiDatas.length) {
						var needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
						var ffNodes = this.Toggles['fangfei'];
						var hasHideNode = false;
						var spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
						for (var s = 0; s < ffNodes.length; s++) {
							var needNode = ffNodes[s].getChildByName('fangfeiNode');
							needNode.active = true;
							if (hasHideNode && !needNode.parent.isFirstNode && isResetPos) {
								needNode.parent.x = needNode.parent.x - spacing[s] - 80;
								hasHideNode = false;
							}
							//如果房费配的是0，则隐藏
							if (needCount <= 0 && 1 == s) {
								needNode.parent.active = false;
								hasHideNode = true;
								continue;
							}
							var disCost = -1;
							if (this.clubData == null && this.unionData == null) {
								if (0 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								} else if (1 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								} else {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								}
							} else if (this.clubData == null && this.unionData != null) {
								if (0 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								}
							} else {
								if (0 == s) {
									if (this.disCount == -1) {
										needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
									} else {
										disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
										if (disCost == 0) {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
										} else {
											needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
										}
									}
								}
								// else if(1==s){
								//     needNode.getChildByName('icon').active=false;
								//     needNode.getChildByName('icon_qk').active=true;
								//     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
								//     needNode.getChildByName('needNum').clubWinnerPayConsume = clubAAFangFeiDatas[clubAAFangFeiDatas.length - 1];
								//     ffNodes[s].getChildByName('editbox').active=false;
								// }else{
								//     needNode.getChildByName('icon').active=false;
								//     needNode.getChildByName('icon_qk').active=true;
								//     needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
								//     needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
								//     ffNodes[s].getChildByName('editbox').active=false;
								// }
							}
						}
					}
				}
			}
		}
		if (this.Toggles["gaoji"]) {
			for (var _i3 = 0; _i3 < this.Toggles["gaoji"].length; _i3++) {
				var ToggleDesc = this.Toggles["gaoji"][_i3].getChildByName("label").getComponent(cc.Label).string;
				if (ToggleDesc == "30秒未准备自动踢出房间") {
					if (!this.clubData && !this.unionData) {
						this.Toggles["gaoji"][_i3].active = false;
						this.Toggles["gaoji"][_i3].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
						break;
					} else {
						this.Toggles["gaoji"][_i3].active = true;
						//this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
						break;
					}
				}
			}
		} else if (this.Toggles["kexuanwanfa"]) {
			for (var _i4 = 0; _i4 < this.Toggles["kexuanwanfa"].length; _i4++) {
				var _ToggleDesc = this.Toggles["kexuanwanfa"][_i4].getChildByName("label").getComponent(cc.Label).string;
				if (_ToggleDesc == "比赛分不能低于0") {
					if (!this.clubData && !this.unionData) {
						this.Toggles["kexuanwanfa"][_i4].active = false;
						this.Toggles["kexuanwanfa"][_i4].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
						break;
					} else {
						this.Toggles["kexuanwanfa"][_i4].active = true;
						//this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
						break;
					}
				}
			}
		}
	},
	RefreshAllToggles: function RefreshAllToggles(gameType) {
		this.isClickKeXuanWanFaMJ = false;
		this.isClickKeXuanWanFaBD = false;
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
				for (var _i5 = 1; _i5 <= toggleCount; _i5++) {
					var curNode = node.getChildByName('Toggle' + _i5);
					curNode.isFirstNode = false;
					if (curNode) {
						//位置宽高设置下
						//记录下第一个的位置方便换行
						if (1 == _i5) {
							fristPos.x = curNode.x;
							fristPos.y = curNode.y;
							lastPos.x = curNode.x;
							lastPos.y = curNode.y;
							curNode.isFirstNode = true;
						} else if (1 < _i5) {
							//第1个以后都是新增的
							if (AtRows[_i5 - 2] != AtRows[_i5 - 1]) {
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
								curNode.x = lastPos.x + parseInt(spacing[_i5 - 1]);
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
							if (_i5 == parseInt(showList[_j2])) {
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
			return;
		} else if ('kexuanwanfa' == key) {
			// if('sss_dr' == this.gameType || 'sss_zz' == this.gameType){
			//     if(toggleIndex == 0){
			//         this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
			//         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
			//     }
			//     else if(toggleIndex == 1){
			//         this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
			//         this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			//     }
			// }
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
		if (this.Toggles["hufa"]) {
			if (this.Toggles["leixing"][0].getChildByName("checkmark").active) {
				this.Toggles["hufa"][0].active = true;
				this.Toggles["hufa"][1].active = true;
				this.Toggles["hufa"][2].active = true;
			} else {
				var toggles = this.Toggles["hufa"][0].parent;
				var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
				this.ClearToggleCheck(this.Toggles["hufa"], [1]);
				this.UpdateLabelColor(toggles, "fangfei" == key ? true : false);
				this.Toggles["hufa"][0].active = false;
				this.Toggles["hufa"][1].active = true;
				this.Toggles["hufa"][2].active = false;
			}
		}
		if (this.Toggles["gangbao"]) {
			if (this.Toggles["leixing"][0].getChildByName("checkmark").active) {
				this.Toggles["gangbao"][0].active = true;
				this.Toggles["gangbao"][1].active = true;
			} else {
				var _toggles = this.Toggles["gangbao"][0].parent;
				var _key = _toggles.name.substring('Toggles_'.length, _toggles.name.length);
				this.ClearToggleCheck(this.Toggles["gangbao"], [1]);
				this.UpdateLabelColor(_toggles, "fangfei" == _key ? true : false);
				this.Toggles["gangbao"][0].active = false;
				this.Toggles["gangbao"][1].active = true;
			}
		}
		if (this.Toggles["niaoshu"]) {
			if (this.Toggles["leixing"][0].getChildByName("checkmark").active) {
				this.Toggles["niaoshu"][0].parent.active = false;
			} else {
				this.Toggles["niaoshu"][0].parent.active = true;
			}
		}
		if (this.Toggles["kexuanwanfa"]) {
			var _toggles2 = this.Toggles["kexuanwanfa"][0].parent;
			var _key2 = _toggles2.name.substring('Toggles_'.length, _toggles2.name.length);
			if (this.Toggles["leixing"][0].getChildByName("checkmark").active && !this.isClickKeXuanWanFaMJ) {
				this.Toggles["kexuanwanfa"][4].active = true;
				this.Toggles["kexuanwanfa"][6].active = true;
				this.Toggles["kexuanwanfa"][7].active = false;
				this.ClearToggleCheck(this.Toggles["kexuanwanfa"], [1, 2, 6]);
				this.UpdateLabelColor(_toggles2, "fangfei" == _key2 ? true : false);
				this.isClickKeXuanWanFaBD = false;
				this.isClickKeXuanWanFaMJ = true;
			} else if (this.Toggles["leixing"][1].getChildByName("checkmark").active && !this.isClickKeXuanWanFaBD) {
				this.isClickKeXuanWanFaMJ = false;
				this.isClickKeXuanWanFaBD = true;
				this.ClearToggleCheck(this.Toggles["kexuanwanfa"], [1, 2, 3]);
				this.UpdateLabelColor(_toggles2, "fangfei" == _key2 ? true : false);
				this.Toggles["kexuanwanfa"][4].active = false;
				this.Toggles["kexuanwanfa"][6].active = false;
				this.Toggles["kexuanwanfa"][7].active = true;
			}
		}
		if (this.Toggles["haoqi"]) {
			if (this.Toggles["leixing"][0].getChildByName("checkmark").active && !this.Toggles["kexuanwanfa"][6].getChildByName("checkmark").active) {
				this.Toggles["haoqi"][0].parent.active = false;
			} else if (this.Toggles["leixing"][1].getChildByName("checkmark").active && !this.Toggles["kexuanwanfa"][7].getChildByName("checkmark").active) {
				this.Toggles["haoqi"][0].parent.active = false;
			} else {
				this.Toggles["haoqi"][0].parent.active = true;
			}
		}
	}
});

module.exports = szmjChildCreateRoom;

cc._RF.pop();