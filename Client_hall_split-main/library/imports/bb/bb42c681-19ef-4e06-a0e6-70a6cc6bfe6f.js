"use strict";
cc._RF.push(module, 'bb42caBGe9OBqDmcKbMa/5v', 'UIDXSelectJoinChair');
// script/ui/UIDXSelectJoinChair.js

'use strict';

var app = require("app");
cc.Class({
    extends: cc.Component,
    properties: {
        default_headIcon: cc.SpriteFrame
    },

    onLoad: function onLoad() {
        this.m_roomId = null;
        this.okF = null;
    },
    onShow: function onShow(data, okF) {
        this.okF = okF;
        this.lb_room_info = cc.find('center_wanfa/lb_room_info', this.node);
        this.playerNodes = cc.find('playerNodes', this.node);
        var posList = data['roomPosInfoList'];
        //玩法
        var gameRule = data.cfg;

        var kexuan = ['超时弃牌', '头家反带', '允许中途加入', '头家闷吃'];
        this.m_roomId = data.roomKey;
        var str = ' \n\u623F\u95F4\u53F7:' + data.roomKey + '\n\u5F53\u524D\u7B2C' + data.setID + '/' + gameRule.setCount + '\u5C40\n\u4EBA\u6570:' + gameRule.playerMinNum + '-' + gameRule.playerNum + '\n'; /*
                                                                                                                                                                                                               ${gameRule.fangfei[0] == 0 ? '房主支付' : (gameRule.fangfei[0] == 1 ? 'AA支付' : '胜家支付')}*/
        if (gameRule.huangdiduijiangli) str += '\u7687\u5E1D\u5BF9\u5956\u52B1\n';
        for (var i = 0; i < kexuan.length; i++) {
            if (gameRule.kexuanwanfa.includes(i)) {
                str += kexuan[i] + '\n';
            } else {
                if (i == 2) {
                    str += '\u4E0D' + kexuan[i] + '\n';
                }
            }
        }
        this.lb_room_info.getComponent(cc.Label).string = str;

        //
        try {
            for (var _i in posList) {
                var pid = posList[_i].pid;
                var HeadImageUrl = posList[_i].headImageUrl;
                if (pid && HeadImageUrl) {
                    app.WeChatManager().InitHeroHeadImage(pid, HeadImageUrl);
                }
            }
        } catch (e) {
            app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, '获取用户头像错误:' + e.name + '|' + e.message);
            console.error('错误', e);
        }
        //
        for (var _i2 in this.playerNodes.children) {
            try {
                var player_node = this.playerNodes.children[_i2];
                if (_i2 >= gameRule.playerNum) {
                    player_node.active = false;
                    continue;
                }
                //
                var btn_head = player_node.getChildByName('btn_head');
                if (posList[_i2] == null || !posList[_i2].pid) {
                    player_node.getChildByName('img_txk').active = false;
                    player_node.getChildByName('bt_img_kw').active = true;
                    player_node.getChildByName('lb_name').getComponent(cc.Label).string = '';
                    btn_head.getComponent(cc.Sprite).spriteFrame = null;
                } else {
                    player_node.getChildByName('img_txk').active = true;
                    player_node.getChildByName('bt_img_kw').active = false;
                    //
                    player_node.getChildByName('lb_name').getComponent(cc.Label).string = posList[_i2].name;
                    var WeChatHeadImage = btn_head.getComponent("WeChatHeadImage");
                    if (posList[_i2].headImageUrl) {
                        WeChatHeadImage.ShowHeroHead(posList[_i2].pid, posList[_i2].headImageUrl);
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
    onSelectPos: function onSelectPos(event, i) {
        var _this = this;

        //0为退出
        if (i == 0) {
            this.node.active = false;
            return;
        }
        app.NetManager().SendPack("room.CBaseEnterRoom", {
            "roomKey": this.m_roomId,
            "posID": Number(i - 1) //位置减1 下标0起
        }, function (args) {
            console.warn('进入房间成功', args);
            //
            var gameType = args.gameType;

            var name = app.ShareDefine().GametTypeID2PinYin[gameType];
            app.Client.EnterSubGame(name, null, _this.m_roomId);
            //
            _this.okF && _this.okF();
            _this.node.active = false;
        }, function () {
            _this.node.active = false;
        });
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();