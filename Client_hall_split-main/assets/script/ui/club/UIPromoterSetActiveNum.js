var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {

    },
    OnShow: function (data, clubId) {
        this.data = data;
        this.clubId = clubId;
        let lb_TargetActive = this.node.getChildByName("lb_TargetActive").getComponent(cc.RichText);
        lb_TargetActive.string = "<color=#705d52>因系统异常修改</c><color=#f8772c>" + data.name.substr(0,8) + "（ID:" + data.pid + "）" + "</color><color=#705d52>的活跃度</c>";
        let lb_curActiveNum = this.node.getChildByName("lb_curActiveNum").getComponent(cc.Label);
        lb_curActiveNum.string = "该玩家当前拥有活跃度：" + data.curActiveValue;
        //初始化比赛分输入框
        this.node.getChildByName("ActiveEditBox").getComponent(cc.EditBox).string = "";
    },
    OnClick:function(btnName, btnNode){
        let percentStr = this.node.getChildByName("ActiveEditBox").getComponent(cc.EditBox).string;
        let percentFloat = parseFloat(percentStr);
        if(btnName == "btn_Add"){
            if (percentFloat > 0) {
                let sendPack = {};
                sendPack.pid = this.data.pid;
                sendPack.clubId = this.clubId;
                sendPack.type = 0;
                sendPack.value = parseFloat(percentStr);
                this.SendPointPack(sendPack);
            }else{
                app.SysNotifyManager().ShowSysMsg("请输入大于0的纯数字",[],3);
            }
        }else if(btnName == "btn_Del"){
            if (percentFloat > 0 && percentFloat <= this.data.curActiveValue) {
                let sendPack = {};
                sendPack.pid = this.data.pid;
                sendPack.clubId = this.clubId;
                sendPack.type = 1;
                sendPack.value = parseFloat(percentStr);
                this.SendPointPack(sendPack);
            }else{
                app.SysNotifyManager().ShowSysMsg("请输入小于该玩家所拥有活跃度的纯数字",[],3);
            }
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    SendPointPack:function(sendPack){
        let self = this;
        app.NetManager().SendPack("club.CClubPromotionActive",sendPack, function(serverPack){
            app.FormManager().GetFormComponentByFormName("ui/club/UIPromoterManager").ClickLeftBtn("btn_PromoterList");
            app.SysNotifyManager().ShowSysMsg("成功设置活跃度",[],3);
            self.CloseForm();
        }, function(){
            // app.SysNotifyManager().ShowSysMsg("设置比赛分失败",[],3);
        });
    },
});
