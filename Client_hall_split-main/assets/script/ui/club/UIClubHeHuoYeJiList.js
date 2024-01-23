/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        hehuoyejilist_scrollView:cc.ScrollView,
        hehuoyejilist_layout:cc.Node,
        hehuoyejilist_demo:cc.Node,

        btn_yeji_today:cc.Node,
        btn_yeji_yesterday:cc.Node,
        btn_yeji_santian:cc.Node,
        btn_yeji_sanshitian:cc.Node,
        btn_yeji_more:cc.Node,
        btn_hehuo:cc.Node,

        jiantouSprite:[cc.SpriteFrame],
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------

    OnShow:function(clubId){
        this.clubId = clubId;
        this.hehuozhanji_type = 0;
        this.btn_yeji_today.active = false;
        this.btn_yeji_yesterday.active = false;
        this.btn_yeji_santian.active = false;
        this.btn_yeji_sanshitian.active = false;
        this.hehuoyejilist_demo.active = false;
        this.ShowHeHuoYeJiList(this.hehuozhanji_type);
    },

    ShowBtn:function(){
        this.btn_yeji_today.active = false;
        this.btn_yeji_yesterday.active = false;
        this.btn_yeji_santian.active = false;
        this.btn_yeji_sanshitian.active = false;
        let btnLable = this.btn_yeji_more.getChildByName("label").getComponent(cc.Label);
        if (this.hehuozhanji_type == 0) {
            btnLable.string = "今  天";
        }else if (this.hehuozhanji_type == 1) {
            btnLable.string = "昨  天";
        }else if (this.hehuozhanji_type == 2) {
            btnLable.string = "近三天";
        }else if (this.hehuozhanji_type == 3) {
            btnLable.string = "近三十天";
        }
    },

    ShowHeHuoYeJiList:function(type){
        let self=this;
        this.hehuozhanji_type=type;
        this.ShowBtn();
        //this.hehuoyejilist_layout.removeAllChildren();
        this.DestroyAllChildren(this.hehuoyejilist_layout);
        app.NetManager().SendPack('club.CClubPartnerRecord',{'clubId':this.clubId,"getType":type},function(serverPack){
            let allNum=0;
            let allYingJia=0;
            let allJuShu=0;
            for(let i=0;i<serverPack.length;i++){
                let node=cc.instantiate(self.hehuoyejilist_demo);
                node.active=true;
                self.hehuoyejilist_layout.addChild(node);

                let data=serverPack[i];
                let heroID = data.player["pid"];
                let headImageUrl = data.player["iconUrl"];
                node.getChildByName('name').getComponent(cc.Label).string=self.ComTool.GetBeiZhuName(heroID,data.player.name);
                node.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":self.ComTool.GetPid(heroID)});
                node.heroID=heroID;
                node.getChildByName('btn_hehuo_xiangqing').heroID=heroID;
                let WeChatHeadImage = node.getChildByName('head').getComponent("WeChatHeadImage");
                 //用户头像创建
                if(heroID && headImageUrl){
                    app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                }
                WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
                //显示玩家数
                node.getChildByName('lb_num').getComponent(cc.Label).string=data.sumPartner;
                node.getChildByName('lb_canyu').getComponent(cc.Label).string=data.setPartner;
                node.getChildByName('lb_yingjia').getComponent(cc.Label).string=data.winnerPartner;
            }
            

        },function(error){
        });
        
        app.NetManager().SendPack('club.CClubPartnerCount',{'clubId':this.clubId,"getType":type},function(serverPack){
            let yejibottomNode=self.node.getChildByName('bottom');
            yejibottomNode.getChildByName('lb_renshu').getComponent(cc.Label).string="总人数："+serverPack.sumPartner+"/"+serverPack.sumPlayer;
            yejibottomNode.getChildByName('lb_yingjia').getComponent(cc.Label).string="大赢家："+serverPack.winnerPartner+"/"+serverPack.sumWinner+"("+self.BaiFenBi(serverPack.winnerPartner,serverPack.sumWinner)+")";
            yejibottomNode.getChildByName('lb_jushu').getComponent(cc.Label).string="总参与局数："+serverPack.setPartner+"/"+serverPack.sumSet+"("+self.BaiFenBi(serverPack.setPartner,serverPack.sumSet)+")";;
        },function(error){

        });

    },
    BaiFenBi:function(have,all){
        if(have>0){
            return Math.floor(have*100/all)+"%";
        }
        return '暂无';
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
        }else if('btn_yeji_today' == btnName){
            this.ShowHeHuoYeJiList(0);
        }else if('btn_yeji_yesterday' == btnName){
            this.ShowHeHuoYeJiList(1);
        }else if('btn_yeji_santian' == btnName){
            this.ShowHeHuoYeJiList(2);
        }else if('btn_yeji_sanshitian' == btnName){
            this.ShowHeHuoYeJiList(3);
        }else if('btn_yeji_more' == btnName){
            this.btn_yeji_today.active = !this.btn_yeji_today.active;
            this.btn_yeji_yesterday.active = !this.btn_yeji_yesterday.active;
            this.btn_yeji_santian.active = !this.btn_yeji_santian.active;
            this.btn_yeji_sanshitian.active = !this.btn_yeji_sanshitian.active;
            let img_jiantou = this.btn_yeji_more.getChildByName("img_jiantou").getComponent(cc.Sprite);
            if (this.btn_yeji_today.active) {
                img_jiantou.spriteFrame = this.jiantouSprite[1];
            }else{
                img_jiantou.spriteFrame = this.jiantouSprite[0];
            }
        }else if('btn_last'==btnName){
            
        }else if('btn_next'==btnName){
            
        }else if('btn_hehuo_xiangqing'==btnName){
            this.FormManager.ShowForm('ui/club/UIClubHeHuoZhanJiList', this.clubId, btnNode.heroID, this.hehuozhanji_type);
        }else if('btn_hehuo'==btnName){
            this.FormManager.ShowForm('ui/club/UIClubHeHuoList',this.clubId);
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
