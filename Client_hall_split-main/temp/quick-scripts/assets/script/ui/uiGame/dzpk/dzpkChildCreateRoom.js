(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/dzpk/dzpkChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '06d939vb11C05atnCi3iwvR', 'dzpkChildCreateRoom', __filename);
// script/ui/uiGame/dzpk/dzpkChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var dzpkChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {},
	//需要自己重写
	CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
		var sendPack = {};
		var xianShi = this.GetIdxByKey('xianShi');
		var gaoji = [];
		for (var i = 0; i < this.Toggles['gaoji'].length; i++) {
			if (this.Toggles['gaoji'][i].getChildByName('checkmark').active) {
				gaoji.push(i);
			}
		}
		var moshi = this.GetIdxByKey("moshi");
		var daxiaomangjibie = this.GetIdxByKey("daxiaomangjibie");
		var qianzhu = this.GetIdxByKey("qianzhu");
		var santiaoshunzi = this.GetIdxByKey("santiaoshunzi");
		var wanfa = this.GetIdxByKey("wanfa");
		var jiesan = this.GetIdxByKey("jiesan");
		var fangjian = [];
		for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
			if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
				fangjian.push(_i);
			}
		}
		if (moshi == 0 || moshi == 2) {
			wanfa = -1;
			santiaoshunzi = -1;
		} else if (moshi == 1) {
			daxiaomangjibie = -1;
			wanfa = -1;
		} else if (moshi == 3) {
			daxiaomangjibie = -1;
			qianzhu = -1;
			santiaoshunzi = -1;
		}
		sendPack = {
			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,
			"moshi": moshi,
			"daxiaomangjibie": daxiaomangjibie,
			"qianzhu": qianzhu,
			"santiaoshunzi": santiaoshunzi,
			"wanfa": wanfa,
			"xianShi": xianShi,
			"fangjian": fangjian,
			"gaoji": gaoji,
			"jiesan": jiesan,
			"sign": 0
		};
		return sendPack;
	},
	UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode) {
		var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		if (this.Toggles["wanfa"] && this.Toggles["moshi"][0].getChildByName("checkmark").active) {
			//0局
			this.Toggles["qianzhu"][0].parent.active = true;
			this.Toggles["daxiaomangjibie"][0].parent.active = true;
			if (this.Toggles["daxiaomangjibie"][0].getChildByName("checkmark").active) {
				for (var i = 0; i < this.Toggles["qianzhu"].length; i++) {
					if (i == 0 || i == 1 || i == 2) {
						this.Toggles["qianzhu"][i].active = true;
					} else {
						this.Toggles["qianzhu"][i].active = false;
						this.Toggles["qianzhu"][i].getChildByName("checkmark").active = false;
					}
				}
				if (!this.Toggles["qianzhu"][0].getChildByName("checkmark").active && !this.Toggles["qianzhu"][1].getChildByName("checkmark").active && !this.Toggles["qianzhu"][2].getChildByName("checkmark").active) {
					var index = this.ComTool.RandInt(0, 2);
					this.Toggles["qianzhu"][index].getChildByName("checkmark").active = true;
				}
			}
			if (this.Toggles["daxiaomangjibie"][1].getChildByName("checkmark").active) {
				for (var _i2 = 0; _i2 < this.Toggles["qianzhu"].length; _i2++) {
					if (_i2 == 0 || _i2 == 1 || _i2 == 2 || _i2 == 4) {
						this.Toggles["qianzhu"][_i2].active = true;
					} else {
						this.Toggles["qianzhu"][_i2].active = false;
						this.Toggles["qianzhu"][_i2].getChildByName("checkmark").active = false;
					}
				}
				if (!this.Toggles["qianzhu"][0].getChildByName("checkmark").active && !this.Toggles["qianzhu"][1].getChildByName("checkmark").active && !this.Toggles["qianzhu"][2].getChildByName("checkmark").active && !this.Toggles["qianzhu"][4].getChildByName("checkmark").active) {
					var _index = this.ComTool.RandInt(0, 2);
					this.Toggles["qianzhu"][_index].getChildByName("checkmark").active = true;
				}
			}
			if (this.Toggles["daxiaomangjibie"][2].getChildByName("checkmark").active) {
				for (var _i3 = 0; _i3 < this.Toggles["qianzhu"].length; _i3++) {
					if (_i3 == 0 || _i3 == 1 || _i3 == 3 || _i3 == 6) {
						this.Toggles["qianzhu"][_i3].active = true;
					} else {
						this.Toggles["qianzhu"][_i3].active = false;
						this.Toggles["qianzhu"][_i3].getChildByName("checkmark").active = false;
					}
				}
				if (!this.Toggles["qianzhu"][0].getChildByName("checkmark").active && !this.Toggles["qianzhu"][1].getChildByName("checkmark").active && !this.Toggles["qianzhu"][3].getChildByName("checkmark").active && !this.Toggles["qianzhu"][6].getChildByName("checkmark").active) {
					var _index2 = this.ComTool.RandInt(0, 1);
					this.Toggles["qianzhu"][_index2].getChildByName("checkmark").active = true;
				}
			}
			if (this.Toggles["daxiaomangjibie"][3].getChildByName("checkmark").active) {
				for (var _i4 = 0; _i4 < this.Toggles["qianzhu"].length; _i4++) {
					if (_i4 == 0 || _i4 == 1 || _i4 == 4 || _i4 == 7) {
						this.Toggles["qianzhu"][_i4].active = true;
					} else {
						this.Toggles["qianzhu"][_i4].active = false;
						this.Toggles["qianzhu"][_i4].getChildByName("checkmark").active = false;
					}
				}
				if (!this.Toggles["qianzhu"][0].getChildByName("checkmark").active && !this.Toggles["qianzhu"][1].getChildByName("checkmark").active && !this.Toggles["qianzhu"][4].getChildByName("checkmark").active && !this.Toggles["qianzhu"][7].getChildByName("checkmark").active) {
					var _index3 = this.ComTool.RandInt(0, 1);
					this.Toggles["qianzhu"][_index3].getChildByName("checkmark").active = true;
				}
			}
			this.Toggles["wanfa"][0].parent.active = false;
			this.Toggles["santiaoshunzi"][0].parent.active = false;
		}
		if (this.Toggles["wanfa"] && this.Toggles["moshi"][1].getChildByName("checkmark").active) {
			//1局
			this.Toggles["qianzhu"][0].parent.active = true;
			for (var _i5 = 0; _i5 < this.Toggles["qianzhu"].length; _i5++) {
				this.Toggles["qianzhu"][_i5].active = true;
			}

			this.Toggles["wanfa"][0].parent.active = false;
			this.Toggles["daxiaomangjibie"][0].parent.active = false;
			this.Toggles["santiaoshunzi"][0].parent.active = true;
		}
		if (this.Toggles["wanfa"] && this.Toggles["moshi"][2].getChildByName("checkmark").active) {
			//2局
			this.Toggles["qianzhu"][0].parent.active = true;
			this.Toggles["daxiaomangjibie"][0].parent.active = true;
			if (this.Toggles["daxiaomangjibie"][0].getChildByName("checkmark").active) {
				for (var _i6 = 0; _i6 < this.Toggles["qianzhu"].length; _i6++) {
					if (_i6 == 0) {
						this.Toggles["qianzhu"][_i6].getChildByName("checkmark").active = true;
						this.Toggles["qianzhu"][_i6].active = true;
					} else {
						this.Toggles["qianzhu"][_i6].getChildByName("checkmark").active = false;
						this.Toggles["qianzhu"][_i6].active = false;
					}
				}
			} else if (this.Toggles["daxiaomangjibie"][1].getChildByName("checkmark").active || this.Toggles["daxiaomangjibie"][2].getChildByName("checkmark").active || this.Toggles["daxiaomangjibie"][3].getChildByName("checkmark").active) {
				for (var _i7 = 0; _i7 < this.Toggles["qianzhu"].length; _i7++) {
					if (_i7 == 0 || _i7 == 1) {
						this.Toggles["qianzhu"][_i7].active = true;
					} else {
						this.Toggles["qianzhu"][_i7].active = false;
						this.Toggles["qianzhu"][_i7].getChildByName("checkmark").active = false;
					}
				}
				if (!this.Toggles["qianzhu"][0].getChildByName("checkmark").active && !this.Toggles["qianzhu"][1].getChildByName("checkmark").active) {
					var _index4 = this.ComTool.RandInt(0, 1);
					this.Toggles["qianzhu"][_index4].getChildByName("checkmark").active = true;
				}
			}
			this.Toggles["wanfa"][0].parent.active = false;
			this.Toggles["santiaoshunzi"][0].parent.active = false;
		}
		if (this.Toggles["wanfa"] && this.Toggles["moshi"][3].getChildByName("checkmark").active) {
			//3局
			this.Toggles["wanfa"][0].parent.active = true;
			this.Toggles["santiaoshunzi"][0].parent.active = false;
			this.Toggles["qianzhu"][0].parent.active = false;
			this.Toggles["daxiaomangjibie"][0].parent.active = false;
		}
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
							for (var _i8 = 0; _i8 < this.Toggles['jushu'].length; _i8++) {
								var mark = this.Toggles['jushu'][_i8].getChildByName('checkmark').active;
								if (mark) {
									jushuIndex = _i8;
									break;
								}
								jushuIndex++;
							}
							for (var _i9 = 0; _i9 < curCostData.length; _i9++) {
								this.Toggles['jushu'][_i9].getChildByName('label').getComponent(cc.Label).string = curCostData[_i9].SetCount + '局';
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
						for (var _i10 = 0; _i10 < TogglesNode.children.length; _i10++) {
							if (TogglesNode.children[_i10].name.startsWith('Toggle')) {
								TogglesNode.children[_i10].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
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
			for (var _i11 = 0; _i11 < this.Toggles["gaoji"].length; _i11++) {
				var ToggleDesc = this.Toggles["gaoji"][_i11].getChildByName("label").getComponent(cc.Label).string;
				if (ToggleDesc == "30秒未准备自动踢出房间") {
					if (!this.clubData && !this.unionData) {
						this.Toggles["gaoji"][_i11].active = false;
						this.Toggles["gaoji"][_i11].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
						break;
					} else {
						this.Toggles["gaoji"][_i11].active = true;
						//this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
						break;
					}
				}
			}
		} else if (this.Toggles["kexuanwanfa"]) {
			for (var _i12 = 0; _i12 < this.Toggles["kexuanwanfa"].length; _i12++) {
				var _ToggleDesc = this.Toggles["kexuanwanfa"][_i12].getChildByName("label").getComponent(cc.Label).string;
				if (_ToggleDesc == "比赛分不能低于0") {
					if (!this.clubData && !this.unionData) {
						this.Toggles["kexuanwanfa"][_i12].active = false;
						this.Toggles["kexuanwanfa"][_i12].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
						break;
					} else {
						this.Toggles["kexuanwanfa"][_i12].active = true;
						//this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
						break;
					}
				}
			}
		}
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
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key || 'daxiaomangjibie' == key || 'moshi' == key) {
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
	}
});

module.exports = dzpkChildCreateRoom;

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
        //# sourceMappingURL=dzpkChildCreateRoom.js.map
        