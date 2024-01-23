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
		jiesuan.getChildByName('huTypes').getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('jiepao').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('dianpao').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint + '';
		jiesuan.getChildByName('huTypes').getChildByName('zhongma').getChildByName('num').getComponent(cc.Label).string = huData.guanMenPoint + '';
	},

});
