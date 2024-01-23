var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },
    OnCreateInit: function () {
    },
    //-----------------显示函数------------------
    OnShow: function (clubId) {
        this.clubId = clubId;
    },
    OnClick:function(btnName, btnNode){
        if('btn_create' == btnName){
            let self = this;
            app.NetManager().SendPack("family.CPlayerCheckFamilyOwner",{},function(success){
                if (success.power > 0) {
                    app.FormManager().ShowForm('ui/club/UIUnionCreate', self.clubId);
                }else{
                    app.SysNotifyManager().ShowSysMsg("请联系客服申请创建赛事资格");
                }
            },function(error){
                 app.SysNotifyManager().ShowSysMsg("赛事未开放");
            });
        }else if('btn_join' == btnName){
            app.FormManager().ShowForm('ui/club/UIJoinUnion', this.clubId);
        }else if('btn_close' == btnName){
            this.CloseForm();
        }
    },
});