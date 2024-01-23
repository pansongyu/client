var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        jiantouSprite:[cc.SpriteFrame],
        msgTypeSprite:[cc.SpriteFrame],
    },
    InitData:function (data) {
    	let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        let jianTouNode = this.node.getChildByName("btn_jtcheng1");
        let msgTypeNode = this.node.getChildByName("btn_lv");
        let msgTypeStr = "";
        if (data.execType == 1009) {
            msgTypeStr = "保险柜转入";
            jianTouNode.getComponent(cc.Sprite).spriteFrame = this.jiantouSprite[0];
            msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[0];
            msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(221, 126, 2);
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "转入";
        }else if (data.execType == 1010) {
            msgTypeStr = "保险柜转出";
            jianTouNode.getComponent(cc.Sprite).spriteFrame = this.jiantouSprite[1];
            msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
            msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "转出";
        }else if (data.execType == 1011) {
            msgTypeStr = "保险柜关闭";
            jianTouNode.getComponent(cc.Sprite).spriteFrame = this.jiantouSprite[1];
            msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
            msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            jianTouNode.getChildByName("lb_opType").getComponent(cc.Label).string = "关闭";
        }else{
            console.log("请确认是否是保险柜消息："+data.execType);
        }
        msgTypeNode.getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;

        this.node.getChildByName("lb_execValue").getComponent(cc.Label).string = data.execPidValue;
        if (data.execPidValue >= 0) {
            this.node.getChildByName("lb_execValue").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_execValue").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_execCurValue").getComponent(cc.Label).string = data.execPidCurValue;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.pidValue;
        if (data.pidValue >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.pidCurValue;
    },
});