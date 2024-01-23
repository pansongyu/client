var app = require("fjssz_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		xuanze: cc.SpriteFrame,
		xuanze1: cc.SpriteFrame,
	},

	OnCreateInit: function () {
		this.ZorderLv = 8;
		this.sd_yinyue = this.GetWndNode("sp_setting/sp_yinyue/sd_yinyue");
		this.sd_yinxiao = this.GetWndNode("sp_setting/sp_yinxiao/sd_yinxiao");
		this.sp_selecmusic = this.GetWndNode("sp_setting/sp_selecmusic");
		this.img_toggle1 = this.GetWndNode("sp_setting/sp_yinyue/btn_toggle1");
		this.img_toggle2 = this.GetWndNode("sp_setting/sp_yinxiao/btn_toggle2");
		this.toggle4 = this.GetWndNode("sp_setting/sp_yuyin/Toggle4");
		this.fangYanXuanZe = this.GetWndNode("sp_setting/sp_language/btn_fangyan/xuanze").getComponent(cc.Sprite);
		this.puTongXuanZe = this.GetWndNode("sp_setting/sp_language/btn_putong/xuanze").getComponent(cc.Sprite);

		this.LocalDataManager = app.LocalDataManager();
		this.node.on("SliderParagraph", this.OnEven_SliderParagraph, this);
		let MaxCount = 20;
		this.dataList = [];
		for (let index = 0; index < MaxCount; index++) {
			this.dataList.push(index);
		}
	},

	OnEven_SliderParagraph: function (event) {
		let thisParentName = event.Node.parent.name;
		console.log("OnEven_SliderParagraph thisParentName：", thisParentName);
		if (thisParentName == "sp_yinyue") {
			this.LocalDataManager.SetConfigProperty("SysSetting", "BackVolume", event["Progress"]);
			let SceneManager = app[app.subGameName + "_SceneManager"]();
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
		}
		else if (thisParentName == "sp_yinxiao") {
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

	OnShow: function () {
		let playerName = app[app.subGameName + "_HeroManager"]().GetHeroProperty("name");
		let language = this.LocalDataManager.GetConfigProperty("SysSetting", "Language");

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
		//     console.error("UISetting02 language Error:%s" ,language);
		// }
		this.sd_yinyue.getComponent(app.subGameName + "_SliderProgressBarParagraph").InitData(this.dataList, [], false);
		this.sd_yinyue.getComponent(cc.Slider).progress = this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume");

		this.sd_yinxiao.getComponent(app.subGameName + "_SliderProgressBarParagraph").InitData(this.dataList, [], false);
		this.sd_yinxiao.getComponent(cc.Slider).progress = this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume");


		let IsAudio = this.LocalDataManager.GetConfigProperty("SysSetting", "IsAudio");
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
		let MainBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "GameBackMusic");
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
		this.ScaleIn(this.node.getChildByName("sp_setting"))
	},
	InitChangeScene: function () {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if (is3DShow == 1) {
			this.SetWndProperty("sp_setting/sp_scene/btn_ls/img_dz", "active", true);
			this.SetWndProperty("sp_setting/sp_scene/btn_fjssz/img_dz", "active", false);
		} else {
			this.SetWndProperty("sp_setting/sp_scene/btn_ls/img_dz", "active", false);
			this.SetWndProperty("sp_setting/sp_scene/btn_fjssz/img_dz", "active", true);
		}
	},
	SetChangeScene: function (NewIs3DShow) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if (is3DShow == NewIs3DShow) {
			return false;
		}
		this.LocalDataManager.SetConfigProperty("SysSetting", app.subGameName + "_is3DShow", NewIs3DShow);
		this.LocalDataManager.SetConfigProperty("SysSetting", "lockShow", 1);
		//lockShow
		this.InitChangeScene();

		if (app.playuissz) {
			app.playuissz.ChangeBg()
		}
		return true;
	},
	Check: function (option) {
		let value = this.LocalDataManager.GetConfigProperty("SysSetting", option);
		if (!value) {
			value = 0;
		}
		return value;
	},
	InitMusicVolume: function (optionValue, path1, path2) {
		if (!path1) {
			console.error("InitMusicVolume(%s) not find", path);
			return;
		}
		if (!path2) {
			console.error("InitMusicVolume(%s) not find", path);
			return;
		}
		if (optionValue >= 0 && optionValue <= 1) {
			this.GetWndComponent(path1, cc.Slider).progress = optionValue;
			this.GetWndComponent(path1 + path2, cc.ProgressBar).progress = optionValue;
		}
	},
	InitMusic: function (optionValue, path) {
		if (!path) {
			console.error("InitMusic(%s) not find", path);
			return;
		}
		if (optionValue) {
			this.GetWndComponent(path, cc.Sprite).node.active = true;
		}
		else {
			this.GetWndComponent(path, cc.Sprite).node.active = false;
		}
	},
	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_toggle1") {
			this.Click_Toggle("BackMusic", "BackVolume");
		}
		else if (btnName == "btn_toggle2") {
			this.Click_Toggle("SpSound", "SpVolume");
		}
		else if (btnName == "Toggle4") {
			this.Click_Toggle("IsAudio");
		}
		else if (btnName == "Toggle21") {
			this.setMusicState();
			app[app.subGameName + "_SceneManager"]().PlayMusic("gameBackGround");
			this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "gameBackGround");
		}
		else if (btnName == "Toggle22") {
			this.setMusicState();
			app[app.subGameName + "_SceneManager"]().PlayMusic("RoomStart");
			this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "RoomStart");
		}
		else if (btnName == "Toggle23") {
			this.setMusicState();
			app[app.subGameName + "_SceneManager"]().PlayMusic("RoomWaitStart");
			this.LocalDataManager.SetConfigProperty("SysSetting", "GameBackMusic", "RoomWaitStart");
		}


		else if (btnName == "btn_fangyan" || btnName == "btn_putong") {
			this.Click_Fangyan_PuTong(btnName);
		}
		else if (btnName == "btn_tuichu") {
			this.Click_Btn_QieHuan();
		}else if (btnName == "btn_fjssz") {
			this.SetChangeScene(0);
		} else if (btnName == "btn_ls") {
			this.SetChangeScene(1);
		}
		else {
			console.error("OnClick(%s) not find", btnName)
		}
	},

	setMusicState: function () {
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

	Click_Toggle: function (option, valuetype) {
		if (valuetype) {
			let value = this.LocalDataManager.GetConfigProperty("SysSetting", valuetype);
			let SceneManager = app[app.subGameName + "_SceneManager"]();
			if (value) {
				this.LocalDataManager.SetConfigProperty("SysSetting", valuetype, 0);

				//如果背景音乐关闭
				if (option == "BackMusic") {
					this.sd_yinyue.getComponent(cc.Slider).progress = 0;
					this.GetWndComponent("sp_setting/sp_yinyue/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0;
					this.img_toggle1.active = false;
					SceneManager.UpdateSceneMusic();
					// SceneManager.PauseSceneMusic();
				}
				else {
					this.sd_yinxiao.getComponent(cc.Slider).progress = 0;
					this.GetWndComponent("sp_setting/sp_yinxiao/sd_yinxiao/pb_yinxiao", cc.ProgressBar).progress = 0;
					this.img_toggle2.active = false;
				}
			}
			else {
				this.LocalDataManager.SetConfigProperty("SysSetting", valuetype, 0.5);

				//背景音乐开
				if (option == "BackMusic") {
					this.sd_yinyue.getComponent(cc.Slider).progress = 0.5;
					this.GetWndComponent("sp_setting/sp_yinyue/sd_yinyue/pb_yinyue", cc.ProgressBar).progress = 0.5;
					this.img_toggle1.active = true;
					SceneManager.UpdateSceneMusic();
					// SceneManager.RecoverySceneMusic();
				}
				else {
					this.sd_yinxiao.getComponent(cc.Slider).progress = 0.5;
					this.GetWndComponent("sp_setting/sp_yinxiao/sd_yinxiao/pb_yinxiao", cc.ProgressBar).progress = 0.5;
					this.img_toggle2.active = true;
				}
			}
		} else {
			let IsAudio = this.LocalDataManager.GetConfigProperty("SysSetting", option);
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

	Click_Fangyan_PuTong: function (btnName1) {
		let btnName1XuanZePath = ["sp_setting/sp_language", btnName1, "xuanze"].join("/");
		let nodeSpriteFrame = this.GetWndComponent(btnName1XuanZePath, cc.Sprite).spriteFrame;
		let btnName2 = "";
		if (btnName1 == "btn_fangyan") {
			btnName2 = "btn_putong";
			this.LocalDataManager.SetConfigProperty("SysSetting", "Language", this.ShareDefine.Dialect);
		}
		else if (btnName1 == "btn_putong") {
			btnName2 = "btn_fangyan";
			this.LocalDataManager.SetConfigProperty("SysSetting", "Language", this.ShareDefine.Mandarin);
		} else {
			console.error("Check_Fangyan_PuTong(%s) not find", btnName1);
		}
		if (nodeSpriteFrame.name == "btn_select") {
			return;
		}
		let btnName2XuanZePath = ["sp_setting/sp_language", btnName2, "xuanze"].join("/");
		if (nodeSpriteFrame.name == "icon_selectBg") {
			this.GetWndComponent(btnName1XuanZePath, cc.Sprite).spriteFrame = this.xuanze1;
			this.GetWndComponent(btnName2XuanZePath, cc.Sprite).spriteFrame = this.xuanze;
		} else {
			this.GetWndComponent(btnName1XuanZePath, cc.Sprite).spriteFrame = this.xuanze;
			this.GetWndComponent(btnName2XuanZePath, cc.Sprite).spriteFrame = this.xuanze1;
		}
	},
	Click_Btn_TuiChu: function () {
		let msgID = "MSG_EXIT_GAME";
		let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
		ConfirmManager.ShowConfirm(this.ShareDefine.Confirm, msgID, [])
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
	}
});