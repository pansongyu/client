var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    InitData:function (data) {
    	let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        let roomKey = "";
        if (typeof(data.roomKey)!="undefined") {
            roomKey = "房间号："+data.roomKey;
        }
        this.node.getChildByName("lb_roomKey").getComponent(cc.Label).string = roomKey;
        let msgTypeStr = "";
        if (data.execType == 120) {
            msgTypeStr = "对局获得";
        }else if (data.execType == 121) {
            msgTypeStr = "对局失去";
        }else{
            console.log("请确认是否是输赢比赛分消息："+data.execType);
        }
        this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.value;
        if (data.value >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.curValue;
    },
});