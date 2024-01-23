(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/fjssz_HotUpdateMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz143-8c1f-4b51-b610-f41a6b7688d9', 'fjssz_HotUpdateMgr', __filename);
// script/common/fjssz_HotUpdateMgr.js

'use strict';

// Custom manifest removed the following assets:
// 1. res/raw-assets/textures/UI/chat/button_orange.png
// 2. res/raw-assets/textures/UI/chat/gb_inputbox.png
// So when custom manifest used, you should be able to find them in downloaded remote assets
/*
*/
var app = require("fjssz_app");
var fjssz_HotUpdateMgr = app.BaseClass.extend({
    // use this for initialization
    Init: function Init() {
        console.log('fjssz_HotUpdateMgr Init');

        this.LocalVersion = '';

        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            console.log("cc.sys.inNavite exit,", cc.sys.isNative);
            return;
        }

        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/' + app.subGameName;
        /// 替换该地址
        var UIRLFILE = "http://updateqh.qp355.com:82/" + app.subGameName + "/remote-assets";

        var customManifestStr = JSON.stringify({
            'packageUrl': UIRLFILE,
            'remoteManifestUrl': UIRLFILE + '/project.manifest',
            'remoteVersionUrl': UIRLFILE + '/version.manifest',
            'version': '0.0.1',
            'assets': {},
            'searchPaths': []
        });
        var versionCompareHandle = function versionCompareHandle(versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
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
            } else {
                // console.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
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
    CheckUpdate: function CheckUpdate() {
        if (!cc.sys.isNative) {
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            return;
        }
        this._am.setEventCallback(this.CheckCb.bind(this));
        this._am.checkUpdate();
    },

    CheckCb: function CheckCb(event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log("游戏有新版本");
                app[app.subGameName + "Client"].OnEvent('NewVersion');
                break;
            default:
                return;
        }
        this._am.setEventCallback(null);
        this._checkListener = null;
    },
    //获取本地版本
    getLocalVersion: function getLocalVersion() {
        // this.SysLog("getLocalVersion version:%s", this.LocalVersion);
        if (this.LocalVersion == '' && this._am && !this._updating) {
            this.LocalVersion = this._am.getLocalManifest().getVersion();
        }
        return this.LocalVersion;
    },
    Destroy: function Destroy() {
        this._am.setEventCallback(null);
    }
});

var g_fjssz_HotUpdateMgr = null;

exports.GetModel = function () {
    if (!g_fjssz_HotUpdateMgr) g_fjssz_HotUpdateMgr = new fjssz_HotUpdateMgr();
    return g_fjssz_HotUpdateMgr;
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=fjssz_HotUpdateMgr.js.map
        