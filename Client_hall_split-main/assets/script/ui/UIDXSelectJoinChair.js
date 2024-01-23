let app = require("app");
cc.Class({
    extends: cc.Component,
    properties: {
        default_headIcon: cc.SpriteFrame,
    },

    onLoad() {
        this.m_roomId = null;
        this.okF = null;
    },

    onShow(data, okF) {
        this.okF = okF;
        this.lb_room_info = cc.find('center_wanfa/lb_room_info', this.node);
        this.playerNodes = cc.find('playerNodes', this.node);
        let posList = data['roomPosInfoList'];
        //玩法
        let {cfg: gameRule} = data;
        const kexuan = ['超时弃牌', '头家反带', '允许中途加入', '头家闷吃'];
        this.m_roomId = data.roomKey;
        let str = ` 
房间号:${data.roomKey}
当前第${data.setID}/${gameRule.setCount}局
人数:${gameRule.playerMinNum}-${gameRule.playerNum}
`;/*
${gameRule.fangfei[0] == 0 ? '房主支付' : (gameRule.fangfei[0] == 1 ? 'AA支付' : '胜家支付')}*/
        if (gameRule.huangdiduijiangli) str += `皇帝对奖励
`;
        for (let i = 0; i < kexuan.length; i++) {
            if (gameRule.kexuanwanfa.includes(i)) {
                str += `${kexuan[i]}
`;
            } else {
                if (i == 2) {
                    str += `不${kexuan[i]}
`;
                }
            }
        }
        this.lb_room_info.getComponent(cc.Label).string = str;

        //
        try {
            for (let i in posList) {
                let pid = posList[i].pid;
                let HeadImageUrl = posList[i].headImageUrl;
                if (pid && HeadImageUrl) {
                    app.WeChatManager().InitHeroHeadImage(pid, HeadImageUrl);
                }
            }
        } catch (e) {
            app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, '获取用户头像错误:' + e.name + '|' + e.message);
            console.error('错误', e);
        }
        //
        for (let i in this.playerNodes.children) {
            try {
                let player_node = this.playerNodes.children[i];
                if (i >= gameRule.playerNum) {
                    player_node.active = false;
                    continue;
                }
                //
                let btn_head = player_node.getChildByName('btn_head');
                if (posList[i] == null || !posList[i].pid) {
                    player_node.getChildByName('img_txk').active = false;
                    player_node.getChildByName('bt_img_kw').active = true;
                    player_node.getChildByName('lb_name').getComponent(cc.Label).string = '';
                    btn_head.getComponent(cc.Sprite).spriteFrame = null;
                } else {
                    player_node.getChildByName('img_txk').active = true;
                    player_node.getChildByName('bt_img_kw').active = false;
                    //
                    player_node.getChildByName('lb_name').getComponent(cc.Label).string = posList[i].name;
                    let WeChatHeadImage = btn_head.getComponent("WeChatHeadImage");
                    if (posList[i].headImageUrl) {
                        WeChatHeadImage.ShowHeroHead(posList[i].pid,posList[i].headImageUrl);
                    } else {
                        btn_head.getComponent(cc.Sprite).spriteFrame = this.default_headIcon;
                    }
                }
            } catch (e) {
                app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, '错误了' + e.name + '|' + e.message);
                console.error('错误', e);
            }
        }
    },

    onSelectPos(event, i) {
        //0为退出
        if (i == 0) {
            this.node.active = false;
            return;
        }
        app.NetManager().SendPack("room.CBaseEnterRoom", {
            "roomKey": this.m_roomId,
            "posID": Number(i - 1)//位置减1 下标0起
        }, (args) => {
            console.warn('进入房间成功', args);
            //
            let {gameType} = args;
            let name = app.ShareDefine().GametTypeID2PinYin[gameType];
            app.Client.EnterSubGame(name,null,this.m_roomId);
            //
            this.okF && this.okF();
            this.node.active = false;
        }, () => {
            this.node.active = false;
        });
    },

    start() {
    },

    // update (dt) {},
});
