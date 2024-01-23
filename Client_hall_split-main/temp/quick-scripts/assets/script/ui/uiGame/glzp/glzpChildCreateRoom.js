(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/glzp/glzpChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9ffa30VkZtCHJIGuHmhq2z/', 'glzpChildCreateRoom', __filename);
// script/ui/uiGame/glzp/glzpChildCreateRoom.js

"use strict";

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
创建房间子界面
 */
var app = require("app");

var hhhgwChildCreateRoom = cc.Class((_cc$Class = {
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');

        var moshi = this.GetIdxByKey('moshi');
        var choupai = this.GetIdxByKey('choupai');
        var xiaojuqiepai = this.GetIdxByKey("xiaojuqiepai");
        var dajusuanfen = this.GetIdxByKey("dajusuanfen");
        if (renshu[0] != 2) {
            dajusuanfen = 0;
        }

        var kexuanwanfa = [];
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
                kexuanwanfa.push(i);
            }
        }

        var fangjian = [];
        for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
            if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
                fangjian.push(_i);
            }
        }

        var gaoji = [];
        for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
            if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
                gaoji.push(_i2);
            }
        }
        sendPack = {
            "xianShi": xianShi,
            "jiesan": jiesan,
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "gaoji": gaoji,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "moshi": moshi,
            "choupai": choupai,
            "xiaojuqiepai": xiaojuqiepai,
            "dajusuanfen": dajusuanfen

        };
        return sendPack;
    }
}, _defineProperty(_cc$Class, "CreateSendPack", function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
    var sendPack = {};
    var qihu = this.GetIdxByKey('qihu');
    var zishusuanfa = this.GetIdxByKey('zishusuanfa');
    var zimo = this.GetIdxByKey('zimo');
    var dianpao = this.GetIdxByKey('dianpao');
    var baodi = this.GetIdxByKey('baodi');
    var shuxing = this.GetIdxByKey('shuxing');
    var fanxingshezhi = this.GetIdxsByKey('fanxingshezhi');
    var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
    var lianmai = this.GetIdxByKey('lianmai');
    var fangjian = this.GetIdxsByKey('fangjian');
    var xianShi = this.GetIdxByKey('xianShi');
    var jiesan = this.GetIdxByKey('jiesan');
    var gaoji = this.GetIdxsByKey('gaoji');

    sendPack = {
        "qihu": qihu,
        "zishusuanfa": zishusuanfa,
        "zimo": zimo,
        "dianpao": dianpao,
        "baodi": baodi,
        "shuxing": shuxing,
        "fanxingshezhi": fanxingshezhi,
        "kexuanwanfa": kexuanwanfa,
        "lianmai": lianmai,
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
}), _defineProperty(_cc$Class, "AdjustSendPack", function AdjustSendPack(sendPack) {
    // 奖马勾选“无马”，则不能勾选“马跟杠”和“10倍听牌可接炮”；
    // if (sendPack.jiangma == 0) {
    // 	this.RemoveMultiSelect(sendPack, "kexuanwanfa", 0);
    // 	this.RemoveMultiSelect(sendPack, "kexuanwanfa", 10);
    // }
    // // 勾选“可接炮胡”，则不能勾选“抢杠胡3倍”；
    // if (sendPack.kexuanwanfa.indexOf(1) > -1) {
    // 	this.RemoveMultiSelect(sendPack, "kexuanwanfa", 6);
    // }
    // if (sendPack.xiapao != 2) {
    // 	this.RemoveRadioSelect(sendPack, "gudingpao");
    // }
    return sendPack;
}), _defineProperty(_cc$Class, "OnToggleClick", function OnToggleClick(event) {
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
            // 	数醒：上下醒,跟醒；
            // 	单选，默认跟醒；
            // 	仅限四人场可选；
            if (toggleIndex == 2) {
                // 四人场
                this.Toggles['shuxing'][0].parent.active = true;
                // 	查看庄家牌，仅限四人场可选；
                this.Toggles['kexuanwanfa'][3].active = true;
            } else {
                this.Toggles['shuxing'][0].parent.active = false;
                // 	查看庄家牌，仅限四人场可选；
                this.Toggles['kexuanwanfa'][3].active = false;
            }

            // 	每局换位、一炮双响，仅限三人场可选；
            if (toggleIndex == 1) {
                // 三人场
                this.Toggles['kexuanwanfa'][1].active = true;
                this.Toggles['kexuanwanfa'][2].active = true;
            } else {
                this.Toggles['kexuanwanfa'][1].active = false;
                this.Toggles['kexuanwanfa'][2].active = false;
            }
        }
        return;
    } else if ("shuxing" == key) {
        // 	翻醒设置：上醒,中醒,下醒；
        // 	多选，默认上醒,下醒；
        // 	选择“上下醒”后，该选项不可选；
        if (this.Toggles['shuxing'][0].getChildByName('checkmark').active == false) {
            this.Toggles['fanxingshezhi'][0].parent.active = false;
        } else {
            this.Toggles['fanxingshezhi'][0].parent.active = true;
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
}), _defineProperty(_cc$Class, "UpdateTogglesLabel", function UpdateTogglesLabel(TogglesNode) {
    var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    // 	数醒：上下醒,跟醒；
    // 	单选，默认跟醒；
    // 	仅限四人场可选；
    if (this.Toggles["shuxing"]) {
        if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
            this.Toggles["shuxing"][0].parent.active = true;
        } else {
            this.Toggles["shuxing"][0].parent.active = false;
        }
    }

    // 	翻醒设置：上醒,中醒,下醒；
    // 	多选，默认上醒,下醒；
    // 	选择“上下醒”后，该选项不可选；
    if (this.Toggles["fanxingshezhi"]) {
        if (this.Toggles["shuxing"][0].getChildByName("checkmark").active) {
            this.Toggles["fanxingshezhi"][0].parent.active = false;
        } else {
            this.Toggles["fanxingshezhi"][0].parent.active = true;
        }
    }

    // 	每局换位、一炮双响，仅限三人场可选；
    if (this.Toggles["kexuanwanfa"]) {
        if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
            this.Toggles["kexuanwanfa"][1].active = true;
            this.Toggles["kexuanwanfa"][2].active = true;
        } else {
            this.Toggles["kexuanwanfa"][1].active = false;
            this.Toggles["kexuanwanfa"][2].active = false;
        }
    }

    // 	查看庄家牌，仅限四人场可选；
    if (this.Toggles["kexuanwanfa"]) {
        if (this.Toggles["renshu"][2].getChildByName("checkmark").active) {
            this.Toggles["kexuanwanfa"][3].active = true;
        } else {
            this.Toggles["kexuanwanfa"][3].active = false;
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
                        for (var _i3 = 0; _i3 < curCostData.length; _i3++) {
                            if (curCostData[_i3].SetCount > 100) {
                                var count = curCostData[_i3].SetCount - 100;
                                this.Toggles['jushu'][_i3].getChildByName('label').getComponent(cc.Label).string = count + '圈';
                            } else {
                                this.Toggles['jushu'][_i3].getChildByName('label').getComponent(cc.Label).string = curCostData[_i3].SetCount + '局';
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
                    for (var _i4 = 0; _i4 < TogglesNode.children.length; _i4++) {
                        if (TogglesNode.children[_i4].name.startsWith('Toggle')) {
                            TogglesNode.children[_i4].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
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
                if ('dajusuanfen' == curKey) {
                    if (this.Toggles["renshu"][0].getChildByName('checkmark').active) {
                        this.Toggles["dajusuanfen"][0].parent.active = true;
                    } else {
                        this.Toggles["dajusuanfen"][0].parent.active = false;
                    }
                    if (!this.unionData) {
                        this.Toggles["dajusuanfen"][0].parent.active = false;
                    }
                }
                if ('xiaojuqiepai' == curKey) {
                    if (!this.unionData) {
                        this.Toggles["xiaojuqiepai"][0].parent.active = false;
                    }
                }
            }
        }
    }
    if (this.Toggles["gaoji"]) {
        for (var _i5 = 0; _i5 < this.Toggles["gaoji"].length; _i5++) {
            var ToggleDesc = this.Toggles["gaoji"][_i5].getChildByName("label").getComponent(cc.Label).string;
            if (ToggleDesc == "30秒未准备自动踢出房间") {
                if (!this.clubData && !this.unionData) {
                    this.Toggles["gaoji"][_i5].active = false;
                    this.Toggles["gaoji"][_i5].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
                    break;
                } else {
                    this.Toggles["gaoji"][_i5].active = true;
                    //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                    break;
                }
            }
        }
    } else if (this.Toggles["kexuanwanfa"]) {
        for (var _i6 = 0; _i6 < this.Toggles["kexuanwanfa"].length; _i6++) {
            var _ToggleDesc = this.Toggles["kexuanwanfa"][_i6].getChildByName("label").getComponent(cc.Label).string;
            if (_ToggleDesc == "比赛分不能低于0") {
                if (!this.unionData) {
                    this.Toggles["kexuanwanfa"][_i6].active = false;
                    this.Toggles["kexuanwanfa"][_i6].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
                    break;
                } else {
                    this.Toggles["kexuanwanfa"][_i6].active = true;
                    //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                    break;
                }
            }
        }
    }
}), _defineProperty(_cc$Class, "GetIdxByKey", function GetIdxByKey(key) {
    if (!this.Toggles[key]) {
        return -1;
    }

    for (var i = 0; i < this.Toggles[key].length; i++) {
        var mark = this.Toggles[key][i].getChildByName('checkmark').active;
        if (this.Toggles[key][i].active && mark) {
            return i;
        }
    }
}), _defineProperty(_cc$Class, "GetIdxsByKey", function GetIdxsByKey(key) {
    if (!this.Toggles[key]) {
        return [];
    }

    var arr = [];
    for (var i = 0; i < this.Toggles[key].length; i++) {
        if (this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active) {
            arr.push(i);
        }
    }
    return arr;
}), _cc$Class));
module.exports = hhhgwChildCreateRoom;

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
        //# sourceMappingURL=glzpChildCreateRoom.js.map
        