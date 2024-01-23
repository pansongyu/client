var app = require('app');

var UtilsWord = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init:function(){
        this.JS_Name = "UtilsWord";
        this.SysDataManager = app.SysDataManager();
        this.dirtyWord = this.SysDataManager.GetTableDict("keywords");
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
    //检查字符串是否有敏感字符
    CheckContentDirtyEx:function (string) {   
        for (var idx in this.dirtyWord) {
            if(-1 != string.indexOf(this.dirtyWord[idx].id)){
                return true;
            }
        }

        return false;
    },

    //检查分享的字符串是否有敏感字符
    CheckShareContent:function (string) {   
       
    },
  
  

});

var g_UtilsWord = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_UtilsWord){
        g_UtilsWord = new UtilsWord();
    }
    return g_UtilsWord;
}