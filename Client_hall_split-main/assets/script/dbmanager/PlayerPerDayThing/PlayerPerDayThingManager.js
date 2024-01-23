/*
    玩家每日刷新管理器
*/
var app = require('app');

var PlayerPerDayThingManager = app.BaseClass.extend({

    Init:function(){
        this.JS_Name = "PlayerPerDayThingManager";

        this.NetManager = app.NetManager();
        this.ServerTimeManager = app.ServerTimeManager();

        this.PlayerPerDayThingIndexToProperty = {};

        this.AllowOffTick = 1000;
        this.TimeIntervalTick = 20*1000;
        this.Hero_DayEventID = 1;

        this.OnReload();


        this.Log("Init");
    },

    //切换账号
    OnReload:function(){
        this.dataInfo = {};
        this.lastTick = 0;
    },



    //登陆初始化数据
    InitLoginData:function(dataList){

        if(!dataList){
            return
        }
        
        let count = dataList.length;
        for(let index=0; index<count; index++){
            let dataInfo = dataList[index];
            let eventID = dataInfo["EventID"];
            this.dataInfo[eventID] = dataInfo;
        }
    },


    /**
     *  获取属性值
     */
    SetPlayerPerDayThingProperty:function(eventID, property, value){
        let dataInfo = this.dataInfo[eventID];
        if(!dataInfo){
            this.ErrLog("SetPlayerPerDayThingProperty(%s,%s,%s) not find eventID", eventID, property, value);
            return 
        }
        if(!dataInfo.hasOwnProperty(property)){
            this.ErrLog("SetPlayerPerDayThingProperty(%s,%s,%s) property not find", eventID, property, value);
            return
        }
        dataInfo[property] = value;

        let argDict = {
			            "EventID":eventID,
			            "Property":property,
			            "Value":value,
			        };

        if(eventID == this.Hero_DayEventID){
            this.OnEventDay();
        }
        //app.Client.OnEvent("PlayerPerDayThingProperty", argDict);
    },

    //-----------------------回调接口------------------------
     /**
     * 属性字段变化
     * @param {}
     * @return {}
     * @remarks {}
     */
    OnPack_PerDayThingProperty:function(pack){
        let index = pack.Index;
        let value = pack.Value;
        let eventID = pack.KeyID;
        if(!this.PlayerPerDayThingIndexToProperty.hasOwnProperty(index)){
            this.ErrLog("OnPerDayThingProperty has not index{1}",index)
            return
        }

        let property = this.PlayerPerDayThingIndexToProperty[index];
        this.SetPlayerPerDayThingProperty(eventID, property, value);
    },


 

    //天变化事件
    OnEventDay:function(){
        app.Client.OnEvent("EventDay", {});
    },

    //---------------------获取接口---------------------------------

    //获取天事件完整数据
    GetPlayerPerDayThingInfo:function(eventID){
        let dataInfo = this.dataInfo[eventID];
        if(!dataInfo){
            this.ErrLog("GetPlayerPerDayThingInfo not find:%s", eventID);
            return
        }
        return dataInfo
    },

    /**
     *  获取属性值
     */
    GetPlayerPerDayThingProperty:function(eventID, property){

        let dataInfo = this.dataInfo[eventID];
        if(!dataInfo){
            this.ErrLog("GetPlayerPerDayThingProperty(%s,%s) not find key", eventID, property);
            return 
        }
        if(!dataInfo.hasOwnProperty(property)){
            this.ErrLog("GetPlayerPerDayThingProperty(%s,%s) property not find", eventID, property);
            return
        }
        return dataInfo[property];
    },

});


var g_PlayerPerDayThingManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_PlayerPerDayThingManager){
        g_PlayerPerDayThingManager = new PlayerPerDayThingManager();
    }
    return g_PlayerPerDayThingManager;
}