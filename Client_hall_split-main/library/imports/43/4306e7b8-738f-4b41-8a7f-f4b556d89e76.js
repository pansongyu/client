"use strict";
cc._RF.push(module, '4306ee4c49LQYp/9LVW2J52', 'yzchzChildCreateRoom');
// script/ui/uiGame/yzchz/yzchzChildCreateRoom.js

"use strict";

var _cc$Class;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        var xuanwang = this.GetIdxByKey('xuanwang');
        var fengDing = this.GetIdxByKey('fengDing');
        var fanxing = this.GetIdxByKey('fanxing');
        var xianhu = this.GetIdxByKey('xianhu');
        var piaofen = this.GetIdxByKey('piaofen');
        var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        var fangjian = this.GetIdxsByKey('fangjian');
        var xianShi = this.GetIdxByKey('xianShi');
        var jiesan = this.GetIdxByKey('jiesan');
        var gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "xuanwang": xuanwang,
            "fengDing": fengDing,
            "fanxing": fanxing,
            "xianhu": xianhu,
            "piaofen": piaofen,
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
}), _defineProperty(_cc$Class, "RefreshAllToggles", function RefreshAllToggles(gameType) {
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
    this.setHelpBtnPos();
    this.scroll_Right.scrollToTop();
    //如果可以滚动，显示滚动提示节点
    if (this.node_RightLayout.height > this.scroll_Right.node.height) {
        this.scrollTip.active = true;
    } else {
        this.scrollTip.active = false;
    }
    this.UpdateOnClickToggle();
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
        this.UpdateOnClickToggle();
        return;
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
}), _defineProperty(_cc$Class, "UpdateOnClickToggle", function UpdateOnClickToggle() {
    //勾选“双王”“三王”，只能选择“有王需自摸”；
    if (this.Toggles["xianhu"]) {
        if (!this.Toggles["xuanwang"][0].getChildByName("checkmark").active && !this.Toggles['xianhu'][3].getChildByName("checkmark").active) {
            this.Toggles['xianhu'][0].getChildByName("checkmark").active = false;
            this.Toggles['xianhu'][1].getChildByName("checkmark").active = false;
            this.Toggles['xianhu'][2].getChildByName("checkmark").active = false;
            this.Toggles['xianhu'][3].getChildByName("checkmark").active = true;
            this.UpdateLabelColor(this.Toggles['xianhu'][0].parent);
        }
    }
    //勾选“飘分”后才能勾选“庄家必飘”；
    // 仅二人场可选 “抽底20张”；
    // 仅四人场可选“随机分组”；
    if (this.Toggles["kexuanwanfa"]) {
        this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
        if (this.Toggles["piaofen"][0].getChildByName("checkmark").active) {
            this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active = false;
            //置灰
            if (this.Toggles['kexuanwanfa'][2].getChildByName("label")) {
                this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(180, 180, 180);
            }
        } else {
            //恢复
            if (this.Toggles['kexuanwanfa'][2].getChildByName("label")) {
                this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(158, 49, 16);
            }
        }
        if (!this.Toggles["renshu"][0].getChildByName("checkmark").active) {
            this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;
            // this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //置灰
            if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
                this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
            }
        } else {
            //恢复
            if (this.Toggles['kexuanwanfa'][4].getChildByName("label")) {
                this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
            }
        }
        if (!this.Toggles["renshu"][2].getChildByName("checkmark").active) {
            this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
            // this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //置灰
            if (this.Toggles['kexuanwanfa'][3].getChildByName("label")) {
                this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(180, 180, 180);
            }
        } else {
            //恢复
            if (this.Toggles['kexuanwanfa'][3].getChildByName("label")) {
                this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(158, 49, 16);
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