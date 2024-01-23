"use strict";
cc._RF.push(module, 'bb9cc1Qgd5AbpDvve00++5C', 'UIUnionClubReport_2');
// script/ui/club_2/UIUnionClubReport_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("UIUnionClubReport"),

    properties: {},

    UpdateScrollView: function UpdateScrollView(serverPack, isRefresh) {
        var roomScrollView = this.node.getChildByName("mark");
        var content = roomScrollView.getChildByName("layout");
        if (isRefresh) {
            roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            //content.removeAllChildren();
            this.DestroyAllChildren(content);
        }
        var demo = this.node.getChildByName("demo");
        demo.active = false;
        for (var i = 0; i < serverPack.length; i++) {
            var child = cc.instantiate(demo);
            child.getChildByName("lb_date").getComponent(cc.Label).string = serverPack[i].dateTime;
            child.getChildByName("lb_wanjiashu").getComponent(cc.Label).string = serverPack[i].sizePlayer;
            child.getChildByName("lb_jushu").getComponent(cc.Label).string = serverPack[i].roomSize;

            child.getChildByName("lb_huoyuedu").getComponent(cc.Label).string = serverPack[i].scorePoint;
            child.getChildByName("lb_costZS").getComponent(cc.Label).string = serverPack[i].consume;
            child.getChildByName("lb_winlostSP").getComponent(cc.Label).string = serverPack[i].zhongZhiTotalPoint;
            child.getChildByName("lb_singleSP").getComponent(cc.Label).string = serverPack[i].zhongZhiFinalTotalPoint;
            child.getChildByName("lb_sumScore").getComponent(cc.Label).string = serverPack[i].sumSportsPoint;

            //child.getChildByName("lb_sumTaoTaiScore").getComponent(cc.Label).string = serverPack[i].zhongZhiEliminatePointSum;
            child.active = true;
            content.addChild(child);
        }
    }

});

cc._RF.pop();