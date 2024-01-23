"use strict";
cc._RF.push(module, 'b2799DsOLVHiIvC2OwIGX/R', 'UIClubMainDefault');
// script/ui/club/UIClubMainDefault.js

"use strict";

/*
皮肤界面
 */
var app = require("app");

cc.Class({
    extends: require("UIClubMainBase"),

    properties: {
        roomBg: [cc.SpriteFrame],
        roomBg_zhongzhi_green: [cc.SpriteFrame],
        roomBg_zhongzhi_blue: [cc.SpriteFrame],
        defaultHead: cc.Prefab,
        left_on: cc.SpriteFrame,
        left_off: cc.SpriteFrame,
        clubBg: [cc.SpriteFrame],
        icon_signal: [cc.SpriteFrame],
        btn_outRaceSprite: [cc.SpriteFrame],
        zhuozi: [cc.Prefab],
        zhuozi_xingyun_puke: [cc.Prefab],
        zhuozi_xingyun: [cc.Prefab],

        zhuozi_zhongzhi: [cc.Prefab],

        table_majiang_xinyung: [cc.SpriteFrame],
        table_puke_xinyung: [cc.SpriteFrame],
        table_dazhuo_xinyung: [cc.SpriteFrame],
        icon_benquan: cc.Prefab
    },
    //需要重写
    CheckSkinType: function CheckSkinType(clubData) {
        if (clubData.unionId > 0) {
            //必须是赛事才有此功能
            var ClubNewCuntom = cc.sys.localStorage.getItem("ClubNewCuntom");
            if (ClubNewCuntom != "1") {
                //玩家没有自己设置
                if (clubData.skinTable > -1) {
                    cc.sys.localStorage.setItem("ClubNewTb", clubData.skinTable); //将盟主设置的赋值给玩家
                }
                if (clubData.skinBackColor > -1) {
                    cc.sys.localStorage.setItem("ClubNewBg", clubData.skinBackColor); //将盟主设置的赋值给玩家
                    this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.clubBg[clubData.skinBackColor];
                }
            }
        }
        if (clubData.skinType != 0) {
            app.FormManager().CloseAllClubForm();
            app.ClubManager().ShowClubFrom();
            // app.SysNotifyManager().ShowSysMsg("盟主切换了赛事皮肤，请重新打开房间列表界面", [], 4);
        }
    },
    mySkinType: function mySkinType() {
        return '0';
    },
    isShowLiXian: function isShowLiXian(islixian) {
        //这个要显示离线
        return islixian;
    }
});

cc._RF.pop();