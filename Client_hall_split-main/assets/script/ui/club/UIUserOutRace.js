var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    OnShow: function (data,isUnion=true,isPromoter=false,percentStr) {
        this.data = data;
        this.isUnion = isUnion;
        this.isPromoter = isPromoter;
        let lb_TargetPL = this.node.getChildByName("lb_TargetPL").getComponent(cc.RichText);
        lb_TargetPL.string = "<color=#705d52>玩家身上拥有</c><color=#f8772c>" + data.targetPL + "</color><color=#705d52>比赛分，请清零玩家竞技点后退赛</c>";
        //初始化比赛分输入框
        //this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string = data.targetPL;
        this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string = percentStr;
    },
    OnClick:function(btnName, btnNode){

        if(btnName == "btn_sure"){
            let percentStr = this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string;
            if(percentStr==""){
                app.SysNotifyManager().ShowSysMsg("请输入大于该玩家所拥有比赛分的纯数字",[],3);
                return;
            }
            let percentFloat = parseFloat(percentStr);
            // this.SetWaitForConfirm('FORCE_OUT_UNION',this.ShareDefine.Confirm,[],[this.data.targetPL], "玩家身上拥有"+this.data.targetPL+"竞技点值，是否将玩家竞技清零并退赛");
            if (this.data.targetPL<0 && percentFloat > 0 && percentFloat <= this.data.owerPL) {
                //要补偿分数
                this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string=""; //防止二次点击，每次点击都清空输入框
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
                sendPack.type = 1;
                sendPack.value = parseFloat(percentStr);
                this.SendPointPack(packName, sendPack);
            }else if (this.data.targetPL>=0 && percentFloat > 0 && percentFloat <= this.data.targetPL) {
                //要扣分退赛
                this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string=""; //防止二次点击，每次点击都清空输入框
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
                sendPack.type = 1;
                sendPack.value = parseFloat(percentStr);
                this.SendPointPack(packName, sendPack);
            }
            else{
                app.SysNotifyManager().ShowSysMsg("请输入大于该玩家所拥有比赛分的纯数字",[],3);
            }
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    SendPointPack:function(packName, sendPack){
        let self = this;
        app.NetManager().SendPack(packName,sendPack, function(serverPack){
            if (serverPack.type == 0) {
                app.SysNotifyManager().ShowSysMsg("成功设置比赛分",[],3);
            }else{
                app.SysNotifyManager().ShowSysMsg("玩家退赛成功，已将玩家"+serverPack.value+"比赛分 扣除并退赛");
            }
            if (self.isPromoter) {
                let newPath = 'ui/club/UIPromoterAllManager';
                if (app.ClubManager().GetUnionTypeByLastClubData()==1) {
                    newPath = 'ui/club_2/UIPromoterAllManager_2';
                }
                self.FormManager.GetFormComponentByFormName(newPath).GetPromoterList(true);
            }

            self.FormManager.GetFormComponentByFormName("ui/club/UIUserSetPL").UpdateCurPL(serverPack.changedValue);


            self.CloseForm();
        }, function(){
            // app.SysNotifyManager().ShowSysMsg("设置比赛分失败",[],3);
        });
    },
});
