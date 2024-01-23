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
	huTypesShow:function(jiesuan,huData){
        jiesuan.getChildByName('top').getChildByName('lb_hupai').getComponent(cc.Label).string=huData.winNum;
        jiesuan.getChildByName('top').getChildByName('lb_shibai').getComponent(cc.Label).string=huData.lostNum;
        jiesuan.getChildByName('top').getChildByName('lb_liuju').getComponent(cc.Label).string=huData.pingNum;
    },
});
