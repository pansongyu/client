var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
    	EditBoxID:cc.EditBox,
		lb_tip:cc.Label,
        btn_yaoqing:cc.Node,
    },

    OnCreateInit: function () {
        this.WeChatManager=app.WeChatManager();
        this.NetManager = app.NetManager();
        this.RegEvent("CodeError", this.Event_CodeError, this);
        //this.NetManager.RegNetPack("game.cplayerrealauthen", this.OnPack_ShiMing, this);
    },

    OnShow: function () {
    	this.EditBoxID.string='';
        this.btn_yaoqing.active = false;
        this.lb_tip.string = "";
        this.node.getChildByName("lb_clubName").getComponent(cc.Label).string = "";
        this.node.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = "";
    },
    Event_CodeError:function(event){
        let codeInfo = event;
        if(codeInfo["Code"] == 5013){
            this.ShowSysMsg("未查找到该玩家");
        }else if (codeInfo["Code"] == 6012) {
            this.ShowSysMsg("该玩家已绑定合伙人");
        }
    },
    ShowUser:function(data){
        this.node.getChildByName("lb_clubName").getComponent(cc.Label).string = "亲友圈名字：" + data.clubName;
        this.node.getChildByName("lb_clubCreatorName").getComponent(cc.Label).string = "亲友圈创建者名字：" + data.createName;

        this.btn_yaoqing.active = true;
        // let usernode=this.node.getChildByName('user');
        // usernode.active=true;
        // let heroID = data.player["pid"];
        // usernode.heroID=heroID;
        // let headImageUrl = data.player["iconUrl"];
        // usernode.getChildByName('name').getComponent(cc.Label).string=data.player.name;
        // usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        // let WeChatHeadImage = usernode.getChildByName('head').getComponent("WeChatHeadImage");
        //  //用户头像创建
        // if(heroID && headImageUrl){
        //     this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        // }
        // WeChatHeadImage.OnLoad();
        // WeChatHeadImage.ShowHeroHead(heroID);
        // if(this.HeHuoRen==0){
        //     if (data.state == app.ClubManager().Enum_Nomarl) {
        //         this.lb_tip.string = "该玩家还不是赛事成员，可以邀请玩家进入赛事！";
        //         this.btn_yaoqing.active = true;
        //     }else{
        //         this.lb_tip.string = "该玩家已经是加入该赛事了，无法邀请！";
        //         this.btn_yaoqing.active = false;
        //     }
        // }else{
        //     if (data.sign) {
        //         this.lb_tip.string = "该玩家是赛事成员，可以邀请玩家！";
        //         this.btn_yaoqing.active = true;
        //     }else{
        //         this.lb_tip.string = "该玩家不是该赛事成员，邀请加入！";
        //         this.btn_yaoqing.active = true;
        //     }
        // }
        
    },
    click_btn_search:function(){
        let shuru = this.ComTool.GetBeiZhuID(this.EditBoxID.string);
        if(shuru == ""){
            return;
        }
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.clubSign = shuru;
        let self=this;
        app.NetManager().SendPack('union.CUnionFindClubSignInfo',sendPack,function(serverPack){
            self.ShowUser(serverPack);
        },function(error){
            
        });
        
    },
    Click_btn_yaoqing:function(){
    	if(this.EditBoxID.string==''){
    		return;
    	}
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        sendPack.clubSign = this.EditBoxID.string;
        let self=this;
        this.NetManager.SendPack("union.CUnionFindClubSignAdd", sendPack,function(success){
            self.ShowSysMsg("已成功发送邀请信息");
        },function(error){
            self.ShowSysMsg("该亲友圈已有联盟");
        });
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_yaoqing"){
            this.Click_btn_yaoqing();
        }else if(btnName == "btn_search"){
            this.click_btn_search();
        }else if(btnName == "btn_close"){
            this.CloseForm();
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

});
