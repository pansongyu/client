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

    OnShow: function (clubId,HeHuoRen=0) {
    	this.clubId=clubId;
        this.HeHuoRen=HeHuoRen;
    	this.EditBoxID.string='';
        this.btn_yaoqing.active = false;
        this.node.getChildByName('user').active=false;
        this.lb_tip.string = "";
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
        let usernode=this.node.getChildByName('user');
        usernode.active=true;
        let heroID = data.player["pid"];
        usernode.heroID=heroID;
        let headImageUrl = data.player["iconUrl"];
        usernode.getChildByName('name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(heroID,data.player.name);
        usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        let WeChatHeadImage = usernode.getChildByName('head').getComponent("WeChatHeadImage");
         //用户头像创建
        if(heroID && headImageUrl){
            this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
        }
        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID);
        if(this.HeHuoRen==0){
            if (data.state == app.ClubManager().Enum_Nomarl) {
                this.lb_tip.string = "该玩家还不是亲友圈成员，可以邀请玩家进入亲友圈！";
                this.btn_yaoqing.active = true;
            }else{
                this.lb_tip.string = "该玩家已经是加入该亲友圈了，无法邀请！";
                this.btn_yaoqing.active = false;
            }
        }else{
            if (data.type == 2) {
                this.lb_tip.string = "该玩家已绑定了推广员，无需邀请！";
                this.btn_yaoqing.active = false;
            }else if (data.type == 1) {
                this.lb_tip.string = "该玩家已在当前亲友圈，无需邀请！";
                this.btn_yaoqing.active = false;
            }else {
                this.lb_tip.string = "该玩家不是该亲友圈成员，邀请加入！";
                this.btn_yaoqing.active = true;
            }
        }
        
    },
    click_btn_search:function(){
        let shuru = this.ComTool.GetBeiZhuID(this.EditBoxID.string);
        if(isNaN(parseInt(shuru)) || !app.ComTool().StrIsNum(shuru)){
            app.SysNotifyManager().ShowSysMsg("请输入纯数字的玩家id", [], 3);
            return;
        }
        let self=this;
        if(this.HeHuoRen==0){
            app.NetManager().SendPack('club.CClubFindPIDInfo',{'clubId':this.clubId,"pid":shuru},function(serverPack){
                self.ShowUser(serverPack);
            },function(error){
                self.ShowSysMsg("未查找到该玩家");
            });
        }else{
            app.NetManager().SendPack('club.CClubSubordinatePidInfo',{'clubId':this.clubId,"pid":shuru},function(serverPack){
                self.ShowUser(serverPack);
            },function(error){
                
            });
        }
        
    },
    Click_btn_yaoqing:function(){
    	if(this.EditBoxID.string==''){
    		return;
    	}
        let that=this;
        if(this.HeHuoRen==0){
        	let sendPack={
    			"clubId":this.clubId,
    			"pid":this.EditBoxID.string,
    		};
    		this.NetManager.SendPack("club.CClubFindPIDAdd", sendPack,function(success){
    			that.ShowSysMsg("邀请已发送,等待玩家确认");
    		},function(error){
    			that.ShowSysMsg("已邀请或未找到该玩家或同赛事不同亲友圈不能重复拉人或距离退出该亲友圈不到10分钟");
    		});
        }else{
            let sendPack={
                "clubId":this.clubId,
                "partnerPid":this.HeHuoRen,
                "pid":this.EditBoxID.string,
            };
            this.NetManager.SendPack("club.CClubSubordinatePidAdd", sendPack,function(success){
                that.ShowSysMsg("邀请已发送,等待玩家确认");
            },function(error){
                that.ShowSysMsg("已邀请或未找到该玩家或同赛事不同亲友圈不能重复拉人或距离退出该亲友圈不到10分钟");
            });
        }
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
