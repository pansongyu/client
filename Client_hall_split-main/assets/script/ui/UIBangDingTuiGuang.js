var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        editbox_ID:cc.EditBox,
        tip:cc.Label,
        btn_bangding:cc.Node,
    },

    OnCreateInit: function () {
        this.ComTool = app.ComTool();
        this.FormManager=app.FormManager();
        this.NetManager = app.NetManager();
 //       this.NetManager.RegNetPack("game.CPlayerReceiveShare", this.OnPack_ReceiveShare, this);
        this.HeroManager = app.HeroManager(); 
        this.heroID = app.HeroManager().GetHeroProperty("pid"); 
    },

    OnShow: function () {
        this.NetManager.SendPack('family.PlayerBindingFamily',{pidStr:'',familyEnum:1},this.OnPack_ShowBangDing.bind(this),this.OnPack_ShowBangDingFail.bind(this));
    },
    OnPack_ShowBangDing:function(serverPack){
        this.tip.node.active = true;
        this.node.getChildByName('bg').getChildByName('label').active = false;
        this.node.getChildByName('bg').getChildByName('zuanshi').active = false;
        this.tip.string='您已经成功绑定';
        this.tip.node.getChildByName("tip1").getComponent(cc.Label).string = "代理号是：" + serverPack.playerBindingFamily.familyId;
        this.tip.node.getChildByName("tip2").getComponent(cc.Label).string = "代理昵称是：" + serverPack.playerBindingFamily.familyName;
        this.editbox_ID.node.active=false;
        this.btn_bangding.active=false;

        let familyId=serverPack.playerBindingFamily.familyId;
        if(familyId){
            app.PlayerFamilyManager().SetPlayerFamilyProperty('familyID',familyId);
        }
    },
    OnPack_ShowBangDingFail:function(serverPack){
        this.tip.node.active = false;
        this.editbox_ID.node.active=true;
        this.btn_bangding.active=true;
    },
    CheckBangDing:function(){
        let bangdingID=this.editbox_ID.string;
        if(bangdingID<10000){
            return;
        }
        //请求服务器查看绑定信息
        this.NetManager.SendPack('family.PlayerBindingFamily',{pidStr:bangdingID,familyEnum:3},this.OnPack_PlayerBindingFamily.bind(this),this.OnPack_PlayerBindingFamilyFail.bind(this));
    },

    OnPack_PlayerBindingFamily:function(serverPack){
        app.SysNotifyManager().ShowSysMsg('MSG_BangDing_Success');
        this.OnPack_ShowBangDing(serverPack);
    },

    OnPack_PlayerBindingFamilyFail:function(serverPack){
        let bangdingID=this.editbox_ID.string;
        app.SysNotifyManager().ShowSysMsg('MSG_BangDing_Error1',[bangdingID]);
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }else if(btnName=='btn_bangding'){
            this.CheckBangDing();
        }
    }
});
