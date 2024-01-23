/*
 UIMessage 模态消息界面
 */

var app = require("nn_app");

cc.Class({
	extends: cc.Component,

	properties: {

	},

	//初始化
	onLoad:function(){
		this.invitationNode = this.node.getChildByName("invitationNode");
		this.userLayout = this.invitationNode.getChildByName("img_bjl").getChildByName("userLayout");

		this.clubId = 0;
		this.unionId = 0;
		this.roomID = 0;
		this.curPage = 1;
	},

	//---------显示函数--------------------
	InitData:function (clubId, unionId, roomID) {
		this.invitationNode.active = false;
		this.curPage = 1;
		this.clubId = clubId;
		this.unionId = unionId;
		this.roomID = roomID;
	},
	GetPlayerData:function(){
		let sendPack = {};
		sendPack.clubId = this.clubId;
		sendPack.unionId = this.unionId;
		sendPack.pageNum = this.curPage;
		sendPack.roomID = this.roomID;
		let self = this;
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName+'.C'+app.subGameName.toUpperCase()+'RoomInvitationList', sendPack, function(serverPack){
			console.log(app.subGameName+'.C'+app.subGameName.toUpperCase()+'RoomInvitationList',sendPack, serverPack);
			self.curPage++;
			self.ShowPlayerData(serverPack);
		}, function(error){
			console.error(app.subGameName+'.C'+app.subGameName.toUpperCase()+'RoomInvitationList',sendPack, error);
		});
	},
	ShowPlayerData:function(serverPack){
		for (let i = 0; i < this.userLayout.children.length; i++) {
			this.userLayout.children[i].active = false;
		}
		for (let i = 0; i < serverPack.length; i++) {
			let userNode = this.userLayout.children[i];
			let userName = serverPack[i]["name"];
			if (userName.length >= 6) {
				userName = userName.substring(0,6) + "...";
			}
			userNode.getChildByName("lb_name").getComponent(cc.Label).string = userName;
			let heroID = serverPack[i]["pid"];
			let idStr = app[app.subGameName + "_ComTool"]().ReplacePosToStr(heroID.toString(), 2, 5, "****");
			userNode.getChildByName("lb_id").getComponent(cc.Label).string = idStr;
			//用户头像创建
			let headImageUrl = serverPack[i]["iconUrl"];
			if(heroID && headImageUrl){
				app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(heroID, headImageUrl);
			}
			let weChatHeadImage=userNode.getChildByName('head').getComponent(app.subGameName + "_WeChatHeadImage");
			weChatHeadImage.onLoad();
			weChatHeadImage.ShowHeroHead(heroID);
			userNode.getChildByName("btn_invitation").getComponent(cc.Button).interactable = true;
			userNode.userData = serverPack[i];
			userNode.active = true;
		}
	},

	//控件点击回调
	OnClick_BtnWnd:function(eventTouch, eventData){
		try{
			app[app.subGameName + "_SoundManager"]().PlaySound("BtnClick");
			let btnNode = eventTouch.currentTarget;
			let btnName = btnNode.name;
			this.OnClick(btnName, btnNode);
		}
		catch (error){
			console.log("OnClick_BtnWnd:"+error.stack);
		}
	},
	//---------点击函数---------------------
	OnClick:function(btnName, btnNode){
		if(btnName == "btn_close"){
			this.invitationNode.active = false;
		}else if(btnName == "btn_reGet"){
			this.GetPlayerData();
		}else if(btnName == "btn_invitation"){
			let clickUserData = btnNode.parent.userData;
			let sendPack = {};
			sendPack.clubId = this.clubId;
			sendPack.unionId = this.unionId;
			sendPack.pid = clickUserData.pid;
			sendPack.roomID = this.roomID;
			let self = this;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName+'.C'+app.subGameName.toUpperCase()+'RoomInvitationOperation', sendPack, function(serverPack){
				console.log(app.subGameName+'.C'+app.subGameName.toUpperCase()+'RoomInvitationOperation',sendPack, serverPack);
				btnNode.getComponent(cc.Button).interactable = false;
			}, function(error){
				console.error(app.subGameName+'.C'+app.subGameName.toUpperCase()+'RoomInvitationOperation',sendPack, error);
			});
		}else if(btnName == "btn_reGet"){
			this.GetPlayerData();
		}else if (btnName == "btn_invitationOnline") {
			if (this.roomID == 0) {
				console.error("roomID为0");
				return;
			}
			this.curPage = 1;
			this.GetPlayerData();
			this.invitationNode.active = true;
		}
	},

});
