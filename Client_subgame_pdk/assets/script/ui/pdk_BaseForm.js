/*
 BaseForm 界面基类(又FormManager控制创建和销毁)
 */

var app = require("pdk_app");

//界面层级枚举
var ZorderLvEnum = cc.Enum({

    //置底界面层(UIFightTower)
    ZorderLv0: 0,

    //聊天层(UIChat)
    ZorderLv1: 1,

    //玩家头像层(UIPlayer)
    ZorderLv2: 2,

    //通用背景层(UIResource)
    ZorderLv3: 3,

    //布阵层
    ZorderLv4: 4,

    //主场景工具层(UIMenu)
    ZorderLv5: 5,

    //正常界面层(多数界面)
    ZorderLv6: 6,

    //置顶层(3级界面使用到,UICardPackFragSale)
    ZorderLv7: 7,

    //模态层,消息提示层(UIMessage)
    ZorderLv8: 8,

    //debugTool界面
    ZorderLv9: 9,
});

//界面显示动画枚举

var ShowEffectEnum = cc.Enum({

    //没有效果
    None: 0,
    //从上划入
    FromTop: 1,
    //从下划入
    FromBottom: 2,
    //从左划入
    FromLeft: 3,
    //从右划入
    FromRight: 4,
    //从中间从小变大
    FromCenter: 5,
});


//界面关闭动画枚举
var CloseEffectEnum = cc.Enum({

    //没有效果
    None: 0,
    //从上划入
    ToTop: 1,
    //从下划入
    ToBottom: 2,
    //从左划入
    ToLeft: 3,
    //从右划入
    ToRight: 4,
    //从中间从小变大
    ToCenter: 5,
});


