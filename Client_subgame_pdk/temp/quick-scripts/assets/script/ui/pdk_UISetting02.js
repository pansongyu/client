(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/pdk_UISetting02.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk6eb-cbb3-43dc-87f8-1c2f1ecbba30', 'pdk_UISetting02', __filename);
// script/ui/pdk_UISetting02.js

"use strict";

var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        xuanze: cc.SpriteFrame,
        xuanze1: cc.SpriteFrame,
        sd_yinyue: cc.Node,
        sd_yinxiao: cc.Node,
        sp_selecmusic: cc.Node,
        img_toggle1: cc.Node,
        img_toggle2: cc.Node,
        toggle4: cc.Toggle,

        sceneChangeNode: cc.Node,

        fangYanXuanZe: cc.Sprite,
        puTongXuanZe: cc.Sprite
    },

    OnCreateInit: function OnCreateInit() {

        this.LocalDataManager = app.LocalDataManager();

        this.node.on("SliderParagraph", this.OnEven_SliderParagraph, this);

        var MaxCount = 20;
        this.dataList = [];
        for (var index = 0; index < MaxCount; index++) {
            this.dataList.push(index);
        }
    },

    OnEven_SliderParagraph: function OnEven_SliderParagraph(event) {
        var thisParentName = event.Node.parent.name;
        console.log("OnEven_SliderParagraph thisParentName：", thisParentName);
        if (thisParentName == "sp_yinyue") {
            this.LocalDataManager.SetConfigProperty("SysSetting", "BackVolume", event["Progress"]);
            var SceneManager = app[app.subGameName + "_SceneManager"]();
            SceneManager.UpdateSceneMusic();
            if (this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume") != 0) {
                if (!this.img_toggle1.active) {
                    this.img_toggle1.active = true;
                }
            } else {
                if (this.img_toggle1.active) {
                    this.img_toggle1.active = false;
                }
            }
        } else if (thisParentName == "sp_yinxiao") {
            this.LocalDataManager.SetConfigProperty("SysSetting", "SpVolume", event["Progress"]);
            if (this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume") != 0) {
                if (!this.img_toggle2.active) {
                    this.img_toggle2.active = true;
                }
            } else {
                if (this.img_toggle2.active) {
                    this.img_toggle2.active = false;
                }
            }
        }
    },

    OnShow: function OnShow() {
        var playerName = app[app.subGameName + "_HeroManager"]().GetHeroProperty("name");
        var language = this.LocalDataManager.GetConfigProperty("SysSetting", "Language");

        this.playgame = app.subGameName;

        this.puTongXuanZe.spriteFrame = this.xuanze1;
        this.fangYanXuanZe.spriteFrame = this.xuanze;

        // if(language == this.ShareDefine.Mandarin){
        //     this.puTongXuanZe.spriteFrame = this.xuanze1;
        //     this.fangYanXuanZe.spriteFrame = this.xuanze;
        // }
        // else if(language == this.ShareDefine.Dialect){
        //     this.puTongXuanZe.spriteFrame = this.xuanze;
        //     this.fangYanXuanZe.spriteFrame = this.xuanze1;
        // }
        // else{
        //     this.ErrLog("UISetting02 language Error:%s" ,language);
        // }
        this.sd_yinyue.getComponent(app.subGameName + "_SliderProgressBarParagraph").InitData(this.dataList, [], false);
        this.sd_yinyue.getComponent(cc.Slider).progress = this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume");

        this.sd_yinxiao.getComponent(app.subGameName + "_SliderProgressBarParagraph").InitData(this.dataList, [], false);
        this.sd_yinxiao.getComponent(cc.Slider).progress = this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume");

        var IsAudio = this.LocalDataManager.GetConfigProperty("SysSetting", "IsAudio");
        console.log("Setting OnShow IsAudio:", IsAudio);
        if (IsAudio > 0) {
            this.toggle4.isChecked = true;
        } else {
            this.toggle4.isChecked = false;
        }

        this.InitMusic(this.Check("BackVolume"), "sp_setting/sp_yinyue/btn_toggle1/img_dxk02");

        this.InitMusic(this.Check("SpVolume"), "sp_setting/sp_yinxiao/btn_toggle2/img_dxk02");

        this.InitMusicVolume(this.Check("SpVolume"), "sp_setting/sp_yinxiao/sd_yinxiao", "/pb_yinxiao");

        this.InitMusicVolume(this.Check("BackVolume"), "sp_setting/sp_yinyue/sd_yinyue", "/pb_yinyue");
        this.InitChangeScene();

        // let BackMusic=this.LocalDataManager.GetConfigProperty("SysSetting","BackMusic");
        // if(BackMusic){
        //如果背景音量大于0.读取缓存背景音乐
        var MainBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "GameBackMusic");
        if (MainBackMusic == 'MainScene') {
            this.sp_selecmusic.getChildByName('Toggle21').getComponent(cc.Toggle).isChecked = true;
            this.sp_selecmusic.getChildByName('Toggle22').getComponent(cc.Toggle).isChecked = false;
            this.sp_selecmusic.getChildByName('Toggle23').getComponent(cc.Toggle).isChecked = false;
        } else if (MainBackMusic == 'RoomStart') {
            this.sp_selecmusic.getChildByName('Toggle21').getComponent(cc.Toggle).isChecked = false;
            this.sp_selecmusic.getChildByName('Toggle22').getComponent(cc.Toggle).isChecked = true;
            this.sp_selecmusic.getChildByName('Toggle23').getComponent(cc.Toggle).isChecked = false;
        } else if (MainBackMusic == 'RoomWaitStart') {
            this.sp_selecmusic.getChildByName('Toggle21').getComponent(cc.Toggle).isChecked = false;
            this.sp_selecmusic.getChildByName('Toggle22').getComponent(cc.Toggle).isChecked = false;
            this.sp_selecmusic.getChildByName('Toggle23').getComponent(cc.Toggle).isChecked = true;
        }
        // this.Click_Change_Back_Music(MainBackMusic);
        // }

    },
    InitChangeScene: function InitChangeScene() {
        var GameBg = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_GameBg");
        if (GameBg == 1) {
            this.sceneChangeNode.getChildByName('btn_bg1').getChildByName('check').active = true;
            this.sceneChangeNode.getChildByName('btn_bg2').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg3').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg4').getChildByName('check').active = false;
        } else if (GameBg == 2) {
            this.sceneChangeNode.getChildByName('btn_bg1').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg2').getChildByName('check').active = true;
            this.sceneChangeNode.getChildByName('btn_bg3').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg4').getChildByName('check').active = false;
        } else if (GameBg == 3) {
            this.sceneChangeNode.getChildByName('btn_bg1').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg2').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg3').getChildByName('check').active = true;
            this.sceneChangeNode.getChildByName('btn_bg4').getChildByName('check').active = false;
        } else if (GameBg == 4) {
            this.sceneChangeNode.getChildByName('btn_bg1').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg2').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg3').getChildByName('check').active = false;
            this.sceneChangeNode.getChildByName('btn_bg4').getChildByName('check').active = true;
        }
    },
    SetChangeScene: function SetChangeScene(is3DShow) {
        this.LocalDataManager.SetConfigProperty("SysSetting", "is3DShow", is3DShow);
        this.InitChangeScene();
    },
    SetChangeBG: function SetChangeBG(NewGameBg) {
        var GameBg = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_GameBg");
        if (GameBg == NewGameBg) {
            return false;
        }
        this.LocalDataManager.SetConfigProperty("SysSetting", app.subGameName + "_GameBg", NewGameBg);
        this.InitChangeScene();
        return true;
    },
    Check: function Check(option) {
        var value = this.LocalDataManager.GetConfigProperty("SysSetting", option);
        if (!value) {
            value = 0;
        }
        return value;
    },
    InitMusicVolume: function InitMusicVolume(optionValue, path1, path2) {
        if (!path1) {
            this.ErrLog("InitMusicVolume(%s) not find", path);
            return;
        }
        if (!path2) {
            this.ErrLog("InitMusicVolume(%s) not find", path);
            return;
        }
        if (optionValue >= 0 && optionValue <= 1) {
            this.GetWndComponent(path1, cc.Slider).progress = optionValue;
            this.GetWndComponent(path1 + path2, cc.ProgressBar).progress = optionValue;
        }
    },
    InitMusic: function InitMusic(optionValue, path) {
        if (!path) {
            this.ErrLog("InitMusic(%s) not find", path);
            return;
        }
        if (optionValue) {
            this.GetWndComponent(path, cc.Sprite).node.active = true;
        } else {
            this.GetWndComponent(path, cc.Sprite).node.active = false;
        }
    },
    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_toggle1") {
            this.Click_Toggle("BackMusic", "BackVolume");
        } else if (btnName == "btn_toggle2") {
            this.Click_Toggle("SpSound", "SpVolume");
        } else if (btnName == "Toggle4") {
            this.Click_Toggle("IsAudio");
        } else if (btnName == "Toggle21") {
            this.setMusicState();
            app[app.subGameName + "_SceneManager"]().PlayMusic("gameBackGround");
            this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "gameBackGround");
        } else if (btnName == "Toggle22") {
            this.setMusicState();
            app[app.subGameName + "_SceneManager"]().PlayMusic("RoomStart");
            this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "RoomStart");
        } else if (btnName == "Toggle23") {
            this.setMusicState();
            app[app.subGameName + "_SceneManager"]().PlayMusic("RoomWaitStart");
            this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "RoomWaitStart");
        }
        //手牌大小
        else if (btnName == "Toggle31") {
                app[app.subGameName + "_FormManager"]().GetFormComponentByFormName("game/PDK/UIPDK_Play").SetHandCardScale(1.2);
                this.CloseForm();
            } else if (btnName == "Toggle32") {
                app[app.subGameName + "_FormManager"]().GetFormComponentByFormName("game/PDK/UIPDK_Play").SetHandCardScale(1.3);
                this.CloseForm();
            } else if (btnName == "Toggle33") {
                app[app.subGameName + "_FormManager"]().GetFormComponentByFormName("game/PDK/UIPDK_Play").SetHandCardScale(1.4);
                this.CloseForm();
            } else if (btnName == "Toggle34") {
                app[app.subGameName + "_FormManager"]().GetFormComponentByFormName("game/PDK/UIPDK_Play").SetHandCardScale(1.5);
                this.CloseForm();
            } else if (btnName == "btn_fangyan" || btnName == "btn_putong") {
                this.Click_Fangyan_PuTong(btnName);
            } else if (btnName == "btn_tuichu") {
                this.Click_Btn_QieHuan();
            } else if (btnName.startsWith("btn_bg")) {
                var gameBgID = btnName.replace('btn_bg', '');
                if (this.SetChangeBG(gameBgID)) {
                    var curForm = this.FormManager.GetFormComponentByFormName("game/PDK/UIPDK_Play");
                    if (gameBgID == 1) {
                        curForm = this.FormManager.GetFormComponentByFormName("game/PDK/UIPDK_Play");
                        this.FormManager.ShowForm('game/PDK/UIPDK_Play');
                        this.FormManager.CloseForm('game/PDK/UIPDK_LPPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_SYPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_XiuXPlay');
                    } else if (gameBgID == 2) {
                        curForm = this.FormManager.GetFormComponentByFormName("game/PDK/UIPDK_LPPlay");
                        this.FormManager.ShowForm('game/PDK/UIPDK_LPPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_Play');
                        this.FormManager.CloseForm('game/PDK/UIPDK_SYPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_XiuXPlay');
                    } else if (gameBgID == 3) {
                        curForm = this.FormManager.GetFormComponentByFormName("game/PDK/UIPDK_SYPlay");
                        this.FormManager.ShowForm('game/PDK/UIPDK_SYPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_LPPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_Play');
                        this.FormManager.CloseForm('game/PDK/UIPDK_XiuXPlay');
                    } else if (gameBgID == 4) {
                        curForm = this.FormManager.GetFormComponentByFormName("game/PDK/UIPDK_XiuXPlay");
                        this.FormManager.ShowForm('game/PDK/UIPDK_XiuXPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_SYPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_LPPlay');
                        this.FormManager.CloseForm('game/PDK/UIPDK_Play');
                    }
                    this.ReInRoom();
                    // if (curForm) {
                    //     curForm.ReInRoom();
                    // }
                    this.CloseForm();
                }
            } else {
                this.ErrLog("OnClick(%s) not find", btnName);
            }
    },

    ReInRoom: function ReInRoom(room) {
        var roomID = app[app.subGameName.toUpperCase() + "RoomMgr"]().GetEnterRoomID();
        app[app.subGameName.toUpperCase() + "RoomMgr"]().SendGetRoomInfo(roomID);
    },

    setMusicState: function setMusicState() {
        if (this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume") != 0) {
            this.img_toggle1.active = true;
        } else {
            this.img_toggle1.active = false;
        }
        if (this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume") != 0) {
            this.img_toggle2.active = true;
        } else {
            this.img_toggle2.active = false;
        }
    },

    Click_Toggle: function Click_Toggle(option, valuetype) {
        if (valuetype) {
            var value = this.LocalDataManager.GetConfigProperty("SysSetting", valuetype);
            var SceneManager = app[app.subGameName + "_SceneManager"]();
            if (value) {
                this.LocalDataManager.SetConfigProperty("SysSetting", valuetype, 0);

                //如果背景音乐关闭
                if (option == "BackMusic") {
                    this.sd_yinyue.getComponent(cc.Slider).progress = 0;
                    this.GetWndComponent("sp_setting/sp_yinyue/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0;
                    this.img_toggle1.active = false;
                    SceneManager.UpdateSceneMusic();
                    // SceneManager.PauseSceneMusic();
                } else {
                    this.sd_yinxiao.getComponent(cc.Slider).progress = 0;
                    this.GetWndComponent("sp_setting/sp_yinxiao/sd_yinxiao/pb_yinxiao", cc.ProgressBar).progress = 0;
                    this.img_toggle2.active = false;
                }
            } else {
                this.LocalDataManager.SetConfigProperty("SysSetting", valuetype, 0.5);

                //背景音乐开
                if (option == "BackMusic") {
                    this.sd_yinyue.getComponent(cc.Slider).progress = 0.5;
                    this.GetWndComponent("sp_setting/sp_yinyue/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0.5;
                    this.img_toggle1.active = true;
                    SceneManager.UpdateSceneMusic();
                    // SceneManager.RecoverySceneMusic();
                } else {
                    this.sd_yinxiao.getComponent(cc.Slider).progress = 0.5;
                    this.GetWndComponent("sp_setting/sp_yinxiao/sd_yinxiao/pb_yinxiao", cc.ProgressBar).progress = 0.5;
                    this.img_toggle2.active = true;
                }
            }
        } else {
            var IsAudio = this.LocalDataManager.GetConfigProperty("SysSetting", option);
            if (IsAudio) {
                this.toggle4.isChecked = false;
                this.LocalDataManager.SetConfigProperty("SysSetting", option, 0);
            } else {
                this.toggle4.isChecked = true;
                this.LocalDataManager.SetConfigProperty("SysSetting", option, 1);
            }
            var aaa = this.LocalDataManager.GetConfigProperty("SysSetting", option);
        }
    },

    Click_Fangyan_PuTong: function Click_Fangyan_PuTong(btnName1) {
        var btnName1XuanZePath = ["sp_setting/sp_language", btnName1, "xuanze"].join("/");
        var nodeSpriteFrame = this.GetWndComponent(btnName1XuanZePath, cc.Sprite).spriteFrame;
        var btnName2 = "";
        if (btnName1 == "btn_fangyan") {
            btnName2 = "btn_putong";
            this.LocalDataManager.SetConfigProperty("SysSetting", "Language", this.ShareDefine.Dialect);
        } else if (btnName1 == "btn_putong") {
            btnName2 = "btn_fangyan";
            this.LocalDataManager.SetConfigProperty("SysSetting", "Language", this.ShareDefine.Mandarin);
        } else {
            this.Error("Check_Fangyan_PuTong(%s) not find", btnName1);
        }
        if (nodeSpriteFrame.name == "btn_select") {
            return;
        }
        var btnName2XuanZePath = ["sp_setting/sp_language", btnName2, "xuanze"].join("/");
        if (nodeSpriteFrame.name == "icon_selectBg") {
            this.GetWndComponent(btnName1XuanZePath, cc.Sprite).spriteFrame = this.xuanze1;
            this.GetWndComponent(btnName2XuanZePath, cc.Sprite).spriteFrame = this.xuanze;
        } else {
            this.GetWndComponent(btnName1XuanZePath, cc.Sprite).spriteFrame = this.xuanze;
            this.GetWndComponent(btnName2XuanZePath, cc.Sprite).spriteFrame = this.xuanze1;
        }
    },
    Click_Btn_TuiChu: function Click_Btn_TuiChu() {
        var msgID = "MSG_EXIT_GAME";
        var ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, msgID, []);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
    }
});

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
        //# sourceMappingURL=pdk_UISetting02.js.map
        