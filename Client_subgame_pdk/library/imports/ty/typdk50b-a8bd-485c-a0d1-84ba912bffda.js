"use strict";
cc._RF.push(module, 'typdk50b-a8bd-485c-a0d1-84ba912bffda', 'pdk_UICreatRoom');
// script/ui/pdk_UICreatRoom.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        prefab_Toggles: cc.Prefab,

        node_RightLayout: cc.Node,

        scroll_Right: cc.ScrollView,
        scrollTip: cc.Node,

        btnCreate: cc.Node,
        btnSave: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {
        this.roomcostConfig = this.SysDataManager.GetTableDict("roomcost");
        this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
        this.LocalDataManager = app.LocalDataManager();
        this.FormManager = app[app.subGameName + "_FormManager"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.Define = app[app.subGameName.toUpperCase() + "Define"]();

        this.RedColor1 = new cc.Color(0, 155, 46);
        this.RedColor2 = new cc.Color(158, 49, 16);
        this.WhiteClolor = new cc.Color(79, 79, 79);

        this.gameType = '';
        this.lastParentBtnIcon = null;
        this.lastChildBtnIcon = null;
        this.Toggles = {};

        this.addPrefabWidth = 320;
        this.rightPrefabSpacing = this.node_RightLayout.getComponent(cc.Layout).spacingY;

        cc.find('sp_room/rightFrame/mark', this.node).on(cc.Node.EventType.TOUCH_START, this.OnRightBgClick, this);

        this.RegEvent("CodeError", this.Event_CodeError, this);
    },
    //--------------显示函数-----------------
    OnShow: function OnShow(serverPack) {
        var gamename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : app.subGameName + '_zz';
        var clubData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        this.clubWinnerPayConsume = 0;
        this.gdToggleIndex = -1;
        this.gameType = gamename;
        this.clubData = clubData;
        this.FormManager.ShowForm(app.subGameName + "_UITop", app.subGameName + "_UICreatRoom", true, true, false);

        if (clubData && '' != clubData.enableGameType) this.gameType = clubData.enableGameType;

        this.RefreshAllToggles();
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
        //设置按钮
        this.ShowBtn();
    },

    Event_CodeError: function Event_CodeError(event) {
        var codeInfo = event;
        if (codeInfo["Code"] == this.ShareDefine.CLUB_CreateCfgMax) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_CLUB_CreateCfgMax');
            return;
        } else if (codeInfo["Code"] == 5111) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("获取IP有误，无法创建房间");
            return;
        } else if (codeInfo["Code"] == 5112) {
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("获取定位有误，无法创建房间");
            return;
        }
    },
    //获取创建缓存
    GetLocalConfig: function GetLocalConfig(configName, clubId, roomKey) {
        return cc.sys.localStorage.getItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + configName);
    },
    SetLocalConfig: function SetLocalConfig(configName, configInfo, clubId, roomKey) {
        cc.sys.localStorage.setItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + configName, configInfo);
    },
    RefreshAllToggles: function RefreshAllToggles() {
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
        this.node_RightLayout.removeAllChildren();

        var isHideZhadanfenshu = false;
        var isWuZha = false;
        var helpIndex = 1; //01是总帮助
        for (var key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                var node = null;
                var dataKey = this.gameCreateConfig[key].Key;
                var toggleCount = this.gameCreateConfig[key].ToggleCount;
                var AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
                if (this.clubData && 'fangfei' == dataKey) {
                    toggleCount = 3; //一个管理付，一个大赢家付
                    AtRows = [1, 2, 3];
                }
                node = cc.instantiate(this.prefab_Toggles);
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

                var fristPos = {
                    x: 0,
                    y: 0
                };
                var lastPos = {
                    x: 0,
                    y: 0
                };
                for (var _i = 1; _i <= toggleCount; _i++) {
                    var curNode = node.getChildByName('Toggle' + _i);
                    if (curNode) {
                        //位置宽高设置下
                        //记录下第一个的位置方便换行
                        if (1 == _i) {
                            fristPos.x = curNode.x;
                            fristPos.y = curNode.y;
                            lastPos.x = curNode.x;
                            lastPos.y = curNode.y;
                        } else if (1 < _i) {
                            //第1个以后都是新增的
                            if (AtRows[_i - 2] != AtRows[_i - 1]) {
                                curNode.x = fristPos.x;
                                curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
                                node.height = node.height + curNode.height + this.rightPrefabSpacing;
                            } else {
                                curNode.x = lastPos.x + this.addPrefabWidth;
                                curNode.y = lastPos.y;
                            }
                        }
                        lastPos.x = curNode.x;
                        lastPos.y = curNode.y;

                        curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
                        var checkNode = curNode.getChildByName('checkmark');
                        var icon_selectBg = curNode.getChildByName('icon_selectBg');
                        var showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
                        //尝试获取缓存
                        var clubId = 0;
                        var roomKey = '0';
                        var linshi = null;
                        if (this.clubData) {
                            clubId = this.clubData.clubId;
                            roomKey = this.clubData.gameIndex;
                            linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey);
                        }
                        //第一次创建俱乐部房间没有roomKey为0
                        if (!linshi) linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, '0');
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
                        if (this.clubData && 'fangfei' == dataKey) showList = [3];
                        if (dataKey == "kexuanwanfa") {
                            if (showList.indexOf("12") > -1) {
                                isWuZha = true;
                            }
                        }
                        if (dataKey == 'zhadansuanfa' && !isWuZha) {
                            if (linshi == 3) {
                                isHideZhadanfenshu = true;
                            }
                        }
                        //尝试获取缓存
                        if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length) this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

                        if (1 == this.gameCreateConfig[key].ToggleType) {
                            //多选的图片设置下(不放上面是因为路径)
                            var imgPath = 'texture/ui/' + app.subGameName + '_UICreateRoom/icon_checkin02';
                            node.addComponent(cc.Toggle);
                            this.SetNodeImageByFilePath(checkNode, imgPath);
                            this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/' + app.subGameName + '_UICreateRoom/icon_check02');
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
        if (!isWuZha) {
            this.Toggles['zhadanfenshu'][0].parent.active = !isHideZhadanfenshu;
        } else {
            this.Toggles['zhadansuanfa'][0].parent.active = false;
            this.Toggles['zhadanfenshu'][0].parent.active = false;
        }
        this.UpdateOnClickToggle();
    },

    OnClose: function OnClose() {},
    ShowBtn: function ShowBtn() {
        if (this.clubData) {
            this.btnCreate.active = false;
            this.btnSave.active = false;
            if (0 == this.clubData.gameIndex) this.btnCreate.active = true;else this.btnSave.active = true;
        } else {
            this.btnCreate.active = true;
            this.btnSave.active = false;
        }
    },
    UpdateTogglesLabel: function UpdateTogglesLabel(TogglesNode) {
        var curKey = TogglesNode.name.substring('Toggles_'.length, TogglesNode.name.length);
        var reg = /\/s/g;
        for (var key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                if (curKey == this.gameCreateConfig[key].Key) {
                    var AAfangfeiDatas = [];
                    var WinfangfeiDatas = [];
                    var FangZhufangfeiDatas = [];
                    var clubFangFeiDatas = [];
                    var clubWinFangFeiDatas = [];
                    var title = this.gameCreateConfig[key].Title.replace(reg, ' ');
                    TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
                    var descList = [];
                    if ('jushu' != curKey) {
                        //局数读roomcost
                        descList = this.gameCreateConfig[key].ToggleDesc.split(',');
                        if (this.clubData && 'fangfei' == curKey) descList = ['管理付', 'AA付', '胜家付'];
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
                                this.Toggles['jushu'][_i2].getChildByName('label').getComponent(cc.Label).string = curCostData[_i2].SetCount + '局';
                            }
                        }
                        if (this.Toggles['fangfei'] && -1 != jushuIndex) {
                            if (jushuIndex < publicCosts.length) {
                                AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

                                clubFangFeiDatas.push(publicCosts[jushuIndex].ClubCount);
                                clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
                            }
                            if (jushuIndex < SpiltCosts.length) {
                                AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

                                clubFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCount);
                                clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
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
                    if ("kexuanwanfa" == curKey) {
                        this.Toggles['kexuanwanfa'][this.Define.PDKSHOWCARDNUM].serverIdx = this.Define.SEVER_SHOWCARDNUM;
                        this.Toggles['kexuanwanfa'][this.Define.PDKBMUSTBOMB].serverIdx = this.Define.SEVER_BMUSTBOMB;
                        this.Toggles['kexuanwanfa'][this.Define.PDKMAXAAA].serverIdx = this.Define.SEVER_MAXAAA;
                        this.Toggles['kexuanwanfa'][this.Define.PDKHONGTAO10ZHANIAO].serverIdx = this.Define.SEVER_HONGTAO10ZHANIAO;
                        this.Toggles['kexuanwanfa'][this.Define.PDKFIRST3NOCHU3].serverIdx = this.Define.SEVER_FIRST3NOCHU3;
                        this.Toggles['kexuanwanfa'][this.Define.PDKSHOUDONGGUO].serverIdx = this.Define.SEVER_SHOUDONGGUO;
                        this.Toggles['kexuanwanfa'][this.Define.PDKAUTOREADY].serverIdx = this.Define.SEVER_AUTOREADY;
                        this.Toggles['kexuanwanfa'][this.Define.PDKWEIZHANGSUANFEN].serverIdx = this.Define.SEVER_WEIZHANGSUANFEN;
                        this.Toggles['kexuanwanfa'][this.Define.PDKWUZHA].serverIdx = this.Define.SEVER_WUZHA;
                        this.Toggles['kexuanwanfa'][this.Define.PDKAAA].serverIdx = this.Define.SEVER_AAA;
                        this.Toggles['kexuanwanfa'][this.Define.PDKFANGZUOBI].serverIdx = this.Define.SEVER_FANGZUOBI;
                        this.Toggles['kexuanwanfa'][this.Define.PDKBISAIFENBUDIYULING].serverIdx = this.Define.SEVER_BISAIFENBUDIYULING;
                        this.Toggles['kexuanwanfa'][this.Define.PDKZHIYINGDANGQIANSHENSHANGFEN].serverIdx = this.Define.SEVER_ZHIYINGDANGQIANSHENSHANGFEN;
                        if (this.Toggles['kexuanwanfa'][16]) this.Toggles['kexuanwanfa'][16].serverIdx = this.Define.SEVER_2A_22;
                    }

                    if (0 != AAfangfeiDatas.length) {
                        var needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
                        var ffNodes = this.Toggles['fangfei'];
                        var hasHideNode = false;
                        for (var s = 0; s < ffNodes.length; s++) {
                            var needNode = ffNodes[s].getChildByName('fangfeiNode');
                            needNode.active = true;
                            if (hasHideNode) {
                                needNode.parent.x = needNode.parent.x - this.addPrefabWidth;
                                hasHideNode = false;
                            }
                            //如果房费配的是0，则隐藏
                            if (needCount <= 0 && 1 == s) {
                                needNode.parent.active = false;
                                hasHideNode = true;
                                continue;
                            }
                            if (this.clubData == null) {
                                if (0 == s) needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];else if (1 == s) needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];else {
                                    needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
                                }
                            } else {
                                if (0 == s) needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + renshu[0] * AAfangfeiDatas[AAfangfeiDatas.length - 1];else if (1 == s) {
                                    needNode.getChildByName('icon').active = false;
                                    needNode.getChildByName('icon_qk').active = true;
                                    needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubFangFeiDatas[clubFangFeiDatas.length - 1];
                                    needNode.getChildByName('needNum').clubWinnerPayConsume = clubFangFeiDatas[clubFangFeiDatas.length - 1];
                                    ffNodes[s].getChildByName('editbox').active = true;
                                } else {
                                    needNode.getChildByName('icon').active = false;
                                    needNode.getChildByName('icon_qk').active = true;
                                    needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
                                    needNode.getChildByName('needNum').clubWinnerPayConsume = clubWinFangFeiDatas[clubWinFangFeiDatas.length - 1];
                                    ffNodes[s].getChildByName('editbox').active = true;
                                }
                            }
                        }
                    }
                }
            }
        }
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
        for (var key in this.roomcostConfig) {
            if (this.gameType.toUpperCase() == this.roomcostConfig[key].GameType && parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin && parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax) {
                costs.push(this.roomcostConfig[key]);
            }
        }
        if (0 == costs.length) this.ErrLog('roomcost Config error');
        return costs;
    },
    OnClickForm: function OnClickForm() {
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
    },

    //---------点击函数---------------------
    OnHelpBtnClick: function OnHelpBtnClick(event) {
        var btnNode = event.target;
        var btnName = btnNode.name;
        if (btnName.startsWith("btn_help")) {
            this.Click_btn_help(btnName, btnNode);
        }
    },
    OnToggleClick: function OnToggleClick(event) {
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
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
            // this.UpdateTogglesLabel(toggles);
            return;
        } else if ('kexuanwanfa' == key) {
            //每局先出黑桃3和首局先出黑桃3不能同时选择
            if (this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 1) {
                this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            } else if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 0) {
                this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
            }
            //每局先出黑桃3和首局先出黑桃3必须选择一项
            if (this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active && toggleIndex == 0) {
                return;
            }
            if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active && toggleIndex == 1) {
                return;
            }
            //3A不为炸不能选择3A为最大炸
            if (!this.Toggles['kexuanwanfa'][12].getChildByName('checkmark').active && toggleIndex == 5) {
                // app.SysNotifyManager().ShowSysMsg("未勾选3A为炸时，不可选择3A为最大炸");
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("3A不为炸");
                return;
            }
            if (toggleIndex == 12 && this.Toggles['kexuanwanfa'][toggleIndex].getChildByName('checkmark').active) {
                this.Toggles['kexuanwanfa'][5].getChildByName('checkmark').active = false;
            }
            if (toggleIndex == 5 || toggleIndex == 12) {
                if (this.Toggles['shoupai'][0].getChildByName('checkmark').active) {
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("15张玩法下没有3张A");
                    return;
                }
            }
            if (toggleIndex == 16) {
                if (this.Toggles['shoupai'][0].getChildByName('checkmark').active) {
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("15张玩法下没有双A双2");
                    return;
                }
            }
            //无炸
            if (toggleIndex == 11) {
                if (!this.Toggles['kexuanwanfa'][toggleIndex].getChildByName('checkmark').active) {
                    this.Toggles['zhadansuanfa'][0].parent.active = false;
                    this.Toggles['zhadanfenshu'][0].parent.active = false;
                } else {
                    this.Toggles['zhadansuanfa'][0].parent.active = true;
                    if (!this.Toggles['zhadansuanfa'][2].getChildByName('checkmark').active) {
                        this.Toggles['zhadanfenshu'][0].parent.active = true;
                    }
                }
            }
        } else if ('zhadansuanfa' == key) {
            if (toggleIndex == 2) {
                //选择炸弹不算分后，下方炸弹分数不可见
                this.Toggles['zhadanfenshu'][0].parent.active = false;
            } else {
                this.Toggles['zhadanfenshu'][0].parent.active = true;
            }
        } else if ('shoupai' == key) {
            if (toggleIndex == 0) {
                this.Toggles['kexuanwanfa'][5].getChildByName('checkmark').active = false;
                this.Toggles['kexuanwanfa'][12].getChildByName('checkmark').active = false;
                if (this.Toggles['kexuanwanfa'][16]) this.Toggles['kexuanwanfa'][16].getChildByName('checkmark').active = false;
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
    UpdateOnClickToggle: function UpdateOnClickToggle() {
        if (this.Toggles["sidai"]) {
            if (this.Toggles["kexuanwanfa"][4].getChildByName("checkmark").active) {
                this.Toggles['sidai'][0].parent.active = true;
            } else {
                this.Toggles['sidai'][0].parent.active = false;
            }
        }
    },
    ClearToggleCheck: function ClearToggleCheck(toggles, showIndexList) {
        for (var i = 0; i < toggles.length; i++) {
            toggles[i].getChildByName('checkmark').active = false;
        }if (showIndexList) {
            for (var _i4 = 0; _i4 < toggles.length; _i4++) {
                for (var j = 0; j < showIndexList.length; j++) {
                    if (_i4 == showIndexList[j]) toggles[_i4].getChildByName('checkmark').active = true;
                }
            }
        }
    },
    OnRightBgClick: function OnRightBgClick(event) {
        this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
    },
    //滑动结束
    OnScrollEnded: function OnScrollEnded() {
        this.scrollTip.active = false;
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_create' == btnName) {
            this.Click_btn_create(1);
            this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
        } else if ('btn_save' == btnName) {
            this.Click_btn_create(3);
            this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
        } else if ('btn_close' == btnName) {
            this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
            this.CloseForm();
        } else if ('rightFrame' == btnName) this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");else if (btnName == "btn_help01") {
            this.FormManager.ShowForm(app.subGameName + "_UIGameHelp");
            // this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
        } else if (btnName.startsWith("Toggle")) {
            this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
        } else {
            this.FormManager.CloseForm(app.subGameName + "_UIMessageTip");
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

    Click_btn_help: function Click_btn_help(btnName, btnNode) {
        var that = this;
        var gameType = this.gameType;
        var curIndex = btnName.substring('btn_help0'.length, btnName.length);
        var msgID = 'UIMessageTip_Help' + curIndex + '_' + gameType;
        this.FormManager.ShowForm(app.subGameName + "_UIMessageTip", msgID).then(function (formComponent) {
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
    close: function close() {
        this.FormManager.CloseForm("UICreatRoom");
    },
    Click_btn_buy: function Click_btn_buy() {
        var clientConfig = app[app.subGameName + "Client"].GetClientConfig();
        if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return;
        this.FormManager.ShowForm("UIStore");
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

    //创建房间
    Click_btn_create: function Click_btn_create(createType) {
        var isSpiltRoomCard = this.GetIdxByKey('fangfei');
        var renshu = [];
        if (isSpiltRoomCard) {
            renshu = this.getCurSelectRenShu();
        }
        renshu = this.getCurSelectRenShu(); //发给服务器人数用选的
        var needCostData = this.getCostData(renshu);
        if (!needCostData) {
            this.ErrLog('Click_btn_create Not CostData');
            return;
        }
        var hasRoomCard = app[app.subGameName + "_HeroManager"]().GetHeroProperty("roomCard");

        var jushuIndex = this.GetIdxByKey('jushu');
        if (-1 == jushuIndex || jushuIndex >= needCostData.length) {
            this.ErrLog('Click_btn_create error -1 == jushuIndex || jushuIndex >= needCostData.length');
            return;
        }
        var costCoun = needCostData[jushuIndex].CostCount;
        if (this.clubData == null) {
            if (hasRoomCard < costCoun) {
                //金币不足
                var desc = app[app.subGameName + "_SysNotifyManager"]().GetSysMsgContentByMsgID("MSG_NotRoomCard");
                app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
                app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", null, this.ShareDefine.ConfirmBuyGoTo, 0, 0, desc);
                return;
            }
        }
        var setCount = needCostData[jushuIndex].SetCount;
        var sendPack = {};
        var fangjianxianshi = this.GetIdxByKey('fangjianxianshi');
        var shoupai = this.GetIdxByKey('shoupai');
        var zhadansuanfa = this.GetIdxByKey('zhadansuanfa');
        var zhadanfenshu = this.GetIdxByKey('zhadanfenshu');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var kexuanwanfa = [];
        var fangjian = [];
        var gaoji = [];
        var sidai = [];
        kexuanwanfa.push(this.Define.SEVER_ROBDOOR);
        kexuanwanfa.push(this.Define.SEVER_DAI31);
        kexuanwanfa.push(this.Define.SEVER_DAI32);
        for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
            var isCheck = this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active;
            if (isCheck) {
                if (this.Toggles['kexuanwanfa'][i].serverIdx) {
                    kexuanwanfa.push(this.Toggles['kexuanwanfa'][i].serverIdx);
                } else {
                    kexuanwanfa.push(i);
                }
            }
        }
        for (var _i5 = 0; _i5 < this.Toggles['fangjian'].length; _i5++) {
            if (this.Toggles['fangjian'][_i5].getChildByName('checkmark').active) {
                fangjian.push(_i5);
            }
        }

        for (var _i6 = 0; _i6 < this.Toggles['gaoji'].length; _i6++) {
            if (this.Toggles['gaoji'][_i6].getChildByName('checkmark').active) {
                gaoji.push(_i6);
            }
        }
        for (var _i7 = 0; _i7 < this.Toggles['sidai'].length; _i7++) {
            //炸弹可拆
            if (this.Toggles['sidai'][_i7].getChildByName('checkmark').active && this.Toggles['kexuanwanfa'][4].getChildByName('checkmark').active) {
                sidai.push(_i7);
            }
        }
        if (zhadansuanfa == 2) {
            zhadanfenshu = -1;
        }
        if (shoupai != 1 && kexuanwanfa.indexOf(this.Define.SEVER_2A_22) >= 0) {
            kexuanwanfa.splice(kexuanwanfa.indexOf(this.Define.SEVER_2A_22), 1);
        }
        if (kexuanwanfa.indexOf(this.Define.SEVER_2A_22) >= 0) {
            if (kexuanwanfa.indexOf(this.Define.SEVER_MAXAAA) >= 0) {
                kexuanwanfa.splice(kexuanwanfa.indexOf(this.Define.SEVER_MAXAAA), 1);
            }
            if (kexuanwanfa.indexOf(this.Define.SEVER_AAA) >= 0) {
                kexuanwanfa.splice(kexuanwanfa.indexOf(this.Define.SEVER_AAA), 1);
            }
        }
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
            "shoupai": shoupai, //跑得快牌型     0-15张牌  1-16张牌
            "fangjianxianshi": fangjianxianshi,
            "zhadansuanfa": zhadansuanfa,
            "zhadanfenshu": zhadanfenshu,
            "jiesan": jiesan,
            "xianShi": xianShi,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,
            "sidai": sidai
        };

        var roomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
        //记录到本地缓存
        for (var item in sendPack) {
            var configData = sendPack[item];
            var dataType = typeof configData === "undefined" ? "undefined" : _typeof(configData);
            if (dataType == 'object') {
                var linshi2 = '0';
                for (var _i8 = 0; _i8 < configData.length; _i8++) {
                    if (_i8 == 0) {
                        linshi2 = configData[0] + 1;
                    } else {
                        linshi2 = linshi2 + ',' + (configData[_i8] + 1);
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
            if (this.clubData) {
                clubId = this.clubData.clubId;
                roomKey = this.clubData.gameIndex;
            }
            if (item == 'kexuanwanfa') {
                var configData2 = [];
                for (var _i9 = 0; _i9 < this.Toggles['kexuanwanfa'].length; _i9++) {
                    var _isCheck = this.Toggles['kexuanwanfa'][_i9].getChildByName('checkmark').active;
                    if (_isCheck) {
                        configData2.push(_i9 + 1);
                    }
                }
                //本地保存必须是字符串（真机上不支持别的类型）
                var localStr = '1';
                for (var _i10 = 0; _i10 < configData2.length; _i10++) {
                    if (_i10 == 0) {
                        localStr = configData2[0].toString();
                    } else {
                        localStr = localStr + ',' + configData2[_i10];
                    }
                }
                this.SetLocalConfig(item, localStr, clubId, roomKey);
            } else {
                this.SetLocalConfig(item, configData, clubId, roomKey);
            }
        }
        //记录到本地缓存
        if (roomMgr) {
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
            roomMgr.SendCreateRoom(sendPack);
            app[app.subGameName + "Client"].SetGameType(this.gameType);
            this.LocalDataManager.SetConfigProperty("SysSetting", "LastGameType", this.gameType);
        }
    },
    GetIdxByKey: function GetIdxByKey(key) {
        if (!this.Toggles[key]) return -1;
        for (var i = 0; i < this.Toggles[key].length; i++) {
            var mark = this.Toggles[key][i].getChildByName('checkmark').active;
            if (mark) return i;
        }
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if ("goBuyCard" == msgID) {
            // let clientConfig = app[app.subGameName + "Client"].GetClientConfig();
            // if (app.PackDefine.APPLE_CHECK == clientConfig["appPackType"]) return
            // app[app.subGameName + "_FormManager"]().ShowForm("UIStore");
            return;
        }
    }
});

cc._RF.pop();