"use strict";
cc._RF.push(module, 'c1a19uzeR9DaI25297EbTkm', 'UIPromoterAllReport_2');
// script/ui/club_2/UIPromoterAllReport_2.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("UIPromoterAllReport"),

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
            child.getChildByName("lb_jushu").getComponent(cc.Label).string = serverPack[i].setCount;
            child.getChildByName("lb_dayingjia").getComponent(cc.Label).string = serverPack[i].winner;
            //child.getChildByName("lb_scorePoint").getComponent(cc.Label).string = serverPack[i].scorePoint;
            child.getChildByName("lb_costZuan").getComponent(cc.Label).string = serverPack[i].consume;
            child.getChildByName("lb_costSP").getComponent(cc.Label).string = serverPack[i].promotionShareValue;
            child.getChildByName("lb_zhongZhiTotalPoint").getComponent(cc.Label).string = serverPack[i].zhongZhiTotalPoint;
            // child.getChildByName("lb_sumScore").getComponent(cc.Label).string = serverPack[i].totalPointByZhongZhi;
            child.getChildByName("lb_sumTable").getComponent(cc.Label).string = serverPack[i].table;
            child.getChildByName("lb_lastSumScore").getComponent(cc.Label).string = serverPack[i].zhongZhiFinalTotalPoint;
            child.active = true;
            content.addChild(child);
        }
    }
});

cc._RF.pop();