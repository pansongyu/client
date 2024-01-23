/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        img_bjl_fx:cc.Node,
        qian:cc.Node,
        ledou:cc.Node,
        fangka:cc.Node,

        lb_fangka:cc.Label,
        lb_qian:cc.Label,
        lb_ledou:cc.Label,


    },

    //初始化
    OnCreateInit:function(){
        this.RegEvent("ChouJiangShareSuccess", this.Event_ChouJiangShareSuccess, this);
    },
    Event_ChouJiangShareSuccess:function(event){
        app.FormManager().CloseForm("UIChouJiangShare");
        // this.SetWndProperty("image01/btnSure", "active",false);
        this.SetWndProperty("image01/btnLingQu", "interactable",true);
    },
    //---------显示函数--------------------

    OnShow:function(choujiangData,byUILog = false){
        this.byUILog = byUILog;
        this.dataID = 0;
        this.SetWndProperty("image01/btnSure", "active",true);
        this.SetWndProperty("image01/btnLingQu", "interactable",true);
        this.fangka.active=false;
        this.ledou.active=false;
        this.qian.active=false;
        this.img_bjl_fx.active = false;
        //this.ShowOneJiangLi(UniList[0],UniCountList[0]);
        let fangka=0;
        let ledou=0;
        let qian=0;
        if(byUILog){
            if(2 == choujiangData.prizeType)
                fangka = choujiangData.rewardNum;
            else if(1 == choujiangData.prizeType)
                ledou = choujiangData.rewardNum;
            else if(8 == choujiangData.prizeType)
                qian = choujiangData.rewardNum/100;
            this.dataID = choujiangData.id;
        }
        else{
            if(2 == choujiangData.prizeType)
                fangka = choujiangData.rewardNum;
            else if(1 == choujiangData.prizeType)
                ledou = choujiangData.rewardNum;
            else if(8 == choujiangData.prizeType)
                qian = choujiangData.rewardNum/100;
            this.dataID = choujiangData.id;
        }
        if(qian>0)
            this.ShowOneJiangLi(8,qian,choujiangData.luckSpr);
        if(fangka>0)
            this.ShowOneJiangLi(2,fangka,choujiangData.luckSpr);
        if(ledou)
            this.ShowOneJiangLi(1,ledou,choujiangData.luckSpr);
        this.ShareFangKa=fangka;
        this.ShareQian=qian;
        this.ShareLeDou=ledou;
    //    app.NetManager().SendPack("game.CPlayerLuckDraw",{"type":7});  改成必须分享成功后才能领取
    },
    ShowShareForm:function(shareType){
        this.img_bjl_fx.active = false;
        let shareObj = {
            "qian":this.ShareQian,
            "qianSpr":this.qian.getChildByName("icon").getComponent(cc.Sprite).spriteFrame,
            "fangka":this.ShareFangKa,
            "fangkaSpr":this.fangka.getChildByName("icon").getComponent(cc.Sprite).spriteFrame,
            "ledou":this.ShareLeDou,
            "ledouSpr":this.ledou.getChildByName("icon").getComponent(cc.Sprite).spriteFrame,
        };
    	app.FormManager().ShowForm('UIChouJiangShare',shareObj,shareType);
        // this.SetWndProperty("image01/btnSure", "active",false);
        this.SetWndProperty("image01/btnLingQu", "interactable",true);
    },
    ShowOneJiangLi:function(type,num,luckSpr){
        if(type==2){
            //钻石
            this.fangka.active=true;
            this.fangka.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = luckSpr;
            this.lb_fangka.string='X'+num;
        }else if(type==1){
            //乐斗
            this.ledou.active=true;
            this.ledou.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = luckSpr;
            this.lb_ledou.string='X'+num;
        }else if(type==8){
             //红包
            this.qian.active=true;
            this.qian.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = luckSpr;
            this.lb_qian.string=num+'元';
        }
    },
    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
            this.img_bjl_fx.active = !this.img_bjl_fx.active;
		}else if(btnName=="btnSure_wx"){
            this.ShowShareForm(1);
        }else if(btnName=="btnSure_dd"){
            this.ShowShareForm(2);
        }else if(btnName=="btnSure_mw"){
            this.ShowShareForm(3);
        }else if(btnName=="btnLingQu"){
            // if(this.byUILog)
            //     app.NetManager().SendPack("game.CPlayerLuckDraw",{"type":8,"recordId":this.dataID});
            // else
            //     app.NetManager().SendPack("game.CPlayerLuckDraw",{"type":7});
            this.CloseForm();
        }
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
