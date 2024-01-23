/*
    主场景
*/

var app = require("qzmj_app");

cc.Class({
    extends: require(app.subGameName + "_BaseScene"),

    properties: {
    },
    //------回掉函数-------------------
    OnCreate:function(){
    	
    },
    
    //进入场景
    OnSwithSceneEnd:function(){


    },

	//显示动态设置的默认界面
	OnShowDefaultForm:function(){
		// let formNameList = app[app.subGameName + "_FormManager"]().GetDefaultFormNameList();
		// let count = formNameList.length;
		// if(count){
		// 	for(let index=0; index<count; index++){
		// 		app[app.subGameName + "_FormManager"]().ShowForm(formNameList[index]);
		// 	}
		// }
		// else{
            app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMain");
		// }
		// app[app.subGameName + "_FormManager"]().ClearDefaultFormNameList();
	},
});
