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

		jiesuan = jiesuan.getChildByName('huTypes');
		jiesuan.getChildByName('zimo').getChildByName('num').getComponent(cc.Label).string = huData.ziMoPoint + '';			// 自摸次数
		jiesuan.getChildByName('jiePaoPoint').getChildByName('num').getComponent(cc.Label).string = huData.jiePaoPoint + '';		// 明杠次数
		jiesuan.getChildByName('dianPaoPoint').getChildByName('num').getComponent(cc.Label).string = huData.dianPaoPoint + '';		// 暗杠次数
		// jiesuan.getChildByName('fanShu').getChildByName('num').getComponent(cc.Label).string = huData.fanShuCount + '';		// 番数
		// jiesuan.getChildByName('huShu').getChildByName('num').getComponent(cc.Label).string = huData.huShuCount + '';		// 糊数
	},

});
