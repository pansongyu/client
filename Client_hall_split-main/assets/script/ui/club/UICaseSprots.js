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
        this.node.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = this.data.sportsPoint;
        this.node.getChildByName("lb_CaseSports").getComponent(cc.Label).string = this.data.caseSportsPoint;
        //初始化比赛分输入框
        this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string = "";
    },
    OnClick:function(btnName, btnNode){
        let percentStr = this.node.getChildByName("PLEditBox").getComponent(cc.EditBox).string;
        let percentFloat = parseFloat(percentStr);
        if(btnName == "btn_Add"){
            if (percentFloat > 0 && percentFloat <= this.data.sportsPoint) {
                let sendPack = {};
                let packName = "club.CClubGetCaseSprotsChange";
                sendPack.clubId = this.clubId;
                sendPack.type = 0;
                sendPack.value = parseFloat(percentStr);
                this.SetWaitForConfirm("CaseSprotsChange_Add",app.ShareDefine().ConfirmYN,[],[packName,sendPack], "确认转入"+parseFloat(percentStr)+"比赛分到保险箱");
            }else{
                app.SysNotifyManager().ShowSysMsg("请输入小于自己所拥有比赛分的纯数字",[],3);
            }
        }else if(btnName == "btn_Del"){
            if (percentFloat > 0 && percentFloat <= this.data.caseSportsPoint) {
                let sendPack = {};
                let packName = "club.CClubGetCaseSprotsChange";
                sendPack.clubId = this.clubId;
                sendPack.type = 1;
                sendPack.value = parseFloat(percentStr);
                this.SetWaitForConfirm("CaseSprotsChange_Del",app.ShareDefine().ConfirmYN,[],[packName,sendPack], "确认从保险箱转出"+parseFloat(percentStr)+"比赛分");
            }else{
                app.SysNotifyManager().ShowSysMsg("请输入小于该玩家所拥有保险箱内比赛分的纯数字",[],3);
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
            app.SysNotifyManager().ShowSysMsg("成功操作保险箱",[],3);
            self.CloseForm();
        }, function(){
            // app.SysNotifyManager().ShowSysMsg("设置比赛分失败",[],3);
        });
    },


    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[],content = "", lbSure ="", lbCancle=""){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg,content,lbSure,lbCancle);
    },
    OnConFirm:function(clickType, msgID, cbArgs){
        if(clickType != "Sure"){
            return
        }
        if(msgID == "CaseSprotsChange_Add"){
            this.SendPointPack(cbArgs[0],cbArgs[1]);
        }else if (msgID == "CaseSprotsChange_Del"){
            this.SendPointPack(cbArgs[0],cbArgs[1]);
        }
    },
});
