/*

 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_detail_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {

	},

	
	huTypesShow: function (jiesuan, huData) {		
		// let huPaiCount = huData.huTypes.length - huData.jiePaoPoint;
		jiesuan.getChildByName('huTypes').getChildByName('hupai').getChildByName('num').getComponent(cc.Label).string = huData.huCnt + '';
		jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('minggang').getChildByName('num').getComponent(cc.Label).string = huData.gangPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('angang').getChildByName('num').getComponent(cc.Label).string = huData.anGangPoint + '';
	},

});
