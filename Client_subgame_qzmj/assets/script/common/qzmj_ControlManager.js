/*
    控制器管理器
*/
var app = require("qzmj_app");

var qzmj_ControlManager = app.BaseClass.extend({

    Init:function(){
        this.JS_Name = app["subGameName"] + "_ControlManager";
        
        cc.game.on(cc.game.EVENT_HIDE,  this.OnEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW,  this.OnEventShow.bind(this));

        this.catchDataDict = {};
    },

    //--------------回掉函数---------------
    //应用切入后台
    OnEventHide:function(){
        app[app.subGameName + "Client"].OnEventHide();
        
    },

    //应用显示
    OnEventShow:function(){
        app[app.subGameName + "Client"].OnEventShow();
    },

    //---------------加载资源-----------------

    //创建异步下载资源对象
    CreateLoadPromise:function(resPath, resType=""){
        let that = this;
	    //如果已经加载
	    if(this.catchDataDict.hasOwnProperty(resPath)){
		    let loadData = this.catchDataDict[resPath];
		    return app.bluebird.resolve(loadData)
	    }
        
        // let gamePath = jsb.fileUtils.getSearchPaths() + "resources/" + resPath;
        
        //创建异步函数
        let promisefunc = function(resolve, reject){
            //加载资源
            
            cc.loader.loadRes(resPath, resType, function (error, loadData) {
                if(error){
                    reject(error);
                    that.ErrLog("CreateLoadPromise failed resPath(%s) resType(%s), error:%s", resPath, resType, error.stack);
                    that.ErrLog("CreateLoadPromise loadData(%s)", loadData);
                    
                    return
                }
                that.catchDataDict[resPath] = loadData;

                resolve(loadData);
            })};
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //加载JSON文件 cc.url.raw('resources/json/' + jsonFileName + ".json");
    CreateLoadPromiseByUrl:function(resPath){
        let that = this;

        //创建异步函数
        let promisefunc = function(resolve, reject){
            //加载资源
            cc.loader.load(resPath, function (error, loadData) {

                if(error){
                    reject(error);
                    return
                }

                resolve(loadData);
            })};
        //返回异步对象
        return new app.bluebird(promisefunc);   
    },

    //创建异步下载文件夹所有文件对象
    CreateLoadDirPromise:function(resPath, resType=""){
        //创建异步函数
        let promisefunc = function(resolve, reject){
            //加载资源
            cc.loader.loadResAll(resPath, resType, function (error, loadDataList) {

                if(error){
                    reject(error);
                    return
                }

                resolve(loadDataList);
            })};
        //返回异步对象
        return new app.bluebird(promisefunc);
    },

    //---------------释放资源-----------------
    ReleaseAllRes:function(){
        for(var key in this.catchDataDict){
            console.log("ReleaseAllRes key:" + key);
            if (key.indexOf("jsonData") > -1) {
                //只释放配表资源
                cc.loader.releaseRes(key);
            }
        }
        this.catchDataDict = {};
        cc.game.off(cc.game.EVENT_HIDE,  this.OnEventHide.bind(this));
        cc.game.off(cc.game.EVENT_SHOW,  this.OnEventShow.bind(this));
    },
});


var g_qzmj_ControlManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_qzmj_ControlManager){
        g_qzmj_ControlManager = new qzmj_ControlManager();
    }
    return g_qzmj_ControlManager;
}