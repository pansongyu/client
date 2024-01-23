var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    InitData:function (data) {
    	let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        let execClubNameStr = "";
        let execClubSignStr = "";

        let execNameStr = "";
        let execIdStr = "";
        if (typeof(data.msg)!="undefined" && typeof(data.roomKey)!="undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.pid,data.msg);
            execIdStr = "ID:"+data.roomKey;
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;
        this.node.getChildByName("lb_execUserId").getComponent(cc.Label).string = execIdStr;

        let userNameStr = "";
        let userIdStr = "";
        if (typeof(data.name)!="undefined" && typeof(data.pid)!="undefined") {
            userNameStr = app.ComTool().GetBeiZhuName(data.pid,data.name);
            userIdStr = "ID:"+data.pid;
        }
        this.node.getChildByName("lb_userName").getComponent(cc.Label).string = userNameStr;
        this.node.getChildByName("lb_userId").getComponent(cc.Label).string = userIdStr;
        //类型变化
        if (data.execType == 1022) {
            this.node.getChildByName("btn_jtcheng1").getChildByName("lb_opType").getComponent(cc.Label).string = "踢出";
            this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = "踢出亲友圈";
        }else if (data.execType == 1023) {
            this.node.getChildByName("btn_jtcheng1").getChildByName("lb_opType").getComponent(cc.Label).string = "加入";
            this.node.getChildByName("btn_lv").getChildByName("lb_msgType").getComponent(cc.Label).string = "加入亲友圈";
        }
    },
});