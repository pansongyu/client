"use strict";
cc._RF.push(module, 'b7c25VcYsBBcayXo6JheK0Z', 'UISetting01');
// script/ui/UISetting01.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sd_yinyue: cc.Node,
        sd_yinxiao: cc.Node,
        btn_qiehuan: cc.Node,
        sp_selecmusic: cc.Node,
        lb_name: cc.Label,
        node_head: cc.Node,
        img_toggle1: cc.Node,
        img_toggle2: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.LocalDataManager = app.LocalDataManager();
        this.node.on("SliderParagraph", this.OnEven_SliderParagraph, this);
        // this.sd_yinyue.Node.on("SliderParagraph", this.OnEventBackVolumeSlider, this);
        // this.sd_yinxiao.Node.on("SliderParagraph", this.OnEventSPVolumeMusicSlider, this);
        var MaxCount = 20;
        this.dataList = [];
        for (var index = 0; index < MaxCount; index++) {
            this.dataList.push(index);
        }
    },

    // OnEventBackVolumeSlider: function (event) {
    //     let volume = event["Progress"];
    //     this.LocalDataManager.SetConfigProperty("SysSetting", "BackVolume", volume);

    //     if (0 == volume) {
    //         this.img_toggle1.active = false;
    //     }
    //     let SceneManager = app.SceneManager();
    //     SceneManager.UpdateSceneMusic();
    // },

    // OnEventSPMusicSlider: function (event) {
    //     let volume = event["Progress"];
    //     this.LocalDataManager.SetConfigProperty("SysSetting", "SpVolume", volume);

    //     if (0 == volume) {
    //         this.img_toggle2.active = false;
    //     }
    //     let SceneManager = app.SceneManager();
    //     SceneManager.UpdateSceneMusic();
    // },

    OnEven_SliderParagraph: function OnEven_SliderParagraph(event) {
        var thisParentName = event.Node.parent.name;
        if (thisParentName == "sp_yinyue") {
            this.LocalDataManager.SetConfigProperty("SysSetting", "BackVolume", event["Progress"]);
            var SceneManager = app.SceneManager();
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
        this.sd_yinyue.getComponent("SliderProgressBarParagraph").InitData(this.dataList, [], false);
        this.sd_yinyue.getComponent(cc.Slider).progress = this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume");

        this.sd_yinxiao.getComponent("SliderProgressBarParagraph").InitData(this.dataList, [], false);
        this.sd_yinxiao.getComponent(cc.Slider).progress = this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume");

        this.InitMusic(this.Check("BackVolume"), "sp_setting/sp_yinyue/btn_toggle1/toggle_02");

        this.InitMusic(this.Check("SpVolume"), "sp_setting/sp_yinxiao/btn_toggle2/toggle_02");

        this.InitMusicVolume(this.Check("SpVolume"), "sp_setting/sp_yinxiao/sd_yinyue", "/pb_yinyue");

        this.InitMusicVolume(this.Check("BackVolume"), "sp_setting/sp_yinyue/sd_yinyue", "/pb_yinyue");

        var AccountType = app.Client.GetClientConfigProperty("AccountType");
        if (AccountType == this.ShareDefine.SDKType_WeChat) {
            this.btn_qiehuan.active = 0;
        }
        this.ShowHero_NameOrID();
        // let BackVolume=this.LocalDataManager.GetConfigProperty("SysSetting","BackVolume");
        // if(BackVolume){
        //如果背景音量大于0.读取缓存背景音乐
        var MainBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "MainBackMusic");
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
        this.setMusicState();
    },

    ShowHero_NameOrID: function ShowHero_NameOrID() {
        var heroName = app.HeroManager().GetHeroProperty("name");
        this.lb_name.string = heroName;
        if (this.lb_name.node.width > 210 && heroName.length > 7) this.lb_name.string = this.lb_name.string.substring(0, 7) + '...';
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var WeChatHeadImage1 = this.node_head.getComponent("WeChatHeadImage");
        WeChatHeadImage1.ShowHeroHead(heroID);
    },

    Check: function Check(option) {
        var value = this.LocalDataManager.GetConfigProperty("SysSetting", option);
        if (!value) value = 0;
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
            this.GetWndComponent([path1, path2].join(""), cc.ProgressBar).progress = optionValue;
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
        } else if (btnName == "Toggle21") {
            this.setMusicState();
            this.LocalDataManager.SetConfigProperty("SysSetting", "MainBackMusic", "MainScene");
            this.Click_Change_Back_Music("MainScene");
        } else if (btnName == "Toggle22") {
            this.setMusicState();
            this.LocalDataManager.SetConfigProperty("SysSetting", "MainBackMusic", "RoomStart");
            this.Click_Change_Back_Music("RoomStart");
        } else if (btnName == "Toggle23") {
            this.setMusicState();
            this.LocalDataManager.SetConfigProperty("SysSetting", "MainBackMusic", "RoomWaitStart");
            this.Click_Change_Back_Music("RoomWaitStart");
        } else if (btnName == "btn_tuichu") {
            this.Click_Btn_TuiChu();
        } else if (btnName == "btn_gps") {
            if (cc.sys.isNative) {
                app.NativeManager().CallToNative("gpsSetting", []);
            }
        } else if (btnName == "btn_fuwu") {
            this.Click_Btn_FuWu();
        } else if (btnName == "btn_yinsi") {
            this.Click_Btn_YinSi();
        } else if (btnName == "btn_qiehuan") {
            this.Click_Btn_QieHuan();
        } else {
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },

    setMusicState: function setMusicState() {
        // SceneManager.UpdateSceneMusic();
        // if(!this.img_toggle1.active){
        //     if(this.LocalDataManager.GetConfigProperty("SysSetting","BackVolume")==0){
        //         this.LocalDataManager.SetConfigProperty("SysSetting", "BackVolume", 0.1);
        //     }
        //     let SceneManager = app.SceneManager();
        //     SceneManager.UpdateSceneMusic();
        // }

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
        var value = this.LocalDataManager.GetConfigProperty("SysSetting", valuetype);
        var SceneManager = app.SceneManager();
        var MainBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "MainBackMusic");
        if (value) {
            this.LocalDataManager.SetConfigProperty("SysSetting", valuetype, 0);

            //如果背景音乐关闭
            if (option == "BackMusic") {
                this.sd_yinyue.getComponent(cc.Slider).progress = 0;
                this.GetWndComponent("sp_setting/sp_yinyue/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0;
                this.img_toggle1.active = false;
                SceneManager.UpdateSceneMusic();
            } else {
                this.sd_yinxiao.getComponent(cc.Slider).progress = 0;
                this.GetWndComponent("sp_setting/sp_yinxiao/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0;
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
            } else {
                this.sd_yinxiao.getComponent(cc.Slider).progress = 0.5;
                this.GetWndComponent("sp_setting/sp_yinxiao/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0.5;
                this.img_toggle2.active = true;
            }
        }
        this.Click_Change_Back_Music(MainBackMusic);
    },
    Click_Change_Back_Music: function Click_Change_Back_Music(backGroundSound) {
        var SceneManager = app.SceneManager();
        SceneManager.PlayMusic(backGroundSound);
    },

    Click_Btn_QieHuan: function Click_Btn_QieHuan() {
        this.WaitForConfirm("UIMoreQieHuanZhangHao", [], [], this.ShareDefine.Confirm);
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {

        if (clickType != "Sure") {
            return;
        }
        if (msgID == "UIMoreQieHuanZhangHao") {
            this.LocalDataManager.SetConfigProperty("Account", "AccessTokenInfo", {});
            this.LocalDataManager.SetConfigProperty("Account", "AccountMobile", {});
            console.log("切换账号");
            // app.Client.ClearClientData();
            // app.SceneManager().LoadScene("loginScene");
            app.Client.LogOutGame(1);
        } else if ("MSG_EXIT_GAME") {
            cc.game.end();
        }
    },

    Click_Btn_YinSi: function Click_Btn_YinSi() {
        this.FormManager.ShowForm("UIYinSiZhenCe");
    },

    Click_Btn_FuWu: function Click_Btn_FuWu() {
        this.FormManager.ShowForm("UIFuWuTiaoKuan");
    },

    Click_Btn_TuiChu: function Click_Btn_TuiChu() {
        var msgID = "MSG_EXIT_GAME";
        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, msgID, []);
    }
});

cc._RF.pop();