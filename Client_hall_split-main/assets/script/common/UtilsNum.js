





var app = require('app');

var UtilsNum = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init:function(){
        this.JS_Name = "UtilsNum";
        console.log("UtilsNum init ");
        this.Log("Init");
    },

    CheckNumContinue:function(source) {
        var t;
        var ta;
        var r = [];

        source.forEach(function(v) {
            console.log(t, v);   // 跟踪调试用
            if (t === v) {
                ta.push(t);
                t++;
                return;
            }

            ta = [v];
            t = v + 1;
            r.push(ta);
        });

        return r;
    },


   

});

var g_UtilsNum = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_UtilsNum){
        g_UtilsNum = new UtilsNum();
    }
    return g_UtilsNum;
}