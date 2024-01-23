(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/glwsk/glwskChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fd0fbkT1W9Po5ieTnqop9sk', 'glwskChildCreateRoom', __filename);
// script/ui/uiGame/glwsk/glwskChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var yongpai = this.GetIdxByKey('yongpai');
        var fenshu = this.GetIdxByKey('fenshu');
        var fenzu = this.GetIdxByKey('fenzu');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "yongpai": yongpai,
            "fenshu": fenshu,
            "fenzu": fenzu,
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
            if ('renshu' == key) {
                if (toggleIndex == 0) {
                    if (!this.Toggles["yongpai"][2].getChildByName("checkmark").active) {
                        this.Toggles["yongpai"][2].getChildByName("checkmark").active = true;
                        this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
                        this.Toggles["yongpai"][0].getChildByName("checkmark").active = false;
                        var _toggles = this.Toggles["yongpai"][0].parent;
                        this.UpdateLabelColor(_toggles);
                        if (!this.Toggles["fenshu"][0].getChildByName("checkmark").active) {
                            this.Toggles["fenshu"][0].getChildByName("checkmark").active = true;
                            this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
                            this.Toggles["fenshu"][2].getChildByName("checkmark").active = false;
                            var _toggles2 = this.Toggles["fenshu"][0].parent;
                            this.UpdateLabelColor(_toggles2);
                        }
                    }
                    if (!this.Toggles["fenzu"][0].getChildByName("checkmark").active) {
                        this.Toggles["fenzu"][2].getChildByName("checkmark").active = false;
                        this.Toggles["fenzu"][1].getChildByName("checkmark").active = false;
                        this.Toggles["fenzu"][0].getChildByName("checkmark").active = true;
                        var _toggles3 = this.Toggles["fenzu"][0].parent;
                        this.UpdateLabelColor(_toggles3);
                    }
                } else {
                    if (this.Toggles["yongpai"][2].getChildByName("checkmark").active) {
                        this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
                        this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
                        this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
                        var _toggles4 = this.Toggles["yongpai"][0].parent;
                        this.UpdateLabelColor(_toggles4);
                        if (this.Toggles["fenshu"][0].getChildByName("checkmark").active) {
                            this.Toggles["fenshu"][0].getChildByName("checkmark").active = false;
                            this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
                            this.Toggles["fenshu"][2].getChildByName("checkmark").active = true;
                            var _toggles5 = this.Toggles["fenshu"][0].parent;
                            this.UpdateLabelColor(_toggles5);
                        }
                    }
                }
            }
            this.UpdateOnClickToggle();
            return;
        } //用牌数量
        else if ('yongpai' == key) {
                //如果点了一副牌
                if (toggleIndex == 2) {
                    //如果人数为4人
                    if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                        this.Toggles["renshu"][0].getChildByName("checkmark").active = true;
                        this.Toggles["renshu"][1].getChildByName("checkmark").active = false;
                        var _toggles6 = this.Toggles["renshu"][0].parent;
                        this.UpdateLabelColor(_toggles6);
                        if (!this.Toggles["fenzu"][0].getChildByName("checkmark").active) {
                            this.Toggles["fenzu"][0].getChildByName("checkmark").active = true;
                            this.Toggles["fenzu"][1].getChildByName("checkmark").active = false;
                            this.Toggles["fenzu"][2].getChildByName("checkmark").active = false;
                            var _toggles7 = this.Toggles["fenzu"][0].parent;
                            this.UpdateLabelColor(_toggles7);
                        }
                    }
                    //如果分数不为400分
                    if (!this.Toggles["fenshu"][0].getChildByName("checkmark").active) {
                        this.Toggles["fenshu"][0].getChildByName("checkmark").active = true;
                        this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
                        this.Toggles["fenshu"][2].getChildByName("checkmark").active = false;
                        var _toggles8 = this.Toggles["fenshu"][0].parent;
                        this.UpdateLabelColor(_toggles8);
                    }
                } else {
                    if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
                        this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
                        this.Toggles["renshu"][1].getChildByName("checkmark").active = true;
                        var _toggles9 = this.Toggles["renshu"][0].parent;
                        this.UpdateLabelColor(_toggles9);
                    }
                    //如果点了两副牌
                    if (toggleIndex == 1) {
                        //如果分数不为400分
                        if (!this.Toggles["fenshu"][0].getChildByName("checkmark").active) {
                            this.Toggles["fenshu"][0].getChildByName("checkmark").active = true;
                            this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
                            this.Toggles["fenshu"][2].getChildByName("checkmark").active = false;
                            var _toggles10 = this.Toggles["fenshu"][0].parent;
                            this.UpdateLabelColor(_toggles10);
                        }
                    } else {
                        //如果分数不为400分
                        if (this.Toggles["fenshu"][0].getChildByName("checkmark").active) {
                            this.Toggles["fenshu"][0].getChildByName("checkmark").active = false;
                            this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
                            this.Toggles["fenshu"][2].getChildByName("checkmark").active = true;
                            var _toggles11 = this.Toggles["fenshu"][0].parent;
                            this.UpdateLabelColor(_toggles11);
                        }
                    }
                }
            } else if ('fenshu' == key) {
                if (toggleIndex == 0) {
                    if (this.Toggles["yongpai"][0].getChildByName("checkmark").active) {
                        this.Toggles["yongpai"][0].getChildByName("checkmark").active = false;
                        this.Toggles["yongpai"][1].getChildByName("checkmark").active = true;
                        this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
                        var _toggles12 = this.Toggles["yongpai"][0].parent;
                        this.UpdateLabelColor(_toggles12);
                    }
                } else {
                    if (!this.Toggles["yongpai"][0].getChildByName("checkmark").active) {
                        this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
                        this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
                        this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
                        var _toggles13 = this.Toggles["yongpai"][0].parent;
                        this.UpdateLabelColor(_toggles13);
                    }
                }
            } else if ('fenzu' == key) {
                if (toggleIndex > 0) {
                    if (this.Toggles["renshu"][0].getChildByName("checkmark").active) {
                        this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
                        this.Toggles["renshu"][1].getChildByName("checkmark").active = true;
                        var _toggles14 = this.Toggles["renshu"][0].parent;
                        this.UpdateLabelColor(_toggles14);
                        if (this.Toggles["yongpai"][2].getChildByName("checkmark").active) {
                            this.Toggles["yongpai"][0].getChildByName("checkmark").active = true;
                            this.Toggles["yongpai"][1].getChildByName("checkmark").active = false;
                            this.Toggles["yongpai"][2].getChildByName("checkmark").active = false;
                            var _toggles15 = this.Toggles["yongpai"][0].parent;
                            this.UpdateLabelColor(_toggles15);
                            if (this.Toggles["fenshu"][0].getChildByName("checkmark").active) {
                                this.Toggles["fenshu"][0].getChildByName("checkmark").active = false;
                                this.Toggles["fenshu"][1].getChildByName("checkmark").active = false;
                                this.Toggles["fenshu"][2].getChildByName("checkmark").active = true;
                                var _toggles16 = this.Toggles["fenshu"][0].parent;
                                this.UpdateLabelColor(_toggles16);
                            }
                        }
                    }
                }
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
        this.UpdateOnClickToggle();
    },
    UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode) {
        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this.OnUpdateTogglesLabel(TogglesNode, isResetPos);
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
                                if (curCostData[_i].SetCount == 501) {
                                    this.Toggles['jushu'][_i].getChildByName('label').getComponent(cc.Label).string = curCostData[_i].SetCount % 500 + '档';
                                    continue;
                                }
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
    }
});

module.exports = sjChildCreateRoom;

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
        //# sourceMappingURL=glwskChildCreateRoom.js.map
        