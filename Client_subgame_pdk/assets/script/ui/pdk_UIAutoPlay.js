var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        lb_notice:cc.Node,
    },

    // use this for initialization
    OnCreateInit: function () {
        
    },
    OnShow:function(secTotal = 0){
        let gameName = app.subGameName;
        if(gameName.indexOf("mj")>-1){
            this.lb_notice.active = true;
        }
        else {
            this.lb_notice.active = false;
        }
        this.CheckCanCancelAuto(secTotal);
    },
    //获取房间限时
    GetRoomXianShiTime: function(){
        let fangjianxianshi = app[app.subGameName.toUpperCase()+"Room"]().GetRoomConfigByProperty("fangjianxianshi");
        let roomXianShiObj = {0: 1000000, 1: 8, 2: 10, 3: 12, 4: 15, 5: 20}
        return roomXianShiObj[fangjianxianshi] * 60;//分钟转换秒数
    },
    //检测是否能点击取消
    CheckCanCancelAuto: function(secTotal){
        let roomXianShiTime = this.GetRoomXianShiTime();
        if(secTotal >= roomXianShiTime){
             this.node.getChildByName("btn_cancel").active = false;
        }else{
             this.node.getChildByName("btn_cancel").active = true;
        }
    },
    OnClick:function(btnName, btnNode){
        if('btn_cancel' == btnName){
            app[app.subGameName + "_GameManager"]().CancelAutoPlay();
            this.CloseForm();
        }
    }
});
