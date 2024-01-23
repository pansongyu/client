var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        msgTypeSprite:[cc.SpriteFrame],
        curValueIconSprite:[cc.SpriteFrame],
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
        let img_sheng = this.node.getChildByName("img_sheng");
        let msgTypeStr = "";
        if (data.execType == 119) {
            msgTypeStr = "赢家报名费";
            img_sheng.getComponent(cc.Sprite).spriteFrame = this.curValueIconSprite[0];
        }else if (data.execType == 126 || data.execType == 1006 || data.execType == 1008) {
            if (data.value >= 0) {
                msgTypeStr = "报名费获得";
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            }else{
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[0];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(221, 126, 2);
                msgTypeStr = "报名费分出";
            }
            img_sheng.getComponent(cc.Sprite).spriteFrame = this.curValueIconSprite[0];
        }else if (data.execType == 1013) {
            if (data.value >= 0) {
                msgTypeStr = "报名费获得";
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            }else{
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[0];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(221, 126, 2);
                msgTypeStr = "报名费分出";
            }
            img_sheng.getComponent(cc.Sprite).spriteFrame = this.curValueIconSprite[1];
        }else{
            console.log("请确认是否是报名费消息："+data.execType);
        }
        msgTypeNode.getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;
        this.node.getChildByName("lb_value").getComponent(cc.Label).string = data.value;
        if (data.value >= 0) {
            this.node.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        }else{
            this.node.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        if(app.ClubManager().GetUnionTypeByLastClubData()==1){
            this.node.getChildByName("lb_curValue").active = false;
            this.node.getChildByName("img_sheng").active = false;
        }else{
            this.node.getChildByName("lb_curValue").active = true;
            this.node.getChildByName("img_sheng").active = true;
            this.node.getChildByName("lb_curValue").getComponent(cc.Label).string = data.curValue;
        }
        
    },
});