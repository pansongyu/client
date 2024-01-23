var app = require('app');
var ApkUpdateMgr = app.BaseClass.extend({
    
    HotUpdate: function () {
        this.SysLog("HotUpdate");
        app.HotUpdateMgr().HotUpdate();
    },

    //版本比较
    Check:function(){
        //var localVersion = app.NativeManager().CallToNative("getVersion", [], "String");
        var localVersion ='';
        if(!localVersion){
            this.HotUpdate();
            return;
        }
        var localVersionlist = localVersion.split(".");
        var ServerVersionlist = this.ApkVersion.split(".");
        this.SysLog("Check local=%s, server=%s", localVersion, this.ApkVersion);
        if(this.IsUpdateByVersion(localVersionlist, ServerVersionlist)) {
            this.SysLog("updateApk");
            this.updateApk();
        }
        else {
            this.HotUpdate();
        }
    },


     //是否需要更新
    IsNeedUpdate:function(){
        let bNeedUpdate = false;
        //var localVersion = app.NativeManager().CallToNative("getVersion", [], "String");
        var localVersion = '';
        if(localVersion) {
            var localVersionlist = localVersion.split(".");
            var ServerVersionlist = this.ApkVersion.split(".");
            bNeedUpdate = this.IsUpdateByVersion(localVersionlist, ServerVersionlist);
        }
       

        return bNeedUpdate;
    },

    //android版本检查
    // CheckAndroidVersion:function()
    // {
    //     var url = this.getApkVersionURl; //"http://www.zle.com/zle.txt";

    //     //每次都实例化一个，否则会引起请求结束，实例被释放了
    //     var httpRequest = null;
    //     try {
    //             httpRequest =  new ActiveXObject ("Microsoft.XMLHTTP");
    //     }catch(e){
    //         try {
    //             httpRequest = new XMLHttpRequest();
    //         }catch(e) {
    //             this.SysLog("CheckAndroidVersion");
    //         }
    //     }
    //     httpRequest.open("GET", url, true);
    //     httpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     //服务器json解码
    //     httpRequest.setRequestHeader("Content-Type", "text/html");

    //     var that = this;
    //     httpRequest.onerror = function(){
    //         that.ErrLog("httpRequest.error:%s", url);
    //         that.HotUpdate();
    //     };
        
    //     httpRequest.onreadystatechange = function(){
    //         //执行成功
    //         if (httpRequest.status == 200){
                
    //             var localVersion = app.NativeManager().CallToNative("getVersion", [], "String");//app.LocalDataManager().HaveConfigProperty("SysSetting","localVersion") ?  app.LocalDataManager().GetConfigProperty("SysSetting","localVersion") : "0.0";
    //             if(!localVersion){
    //                 that.HotUpdate();
    //                 return;
    //             }
    //             var localVersionlist = localVersion.split(".");
    //             var ServerVersionlist = httpRequest.responseText.split(".");
    //             that.SysLog("CheckAndroidVersion local=%s, server=%s", localVersion, httpRequest.responseText);
    //             if(that.IsUpdateByVersion(localVersionlist, ServerVersionlist))
    //             {
    //                 that.SysLog("updateApk");
    //                 that.updateApk();
    //             }
    //             else
    //             {
    //                 that.HotUpdate();
    //             }
    //         }
    //         else{
                
    //             that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
    //             that.HotUpdate();
    //         }
    //     };
    //     httpRequest.send("");
    // },

    //比较字符串大小
    IsUpdateByVersion:function(localVersion, serverVersion){
        if(serverVersion.length > localVersion.length){
            return true;
        }
        for (var i = 0; i < localVersion.length; i++) {
            let local = parseInt(localVersion[i]);
            let server = i < serverVersion.length ? parseInt(serverVersion[i]) : 0;
            if(parseInt(localVersion[i]) < parseInt(serverVersion[i])){
                return true;
            }
        }
        return false;
    },

    //更新apk 
    updateApk:function(){    
            let storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/';
            let argList = [{"Name":"urls","Value":this.getApkRUl},{"Name":"fileName","Value":"HZ-release.apk"},{"Name":"savePath","Value":storagePath}];   
            let downLoadMgr = app.DownLoadMgr();
            downLoadMgr.DownFile(this.getApkRUl, storagePath, "HZ-release.apk", "LoadApkProess");  
    },

    //版本检查
    CheckVersion:function(getApkRUl, ApkVersion){
        this.getApkRUl = getApkRUl;
        this.ApkVersion = ApkVersion;
        if(this.getApkRUl == null || this.getApkRUl == "")
        {
            this.getApkRUl = "http://www.qp993/HZ-release.apk";
        }
        if(this.ApkVersion == null || this.ApkVersion == "")
        {
            this.ApkVersion = "1.0.0";
        }
        this.SysLog("CheckVersion this.getApkRUl:%s, this.getApkVersionURl:%s", this.getApkRUl, this.ApkVersion);
        if(app.ComTool().IsAndroid()){
            return this.Check();
            //return this.CheckAndroidVersion();
        }
        else if(app.ComTool().IsIOS()){
            return this.HotUpdate();
        }
        else{
            this.ErrLog("CallToNative:%s error", cc.sys.os);
        }
    },
});

var g_ApkUpdateMgr = null;

exports.GetModel = function(){
    if(!g_ApkUpdateMgr)
        g_ApkUpdateMgr = new ApkUpdateMgr();
    return g_ApkUpdateMgr;

}
