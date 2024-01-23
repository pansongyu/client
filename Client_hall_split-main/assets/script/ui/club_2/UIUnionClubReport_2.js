var app = require("app");
cc.Class({
    extends: require("UIUnionClubReport"),

    properties: {

    },

   
    UpdateScrollView:function(serverPack, isRefresh){
        let roomScrollView = this.node.getChildByName("mark");
        let content = roomScrollView.getChildByName("layout");
        if (isRefresh) {
            roomScrollView.getComponent(cc.ScrollView).scrollToTop();
            //content.removeAllChildren();
            this.DestroyAllChildren(content);
        }
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            let child = cc.instantiate(demo);
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
    },
   

});
