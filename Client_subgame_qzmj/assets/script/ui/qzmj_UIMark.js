var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName+"_BaseForm"),

	properties: {
		btn_record:cc.Node,
		btn_gps:cc.Node,
		lb_power:cc.Label,
		bg_power:cc.Node,
		bg_charging:cc.SpriteFrame,
		bg_electricity_0:cc.SpriteFrame,
		bg_electricity_1:cc.SpriteFrame,
		bg_electricity_2:cc.SpriteFrame,
		bg_electricity_3:cc.SpriteFrame,
		bg_electricity_4:cc.SpriteFrame,
		bg_electricity_5:cc.SpriteFrame,

		bg_signal:cc.Node,
		lb_signal:cc.Label,
		icon_signal_0:cc.SpriteFrame,
		icon_signal_1:cc.SpriteFrame,
		icon_signal_2:cc.SpriteFrame,
		icon_signal_3:cc.SpriteFrame,
		icon_signal_4:cc.SpriteFrame,
		icon_signal_5:cc.SpriteFrame,
	},

	OnCreateInit: function () {
       this.RegEvent("RoomRecord", this.Event_RoomRecord);
       this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
       if(this.IsIphoneX()==true){
            let widge=this.node.getComponent(cc.Widget);
            widge.right=100;
        }
	},
	OnClose:function(){
		if(cc.sys.isNative){
			app[app.subGameName + "_NativeManager"]().CallToNative("unregisterReceiver", []); 
		}
	},
	OnEvent_BatteryLevel:function(event){
		let power=event['Level'];
		let status=event['status'];
		if(power<=20){
			this.lb_power.node.color=cc.color(247,14,38);
		}else{
			this.lb_power.node.color=cc.color(255,255,255);
		}
		this.lb_power.string=power+"%";
		if(status==2){
			//充电中
			this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_charging;
		}else{
			if(power<=10){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity_0;
			}else if(power<=20){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity_1;
			}else if(power<=40){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity_2;
			}else if(power<=60){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity_3;
			}else if(power<100){
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity_4;
			}else{
				this.bg_power.getComponent(cc.Sprite).spriteFrame=this.bg_electricity_5;
			}
		}

	},
	OnShow: function () {
		if(cc.sys.isNative){
	   		app[app.subGameName + "Client"].RegEvent("EvtBatteryLevel", this.OnEvent_BatteryLevel, this);
			app[app.subGameName + "_NativeManager"]().CallToNative("registerReceiver", []); 
	    }
	    app[app.subGameName + "Client"].RegEvent("EvtSpeedTest", this.OnEvent_SpeedTest, this);
		if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
			this.btn_record.active = false;
			this.btn_gps.active = false;
		}
		else{
			this.btn_record.active = false;
			this.btn_gps.active = false;
		}
		//延迟计算器
		this.lb_signal.string='';
		//this.bg_signal.getComponent(cc.Sprite).spriteFrame='';
	},
	OnEvent_SpeedTest:function(event){
		let YanCi=event['yanci'];
		if(YanCi<100){
			this.lb_signal.string=YanCi+'ms';
			this.lb_signal.node.color=cc.color(144,227,83);
			this.bg_signal.getComponent(cc.Sprite).spriteFrame=this.icon_signal_5;
		}else if(YanCi<300){
			this.lb_signal.string=YanCi+'ms';
			this.lb_signal.node.color=cc.color(144,227,83);
			this.bg_signal.getComponent(cc.Sprite).spriteFrame=this.icon_signal_4;
		}else if(YanCi<600){
			this.lb_signal.string=YanCi+'ms';
			this.lb_signal.node.color=cc.color(213,203,43);
			this.bg_signal.getComponent(cc.Sprite).spriteFrame=this.icon_signal_3;
		}else if(YanCi<1000){
			this.lb_signal.string=YanCi+'ms';
			this.lb_signal.node.color=cc.color(254,173,80);
			this.bg_signal.getComponent(cc.Sprite).spriteFrame=this.icon_signal_2;
		}else if(YanCi<5000){
			this.lb_signal.string=Math.floor(YanCi/1000)+'s';
			this.lb_signal.node.color=cc.color(234,49,60);
			this.bg_signal.getComponent(cc.Sprite).spriteFrame=this.icon_signal_1;
		}else{
			this.lb_power.node.color=cc.color(234,49,60);
			this.lb_signal.string='>5s';
			this.bg_signal.getComponent(cc.Sprite).spriteFrame=this.icon_signal_0;
		}
	},
	//---------回调函数-------------------
    Event_SetStart:function ( event ) {

    },
    Event_RoomRecord:function (event) {
        app[app.subGameName+"_FormManager"]().ShowForm("UIRecord");
    },
	//---------点击函数---------------------
	OnClick:function(btnName, btnNode){
		
		if(btnName == "btn_duiju"){
		    //如果房间结束直接到this.FormManager.ShowForm("UIResultTotal");
		    let room = this.RoomMgr.GetEnterRoom();
		    let roomState=room.GetRoomProperty('state');
		    if(roomState==this.ShareDefine.RoomState_End){
		        this.FormManager.ShowForm("UIResultTotal");
		        return
		    }
            let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
            this.RoomMgr.SendRoomRecord(roomID);	
		}else if(btnName == "btn_gps"){
		    this.OnBtn_GPS_Click();
		}else if(btnName == "btn_help"){
		    app[app.subGameName+"_FormManager"]().ShowForm(app.subGameName+"_UIGameHelp",app.subGameName);
		}else{
			this.ErrLog("OnClick not find%s", btnName);
		}
	},

	//GPS按钮点击
	OnBtn_GPS_Click:function(){
		let room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = room.GetRoomPosMgr();
		let PlayerCount = RoomPosMgr.GetRoomPlayerCount();
		if(PlayerCount <= 2){
			app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg('MSG_GPS_LOST_PLAYER');
			return;
		}
		if (this.FormManager.IsFormShow(app.subGameName+"_UIGPSLoation")) {
			this.FormManager.CloseForm(app.subGameName+"_UIGPSLoation");
		} else {
			this.FormManager.ShowForm(app.subGameName+"_UIGPSLoation");
		}
	},

});
