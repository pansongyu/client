/*
    UICard01
*/
var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName + "_BaseMaJiangCard01Form"),

	properties: {
		btn_in: cc.Node,
		card: cc.Node,
		downcard: cc.Node,
		sp_tishi: cc.Node,
	},

	Init: function () {
		this.InitBaseData();
		//碰牌增加Y坐标
		this.PenCardAddOffY = 20;
		//选中卡牌增加Y坐标
		this.ChooseCardAddOffY = 35;
		//卡牌位置初始化Y坐标
		this.InitBtnCardPosY = 0;
		//滑动到顶端坐标
		this.TopCardY = 90;
		this.canTouch = true;

		//出牌动作提示控件
		this.AllHelpWndNameList = [
			"btn_cancel",
			"btn_next",
			"btn_pen",
			"btn_chi",
			"btn_gang",
			"btn_hu",
			"btn_danyou",
			"btn_shuangyou",
			"btn_sanyou",
			"btn_sanjin",
			"btn_sijin",
			"btn_qiangjin",
			"btn_zimo",
			//"btn_ting",
		];
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.RoomSet = app[app.subGameName.toUpperCase() + "RoomSet"]();
		this.OnReload();
		this.InitCardNode();
		this.HideAllChild();
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnShow not enter room");
			return
		}
		let state = room.GetRoomProperty("state");
		//如果是初始化
		if (state == this.ShareDefine.RoomState_Init) {
			this.OnRoomInit(room);
		}
		else if (state == this.ShareDefine.RoomState_Playing) {
			this.OnRoomPlaying(room);
		}
		else if (state == this.ShareDefine.RoomState_End) {
			this.OnRoomEnd(room);
		}
		else {
			this.ErrLog("OnShow:%s error", state);
		}
		this.OnReload();
	},
	ShowTingPai: function (cardMap) {
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai");
		let room = this.RoomMgr.GetEnterRoom();
		let roomPosMgr = room.GetRoomPosMgr();
		let clientPos = roomPosMgr.GetClientPos();
		let huCardTypeInfo = room.GetRoomSet().GetLeftCardTypeInfo(clientPos);
		if (cardMap.length > 0) {
			this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai", cardMap, huCardTypeInfo);
		}
	},
	//显示本家出牌动作,提示
	OnShowPosActionHelp: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("ShowPosActionHelp not enter room");
			return [];
		}
		//判断是否可以听牌了
		let setPos = room.GetClientPlayerSetPos();
		let huCard = setPos.GetSetPosProperty("huCard");
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let haveCount = shouCard.length;
		let handCard = setPos.GetSetPosProperty("handCard");
		let cardIDList = shouCard.slice();
		let tingList = this.GetTingList();
		if (handCard > 0) {
			haveCount += 1;
		}
		for (var i = 0; tingList.length > i; i++) {
			for (var j = 0; cardIDList.length > j; j++) {
				if(Math.floor(cardIDList[j]/100)==tingList[i]){
					let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", j+1, 2);
					let btnNode = this.GetWndNode(btnPath);
					btnNode.getChildByName('tip').active=true;
				}
			}
			if(Math.floor(handCard/100)==tingList[i]){
				this.btn_in.getChildByName('tip').active = true;
			}
		}
		if (huCard.length) {
			this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		}
		else {
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		}
		this.actionWndNameList = [];
		let opList = this.GetOpTypeList();
		let opCount = opList.length;
		// && this.isYouJin()
		if (opCount == 2 && opList[0] == this.ShareDefine.OpType_PingHu && opList[1] == this.ShareDefine.OpType_Pass && this.isYouJin() == true) {
			//游金情况下平胡自动pass
			this.Click_btn_next();
			return;
		}
		if (opList[0] == this.ShareDefine.OpType_QiangGangHu && this.isYouJin() == true) {
			//游金情况下，抢杠胡自动pass
			this.Click_btn_next();
			return;
		}
		//dffff (3) [1, 27, 7]
		cc.log("dffff",opList)
		for (let index = 0; index < opCount; index++) {
			let opType = opList[index];

			if (opType == this.ShareDefine.OpType_Zimo) {
				cc.log("加自摸的按钮进去")
				if (!this.actionWndNameList.InArray("btn_zimo")) {
					this.actionWndNameList.push("btn_zimo");
				}
				//自己摸的牌,可以取消
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			} else if (opType == this.ShareDefine.OpType_Chi) {
				if (!this.actionWndNameList.InArray("btn_chi")) {
					this.ChiCardUp(room);
					this.actionWndNameList.push("btn_chi");
				}
			} else if (opType == this.ShareDefine.OpType_Peng) {
				if (!this.actionWndNameList.InArray("btn_pen")) {
					this.PengCardUp(room);
					this.actionWndNameList.push("btn_pen");
				}
			} else if (opType == this.ShareDefine.OpType_Gang) {
				if (!this.actionWndNameList.InArray("btn_gang")) {
					this.actionWndNameList.push("btn_gang");
				}
				//自己摸的牌,公杆可以取消
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			} else if (opType == this.ShareDefine.OpType_JieGang) {
				if (!this.actionWndNameList.InArray("btn_gang")) {
					this.actionWndNameList.push("btn_gang");
				}
			} 
			else if (opType == this.ShareDefine.OpType_JiePao) {
				cc.log("接炮")
				if (!this.actionWndNameList.InArray("btn_hu")) {
					this.actionWndNameList.push("btn_hu");
				}
				//自己摸的牌,胡可以取消
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			}else if (opType == this.ShareDefine.OpType_AnGang) {
				if (!this.actionWndNameList.InArray("btn_gang")) {
					this.actionWndNameList.push("btn_gang");
				}
				//自己摸的暗杆,可以取消
				if (!this.actionWndNameList.InArray("btn_cancel")) {
					this.actionWndNameList.push("btn_cancel");
				}
			} else if (opType == this.ShareDefine.OpType_Out) {
				console.log("OnShowPosActionHelp QZMJOpType_Out");

			}
			else if (opType == this.ShareDefine.OpType_Pass) {
				if (!this.actionWndNameList.InArray("btn_next")) {
					this.actionWndNameList.push("btn_next");
				}
			}
			//else if (opType == this.ShareDefine.OpType_Ting) {
				// if (!this.actionWndNameList.InArray("btn_ting")) {
				// 	this.actionWndNameList.push("btn_ting");
				// }
				// //自己摸的暗杆,可以取消
				// if (!this.actionWndNameList.InArray("btn_cancel")) {
				// 	this.actionWndNameList.push("btn_cancel");
				// }
			//}
			// else if (opType == this.ShareDefine.OpType_TianTing) {
			// 	if (!this.actionWndNameList.InArray("btn_ting")) {
			// 		this.actionWndNameList.push("btn_ting");
			// 	}
			// }
			// else if (opType == this.ShareDefine.OpType_SanJinYou) {
			// 	if (!this.actionWndNameList.InArray("btn_hu")) {
			// 		this.actionWndNameList.push("btn_hu");
			// 	}
			// }
			else if (opType == this.ShareDefine.OpType_QiangGangHu && this.isYouJin() == false) {
				if (!this.actionWndNameList.InArray("btn_hu")) {
					this.actionWndNameList.push("btn_hu");
				}
			} else if (opType == this.ShareDefine.OpType_TianHu) {
				if (!this.actionWndNameList.InArray("btn_hu")) {
					this.actionWndNameList.push("btn_hu");
				}
			} else if (opType == this.ShareDefine.OpType_PingHu && this.isYouJin() == false) {
				if (!this.actionWndNameList.InArray("btn_hu")) {
					this.actionWndNameList.push("btn_hu");
				}
			} else if (opType == this.ShareDefine.OpType_TingYouJin) {
				//戒烟戒酒解决 0 false
				cc.log("戒烟戒酒解决", this.OutJin(), this.isCanOutJin())
	
				if (opList.InArray(this.ShareDefine.OpType_DanYou) && this.isCanOutJin() == false) {
					console.log("已经单游并且不能打金了，不用显示听游金了")
				} else {
					if (this.OutJin() == 0 && this.isCanOutJin() == false) {
						//单游

						// if (!this.actionWndNameList.InArray("btn_danyou")) {
						// 	this.actionWndNameList.push("btn_danyou");
						// 	cc.log("单游按钮")
						// }
						if (!this.actionWndNameList.InArray("btn_zimo")) {//不存在自摸按钮
							// this.actionWndNameList.push("btn_zimo");
							this.Click_btn_tingyou();
							cc.log("自动打出游金")
						}
						
					}
					//  else if (this.OutJin() == 0 && this.isCanOutJin() == true) {
					// 	// //双游
					// 	// if (!this.actionWndNameList.InArray("btn_shuangyou")) {
					// 	// 	this.actionWndNameList.push("btn_shuangyou");
					// 	// 	cc.log("双游按钮")
					// 	// }
					// 		if (!this.actionWndNameList.InArray("btn_danyou")) {
					// 		this.actionWndNameList.push("btn_danyou");
					// 		cc.log("单游按钮")
					// 	}
					// } else if (this.OutJin() == 1 && this.isCanOutJin() == true) {
					// 	if (!this.actionWndNameList.InArray("btn_shuangyou")) {
					// 		this.actionWndNameList.push("btn_shuangyou");
					// 		cc.log("双游按钮")
					// 	}
						
					// 	//三游
					// 	// if (!this.actionWndNameList.InArray("btn_sanyou")) {
					// 	// 	this.actionWndNameList.push("btn_sanyou");
					// 	// 	cc.log("三游按钮")
					// 	// }
					// }
				
					if (opList.InArray(this.ShareDefine.OpType_Out)) {
						if (!this.actionWndNameList.InArray("btn_cancel")) {
							this.actionWndNameList.push("btn_cancel");
							cc.log("取消按钮")
						}
					}
				}
			} else if (opType == this.ShareDefine.OpType_DanYou) {
				cc.log("加单游")
				if (!this.actionWndNameList.InArray("btn_danyou")) {
					this.actionWndNameList.push("btn_danyou");
				}

				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}

			} else if (opType == this.ShareDefine.OpType_ShuangYou ) {
				cc.log("双游")
				if (!this.actionWndNameList.InArray("btn_shuangyou")) {
					this.actionWndNameList.push("btn_shuangyou");
				}
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			}else if (opType == this.ShareDefine.OpType_SanYou) {
				cc.log("三游")
				if (!this.actionWndNameList.InArray("btn_sanyou")) {
					this.actionWndNameList.push("btn_sanyou");
				}
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			} else if (opType == this.ShareDefine.OpType_QiangJin) {
				if (!this.actionWndNameList.InArray("btn_qiangjin")) {
					this.actionWndNameList.push("btn_qiangjin");
				}
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			} else if (opType == this.ShareDefine.OpType_SanJinDao) {
				if (!this.actionWndNameList.InArray("btn_sanjin")) {
					this.actionWndNameList.push("btn_sanjin");
				}
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			} else if (opType == this.ShareDefine.OpType_SiJinDao) {
				if (!this.actionWndNameList.InArray("btn_sijin")) {
					this.actionWndNameList.push("btn_sijin");
				}
				if (opList.InArray(this.ShareDefine.OpType_Out)) {
					if (!this.actionWndNameList.InArray("btn_cancel")) {
						this.actionWndNameList.push("btn_cancel");
					}
				}
			}
		}

		//如果每次有出牌动作提示
		if (this.actionWndNameList.length) {
			this.sp_tishi.active = 1;
			let helpCount = this.AllHelpWndNameList.length;
			for (let index = 0; index < helpCount; index++) {
				let wndName = this.AllHelpWndNameList[index];
				let wndPath = ["sp_tishi", wndName].join("/");
				let isShow = false;
				if (this.actionWndNameList.InArray(wndName)) {
					isShow = true;
				}
				this.SetWndProperty(wndPath, "active", isShow);
			}
		} else {
			this.sp_tishi.active = 0;
			//启动锁牌开始
			this.LockCard(room);
		}
		return this.actionWndNameList;
	},
	/*
*用户是否双金
 */
	jinNum: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let jin = roomSet.get_jin1();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let cardIDList = shouCard.slice();
		let haveJin = 0;
		for (let i = 0; i < cardIDList.length; i++) {
			if (Math.floor(jin / 100) == Math.floor(cardIDList[i] / 100)) {
				haveJin++;
			}
		}
		return haveJin;
	},
	/*
*判断用户的牌是否可以游金
 */
