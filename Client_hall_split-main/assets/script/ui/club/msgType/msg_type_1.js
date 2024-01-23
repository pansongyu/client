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
        if (typeof(data.execClubName)!="undefined" && typeof(data.execClubSign)!="undefined") {
            execClubNameStr = "圈:"+data.execClubName;
            execClubSignStr = "ID:"+data.execClubSign;
        }
        this.node.getChildByName("lb_execClubName").getComponent(cc.Label).string = execClubNameStr;
        this.node.getChildByName("lb_execClubId").getComponent(cc.Label).string = execClubSignStr;

        let execNameStr = "";
        let execIdStr = "";
        if (typeof(data.execName)!="undefined" && typeof(data.execPid)!="undefined") {
            execNameStr = app.ComTool().GetBeiZhuName(data.pid,data.execName);
            execIdStr = "ID:"+data.execPid;
        }
        this.node.getChildByName("lb_execUserName").getComponent(cc.Label).string = execNameStr;
        this.node.getChildByName("lb_execUserId").getComponent(cc.Label).string = execIdStr;

        this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.execPidValue;
        if (data.execPidValue >= 0) {
            this.node.getChildByName("lb_execValue").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_execValue").color = new cc.Color(248, 57, 57);
        }
        //如果不是自己隱藏剩余的数据
        let selfPid = app.HeroManager().GetHeroProperty("pid");
        if (data.execPid == selfPid) {
            this.node.getChildByName("img_sheng").active = true;
            this.node.getChildByName("lb_execCurValue").getComponent(cc.Label).string = data.execPidCurValue;
        }else{
            this.node.getChildByName("img_sheng").active = false;
            this.node.getChildByName("lb_execCurValue").getComponent(cc.Label).string = "";
        }

        let clubNameStr = "";
        let clubSignStr = "";
        if (typeof(data.clubName)!="undefined" && typeof(data.clubSign)!="undefined") {
            clubNameStr = "圈:"+data.clubName;
            clubSignStr = "ID:"+data.clubSign;
        }
        this.node.getChildByName("lb_clubName").getComponent(cc.Label).string = clubNameStr;
        this.node.getChildByName("lb_clubId").getComponent(cc.Label).string = clubSignStr;

        let userNameStr = "";
        let userIdStr = "";
        if (typeof(data.name)!="undefined" && typeof(data.pid)!="undefined") {
            userNameStr = app.ComTool().GetBeiZhuName(data.pid,data.name);
            userIdStr = "ID:"+data.pid;
        }
        this.node.getChildByName("lb_userName").getComponent(cc.Label).string = userNameStr;
        this.node.getChildByName("lb_userId").getComponent(cc.Label).string = userIdStr;


        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.pidValue;
        if (data.pidValue >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.pidCurValue;
    },
});