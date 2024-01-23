"use strict";
cc._RF.push(module, 'eb316+8OqVNIp7b0eVHoVAr', 'mmmjChildCreateRoom');
// script/ui/uiGame/mmmj/mmmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var gamjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    // CreateSendPack -start-
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var maima = this.GetIdxByKey('maima');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "maima": maima,
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
    // CreateSendPack -end-


    UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode) {
        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // 	勾选“无鬼”玩法，不能勾选“无鬼加倍”和“碰碰胡4分”；
        // 	勾选“白板翻倍”或“翻鬼”，才能勾选“四鬼加倍”； 
        // 	勾选无奖马时，不能勾选“马跟底分”“马跟杠”；
        // 	勾选“不带风”，不能勾选“幺九8分”“十三幺”；		
        if (this.Toggles["kexuanwanfa"]) {
            // 	勾选“无鬼”玩法，不能勾选“无鬼加倍”和“碰碰胡4分”；
            if (this.Toggles["guipai"][0].getChildByName("checkmark").active) {
                // 勾选“无鬼”玩法
                this.Toggles["kexuanwanfa"][0].active = false; // 碰碰胡4分
                this.Toggles["kexuanwanfa"][12].active = false; // 无鬼加倍
            } else {
                this.Toggles["kexuanwanfa"][0].active = true;
                this.Toggles["kexuanwanfa"][12].active = true;
            }
            // 	勾选“白板翻倍”或“翻鬼”，才能勾选“四鬼加倍”； 
            if (this.Toggles["guipai"][1].getChildByName("checkmark").active || this.Toggles["guipai"][2].getChildByName("checkmark").active) {
                // 勾选“白板翻倍”或“翻鬼”
                this.Toggles["kexuanwanfa"][13].active = true; // 四鬼加倍
            } else {
                this.Toggles["kexuanwanfa"][13].active = false;
            }
            // 	勾选无奖马时，不能勾选“马跟底分”“马跟杠”；
            if (this.Toggles["jiangma"][0].getChildByName("checkmark").active) {
                // 勾选无奖马时
                this.Toggles["kexuanwanfa"][14].active = false; // 马跟底分
                this.Toggles["kexuanwanfa"][15].active = false; // 马跟杠
            } else {
                this.Toggles["kexuanwanfa"][14].active = true; // 马跟底分
                this.Toggles["kexuanwanfa"][15].active = true; // 马跟杠
            }
            // 	勾选“不带风”，不能勾选“幺九8分”“十三幺”；		
            if (this.Toggles["kexuanwanfa"][11].getChildByName("checkmark").active) {
                // 勾选“不带风”
                this.Toggles["kexuanwanfa"][6].active = false; // 幺九8分
                this.Toggles["kexuanwanfa"][5].active = false; // 十三幺
            } else {
                this.Toggles["kexuanwanfa"][6].active = true; // 幺九8分
                this.Toggles["kexuanwanfa"][5].active = true; // 十三幺
            }
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
                            for (var i = 0; i < this.Toggles['jushu'].length; i++) {
                                var mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
                                if (mark) {
                                    jushuIndex = i;
                                    break;
                                }
                                jushuIndex++;
                            }
                            for (var _i = 0; _i < curCostData.length; _i++) {
                                this.Toggles['jushu'][_i].getChildByName('label').getComponent(cc.Label).string = curCostData[_i].SetCount + '局';
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
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key || "zhuaniao" == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ("guipai" == key) {
            // 	勾选“无鬼”玩法，不能勾选“无鬼加倍”和“碰碰胡4分”；
            if (toggleIndex == 0) {
                // 勾选“无鬼”玩法
                this.Toggles['kexuanwanfa'][0].active = false;
                this.Toggles['kexuanwanfa'][12].active = false;
            } else {
                this.Toggles['kexuanwanfa'][0].active = true;
                this.Toggles['kexuanwanfa'][12].active = true;
            }

            // 	勾选“白板翻倍”或“翻鬼”，才能勾选“四鬼加倍”； 
            if (toggleIndex == 1 || toggleIndex == 2) {
                // 勾选“白板翻倍”或“翻鬼”
                this.Toggles['kexuanwanfa'][13].active = true;
            } else {
                this.Toggles['kexuanwanfa'][13].active = false;
            }

            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][12].parent);
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][13].parent);
        } else if ("jiangma" == key) {
            // 	勾选无奖马时，不能勾选“马跟底分”“马跟杠”；
            if (toggleIndex == 0) {
                this.Toggles['kexuanwanfa'][14].active = false;
                this.Toggles['kexuanwanfa'][15].active = false;
            } else {
                this.Toggles['kexuanwanfa'][14].active = true;
                this.Toggles['kexuanwanfa'][15].active = true;
            }
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][14].parent);
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][15].parent);
        } else if ('kexuanwanfa' == key) {
            // 	勾选“不带风”，不能勾选“幺九8分”“十三幺”
            if (toggleIndex == 11 && !this.Toggles['kexuanwanfa'][11].getChildByName('checkmark').active) {
                this.Toggles['kexuanwanfa'][6].active = false;
                this.Toggles['kexuanwanfa'][5].active = false;
            } else {
                this.Toggles['kexuanwanfa'][6].active = true;
                this.Toggles['kexuanwanfa'][5].active = true;
            }
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][5].parent);
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][6].parent);
        } else {}
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
    },

    AdjustSendPack: function AdjustSendPack(sendPack) {
        // n 不可吃：仅限2人场可选，勾选后，不能吃牌；
        // if (sendPack.playerNum != 2) {
        // 	var index = sendPack.kexuanwanfa.indexOf(1);
        // 	if (-1 != index) {
        // 		sendPack.kexuanwanfa.splice(index, 1);
        // 	}
        // }

        // if (sendPack.zhuaniao == 2) {// 不抓
        // 	sendPack.niaoshu = -1;
        // 	sendPack.niaofen = -1;
        // }

        return sendPack;
    },

    /**
     * 多选
     */
    GetIdxsByKey: function GetIdxsByKey(key) {
        if (!this.Toggles[key]) {
            return [];
        }

        var arr = [];
        for (var i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    }

});

module.exports = gamjChildCreateRoom;

cc._RF.pop();