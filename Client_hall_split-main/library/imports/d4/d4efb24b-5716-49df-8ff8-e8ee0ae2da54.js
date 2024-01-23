"use strict";
cc._RF.push(module, 'd4efbJLVxZJ34/46O4K4tpU', 'xinsssChildCreateRoom');
// script/ui/uiGame/xinsss/xinsssChildCreateRoom.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
创建房间子界面
 */
var app = require("app");

var xinsssChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	InitBase: function InitBase(clubData, unionData, gameType) {
		this.roomcostConfig = app.SysDataManager().GetTableDict("roomcost");
		this.gameCreateConfig = app.SysDataManager().GetTableDict("gameCreate");
		this.LocalDataManager = app.LocalDataManager();
		this.FormManager = app.FormManager();
		this.ComTool = app.ComTool();

		this.RedColor1 = new cc.Color(0, 155, 46);
		this.RedColor2 = new cc.Color(182, 64, 12);
		this.WhiteClolor = new cc.Color(79, 79, 79);

		this.gameType = gameType;
		this.Toggles = {};
		this.clubData = clubData;
		this.unionData = unionData;

		this.node_RightLayout = this.node.getChildByName("mark").getChildByName("layout");
		this.scroll_Right = this.node.getChildByName("mark").getComponent(cc.ScrollView);
		this.scroll_Right.node.on(cc.Node.EventType.TOUCH_END, this.OnScrollEnded, this);

		this.prefab_Toggles = this.node.getChildByName("ToggleGroup2Item");
		this.scrollTip = this.node.getChildByName("scrollTip");

		if (!this.clubData || 0 == this.clubData.gameIndex) {
			this.node.getChildByName("btn_create").active = true;
			this.node.getChildByName("btn_save").active = false;
		} else {
			this.node.getChildByName("btn_create").active = false;
			this.node.getChildByName("btn_save").active = true;
		}

		//赛事的
		if (this.unionData) {
			this.node.getChildByName("btn_help").active = false;
			this.node.getChildByName("btn_create").active = false;
			this.node.getChildByName("btn_save").active = false;
			this.node.getChildByName("btn_next").active = true;
			this.node.getChildByName("tip").active = false;
		}

		this.node.getChildByName("btn_help").on("click", this.OnClickBtnHelp, this);
		this.node.getChildByName("btn_create").on("click", this.OnClickBtnCreate, this);
		this.node.getChildByName("btn_save").on("click", this.OnClickBtnCreate, this);
		this.node.getChildByName("btn_next").on("click", this.OnClickBtnNext, this);
		this.addPrefabWidth = 210;
		this.rightPrefabSpacing = this.node_RightLayout.getComponent(cc.Layout).spacingY;

		cc.find('mark', this.node).on(cc.Node.EventType.TOUCH_START, this.OnRightBgClick, this);
		this.sign = 1;
		this.disCount = -1;
		this.isGetDiscount = false;
		this.GetRoomCostByDiscount();
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
			if (this.gameType == this.gameCreateConfig[key]["GameName"]) {
				var node = null;
				var dataKey = this.gameCreateConfig[key]["Key"];
				var toggleCount = this.gameCreateConfig[key]["ToggleCount"];
				var AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
				var spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
				if (this.clubData && "fangfei" == dataKey) {
					toggleCount = 3; //一个管理付，一个大赢家付
					AtRows = [1, 1, 2];
					console.log("一个管理付，一个大赢家付", this.gameCreateConfig[key]);
				} else if (this.unionData && "fangfei" == dataKey) {
					toggleCount = 1; //一个盟主付`
					AtRows = [1];
					console.log("一个盟主付`", this.gameCreateConfig[key]);
				}
				node = cc.instantiate(this.prefab_Toggles);
				node.active = true;
				//需要判断添更加多的Toggle
				var addCount = toggleCount - 1;
				if (addCount < 0) {
					this.ErrLog('gameCreate Config ToggleCount error');
				} else {
					for (var i = 2; i <= toggleCount; i++) {
						var prefabNode = node.getChildByName('Toggle1');
						var newNode = cc.instantiate(prefabNode);
						newNode.name = 'Toggle' + i;
						node.addChild(newNode);
					}
				}

				node.name = "Toggles_" + dataKey;
				node.x = 10;
				/*let nodeHelp = node.getChildByName("btn_help");
    nodeHelp.active = false;
    if (this.gameCreateConfig[key].IsShowHelp) {
    	nodeHelp.name = "btn_help0" + helpIndex;
    	nodeHelp.on("click", this.OnHelpBtnClick, this);
    	nodeHelp.active = true;
    	helpIndex++;
    }*/

				if (!this.Toggles[dataKey]) {
					this.Toggles[dataKey] = [];
				}

				var fristPos = { x: 0, y: 0 };
				var lastPos = { x: 0, y: 0 };
				for (var _i = 1; _i <= toggleCount; _i++) {
					var curNode = node.getChildByName("Toggle" + _i);
					curNode.isFirstNode = false;
					if (curNode) {
						//位置宽高设置下
						//记录下第一个的位置方便换行
						if (1 == _i) {
							fristPos.x = curNode.x;
							fristPos.y = curNode.y;
							lastPos.x = curNode.x;
							lastPos.y = curNode.y;
							curNode.isFirstNode = true;
						} else if (1 < _i) {
							//第1个以后都是新增的
							if (AtRows[_i - 2] != AtRows[_i - 1]) {
								curNode.x = fristPos.x;
								curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
								node.height = node.height + curNode.height + this.rightPrefabSpacing;
								curNode.isFirstNode = true;
							} else {
								curNode.x = lastPos.x + parseInt(spacing[_i - 1]);
								curNode.y = lastPos.y;
							}
						}
						lastPos.x = curNode.x;
						lastPos.y = curNode.y;

						curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
						var checkNode = curNode.getChildByName("checkmark");
						var icon_selectBg = curNode.getChildByName("icon_selectBg");
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
						if (this.unionData) {
							unionId = this.unionData.unionId;
							unionRoomKey = this.unionData.roomKey;
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
						}
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
						if (this.clubData && "fangfei" == dataKey) showList = [1];
						if (this.unionData && "fangfei" == dataKey) showList = [1];

						//尝试获取缓存
						if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length) {
							this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');
						}

						if (1 == this.gameCreateConfig[key].ToggleType) {
							//多选的图片设置下(不放上面是因为路径)
							var imgPath = "texture/ui/createRoom/icon_checkin02";
							node.addComponent(cc.Toggle);
							this.SetNodeImageByFilePath(checkNode, imgPath);
							this.SetNodeImageByFilePath(icon_selectBg, "texture/ui/createRoom/icon_check02");
						}

						for (var _j = 0; _j < showList.length; _j++) {
							if (_i == parseInt(showList[_j])) {
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
				var line = this.scroll_Right.node.getChildByName("line");
				var addline = cc.instantiate(line);
				addline.active = true;
				this.node_RightLayout.addChild(addline);
			}
		}
		this.ShowTogglesBySign();
		this.setHelpBtnPos();
		this.scroll_Right.scrollToTop();
		//如果可以滚动，显示滚动提示节点
		if (this.node_RightLayout.height > this.scroll_Right.node.height) {
			this.scrollTip.active = true;
		} else {
			this.scrollTip.active = false;
		}
	},
	UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode, isResetPos) {
		var curKey = TogglesNode.name.substring("Toggles_".length, TogglesNode.name.length);
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
					if ("jushu" != curKey) {
						//局数读roomcost
						descList = this.gameCreateConfig[key].ToggleDesc.split(',');
						if (this.clubData && "fangfei" == curKey) {
							descList = ["管理付"];
						} else if (this.unionData && "fangfei" == curKey) {
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
					if ("renshu" == curKey || "fangfei" == curKey || "jushu" == curKey || "leixing" == curKey) {
						var publicCosts = this.getCostData(renshu);
						if (this.Toggles["renshu"]) {
							renshu = this.getCurSelectRenShu();
						}
						var SpiltCosts = this.getCostData(renshu);
						var curCostData = null;
						if (0 == renshu.length) {
							curCostData = publicCosts;
						} else {
							curCostData = SpiltCosts;
						}
						if (this.Toggles["jushu"]) {
							jushuIndex = 0;
							for (var i = 0; i < this.Toggles["jushu"].length; i++) {
								var mark = this.Toggles["jushu"][i].getChildByName("checkmark").active;
								if (mark) {
									jushuIndex = i;
									break;
								}
								jushuIndex++;
							}
							for (var _i2 = 0; _i2 < curCostData.length; _i2++) {
								this.Toggles["jushu"][_i2].getChildByName("label").getComponent(cc.Label).string = curCostData[_i2].SetCount + '局';
							}
						}
						if (this.Toggles["fangfei"] && -1 != jushuIndex) {
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
					if ("jushu" != curKey) {
						var descInde = 0;
						for (var _i3 = 0; _i3 < TogglesNode.children.length; _i3++) {
							if (TogglesNode.children[_i3].name.startsWith("Toggle")) {
								TogglesNode.children[_i3].getChildByName("label").getComponent(cc.Label).string = descList[descInde];
								descInde++;
							}
						}
					}

					if (0 != AAfangfeiDatas.length) {
						var needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
						var ffNodes = this.Toggles["fangfei"];
						var hasHideNode = false;
						var spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
						for (var s = 0; s < ffNodes.length; s++) {
							var needNode = ffNodes[s].getChildByName("fangfeiNode");
							needNode.active = true;
							if (hasHideNode && !needNode.parent.isFirstNode && isResetPos) {
								needNode.parent.x = needNode.parent.x - spacing[s] - 80;
								hasHideNode = false;
							}
							//如果房费配的是0，则隐藏
							if (needCount <= 0 && 1 == s || needCount <= 0 && 2 == s) {
								//
								needNode.parent.active = false;
								hasHideNode = true;
								console.log("如果房费配的是0，则隐藏", ffNodes);
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
	},
	//创建房间
	Click_btn_create: function Click_btn_create(createType) {
		this.FormManager.CloseForm("UIMessageTip");
		var isSpiltRoomCard = this.GetIdxByKey('fangfei');
		var renshu = [];
		if (isSpiltRoomCard) {
			renshu = this.getCurSelectRenShu();
		}
		renshu = this.getCurSelectRenShu(); //发给服务器人数用选的
		var needCostData = this.getCostData(renshu);
		if (!needCostData) {
			this.ErrLog('Click_btn_create Not CostData');
			return null;
		}
		var hasRoomCard = app.HeroManager().GetHeroProperty("roomCard");

		var jushuIndex = this.GetIdxByKey('jushu');
		if (-1 == jushuIndex || jushuIndex >= needCostData.length) {
			this.ErrLog('Click_btn_create error -1 == jushuIndex || jushuIndex >= needCostData.length');
			return null;
		}
		var costCoun = 0;
		if (isSpiltRoomCard == 0) {
			//房主付
			costCoun = needCostData[jushuIndex].CostCount;
		} else if (isSpiltRoomCard == 1) {
			//AA付
			costCoun = needCostData[jushuIndex].AaCostCount;
		} else if (isSpiltRoomCard == 2) {
			//大赢家付
			costCoun = needCostData[jushuIndex].WinCostCount;
		}
		if (this.clubData == null) {
			if (hasRoomCard < costCoun) {
				//金币不足
				var desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
				app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
				app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, desc);
				return null;
			}
		}
		var setCount = needCostData[jushuIndex].SetCount;
		var sendPack = this.CreateSendPack(renshu, setCount, isSpiltRoomCard);
		//记录到本地缓存
		for (var item in sendPack) {
			var configData = sendPack[item];
			var dataType = typeof configData === "undefined" ? "undefined" : _typeof(configData);
			if (dataType == 'object') {
				var linshi2 = '0';
				for (var i = 0; i < configData.length; i++) {
					if (i == 0) {
						linshi2 = configData[0] + 1;
					} else {
						linshi2 = linshi2 + ',' + (configData[i] + 1);
					}
				}
				configData = linshi2;
			} else {
				if (item == 'playerNum') {
					item = 'renshu';
				} else if (item == 'setCount') {
					item = 'jushu';
				} else if (item == 'paymentRoomCardType') {
					item = 'fangfei';
				} else if (item == 'cardNum') {
					item = 'shoupai';
				} else if (item == 'resultCalc') {
					item = 'jiesuan';
				} else if (item == 'maxAddDouble') {
					item = 'fengdingbeishu';
				} else if (item == 'sign') {
					item = 'leixing';
				}
				configData = this.GetIdxByKey(item) + 1;
			}
			var clubId = 0;
			var roomKey = '0';
			var unionId = 0;
			var unionRoomKey = "0";
			if (this.clubData) {
				clubId = this.clubData.clubId;
				roomKey = this.clubData.gameIndex;
			}
			if (this.unionData) {
				unionId = this.unionData.unionId;
				unionRoomKey = this.unionData.roomKey;
			}
			if (item == 'kexuanwanfa' && "pdk_lyfj" == this.gameType) {
				var configData2 = [];
				for (var _i4 = 0; _i4 < this.Toggles['kexuanwanfa'].length; _i4++) {
					var isCheck = this.Toggles['kexuanwanfa'][_i4].getChildByName('checkmark').active;
					if (isCheck) {
						configData2.push(_i4 + 1);
					}
				}
				//本地保存必须是字符串（真机上不支持别的类型）
				var localStr = '1';
				for (var _i5 = 0; _i5 < configData2.length; _i5++) {
					if (_i5 == 0) {
						localStr = configData2[0].toString();
					} else {
						localStr = localStr + ',' + configData2[_i5];
					}
				}
				this.SetLocalConfig(item, localStr, clubId, roomKey, unionId, unionRoomKey);
			} else {
				this.SetLocalConfig(item, configData, clubId, roomKey, unionId, unionRoomKey);
			}
		}

		if (1 == createType || 3 == createType) {
			if (this.clubData) {
				sendPack.clubId = this.clubData.clubId;
				sendPack.gameIndex = this.clubData.gameIndex;
				if (this.clubData != null) {
					if (isSpiltRoomCard == 0) {
						this.clubWinnerPayConsume = 0;
					} else if (isSpiltRoomCard == 1) {
						var default1 = this.Toggles['fangfei'][1].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
						var new1 = parseInt(this.Toggles['fangfei'][1].getChildByName('editbox').getComponent(cc.EditBox).string);
						if (new1 > 0 && new1 > default1) {
							this.clubWinnerPayConsume = new1;
						} else {
							this.clubWinnerPayConsume = default1;
						}
					} else if (isSpiltRoomCard == 2) {
						var default2 = this.Toggles['fangfei'][2].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
						var new2 = parseInt(this.Toggles['fangfei'][2].getChildByName('editbox').getComponent(cc.EditBox).string);
						if (new2 > 0 && new2 > default2) {
							this.clubWinnerPayConsume = new2;
						} else {
							this.clubWinnerPayConsume = default2;
						}
					}
				} else {
					this.clubWinnerPayConsume = 0;
				}
				sendPack.clubWinnerPayConsume = this.clubWinnerPayConsume;
				if (this.clubWinnerPayConsume > 0) {
					sendPack.clubCostType = 1;
				} else {
					sendPack.clubCostType = 0;
				}
				createType = 3;
			}
		}
		sendPack.createType = createType;
		var realGameType = this.gameType;
		if (this.gameType == "sss_zz" || this.gameType == "sss_dr") {
			realGameType = "sss";
		}
		var gameId = app.ShareDefine().GametTypeNameDict[realGameType.toUpperCase()];
		sendPack.gameType = gameId;
		app.Client.SetGameType(realGameType);
		this.LocalDataManager.SetConfigProperty("SysSetting", "LastGameType", this.gameType);
		if (this.unionData) {
			var tempObj = {
				"realGameType": realGameType,
				"sendPack": sendPack
			};
			return tempObj;
		} else {
			app.Client.CreateRoomCheckSubGame(realGameType, sendPack);
		}

		// if(!cc.sys.isNative){
		//     let self = this;
		//     app.NetManager().SendPack("room.CBaseCreateRoom", sendPack, function(event){
		//         app.SysNotifyManager().ShowSysMsg("创建房间成功",[],3);
		//     }, function(event){
		//         app.SysNotifyManager().ShowSysMsg("创建房间失败",[],3);
		//     });
		// }
	},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var kexuanwanfa = [];
		for (var i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
			if (this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active) {
				kexuanwanfa.push(i);
			}
		}
		var fangjian = [];
		for (var _i6 = 0; _i6 < this.Toggles["fangjian"].length; _i6++) {
			if (this.Toggles["fangjian"][_i6].getChildByName("checkmark").active) {
				fangjian.push(_i6);
			}
		}

		//打枪倍数
		var daqiang = this.GetIdxByKey("daqiang");
		//模式
		var moshi = this.GetIdxByKey("moshi");
		//王牌
		var wangpai = this.GetIdxByKey("wangpai");
		//底分
		var difen = this.GetIdxByKey("difen");
		//限时
		var xianShi = this.GetIdxByKey("xianShi");
		//解散
		var jiesan = this.GetIdxByKey("jiesan");
		var yise = wangpai == 4;
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"sign": this.sign,
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"kexuanwanfa": kexuanwanfa,
			"fangjian": fangjian,
			"moshi": moshi,
			"wangpai": [2, 4, 6, 8, 2][wangpai],
			"daqiang": daqiang,
			"difen": difen,
			"yise": yise,
			"xianShi": xianShi,
			"jiesan": jiesan
		};
		return sendPack;
	},
	getCostData: function getCostData(renshu) {
		//renshu =0 房主支付
		var costs = [];
		if (renshu.length != 2) {
			return costs;
		}
		var allSelectCityData = app.HeroManager().GetCurSelectCityData();
		var curselectId = allSelectCityData[0]['selcetId'];
		if (this.clubData != null) {
			curselectId = this.clubData.cityId;
		} else if (this.unionData != null) {
			curselectId = this.unionData.cityId;
		}
		var sign = this.sign;
		for (var key in this.roomcostConfig) {
			//先匹配是否是当前城市，key的前7位是城市id
			// console.log("key city === " + parseInt(key.substring(0, 7)));
			// console.log("curselectId === " + curselectId);
			if (parseInt(key.substring(0, 7)) != curselectId) {
				continue;
			};
			if (this.gameType.toUpperCase() == this.roomcostConfig[key]["GameType"] && parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin && parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax && sign == this.roomcostConfig[key]["Sign"]) {
				costs.push(this.roomcostConfig[key]);
			}
		}
		if (0 == costs.length) {
			console.log("roomcost Config error");
		}
		return costs;
	},

	ShowTogglesBySign: function ShowTogglesBySign() {
		var isClick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		//只有经典场
		this.sign = 1;
		this.Toggles["leixing"][0].getChildByName("checkmark").active = true;
		this.Toggles["leixing"][0].active = true;
		this.Toggles["leixing"][1].active = false;
		this.Toggles["leixing"][2].active = false;
	},
	OnToggleClick: function OnToggleClick(event) {
		this.FormManager.CloseForm("UIMessageTip");
		var toggles = event.target.parent;
		var toggle = event.target;
		var key = toggles.name.substring("Toggles_".length, toggles.name.length);
		var toggleIndex = parseInt(toggle.name.substring("Toggle".length, toggle.name.length)) - 1;
		var needClearList = [];
		var needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ("jushu" == key || "renshu" == key || "fangfei" == key) {
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			return;
		} else if ("leixing" == key) {
			this.sign = 1;
			this.UpdateTogglesLabel(toggles);
			this.ShowTogglesBySign(true);
		}
		if (toggles.getComponent(cc.Toggle)) {
			//复选框
			needShowIndexList = [];
			for (var i = 0; i < needClearList.length; i++) {
				var mark = needClearList[i].getChildByName("checkmark").active;
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
		this.UpdateLabelColor(toggles, "fangfei" == key ? true : false);
	}
});

module.exports = xinsssChildCreateRoom;

cc._RF.pop();