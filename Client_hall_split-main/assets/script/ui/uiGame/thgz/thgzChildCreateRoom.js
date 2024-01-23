/*
 创建房间子界面
 */
var app = require("app");

var thgzChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let moshi = this.GetIdxByKey('moshi');
        let jiangfen = this.GetIdxByKey('jiangfen');
        let wujiang = this.GetIdxByKey('wujiang');
        let jiesansuanjiang = this.GetIdxByKey('jiesansuanjiang');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let jiawang = this.GetIdxByKey('jiawang');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let sudu = this.GetIdxByKey('sudu');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "moshi": moshi,
            "jiangfen": jiangfen,
            "wujiang": wujiang,
            "jiesansuanjiang": jiesansuanjiang,
            "kexuanwanfa": kexuanwanfa,
            "jiawang": jiawang,
            "fangjian": fangjian,
            "xianShi": xianShi,
            "sudu": sudu,
            "jiesan": jiesan,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    //需要自己重写
    AdjustSendPack: function (sendPack) {
        if (sendPack.xianShi == 0) {
            // this.RemoveMultiSelect(sendPack, "kexuanwanfa", 1);
        }
        if (sendPack.xianShi != 4) {
            this.RemoveRadioSelect(sendPack, "sudu");
        }
        return sendPack;
    },
    RefreshAllToggles: function (gameType) {
        this.gameType = gameType;
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
        //this.node_RightLayout.removeAllChildren();
        this.DestroyAllChildren(this.node_RightLayout);
        let isHideZhadanfenshu = false;

        let helpIndex = 1;//01是总帮助
        for (let key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                let node = null;
                let dataKey = this.gameCreateConfig[key].Key;
                let toggleCount = this.gameCreateConfig[key].ToggleCount;
                let AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
                let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                if (this.clubData && 'fangfei' == dataKey) {
                    toggleCount = 1;  //一个管理付，一个大赢家付
                    AtRows = [1];
                } else if (this.unionData && 'fangfei' == dataKey) {
                    toggleCount = 1;  //一个盟主付`
                    AtRows = [1];
                }

                node = cc.instantiate(this.prefab_Toggles);
                node.active = true;
                //需要判断添更加多的Toggle
                let addCount = toggleCount - 1;
                if (addCount < 0)
                    this.ErrLog('gameCreate Config ToggleCount error');
                else {
                    for (let i = 2; i <= toggleCount; i++) {
                        let prefabNode = node.getChildByName('Toggle1');
                        let newNode = cc.instantiate(prefabNode);
                        newNode.name = 'Toggle' + i;
                        node.addChild(newNode);
                    }
                }

                node.name = 'Toggles_' + dataKey;
                node.x = 10;
                let nodeHelp = node.getChildByName('btn_help');
                nodeHelp.active = false;
                if (this.gameCreateConfig[key].IsShowHelp) {
                    nodeHelp.name = 'btn_help0' + helpIndex;
                    nodeHelp.on('click', this.OnHelpBtnClick, this);
                    nodeHelp.active = true;
                    helpIndex++;
                }


                if (!this.Toggles[dataKey])
                    this.Toggles[dataKey] = [];

                let fristPos = {x: 0, y: 0};
                let lastPos = {x: 0, y: 0};
                for (let i = 1; i <= toggleCount; i++) {
                    let curNode = node.getChildByName('Toggle' + i);
                    curNode.isFirstNode = false;
                    if (curNode) {
                        //位置宽高设置下
                        //记录下第一个的位置方便换行
                        if (1 == i) {
                            fristPos.x = curNode.x;
                            fristPos.y = curNode.y;
                            lastPos.x = curNode.x;
                            lastPos.y = curNode.y;
                            curNode.isFirstNode = true;
                        }
                        else if (1 < i) {//第1个以后都是新增的
                            if (AtRows[i - 2] != AtRows[i - 1]) {
                                curNode.x = fristPos.x;
                                curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
                                node.height = node.height + curNode.height + this.rightPrefabSpacing;
                                curNode.isFirstNode = true;
                            }
                            else {
                                // if ('fangfei' == dataKey) {
                                //     //房费节点比较长，需要再位移一点
                                //     curNode.x = lastPos.x + this.addPrefabWidth + 80;
                                // }else{
                                //     curNode.x = lastPos.x + this.addPrefabWidth;
                                // }
                                curNode.x = lastPos.x + parseInt(spacing[i - 1]);
                                curNode.y = lastPos.y;
                            }
                        }
                        lastPos.x = curNode.x;
                        lastPos.y = curNode.y;

                        curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
                        let checkNode = curNode.getChildByName('checkmark');
                        //默认不勾选
                        checkNode.active = false;
                        let icon_selectBg = curNode.getChildByName('icon_selectBg');
                        let showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
                        //尝试获取缓存
                        let clubId = 0;
                        let roomKey = '0';
                        let unionId = 0;
                        let unionRoomKey = '0';
                        let linshi = null;
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
                            if (!linshi)
                                linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, '0', unionId, unionRoomKey);
                            if (linshi) {
                                let linshiList = linshi.split(',');
                                for (let j = 0; j < linshiList.length; j++) {//缓存可能出BUG(配置删除了按钮数量)
                                    if (parseInt(linshiList[j]) > toggleCount) {
                                        linshiList = ['1'];
                                        break;
                                    }
                                }
                                showList = linshiList;
                            }
                        } else {
                            let cfgDataList = this.unionData.cfgData.bRoomConfigure[dataKey];
                            if (typeof (cfgDataList) == "object") {
                                showList = [];
                                for (let j = 0; j < cfgDataList.length; j++) {
                                    //索引要加1
                                    let realIndex = cfgDataList[j] + 1;
                                    showList.push(realIndex);
                                }
                            } else if (typeof (cfgDataList) == "number") {
                                //单选，就一个数字，加入数组
                                let showListTemp = [];
                                //索引要加1
                                showListTemp.push(cfgDataList + 1);
                                showList = showListTemp;
                            }
                        }

                        if (this.clubData && 'fangfei' == dataKey)
                            showList = [1];
                        if (this.unionData && 'fangfei' == dataKey)
                            showList = [1];

                        //尝试获取缓存
                        if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length)
                            this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

                        if (1 == this.gameCreateConfig[key].ToggleType) {//多选的图片设置下(不放上面是因为路径)
                            let imgPath = 'texture/ui/createRoom/icon_checkin02';
                            node.addComponent(cc.Toggle);
                            this.SetNodeImageByFilePath(checkNode, imgPath);
                            this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/createRoom/icon_check02');
                        }

                        for (let j = 0; j < showList.length; j++) {
                            if (i == parseInt(showList[j])) {
                                checkNode.active = true;
                                break;
                            }
                            else {
                                checkNode.active = false;
                            }
                        }
                        this.Toggles[dataKey].push(curNode);
                    }
                }
                this.UpdateTogglesLabel(node);
                this.UpdateLabelColor(node);
                this.node_RightLayout.addChild(node);
                let line = this.scroll_Right.node.getChildByName('line');
                let addline = cc.instantiate(line);
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
        } else if ('kexuanwanfa' == key) {
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
        this.UpdateOnClickToggle();
    },
    UpdateOnClickToggle: function () {
        //	5人仅限“冲关模式”可选；
        if (this.Toggles["moshi"]) {
            if (this.Toggles["renshu"][3].getChildByName("checkmark").active) {
                let toggles = this.Toggles["moshi"][0].parent;
                let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
                this.ClearToggleCheck(this.Toggles["moshi"], [2]);
                this.UpdateLabelColor(toggles, "fangfei" == key ? true : false);
                this.Toggles["moshi"][0].active = false;
                this.Toggles["moshi"][1].active = false;
            } else {
                this.Toggles["moshi"][0].active = true;
                this.Toggles["moshi"][1].active = true;
            }
        }
        if (this.Toggles["wujiang"]) {
            if (this.Toggles["moshi"][2].getChildByName("checkmark").active) {
                let toggles = this.Toggles["wujiang"][0].parent;
                let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
                this.ClearToggleCheck(this.Toggles["wujiang"], [0]);
                this.UpdateLabelColor(toggles, "fangfei" == key ? true : false);
                this.Toggles["wujiang"][0].active = true;
                this.Toggles["wujiang"][1].active = false;
                this.Toggles["wujiang"][2].active = false;
            } else {
                this.Toggles["wujiang"][0].active = true;
                this.Toggles["wujiang"][1].active = true;
                this.Toggles["wujiang"][2].active = true;
            }
        }
        if (this.Toggles["jiawang"]) {
            /*if (this.Toggles["moshi"][2].getChildByName("checkmark").active) {
             let toggles = this.Toggles["jiawang"][0].parent;
             let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
             this.ClearToggleCheck(this.Toggles["jiawang"], [0]);
             this.UpdateLabelColor(toggles, "fangfei" == key ? true : false);
             this.Toggles["jiawang"][0].active = true;
             this.Toggles["jiawang"][1].active = false;
             this.Toggles["jiawang"][2].active = false;
             this.Toggles["jiawang"][3].active = false;
             } else {
             this.Toggles["jiawang"][0].active = true;
             this.Toggles["jiawang"][1].active = true;
             this.Toggles["jiawang"][2].active = true;
             this.Toggles["jiawang"][3].active = true;
             }*/
        }
        if (this.Toggles["kexuanwanfa"]) {
            /*if (this.Toggles["xianShi"][0].getChildByName("checkmark").active) {
             this.Toggles["kexuanwanfa"][1].active = false;
             } else {
             this.Toggles["kexuanwanfa"][1].active = true;
             }*/
            if (typeof (this.unionData) != "undefined" && this.unionData != null) {
                if (this.unionData.unionId > 0) {
                    this.Toggles["kexuanwanfa"][4].active = true;
                    this.Toggles["kexuanwanfa"][5].active = true;
                }
            } else {
                this.Toggles["kexuanwanfa"][4].active = false;
                this.Toggles["kexuanwanfa"][5].active = false;
            }
        }
        if (this.Toggles["sudu"]) {
            if (this.Toggles["xianShi"][4].getChildByName("checkmark").active) {
                this.Toggles["sudu"][0].parent.active = true;
            } else {
                this.Toggles["sudu"][0].parent.active = false;
            }
        }
    },
});

module.exports = thgzChildCreateRoom;