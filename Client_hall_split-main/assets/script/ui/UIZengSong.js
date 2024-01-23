var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        edit_num:{
            default:null,
            type:cc.EditBox
        },
        edit_id:{
            default:null,
            type:cc.EditBox
        },
        lb_username:cc.Label,
    },

    OnCreateInit:function(){
        this.NetManager = app.NetManager();
    },

    OnShow:function(){
         this.familyID=app.PlayerFamilyManager().GetPlayerFamilyProperty("familyID");
         this.lb_username.string="";
         this.edit_id.string="";
         this.edit_num.string="";
    },
    click_btn_song:function(){
        let id=parseInt(this.edit_id.string);
        let num=parseInt(this.edit_num.string);
        if(!id || id<=0){
            this.ShowSysMsg('请输入赠送ID');
            return;
        }
        if(!num || num<=0){
            this.ShowSysMsg('请输入赠送数量');
            return;
        }
        let that=this;
        app.NetManager().SendPack('family.CAgentGiveRoomCard',{"toPid":id,"value":num},function(serverPack){
            that.ShowSysMsg('赠送成功');
            that.edit_num.string="";
        },function(error){
            
        });
    },
    GetUserName:function(){
        let that=this;
        let edit_id=this.edit_id.string;
        if(edit_id.length>=6){
            app.NetManager().SendPack('player.CPlayerGetPlayerInfo',{pid:edit_id},function(serverPack){
                that.lb_username.string=serverPack.name;
            },function(error){
                that.lb_username.string="";
                console.error(error);
            });
        }
    },
    OnClick:function(btnName, btnNode){
        if(btnName=="btn_song"){
            this.click_btn_song();
        }else if(btnName=="btn_close"){
            this.CloseForm();
        }
    },
    
});
