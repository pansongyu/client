var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_head:cc.Sprite,
        label_name:cc.Label,
        label_id:cc.Label,
        editBox:cc.EditBox,
    },

    OnCreateInit: function () {
        this.ComTool=app.ComTool();
    },
    
    OnShow: function (clubID,playerInfo) {
        this.clubID=clubID;
        this.label_name.string = playerInfo["name"];
        this.label_id.string = "ID:"+this.ComTool.GetPid(playerInfo["pid"]);
        let WeChatHeadImage = this.sp_head.getComponent("WeChatHeadImage");
        WeChatHeadImage.ShowHeroHead(playerInfo["pid"]);
        this.remarkID=playerInfo["pid"];
        //获取备注名字
        let BeiZhu=this.ComTool.GetBeiZhu();
        let beiZhuName="";
        for(let i=0;i<BeiZhu.length;i++){
            if(BeiZhu[i].id==playerInfo["pid"]){
                beiZhuName=BeiZhu[i].name;
                break;
            }
        }

        if(beiZhuName){
            this.editBox.string=beiZhuName;
        }else{
            this.editBox.string="";
        }
    },
   
    OnClick:function(btnName, btnNode){
        if('btn_close' == btnName){
            this.CloseForm();
        }else if("btn_save"){
            let beiZhuName=this.editBox.string;
            if(beiZhuName==""){
                app.SysNotifyManager().ShowSysMsg('备注名不能为空');
            }
            let self=this;
            app.NetManager().SendPack("club.CClubChangePlayerRemarkName",{'clubId':this.clubID,"remarkID":this.remarkID,"remarkName":beiZhuName},function(success){
                app.Client.OnEvent('ChangeBeiZhu',{"pid":self.remarkID,"name":beiZhuName});
                self.ComTool.UpdateBeiZhu(self.remarkID,beiZhuName);
            },function(error){
                app.SysNotifyManager().ShowSysMsg('备注失败，请稍后重试');
            });
            this.CloseForm();
        }
    },
});
