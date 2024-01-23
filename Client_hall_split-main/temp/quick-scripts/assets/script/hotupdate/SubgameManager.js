(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/hotupdate/SubgameManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4f9fbVvRBdPvY/2cWnnGxK5', 'SubgameManager', __filename);
// script/hotupdate/SubgameManager.js

"use strict";

var app = require("app");
var SubgameManager = {
    _storagePath: [],
    UIRLFILE_root: "", //演示包

    _getfiles: function _getfiles(name, type, downloadCallback, finishCallback) {
        this._storagePath[name] = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/' + name;
        this._downloadCallback = downloadCallback;
        this._finishCallback = finishCallback;
        this._fileName = name;
        if (this.UIRLFILE_root.length < 2) {
            this.UIRLFILE_root = app.Client.GetClientConfigProperty("UpdateGame");
        }
        var UIRLFILE = this.UIRLFILE_root + name + "/remote-assets";
        var files = this._storagePath[name] + '/project.manifest';

        console.log("SubgameManager._getfiles   UIRLFILE: " + UIRLFILE);

        var customManifestStr = JSON.stringify({
            'packageUrl': UIRLFILE,
            'remoteManifestUrl': UIRLFILE + '/project.manifest',
            'remoteVersionUrl': UIRLFILE + '/version.manifest',
            'version': '0.0.1',
            'assets': {},
            'searchPaths': []
        });

        var versionCompareHandle = function versionCompareHandle(versionA, versionB) {
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

        this._am = new jsb.AssetsManager('', this._storagePath[name], versionCompareHandle);
        this._am.setVerifyCallback(function (path, asset) {
            var compressed = asset.compressed;
            if (compressed) {
                return true;
            } else {
                return true;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }

        if (type === 1) {
            this._am.setEventCallback(this._updateCb.bind(this));
        } else if (type == 2) {
            this._am.setEventCallback(this._checkCb.bind(this));
        } else {
            this._am.setEventCallback(this._needUpdate.bind(this));
        }

        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(customManifestStr, this._storagePath[name]);
            this._am.loadLocalManifest(manifest, this._storagePath[name]);
        }

        if (type === 1) {
            this._am.update();
            this._failCount = 0;
        } else {
            this._am.checkUpdate();
        }
        this._updating = true;
        console.log('更新文件:' + files);
    },

    // type = 1
    _updateCb: function _updateCb(event) {
        var failed = false;
        var self = this;
        console.log("gameUpdate UpdateCb event:", event.getMessage());
        console.log("gameUpdate UpdateCb event:", event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                /*0 本地没有配置文件*/
                cc.log('updateCb本地没有配置文件');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                /*1下载配置文件错误*/
                cc.log('updateCb下载配置文件错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                /*2 解析文件错误*/
                cc.log('updateCb解析文件错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                /*3发现新的更新*/
                cc.log('updateCb发现新的更新');
                break;

            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                /*4 已经是最新的*/
                cc.log('updateCb已经是最新的');
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                /*5 最新进展 */
                self._downloadCallback && self._downloadCallback(event.getPercent(), event.getDownloadedBytes(), event.getTotalBytes());
                break;

            case jsb.EventAssetsManager.ASSET_UPDATED:
                /*6需要更新*/
                break;

            case jsb.EventAssetsManager.ERROR_UPDATING:
                /*7更新错误*/
                cc.log('updateCb更新错误');
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                /*8更新完成*/
                self._finishCallback && self._finishCallback(true);
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                /*9更新失败*/
                self._failCount++;
                if (self._failCount <= 3) {
                    self._am.downloadFailedAssets();
                    cc.log('updateCb更新失败' + this._failCount + ' 次');
                } else {
                    cc.log('updateCb失败次数过多');
                    self._failCount = 0;
                    failed = true;
                    self._updating = false;
                }
                break;

            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                /*10解压失败*/
                cc.log('updateCb解压失败');
                break;
        }

        if (failed) {
            self._updating = false;
            self._finishCallback && self._finishCallback(false);
        }
    },

    // type = 2
    _checkCb: function _checkCb(event) {
        var failed = false;
        var self = this;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                /*0 本地没有配置文件*/
                cc.log('checkCb本地没有配置文件');
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                /*1下载配置文件错误*/
                cc.log('checkCb下载配置文件错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                /*2 解析文件错误*/
                cc.log('checkCb解析文件错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                /*3发现新的更新*/
                self._getfiles(self._fileName, 1, self._downloadCallback, self._finishCallback);
                break;

            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                /*4 已经是最新的*/
                cc.log('checkCb已经是最新的');
                self._finishCallback && self._finishCallback(true);
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                /*5 最新进展 */
                break;

            case jsb.EventAssetsManager.ASSET_UPDATED:
                /*6需要更新*/
                break;

            case jsb.EventAssetsManager.ERROR_UPDATING:
                /*7更新错误*/
                cc.log('checkCb更新错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                /*8更新完成*/
                cc.log('checkCb更新完成');
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                /*9更新失败*/
                cc.log('checkCb更新失败');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                /*10解压失败*/
                cc.log('checkCb解压失败');
                break;

        }
        this._updating = false;
        if (failed) {
            self._finishCallback && self._finishCallback(false);
        }
    },

    // type = 3
    _needUpdate: function _needUpdate(event) {
        var self = this;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('子游戏已经是最新的，不需要更新');
                self._finishCallback && self._finishCallback(false);
                break;

            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('子游戏需要更新');
                self._finishCallback && self._finishCallback(true);
                break;

            // 检查是否更新出错
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ERROR_UPDATING:
            case jsb.EventAssetsManager.UPDATE_FAILED:
                self._downloadCallback();
                break;
        }
    },

    /**
     * 下载子游戏
     * @param {string} name - 游戏名
     * @param progress - 下载进度回调
     * @param finish - 完成回调
     * @note finish 返回true表示下载成功，false表示下载失败
     */
    downloadSubgame: function downloadSubgame(name, progress, finish) {
        this._getfiles(name, 2, progress, finish);
    },

    /**
     * 进入子游戏
     * @param {string} name - 游戏名
     */
    enterSubgame: function enterSubgame(name) {
        if (!this._storagePath[name]) {
            this.downloadSubgame(name);
            return;
        }
        console.log('enterSubgame ==== ' + this._storagePath[name]);
        window.require(this._storagePath[name] + '/src/main.js');
    },

    /**
     * 判断子游戏是否已经下载
     * @param {string} name - 游戏名
     */
    isSubgameDownLoad: function isSubgameDownLoad(name) {
        if (!cc.sys.isNative) {
            return;
        }
        var file = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'ALLGame/' + name + '/project.manifest';
        if (jsb.fileUtils.isFileExist(file)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 判断子游戏是否需要更新
     * @param {string} name - 游戏名
     * @param isUpdateCallback - 是否需要更新回调
     * @param failCallback - 错误回调
     * @note isUpdateCallback 返回true表示需要更新，false表示不需要更新
     */
    needUpdateSubgame: function needUpdateSubgame(name, isUpdateCallback, failCallback) {
        if (typeof app['isNeedCheckHotUpdate'] == "undefined" || app['isNeedCheckHotUpdate']) {
            console.log("正常检测更新:" + app['isNeedCheckHotUpdate']);
            this._getfiles(name, 3, failCallback, isUpdateCallback);
        } else {
            console.log("无需检测更新:" + app['isNeedCheckHotUpdate']);
            isUpdateCallback(false);
        }
    }
};

module.exports = SubgameManager;

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
        //# sourceMappingURL=SubgameManager.js.map
        