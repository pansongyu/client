/*
 UICard01 卡牌显示逻辑
 */

let app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		
	},

	// use this for initialization
	OnCreateInit: function () {
		this.IsShow = false;
		this.node.getComponent(cc.Animation).on('finished', this.OnXiPaiFinished, this);
	},

	OnShow:function () {
		if(this.IsShow)
			return;
		this.IsShow = true;
		let xiPaiList = app[app.subGameName+"_GameManager"]().GetXiPaiList();
		if(0 != xiPaiList.length){
			let name = xiPaiList[0];
			app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg('SSS_XIPAI_SUCCESS',[name]);
		}
		this.node.getComponent(cc.Animation).play("xipaiAction");
	},
	
	OnXiPaiFinished:function(event){
		app[app.subGameName+"_GameManager"]().RemoveOneXiPaiPlayer();
		let xiPaiList = app[app.subGameName+"_GameManager"]().GetXiPaiList();
		if(0 != xiPaiList.length){
			let name = xiPaiList[0];
			app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg('SSS_XIPAI_SUCCESS',[name]);
			this.node.getComponent(cc.Animation).play("xipaiAction");
		}
		else
			this.CloseForm();
	},
	OnClose:function(){
		this.IsShow = false;
	},
});
