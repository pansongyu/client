/*
    主场景
*/

var app = require("app");

cc.Class({
    extends: require("BaseScene"),

    properties: {
    },

    //------回掉函数-------------------
    OnCreate:function(){
        this.FormManager = app.FormManager();
    	this.HeroManager = app.HeroManager();
    	this.PlayerFamilyManager = app.PlayerFamilyManager();
    },
    
    //进入场景
    OnSwithSceneEnd:function(){


    },

	//显示动态设置的默认界面
	OnShowDefaultForm:function(){
        let heroFamilyID = this.GetHeroFamilyID();
        this.FormManager.ShowForm("UINewMain",heroFamilyID);
		let formNameList = this.FormManager.GetDefaultFormNameList();
		let count = formNameList.length;
		for(let index=0; index<count; index++){
            console.log('ShowDefaultForm === ' + formNameList[index]);
			this.FormManager.ShowForm(formNameList[index]);
		}
		this.FormManager.ClearDefaultFormNameList();
	},
	GetHeroFamilyID:function () {
		return this.PlayerFamilyManager.GetPlayerFamilyProperty("familyID");;
    }
});
