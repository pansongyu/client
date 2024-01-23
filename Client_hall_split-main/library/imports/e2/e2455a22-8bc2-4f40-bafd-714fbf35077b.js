"use strict";
cc._RF.push(module, 'e2455oii8JPQLr9cU+/NQd7', 'dctsChildCreateRoom');
// script/ui/uiGame/dcts/dctsChildCreateRoom.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
创建房间子界面
 */
var app = require("app");

var ctwskChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
        var sendPack = {};
        var moshi = this.GetIdxByKey('moshi');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');

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
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "moshi": moshi,
            "sign": moshi + 1,
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

        this.moShiToggleIndex = -1;
        this.puTongCosts = [];
        this.biShangCosts = [];

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

                        if (dataKey == 'moshi') {
                            if (showList.indexOf("1") > -1) {
                                this.moShiToggleIndex = 0;
                            }
                            if (showList.indexOf("2") > -1) {
                                this.moShiToggleIndex = 1;
                            }
                        }

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
        if ('renshu' == key) {
            if (toggleIndex != 2 && !this.Toggles['moshi'][1].getChildByName('checkmark').active) {
                this.Toggles["moshi"][1].getChildByName("checkmark").active = true;
                this.Toggles["moshi"][0].getChildByName("checkmark").active = false;
                this.UpdateLabelColor(this.Toggles["moshi"][0].parent);
            }
        }
        if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
            this.ClearToggleCheck(needClearList, needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);

            return;
        } else if ('kexuanwanfa' == key) {
            // if(toggleIndex == 0 && this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active){
            //     this.Toggles['fangjian'][0].getChildByName('checkmark').active = false;
            //     this.UpdateLabelColor(this.Toggles["fangjian"][0].parent);
            //     if(!this.Toggles['renshu'][2].getChildByName('checkmark').active){
            //         this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
            //         this.Toggles["renshu"][1].getChildByName("checkmark").active = false;
            //         this.Toggles["renshu"][2].getChildByName("checkmark").active = true;
            //         this.UpdateLabelColor(this.Toggles["renshu"][0].parent);
            //     }
            // }
        } else if ('moshi' == key) {
            this.moShiToggleIndex = toggleIndex;
            if (toggleIndex == 0 && this.Toggles['moshi'][1].getChildByName('checkmark').active) {
                this.Toggles['fangjian'][0].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles["fangjian"][0].parent);
                if (!this.Toggles['renshu'][2].getChildByName('checkmark').active) {
                    this.Toggles["renshu"][0].getChildByName("checkmark").active = false;
                    this.Toggles["renshu"][1].getChildByName("checkmark").active = false;
                    this.Toggles["renshu"][2].getChildByName("checkmark").active = true;
                    this.UpdateLabelColor(this.Toggles["fangfei"][0].parent);
                }
            }
            this.UpdateTogglesLabel(this.Toggles['moshi'][0].parent);
        } else if ('fangjian' == key) {
            if (toggleIndex == 0 && !this.Toggles['moshi'][1].getChildByName('checkmark').active) {
                app.SysNotifyManager().ShowSysMsg("非比赏模式只能四人");
                return;
            }
            // 小局托管解散,解散次数不超过5次,
            // 托管2小局解散,解散次数不超过3次",
            if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 3) {
                this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
            } else if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 2) {
                this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
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
                    if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey || 'moshi' == curKey) {

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
                            // for (let i = 0; i < curCostData.length; i++) {
                            //     this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount + '局';
                            // }
                            var moShiCosts = [];
                            if (this.moShiToggleIndex == 0) {
                                //普通模式
                                moShiCosts = this.puTongCosts;
                            } else {
                                moShiCosts = this.biShangCosts;
                            }
                            for (var _i4 = 0; _i4 < moShiCosts.length; _i4++) {
                                this.Toggles['jushu'][_i4].getChildByName('label').getComponent(cc.Label).string = moShiCosts[_i4].SetCount + '局';
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
                            if (this.moShiToggleIndex == 0) {
                                //普通模式
                                if (jushuIndex < this.puTongCosts.length) {
                                    AAfangfeiDatas.push(this.puTongCosts[jushuIndex].AaCostCount);
                                    WinfangfeiDatas.push(this.puTongCosts[jushuIndex].WinCostCount);
                                    FangZhufangfeiDatas.push(this.puTongCosts[jushuIndex].CostCount);

                                    clubGuanLiFangFeiDatas.push(this.puTongCosts[jushuIndex].ClubCostCount);
                                    clubWinFangFeiDatas.push(this.puTongCosts[jushuIndex].ClubWinCostCount);
                                    clubAAFangFeiDatas.push(this.puTongCosts[jushuIndex].ClubAaCostCount);
                                    //赛事房费
                                    unionGuanliFangFeiDatas.push(this.puTongCosts[jushuIndex].UnionCostCount);
                                }
                            }
                            if (this.moShiToggleIndex == 1) {
                                //比赏模式
                                if (jushuIndex < this.biShangCosts.length) {
                                    AAfangfeiDatas.push(this.biShangCosts[jushuIndex].AaCostCount);
                                    WinfangfeiDatas.push(this.biShangCosts[jushuIndex].WinCostCount);
                                    FangZhufangfeiDatas.push(this.biShangCosts[jushuIndex].CostCount);

                                    clubGuanLiFangFeiDatas.push(this.biShangCosts[jushuIndex].ClubCostCount);
                                    clubWinFangFeiDatas.push(this.biShangCosts[jushuIndex].ClubWinCostCount);
                                    clubAAFangFeiDatas.push(this.biShangCosts[jushuIndex].ClubAaCostCount);
                                    //赛事房费
                                    unionGuanliFangFeiDatas.push(this.biShangCosts[jushuIndex].UnionCostCount);
                                }
                            }
                        }
                    }
                    if ('jushu' != curKey) {
                        var descInde = 0;
                        for (var _i5 = 0; _i5 < TogglesNode.children.length; _i5++) {
                            if (TogglesNode.children[_i5].name.startsWith('Toggle')) {
                                TogglesNode.children[_i5].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
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
            for (var _i6 = 0; _i6 < this.Toggles["gaoji"].length; _i6++) {
                var ToggleDesc = this.Toggles["gaoji"][_i6].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "30秒未准备自动踢出房间") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["gaoji"][_i6].active = false;
                        this.Toggles["gaoji"][_i6].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["gaoji"][_i6].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        } else if (this.Toggles["kexuanwanfa"]) {
            for (var _i7 = 0; _i7 < this.Toggles["kexuanwanfa"].length; _i7++) {
                var _ToggleDesc = this.Toggles["kexuanwanfa"][_i7].getChildByName("label").getComponent(cc.Label).string;
                if (_ToggleDesc == "比赛分不能低于0") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["kexuanwanfa"][_i7].active = false;
                        this.Toggles["kexuanwanfa"][_i7].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["kexuanwanfa"][_i7].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        }
    },
    getCostData: function getCostData(renshu) {
        //renshu =0 房主支付
        var costs = [];
        this.puTongCosts = [];
        this.biShangCosts = [];
        if (renshu.length != 2) {
            return costs;
        }
        var allSelectCityData = app.HeroManager().GetCurSelectCityData();
        var curselectId = allSelectCityData[0]['selcetId'];
        if (this.clubData != null) {
            curselectId = this.clubData.cityId;
            if (typeof curselectId == "undefined") {
                var clubDataTemp = app.ClubManager().GetClubDataByClubID(this.clubData.clubId);
                curselectId = clubDataTemp.cityId;
            }
        } else if (this.unionData != null) {
            curselectId = this.unionData.cityId;
        }
        for (var key in this.roomcostConfig) {
            //先匹配是否是当前城市，key的前7位是城市id
            // console.log("key city === " + parseInt(key.substring(0, 7)));
            // console.log("curselectId === " + curselectId);
            if (parseInt(key.substring(0, 7)) != curselectId) continue;
            if (this.gameType.toUpperCase() == this.roomcostConfig[key].GameType && parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin && parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax) {
                // costs.push(this.roomcostConfig[key]);
                if (this.roomcostConfig[key].Sign == 1) {
                    this.puTongCosts.push(this.roomcostConfig[key]);
                    costs.push(this.roomcostConfig[key]);
                } else {
                    if (this.roomcostConfig[key].Sign == 2) {
                        this.biShangCosts.push(this.roomcostConfig[key]);
                        costs.push(this.roomcostConfig[key]);
                    }
                }
            }
        }
        if (0 == costs.length) {
            this.ErrLog('roomcost Config error');
            app.SysNotifyManager().ShowSysMsg("获取对应城市配置失败：" + curselectId);
        }
        return costs;
    },

    //创建房间
    Click_btn_create: function Click_btn_create(createType) {
        var isCheckedMic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
        // if(this.clubData==null){
        //     if(hasRoomCard < costCoun){//金币不足
        //         let desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
        //         app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
        //         app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, desc)
        //         return null;
        //     }
        // }
        // let setCount = needCostData[jushuIndex].SetCount;
        var setCount = this.puTongCosts[jushuIndex].SetCount;
        if (this.moShiToggleIndex == 1) {
            setCount = this.biShangCosts[jushuIndex].SetCount;
        }
        var sendPack = this.CreateSendPack(renshu, setCount, isSpiltRoomCard);
        sendPack = this.AdjustSendPack(sendPack);
        //如果勾选了强制连麦，需要先判断是否开启麦克风权限，不如没开不能创建
        if (cc.sys.isNative && !isCheckedMic && sendPack.lianmai == 2 && !this.clubData && !this.unionData) {
            app.NativeManager().CallToNative("CheckMicPermission", [{ "Name": "name", "Value": "createRoom" }, { "Name": "switchGameData", "Value": "" }]);
            return;
        }
        //把人数，局数，房费索引传给服务端用作修改房间显示当前配置用
        var jushu = this.GetIdxByKey('jushu');
        sendPack.jushu = jushu;
        var renshuIndex = this.GetIdxByKey('renshu');
        sendPack.renshu = renshuIndex;
        var fangfei = this.GetIdxByKey('fangfei');
        sendPack.fangfei = fangfei;
        //记录到本地缓存
        if (this.unionData == null || this.unionData.cfgData == null) {
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
                    clubId = this.unionData.clubId;
                    unionId = this.unionData.unionId;
                    unionRoomKey = this.unionData.roomKey;
                }
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
        if (this.gameType == "zyqz_nn" || this.gameType == "nnsz_nn" || this.gameType == "gdzj_nn" || this.gameType == "tbnn_nn" || this.gameType == "mpqz_nn" || this.gameType == "lz_nn") {
            realGameType = "nn";
        }
        if (this.gameType == "zyqz_sg" || this.gameType == "sgsz_sg" || this.gameType == "gdzj_sg" || this.gameType == "tb_sg" || this.gameType == "mpqz_sg") {
            realGameType = "sg";
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
    }

});

module.exports = ctwskChildCreateRoom;

cc._RF.pop();