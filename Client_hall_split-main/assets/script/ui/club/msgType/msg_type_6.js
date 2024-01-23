var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        msgTypeSprite:[cc.SpriteFrame],
    },
    InitData:function (data) {
    	let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        this.node.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        let roomKey = "";
        if (typeof(data.roomKey)!="undefined") {
            roomKey = "房间号："+data.roomKey;
        }
        this.node.getChildByName("lb_roomKey").getComponent(cc.Label).string = roomKey;
        let msgTypeNode = this.node.getChildByName("btn_lv");
        let msgTypeStr = "";
        if (data.execType == 129) {
            msgTypeStr = "洗牌消耗";
            msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[0];
            msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(221, 126, 2);
        }else if (data.execType == 130) {
            msgTypeStr = "洗牌获得";
            msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
            msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
        }else{
            console.log("请确认是否是洗牌消息："+data.execType);
        }
        msgTypeNode.getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;

        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.value;
        if (data.value >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.curValue;
    },
});