/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        icon_ledou:cc.SpriteFrame, 
        icon_zuanshi:cc.SpriteFrame,
        layout:cc.Node,
        btn_lingqu:cc.Button,
        jiangli:cc.Node,
    },
    //初始化
    OnCreateInit:function(){
        this.FormManager=app.FormManager();
        this.signin = this.SysDataManager.GetTableDict("signin");
    },
    OnShow:function(){
    	this.jiangli.active=false;
        this.ReSetLingQu();
        let that=this;
        app.NetManager().SendPack("game.CPlayerSign",{"type":1}, function(event){
            let signCount=event.signCount-1;
            let isTodaySign=event.isTodaySign;
            
            that.signDay=signCount;
            if(isTodaySign){//true为已今日已领取
                that.SetWndImageByFilePath('btn_lingqu','texture/sign/btn_lingqu02');
                that.btn_lingqu.interactable = false;
            }else{
                that.SetWndImageByFilePath('btn_lingqu','texture/sign/btn_lingqu');
                that.btn_lingqu.interactable = true;
            }
            if(signCount>0){
                for(let i=1;i<=signCount;i++){
                    let node=that.layout.getChildByName('day'+i);
                    node.getChildByName('zhezhao').active=true;
                }
            }
        }, function(){});
    },
    ReSetLingQu:function(loginNum){
        this.loginnum=loginNum;
        for(let key in this.signin){
            let day = this.signin[key].Day;
            let type=this.signin[key].Type;
            let uniformitemId = this.signin[key].UniformitemId;
            if(type=='SignIn'){
                let UniCount=this.signin[key].Count;
                this.ShowJiangLi(day,UniCount,uniformitemId);
            }
        }
    },
    ShowJiangLi:function(day,count,uniformitemId){
        let node=this.layout.getChildByName('day'+day);
        if(node){
            node.getChildByName('num').getComponent(cc.Label).string="x"+count;
            if(uniformitemId == 1){
                node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame=this.icon_ledou;
            }
            else{
                node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame=this.icon_zuanshi;
            }
           
            node.getChildByName("zhezhao").active=false;
        }
    },
    //---------点击函数---------------------
	OnClick:function(btnName, eventData){
        if('btn_lingqu' == btnName){
	        if(!this.signDay>=7){
	        	return;
	        }
	        let that=this;
	        app.NetManager().SendPack("game.CPlayerSign",{"type":2}, function(event){
		            for(let key in that.signin){
			            let day = that.signin[key].Day;
                        let type=that.signin[key].Type;
                        let uniformitemId = that.signin[key].UniformitemId;
			            if(type=='SignIn' && day==(that.signDay+1)){
                            let UniCount=that.signin[key].Count;
                            if(uniformitemId == 1){
                                that.jiangli.getChildByName('bg_icon').getChildByName('icon').getComponent(cc.Sprite).spriteFrame=that.icon_ledou;
                            }
                            else{
                                that.jiangli.getChildByName('bg_icon').getChildByName('icon').getComponent(cc.Sprite).spriteFrame=that.icon_zuanshi;
                            }
			            	that.jiangli.getChildByName('lb_num').getComponent(cc.Label).string='X'+UniCount;
			                that.jiangli.active=true;
                            that.SetWndImageByFilePath('btn_lingqu','texture/sign/btn_lingqu02');
                            that.btn_lingqu.interactable = false;
                            let node=that.layout.getChildByName('day'+(that.signDay+1));
                            node.getChildByName('zhezhao').active=true;
			            }
			        }
		      	}, function(){
		      		app.SysNotifyManager().ShowSysMsg("已经领取");
		      	});
        }else if('jiangli'==btnName){
        	this.jiangli.active=false;
        }
        else if(btnName == "btn_close"){
            this.CloseForm();
        }
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
