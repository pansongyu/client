/*
 UIChooseCard 界面基类(又FormManager控制创建和销毁)
 */
var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		card01: cc.Node,
		card02: cc.Node,
		card03: cc.Node,
		card04: cc.Node,
	},

	OnCreateInit: function () {
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
	},

	OnShow: function (huPaiList) {
		this.huPaiList = huPaiList;
		this.card01.active = 0;
		this.card02.active = 0;
		this.card03.active = 0;
		this.card04.active = 0;
		let count = huPaiList.length;
		for (let i = 0; i < count; i++) {
			let cardID = huPaiList[i].cardID;
			let OpType = huPaiList[i].OpType;
			let cardPath = this.ComTool.StringAddNumSuffix("card", i + 1, 2);
			let imageName = ["CardShow", Math.floor(cardID / 100)].join("");
			let wndNode = this.GetWndNode(cardPath);
			wndNode.cardID = cardID;
			wndNode.OpType = OpType;
			this.SetWndProperty(cardPath, "active", 1);
			this.SetWndProperty(cardPath, "image", imageName);
		}
	},

	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName.startsWith("card")) {
			this.Click_EmitAnGang(btnNode);
		}
		else {
			this.ErrLog("OnClick btnName:%s not find  ", btnName);
		}
	},

	Click_EmitAnGang: function (btnNode) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		let GameTyepStringUp = app.subGameName.toUpperCase();
		if (is3DShow == 0) {
			GameTyepStringUp = GameTyepStringUp + '2D';
		} else if (is3DShow == 2) {
			GameTyepStringUp = GameTyepStringUp + 'WB';
		}
		let sendCardID = btnNode.cardID;
		this.RoomMgr.SendPosAction(sendCardID, btnNode.OpType);
		let formName = "game/" + app.subGameName.toUpperCase() + "/ui/UI" + GameTyepStringUp + "Play";
		let Component = this.FormManager.GetFormComponentByFormName(formName);
		Component.CloseSpTiShi();
		this.CloseForm();
	},
});