isYouJin: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let jin = roomSet.get_jin1();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let cardIDList = shouCard.slice();
		let haveJin = false;
		for (let i = 0; i < cardIDList.length; i++) {
			if (Math.floor(jin / 100) == Math.floor(cardIDList[i] / 100)) {
				haveJin = true;
				break;
			}
		}
		if (haveJin == false) {
			return false;
		}
		let roomPosMgr = room.GetRoomPosMgr();
		let clientPos = roomPosMgr.GetClientPos();
		let huCardTypeInfo = room.GetRoomSet().GetHuCardTypeInfo(clientPos);
		let cardTypeList = Object.keys(huCardTypeInfo);
		cardTypeList.SortList();
		let count = cardTypeList.length;
		if (count >= 30) {
			return true;
		}
		return false;
	},
	isCanOutJin: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("GetOpTypeList not enter room");
			return []
		}
		let roomSet = room.GetRoomSet();
		if (!roomSet) {
			this.ErrLog("GetOpTypeList not roomSet");
			return []
		}
		let jin = roomSet.get_jin1();
		let youjinList = this.GetYouJinList();
		// isCanOutJin (2) [2201, 2502]0: 221: 25length: 2__proto__: Array(0) 
		cc.log("isCanOutJin", youjinList, jin)
		for (let i = 0; i < youjinList.length; i++) {
			if (Math.floor(jin / 100) == Math.floor(youjinList[i] / 100)) {
				return true;
			}
		}
		return false;
	},
	isNeedLock:function(room){
		let roomSet=room.GetRoomSet();
		let roomPosMgr = room.GetRoomPosMgr();
		let pos1 = roomPosMgr.GetClientPos();
		let isLock = roomSet.GetSetPosByPos(pos1).GetSetPosProperty("isLock");
		let handCard = roomSet.GetSetPosByPos(pos1).GetSetPosProperty("handCard");
		if(handCard <= 0){
			return false;
		}
		if(isLock==true){
			return true;
		}else{
			return false;
		}
	},
	LockCard:function(room){
		let roomPosMgr = room.GetRoomPosMgr();
		let clientPos=roomPosMgr.GetClientPos();
		let isAuto = room.GetRoomDataInfo()['posList'][clientPos].trusteeship;
		if(isAuto){
			//托管状态没法锁牌，因为打牌服务端控制
			return;
		}
		let setPos = room.GetClientPlayerSetPos();
		let roomSet=room.GetRoomSet();
		let jin1 = roomSet.get_jin1();
		let setRound = roomSet.GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		if (opPosList.length > 0) {
			let waitOpPos = opPosList[0]["waitOpPos"];
			let buNengChuList = this.GetBuChuList();
			// if(waitOpPos == clientPos && this.isNeedLock(room)==true && buNengChuList.length > 0){
			if (waitOpPos == clientPos && buNengChuList.length > 0) {
				//启动锁牌
				let handCard = room.GetClientPlayerSetPos().GetSetPosProperty("handCard");
				let shouCardList = room.GetClientPlayerSetPos().GetSetPosProperty("shouCard");
				for(let index=0; index < shouCardList.length; index++){
					let cardID = shouCardList[index];
					let btnLockPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2)+"/lock";
					let btnLock = this.GetWndNode(btnLockPath);
					if (buNengChuList.indexOf(Math.floor(cardID/100)) >= 0) {
						btnLock.active=1;
					}else{
						btnLock.active=0;
					}
				}
				if(buNengChuList.indexOf(Math.floor(handCard / 100)) >= 0){
					this.btn_in.getChildByName('lock').active=1;
				}else{
					this.btn_in.getChildByName('lock').active=0;
				}
			}
		}
	},
	unlockcard:function(room){
		let shouCardList = room.GetClientPlayerSetPos().GetSetPosProperty("shouCard");
		//标记isLock  false
		let roomSet=room.GetRoomSet();
		let roomPosMgr = room.GetRoomPosMgr();
		let pos1 = roomPosMgr.GetClientPos();
		roomSet.unLock(pos1);
		//标记isLock  false
		for(let index=0; index < shouCardList.length; index++){
			let btnLockPath = this.ComTool.StringAddNumSuffix("card/btn_", index + 1, 2)+"/lock";
			let btnLock = this.GetWndNode(btnLockPath);
			if(btnLock){
				btnLock.active=0;
			}
		}
		this.btn_in.getChildByName('lock').active=0;
	},
	//---------点击函数---------------------
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_in") {
			this.Click_btn_in();
		}
		else if (btnName == "btn_cancel") {
			this.Click_btn_cancel();
		}
		else if (btnName == "btn_hu") {
			this.Click_btn_hu();
		}
		else if (btnName == "btn_zimo") {
			this.Click_btn_zimo();
		}
		else if (btnName == "btn_next") {
			this.Click_btn_next();
		}
		else if (btnName == "btn_pen") {
			this.Click_btn_pen();
		}
		// else if (btnName == "btn_ting") {
		// 	// this.Click_btn_ting();
		// 	this.Click_btn_tianting();
		// }
		else if (btnName == "btn_gang") {
			this.Click_btn_gang();
		} else if (btnName == "btn_danyou") {
			this.Click_btn_danyou();
		}else if (btnName == "btn_shuangyou" ) {
			this.Click_btn_shuangyou();
		} else if (btnName == "btn_sanyou") {
			this.Click_btn_sanyou();
		}  else if (btnName == "btn_qiangjin") {
			this.Click_btn_qiangjin();
		} else if (btnName == "btn_sanjin") {
			this.Click_btn_sanjin();
		} else if (btnName == "btn_sijin") {
			this.Click_btn_sijin();
		} else if (btnName == "btn_chi") {
			this.Click_btn_chi();
		} else if (btnName.startsWith("btn_")) {
			this.Click_card(btnName, btnNode);
		}
		else {
			this.ErrLog("btnName:%s not find", btnName);
		}
		//app.GameManager().CheckAutoPlay();
	},

	//如果取消胡
	Click_btn_cancel: function () {
		if (this.actionWndNameList.InArray("btn_cancel")) {
			this.actionWndNameList.Remove("btn_cancel");
			this.sp_tishi.active = 0;
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseCard");
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseChi");
			this.LockCard(this.RoomMgr.GetEnterRoom());
		}
		else {
			this.ErrLog("Click_btn_cancel not find btn_cancel");
		}
	},
	Click_btn_ting: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let shouCard = setPos.GetSetPosProperty("shouCard");
		let handCard = setPos.GetSetPosProperty("handCard");
		let cardIDList = shouCard.slice();
		let tingList = this.GetTingList();
		for (var i = 0; tingList.length > i; i++) {
			for (var j = 0; cardIDList.length > j; j++) {
				if (Math.floor(cardIDList[j] / 100) == tingList[i]) {
					let btnPath = this.ComTool.StringAddNumSuffix("card/btn_", j + 1, 2);
					let btnNode = this.GetWndNode(btnPath);
					btnNode.getChildByName('tip').active = true;
				} else if (Math.floor(handCard / 100) == tingList[i]) {
					this.btn_in.getChildByName('tip').active = true;
				}
			}
		}
		this.Click_btn_cancel();
	},
	//如果胡
	Click_btn_hu: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_PingHu;
		//如果是枪杆胡
		if (opList.InArray(this.ShareDefine.OpType_PingHu)) {
			opType = this.ShareDefine.OpType_PingHu;
		}
		if (opList.InArray(this.ShareDefine.OpType_QiangGangHu)) {
			opType = this.ShareDefine.OpType_QiangGangHu;
		}
		// if (opList.InArray(this.ShareDefine.OpType_SanJinYou)) {
		// 	opType = this.ShareDefine.OpType_SanJinYou;
		// }
		if (opList.InArray(this.ShareDefine.OpType_TianHu)) {
			opType = this.ShareDefine.OpType_TianHu;
		}
		// if (opList.InArray(this.ShareDefine.OpType_DanYou)) {
		// 	opType = this.ShareDefine.OpType_DanYou;
		// }
		// if (opList.InArray(this.ShareDefine.OpType_ShuangYou)) {
		// 	opType = this.ShareDefine.OpType_ShuangYou;
		// }
		// if (opList.InArray(this.ShareDefine.OpType_SanYou)) {
		// 	opType = this.ShareDefine.OpType_SanYou;
		// }
		if (opList.InArray(this.ShareDefine.OpType_JiePao)) {
			opType = this.ShareDefine.OpType_JiePao;
		}
		this.RoomMgr.SendPosAction(0, opType);
	},
		//自摸
	Click_btn_zimo: function () {
		this.sp_tishi.active = 0;
		let opList = this.GetOpTypeList();
		let opType = this.ShareDefine.OpType_Zimo;
		this.RoomMgr.SendPosAction(0, opType);
	},
	//点击出牌节点
	ChooseCardNode: function (clickNode) {
		//如果handcard是花，直接取消动作
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let handCard = setPos.GetSetPosProperty("handCard");
		if (handCard > 5000) {
			//用户手中有花，等待服务端通知补花通知，不允许选择出牌
			return
		}
		//如果还在发牌阶段不能出牌
		if (this.allCardNodeList.length) {
			this.SoundManager.PlaySound("wufachupai");
			this.Log("ChooseCardNode in doing allCardNodeList");
			return
		}

		//是否允许出牌
		let opTypeList = this.GetOpTypeList();
		if (!opTypeList.InArray(this.ShareDefine.OpType_Out)) {
			this.chooseNode = clickNode;
			this.chooseNode.y = this.InitBtnCardPosY;
			this.SoundManager.PlaySound("wufachupai");
			return
		}

		//如果存在取消,需要取消才能打牌
		if (this.actionWndNameList.InArray("btn_cancel")) {
			this.Log("ChooseCardNode actionWndNameList find btn_cancel");
			this.SoundManager.PlaySound("wufachupai");
			return
		}
		let clickCardType = 0;
		if (this.chooseNode) {
			//2次选中一样,打出去
			if (this.chooseNode == clickNode) {
				let cardNode = this.chooseNode.getChildByName("card");
				let cardID = cardNode.getComponent(app.subGameName+"_UIMJCard01_Card").GetCardID();

				let roomSet = room.GetRoomSet();
				let jin = roomSet.get_jin1();
				/*if(Math.floor(cardID/100)==Math.floor(jin/100)){
					//用户要打金
					let kexuanwanfa=room.GetRoomConfigByProperty('kexuanwanfa');
	        		if(kexuanwanfa.length>0){
		            	if(kexuanwanfa.indexOf(3)>-1){
		            		//可以打金，用户勾选了可双游三游
		            	}else{
			            	this.SoundManager.PlaySound("wufachupai");
							return
		            	}
	        		}
				}*/
				this.RoomMgr.SendPosAction(cardID, this.ShareDefine.OpType_Out);
				this.canTouch = false;
				let self = this;
				setTimeout(function () {
					self.canTouch = true;
				}, 2000);//防止刚打出去立马又touch了
			}
			//2次选中不一样,还原上次选中的坐标,记录新的选中
			else {
				this.chooseNode.y = this.InitBtnCardPosY;
				this.chooseNode = clickNode;
				this.chooseNode.y = this.ChooseCardAddOffY;
			}
		} else {
			this.chooseNode = clickNode;
			this.chooseNode.y = this.ChooseCardAddOffY;

		}

	},
	CloseSpTiShi: function () {
		this.sp_tishi.active = 0;
	},
});
