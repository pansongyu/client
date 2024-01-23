
// Custom manifest removed the following assets:
// 1. res/raw-assets/textures/UI/chat/button_orange.png
// 2. res/raw-assets/textures/UI/chat/gb_inputbox.png
// So when custom manifest used, you should be able to find them in downloaded remote assets
 /*
jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
jsb.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
jsb.EventAssetsManager.NEW_VERSION_FOUND = 3;
jsb.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
jsb.EventAssetsManager.UPDATE_PROGRESSION = 5;
jsb.EventAssetsManager.ASSET_UPDATED = 6;
jsb.EventAssetsManager.ERROR_UPDATING = 7;
jsb.EventAssetsManager.UPDATE_FINISHED = 8;
jsb.EventAssetsManager.UPDATE_FAILED = 9;
jsb.EventAssetsManager.ERROR_DECOMPRESS = 10;
*/
var app = require('app');
var HotUpdateMgr = app.BaseClass.extend({
    // use this for initialization
    Init: function () {
        console.log('HotUpdateMgr Init');
        this._updating = false;
        this._storagePath= '';
        this._canRetry = false;
        this.restarting=false;
        this.LocalVersion = '';
        this.UIRLFILE_root = app.Client.GetClientConfigProperty("UpdateUrl");//演示

        // Hot update is only available in Native build
        if (!cc.sys.isNative){
            console.log("cc.sys.inNavite exit,",cc.sys.isNative);
            return;
        }
    
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'hall');

        console.log('Storage path for remote asset : ' + this._storagePath);
        /// 替换该地址
        var UIRLFILE =null;
        this.firstDown=false;
        if(this.isHallDownLoad()==true){
            UIRLFILE = this.UIRLFILE_root + "hall_item/remote-assets/";
        }else{
            //this.firstDown=true;
            UIRLFILE = this.UIRLFILE_root + "hall/remote-assets/";
        }
        console.log('HotUpdateMgr this.firstDown:' + this.firstDown);
        var customManifestStr = JSON.stringify({
            'packageUrl': UIRLFILE,
            'remoteManifestUrl': UIRLFILE + '/project.manifest',
            'remoteVersionUrl': UIRLFILE + '/version.manifest',
            'version': '0.0.1',
            'assets': {},
            'searchPaths': []
        });
        var versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        
        this._am = new jsb.AssetsManager('', this._storagePath, versionCompareHandle);

        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                return true;
            }
            else {
                console.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }
    },
    /**
     * 判断子游戏是否已经下载
     * @param {string} name - 游戏名
     */
    isHallDownLoad: function () {

        return false;

        let file = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'hall/project.manifest';
        if (jsb.fileUtils.isFileExist(file)) {
            let jsonString = jsb.fileUtils.getStringFromFile(file);
            if (jsonString.indexOf("res.zip") > -1) {
                console.log("HotUpdateMgr isHallDownLoad Have res.zip,is not change project.manifest");
                return false;
            }
            console.log("HotUpdateMgr isHallDownLoad project.manifest exist");
            return true;
        } else {
            console.log("HotUpdateMgr isHallDownLoad project.manifest not exist");
            return false;
        }
    },
    SaveManifest:function(){
        console.log("SaveManifest begin");
        let path_Manifest=this.UIRLFILE_root+"hall/remote-assets/project_item.manifest";
        let file = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'hall/project.manifest';
        this.downFile2Local(path_Manifest,file);
    },
    downFile2Local:function(url, fileName){
        let self=this;
        var downloader = new jsb.Downloader();
        downloader.setOnFileTaskSuccess(function(){
            console.log("downFile2Local: project_item.manifest  is down success");    
            self.RestartApp();
        });
        downloader.setOnTaskError(function(){     
            console.log("downFile2Local: project_item.manifest  is down error");    
            self.RestartApp();
        });
        downloader.createDownloadFileTask(url, fileName);//创建下载任务
    },
    
    //获取本地版本
    getLocalVersion:function(){
        console.log("getLocalVersion version:"+this.LocalVersion);
        if (this.LocalVersion == '' && this._am && !this._updating) {
            this.LocalVersion = this._am.getLocalManifest().getVersion();
        }
        return this.LocalVersion;
    },

    HotUpdate: function () {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.UpdateCb.bind(this));
            this.LocalVersion = this._am.getLocalManifest().getVersion();
            console.log("LocalVersion === " + this.LocalVersion);
            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },
    
   

    UpdateCb: function (event) {
        var needRestart = false;
        var failed = false;
        console.log("ResUpdate UpdateCb event:", event.getMessage());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                app["startCompress"] = false;
                //app["updatepercent"]=parseInt(event.getPercentByFile() * 100);
                app["updatepercent"]=parseInt(event.getDownloadedBytes()/event.getTotalBytes()*100);
                console.log("UpdateCb getPercent:" + parseInt(event.getPercent()));
                console.log("UpdateCb getDownloadedFiles:" + event.getDownloadedFiles() + ' / ' + event.getTotalFiles());
                console.log("UpdateCb getDownloadedBytes:" + event.getDownloadedBytes() + ' / ' + event.getTotalBytes());
                if (event.getDownloadedBytes() == event.getTotalBytes()) {
                    console.log("资源下载完成");
                    //if(this.firstDown==true){
                        app["startCompress"] = true;
                    //}
                }
                var msg = event.getMessage();
                if (msg) {
                    console.log('Updated file: ' + msg);
                    console.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                app.Client.LoadLogin();
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                app.Client.LoadLogin();
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                app.SysNotifyManager().ShowSysMsg("更新完成...",[],3);
                needRestart = true;
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                /*needRestart = true;*/
                console.log("资源下载完成");
                //if(this.firstDown==true){
                    app["startCompress"] = true;
                //}
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this._updating = false;
                this._canRetry = true;
               // failed = true;
                // console.log('downloadFailedAssets');
                app.SysNotifyManager().ShowSysMsg("更新失败，重新更新...",[],3);
                this._am.downloadFailedAssets();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                //needRestart = true;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());

                //needRestart = true;
                break;
            case  jsb.EventAssetsManager.NEW_VERSION_FOUND:
                //版本判断
                // console.log("CheckCb getRemoteManifest:%s", this._am.getRemoteManifest().getVersion());
                // console.log("CheckCb hotUpdateVersion:%s", app.Client.GetClientConfigProperty("hotUpdateVersion"));
                // if(this._am.getRemoteManifest().getVersion() <= app.Client.GetClientConfigProperty("hotUpdateVersion")){
                //     console.log("版本号已经足够高了");
                //     app.Client.LoadLogin();
                //     this.Destroy();
                //     return;
                // }
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }
       // console.log('HotUpdateMgr needRestart', needRestart);

        if (needRestart) {
            this.RestartApp();
            //刷新热更文件
            /*if(this.firstDown==true){
                console.log('HotUpdateMgr is firstDown');
                this.SaveManifest();
            }else{
                //刷新热更文件
                console.log('HotUpdateMgr needRestart begin');
               this.RestartApp();
            }*/
        }else{
            console.log('HotUpdateMgr not needRestart');
        }
    },
    RestartApp:function(){
        if(this.restarting==true){
            //已经在重启，无需重启
            return;
        }
        this.restarting=true;
        this._am.setEventCallback(null);
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var newPaths = this._am.getLocalManifest().getSearchPaths();
         console.log(JSON.stringify(newPaths));
        Array.prototype.unshift.apply(searchPaths, newPaths);
                // This value will be retrieved and appended to the default search path during game startup,
                // please refer to samples/js-tests/main.js for detailed usage.
                // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        jsb.fileUtils.setSearchPaths(searchPaths);

        cc.audioEngine.stopAll();
        cc.game.restart();
    },
    CheckUpdate: function () {
        if (this._updating) {
            console.log("正在更新，无法检测...");
            app.SysNotifyManager().ShowSysMsg("正在更新，无法检测...",[],3);
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            app.SysNotifyManager().ShowSysMsg("热更状态错误...",[],3);
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            console.log("加载本地Manifest失败...");
            app.SysNotifyManager().ShowSysMsg("加载本地Manifest失败...",[],3);
            return;
        }
        // this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.CheckCb.bind(this));
        // cc.eventManager.addListener(this._checkListener, 1);
        this._am.setEventCallback(this.CheckCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
    },

    CheckCb: function (event) {
        console.log('CheckCb begin');
        cc.log('Code: ' + event.getEventCode());
        // app.SysNotifyManager().ShowSysMsg("检测新版本状态 "+event.getEventCode(),[],3);
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                //this.panel.info`.string = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('CheckCb NEW_VERSION_FOUND');
                app.ForceUpdateMgr().Update();
                break;
            default:
                return;
        }
        console.log('CheckCb end');
        
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    },


    Destroy: function () {
         this._am.setEventCallback(null);
    }
});

var g_HotUpdateMgr = null;

exports.GetModel = function(){
    if(!g_HotUpdateMgr)
        g_HotUpdateMgr = new HotUpdateMgr();
    return g_HotUpdateMgr;

}