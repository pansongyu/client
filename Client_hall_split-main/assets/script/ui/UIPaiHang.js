/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        content:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        this.ComTool=app.ComTool();
        this.WeChatManager = app.WeChatManager();
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf);
    },

    //---------显示函数--------------------

    OnShow:function(){
        app.FormManager().ShowForm('UITop', "UIPaiHang");
        this.LoadData(3);
    },
    OnEvt_CopyTextNtf:function(event){
        if(0 == event.detail.code)
            this.ShowSysMsg("推广链接："+event.detail.msg);
        else
            this.ShowSysMsg("复制失败");
    },
    LoadData:function(type){
       this.InitBtn(type);
       let that=this;
       app.NetManager().SendPack("ranking.CRankingList",{"rankQueryType":type},function(event){
            that.ShowData(event);
       },function(event){});
    },
    ShowData:function(serverPack){
        let dataNode=this.GetWndNode('right/scorelist/content');
        //dataNode.removeAllChildren();
        this.DestroyAllChildren(dataNode);
        dataNode.height=90;
        let MyheadID=app.HeroManager().GetHeroID();
        let dataList=serverPack.rankItems;
        let length=dataList.length;
        let paihangname="未上榜";
        for(let i=0;i<length;i++){
            let addNode=cc.instantiate(this.GetWndNode('right/scorelist/logl_demo'));
            addNode.name='data'+i;
            addNode.active=true;
            dataNode.addChild(addNode);
            let heroID = dataList[i]["pid"];
            let headImageUrl = dataList[i]["iconUrl"];
            let name = dataList[i]["name"];
            let setCount=dataList[i]["setCount"];
            let winCount=dataList[i]["winCount"];
            let refererCount=dataList[i]["refererCount"];
            addNode.getChildByName('lb_name').getComponent(cc.Label).string=name.substr(0,5);
            if(heroID && headImageUrl){
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                let WeChatHeadImage=addNode.getChildByName('head_img').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID);
            }
            if(MyheadID==heroID){
                paihangname=i+1;
            }
            //显示推广数还是局数
            if(this.ShowType==3){
                addNode.getChildByName('lb_num').getComponent(cc.Label).string=refererCount;
            }else if(this.ShowType==1){
                addNode.getChildByName('lb_num').getComponent(cc.Label).string=setCount;
            }else if(this.ShowType==2){
                addNode.getChildByName('lb_num').getComponent(cc.Label).string=winCount;
            }
            //显示排行
            if(i==0){
                addNode.getChildByName('icon1').active=true;
                addNode.getChildByName('icon2').active=false;
                addNode.getChildByName('icon3').active=false;
                addNode.getChildByName('lb_mingci').active=false;
            }else if(i==1){
                addNode.getChildByName('icon1').active=false;
                addNode.getChildByName('icon2').active=true;
                addNode.getChildByName('icon3').active=false;
                addNode.getChildByName('lb_mingci').active=false;
            }else if(i==2){
                addNode.getChildByName('icon1').active=false;
                addNode.getChildByName('icon2').active=false;
                addNode.getChildByName('icon3').active=true;
                addNode.getChildByName('lb_mingci').active=false;
            }else{
                addNode.getChildByName('icon1').active=false;
                addNode.getChildByName('icon2').active=false;
                addNode.getChildByName('icon3').active=false;
                addNode.getChildByName('lb_mingci').getComponent(cc.Label).string=i+1;
            }
        }
        this.SetWndProperty("right/lb_mingci", "text",paihangname);
    },
    InitBtn:function(type){
        this.ShowType=type;
        if(type==3){
            this.SetWndProperty("right/lb_typename", "text",'推广数');
            this.SetWndProperty("left/layout/btn_renmai", "active",false);
            this.SetWndProperty("left/layout/renmai", "active",true);

            this.SetWndProperty("left/layout/btn_jushu", "active",true);
            this.SetWndProperty("left/layout/jushu", "active",false);

            this.SetWndProperty("left/layout/btn_shengchang", "active",true);
            this.SetWndProperty("left/layout/shengchang", "active",false);
        }else if(type==1){
            this.SetWndProperty("right/lb_typename", "text",'局数');
            this.SetWndProperty("left/layout/btn_renmai", "active",true);
            this.SetWndProperty("left/layout/renmai", "active",false);

            this.SetWndProperty("left/layout/btn_jushu", "active",false);
            this.SetWndProperty("left/layout/jushu", "active",true);

            this.SetWndProperty("left/layout/btn_shengchang", "active",true);
            this.SetWndProperty("left/layout/shengchang", "active",false);
        }else if(type==2){
            this.SetWndProperty("right/lb_typename", "text",'胜局数');
            this.SetWndProperty("left/layout/btn_renmai", "active",true);
            this.SetWndProperty("left/layout/renmai", "active",false);

            this.SetWndProperty("left/layout/btn_jushu", "active",true);
            this.SetWndProperty("left/layout/jushu", "active",false);

            this.SetWndProperty("left/layout/btn_shengchang", "active",false);
            this.SetWndProperty("left/layout/shengchang", "active",true);
        }
    },
    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName=="btn_renmai"){
            this.LoadData(3);
        }else if(btnName=="btn_jushu"){
            this.LoadData(1);
        }else if(btnName=="btn_shengchang"){
            this.LoadData(2);
        }
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
