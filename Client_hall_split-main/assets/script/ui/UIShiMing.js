var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
		EditBoxName:cc.EditBox,
		EditBoxIDCard:cc.EditBox,
		btn_tijiao:cc.Node,
		tip1:cc.Label,
		tip2:cc.Label,
		layout:cc.Node,
		sp_tag:cc.Node,
    },

    OnCreateInit: function () {
        this.NetManager = app.NetManager();
        this.NetManager.RegNetPack("game.cplayerrealauthen", this.OnPack_ShiMing, this);
		this.HeroManager = app.HeroManager();
		this.AuthUrl="http://qh.qinghuaimajiang.com/verify_id_name";
    },

    OnShow: function () {
    	let appName=cc.sys.localStorage.getItem('appName');
        if (appName=="baodao") {
        	app.SysNotifyManager().ShowSysMsg('实名未开启');
            this.CloseForm();
            return;
        }
		this.playerID = app.HeroManager().GetHeroProperty("pid"); 
        let realNumber=app.HeroManager().GetHeroProperty("realNumber"); 
        let realName=app.HeroManager().GetHeroProperty("realName"); 
		if(realNumber && realName){
		    this.layout.active = false;
		    this.btn_tijiao.active = false;
		    this.sp_tag.active = true;
		}else{
			this.layout.active = true;
		    this.btn_tijiao.active = true;
			this.sp_tag.active = false;
		}
    },
    Btn_tjjiao:function(){
		let name=this.EditBoxName.string;
		let idcard=this.EditBoxIDCard.string;
		if(name.length<2){
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
	    	//this.tip1.string='*姓名输入错误';
	    	this.EditBoxName.string = "";
			return;    
		}
		if(idcard.length<2){
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
	    	//this.tip2.string='*身份证输入错误';
	    	this.EditBoxIDCard.string = "";
			return;
		}
		if(this.isChn(name)===false){
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
			//this.tip1.string='*姓名输入错误';
			this.EditBoxName.string = "";
			return;
		}else{
			this.tip1.string='';
		}

		if(this.isCardNo(idcard)===false){
			this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
			//this.tip2.string='*身份证输入错误';
			this.EditBoxIDCard.string = "";
			return;
		}else{
			this.tip2.string='';
		}

		//找后台验证实名信息是否合法
		var date = new Date();
		let year=date.getFullYear();
		let month=date.getMonth()+1;
		let day=date.getDate();
		if(month<10){
			month="0"+month;
		}
		if(day<10){
			day="0"+day;
		}

		let signString = idcard.toString() +this.playerID.toString()+"wanzi"+year.toString()+month.toString()+day.toString();
        let sign = app.MD5.hex_md5(signString);
		this.SendHttpRequest(this.AuthUrl, "?is_number="+idcard+"&name="+encodeURI(name)+"&playerid="+this.playerID+"&sign="+sign, "GET",{});
		//this.NetManager.SendPack("game.CPlayerRealAuthen", {"playerId":this.playerID, "realName":name,"realNumber":idcard});
		
	},
	OnReceiveHttpPack:function(serverUrl, httpResText){
        try{
            let serverPack = JSON.parse(httpResText);
            if(serverUrl==this.AuthUrl){
               if(serverPack.code==200){
               	  //认证成功
               	  let name=this.EditBoxName.string;
				  let idcard=this.EditBoxIDCard.string;
               	  this.NetManager.SendPack("game.CPlayerRealAuthen", {"playerId":this.playerID, "realName":name,"realNumber":idcard});
               }else if(serverPack.code==300){
               	   this.ShowSysMsg("名字和身份号码不匹配");
               	   return;
               }else if(serverPack.code==301){
               	   this.ShowSysMsg("身份证号，姓名缺一不可");
               	   return;
               }else if(serverPack.code==302){
               	   this.ShowSysMsg("无效链接");
               	   return;
               }else if(serverPack.code==304){
               	   this.ShowSysMsg(httpResText);
               	   return;
               }
            }
        }
        catch (error){
            
        }
    },
    OnConnectHttpFail:function(serverUrl, readyState, status){
        
    },
	OnPack_ShiMing:function(serverPack){
	    console.log("OnPack_ShiMing:",serverPack);
	    if(serverPack.realName && serverPack.realNumber){
	    	app.HeroManager().SetHeroProperty("realName",serverPack.realName);
	    	app.HeroManager().SetHeroProperty("realNumber",serverPack.realNumber);
            this.WaitForConfirm("UISHIMING_SUCCESS", [], [], this.ShareDefine.ConfirmOK);
        }else{
            this.WaitForConfirm("UISHIMING_FAIL", [], [], this.ShareDefine.ConfirmOK);
        }
	},
	
	isCardNo:function(card)  
	{  
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
		if(reg.test(card) === false){  
			return  false;  
		}  
		return true;
	},
	isChn:function(str){ 
		var reg = /^[\u4E00-\u9FA5]+$/; 
		if(!reg.test(str)){ 
			return false; 
		}
		return true; 
	},

	OnConFirm:function(clickType, msgID, backArgList){

		if(msgID == "UISHIMING_SUCCESS"){
			this.btn_tijiao.active = false;
            this.layout.active = false;
            this.sp_tag.active = true;
		}
		else if(msgID == "UISHIMING_FAIL"){
			this.EditBoxName.string = "";
			this.EditBoxIDCard.string = "";
		}
	}

});