var pdk_BaseForm = cc.Class({

    extends: require(app.subGameName + "_BaseComponent"),

    properties: {

        //显示界面效果类型
        "ShowEffectType": {
            "default": ShowEffectEnum.None,
            "tooltip": "显示界面动画",
            "type": ShowEffectEnum,
        },

        //关闭界面效果类型
        "CloseEffectType": {
            "default": CloseEffectEnum.None,
            "tooltip": "关闭界面动画",
            "type": CloseEffectEnum,
        },

        //场景精灵层级
        "ZorderLv": {
            "default": ZorderLvEnum.ZorderLv6,
            "tooltip": "界面层级",
            "type": ZorderLvEnum,
        },

    },
    //创建对象是被调用(OnLoad前,还未执行addChild,逻辑层初始化)
    OnCreate: function (formName) {
        this.JS_Name = formName;

        this.OpenActionTag = 1000;
        this.InitNodeScale = this.node.scale;

        //界面数据
        this._dataInfo = {
            "FormName": formName,
        };


        this.InitBaseData();

        this.OnCreateInit();
        this.ShowFormName();
    },

    //BaseChildForm也需要初始化调用这个接口
    InitBaseData: function () {
        //管理器
        this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();
        this.ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
        this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.EffectManager = app[app.subGameName + "_EffectManager"]();
        this.FormManager = app[app.subGameName + "_FormManager"]();
        this.SoundManager = app[app.subGameName + "_SoundManager"]();
        this.LocalDataManager = app.LocalDataManager();
        this.SDKManager = app[app.subGameName + "_SDKManager"]();
        //表配置
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
        this.Effect = this.SysDataManager.GetTableDict("Effect");


        this.node.on("EffectAnimationEnd", this.OnEffectAnimationEnd.bind(this));

        //-----成员变量----------------
        //控件特效
        // {    spt_card/icon
        //     wndPath:{effectName:effectComponent},
        // }
        this._effectDict = {};

        //-----事件注册函数字典------------
        this._eventFuncDict = {};

        //子类界面组件字典
        this._childFormComponentDict = {};

        //子类界面缓存字典
        // {
        //     'UICardReplace_Child':new cc.NodePool('UICardReplace_Child'),
        // }
        this._cacheChildFormDict = {};
        //等待加载的贴图信息字典
        this._loadWndImageDict = {};

    },

    //------------回掉函数----------------

    // active node时调用
    onLoad: function () {

    },

    //销毁界面
    Destroy: function () {

        app[app.subGameName + "Client"].UnRegTargetEvent(this);

        this._eventFuncDict = {};

        this.OnDestroy();
        //销毁节点
        this.node.destroy();
    },

    //没帧回掉
    update: function (dt) {
        try {
            this.OnUpdate(dt);
        } catch (error) {
            this.ErrLog("update:%s", error.stack);
        }

    },

    //显示界面
    ShowForm: function (argList) {

        if (!argList) {
            argList = [];
        }

        let formName = this._dataInfo["FormName"];
        //获取到当前场景的画布
        let parent = cc.find('Canvas/uiLayer');
        if (!parent) {
            this.ErrLog("ShowForm not find uiLayer");
            return
        }

        if (this.node.parent == parent) {
        } else {
            //设置界面新父类
            parent.addChild(this.node, this.ZorderLv);

            this.ShowFormAction();

            //开启界面重新注册已经注册的监听事件
            for (let eventName in this._eventFuncDict) {
                app[app.subGameName + "Client"].RegEvent(eventName, this._eventFuncDict[eventName], this);
            }

            this.FormManager.AddShowingForm(formName, this);
        }
        try {
            this.OnShow.apply(this, argList);
        } catch (error) {
            console.log("ShowForm error:" + error.stack);
        }

    },

    //关闭界面
    CloseForm: function () {
        //获取到当前场景的画布
        let parent = cc.find('Canvas/uiLayer');

        if (this.node.parent != parent) {
            return
        }
        //关闭界面则取消所有事件监听
        app[app.subGameName + "Client"].UnRegTargetEvent(this);

        this.CloseFormAction();

        this.OnClose();

        this.node.removeFromParent(false);

        this.FormManager.RemoveShowingForm(this._dataInfo["FormName"]);

    },

    //开启或者关闭界面
    ShowOrCloseForm: function (argList) {
        if (this.IsFormShow()) {
            this.CloseForm();
            return false
        } else {
            this.ShowForm(argList);
            return true
        }
    },

    //界面动作执行界面回调
    OnFormActionEnd: function (sender, userData) {

    },

    ShowFormName: function () {
        return;
        let node = new cc.Node("LabelFormName");

        node.parent = this.node;
        node.setPosition(10, -10);
        let label = node.addComponent(cc.Label);
        label.string = this.GetFormProperty("FormName");
        label.fontSize = 25
        node.color = this.ShareDefine.Color_Orange;
    },

    //--------------获取接口-----------------

    //界面是否显示中
    IsFormShow: function () {
        let parent = cc.find('Canvas/uiLayer');

        if (this.node.parent == parent) {
            return true
        }

        return false
    },

    IsShow: function (uiName = '') {
        let childs = this.node.parent.children;
        for (let i = 0; i < childs.length; i++) {
            if (uiName == childs[i].name && childs[i].active)
                return true;
        }
        return false;
    },
    //--------------动作函数------------
    //显示界面动作
    ShowFormAction: function () {

        let openAction = null;

        //设置起点缩放倍速
        let startScale = this.InitNodeScale * 0.5;

        switch (this.ShowEffectType) {

            case ShowEffectEnum.None:
                break
            case ShowEffectEnum.FromTop:
                openAction = cc.scaleTo(0.5, this.InitNodeScale).easing(cc.easeElasticOut());
                break
            case ShowEffectEnum.FromBottom:
                openAction = cc.scaleTo(0.5, this.InitNodeScale).easing(cc.easeElasticOut());
                break
            case ShowEffectEnum.FromLeft:
                openAction = cc.scaleTo(0.5, this.InitNodeScale).easing(cc.easeElasticOut());
                break
            case ShowEffectEnum.FromRight:
                openAction = cc.scaleTo(0.5, this.InitNodeScale).easing(cc.easeElasticOut());
                break
            case ShowEffectEnum.FromCenter:
                openAction = cc.scaleTo(0.5, this.InitNodeScale).easing(cc.easeElasticOut());
                break
            default:
                this.ErrLog("ShowEffectType:%s error", this.ShowEffectType);
                break
        }

        //如果之前有打开动作,先停止
        this.node.stopActionByTag(this.OpenActionTag);

        if (openAction) {
            let action = cc.sequence(
                openAction,
                cc.callFunc(this.OnFormActionEnd, this, "OpenAction"),
            );
            action.setTag(this.OpenActionTag);
            this.node.scale = startScale;
            this.node.runAction(action);
        }
    },

    //关闭界面动作
    CloseFormAction: function () {
        //let closeAction = cc.scaleTo(0.5, 1).easing(cc.easeElasticIn());
    },

    //-------------子类界面操作接口------------------
    //创建子类界面
    /*
     childComponentName:子类界面的组件名字 字符串类型 "UIBuyCard_Child"
     childPrefab:子类界面的预制对象,cc.Prefab类型
     userData:子界面特殊数据 默认0
     parentNode:子界面的父类node 默认为界面自身对象node
     pos:子类创建时的坐标,可不传
     zorderLv:子类层级
     argument:传递给子类的显示参数 ShowForm(argument) 最终在OnShow(argument)接收
     isShowForm:创建子类默认是否显示
     */
    CreateChildForm: function (childComponentName, childPrefab, userData = 0, parentNode = null, pos = null, zorderLv = 0, argument = null, isShowForm = true) {

        if (!parentNode) {
            parentNode = this.node;
        }
        let childFormNode = this.NewChildFormNode(childComponentName, childPrefab);

        let childFormComponent = childFormNode.getComponent(childComponentName);
        if (!childFormComponent) {
            //如果子类node没有这个组件,则主动添加组件对象
            this.WarnLog("CreateChildForm not find:%s addComponent", childComponentName);
            childFormComponent = childFormNode.addComponent(childComponentName);
            if (!childFormComponent) {
                this.ErrLog("CreateChildForm(%s) fail", childComponentName);
                return
            }
        }
        childFormComponent.OnCreate(this, childComponentName, 0, userData, pos);
        parentNode.addChild(childFormNode, zorderLv);

        this.AddChildFormComponent(childComponentName, childFormComponent);

        if (isShowForm) {
            childFormComponent.ShowForm(argument);
        } else {
            childFormComponent.CloseForm(argument);
        }

        return childFormComponent

    },

    //new一个字界面node
    NewChildFormNode: function (childComponentName, childPrefab) {

        let childFormNode = null;

        //如果有缓存从缓存中取
        if (this._cacheChildFormDict.hasOwnProperty(childComponentName)) {
            childFormNode = this._cacheChildFormDict[childComponentName].get()
        }

        //如果没有创建缓存,创建一个新对象
        if (!childFormNode) {
            childFormNode = cc.instantiate(childPrefab);
        }

        return childFormNode
    },

    AddChildFormComponent: function (childComponentName, childFormComponent) {
        let childFormComponentList = this._childFormComponentDict.SetDefault(childComponentName, []);
        childFormComponentList.push(childFormComponent)
    },

    //通过userData获取子类的组件对象
    GetChildComponentByUserData: function (childComponentName, userData) {
        let allChildFormComponentList = this._childFormComponentDict[childComponentName];
        if (!allChildFormComponentList) {
            this.ErrLog("GetChildComponentByUserData not find(%s)", childComponentName);
            return
        }
        let count = allChildFormComponentList.length;
        for (let index = 0; index < count; index++) {
            let childComponent = allChildFormComponentList[index];
            let childUserData = childComponent.GetFormProperty("UserData");
            if (childUserData == userData) {
                return childComponent
            }
        }
    },

    //通过索引获取子类界面
    GetChildComponentByChildIndex: function (childComponentName, childIndex) {
        let allChildFormComponentList = this._childFormComponentDict[childComponentName];
        if (!allChildFormComponentList) {
            this.ErrLog("GetChildComponentByChildIndex not find(%s)", childComponentName);
            return
        }
        let childComponent = allChildFormComponentList[childIndex];
        if (!childComponent) {
            this.ErrLog("GetChildComponentByChildIndex(%s,%s) not find child", childComponentName, childIndex);
            return
        }
        return childComponent
    },

    //返回子界面列表
    GetAllChildComponentByName: function (childComponentName) {

        if (this._childFormComponentDict.hasOwnProperty(childComponentName)) {
            return this._childFormComponentDict[childComponentName];
        }
        return []
    },

    //清楚掉指定的子类
    ClearAllChildComponentByName: function (childComponentName) {

        if (!this._childFormComponentDict.hasOwnProperty(childComponentName)) {
            return
        }
        let allChildFormList = this._childFormComponentDict[childComponentName];

        delete this._childFormComponentDict[childComponentName];

        if (!this._cacheChildFormDict.hasOwnProperty(childComponentName)) {
            this._cacheChildFormDict[childComponentName] = new cc.NodePool(childComponentName)
        }
        let cacheNodePool = this._cacheChildFormDict[childComponentName];

        let count = allChildFormList.length;
        for (let index = 0; index < count; index++) {
            let childFormComponent = allChildFormList[index];
            cacheNodePool.put(childFormComponent.node);
        }
    },

    ClearFormAllChildComponent: function () {

        for (let childComponentName in this._childFormComponentDict) {

            if (!this._cacheChildFormDict.hasOwnProperty(childComponentName)) {
                this._cacheChildFormDict[childComponentName] = new cc.NodePool(childComponentName)
            }
            let cacheNodePool = this._cacheChildFormDict[childComponentName];

            let allChildFormList = this._childFormComponentDict[childComponentName];
            let count = allChildFormList.length;
            for (let index = 0; index < count; index++) {
                cacheNodePool.put(allChildFormList[index].node);
            }
        }

        this._childFormComponentDict = {};
    },

    //获取指定子类的缓存池对象
    GetChildFormCacheNodePool: function (childComponentName) {
        if (!this._cacheChildFormDict.hasOwnProperty(childComponentName)) {
            this._cacheChildFormDict[childComponentName] = new cc.NodePool(childComponentName)
        }
        return this._cacheChildFormDict[childComponentName];
    },

    //触发子类事件
    TriggerChildEvent: function (childComponentName, userData, eventName, argDict) {

        let allChildFormComponentList = this._childFormComponentDict[childComponentName];
        if (!allChildFormComponentList) {
            this.ErrLog("TriggerChildEvent not find(%s)", childComponentName);
            return
        }
        let count = allChildFormComponentList.length;
        for (let index = 0; index < count; index++) {
            let childComponent = allChildFormComponentList[index];
            let childUserData = childComponent.GetFormProperty("UserData");

            //找到一个子类,执行则跳出
            if (childUserData == userData) {
                childComponent.OnParentEvent(eventName, argDict);
                break
            }
        }
    },

    //触发子界面事件
    TriggerChildEventByChildComponent: function (childComponent, eventName, argDict) {
        childComponent.OnParentEvent(eventName, argDict);
    },

    //触发所有子类的事件
    TriggerAllChildEvent: function (childComponentName, eventName, argDict) {
        let allChildFormComponentList = this._childFormComponentDict[childComponentName];
        if (!allChildFormComponentList) {
            this.ErrLog("TriggerAllChildEvent not find(%s)", childComponentName);
            return
        }
        let count = allChildFormComponentList.length;
        for (let index = 0; index < count; index++) {
            allChildFormComponentList[index].OnParentEvent(eventName, argDict);
        }
    },


    //-------------获取接口-------------------
    GetFormContentSize: function () {
        return this.node.getContentSize();
    },
    //获取界面属性
    GetFormProperty: function (property) {

        if (!this._dataInfo.hasOwnProperty(property)) {
            this.ErrLog("GetFormProperty not find:%s", property);
            return
        }
        return this._dataInfo[property];
    },

    GetWndNode: function (wndPath) {
        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("GetWndNode(%s) not find", wndPath);
            return
        }
        return wndNode
    },

    //获取指定控件的组件对象
    GetWndComponent: function (wndPath, componentType) {

        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("GetWndComponent wndPath(%s) error", wndPath);
            return
        }

        let wndComponent = wndNode.getComponent(componentType);

        if (!wndComponent) {
            this.ErrLog("GetWndComponent wndPath(%s) not find Component(%s)", wndPath, componentType.name);
            return
        }
        return wndComponent
    },

    GetWndProperty: function (wndPath, property) {
        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("GetWndProperty(%s,%s) not find wndPath", wndPath, property);
            return
        }

        let wndComponent = null;
        if (property == "text") {
            wndComponent = wndNode.getComponent(cc.Label);
            //可能是label
            if (wndComponent) {
            }
            //没有label可能是editbox
            else {
                wndComponent = wndNode.getComponent(cc.EditBox);
            }

            if (!wndComponent) {
                this.ErrLog("GetWndProperty(%s,%s) wnd not find cc.Label cc.EditBox", wndPath, property);
                return
            }
            return wndComponent.string;
        } else if (property == "position") {
            return wndNode.getPosition()
        } else if (property == "active") {
            return wndNode.active;
        } else if (property == "color") {
            return wndNode.color;
        } else if (property == "scale") {
            return wndNode.scale;
        } else if (property == "opacity") {
            return wndNode.opacity;
        } else if (property == "interactable") {
            wndComponent = wndNode.getComponent(cc.Button);
            if (!wndComponent) {
                this.ErrLog("GetWndProperty(%s,%s) wnd not find cc.Button", wndPath, property);
                return
            }
            return wndComponent.interactable;
        } else if (property == "progress") {
            wndComponent = wndNode.getComponent(cc.ProgressBar);
            if (!wndComponent) {
                this.ErrLog("GetWndProperty(%s,%s) wnd not find cc.ProgressBar", wndPath, property);
                return
            }
            return wndComponent.progress;
        } else {
            this.ErrLog("GetWndProperty(%s,%s) property error", wndPath, property);
            return
        }
    },


    //-------------设置接口-----------------

    SetFormPosition: function (pos) {
        this.node.setPosition(pos);
    },

    //获取界面属性
    SetFormProperty: function (property, value) {

        if (!this._dataInfo.hasOwnProperty(property)) {
            this.ErrLog("SetFormProperty not find:%s", property);
            return
        }
        this._dataInfo[property] = value;
    },

    //设置控件属性
    SetWndProperty: function (wndPath, property, value) {

        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("SetWndProperty(%s,%s,%s) not find wndPath", wndPath, property, value);
            return
        }

        let wndComponent = null;
        if (property == "text") {
            wndComponent = wndNode.getComponent(cc.Label);
            //可能是label
            if (wndComponent) {
            }
            //没有label可能是editbox
            else if (wndNode.getComponent(cc.RichText)) {
                wndComponent = wndNode.getComponent(cc.RichText);
            } else {
                wndComponent = wndNode.getComponent(cc.EditBox);
            }

            if (!wndComponent) {
                this.ErrLog("SetWndProperty(%s,%s,%s) wnd not find cc.Label cc.EditBox", wndPath, property, value);
                return
            }
            wndComponent.string = value + "";
        } else if (property == "position") {
            wndNode.setPosition(value)
        } else if (property == "active") {
            wndNode.active = value;
        } else if (property == "color") {
            wndNode.color = value
        } else if (property == "image") {
            this.SetWndImage(wndPath, value);
        } else if (property == "scale") {
            wndNode.scale = value
        } else if (property == "opacity") {
            wndNode.opacity = value
        } else if (property == "interactable") {
            wndComponent = wndNode.getComponent(cc.Button);
            if (!wndComponent) {
                this.ErrLog("SetWndProperty(%s,%s,%s) wnd not find cc.Button", wndPath, property, value);
                return
            }
            wndComponent.interactable = value;
        } else if (property == "progress") {
            wndComponent = wndNode.getComponent(cc.ProgressBar);
            if (!wndComponent) {
                this.ErrLog("SetWndProperty(%s,%s,%s) wnd not find cc.ProgressBar", wndPath, property, value);
                return
            }
            wndComponent.progress = value;
        } else {
            this.ErrLog("SetWndProperty(%s,%s,%s) property error", wndPath, property, value);
            return
        }
    },


    SetWndImage: function (wndPath, imageName) {

        let fileName = "";
        //如果有传图片
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("SetWndImage IntegrateImage.txt not find key(%s)", imageName);
            return
        }
        let filePath = imageInfo["FilePath"];
        let fileNameList = imageInfo["FileNameList"];

        if (fileNameList && fileNameList.length) {
            fileName = fileNameList[0];
        }
        this.SetWndImageByFilePath(wndPath, filePath, fileName);
    },
    SetNodeImageByFilePath: function (node, filePath, isHideFirst = false) {
        let nodeSprite = node.getComponent(cc.Sprite);
        if (!nodeSprite) {
            this.ErrLog('SetNodeImageByFilePath error not cc.Sprite');
            return;
        }
        let that = this;
        return app[app.subGameName + "_ControlManager"]().CreateLoadPromise(filePath, cc.SpriteFrame)
            .then(function (spriteFrame) {
                if (!spriteFrame) {
                    // that.ErrLog("SetNodeImageByFilePath load spriteFrame fail filePath : ", filePath);
                    return false
                }
                nodeSprite.spriteFrame = spriteFrame;
                if (isHideFirst)
                    node.active = true;
            });
    },
    //通过图片路径设置控件贴图
    SetWndImageByFilePath: function (wndPath, filePath, fileName = "", isHideFirst = false) {

        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("(%s) SetWndImageByFilePath(%s,%s) not find node", wndPath, filePath, fileName);
            return app.bluebird.resolve(false)
        }

        let sprite = wndNode.getComponent(cc.Sprite);
        if (!sprite) {
            this.ErrLog("SetWndImageByFilePath(%s) not find cc.Sprite", wndPath);
            return app.bluebird.resolve(false)
        }

        let that = this;

        let resType = cc.SpriteFrame;
        if (fileName) {
            resType = cc.SpriteAtlas;
        }

        //记录图片设置的贴图信息
        this._loadWndImageDict[wndPath] = {"FilePath": filePath, "FileName": fileName, "IsHideFirst": isHideFirst};

        //是否先隐藏节点,等待资源加载完成在显示节点
        if (isHideFirst) {
            //闲隐藏掉控件,加注完成在显示
            wndNode.active = 0;
        }

        return app[app.subGameName + "_ControlManager"]().CreateLoadPromise(filePath, resType)
            .then(function (spriteFrame) {

                //重新激活控件显示
                if (isHideFirst && !wndNode.active) {
                    wndNode.active = 1;
                }

                if (!spriteFrame) {
                    // that.ErrLog("SetWndImageByFilePath(%s,%s,%s) load spriteFrame fail", wndPath, filePath, fileName);
                    return false
                }

                let loadWndImageInfo = that._loadWndImageDict[wndPath];
                if (!loadWndImageInfo) {
                    that.WarnLog("_loadWndImageDict not find:%s", wndPath);
                    return false
                }

                //如果设置的贴图路径异步回调回来判断已经被更新设置贴图路径了,则跳出
                if (loadWndImageInfo["FilePath"] != filePath) {
                    that.WarnLog("wndPath:%s FilePath(%s)!=(%s)", wndPath, loadWndImageInfo["FilePath"], filePath);
                    return false
                }

                if (fileName) {
                    //如果设置的贴图路径异步回调回来判断已经被更新设置贴图路径下的贴图了,则跳出
                    if (loadWndImageInfo["FileName"] != fileName) {
                        that.WarnLog("wndPath:%s FileName(%s)!=(%s)", wndPath, loadWndImageInfo["FilePath"], filePath);
                        return false
                    }
                    sprite.spriteFrame = spriteFrame.getSpriteFrame(fileName);
                } else {
                    sprite.spriteFrame = spriteFrame;
                }
                return true
            })
            .catch(function (error) {
                // that.ErrLog("SetWndImageByFilePath(%s,%s,%s) error:%s", wndPath, filePath, fileName, error.stack);
            })

    },

    //清除控件贴图
    ClearWndImage: function (wndPath) {
        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("ClearWndImage(%s) not find node", wndPath);
            return
        }

        let sprite = wndNode.getComponent(cc.Sprite);
        if (!sprite) {
            this.ErrLog("ClearWndImage(%s) not find cc.Sprite", wndPath);
            return
        }
        sprite.spriteFrame = null;
    },

    //------------控件飞行--------------------

    //设置控件飞行
    SetWndFlyTo: function (wndPath, startPos, endPos, time, useData = 0) {

        let argDict = {
            "StartPos": startPos,
            "EndPos": endPos,
            "Time": time,
        };

        this.WndRunAction(wndPath, "FlyAction", argDict, useData);
    },

    //设置控件透明度
    SetWndOpacity: function (wndPath, endFade, time, useData = 0) {
        let argDict = {
            "EndFade": endFade,
            "Time": time,
        };

        this.WndRunAction(wndPath, "OpacityAction", argDict, useData);
    },

    SetWndDelay: function (wndPath, delayTime, useData = 0) {
        let argDict = {
            "DelayTime": delayTime,
        };

        this.WndRunAction(wndPath, "DelayAction", argDict, useData);
    },

    //停止控件飞行
    StopWndFly: function (wndPath) {
        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("StopWndFly(%s) wndPath not find", wndPath);
            return
        }
        wndNode.stopActionByTag(11111);
    },

    //停止控件渐变
    StopWndOpacity: function (wndPath) {
        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("StopWndFly(%s) wndPath not find", wndPath);
            return
        }
        wndNode.stopActionByTag(22222);
    },

    StopWndDelay: function (wndPath) {
        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("StopWndDelay(%s) wndPath not find", wndPath);
            return
        }
        wndNode.stopActionByTag(33333);
    },

    /**
     * 控件动作接口
     */
    WndRunAction: function (wndPath, actionType, argDict, useData) {

        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("WndRunAction(%s,%s) wndPath not find", wndPath, actionType);
            return
        }

        wndNode.WndFlyUseData = useData;

        //控件飞行效果
        if (actionType == "FlyAction") {
            var starPos = argDict["StartPos"];
            var endPos = argDict["EndPos"];
            var time = argDict["Time"];

            wndNode.setPosition(starPos);
            wndNode.stopActionByTag(11111);

            var action = cc.sequence(
                cc.moveTo(time, endPos),
                cc.callFunc(this.OnRunActionEnd, this, "FlyWndEnd")
            );
            action.setTag(11111);
            wndNode.runAction(action);
        }
        //控件透明度效果
        else if (actionType == "OpacityAction") {
            var endFade = argDict["EndFade"];
            var time = argDict["Time"];

            var action = cc.sequence(
                cc.fadeTo(time, endFade),
                cc.callFunc(this.OnRunActionEnd, this, "OpacityWndEnd")
            );

            action.setTag(22222);
            wndNode.runAction(action);
        }
        //停留等待
        else if (actionType == "DelayAction") {
            var delayTime = argDict["DelayTime"];
            var action = cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(this.OnRunActionEnd, this, "DelayEnd")
            );

            action.setTag(33333);
            wndNode.runAction(action);
        } else {
            this.ErrLog("WndRunAction(%s) error", actionType);
            return
        }
    },

    /**
     * runAction结束回调
     */
    OnRunActionEnd: function (sender, useData) {

        if (useData == "FlyWndEnd") {
            this.FlyWnd_FlyEnd(sender.name, sender);
        } else if (useData == "OpacityWndEnd") {
            this.OpacityWnd_End(sender.name, sender);
        } else if (useData == "DelayEnd") {
            this.FlyWnd_DelayEnd(sender.name, sender);
        } else {
            this.ErrLog("OnRunActionEnd useData:%s error", useData);
        }
    },

    //控件飞行结束回调
    FlyWnd_FlyEnd: function (wndName, wndNode) {

    },

    OpacityWnd_End: function (wndName, wndNode) {

    },

    FlyWnd_DelayEnd: function (wndName, wndNode) {

    },
    //------------特效接口-------------------

    GetWndEffectPos: function (wndObj, postType, offPosList) {

        if (!postType) {
            postType = this.ShareDefine.EffectPosType_5;
        }

        let size = wndObj.getContentSize();
        let posX = 0;
        let posY = 0;

        switch (postType) {
            // 控件特效位置1左下
            case this.ShareDefine.EffectPosType_1:
                //在控件中心添加特效
                posX = -size.width / 2;
                posY = -size.height / 2;
                break

            // 控件特效位置2下中
            case this.ShareDefine.EffectPosType_2:
                posX = 0;
                posY = -size.height / 2;
                break
            // 控件特效位置3右下
            case this.ShareDefine.EffectPosType_3:
                posX = size.width / 2;
                posY = -size.height / 2;
                break

            // 控件特效位置中左
            case this.ShareDefine.EffectPosType_4:
                posX = -size.width / 2;
                posY = 0;
                break

            // 控件特效位置中间
            case this.ShareDefine.EffectPosType_5:
                //在控件中心添加特效
                posX = 0;
                posY = 0;
                break

            // 控件特效位置中右
            case this.ShareDefine.EffectPosType_6:
                //在控件中心添加特效
                posX = size.width / 2;
                posY = 0;
                break

            // 控件特效位置上左
            case this.ShareDefine.EffectPosType_7:
                posX = -size.width / 2;
                posY = size.height / 2;
                break

            // 控件特效位置上中
            case this.ShareDefine.EffectPosType_8:
                posX = 0;
                posY = size.height / 2;
                break

            // 控件特效位置上右
            case this.ShareDefine.EffectPosType_9:
                posX = size.width / 2;
                posY = size.height / 2;
                break

            //随机位置
            case this.ShareDefine.EffectPosType_10:
                let halfWidth = size.width / 2;
                let halfHeight = size.height / 2;
                posX = this.ComTool.RandInt(-halfWidth, halfWidth);
                posY = this.ComTool.RandInt(-halfHeight, halfHeight);
                break
        }

        // if(offPosList.length == 2){
        // 	posX += offPosList[0];
        // 	posY += offPosList[1];
        // }

        return cc.v2(posX, posY);
    },

    //给控件加特效
    AddWndEffect: function (wndPath, effectName, effectRes, repeatCount = 0, userData = 0, offPosList = null, posType = null) {

        let effectTableInfo = this.Effect[effectRes];
        if (!effectTableInfo) {
            this.ErrLog("AddWndEffect Effect.txt not find:%s", effectRes);
            return
        }

        let wndNode = cc.find(wndPath, this.node);
        if (!wndNode) {
            this.ErrLog("AddWndEffect wndPath(%s) error", wndPath);
            return
        }

        //如果没有传递偏移坐标,取配置表默认偏移坐标
        if (!offPosList) {
            offPosList = effectTableInfo["OffPosList"];
        }
        if (!posType) {
            posType = effectTableInfo["PosType"];
        }
        let effectPos = this.GetWndEffectPos(wndNode, posType, offPosList);


        //初始化父类的特效字典
        let allEffectDict = this._effectDict.SetDefault(wndPath, {});

        //如果子控件已经被加上这个特效了,需要删除,因为可能特效名一样但是特效使用的资源不一样了
        if (allEffectDict.hasOwnProperty(effectName)) {

            let effectComponent = allEffectDict[effectName];

            if (effectComponent) {

                //如果特效名和特效资源名都一样,则不添加新特效
                if (effectComponent.GetModelProperty("EffectRes") == effectRes) {
                    return
                }
                //资源不一样需要删除旧的特效
                this.DeleteWndEffect(wndPath, effectName);
            } else {
                return
            }

        }
        //初始化特效对象null避免AddWndEffect重复调用时出现CreateEffectByEffectRes被多次调用
        allEffectDict[effectName] = 0;

        let that = this;

        this.EffectManager.CreateEffectByEffectRes(effectName, effectRes, userData)
            .then(function (effectComponent) {
                return that.OnCreateEffectEnd(wndPath, wndNode, effectName, effectComponent, effectPos, repeatCount);
            })
            .catch(function (error) {
                that.ErrLog("CreateFormEffect(%s,%s,%s):%s", effectName, effectRes, userData, error.stack);
            })

    },


    //创建特效成功回调
    OnCreateEffectEnd: function (wndPath, wndNode, effectName, effectComponent, effectPos, repeatCount) {
        if (!effectComponent) {
            this.ErrLog("OnCreateEffectEnd(%s) fail", effectName);
            return
        }
        let allEffectDict = this._effectDict.SetDefault(wndPath, {});

        //默认初始化为0
        if (allEffectDict[effectName]) {
            this.ErrLog("OnCreateEffectEnd allEffectDict have find:%s ", effectName);
            return
        }

        effectComponent.AddModelToParent(wndNode, this.node, effectPos);
        effectComponent.SetModelProperty("WndPath", wndPath);

        let animationState = effectComponent.ShowEffect();
        if (!animationState) {
            this.ErrLog("OnCreateEffectEnd ShowEffect fail");
            return
        }

        //如果是0代表循环播放
        if (repeatCount > 0) {
            animationState.wrapMode = cc.WrapMode.Default;
            animationState.repeatCount = repeatCount;
        }
        //如果是-1,播放结束马上倒序播放
        else if (repeatCount == -1) {
            animationState.wrapMode = cc.WrapMode.PingPong;
        }
        //0是循环播放
        else {
            //需要注意的是，修改wrapMode时，会重置time以及repeatCount
            animationState.wrapMode = cc.WrapMode.Loop;
        }

        allEffectDict[effectName] = effectComponent;

        return effectComponent
    },

    OnEffectAnimationEnd: function (event) {
        let modelComponent = event["Model"];
        //let animationName = event["AnimationName"];

        let wndPath = modelComponent.GetModelProperty("WndPath");
        let effectName = modelComponent.GetModelProperty("EffectName");

        //特效播放结束删除掉
        this.DeleteWndEffect(wndPath, effectName);
        this.OnEffectEnd(wndPath, effectName);
    },

    //删除控件特效
    DeleteWndEffect: function (wndPath, effectName) {
        let allEffectDict = this._effectDict[wndPath];
        if (!allEffectDict) {
            return
        }
        let effectComponent = allEffectDict[effectName];
        if (!effectComponent) {
            return
        }
        delete allEffectDict[effectName];

        this.EffectManager.DeleteEffect(effectComponent);
    },

    //删除控件所有的特效
    DeleteWndAllEffect: function (wndPath) {
        let allEffectDict = this._effectDict[wndPath];
        if (!allEffectDict) {
            return
        }
        this.EffectManager.DeleteEffectByDict(allEffectDict);

        delete this._effectDict[wndPath]
    },

    //删除界面所有特效
    DeleteFormAllEffect: function () {

        for (let wndPath in this._effectDict) {
            this.EffectManager.DeleteEffectByDict(this._effectDict[wndPath]);
        }
        this._effectDict = {};
    },
    //------------快捷功能函数-------------

    //注冊事件函数
    RegEvent: function (eventName, func) {
        this._eventFuncDict[eventName] = func;
    },

    //系统提示
    ShowSysMsg: function (msgID, msgArgList) {
        this.SysNotifyManager.ShowSysMsg(msgID, msgArgList);
    },

    //------------------2次确认框----------------------------

    /**
     * 等待"是""否"确认框
     */
    WaitForConfirm: function (msgID, msgArgList, backArgList, curConFirmType) {

        // 事件类型参数
        if (!backArgList) {
            backArgList = [];
        }
        // 默认确认框类型
        if (!curConFirmType) {
            curConFirmType = this.ShareDefine.Confirm;
        }

        this.ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, backArgList);

        // frmSetUpTips 界面的确认框类型
        if (this.ShareDefine.SetUpTipFormConfirmList.InArray(curConFirmType)) {
            this.ConfirmManager.ShowConfirm(curConFirmType, msgID, msgArgList);
        }
        // frmSetUpTipsUse 使用道具界面
        else if (curConFirmType == this.ShareDefine.ConfirmUse) {
            this.ConfirmManager.ShowUseMsg(msgID, msgArgList);
        }
        // frmSetUpTips01 购买道具界面
        else if (curConFirmType == this.ShareDefine.ConfirmBuy) {
            this.ConfirmManager.ShowBuyMsg(msgID, backArgList);
        } else {
            this.ErrLog("WaitForConfirm((%s, %s), (%s), %s) error", msgID, msgArgList, backArgList, curConFirmType);
            return;
        }
    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function (clickType, msgID, backArgList) {
        // 如果子类没有继承接口报错提示
        this.ErrLog("Not have func OnConFirm(%s,%s,%s)", clickType, msgID, backArgList);
    },


    //-------------点击函数-------------

    //模拟点击控件
    SimulateOnClick: function (wndPath) {

        let btnNode = cc.find(wndPath, this.node);
        if (!btnNode) {
            this.ErrLog("SimulateOnClick not find (%s)", wndPath);
            return
        }
        let buttonComponent = btnNode.getComponent(cc.Button);
        if (!buttonComponent) {
            this.ErrLog("SimulateOnClick(%s) not find cc.Button", wndPath);
            return
        }
        let btnName = btnNode.name;
        this.OnClick(btnName, btnNode);
    },

    //关闭界面
    OnClick_Close: function () {
        try {
            this.CloseForm();
        } catch (error) {
            this.ErrLog("OnClick_Close:%s", error.stack);
        }

    },

    //控件点击回调
    OnClick_BtnWnd: function (eventTouch, eventData) {
        try {
            this.SoundManager.PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            this.ErrLog("OnClick_BtnWnd:%s", error.stack);
        }
    },

    OnClick_Toggle: function (toggle) {

        try {
            this.SoundManager.PlaySound("BtnClick");
            let btnNode = toggle.node;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        } catch (error) {
            this.ErrLog("OnClick_Toggle:%s", error.stack);
        }
    },

    OnClick_Form: function (eventTouch, eventData) {
        try {
            this.OnClickForm(eventTouch);
        } catch (error) {
            this.ErrLog("OnClick_Form:%s", error.stack);
        }

    },

    //--------------子类重载接口---------------
    //创建界面被调用一次
    OnCreateInit: function () {
    },

    //每次显示界面被调用
    OnShow: function (/*..*/) {
    },

    //每次关闭界面被调用
    OnClose: function () {
    },

    //销毁界面被调用
    OnDestroy: function () {

    },
    //定时回掉
    OnUpdate: function (passSecond) {

    },

    //切换账号
    OnReload: function () {

    },

    //控件被点击
    OnClick: function (btnName, eventData) {

    },

    //界面被点击
    OnClickForm: function () {

    },

    //特效播放结束
    OnEffectEnd: function (wndPath, effectName) {

    },
    //网页版微信分享处理
    InitWeiXinShare: function () {
        console.log("XiaoFu InitWeiXinShare");
        if (!cc.sys.isNative) {
            //更新微信分享信息
            console.log("XiaoFu InitWeiXinShare OnWeChatReady");
            app[app.subGameName + "_WeChatManager"]().OnWeChatReady();
        }
    },
    IsIphoneX: function () {
        let FrameSize = cc.view.getFrameSize();
        if (FrameSize.width == 2436 && FrameSize.height == 1125) {
            return true;
        }
        //{ name: 'IPhone X', width: 375, height: 812, ratio: 3 },
        if (!cc.sys.isNative) {
            if (FrameSize.width == 812 && FrameSize.height == 375) {
                return true;
            }
        }
        return false;
    },

    //滑动结束
    OnScrollEnded: function () {

    },
    //获取用户推广Url
    GetTuiGuangUrl: function () {
        console.log("GetTuiGuangUrl begin");
        this.TuiGuangUrl = this.LocalDataManager.GetConfigProperty("SysSetting", "TuiGuangUrl");
        console.log("GetTuiGuangUrl this.TuiGuangUrl:", this.TuiGuangUrl);
        if (this.TuiGuangUrl == '') {
            console.log("GetTuiGuangUrl 1");
            let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
            console.log("GetTuiGuangUrl 2");
            let ShortHeroID = this.ComTool.GetPid(heroID);
            console.log("GetTuiGuangUrl 3");
            let long_url = "http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=https://www.qp355.com/" + ShortHeroID + '/';
            //let long_url="http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=http://m.zle.com/xiaofu.php";
            console.log("GetTuiGuangUrl 4");
            app[app.subGameName + "_NetManager"]().SendPack("game.CShortenGenerate", {"url": long_url}, this.GetShorTuiGuangUrl.bind(this), this.FailTuiGuangUrl.bind(this));
            console.log("GetTuiGuangUrl 5");
        } else {
            console.log("GetTuiGuangUrl 6");
            this.InitWeiXinShare();
        }
        console.log("GetTuiGuangUrl end");
    },
    getRandom: function (min, max) {
        var r = Math.random() * (max - min);
        var re = Math.round(r + min);
        re = Math.max(Math.min(re, max), min)
        return re;
    },
    GetRandBaseUrl: function () {
        let urls = app[app.subGameName + "Client"].GetClientConfigProperty("UrlLists");
        if (urls == 0) {
            return 0;
        }
        let urlList = urls.split(',');
        let count = urlList.length;
        let rand = this.getRandom(0, count - 1);
        return urlList[rand] + ":89";  //走89端口
    },
    FailTuiGuangUrl: function (serverPack) {
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        let ShortHeroID = this.ComTool.GetPid(heroID);
        let randUrl = this.GetRandBaseUrl();
        this.TuiGuangUrl = 'http://' + randUrl + "/" + ShortHeroID + "/";
        this.LocalDataManager.SetConfigProperty("SysSetting", "TuiGuangUrl", this.TuiGuangUrl);
        this.InitWeiXinShare();
    },
    //获取微信短域名并且设置到字典
    GetShorTuiGuangUrl: function (serverPack) {
        if (typeof (serverPack.requestUrl) == "undefined") {
            return;
        }
        let jsonStr = serverPack.requestUrl;
        jsonStr = jsonStr.replace('[', '');
        jsonStr = jsonStr.replace(']', '');
        let ShareUrl = eval('(' + jsonStr + ')');
        this.TuiGuangUrl = ShareUrl.url_short;
        this.LocalDataManager.SetConfigProperty("SysSetting", "TuiGuangUrl", this.TuiGuangUrl);
        this.InitWeiXinShare();

    },
    //微信分享获取短域名并且启动分享
    SuccessTcnUrl: function (serverPack) {
        let shareUrl = "https://www.qp355.com/" + app[app.subGameName + "_ComTool"]().GetPid(app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid")) + "/";
        if (this.TuiGuangUrl) {
            text = this.ShareText + "\n" + "下载地址:" + shareUrl;
        } else {
            if (url_short) {
                text = this.ShareText;
            } else {
                text = this.ShareText;
            }
        }
        console.log("SuccessTcnUrl text:", text);
        this.SDKManager.ShareText(text, "0");
    },
    //微信分享获取短域名失败分享
    FailTcnUrl: function (event) {
        let shareUrl = "https://www.qp355.com/" + app[app.subGameName + "_ComTool"]().GetPid(app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid")) + "/";
        let text = this.ShareText + "\n" + "下载地址:" + shareUrl;
        this.SDKManager.ShareText(text, "0");
    },

    //启动微信房间分享
    BeginShare: function (roomKey, text) {
        this.ShareText = text;
        this.roomKey = roomKey;
        //校服
        let long_url = "http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=https://www.qp355.com/room" + roomKey;
        app[app.subGameName + "_NetManager"]().SendPack("game.CShortenGenerate", {"url": long_url}, this.SuccessTcnUrl.bind(this), this.FailTcnUrl.bind(this));
    },
    GetAppName:function(){
        let appName=cc.sys.localStorage.getItem('appName');
        if (appName=="baodao") {
            return "baodao";
        }
        if (appName=="sansan") {
            return "sansan";
        }
        return "xinhua";
    },
    Click_btn_weixin: function () {
        let room = app[app.subGameName.toUpperCase() + "Room"]();
        var WeChatShare = app[app.subGameName + "_WeChatManager"]().WeChatShare(app.subGameName);
        let title = null;
        if (WeChatShare['special']) {
            title = WeChatShare['special'];
        } else {
            title = WeChatShare['title'];
        }
        let weChatAppShareUrl = WeChatShare['url'];
        let setCount = room.GetRoomConfigByProperty("setCount");  //多少局
        let roomKey = room.GetRoomProperty("key");  //房间号

        let allPlayerInfo = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
        let joinPlayerCount = room.GetRoomPosMgr().GetRoomPlayerCount();  //几人场
        let nowJoin = 0;

        for (let i = 0; i < joinPlayerCount; i++) {
            if (allPlayerInfo[i].pid > 0)
                nowJoin++;
        }
        title = title.replace('{房间号}', roomKey);
        let gamedesc = "";
        gamedesc = joinPlayerCount + "人场";
        gamedesc = gamedesc + "," + setCount + "局";
        let autoCardIdx = room.GetRoomConfigByProperty("paymentRoomCardType");
        if (0 == autoCardIdx)
            gamedesc = gamedesc + ",房主出卡";
        else if (1 == autoCardIdx)
            gamedesc = gamedesc + ",平分房卡";
        else
            gamedesc = gamedesc + ",大赢家出卡";
        let que = joinPlayerCount - nowJoin;
        gamedesc += "," + nowJoin + "缺" + que;
        let teshuwanfan = this.WanFa();
        //let CheckShareContent();
        if (teshuwanfan) {
            gamedesc += "," + teshuwanfan;
        }
        //this.BeginShare(room.GetRoomProperty("key"),text);
        console.log("Click_btn_weixin:", title);
        console.log("Click_btn_weixin:", gamedesc);
        console.log("Click_btn_weixin:", weChatAppShareUrl);
        //this.SDKManager.Share(title, gamedesc, weChatAppShareUrl, "0");
        let appName=this.GetAppName();
        if(appName == "baodao"){
            this.SDKManager.ShareLineLink(title, gamedesc, weChatAppShareUrl);
        }else{
             this.FormManager.ShowForm(app.subGameName + '_UIRoomCopy', roomKey, title, gamedesc, weChatAppShareUrl);
        }
    },

    Click_btn_fzkl: function (str) {
        if (cc.sys.isNative) {
            let argList = [{"Name": "msg", "Value": str.toString()}];
            app[app.subGameName + "_NativeManager"]().CallToNative("copyText", argList);
        } else {
            console.log("真机复制分享cc.sys.isNative", str);
        }
    },

    /** @function 出牌包校验 只判断是否存在重复牌值 如有其他校验子类可重写
     * @param {Object} sendPack 包体
     * @repeatCardMaxCount {Number} 最大重牌的数量
     * @return {Boolean} 合法返回true 否则返回false
     */
    outCardPackageVerification(sendPack, repeatCardMaxCount = 1) {
        const {cardList} = sendPack;
        if (cardList == null) {
            console.error('not find cardList', sendPack);
            throw 'sendPack不存在 cardList 如字段名不同请从子类重写此方法';
        }
        let valueMap = {};
        for (let card of cardList) {
            if (valueMap[card]) {
                valueMap[card]++;
            } else {
                valueMap[card] = 1;
            }
            //
            if (valueMap[card] > repeatCardMaxCount) {
                console.warn('找到存在相同的牌', card, cardList);
                return false;
            }
        }
        return true;
    },

    WanFa: function (cfg = null, showFlag = 0) {
        this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
        let playGame = app.subGameName;
        if (playGame == '') {
            return false;
        }
        let room = app[app.subGameName.toUpperCase() + "Room"]();
        let gameType = playGame;
        console.log("XiaoFu this.gameCreateConfig:", this.gameCreateConfig);

        let wanfa = '';
        let zhadansuanfaCount = -1;
        let isWuZha = false;
        let two = 0;
        for (let key in this.gameCreateConfig) {
            let gameName = this.gameCreateConfig[key].GameName;
            let isWanFa = this.gameCreateConfig[key].isWanFa;
            if (gameType == gameName && isWanFa == 1) {
                let dataKey = this.gameCreateConfig[key].Key;
                let value = 0;
                if (cfg != null) {
                    value = cfg[dataKey];
                } else {
                    value = room.GetRoomConfigByProperty(dataKey);
                }
                if (value < 0) {
                    continue;
                }
                if(dataKey == "kexuanwanfa"){
                    if(value.indexOf(29) > -1){
                        isWuZha = true;
                    }
                }
                if(dataKey == "zhadansuanfa"){
                    if(isWuZha){
                        continue;
                    }
                    zhadansuanfaCount = value;
                }
                if(dataKey == "zhadanfenshu" && zhadansuanfaCount == 2 && isWuZha){
                    continue;
                }
                let ToggleType = this.gameCreateConfig[key].ToggleType;
                let ToggleDesc = this.gameCreateConfig[key].ToggleDesc.split(',');
                if (ToggleType == 0) {
                    //单选
                    let str = '';
                    str = ToggleDesc[value];
                    if ('zjh' == gameType && ('dingzhu' == dataKey || 'dizhu' == dataKey)) {
                        let baseDiZhus = [1, 2, 5, 10];
                        let dizhuIdx = room.GetRoomConfigByProperty('dizhu');
                        let dizhu = baseDiZhus[dizhuIdx];
                        let dingzhu = 0;
                        if (0 == value)
                            dingzhu = dizhu * 5;
                        else
                            dingzhu = dizhu * 10;
                        dizhu = dizhu * room.GetRoomConfigByProperty('baseMark');
                        dingzhu = dingzhu * room.GetRoomConfigByProperty('baseMark');

                        if ('dingzhu' == dataKey)
                            str = dingzhu.toString() + '分';
                        else
                            str = dizhu.toString() + '分';
                    }
                    if (typeof (str) == "undefined") {
                        continue;
                    }
                    if (wanfa == '') {
                        wanfa = str;
                        if (showFlag == 1) {
                            wanfa = ' ·' + wanfa;
                        }
                        two++;
                    } else {
                        if (showFlag == 1) {
                            wanfa += ' ·' + str;
                            if (two++ % 2 == 1) {
                                wanfa += '\n';
                            } else {
                                wanfa += ' ';
                            }
                        } else {
                            wanfa = wanfa + "，" + str;
                        }
                    }
                } else if (ToggleType == 1) {
                    //多选
                    for (let j = 0; j < value.length; j++) {
                        if (gameType == 'pdk') {
                            if (value[j] == 14 || value[j] == 15 || value[j] == 18) {
                                continue;
                            }
                        }
                        let str = '';
                        if (gameType == 'pdk') {
                            if (value[j] == 11) {
                                str = ToggleDesc[3];
                            } else if (value[j] == 22) {
                                str = ToggleDesc[4];
                            } else if (value[j] == 23) {
                                str = ToggleDesc[5];
                            } else if (value[j] == 24) {
                                str = ToggleDesc[6];
                            } else if (value[j] == 25) {
                                str = ToggleDesc[7];
                            } else if (value[j] == 26) {
                                str = ToggleDesc[8];
                            }else if (value[j] == 27) {
                                str = ToggleDesc[9];
                            } else if (value[j] == 28) {
                                str = ToggleDesc[10];
                            } else if (value[j] == 29) {
                                str = ToggleDesc[11];
                            }else if (value[j] == 4) {
                                str = ToggleDesc[12];
                            } else if (value[j] == 30) {
                                str = ToggleDesc[13];
                            } else if (value[j] == 31) {
                                str = ToggleDesc[14];
                            } else if (value[j] == 32) {
                                str = ToggleDesc[15];
                            } else if (value[j] == 33) {
                                str = ToggleDesc[16];
                            }else {
                                str = ToggleDesc[value[j]];
                            }
                        } else {
                            str = ToggleDesc[value[j]];
                        }
                        if (typeof (str) == "undefined") {
                            continue;
                        }
                        if (wanfa == '') {
                            wanfa = str;
                            if (showFlag == 1) {
                                wanfa = ' ·' + wanfa;
                            }
                            two++;
                        } else {
                            if (showFlag == 1) {
                                wanfa += ' ·' + str;
                                if (two++ % 2 == 1) {
                                    wanfa += '\n';
                                } else {
                                    wanfa += ' ';
                                }
                            } else {
                                wanfa = wanfa + "，" + str;
                            }
                        }
                    }
                }
            }
        }
        let sportsDouble = room.GetRoomConfigByProperty("sportsDouble");
        if (cfg != null) {
            sportsDouble = cfg["sportsDouble"];
        }
        if (typeof(sportsDouble) != "undefined") {
            wanfa += "，比赛分倍数："+sportsDouble;
        }

        return wanfa;
    },
    GameTyepStringUp: function () {
        return app.subGameName.toUpperCase();
    },
    CheckUpdateNotice:function(){
        let gameTypeId=this.ShareDefine.GametTypeNameDict[this.GameTyepStringUp()];
        app[app.subGameName + "_NetManager"]().SendPack("game.CMaintainGameNotice", {"gameTypeId":gameTypeId},function(event){
            if(typeof(event.status)=="undefined"){
                return;
            }
            app[app.subGameName + "_NetManager"]().SendPack("game.CMaintainGameIsGetNotice", {"gameTypeId":gameTypeId});
            if(typeof(event.content)!="undefined"){
                if(event.content!="" && event.content!=null){
                    app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg(event.content); //弹窗提示用户
                }
            }
            
        });
    },
});

module.exports = pdk_BaseForm;



