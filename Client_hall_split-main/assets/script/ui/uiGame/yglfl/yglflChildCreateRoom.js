/*
创建房间子界面
 */
var app = require("app");

var yglflChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {},
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let yongpai = this.GetIdxByKey("yongpai");
        let wanfa = this.GetIdxByKey("wanfa");
        let difen = this.GetIdxByKey("difen");
        let fafen=this.GetIdxByKey('fafen');
        let fengDing = this.GetIdxByKey("fengDing");
        let suanjiang = this.GetIdxByKey("suanjiang");
        let chongguan = this.GetIdxByKey("chongguan");
        let duijia = this.GetIdxByKey("duijia");

        let xianShi = this.GetIdxByKey("xianShi");
        let jiesan = this.GetIdxByKey("jiesan");
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "yongpai": yongpai,
            "wanfa": wanfa,
            "difen": difen,
            "fafen": fafen,
            "fengDing": fengDing,
            "suanjiang": suanjiang,
            "chongguan": chongguan,
            "duijia": duijia,
            "xianShi": xianShi,
            "jiesan": jiesan,
            "kexuanwanfa": kexuanwanfa,
            "fangjian": fangjian,
            "gaoji": gaoji,

            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,

        }
        return sendPack;
    },
    UpdateOnClickToggle:function(){
        if (this.Toggles["fangjian"] && this.Toggles["fafen"]) {
            if (!this.Toggles["fafen"][4].getChildByName("checkmark").active) {
                this.Toggles["fangjian"][0].active = false;
                this.Toggles["fangjian"][0].getChildByName("checkmark").active = false;
                this.UpdateLabelColor(this.Toggles['fangjian'][0].parent);
            }else{
                this.Toggles["fangjian"][0].active = true;
            }
        }
    },
    OnToggleClick:function(event){
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
        let key = toggles.name.substring(('Toggles_').length,toggles.name.length);
        let toggleIndex = parseInt(toggle.name.substring(('Toggle').length,toggle.name.length)) - 1;
        let needClearList = [];
        let needShowIndexList = [];
        needClearList = this.Toggles[key];
        needShowIndexList.push(toggleIndex);
        if('jushu' == key || 'renshu' == key || 'fangfei' == key){
            this.ClearToggleCheck(needClearList,needShowIndexList);
            this.UpdateLabelColor(toggles);
            this.UpdateTogglesLabel(toggles, false);
            return;
        } else if ('kexuanwanfa' == key) {
            if(toggleIndex == 0 && !this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active){
                if(!this.Toggles['wanfa'][1].getChildByName('checkmark').active){
                    this.Toggles['wanfa'][0].getChildByName('checkmark').active = false;
                    this.Toggles['wanfa'][1].getChildByName('checkmark').active = true;
                    this.UpdateLabelColor(this.Toggles["wanfa"][0].parent);
                    // this.UpdateLabelColor(this.Toggles["wanfa"][1].parent);
                }
            }
        } else if("fafen" == key){
            if(toggleIndex != 4 && this.Toggles["xianShi"][0].getChildByName("checkmark").active){
                this.Toggles["xianShi"][0].getChildByName("checkmark").active = false;
                this.Toggles["xianShi"][1].getChildByName("checkmark").active = true;
                this.UpdateLabelColor(this.Toggles['xianShi'][0].parent);
                this.UpdateLabelColor(this.Toggles['xianShi'][1].parent);
            }
        }
        else if("xianShi" == key){
            if(toggleIndex == 0 && !this.Toggles["fafen"][4].getChildByName("checkmark").active){
                for (let i = 0; i < this.Toggles["fafen"].length; i++) {
                    this.Toggles["fafen"][i].getChildByName("checkmark").active = (i == 4);
                    this.UpdateLabelColor(this.Toggles['fafen'][i].parent);
                }
            }
        }else if("wanfa" == key){
            if(toggleIndex == 0 && this.Toggles['kexuanwanfa'][0].getChildByName('checkmark').active){
                app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("比奖模式下无法选中奖励两家");
                return;
            }
        }
        if(toggles.getComponent(cc.Toggle)){//复选框
            needShowIndexList = [];
            for(let i=0;i<needClearList.length;i++){
                let mark = needClearList[i].getChildByName('checkmark').active;
                //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
                if(mark && i != toggleIndex){
                    needShowIndexList.push(i);
                }
                //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
                else if(!mark && i == toggleIndex){
                    needShowIndexList.push(i);
                }
            }
        }
        this.ClearToggleCheck(needClearList,needShowIndexList);
        this.UpdateLabelColor(toggles,'fangfei' == key ? true : false);
        this.UpdateOnClickToggle();
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

                let fristPos = { x: 0, y: 0 };
                let lastPos = { x: 0, y: 0 };
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

    // 多选
    GetIdxsByKey: function (key) {
        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },
    AdjustSendPack: function (sendPack) {
        //     不可吃，仅二人、三人场可选；
        return sendPack;
    },
    
});

module.exports = yglflChildCreateRoom;