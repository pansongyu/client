/*
 UIDice.js 摇色子界面
 */

var app = require("nn_app");

cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
	},

	OnCreateInit:function(){

		this.NetManager = app[app.subGameName + "_NetManager"]();
		
		this.speed = 30;

		this.msgList = [];

		this.NetManager.SendPack("game.CSystemNotice", {}, this.GetNoticeMsg.bind(this));
	},

	OnShow:function(){
		this.ZorderLv = 4;//设置层级
		this.msg = this.GetWndNode("bg/msg");
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

		for(let idx = 0; idx < list.length; idx++){
			let data = list[idx];
			this.msgList.push(data.content);
		}

		this.runMsg();
	},

});
