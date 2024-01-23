var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
		EditBoxName:{
			default:null,
			type:cc.EditBox
		},
		EditBoxTel:{
			default:null,
			type:cc.EditBox
		},
		EditBoxAdr:{
			default:null,
			type:cc.EditBox
		},

		btn_exchange:cc.Node,
		ex_name:cc.Label,
		ex_num:cc.Label,
    },

    OnCreateInit: function () {
        this.NetManager = app.NetManager();
	},

    OnShow: function (AppID, AppName, AppPrice) {
		this.ex_name.string = AppName;
		if(AppPrice >= 10000)
			AppPrice = (AppPrice/10000).toFixed(1).toString() + '万';
		this.ex_num.string = AppPrice;
		this.AppID = AppID;
	},

	isTel:function(val){
		var pattern=/(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
		if(pattern.test(val)) { 
			return true; 
		}else{ 
			return false; 
		}
	},

	isChn:function(str){ 
		var reg = /^[\u4E00-\u9FA5]+$/; 
		if(!reg.test(str)){ 
			return false; 
		}
		return true; 
	},

	OnClick:function(btnName, btnNode){
		if('btn_exchange' == btnName){
			let name = this.EditBoxName.string;
			let tel = this.EditBoxTel.string;
			let adr = this.EditBoxAdr.string;
			if(name.length < 2){
				this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
				this.EditBoxName.string = "";
				return;    
			}
			if(tel.length < 2){
				this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
				this.EditBoxTel.string = "";
				return;
			}
			if(adr.length < 2){
				this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
				this.EditBoxTel.string = "";
				return;
			}
			if(this.isChn(name)===false){
				this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
				this.EditBoxName.string = "";
				return;
			}
			if(this.isTel(tel)===false){
				this.WaitForConfirm("UISHIMING_INFO_ERROR", [], [], this.ShareDefine.ConfirmOK);
				this.EditBoxTel.string = "";
				return;
			}
	
			app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "MSG_EXCHANGE", []);
			app.ConfirmManager().ShowConfirm(this.ShareDefine.Confirm, "MSG_EXCHANGE", []);
		}
		else if('btn_close' == btnName){
			this.CloseForm();
		}
		else{
			this.ErrLog("OnClick(%s) not find", btnName);
		}
	},

	OnConFirm:function(clickType, msgID, backArgList){
		if(clickType != "Sure"){
			return
		}

		if(msgID == "MSG_EXCHANGE"){
			let crystal = app.HeroManager().GetHeroProperty("crystal");
			let price = parseInt(this.ex_num.string);
			if(crystal < price){
				app.SysNotifyManager().ShowSysMsg('MSG_EXCHANGE_NOTENOUGH');
				return;
			}
			let data = {};
			data.prizeId = this.AppID;
			data.name = this.EditBoxName.string;
			data.phone = this.EditBoxTel.string;
			data.address = this.EditBoxAdr.string;
			this.NetManager.SendPack("game.CPlayerExchangePrizes", data,function(event){
				app.SysNotifyManager().ShowSysMsg('MSG_EXCHANGE_SUCCESS');
			},function(event){
				app.SysNotifyManager().ShowSysMsg('MSG_EXCHANGE_FAIL');
			});
		}
	}

});
