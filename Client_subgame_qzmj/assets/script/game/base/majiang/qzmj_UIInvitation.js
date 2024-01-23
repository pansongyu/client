/*
 UIMessage 模态消息界面
 */

var app = require("qzmj_app");

cc.Class({
	extends: cc.Component,

	properties: {},

	//初始化
	onLoad: function () {
		this.invitationNode = this.node.getChildByName("invitationNode");
		this.userLayout = this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getChildByName("userLayout");
		let messageScrollView = this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView);
		messageScrollView.node.on('scroll-to-bottom', this.GetNextPage, this);
		this.clubId = 0;
		this.unionId = 0;
		this.roomID = 0;
		this.curPage = 1;
	},
	//---------显示函数--------------------
	InitData: function (clubId, unionId, roomID) {
		this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
		this.invitationNode.active = false;
		this.curPage = 1;
		this.clubId = clubId;
		this.unionId = unionId;
		this.roomID = roomID;
	},
	GetNextPage: function () {
		this.curPage = this.curPage + 1;
		this.GetPlayerData();
	},
	GetPlayerData: function () {
		let sendPack = {};
		sendPack.clubId = this.clubId;
		sendPack.unionId = this.unionId;
		sendPack.pageNum = this.curPage;
		sendPack.roomID = this.roomID;
		sendPack.size = 18;
		let self = this;
		if (this.curPage == 1) {
			this.userLayout.removeAllChildren();
			this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
		}
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + '.C' + app.subGameName.toUpperCase() + 'RoomInvitationList', sendPack, function (serverPack) {
			self.ShowPlayerData(serverPack);
		}, function (error) {
			console.error(error);
		});
	},
	ShowPlayerData: function (serverPack) {
		if (this.curPage == 1) {
			this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
		}
		let demo = this.invitationNode.getChildByName("img_bjl").getChildByName("demo");
		for (let i = 0; i < serverPack.length; i++) {
			let userNode = cc.instantiate(demo);
			userNode.name = "user" + (i + 1);
			this.userLayout.addChild(userNode);
			let userName = serverPack[i]["name"];
			if (userName.length >= 6) {
				userName = userName.substring(0, 6) + "...";
			}
			userNode.getChildByName("lb_name").getComponent(cc.Label).string = userName;
			let heroID = serverPack[i]["pid"];
			let idStr = app[app.subGameName + "_ComTool"]().ReplacePosToStr(heroID.toString(), 2, 5, "****");
			userNode.getChildByName("lb_id").getComponent(cc.Label).string = idStr;
			//用户头像创建
			let headImageUrl = serverPack[i]["iconUrl"];
			if (heroID && headImageUrl) {
				app[app.subGameName + "_WeChatManager"]().InitHeroHeadImage(heroID, headImageUrl);
			}
			let weChatHeadImage = userNode.getChildByName('head').getComponent(app.subGameName + "_WeChatHeadImage");
			weChatHeadImage.onLoad();
			weChatHeadImage.ShowHeroHead(heroID);
			userNode.getChildByName("btn_invitation").getComponent(cc.Button).interactable = true;
			userNode.userData = serverPack[i];
			userNode.active = true;
		}
	},
	//控件点击回调
	OnClick_BtnWnd: function (eventTouch, eventData) {
		try {
			app[app.subGameName + "_SoundManager"]().PlaySound("BtnClick");
			let btnNode = eventTouch.currentTarget;
			let btnName = btnNode.name;
			this.OnClick(btnName, btnNode);
		}
		catch (error) {
			console.log("OnClick_BtnWnd:" + error.stack);
		}
	},
	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_close") {
			this.userLayout.removeAllChildren();
			this.invitationNode.getChildByName("img_bjl").getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop();
			this.invitationNode.active = false;
		} else if (btnName == "btn_reGet") {
			this.curPage = 1;
			this.GetPlayerData();
		} else if (btnName == "btn_invitation") {
			let clickUserData = btnNode.parent.userData;
			let sendPack = {};
			sendPack.clubId = this.clubId;
			sendPack.unionId = this.unionId;
			sendPack.pid = clickUserData.pid;
			sendPack.roomID = this.roomID;
			let self = this;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + '.C' + app.subGameName.toUpperCase() + 'RoomInvitationOperation', sendPack, function (serverPack) {
				btnNode.getComponent(cc.Button).interactable = false;
			}, (error) => {
				console.error(error);
			});
		} else if (btnName == "btn_invitationOnline") {
			if (this.roomID == 0) {
				console.error("roomID为0", this.roomID);
				return;
			}
			this.curPage = 1;
			this.GetPlayerData();
			this.invitationNode.active = true;
		}
	},

});

