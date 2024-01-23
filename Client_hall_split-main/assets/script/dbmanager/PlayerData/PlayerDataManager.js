/*
    玩家汇总数据管理器
 */
var app = require('app');

var PlayerDataManager = app.BaseClass.extend({

    Init:function(){
        this.JS_Name = "PlayerDataManager";
        if (this.SwitchGameData == null) {
            this.SwitchGameData = [];
        }
    },

    SetSwitchGameData:function(data){
        this.SwitchGameData.push(data);
    },

    GetSwitchGameData:function(){
        return this.SwitchGameData;
    },

    ClearSwitchGameData:function(){
        this.SwitchGameData = [];
    },
});


var g_PlayerDataManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_PlayerDataManager){
        g_PlayerDataManager = new PlayerDataManager();
    }
    return g_PlayerDataManager;
}