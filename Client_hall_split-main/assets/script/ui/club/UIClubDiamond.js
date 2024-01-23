/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------
    OnShow:function(clubId,unionId){
        this.clubId = clubId;
        this.unionId=unionId;
        if(this.unionId>0){
            //赛事
            let self = this;
            app.NetManager().SendPack("union.CUnionGetConfig",{"unionId":this.unionId, "clubId":this.clubId}, function(serverPack){
                self.node.getChildByName("EditBox1").getComponent(cc.EditBox).string =  serverPack.unionDiamondsAttentionMinister;
                self.node.getChildByName("EditBox2").getComponent(cc.EditBox).string =  serverPack.unionDiamondsAttentionAll;
            }, function(){
                //app.SysNotifyManager().ShowSysMsg("获取赛事设置失败，请关闭界面重试");
            });
        }else{
            let clubData = app.ClubManager().GetClubDataByClubID(clubId);
            this.node.getChildByName("EditBox1").getComponent(cc.EditBox).string =  clubData.diamondsAttentionMinister;
            this.node.getChildByName("EditBox2").getComponent(cc.EditBox).string =  clubData.diamondsAttentionAll;
        }
        
    },
	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_sure'==btnName){
            let value1=this.node.getChildByName("EditBox1").getComponent(cc.EditBox).string;
            let value2=this.node.getChildByName("EditBox2").getComponent(cc.EditBox).string;
            /*if(value1==0 || value1=="" || value1==1 || value2==""){
                app.SysNotifyManager().ShowSysMsg("请输入提示数量");
                return;
            }*/
            let self = this;
            if(this.unionId>0){
                //赛事
                app.NetManager().SendPack("union.CUnionChangeDimondsAttention",{"clubId":this.clubId,"unionId":this.unionId,"unionDiamondsAttentionMinister":value1, "unionDiamondsAttentionAll":value2}, function(serverPack){
                    self.CloseForm();
                }, function(){
                    app.SysNotifyManager().ShowSysMsg("赛事钻石提醒设置失败");
                });
            }else{
                //亲友圈
                app.NetManager().SendPack("club.CClubChangeDimondsAttention",{"clubId":this.clubId,"diamondsAttentionMinister":value1, "diamondsAttentionAll":value2}, function(serverPack){
                    //更新会亲友圈clubdata
                    let clubData = app.ClubManager().GetClubDataByClubID(self.clubId);
                    clubData.diamondsAttentionMinister=value1;
                    clubData.diamondsAttentionAll=value2;
                    self.CloseForm();
                }, function(){
                    app.SysNotifyManager().ShowSysMsg("亲友圈钻石提醒设置失败");
                });
            }
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
