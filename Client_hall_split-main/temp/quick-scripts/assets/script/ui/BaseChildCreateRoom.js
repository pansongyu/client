(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/BaseChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5e3e7ayOyBFN6UgnljzLqhx', 'BaseChildCreateRoom', __filename);
// script/ui/BaseChildCreateRoom.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
创建房间子界面
 */
var app = require("app");

var BaseChildCreateRoom = cc.Class({
    extends: require("BaseForm"),

    properties: {},

    InitBase: function InitBase(clubData, unionData, gameType) {
        if (gameType && gameType == this.gameType) {
            return;
        }
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
        this.disCount = -1;
        this.isGetDiscount = false;
        this.GetRoomCostByDiscount();

        app.Client.RegEvent("OnMicPermissionOpen", this.Event_MicPermissionOpen, this);
    },

    //创建界面回掉，重写
    OnCreateInit: function OnCreateInit() {},

    //显示， 重写
    OnShow: function OnShow() {},

    RefreshAllToggles: function RefreshAllToggles(gameType) {
        if (this.gameType == gameType && Object.keys(this.Toggles).length > 1) {
            return;
        }
        this.gameType = gameType;
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
        //this.node_RightLayout.removeAllChildren();
        this.DestroyAllChildren(this.node_RightLayout);
        var time = Date.now();
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
                for (var _i = 1; _i <= toggleCount; _i++) {
                    var curNode = node.getChildByName('Toggle' + _i);
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
                                // if ('fangfei' == dataKey) {
                                //     //房费节点比较长，需要再位移一点
                                //     curNode.x = lastPos.x + this.addPrefabWidth + 80;
                                // }else{
                                //     curNode.x = lastPos.x + this.addPrefabWidth;
                                // }
                                curNode.x = lastPos.x + parseInt(spacing[_i - 1]);
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
                            if (_i == parseInt(showList[_j2])) {
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
        console.log("创建成功耗时0 ", Date.now() - time, gameType);
        this.setHelpBtnPos();
        this.scroll_Right.scrollToTop();
        //如果可以滚动，显示滚动提示节点
        if (this.node_RightLayout.height > this.scroll_Right.node.height) {
            this.scrollTip.active = true;
        } else {
            this.scrollTip.active = false;
        }
        this.UpdateOnClickToggle();
        this.CheckFangshu();
        this.CheckPingcuo();
    },

    UpdateOnClickToggle: function UpdateOnClickToggle() {
        //子类重写
    },
    //获取创建缓存
    GetLocalConfig: function GetLocalConfig(configName, clubId, roomKey, unionId, unionRoomKey) {
        return cc.sys.localStorage.getItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + unionId + '_' + unionRoomKey + '_' + configName);
    },
    SetLocalConfig: function SetLocalConfig(configName, configInfo, clubId, roomKey, unionId, unionRoomKey) {
        cc.sys.localStorage.setItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + unionId + '_' + unionRoomKey + '_' + configName, configInfo);
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
                            for (var _i2 = 0; _i2 < curCostData.length; _i2++) {
                                if (!this.Toggles['jushu'][_i2]) continue;
                                if (this.gameType == "nbcxmj" || this.gameType == "cxxzmj") {
                                    var str = "";
                                    if (curCostData[_i2].SetCount == 99) {
                                        str = '1节';
                                    } else {
                                        str = curCostData[_i2].SetCount + '局';
                                    }
                                    this.Toggles['jushu'][_i2].getChildByName('label').getComponent(cc.Label).string = str;
                                } else {
                                    this.Toggles['jushu'][_i2].getChildByName('label').getComponent(cc.Label).string = curCostData[_i2].SetCount + '局';
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
                        for (var _i3 = 0; _i3 < TogglesNode.children.length; _i3++) {
                            if (TogglesNode.children[_i3].name.startsWith('Toggle')) {
                                TogglesNode.children[_i3].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
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
                                //     needNode.
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
            for (var _i4 = 0; _i4 < this.Toggles["gaoji"].length; _i4++) {
                var ToggleDesc = this.Toggles["gaoji"][_i4].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "30秒未准备自动踢出房间") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["gaoji"][_i4].active = false;
                        this.Toggles["gaoji"][_i4].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["gaoji"][_i4].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        } else if (this.Toggles["kexuanwanfa"]) {
            for (var _i5 = 0; _i5 < this.Toggles["kexuanwanfa"].length; _i5++) {
                var _ToggleDesc = this.Toggles["kexuanwanfa"][_i5].getChildByName("label").getComponent(cc.Label).string;
                if (_ToggleDesc == "比赛分不能低于0") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["kexuanwanfa"][_i5].active = false;
                        this.Toggles["kexuanwanfa"][_i5].getChildByName("checkmark").active = false; //隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    } else {
                        this.Toggles["kexuanwanfa"][_i5].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        }
    },
    //获取打折后的价格
    GetRoomCostByDiscount: function GetRoomCostByDiscount() {
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
        var packName = "";
        var sendPack = {};
        if (this.clubData == null && this.unionData != null) {
            packName = "union.CUnionGameDiscount";
            sendPack.gameId = gameId;
            sendPack.clubId = this.unionData.clubId;
            sendPack.unionId = this.unionData.unionId;
        } else if (this.clubData != null && this.unionData == null) {
            packName = "club.CClubGameDiscount";
            sendPack.gameId = gameId;
            sendPack.clubId = this.clubData.clubId;
        } else {
            packName = "room.CBaseGameDiscount";
            sendPack.gameId = gameId;
        }
        var self = this;
        app.NetManager().SendPack(packName, sendPack, function (event) {
            if (event.gameId == gameId) {
                if (event.value >= 0) {
                    self.disCount = event.value / 100;
                }
                self.isGetDiscount = true;
                self.RefreshAllToggles(self.gameType);
            }
        }, function (event) {
            app.SysNotifyManager().ShowSysMsg("获取折扣失败", [], 3);
        });
    },
    UpdateLabelColor: function UpdateLabelColor(TogglesNode) {
        for (var i = 0; i < TogglesNode.children.length; i++) {
            var toggleNode = TogglesNode.children[i];
            if (toggleNode.name.startsWith('Toggle')) {
                var isChecked = toggleNode.getChildByName('checkmark').active;
                for (var j = 0; j < toggleNode.children.length; j++) {
                    var label = toggleNode.children[j].getComponent(cc.Label);
                    if (null != label) {
                        if (isChecked) {
                            toggleNode.children[j].color = this.RedColor1;
                        } else {
                            toggleNode.children[j].color = this.RedColor2;
                        }
                    }
                    var fangkaNode = toggleNode.getChildByName('fangfeiNode');
                    if (fangkaNode.active) {
                        label = null;
                        for (var s = 0; s < fangkaNode.children.length; s++) {
                            label = fangkaNode.children[s].getComponent(cc.Label);
                            if (null != label) {
                                if (isChecked) {
                                    fangkaNode.children[s].color = this.RedColor1;
                                } else {
                                    fangkaNode.children[s].color = this.RedColor2;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    setHelpBtnPos: function setHelpBtnPos() {
        //垃圾label控件自适应宽度有BUG草泥马
        var helpNode = null;
        var lastNode = null;
        var Toggles = null;
        for (var j = 0; j < this.node_RightLayout.children.length; j++) {
            if (j % 2 == 1) {
                continue;
            }
            Toggles = this.node_RightLayout.children[j];
            helpNode = null;
            lastNode = null;
            for (var i = 0; i < Toggles.children.length; i++) {
                if (Toggles.children[i].name.startsWith('Toggle')) lastNode = Toggles.children[i];else if (Toggles.children[i].name.startsWith('btn_help')) helpNode = Toggles.children[i];

                if (helpNode && helpNode.active && lastNode) {
                    var labelNode = lastNode.getChildByName('label');
                    var str = lastNode.getChildByName('label').getComponent(cc.Label);
                    var maxWidth = 0;
                    var label = lastNode.getChildByName('label');
                    if (label) {
                        maxWidth = label.x + label.width;
                        label = null;
                    }
                    var fangfeiNode = lastNode.getChildByName('fangfeiNode');
                    if (fangfeiNode.active) {
                        for (var n = 0; n < fangfeiNode.children.length; n++) {
                            var _label = fangfeiNode.children[n].getComponent(cc.Label);
                            if (_label) {
                                maxWidth = fangfeiNode.x + _label.node.x + _label.node.width;
                                _label = null;
                            }
                        }
                    }
                    helpNode.x = lastNode.x + maxWidth + 60;
                    helpNode.y = lastNode.y;
                }
            }
        }
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
            if (typeof curselectId == "undefined") {
                var clubDataTemp = app.ClubManager().GetClubDataByClubID(this.clubData.clubId);
                curselectId = clubDataTemp.cityId;
            }
        } else if (this.unionData != null) {
            curselectId = this.unionData.cityId;
        }
        for (var key in this.roomcostConfig) {
            //先匹配是否是当前城市，key的前7位是城市id
            if (parseInt(key.substring(0, 7)) != curselectId) continue;
            if (this.gameType.toUpperCase() == this.roomcostConfig[key].GameType && parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin && parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax) {
                costs.push(this.roomcostConfig[key]);
            }
        }
        if (0 == costs.length) {
            this.ErrLog('roomcost Config error');
            app.SysNotifyManager().ShowSysMsg("获取对应城市配置失败：" + curselectId);
        }
        return costs;
    },

    getCurSelectRenShu: function getCurSelectRenShu() {
        var renshu = 0;
        var needIndex = -1;
        if (this.Toggles['renshu']) {
            for (var i = 0; i < this.Toggles['renshu'].length; i++) {
                var toggle = this.Toggles['renshu'][i].getChildByName('checkmark');
                if (toggle.active) {
                    needIndex = i;
                    break;
                }
            }
        }
        for (var key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName && 'renshu' == this.gameCreateConfig[key].Key) {
                var AtRows = this.gameCreateConfig[key].ToggleDesc.toString().split(',');
                // return AtRows[needIndex].replace('人','').replace('2-','');
                var AtRowArr = [];
                AtRowArr = AtRows[needIndex].replace('人', '').split('-');
                if (AtRowArr.length == 1) {
                    //只是固定人数，没有配置浮动人数，最大最小都一样
                    AtRowArr.push(AtRowArr[0]);
                }
                return AtRowArr;
            }
        }
    },
    OnClickForm: function OnClickForm() {
        this.FormManager.CloseForm("UIMessageTip");
    },
    //滑动结束
    OnScrollEnded: function OnScrollEnded() {
        this.scrollTip.active = false;
    },
    //---------点击函数---------------------
    OnHelpBtnClick: function OnHelpBtnClick(event) {
        var btnNode = event.target;
        var btnName = btnNode.name;
        if (btnName.startsWith("btn_help")) {
            this.Click_btn_help(btnName, btnNode);
        }
    },
    Click_btn_help: function Click_btn_help(btnName, btnNode) {
        var that = this;
        var gameType = this.gameType;
        var curIndex = btnName.substring('btn_help0'.length, btnName.length);
        var msgID = 'UIMessageTip_Help' + curIndex + '_' + gameType;
        this.FormManager.ShowForm("UIMessageTip", msgID).then(function (formComponent) {
            var wndSize = formComponent.GetMsgWndSize();
            var btnNodeParentPosition = btnNode.parent.convertToWorldSpaceAR(btnNode.getPosition());
            var btnX = btnNodeParentPosition.x - that.node.width / 2 - wndSize.width / 2 - btnNode.width / 2;
            var btnY = 0;
            if (wndSize.height > that.node.height / 2) btnY = that.node.convertToWorldSpaceAR(that.node.getPosition()).y - that.node.height / 2;else btnY = btnNodeParentPosition.y - that.node.height / 2;-wndSize.height / 2 + btnNode.height / 2;
            formComponent.SetFormPosition(cc.v2(btnX, btnY));
        }).catch(function (error) {
            that.ErrLog("error:%s", error.stack);
        });
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

            if (this.Toggles['jushu']) {
                this.CheckPingcuo();
            }

            return;
        } else if ('kexuanwanfa2' == key) {
            if (this.Toggles['kexuanwanfa2'][4].getChildByName('checkmark').active && toggleIndex == 5) {
                this.Toggles['kexuanwanfa2'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa2'][4].parent);
            } else if (this.Toggles['kexuanwanfa2'][5].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['kexuanwanfa2'][5].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa2'][5].parent);
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
    ClearToggleCheck: function ClearToggleCheck(toggles, showIndexList) {
        for (var i = 0; i < toggles.length; i++) {
            toggles[i].getChildByName('checkmark').active = false;
        }if (showIndexList) {
            for (var _i6 = 0; _i6 < toggles.length; _i6++) {
                for (var j = 0; j < showIndexList.length; j++) {
                    if (_i6 == showIndexList[j]) toggles[_i6].getChildByName('checkmark').active = true;
                }
            }
        }
    },

    //房数检测
    CheckFangshu: function CheckFangshu() {
        if (this.Toggles["fangshu"] == undefined) {
            return;
        }

        var renshu = this.getCurSelectRenShu(); //发给服务器人数用选的
        if (renshu[1] == 2) {
            this.Toggles["fangshu"][0].active = false; //3房
            this.Toggles["fangshu"][1].active = true; //2房
            this.Toggles["fangshu"][2].active = true; //1房

            var event = {};
            event.target = this.Toggles['fangshu'][1];
            this.OnToggleClick(event);
        } else if (renshu[1] == 3) {
            this.Toggles["fangshu"][0].active = false; //3房
            this.Toggles["fangshu"][1].active = true; //2房
            this.Toggles["fangshu"][2].active = false; //1房

            var _event = {};
            _event.target = this.Toggles['fangshu'][1];
            this.OnToggleClick(_event);
        } else if (renshu[1] == 4) {
            this.Toggles["fangshu"][0].active = true; //3房
            this.Toggles["fangshu"][1].active = false; //2房
            this.Toggles["fangshu"][2].active = false; //1房

            var _event2 = {};
            _event2.target = this.Toggles['fangshu'][0];
            this.OnToggleClick(_event2);
        }
    },

    //平搓检测
    CheckPingcuo: function CheckPingcuo() {
        if (this.gameType == "nbcxmj" || this.gameType == "cxxzmj") {
            var renshu = this.getCurSelectRenShu();

            var needCostData = this.getCostData(renshu);
            if (!needCostData) {
                this.ErrLog('CheckPingcuo Not CostData');
                return null;
            }

            var jushuIndex = this.GetIdxByKey('jushu');
            if (-1 == jushuIndex || jushuIndex >= needCostData.length) {
                this.ErrLog('CheckPingcuo error -1 == jushuIndex || jushuIndex >= needCostData.length');
                return null;
            }
            var setCount = needCostData[jushuIndex].SetCount;
            if (setCount == 99) {
                if (this.Toggles["wanfa"] && this.Toggles["wanfa"] != undefined) {
                    this.Toggles["wanfa"][0].active = false; //平搓
                    this.Toggles["wanfa"][1].active = true; //冲击

                    var event = {};
                    event.target = this.Toggles['wanfa'][1];
                    this.OnToggleClick(event);
                }
            } else {
                if (this.Toggles["wanfa"] && this.Toggles["wanfa"] != undefined) {
                    this.Toggles["wanfa"][0].active = true; //平搓
                    this.Toggles["wanfa"][1].active = true; //冲击
                }
            }
        }
    },

    //-------------点击函数-------------
    OnRightBgClick: function OnRightBgClick(event) {
        this.FormManager.CloseForm("UIMessageTip");
    },
    OnClickBtnHelp: function OnClickBtnHelp() {
        this.FormManager.ShowForm("UIGameHelp", this.gameType);
        this.FormManager.CloseForm("UIMessageTip");
    },
    OnClickBtnNext: function OnClickBtnNext() {
        var tempObj = this.Click_btn_create(1);
        if (tempObj == null) {
            return;
        }
        if (tempObj.sendPack && tempObj.sendPack.gaoji && app.Client.GetClientConfigProperty("dianbo")) {
            if (tempObj.sendPack.gaoji.indexOf(5) < 0) {
                tempObj.sendPack.gaoji.push(5);
            }
            if (tempObj.sendPack.gaoji.indexOf(6) < 0) {
                tempObj.sendPack.gaoji.push(6);
            }
        }
        this.FormManager.ShowForm("ui/club/UIUnionPLSet", this.unionData, tempObj.realGameType, tempObj.sendPack);
        this.FormManager.CloseForm("UIMessageTip");
    },
    OnClickBtnCreate: function OnClickBtnCreate() {
        this.Click_btn_create(1);
    },
    Event_MicPermissionOpen: function Event_MicPermissionOpen() {
        console.log("麦克风权限打开，可以创建");
        this.Click_btn_create(1, true);
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
        var setCount = needCostData[jushuIndex].SetCount;
        var sendPack = this.CreateSendPack(renshu, setCount, isSpiltRoomCard);
        sendPack = this.AdjustSendPack(sendPack);
        //如果勾选了强制连麦，需要先判断是否开启麦克风权限，不如没开不能创建
        if (cc.sys.isNative && !isCheckedMic && sendPack.lianmai == 2 && !this.clubData && !this.unionData) {
            app.NativeManager().CallToNative("CheckMicPermission", [{ "Name": "name", "Value": "createRoom" }, { "Name": "switchGameData", "Value": "" }]);
            return;
        }
        if (sendPack.gaoji && app.Client.GetClientConfigProperty("dianbo")) {
            if (sendPack.gaoji.indexOf(5) < 0) {
                sendPack.gaoji.push(5);
            }
            if (sendPack.gaoji.indexOf(6) < 0) {
                sendPack.gaoji.push(6);
            }
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
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if (msgID == "goBuyCard") {
            app.FormManager().ShowForm("UIStore", 'btn_table1');
        }
    },

    /**
     * 单选
     */
    GetIdxByKey: function GetIdxByKey(key) {
        if (!this.Toggles[key]) {
            return -1;
        }

        for (var i = 0; i < this.Toggles[key].length; i++) {
            var mark = this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active;
            if (mark) {
                return i;
            }
        }
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
            if (this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },

    /**
     * 输入框
     */
    GetEditBoxByKey: function GetEditBoxByKey(key) {
        if (!this.Toggles[key]) {
            return false;
        }

        for (var i = 0; i < this.Toggles[key].length; i++) {
            var value = parseInt(this.Toggles[key][i].getChildByName('editboxEX').getComponent(cc.EditBox).string);
            if (value < this.Toggles[key][i].getChildByName('editboxEX').minEnter || value > this.Toggles[key][i].getChildByName('editboxEX').maxEnter) {
                return false;
            }
            return value;
        }
    },
    // =========================== 子类可重写接口 ===========================

    CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {},

    AdjustSendPack: function AdjustSendPack(sendPack) {
        return sendPack;
    },

    /**
     this.RemoveRadioSelect(sendPack, "kexuanwanfa");
     * 单选
     * @param {*} sendPack
     * @param {*} name
     */
    RemoveRadioSelect: function RemoveRadioSelect(sendPack, name) {
        sendPack[name] = -1;
        return sendPack;
    },

    /**
     this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
     * 多选
     * @param {*} sendPack
     * @param {*} name
     * @param {*} idx
     */
    RemoveMultiSelect: function RemoveMultiSelect(sendPack, name, idx) {
        var index = sendPack[name].indexOf(idx);
        if (-1 != index) {
            sendPack[name].splice(index, 1);
        }
        return sendPack;
    },

    OnUpdateTogglesLabel: function OnUpdateTogglesLabel(TogglesNode) {
        var isResetPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    }

});

module.exports = BaseChildCreateRoom;

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
        //# sourceMappingURL=BaseChildCreateRoom.js.map
        