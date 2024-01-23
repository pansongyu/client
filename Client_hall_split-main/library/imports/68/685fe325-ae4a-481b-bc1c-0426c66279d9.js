"use strict";
cc._RF.push(module, '685feMlrkpIG7wcBCbGYnnZ', 'UIClubMain_1');
// script/ui/club_1/UIClubMain_1.js

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
        if (clubData.skinType != 1) {
            app.FormManager().CloseAllClubForm();
            app.ClubManager().ShowClubFrom();
            // app.SysNotifyManager().ShowSysMsg("盟主切换了赛事皮肤，请重新打开房间列表界面", [], 4);
        }
    },
    mySkinType: function mySkinType() {
        return '1';
    },
    ChangeTableColor: function ChangeTableColor(club, tagId, gameId) {
        var clubData = app.ClubManager().GetClubDataByClubID(this.nowClubID);
        var cityInfo = this.selectCityConfig[clubData.cityId];
        var cityGameList = cityInfo.Game.split(",");
        var gameIndex = cityGameList.indexOf(gameId.toString());
        if (gameIndex == -1) {
            return;
        }
        var ClubTb = this.GetClubTb();
        if (ClubTb == 4) {
            //幸运的桌子
            var bg_table_color = club.getChildByName("bg_table_color"); //麻将
            if (bg_table_color) {
                bg_table_color.getComponent(cc.Sprite).spriteFrame = this.table_majiang_xinyung[gameIndex % 10];
                return;
            }
            var bg_table_color_puke = club.getChildByName("bg_table_color_puke"); //扑克
            if (bg_table_color_puke) {
                bg_table_color_puke.getComponent(cc.Sprite).spriteFrame = this.table_puke_xinyung[gameIndex % 10];
                return;
            }
            var bg_table_color_dazhuo = club.getChildByName("bg_table_color_dazhuo"); //5人以上桌子
            if (bg_table_color_dazhuo) {
                bg_table_color_dazhuo.getComponent(cc.Sprite).spriteFrame = this.table_dazhuo_xinyung[gameIndex % 10];
                return;
            }
        }
    }
});

cc._RF.pop();