var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseForm"),

	properties: {
		winlost_childwb: cc.Prefab,
		sp_tittle: [cc.SpriteFrame],
		huLbIcon: [cc.SpriteFrame],
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸
		*/

	},

	OnCreateInit: function () {
		this.roomID = this.GetWndNode("room_info/roomID");
		this.jushu = this.GetWndNode("room_info/jushu");
		this.endTime = this.GetWndNode("room_info/endTime");
		this.btn_goon = this.GetWndNode("btn_list/btn_goon");
		this.btn_jixu = this.GetWndNode("btn_list/btn_jixu");
		this.btn_exit = this.GetWndNode("btn_list/btn_exit");
		this.btn_xipai = this.GetWndNode("btn_list/btn_xipai");
		this.btn_sharemore = this.GetWndNode("btn_list/btn_sharemore");
		this.lb_huifang = this.GetWndComponent("lb_huifang", cc.Label);
		this.huTittle = this.GetWndComponent("bg/bg_title/title_result", cc.Sprite);
		this.Players = this.node.getChildByName("Players");
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.RegEvent("RoomEnd", this.Event_RoomEnd);
		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.SDKManager = app[app.subGameName + "_SDKManager"]();
		this.lastChildName = null;
		this.RegEvent("Event_XiPai", this.Event_XiPai);
	},
	Event_XiPai: function (event) {
		this.btn_xipai.active = false;
	},
	InitNode: function () {
		let Player1Node = null;
		Player1Node = cc.instantiate(this.winlost_childwb);
		this.nowChildName = app.subGameName + "_winlost_childwb";

		if (this.lastChildName != null && this.lastChildName == this.nowChildName) {
			//子节点跟之前一样，无需重新创建，直接return
			return;
		}
		//清空之前的节点,生成新的节点
		this.lastChildName = this.nowChildName;
		this.Players.removeAllChildren();
		Player1Node.name = 'player1';
		this.Players.addChild(Player1Node);


		//添加手牌
		let ShowCardNode = this.GetWndNode('Players/player1/showcard');
		ShowCardNode.getChildByName('img_mjdi').spriteFrame = "";
		let sp_in = ShowCardNode.getChildByName('img_mjdi').getChildByName('sp_in');
		for (let i = 1; i <= this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"]; i++) {
			let cardNode = cc.instantiate(sp_in);
			cardNode.name = this.ComTool.StringAddNumSuffix("card", Math.abs(i - (this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] + 1)), 2);
			ShowCardNode.addChild(cardNode);
		}
		//添加吃牌
		let DownCardNode = this.GetWndNode('Players/player1/downcard');
		let downNode01 = DownCardNode.getChildByName('down01');
		for (let i = 2; i <= 5; i++) {
			let downNode = cc.instantiate(downNode01);
			downNode.name = this.ComTool.StringAddNumSuffix("down", i, 2);
			DownCardNode.addChild(downNode);
		}
		//16添加花牌
		if (this.nowChildName == app.subGameName + "_winlost_childwb") {
			let HuaCardNode = this.GetWndNode('Players/player1/huacardscrollView/view/huacard');
			let hua01 = HuaCardNode.getChildByName('card01');
			for (let i = 2; i <= 8; i++) {
				let huaNode = cc.instantiate(hua01);
				huaNode.name = this.ComTool.StringAddNumSuffix("card", i, 2);
				HuaCardNode.addChild(huaNode);
			}
		}
		this.InitPlayers();
	},
	InitPlayers: function () {
		let AddNode = this.GetWndNode('Players/player1');
		for (let i = 2; i <= 4; i++) {
			let PlayerSon = cc.instantiate(AddNode);
			PlayerSon.name = 'player' + i;
			this.Players.addChild(PlayerSon);
		}
	},
	//-----------回调函数------------------
	Event_RoomEnd: function () {
		this.ShowBtnGoonExit();
	},


	OnShow: function (setEnd = false) {
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.huTittle.spriteFrame = "";
		//动态生成节点
		this.InitNode();
		this.player1 = this.GetWndNode('Players/player1');
		this.player2 = this.GetWndNode('Players/player2');
		this.player3 = this.GetWndNode('Players/player3');
		this.player4 = this.GetWndNode('Players/player4');
		this.WeChatHeadImage1 = false;
		this.WeChatHeadImage2 = false;
		this.WeChatHeadImage3 = false;
		this.WeChatHeadImage4 = false;
		//动态生成节点
		this.WeChatHeadImage1 = this.player1.getChildByName('user_info').getChildByName('head_img').getComponent(app.subGameName + "_WeChatHeadImage");
		this.WeChatHeadImage2 = this.player2.getChildByName('user_info').getChildByName('head_img').getComponent(app.subGameName + "_WeChatHeadImage");
		this.WeChatHeadImage3 = this.player3.getChildByName('user_info').getChildByName('head_img').getComponent(app.subGameName + "_WeChatHeadImage");
		this.WeChatHeadImage4 = this.player4.getChildByName('user_info').getChildByName('head_img').getComponent(app.subGameName + "_WeChatHeadImage");

		this.player1.active = false;
		this.player2.active = false;
		this.player3.active = false;
		this.player4.active = false;
		this.ShowBtnGoonExit();
		/*if(setEnd==false){
			let goActive=this.btn_goon.active;
			if(goActive){
				this.Click_btn_goon();
				return;
			}
		}*/
		this.InitShowPlayerInfo(setEnd);
		if (this.ShareDefine.isCoinRoom) {
			this.SetWndProperty('btn_list/btn_exit/icon', 'text', '退出房间');
			this.btn_jixu.active = true;
			this.btn_xipai.active = false;
		} else {
			this.SetWndProperty('btn_list/btn_exit/icon', 'text', '总成绩');
			this.btn_jixu.active = false;
		}
		this.isXiPai = 0;
		//初始化分享
		if (app['CheckReward']) {
			app[app.subGameName + "_FormManager"]().ShowForm('UIHongBao', app['CheckReward']);
			app['CheckReward'] = null;
		}
	},
	ShowRoomInfo: function (setEnd) {
		let room = this.RoomMgr.GetEnterRoom();
		let current = room.GetRoomConfigByProperty("setCount");
		let setID = room.GetRoomProperty("setID");
		let roomID = room.GetRoomProperty("key");
		this.lb_huifang.string = setEnd.playBackCode;
		let time = setEnd.endTime;
		this.roomID.getComponent(cc.Label).string = "房间号:" + roomID;
		if (current == 311) {
			this.jushu.getComponent(cc.Label).string = "1课:100分";
		} else {
			this.jushu.getComponent(cc.Label).string = app.i18n.t("UIWanFa_setCount", {"setCount": setID});
		}

		this.endTime.getComponent(cc.Label).string = this.ComTool.GetDateYearMonthDayHourMinuteString(time);
		let wanFaStr = this.WanFa();
		this.SetWndProperty("room_info/wanfa", "text", wanFaStr);
	},
	ShowPlayerResult: function () {

	},
	ShowBtnGoonExit: function () {
		let state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_End) {
			this.btn_goon.active = 0;
			this.btn_exit.active = 1;
			this.btn_xipai.active = 0;
		} else {
			this.btn_goon.active = 1;
			this.btn_exit.active = 0;
			//this.btn_xipai.active=1;
			this.btn_xipai.active = 0;
		}
	},
	InitShowPlayerInfo: function (setEnd) {
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		let clientDownPos = RoomPosMgr.GetClientDownPos();
		let clientFacePos = RoomPosMgr.GetClientFacePos();
		let clientUpPos = RoomPosMgr.GetClientUpPos();
		let roomSet = this.RoomMgr.GetEnterRoom().GetRoomSet();
		let dPos = roomSet.GetRoomSetProperty("dPos");
		if (setEnd == false) {
			setEnd = roomSet.GetRoomSetProperty("setEnd");
		}
		this.ShowRoomInfo(setEnd);
		let posResultList = setEnd["posResultList"];
		let jin1 = setEnd["jin"];
		let jin2 = setEnd["jin2"];
		let playerAll = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let joinPlayerCount = playerAllList.length;
		for (let index = 0; index < joinPlayerCount; index++) {
			let PlayerInfo = this.RoomMgr.GetEnterRoom().GetRoomPosMgr().GetPlayerInfoByPos(index);
			this.SetWndProperty('Players/player' + (index + 1), 'active', true);
			let PlayerNode = this.GetWndNode('Players/player' + (index + 1));
			PlayerNode.getComponent(this.nowChildName).ShowPlayerData(PlayerNode, posResultList[index], PlayerInfo, jin1, jin2);
			let hhh = this.ShowPlayerHuName(posResultList[index]['huType'])
			if (posResultList[index]['endPoint'] && posResultList[index]['endPoint']["huTypeMap"]) {
				let sarr = ["DanYou","ShuangYou","SanYou"]
				let sarr2 = ["单游","双游","三游"]
				sarr.reverse()
				sarr2.reverse()
				let keys = Object.keys(posResultList[index]['endPoint']["huTypeMap"])
				for (let index = 0; index < sarr.length; index++) {
					const element = sarr[index];
					if (keys.indexOf(element) >= 0) {
						hhh = sarr2[index]
						break
					}
				}
			}
			if (posResultList[index]['huType'] > 0) {
				this.SetWndProperty('Players/player' + (index + 1) + '/jiesuan/hutype', 'text', hhh);
			} else {
				this.SetWndProperty('Players/player' + (index + 1) + '/jiesuan/hutype', 'text', '');
			}
			if (clientPos == index) {
				let huType = posResultList[index]["huType"];
				let point = posResultList[index]["point"];
				if (huType > 0) {
					if (huType == 1) {
						this.huTittle.spriteFrame = this.sp_tittle[1];
					} else if (huType == 4) {
						this.huTittle.spriteFrame = this.sp_tittle[4];
					} else if (huType == 15) {
						this.huTittle.spriteFrame = this.sp_tittle[2];
					} else {
						this.huTittle.spriteFrame = this.sp_tittle[3];
					}
					if (point <= 0) {
						this.huTittle.spriteFrame = this.sp_tittle[0];
					}
					console.log("显示需要的huType", posResultList);
				} else {
					this.huTittle.spriteFrame = this.sp_tittle[0];
				}
			}
			// let huNodeSprite = this.node.getChildByName('Players').getChildByName('player' + (index + 1)).getChildByName('jiesuan').getChildByName('hutype').getComponent(cc.Sprite);
			// this.ShowPlayerHuImg(huNodeSprite, posResultList[index]['huType']);
			if (dPos === index) {
				this.SetWndProperty('Players/player' + (index + 1) + '/user_info/zhuangjia', 'active', true);
			} else {
				this.SetWndProperty('Players/player' + (index + 1) + '/user_info/zhuangjia', 'active', false);
			}
			//显示头像，如果头像UI
			if (index == 0 && this.WeChatHeadImage1 != false) {
				this.WeChatHeadImage1.ShowHeroHead(PlayerInfo["pid"]);
			} else if (index == 1 && this.WeChatHeadImage2 != false) {
				this.WeChatHeadImage2.ShowHeroHead(PlayerInfo["pid"]);
			} else if (index == 2 && this.WeChatHeadImage3 != false) {
				this.WeChatHeadImage3.ShowHeroHead(PlayerInfo["pid"]);
			} else if (index == 3 && this.WeChatHeadImage4 != false) {
				this.WeChatHeadImage4.ShowHeroHead(PlayerInfo["pid"]);
			}
		}
		//检测是否要弹出奖励分享
		for (let i = 0; i < posResultList.length; i++) {
			/*if(i==0){
				this.FormManager.ShowForm('game/base/ui/majiang/UIMJSharePaiXingMini',posResultList[i],jin1,jin2);
				break;
			}*/
			if (posResultList[i].pos == clientPos && posResultList[i].isReward == true) {
				//弹出分享
				this.FormManager.ShowForm('game/base/ui/majiang/UIMJSharePaiXingMini', posResultList[i], jin1, jin2);
				break;
			}
		}
	},
	ShowPlayerHuImg: function (huNodeSprite, huType) {
		/*huLbIcon
		*  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
		*  13：双游，14：天胡，15：五金，16：自摸 17:接炮
		*/
		if (typeof(huType) == "undefined") {
			huNodeSprite.spriteFrame = '';
		} else if (huType == this.ShareDefine.HuType_ZiMo) {
			huNodeSprite.spriteFrame = this.huLbIcon[16];
		} else if (huType == this.ShareDefine.HuType_PingHu) {
			huNodeSprite.spriteFrame = this.huLbIcon[5];
		} else if (huType == this.ShareDefine.HuType_QGH) {
			huNodeSprite.spriteFrame = this.huLbIcon[6];
		} else if (huType == this.ShareDefine.HuType_SanJinDao) {
			huNodeSprite.spriteFrame = this.huLbIcon[10];
		} else if (huType == this.ShareDefine.HuType_DanYou) {
			huNodeSprite.spriteFrame = this.huLbIcon[2];
		} else if (huType == this.ShareDefine.HuType_ShuangYou) {
			huNodeSprite.spriteFrame = this.huLbIcon[13];
		} else if (huType == this.ShareDefine.HuType_SanYou) {
			huNodeSprite.spriteFrame = this.huLbIcon[8];
		} else if (huType == this.ShareDefine.HuType_QiangJin) {
			huNodeSprite.spriteFrame = this.huLbIcon[7];
		} else if (huType == this.ShareDefine.HuType_TianHu) {
			huNodeSprite.spriteFrame = this.huLbIcon[14];
		} else if (huType == this.ShareDefine.HuType_SiJinDao) {
			huNodeSprite.spriteFrame = this.huLbIcon[9];
		} else if (huType == this.ShareDefine.HuType_WuJinDao) {
			huNodeSprite.spriteFrame = this.huLbIcon[15];
		} else if (huType == this.ShareDefine.HuType_LiuJinDao) {
			huNodeSprite.spriteFrame = this.huLbIcon[4];
		} else if (huType == this.ShareDefine.HuType_ShiSanYao) {
			huNodeSprite.spriteFrame = this.huLbIcon[12];
		} else if (huType == this.ShareDefine.HuType_SanJinYou) {
			huNodeSprite.spriteFrame = this.huLbIcon[11];
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			huNodeSprite.spriteFrame = this.huLbIcon[1];
		} else if (huType == this.ShareDefine.HuType_DanDiao) {
			huNodeSprite.spriteFrame = this.huLbIcon[0];
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			huNodeSprite.spriteFrame = this.huLbIcon[17];
		} else if (huType == this.ShareDefine.HuType_FHZ) {
			huNodeSprite.spriteFrame = this.huLbIcon[18];
		} else {
			huNodeSprite.spriteFrame = ''
		}
	},
	ShowPlayerHuName: function (huType) {
		console.log("ShowPlayerHuName", huType);
		if (huType == this.ShareDefine.HuType_ZiMo) {
			return "自摸";
		} else if (huType == this.ShareDefine.HuType_PingHu) {
			return "平胡";
		} else if (huType == this.ShareDefine.HuType_QGH) {
			return "抢杠胡";
		} else if (huType == this.ShareDefine.HuType_FHZ) {
			return "四红中";
		} else if (huType == this.ShareDefine.HuType_SanJinDao) {
			return "三金倒";
		} else if (huType == this.ShareDefine.HuType_DanYou) {
			return "单游";
		} else if (huType == this.ShareDefine.HuType_ShuangYou) {
			return "双游";
		} else if (huType == this.ShareDefine.HuType_SanYou) {
			return "三游";
		} else if (huType == this.ShareDefine.HuType_QiangJin) {
			return "抢金";
		} else if (huType == this.ShareDefine.HuType_TianHu) {
			return "天胡";
		} else if (huType == this.ShareDefine.HuType_SiJinDao) {
			return "四金倒";
		} else if (huType == this.ShareDefine.HuType_WuJinDao) {
			return "五金倒";
		} else if (huType == this.ShareDefine.HuType_LiuJinDao) {
			return "六金倒";
		} else if (huType == this.ShareDefine.HuType_ShiSanYao) {
			return "十三幺";
		} else if (huType == this.ShareDefine.HuType_JinQue) {
			return "金雀";
		} else if (huType == this.ShareDefine.HuType_JinLong) {
			return "金龙";
		} else if (huType == this.ShareDefine.HuType_YiZhangHua) {
			return "一张花";
		} else if (huType == this.ShareDefine.HuType_WHuaWGang) {
			return "无花无杠";
		} else if (huType == this.ShareDefine.HuType_HunYiSe) {
			return "混一色";
		} else if (huType == this.ShareDefine.HuType_QingYiSe) {
			return "清一色";
		} else if (huType == this.ShareDefine.HuType_DiHu) {
			return "地胡";
		} else if (huType == this.ShareDefine.HuType_XiaoZhaDan) {
			return "小炸弹";
		} else if (huType == this.ShareDefine.HuType_DaZhaDan) {
			return "大炸弹";
		} else if (huType == this.ShareDefine.HuType_ChaoJiZhaDan) {
			return "超级炸弹";
		} else if (huType == this.ShareDefine.HuType_SanJinYou) {
			return "三金游";
		} else if (huType == this.ShareDefine.HuType_DaSanYuan) {
			return "大三元";
		} else if (huType == this.ShareDefine.HuType_DaDuiPeng) {
			return "大对碰";
		} else if (huType == this.ShareDefine.HuType_DDHu) {
			return "对对胡";
		} else if (huType == this.ShareDefine.HuType_DianPao) {
			return "点泡";
		} else if (huType == this.ShareDefine.HuType_DanDiao) {
			return "单吊";
		} else if (huType == this.ShareDefine.HuType_PiHu) {
			return "屁胡";
		} else if (huType == this.ShareDefine.HuType_MenZi) {
			return "门子";
		} else if (huType == this.ShareDefine.HuType_JieDao) {
			return "接刀";
		} else if (huType == this.ShareDefine.HuType_HaiDiLao) {
			return "海底捞月";
		} else if (huType == this.ShareDefine.HuType_QuanFeng) {
			return "全风";
		} else if (huType == this.ShareDefine.HuType_BaHua) {
			return "八花";
		} else if (huType == this.ShareDefine.HuType_MenQing) {
			return "门清";
		} else if (huType == this.ShareDefine.HuType_JiePao) {
			return "接炮";
		} else if (huType == this.ShareDefine.HuType_FHZ) {
			return "四红中";
		}
		else {
			return "";
		}
	},
	//---------设置接口---------------

	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_goon") {
			this.Click_btn_goon();
			//this.CloseForm();
		}
		else if (btnName == "btn_exit") {
			if (this.ShareDefine.isCoinRoom) {
				app[app.subGameName + "Client"].ExitGame();
			} else {
				this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBResultDetail", false, false, true);
				this.CloseForm();
			}
		} else if (btnName == "btn_jixu") {
			if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
				app[app.subGameName + "_NetManager"]().SendPack('game.CGoldRoom', {practiceId: app[app.subGameName + "_ShareDefine"]().practiceId}, this.OnSuccess.bind(this), this.OnEnterRoomFailed.bind(this));
			} else {

			}
		} else if (btnName == "btn_xipai") {
			this.SetWaitForConfirm('MSG_XiPai', this.ShareDefine.Confirm, [], []);

		}
		else if (btnName == "btn_share") {
			this.Click_btn_Share();
		} else if (btnName == "btn_ddshare") {
			this.Click_btn_DDShare();
		} else if (btnName == "btn_cnshare") {
			this.Click_btn_CNShare();
		} else if (btnName == "btn_mwshare") {
			this.Click_btn_MWShare();
		} else if (btnName == "btn_sharemore") {
			this.FormManager.ShowForm(app.subGameName + "_UIShare");
		}
		else {
			this.ErrLog("OnClick not find btnName", btnName);
		}
	},
	OnSuccess: function (serverPack) {
		let roomID = serverPack.roomID;
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + '.C' + app.subGameName.toUpperCase() + 'GetRoomInfo', {"roomID": roomID});
	},
	OnEnterRoomFailed: function (serverPack) {
		app[app.subGameName + "Client"].ExitGame();
	},

	Click_btn_goon: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Click_btn_ready not enter room");
			return
		}
		let roomID = room.GetRoomProperty("roomID");
		app[app.subGameName + "_GameManager"]().SendContinueGame(roomID);
	},
	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	SetWaitForConfirm: function (msgID, type, msgArg = [], cbArg = []) {
		let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
		ConfirmManager.ShowConfirm(type, msgID, msgArg);
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}
		if ('MSG_XiPai' == msgID) {
			if (this.isXiPai == 1) {
				return;
			}
			let room = this.RoomMgr.GetEnterRoom();
			if (!room) {
				return;
			}
			let roomID = room.GetRoomProperty("roomID");
			let self = this;
			this.isXiPai = 1;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "RoomXiPai", {"roomID": roomID});
		}
	},

});
