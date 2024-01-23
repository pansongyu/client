/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        forbid_demo:cc.Node,
        forbid_layout:cc.Node,
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------

    OnShow:function(clubId, heroID){
        this.clubId = clubId;
        this.ShowForbid();
    },
    OnClose:function(){
        this.node.getChildByName("EditBoxForbid1").getComponent(cc.EditBox).string='';
        this.node.getChildByName("EditBoxForbid2").getComponent(cc.EditBox).string='';
    },
    
    RefreshForbid:function(groupingId){
        let that=this;
        app.NetManager().SendPack("club.CClubGroupingList", {"clubId":this.clubId},function(success){
            if(success.length>0){
                let nodePrefab=that.forbid_layout.getChildByName("forbid_"+groupingId);
                for(let i=0;i<success.length;i++){
                    if(success[i].groupingId!=groupingId){
                        continue;
                    }
                    nodePrefab.getChildByName('renshu').getChildByName('lb').getComponent(cc.Label).string="限制人数："+success[i].groupingSize+"斜15";
                    nodePrefab.getChildByName('layout').getChildByName('user1').active=false;
                    nodePrefab.getChildByName('layout').getChildByName('user2').active=false;
                    for(let j=0;j<success[i].playerList.length;j++){
                        let usernode=nodePrefab.getChildByName('layout').getChildByName('user'+(j+1));
                        usernode.active=true;
                        let heroID = success[i].playerList[j]["pid"];
                        let headImageUrl = success[i].playerList[j]["iconUrl"];
                        usernode.getChildByName('name').getComponent(cc.Label).string=that.ComTool.GetBeiZhuName(heroID,success[i].playerList[j].name);
                        usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":that.ComTool.GetPid(heroID)});
                        let WeChatHeadImage = usernode.getChildByName('head').getChildByName('img').getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        //用户头像创建
                        if(heroID && headImageUrl){
                            app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                        }
                        usernode.getChildByName('btn_forbit_del_user').pid=heroID;
                        usernode.getChildByName('btn_forbit_del_user').groupingId=success[i].groupingId;
                        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
                    }
                }
            }
            },function(error){
        });
    },

    ShowForbid:function(pid1='',pid2=''){
        let that=this;
        //this.forbid_layout.removeAllChildren();
        let sendPack={};
        sendPack.clubId=this.clubId;
        sendPack.pidOne=pid1;
        sendPack.pidTwo=pid2;


        this.DestroyAllChildren(this.forbid_layout);
        app.NetManager().SendPack("club.CClubGroupingList",sendPack,function(success){
            if(success.length>0){
                for(let i=0;i<success.length;i++){
                    let nodePrefab = cc.instantiate(that.forbid_demo);
                    nodePrefab.name="forbid_"+success[i].groupingId;
                    nodePrefab.getChildByName('renshu').getChildByName('lb').getComponent(cc.Label).string=(i+1)+".限制人数："+success[i].groupingSize+"斜15";
                    nodePrefab.groupingId=success[i].groupingId;
                    nodePrefab.getChildByName('layout').getChildByName('user1').active=false;
                    nodePrefab.getChildByName('layout').getChildByName('user2').active=false;
                    nodePrefab.getChildByName('layout').getChildByName('btn_set_forbit').groupingId=success[i].groupingId;

                    nodePrefab.getChildByName('btn_set_forbit').groupingId=success[i].groupingId;
                    nodePrefab.getChildByName('btn_del_forbit').groupingId=success[i].groupingId;

                    nodePrefab.active=true;
                    that.forbid_layout.addChild(nodePrefab);
                    for(let j=0;j<success[i].playerList.length;j++){
                        let usernode=nodePrefab.getChildByName('layout').getChildByName('user'+(j+1));
                        usernode.active=true;
                        let heroID = success[i].playerList[j]["pid"];
                        let headImageUrl = success[i].playerList[j]["iconUrl"];
                        usernode.getChildByName('name').getComponent(cc.Label).string=that.ComTool.GetBeiZhuName(heroID,success[i].playerList[j].name);
                        usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":that.ComTool.GetPid(heroID)});
                        let WeChatHeadImage = usernode.getChildByName('head').getChildByName('img').getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        //用户头像创建
                        if(heroID && headImageUrl){
                            app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                        }
                        usernode.getChildByName('btn_forbit_del_user').pid=heroID;
                        usernode.getChildByName('btn_forbit_del_user').groupingId=success[i].groupingId;
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
                    }
                }
            }
            },function(error){
        });
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_set_forbit'==btnName){
            this.FormManager.ShowForm('ui/club/UIForbidUserList',this.clubId,btnNode.groupingId);
        }else if('btn_del_forbit'==btnName){
            let groupingId=btnNode.groupingId;
            app.NetManager().SendPack('club.CClubGroupingRemove',{'clubId':this.clubId,'groupingId':groupingId});
            btnNode.parent.destroy();
        }else if('btn_forbit_del_user'==btnName){
            app.NetManager().SendPack('club.CClubGroupingPidRemove',{'clubId':this.clubId,'groupingId':btnNode.groupingId,"pid":btnNode.pid});
            this.RefreshForbid(btnNode.groupingId);
        }else if('btn_add_forbid'==btnName){
            let self=this;
            app.NetManager().SendPack('club.CClubGroupingAdd',{'clubId':this.clubId},function(serverPack){
                self.ShowForbid();
                },function(error){
            });
        }else if('btn_ForbidSearch'==btnName){
            let pid1=this.node.getChildByName("EditBoxForbid1").getComponent(cc.EditBox).string;
            let pid2=this.node.getChildByName("EditBoxForbid2").getComponent(cc.EditBox).string;
            if(pid1!='' || pid2!=''){
                this.ShowForbid(pid1,pid2);
            }
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
