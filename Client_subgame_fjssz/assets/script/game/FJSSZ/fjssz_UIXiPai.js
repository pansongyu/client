/*
 UICard01 卡牌显示逻辑
 */

let app = require("fjssz_app");

cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {},

	// use this for initialization
	OnCreateInit: function () {
		this.ZorderLv = this.ZorderLv9;
		this.ani_blue = this.node.getChildByName("node_blue");
		this.ani_red = this.node.getChildByName("node_red");

		this.IsShow = false;

		this.ani_blue.getComponent(cc.Animation).on('finished', this.OnXiPaiFinished, this);
		this.ani_red.getComponent(cc.Animation).on('finished', this.OnXiPaiFinished, this);
	},

	OnShow: function () {
		if (this.IsShow) {
			return;
		}
		this.IsShow = true;
		let xiPaiList = app[app.subGameName + "_GameManager"]().GetXiPaiList();
		if (0 != xiPaiList.length) {
			let name = xiPaiList[0];
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('SSS_XIPAI_SUCCESS', [name]);
			app[app.subGameName + "_GameManager"]().RemoveOneXiPaiPlayer();
		}
		this.StartXiPai();
	},

	OnXiPaiFinished: function (event) {
		let xiPaiList = app[app.subGameName + "_GameManager"]().GetXiPaiList();
		if (0 != xiPaiList.length) {
			let name = xiPaiList[0];
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('SSS_XIPAI_SUCCESS', [name]);
			app[app.subGameName + "_GameManager"]().RemoveOneXiPaiPlayer();
			this.StartXiPai();
		}
		else
			this.CloseForm();
	},
	StartXiPai: function () {
		this.ani_red.active = false;
		this.ani_blue.active = true;
		this.ani_blue.getComponent(cc.Animation).play();
	},
	OnClose: function () {
		this.IsShow = false;
	},
});
