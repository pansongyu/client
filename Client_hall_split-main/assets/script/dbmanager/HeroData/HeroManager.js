/*
    玩家个人数据管理器
*/
var app = require('app');

var HeroManager = app.BaseClass.extend({

    Init:function(){
    	this.JS_Name = "HeroManager";

        let SysDataManager = app.SysDataManager();
        this.NetManager = app.NetManager();
        this.ShareDefine = app.ShareDefine();
        this.ComTool = app.ComTool();

        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
        this.allSelectCityData = [];

        this.NetManager.RegNetPack("playerchanged", this.OnPack_HeroProperty, this);

        this.OnReload();

    	this.Log("Init");
    },

    //切换账号
    OnReload:function(){
        this.dataInfo = {};
        this.heroID = 0;
    },


    //登陆初始化数据
    InitLoginData:function(heroID, heroInfo){
        this.dataInfo = heroInfo;
        this.heroID = heroID;
        //记录用户活跃度
        if(!cc.sys.isNative){
            heroInfo['vipExp']=0;
        }
        app.LocalDataManager().SetConfigProperty("Account", "AccountActive",heroInfo['vipExp']);
        if(heroInfo['cityId']){
            //记录用户本地城市
            cc.sys.localStorage.setItem("myCityID",heroInfo['cityId']);
        }
    },

    //-------------------封包函数--------------------------
    //属性变化
    OnPack_HeroProperty:function(serverPack){

	    let count = serverPack.length;
	    for(let index=0; index<count; index++){
		    let dataInfo = serverPack[index];
		    let property = dataInfo["name"];
		    this.SetHeroProperty(property, dataInfo["value"]);
	    }
    },

    //----------------设置接口---------------------------
    //设置英雄属性
    SetHeroProperty:function(property, value){
        if(!this.dataInfo.hasOwnProperty(property)){
            this.ErrLog("SetHeroProperty(%s,%s) error", property, value);
            return false
        }
        this.dataInfo[property] = value;

        let argDict = {
            "Property":property,
            "Value":value,
        };
        app.Client.OnEvent("HeroProperty", argDict);

        return true
    },
    UpdateCity:function(cityId){
        this.dataInfo["cityId"]=cityId;
    },
    //----------------获取接口-----------------------------

    //获取英雄ID
    GetHeroID:function(){
        return this.heroID;
    },

    GetHeroInfo:function(){
        return this.dataInfo
    },

    //获取英雄属性值
    GetHeroProperty:function(property){
        if(!this.dataInfo.hasOwnProperty(property)){
            this.ErrLog("GetHeroProperty(%s) error", property);
            if ("cityId" != property) {
                app.Client.LogOutGame(1);
            }
            return;
        }
        return this.dataInfo[property];
    },




    //获取当前选择城市数据
    GetCurSelectCityData:function(){
        this.allSelectCityData = [];
        let cityId = this.GetHeroProperty("cityId");
        if (cityId == 0 || cityId == null || typeof(cityId) == "undefined") {
            return [];
        }
        if(typeof(this.selectCityConfig[cityId]) == "undefined" || this.selectCityConfig[cityId]==null || this.selectCityConfig[cityId]==""){
            return [];
        }
        if(typeof(this.selectCityConfig[cityId]["Type"]) == "undefined"){
            return [];
        }
        let curType = this.selectCityConfig[cityId]["Type"];
        let curSelectData = {"selcetId" : cityId};
        if (curType == 1) {
            //选择的是省
            curSelectData.county = 0;
            curSelectData.city = 0;
            curSelectData.province = cityId;
        }else if (curType == 2) {
            //选择的是市
            curSelectData.county = 0;
            curSelectData.city = cityId;
            curSelectData.province = this.selectCityConfig[cityId]["Ascription"];
        }else{
            //选择的是县
            curSelectData.county = cityId;
            curSelectData.city = this.selectCityConfig[cityId]["Ascription"];
            curSelectData.province = this.selectCityConfig[curSelectData.city]["Ascription"];
        }
        this.allSelectCityData.push(curSelectData);
        return this.allSelectCityData;
    },

    //随机角色名
    // GetRandHeroName:function(){
    //     let familyKeyList = Object.keys(this.FamilyName);
    //     let nameKeyList = Object.keys(this.Name);

    //     let familyName = this.FamilyName[this.ComTool.ListChoice(familyKeyList)]["FamilyName"];
    //     let name = this.Name[this.ComTool.ListChoice(nameKeyList)]["Name"];

    //     return [familyName, name].join("");
    // },

    //-------------发包接口------------------------
});


var g_HeroManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_HeroManager){
        g_HeroManager = new HeroManager();
    }
    return g_HeroManager;
}