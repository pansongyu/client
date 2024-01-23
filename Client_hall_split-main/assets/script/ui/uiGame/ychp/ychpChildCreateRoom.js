/*
创建房间子界面
 */
var app = require("app");

var hhhgwChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    // CreateSendPack -start-
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let wanfa = this.GetIdxByKey('wanfa');
        let biegang = this.GetIdxByKey('biegang');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let baochong = this.GetIdxByKey('baochong');
        let suanfen = this.GetIdxByKey('suanfen');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "wanfa": wanfa,
            "biegang": biegang,
            "kexuanwanfa": kexuanwanfa,
            "baochong": baochong,
            "suanfen": suanfen,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },

    // CreateSendPack -end-
    AdjustSendPack: function (sendPack) {
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

        // 	包铳：出一家,出两家,不包铳。
        // 	单选，默认出一家。
        // 	“出两家”仅限三人场可选。
        // 	勾选“只能自摸”后隐藏该玩法选项。
        if (sendPack.kexuanwanfa.indexOf(6) > -1) {
            this.RemoveRadioSelect(sendPack, "baochong");
        }

        return sendPack;
    },

    OnToggleClick: function (event) {
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
        let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
        let toggleIndex = parseInt(toggle.name.substring(('Toggle').length, toggle.name.length)) - 1;
        let needClearList = [];
        let needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            // if ('renshu' == key) {
            //     // 	数醒：上下醒,跟醒；
            //     // 	单选，默认跟醒；
            //     // 	仅限四人场可选；
            //     if (toggleIndex == 2) { // 四人场
            //         this.Toggles['shuxing'][0].parent.active = true;
            //         // 	查看庄家牌，仅限四人场可选；
            //         this.Toggles['kexuanwanfa'][3].active = true;
            //     } else {
            //         this.Toggles['shuxing'][0].parent.active = false;
            //         // 	查看庄家牌，仅限四人场可选；
            //         this.Toggles['kexuanwanfa'][3].active = false;
            //     }

            //     // 	每局换位、一炮双响，仅限三人场可选；
            //     if (toggleIndex == 1) { // 三人场
            //         this.Toggles['kexuanwanfa'][1].active = true;
            //         this.Toggles['kexuanwanfa'][2].active = true;
            //     } else {
            //         this.Toggles['kexuanwanfa'][1].active = false;
            //         this.Toggles['kexuanwanfa'][2].active = false;
            //     }
            // }
            // 	“出两家”仅限三人场可选。
            if ('renshu' == key) {
                if (toggleIndex == 1) { // 三人场
                    this.Toggles['baochong'][1].active = true;
                } else {
                    this.Toggles['baochong'][1].active = false;
                }
            }
            return;
        }
        // else if ("shuxing" == key) {
        //     // 	翻醒设置：上醒,中醒,下醒；
        //     // 	多选，默认上醒,下醒；
        //     // 	选择“上下醒”后，该选项不可选；
        //     if (this.Toggles['shuxing'][0].getChildByName('checkmark').active == false) {
        //         this.Toggles['fanxingshezhi'][0].parent.active = false;
        //     } else {
        //         this.Toggles['fanxingshezhi'][0].parent.active = true;
        //     }
        // }
        else if ("fangjian" == key) {
     
            // 小局托管解散,解散次数不超过5次,
            // 托管2小局解散,解散次数不超过3次",
            // if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
            //     this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
            // } else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
            //     this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
            // }

            // if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
            //     this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            // } else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
            //     this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
            // }
        }
        else if ('kexuanwanfa' == key) {
            // if(toggleIndex <2){
            //    this.ClearToggleCheck(this.Toggles['fengding'],[1]);
            //    this.UpdateLabelColor(this.Toggles['fengding'][1].parent);
            // }
            // 	勾选只能自摸后，最后三张不能炮胡、一炮多响、有漏胡，都不能勾选。
            // 	包铳：出一家,出两家,不包铳。
            // 	单选，默认出一家。
            // 	“出两家”仅限三人场可选。
            // 	勾选“只能自摸”后隐藏该玩法选项。

            if (toggleIndex == 6) {
                if (this.Toggles['kexuanwanfa'][6].getChildByName('checkmark').active == false) {
                    this.Toggles['kexuanwanfa'][0].active = false;
                    this.Toggles['kexuanwanfa'][3].active = false;
                    this.Toggles['kexuanwanfa'][4].active = false;
                    this.Toggles['baochong'][0].parent.active = false;
                } else {
                    this.Toggles['kexuanwanfa'][0].active = true;
                    this.Toggles['kexuanwanfa'][3].active = true;
                    this.Toggles['kexuanwanfa'][4].active = true;
                    this.Toggles['baochong'][0].parent.active = true;
                }
            }
        }
        if (toggles.getComponent(cc.Toggle)) {//复选框
            needShowIndexList = [];
            for (let i = 0; i < needClearList.length; i++) {
                let mark = needClearList[i].getChildByName('checkmark').active;
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
    UpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
        // 	包铳：出一家,出两家,不包铳。
        // 	单选，默认出一家。
        // 	“出两家”仅限三人场可选。
        // 	勾选“只能自摸”后隐藏该玩法选项。
        if (this.Toggles["baochong"]) {
            if (this.Toggles["renshu"][1].getChildByName("checkmark").active) {
                this.Toggles["baochong"][1].active = true;
            } else {
                this.Toggles["baochong"][1].active = false;
            }
        }

        // 	勾选只能自摸后，最后三张不能炮胡、一炮多响、有漏胡，都不能勾选。
        if (this.Toggles["kexuanwanfa"]) {
            if (this.Toggles["kexuanwanfa"][6].getChildByName("checkmark").active) {
                this.Toggles["kexuanwanfa"][0].active = false;
                this.Toggles["kexuanwanfa"][3].active = false;
                this.Toggles["kexuanwanfa"][4].active = false;
                if (this.Toggles['baochong']) {
                    this.Toggles['baochong'][0].parent.active = false;
                }
            } else {
                this.Toggles["kexuanwanfa"][0].active = true;
                this.Toggles["kexuanwanfa"][3].active = true;
                this.Toggles["kexuanwanfa"][4].active = true;
                if (this.Toggles['baochong']) {
                    this.Toggles['baochong'][0].parent.active = true;
                }
            }
        }

        let curKey = TogglesNode.name.substring(('Toggles_').length, TogglesNode.name.length);
        let reg = /\/s/g;
        for (let key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                if (curKey == this.gameCreateConfig[key].Key) {
                    let AAfangfeiDatas = [];
                    let WinfangfeiDatas = [];
                    let FangZhufangfeiDatas = [];
                    let clubGuanLiFangFeiDatas = [];
                    let clubWinFangFeiDatas = [];
                    let clubAAFangFeiDatas = [];
                    let unionGuanliFangFeiDatas = [];
                    let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
                    TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
                    let descList = [];
                    if ('jushu' != curKey) {//局数读roomcost
                        descList = this.gameCreateConfig[key].ToggleDesc.split(',');
                        if (this.clubData && 'fangfei' == curKey) {
                            descList = ['管理付'];
                        } else if (this.unionData && 'fangfei' == curKey) {
                            descList = ['盟主付'];
                        }
                        if (descList.length != TogglesNode.children.length - 2) {//减去标题和帮助按钮
                            this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
                            break;
                        }
                    }
                    let jushuIndex = -1;
                    let renshuIndex = -1;
                    let renshu = [];//0表示读房主支付配置
                    if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey) {

                        let publicCosts = this.getCostData(renshu);

                        if (this.Toggles['renshu'])
                            renshu = this.getCurSelectRenShu();

                        let SpiltCosts = this.getCostData(renshu);
                        let curCostData = null;
                        if (0 == renshu.length) {
                            curCostData = publicCosts;
                        }
                        else {
                            curCostData = SpiltCosts;
                        }
                        if (this.Toggles['jushu']) {
                            jushuIndex = 0;
                            for (let i = 0; i < this.Toggles['jushu'].length; i++) {
                                let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
                                if (mark) {
                                    jushuIndex = i;
                                    break;
                                }
                                jushuIndex++;
                            }
                            for (let i = 0; i < curCostData.length; i++) {
                                if (curCostData[i].SetCount > 100) {
                                    let count = curCostData[i].SetCount - 100;
                                    this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = count + '圈';
                                } else {
                                    this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount + '局';
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
                        let descInde = 0;
                        for (let i = 0; i < TogglesNode.children.length; i++) {
                            if (TogglesNode.children[i].name.startsWith('Toggle')) {
                                TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
                                descInde++;
                            }
                        }
                    }

                    if (0 != AAfangfeiDatas.length) {
                        let needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
                        let ffNodes = this.Toggles['fangfei'];
                        let hasHideNode = false;
                        let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                        for (let s = 0; s < ffNodes.length; s++) {
                            let needNode = ffNodes[s].getChildByName('fangfeiNode');
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
                            let disCost = -1;
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
                                }
                                else if (1 == s) {
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
                                }
                                else {
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
            for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
                let ToggleDesc = this.Toggles["gaoji"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "30秒未准备自动踢出房间") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["gaoji"][i].active = false;
                        this.Toggles["gaoji"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["gaoji"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }

                }
            }
        } else if (this.Toggles["kexuanwanfa"]) {
            for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
                let ToggleDesc = this.Toggles["kexuanwanfa"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "比赛分不能低于0") {
                    if (!this.unionData) {
                        this.Toggles["kexuanwanfa"][i].active = false;
                        this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["kexuanwanfa"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        }
    },

    /**
     * 单选
     */
    GetIdxByKey: function (key) {
        if (!this.Toggles[key]) {
            return -1;
        }

        for (let i = 0; i < this.Toggles[key].length; i++) {
            let mark = this.Toggles[key][i].getChildByName('checkmark').active;
            if (this.Toggles[key][i].active && mark) {
                return i;
            }
        }
    },

    /**
     * 多选
     */
    GetIdxsByKey: function (key) {
        if (!this.Toggles[key]) {
            return [];
        }

        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },

});
module.exports = hhhgwChildCreateRoom;