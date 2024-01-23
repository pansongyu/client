/*
 UICard01 卡牌显示逻辑
 */

var app = require("nn_app");

cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		ani_blue: cc.Node,
		ani_red: cc.Node
	},

	// use this for initialization
	OnCreateInit: function () {
		this.IsShow = false;

		this.ani_blue.getComponent(cc.Animation).on('finished', this.OnXiPaiFinished, this);
		this.ani_red.getComponent(cc.Animation).on('finished', this.OnXiPaiFinished, this);
	},

	OnShow: function () {
		if (this.IsShow)
			return;

		this.IsShow = true;
		let xiPaiList = app[app.subGameName + "_GameManager"]().GetXiPaiList();
		if (0 != xiPaiList.length) {
			let name = xiPaiList[0];
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('SSS_XIPAI_SUCCESS', [name]);
		}
		this.StartXiPai();
	},

	OnXiPaiFinished: function (event) {
		app[app.subGameName + "_GameManager"]().RemoveOneXiPaiPlayer();
		let xiPaiList = app[app.subGameName + "_GameManager"]().GetXiPaiList();
		if (0 != xiPaiList.length) {
			let name = xiPaiList[0];
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('SSS_XIPAI_SUCCESS', [name]);
			this.StartXiPai();
		}
		else
			this.CloseForm();
	},
	StartXiPai: function () {
		this.ani_red.active = true;
		this.ani_blue.active = false;
		this.ani_red.getComponent(cc.Animation).play();
	},
	OnClose: function () {
		this.IsShow = false;
	},
});
