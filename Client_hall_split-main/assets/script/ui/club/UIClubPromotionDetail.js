/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        tuiguang_scrollView:cc.ScrollView,
        tuiguang_layout:cc.Node,
        tuiguang_demo:cc.Node,
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------

    OnShow:function(tuiguanglist,myisminister,levelPromotion){
        this.myisminister = myisminister;
        this.levelPromotion = levelPromotion;
        this.tuiguang_demo.active = false;
        this.ShowTuiGuanList(tuiguanglist);
    },
    ShowTuiGuanList:function(tuiguanglist){
        let self=this;
        let selfHeroID = app.HeroManager().GetHeroProperty("pid");
        this.DestroyAllChildren(this.tuiguang_layout);
        for(let i=0;i<tuiguanglist.length;i++){
            let data=tuiguanglist[i];
            let heroID = data.pid;
            let headImageUrl = data.icon;
            let node=cc.instantiate(self.tuiguang_demo);
            node.active=true;
            this.tuiguang_layout.addChild(node);
            if(node==0){
                node.getChildByName("tip_jiantou").active=false;
            }else{
                node.getChildByName("tip_jiantou").active=true;
            }
            node.getChildByName('name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(heroID,data.name);
            node.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":self.ComTool.GetPid(heroID)});
            node.heroID=heroID;
            let WeChatHeadImage = node.getChildByName('head').getComponent("WeChatHeadImage");
             //用户头像创建
            if(heroID && headImageUrl){
                app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
            }
            WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
            if(this.levelPromotion>0 && this.myisminister==0){
                //不是管理员，是推广员，渲染到自己就退出
                if(heroID==selfHeroID){
                    break;
                }
            }
               
        }
    },
    

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
