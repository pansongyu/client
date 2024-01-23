var app = require("pdk_app");

var pdk_UtilsWord = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init:function(){
        this.JS_Name = app.subGameName + "_UtilsWord";
        this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
        this.dirtyWord = this.SysDataManager.GetTableDict("keywords");
        // console.log("UtilsWord init ",this.dirtyWord);
    },
    //检查字符串是否有敏感字符
    CheckContentDirty:function (string) {   
        for (var idx in this.dirtyWord) {
            if(-1 != string.indexOf(this.dirtyWord[idx].id)){
                var reg = new RegExp(this.dirtyWord[idx].id,"g");
                string = string.replace(reg, "**");  
            }
        }

        return string;
    },


    //检查分享的字符串是否有敏感字符
    CheckShareContent:function (string) {   
       
    },
  
  

});

var g_pdk_UtilsWord = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_pdk_UtilsWord){
        g_pdk_UtilsWord = new pdk_UtilsWord();
    }
    return g_pdk_UtilsWord;
}