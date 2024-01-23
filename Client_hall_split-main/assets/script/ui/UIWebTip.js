/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
    	webviewNode:cc.Node,
    },
    OnCreateInit: function () {

    },
    OnShow:function(){
    	var myDate = new Date();
    	let heroID=app.HeroManager().GetHeroID();
        let i=myDate.getMilliseconds();
		this.webviewNode.getComponent(cc.WebView).url="http://fb.qicaiqh.com:88/online/"+heroID+"?="+i;
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_back"){
            this.CloseForm();
        }
    },

});
