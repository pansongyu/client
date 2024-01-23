var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        msgTypeSprite:[cc.SpriteFrame],
        curValueIconSprite:[cc.SpriteFrame],
    },
    InitData:function (data) {
        this.msgData = data;
    	let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(data.execTime);
        let img_di = this.node.getChildByName("img_tiaowen01");
        img_di.getChildByName("lb_time").getComponent(cc.Label).string = timeStr;
        let roomKey = "";
        if (typeof(data.roomKey)!="undefined") {
            roomKey = "房间号："+data.roomKey+" 房间名："+data.roomName;
        }
        img_di.getChildByName("lb_roomKey").getComponent(cc.Label).string = roomKey;
        let msgTypeNode = img_di.getChildByName("btn_lv");
        let img_sheng = img_di.getChildByName("img_sheng");
        let msgTypeStr = "";
        if (data.execType == 1014) {
            msgTypeStr = "报名费";
            msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
            msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            img_sheng.getComponent(cc.Sprite).spriteFrame = this.curValueIconSprite[0];
        }else{
            console.log("请确认是否是报名费消息："+data.execType);
        }
        msgTypeNode.getChildByName("lb_msgType").getComponent(cc.Label).string = msgTypeStr;
        img_di.getChildByName("lb_value").getComponent(cc.Label).string = data.num;
        if (data.num >= 0) {
            img_di.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
        }else{
            img_di.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
        }
        if(app.ClubManager().GetUnionTypeByLastClubData()==1){
            img_di.getChildByName("lb_curValue").active = false;
            img_di.getChildByName("img_sheng").active = false;
        }else{
            img_di.getChildByName("lb_curValue").active = true;
            img_di.getChildByName("img_sheng").active = true;
            img_di.getChildByName("lb_curValue").getComponent(cc.Label).string = data.curRemainder;
        }
    },
    OnClickBtnMsg:function(event){
        let detailNode = this.node.getChildByName("detailNode");
        if (detailNode.active) {
            detailNode.active = false;
            return;
        }
        let sendPack = {};
        sendPack.roomId = this.msgData.roomId;
        sendPack.pid = this.msgData.pid;
        sendPack.getType = this.msgData.getType;
        let self = this;
        app.NetManager().SendPack("club.CClubRoomPromotionPointDetail",sendPack, function(serverPack){
            if (serverPack.length > 0) {
                self.UpdateScrollView(serverPack);
            }
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },
    UpdateScrollView:function(msgList){
        let detailNode = this.node.getChildByName("detailNode");
        this.DestroyAllChildren(detailNode);
        detailNode.getComponent(cc.Layout).updateLayout();
        detailNode.active = true;
        for (let i = 0; i < msgList.length; i++) {
            let msgNode = cc.instantiate(this.node.getChildByName("demoDetail"));
            let msgData = msgList[i];
            let msgTextStr = "";
            let msgTypeNode = msgNode.getChildByName("btn_lv");
            if (msgData.type == 1) {
                msgTextStr = "上级分成 "+msgData.reasonPidName;
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            }else if (msgData.type == 2) {
                msgTextStr = "分给下级 "+msgData.reasonPidName;
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[0];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(221, 126, 2);
            }else if (msgData.type == 3) {
                msgTextStr = "玩家支付的房间报名费";
                msgTypeNode.getComponent(cc.Sprite).spriteFrame = this.msgTypeSprite[1];
                msgTypeNode.getChildByName("lb_msgType").color = new cc.Color(26, 156, 12);
            }else{
                console.log("请确认是否是报名费消息："+msgData.execType);
                continue;
            }
            msgNode.getChildByName("lb_msgText").getComponent(cc.Label).string = msgTextStr;
            msgNode.getChildByName("lb_value").getComponent(cc.Label).string = msgData.num;
            if (msgData.num >= 0) {
                msgNode.getChildByName("lb_value").color = new cc.Color(55, 155, 32);
            }else{
                msgNode.getChildByName("lb_value").color = new cc.Color(248, 57, 57);
            }
            msgNode.active = true;
            detailNode.addChild(msgNode);
        }
    },
    //手动释放内存
    DestroyAllChildren:function(node){
        let i=node.children.length-1;
        for(;i>=0;i--) {
            let child=node.children[i];
            child.removeFromParent();
            child.destroy();
        }
        /*node.destroyAllChildren();
        node.removeAllChildren();*/
    },
});