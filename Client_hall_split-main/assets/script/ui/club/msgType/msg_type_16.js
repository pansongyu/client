var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
    },
    InitData:function (data) {
    	let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        let execNameStr = "";
        if (typeof(data.msg)!="undefined" && typeof(data.roomKey)!="undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.roomKey,data.msg)+"(ID:"+data.roomKey+")";
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;

        let NameStr = "";
        if (typeof(data.name)!="undefined" && typeof(data.pid)!="undefined") {
            NameStr = app.ComTool().GetBeiZhuName(data.pid,data.name)+"(ID:"+data.pid+")";
        }
        this.node.getChildByName("lb_UserName").getComponent(cc.Label).string = NameStr;

        let oldNameStr = "";
        if (typeof(data.execName)!="undefined" && typeof(data.execPid)!="undefined") {
            oldNameStr = app.ComTool().GetBeiZhuName(data.execPid,data.execName)+"(ID:"+data.execPid+")";
        }
        this.node.getChildByName("lb_old").getComponent(cc.Label).string = oldNameStr;

        let newNameStr = "";
        if (typeof(data.pidCurValue)!="undefined" && typeof(data.pidPreValue)!="undefined") {
            newNameStr = app.ComTool().GetBeiZhuName(data.pidPreValue,data.pidCurValue)+"(ID:"+data.pidPreValue+")";
        }
        this.node.getChildByName("lb_new").getComponent(cc.Label).string = newNameStr;
    },
});