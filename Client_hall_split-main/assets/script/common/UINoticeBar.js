/*
 UIDice.js 摇色子界面
 */

var app = require("app");

cc.Class({
	extends: require("BaseForm"),

	properties: {
		msg:cc.Node,
	},

	OnCreateInit:function(){

		this.NetManager = app.NetManager();
		
		this.speed = 30;

		this.msgList = [];

		this.NetManager.SendPack("game.CSystemNotice", {}, this.GetNoticeMsg.bind(this));
	},

	OnShow:function(){
 
		let argList = Array.prototype.slice.call(arguments);

		this.count = 0;

		this.runMsg();
	},

	runMsg:function(){

		this.msg.stopAllActions();

		if(!this.msgList.length) return;

		if(this.count >= this.msgList.length){
			this.count = 0;
		}

		this.msg.getComponent(cc.Label).string = this.msgList[this.count];
		
		let node = this.node.getChildByName("bg");

		this.msg.x = node.width/2 + node.x;
		this.msg.y = node.height/2;

		let mWidth = this.msg.width;

		let moveX = node.x - node.width/2 - mWidth;

		let time = (node.width + mWidth)/this.speed;

		let self = this;

		let seq = cc.sequence(cc.moveTo(time, cc.v2(moveX,this.msg.y)),cc.callFunc(function(){
			this.runMsg();
		}, this));

		this.msg.runAction(seq);

		this.count++;
	},

	GetNoticeMsg:function(serverPack){
		let list = serverPack;

		if(!list.length) return;


		let alertTime = Math.round(new Date().getTime() / 1000);
		for(let idx = 0; idx < list.length; idx++){
			let data = list[idx];
			let endTime=data.endTime;

			if(alertTime>endTime){
				continue;
			}

			this.msgList.push(data.content);
			if (data.clientType == 3) {
				let beginTime=data.beginTime;
				let checkTime=beginTime-7200;
				if(alertTime>checkTime && alertTime<beginTime){
					app.SysNotifyManager().ShowSysMsg(data.content);
				}
			}
		}
		if(this.msgList.length==0){
			this.node.active=false;
		}else{
			this.node.active=true;
		}

		this.runMsg();
	},

});
