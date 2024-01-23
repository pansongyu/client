var app = require("app");
cc.Class({
    extends: require("UIUserSetPL"),
    properties: {
    },
    OnShow: function (data,isUnion=true,isPromoter=false) {
        this.data = data;
        this.isUnion = isUnion;
        this.isPromoter = isPromoter;
        let lb_TargetPL = this.node.getChildByName("lb_TargetPL").getComponent(cc.RichText);
        lb_TargetPL.string = "<color=#705d52>因裁判重置</c><color=#f8772c>" + this.ComTool.GetBeiZhuName(data.pid,data.name,9) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的比赛分</c>";
        let lb_curPL = this.node.getChildByName("lb_curPL").getComponent(cc.Label);
        lb_curPL.string = "该玩家当前拥有比赛分：" + data.targetPL;
        this.tuisaiPoint=data.targetPL;
    },
    OnClick:function(btnName, btnNode){
        
        if(btnName == "btn_tuisai"){
                let sendPack = {};
                let packName = "";
                if (this.isUnion && !this.isPromoter) {
                    sendPack = app.ClubManager().GetUnionSendPackHead();
                    sendPack.opClubId = this.data.opClubId;
                    packName = "union.CUnionSportsPointUpdate";
                }else if (!this.isUnion && this.isPromoter) {
                    sendPack.clubId = this.data.targetClubId;
                    packName = "club.CClubSubordinateLevelSportsPointUpdate";
                }else{
                    sendPack.clubId = app.ClubManager().GetUnionSendPackHead().clubId;
                    packName = "club.CClubSportsPointUpdate";
                }
                sendPack.opPid = this.data.pid;
                if(this.tuisaiPoint>0){
                    sendPack.type = 1;
                }else{
                    sendPack.type = 0;
                }
                sendPack.value =Math.abs(this.tuisaiPoint);
                this.SendPointPack(packName, sendPack);
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else if(btnName == "btn_help"){
            this.node.getChildByName("helpNode").active = !this.node.getChildByName("helpNode").active;
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
});
