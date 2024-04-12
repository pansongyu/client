/*
 BaseChildForm 子界面基类(又界面控制创建和销毁,一般是BaseForm的子界面,或者BaseChildForm的子界面(可以无限嵌套下去))
 */

var app = require("qzmj_app");


var BaseMaJiangForm = cc.Class({

	extends: require(app.subGameName + "_BaseForm"),

	InitBase: function () {
		this.HeroManager = app[app.subGameName + "_HeroManager"]();
		this.UtilsWord = app[app.subGameName + "_UtilsWord"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.FormManager = app[app.subGameName + "_FormManager"]();
		this.RoomMgr = app[app.subGameName.toUpperCase() + "RoomMgr"]();
		this.RoomPosMgr = app[app.subGameName.toUpperCase()+"RoomPosMgr"]();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.Client = app[app.subGameName + "Client"];
		//把骰子贴图存起来
		this.SaiZiList = [this.SaiZi1, this.SaiZi2, this.SaiZi3, this.SaiZi4, this.SaiZi5, this.SaiZi6];
		//初始化状态
		this.DealCard_InitState = 0;
		//拿牌3次每次2蹲
		this.DealCard_GetCardState = 1;
		//摸牌一人一张
		this.DealCard_MoCardState = 2;
		//本家整理牌
		this.DealCard_AlignCardState = 3;

		this.dealCardState = this.DealCard_InitState;

		//没播放long特效
		this.NoAction = 0;
		//播放long特效
		this.EffectActionLong = 1;
		//播放自摸特效
		this.EffectActionZiMo = 2;
		//播放zhama特效
		//this.EffectActionZhaMa = 3;
		//初始化播放状态
		this.EffectActionState = this.NoAction;

		//开局每个位置拿牌蹲node列表
		this.dealGetDunNodeList = [];

		//开局最后摸牌的蹲node列表
		this.dealMoDunNodeList = [];

		//发牌结束剩余的牌节点列表
		this.leftPaiNodeList = [];
		//客户端玩家自己的手牌ID列表
		this.clientPlayerShouCardList = [];

		//发牌阶段开卡牌间隔时间
		this.OpenCardTick = 100;
		//发牌阶段摸牌间隔
		this.MoCardTick = 100 * 4;
		this.AlignCardTick = 500;

		this.nextDealCardTick = 0;
		if (this.IsIphoneX() == true) {
			let widge = this.node.getChildByName('cardNodes').getChildByName('card01').getComponent(cc.Widget);
			widge.bottom = -315;
		}

		this.isBackGround = false;
		this.BackTime = 5; //oncreate不捕获
		let that = this;
		cc.game.on(cc.game.EVENT_HIDE, function (event) {
			if (!that.isBackGround) {
				that.isBackGround = true;
				that.SysLog("切换后台");
			}
		});
		cc.game.on(cc.game.EVENT_SHOW, function (event) {
			if (that.BackTime > 3) {
				return;
			}
			that.SysLog("cc.game.on EVENT_SHOW");
			if (that.isBackGround) {
				that.SysLog("切换前台");
				that.isBackGround = false;
				that.BackTime = that.BackTime + 1;
				app[app.subGameName + "_LocationOnStartMgr"]().OnGetLocation();
			}

		});
	},
	CheckInRoom:function(){
		let roomID = this.RoomMgr.GetEnterRoomID();
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName+".C"+app.subGameName.toUpperCase()+"GetRoomID", {},function(event){
            if (event.roomID <= 0 || event.roomID != roomID) {
                app[app.subGameName + "Client"].ExitGame();
            }
        },function(error){
            app[app.subGameName + "Client"].ExitGame();
        });
	},
	//继承类，需重写
	OnCreateInit: function () {
	},
	RegBaseEvent: function () {
		//公共消息
		//
		this.RegEvent(this.GameTyepStringUp() + "_PosContinueGame", this.Event_PosContinueGame);
		this.RegEvent(this.GameTyepStringUp() + "_DissolveRoom", this.Event_DissolveRoom);
		this.RegEvent(this.GameTyepStringUp() + "_StartVoteDissolve", this.Event_StartVoteDissolve);//发起房间结算投票
		this.RegEvent(this.GameTyepStringUp() + "_ChangePlayerNum", this.Event_ChangePlayerNum);//发起房间修改人数
		this.RegEvent(this.GameTyepStringUp() + "_PosReadyChg", this.Event_PosReadyChg);
		this.RegEvent(this.GameTyepStringUp() + "_PosReady", this.Event_PosReady);
		this.RegEvent(this.GameTyepStringUp() + "_PosLeave", this.Event_PosLeave);
		this.RegEvent(this.GameTyepStringUp() + "_PosUpdate", this.Event_PosUpdate);
		//游戏消息
		this.RegEvent(this.GameTyepStringUp() + "_SetStart", this.Event_SetStart);//游戏开始
		this.RegEvent(this.GameTyepStringUp() + "_PosGetCard", this.Event_PosGetCard);
		this.RegEvent(this.GameTyepStringUp() + "_StartRound", this.Event_StartRound);//一圈开始
		this.RegEvent(this.GameTyepStringUp() + "_PosOpCard", this.Event_PosOpCard);//会次出牌
		this.RegEvent(this.GameTyepStringUp() + "_PosOpCardEX", this.Event_PosOpCardEX);//会次出牌
		this.RegEvent(this.GameTyepStringUp() + "_SetEnd", this.Event_SetEnd);
		this.RegEvent(this.GameTyepStringUp() + "_DeleteOutCard", this.Event_DeleteOutCard);//删除打出的牌
		//补花动作事件
		this.RegEvent(this.GameTyepStringUp() + "_Applique", this.Event_Applique);
		//抢金三金
		this.RegEvent(this.GameTyepStringUp() + "_SQOpCard", this.Event_SQOpCard);
		//开金
		this.RegEvent(this.GameTyepStringUp() + "_Jin", this.Event_Jin);
		//开完金手牌拍下//开完金手牌拍下
		this.RegEvent(this.GameTyepStringUp() + "_SetPosCard", this.EVENT_SetPosCard);

		this.RegEvent(this.GameTyepStringUp() + "_ChangeStatus", this.Event_ChangeStatus);

		//比赛分不足时通知
		this.RegEvent("SportsPointEnough", this.Event_SportsPointEnough);
		this.RegEvent("SportsPointNotEnough", this.Event_SportsPointNotEnough);
		this.RegEvent('CodeError', this.Event_CodeError);

		this.RegEvent("ChatMessage", this.Event_ChatMessage);
        this.RegEvent('ExitRoomSuccess',this.Event_ExitRoomSuccess);
		this.RegEvent("EVT_OnDicePlayEnd", this.OnDicePlayEnd);
		this.RegEvent("EVT_ClosePosActionHelp", this.Event_ClosePosActionHelp);
		this.RegEvent(this.GameTyepStringUp() + "_Promptly", this.Event_Promptly);
		this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf, this);
		this.RegEvent('GameGift',this.Event_GameGift);
		this.RegEvent("OnIsGpsOpen", this.OnEvt_IsGpsOpen, this);
		this.setEnd = false;
		this.roomSetID = 0;
		//摇筛子特效
		this.DirectionDict = {
			0: "UIDice_Dong",
			1: "UIDice_Nan",
			2: "UIDice_Xi",
			3: "UIDice_Bei",
		};
		this.middleAnimation = this.sp_middle.getComponent(cc.Animation);
		this.diceAnimation = this.nd_dice.getComponent(cc.Animation);
		this.diceAnimation.on('finished', this.OnDiceFinished, this);
		this.node.on("OnAnimationEvent", this.OnAnimationEvent, this);

		this.btn_voice.on("touchstart",     this.Event_TouchStart,  this);
	    this.btn_voice.on("touchend",       this.Event_TouchEnd,    this);
	    this.btn_voice.on("touchcancel",    this.Event_TouchEnd,    this);
	},
	Event_Promptly: function () {
		app[app.subGameName + "Client"].OnEvent('Head_PosUpdate', {});
	},
	OnEvt_CopyTextNtf: function (event) {
		if (0 == event.code)
			this.ShowSysMsg("已复制：" + event.msg);
		else
			this.ShowSysMsg("房间号复制失败");
	},
	Event_ExitRoomSuccess:function(event){
        app[app.subGameName + "Client"].ExitGame();
    },
	Evt_OutCardTip: function (cardID) {
		//遍历4个座位
		for (let index = 0; index < this.ShareDefine.MJRoomJoinCount; index++) {
			let showpos = this.Pos2Show(index);
			if (showpos > 0) {
				this.ShowPosTipCard(showpos, cardID);
			}
		}
	},
	Event_SportsPointEnough: function (event) {
		let msg = event.msg;
		this.SetWaitForConfirm("SportsPointEnough", this.ShareDefine.ConfirmOK, [msg]);
	},
	Event_SportsPointNotEnough: function (event) {
		let msg = event.msg;
		this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
	},
	Event_ChangeStatus:function(event){
    },
	OnEvt_IsGpsOpen: function (event) {
		console.log('CheckGpsIsOpen OnEvt_IsGpsOpen status:' + event.status);
		if (true == event.status || event.status == 1) {
			//this.ShowSysMsg("grps已经开启");
		}
		else {
			//this.ShowSysMsg("grps关闭");
			this.FormManager.ShowForm(app.subGameName + "_UIMessageGps");
		}
	},
	CheckGpsIsOpen: function () {
		console.log('CheckGpsIsOpen in');
		if (!cc.sys.isNative) {
			return;
		}
		app[app.subGameName + "_LocationOnStartMgr"]().OnGetLocation();

		let appTiShi = false;
		var ioslocalVersion = app[app.subGameName + "_NativeManager"]().CallToNative("getVersion", [], "String");
		ioslocalVersion = ioslocalVersion.split('.');
		//小于2.2.27，提示用户重新下载新包
		if (ioslocalVersion[0] < 1) {
			appTiShi = true;
		} else if (ioslocalVersion[1] < 1) {
			appTiShi = true;
		} else if (ioslocalVersion[2] < 5) {
			appTiShi = true;
		}
		console.log('CheckGpsIsOpen appTiShi:' + appTiShi);
		//appTiShi==true  ,版本太低
		if (appTiShi == false) {
			//开始检测gprs是否开启
			app[app.subGameName + "_NativeManager"]().CallToNative("isGpsOpen", []);
		}
		return;
	},
	Event_GameGift: function (event) {
		let self = this;
		let argDict = event;
		let sendPos = argDict['sendPos'];
		let recivePos = argDict['recivePos'];
		let productId = argDict['productId'];
		let sendHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(sendPos);
		let reciveHead = app[app.subGameName + "_HeadManager"]().GetComponentByPos(recivePos);
		let giftIdx = productId - 1;
		let tempNode = cc.instantiate(this.giftPrefabs[giftIdx]);
		let ani = tempNode.getComponent(cc.Animation);
		// tempNode.tag = giftIdx;
		tempNode.name = ani.defaultClip.name;
		tempNode.bMove = true;
		ani.on('finished', this.OnGiftAniEnd, this);
		let vec1 = sendHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
		let vec2 = reciveHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
		vec1 = this.giftNode.convertToNodeSpaceAR(vec1);
		vec2 = this.giftNode.convertToNodeSpaceAR(vec2);
		tempNode.x = vec1.x;
		tempNode.y = vec1.y;
		this.giftNode.addChild(tempNode);
		let action = cc.sequence(
			cc.moveTo(0.3, vec2),
			cc.callFunc(self.GiftMoveEnd, self)
		);
		tempNode.runAction(action);

		this.scheduleOnce(function(){
			tempNode.destroy();
        },2);
	},

	GiftMoveEnd:function(sender, useData){
		sender.getComponent(cc.Animation).play();
		sender.bMove = false;
		//播放音效
		app[app.subGameName + "_SoundManager"]().PlaySound('mofa_'+sender.name);
	},
	OnGiftAniEnd:function(event){
		let nodes = this.giftNode.children;
		for(let i=nodes.length;i>0;i--){
			if(event){
				let aniState = nodes[i-1].getComponent(cc.Animation).getAnimationState(nodes[i-1].name);
				if(aniState.isPlaying)
					continue;
				if(!nodes[i-1].bMove)
					nodes[i-1].removeFromParent();
			}
			else
				nodes[i-1].removeFromParent();
		}
	},

	Event_TouchStart:function (event) {
		this.SysLog("Event_TouchStart");
		app[app.subGameName+"_AudioManager"]().startRecord();

	},
	Event_TouchEnd:function (event) {
		this.SysLog("Event_TouchEnd");

		this.FormManager.CloseForm(app.subGameName+"_UIAudio");
		app[app.subGameName+"_AudioManager"]().setTouchEnd(true);
		app[app.subGameName+"_AudioManager"]().stopRecord();
	},
	/*
    十三幺隐藏SeeCard
     */
	HideAllSeeCard: function () {
		return;
	},
	ShowPlayerOk: function () {
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		let isPosReady = RoomPosMgr.GetPosReady(clientPos);
		if (isPosReady == true) {
			this.btn_ok.active = false;
		} else {
			this.btn_ok.active = true;
		}
		this.btn_weixin.active = 0;
		this.btn_roomkey.active = 0;
	},
	ShowPosTipCard: function (pos, cardID) {
		let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let seatNode = this.GetWndNode(seatWndName);
		if (!seatNode) {
			this.ErrLog("ShowPosOutCard not find (%s)", seatWndName);
			return
		}
		let nd_outNode = seatNode.getChildByName("nd_out");
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		let UIPlay_Out = nd_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
		if (is3DShow == 0) {
			UIPlay_Out = nd_outNode.getComponent(app.subGameName + "_UIMJ2DPlay_Out");
		}
		UIPlay_Out.ShowTipOutCard(cardID);

		//吃牌提示
		let eatWndName = this.ComTool.StringAddNumSuffix("cardNodes/card", pos, 2);
		let eatNode = this.GetWndNode(eatWndName);
		if (eatNode.children.length > 0) {
			let downcardComponet = eatNode.children[0].getChildByName('downcard').getComponent(app.subGameName + "_UIMJCard_Down");
			downcardComponet.ShowTipOutCard(cardID);
		}
	},
	OnAnimationEvent: function (event) {
		let argDict = event;
		let node = argDict["Node"];
		//如果是手指关键帧,开始播放色子
		if (node == this.sp_middle) {
			this.diceAnimation.play("UIDice_PlayDice");
			this.diceAnimation.playAdditive("UIDice_PlayDice02");
		}
		else {
			this.ErrLog("OnAnimationEvent:%s error", node.name);
		}
	},
	GetOutPaiNode: function (outNode, outlength, showpos) {
		let outNodeList1 = outNode.getChildByName('out1');
		if (outNodeList1.children.length >= outlength) {
			if (showpos == 2 || showpos == 3) {
				return outNodeList1.children[outNodeList1.children.length - outlength];
			} else {
				return outNodeList1.children[outlength - 1];
			}
		}
		outlength = outlength - outNodeList1.children.length;
		let outNodeList2 = outNode.getChildByName('out2');
		if (outNodeList2.children.length >= outlength) {
			if (showpos == 2 || showpos == 3) {
				return outNodeList2.children[outNodeList2.children.length - outlength];
			} else {
				return outNodeList2.children[outlength - 1];
			}
		}
		outlength = outlength - outNodeList2.children.length;
		let outNodeList3 = outNode.getChildByName('out3');
		if (outNodeList3.children.length >= outlength) {
			if (showpos == 2 || showpos == 3) {
				return outNodeList3.children[outNodeList3.children.length - outlength];
			} else {
				return outNodeList3.children[outlength - 1];
			}
		}
		outlength = outlength - outNodeList3.children.length;
		let outNodeList4 = outNode.getChildByName('out4');
		if (outNodeList4.children.length >= outlength) {
			if (showpos == 2 || showpos == 3) {
				return outNodeList4.children[outNodeList4.children.length - outlength];
			} else {
				return outNodeList4.children[outlength - 1];
			}
		}
	},
	OutCard: function (outCardList) {
		var new_outCardList = new Array();
		let count = outCardList.length;
		var i = 0;
		for (let index = 0; index < count; index++) {
			let cardID = outCardList[index];
			if (cardID > 5000) {
				new_outCardList[i] = cardID;
				i++;
			}
		}
		for (let index = 0; index < count; index++) {
			let cardID = outCardList[index];
			if (cardID <= 5000 && cardID > 0) {
				new_outCardList[i] = cardID;
				i++;
			}
		}
		return new_outCardList;

	},
	ShowPaiAction: function (pos) {
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(pos);
		let outCardList = this.OutCard(setPos.GetSetPosProperty("outCard"));
		let outlength = outCardList.length;
		let showpos = this.Pos2Show(pos);

		let outNode = this.node.getChildByName("sp_seat0" + showpos).getChildByName('nd_out');
		let shownode = this.GetOutPaiNode(outNode, outlength, showpos);
		this.shownodePos = this.node.convertToNodeSpaceAR(shownode.convertToWorldSpaceAR(cc.v2(0, 0)));
		//let basePos=cc.v2(shownode.x,shownode.y);
		let cardPos = this.node.getChildByName('PosMoveOutAcrd').getChildByName('cardPos' + showpos);

		var newVec2 = this.node.convertToNodeSpaceAR(cardPos.convertToWorldSpaceAR(cc.v2(0, 0)));

		// var seq = cc.sequence(cc.spawn(cc.moveTo(0.2,cc.v2(newVec2.x,newVec2.y)),
		//                     cc.scaleTo(0.2,0.3)
		//             ), cc.callFunc(this.ActionFinishShowAllOutCard,this));
		var seq = cc.spawn(cc.moveTo(0.1, cc.v2(newVec2.x, newVec2.y)),
			cc.scaleTo(0.1, 1.0));


		//获取打牌CardID
		let cardID = outCardList[outCardList.length - 1];
		this.MoveNode = this.node.getChildByName('PosMoveOutAcrd').getChildByName('card' + showpos);
		this.ShowPaiSprite(cardID, this.MoveNode);
		this.MoveNode.active = true;
		this.scheduleOnce(function () {
			this.MoveNode.runAction(seq)
		}, 0);
	},
	ShowPaiSprite: function (jin, btnNode) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if(jin == 0){
			return;
		}
		let cardType = Math.floor(jin / 100);
		let imageName = ["CardShow", cardType].join("");
		if (is3DShow == 0) {
			//Card2DShow
			imageName = ["Card2DShow", cardType].join("");
		} else if (is3DShow == 2) {//同3D一样
			//CardWBShow
			// imageName = ["CardShow", cardType].join("");
		}
		let imageInfo = this.IntegrateImage[imageName];
		if (imageInfo) {
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("ShowKaiJinSprite(%s) load spriteFrame fail", imagePath);
						return;
					}
					let wndSprite = btnNode.getComponent(cc.Sprite);
					wndSprite.spriteFrame = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("ShowKaiJinSprite(%s) error:%s", imagePath, error.stack);
				})
		}
		else {
			this.ErrLog('failed load imageName%s', imageName, cardType);
			return;
		}
	},
	ActionFinishShowAllOutCard: function (isOut = true) {
		if (isOut) {
			this.ShowAllOutCard(this.room);
		}
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card1').active = false;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card2').active = false;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card3').active = false;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card4').active = false;

		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card1').getComponent(cc.Sprite).spriteFrame = '';
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card2').getComponent(cc.Sprite).spriteFrame = '';
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card3').getComponent(cc.Sprite).spriteFrame = '';
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card4').getComponent(cc.Sprite).spriteFrame = '';

		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card1').scaleX = 0.7;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card1').scaleY = 0.7;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card1').x = 172;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card1').y = -92;

		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card2').scaleX = 1;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card2').scaleY = 1;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card2').x = 258;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card2').y = 56;

		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card3').scaleX = 1;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card3').scaleY = 1;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card3').x = -154;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card3').y = 203;

		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card4').scaleX = 1;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card4').scaleY = 1;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card4').x = -305;
		this.node.getChildByName('PosMoveOutAcrd').getChildByName('card4').y = 57;
	},
	//不同玩家展示位置不同，二人麻将
	Pos2Show: function (pos) {
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		let downPos = RoomPosMgr.GetClientDownPos();
		let facePos = RoomPosMgr.GetClientFacePos();
		let upPos = RoomPosMgr.GetClientUpPos();
		if (pos == clientPos) {
			return 1;
		} else if (pos == downPos) {
			return 2;
		} else if (pos == facePos) {
			return 3;
		} else if (pos == upPos) {
			return 4;
		}
		return -1;
	},
	InitAllNdOut: function () {
		let players = this.RoomMgr.GetEnterRoom().GetRoomProperty('posList');
		this.playersCount = players.length;
		let childNum = 6;
		if (this.playersCount == 2) {
			childNum = 21;
		}
		if (this.playersCount != 3) {
			for (let i = 0; i < players.length; i++) {
				let showpos = this.Pos2Show(i);
				this.InitNdOut(showpos, childNum);
			}
		} else {
			for (let i = 0; i < players.length; i++) {
				let showpos = this.Pos2Show(i);
				this.Init3RenNdOut(showpos, childNum);
			}
		}
	},
	Init3RenNdOut: function (pos, childNum) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		this.nd_out01 = this.node.getChildByName('nd_out01');
		this.nd_out02 = this.node.getChildByName('nd_out02');
		this.nd_out03 = this.node.getChildByName('nd_out03');
		this.nd_out04 = this.node.getChildByName('nd_out04');
		let nd_outLineNum = 4;//总共4排
		let nd_outChild = false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName + '/nd_out');
		if (pos == 1) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				if (i == 2) {
					childNum = 10;  //第3牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.x = nd_outNode.getChildByName('out2').x + 115;
					} else {
						nd_outNodeChild.x = nd_outNode.getChildByName('out2').x + 97;
					}
				}
				if (i == 3) {
					childNum = 10;  //第3牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.x = nd_outNode.getChildByName('out3').x + 115;
					} else {
						nd_outNodeChild.x = nd_outNode.getChildByName('out3').x + 97;
					}
				}
				if (i == 4) {
					childNum = 10;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.x = nd_outNode.getChildByName('out4').x;
					} else {
						nd_outNodeChild.x = nd_outNode.getChildByName('out4').x;
					}
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name = "pai" + j;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);

				}
			}
		} else if (pos == 2) {
			childNum = 10;
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				if (i == 2) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.y = nd_outNode.getChildByName('out2').y + 92;
					} else {
						nd_outNodeChild.y = nd_outNode.getChildByName('out2').y + 72;
					}
				}
				if (i == 3) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.y = nd_outNode.getChildByName('out3').y + 92;
					} else {
						nd_outNodeChild.y = nd_outNode.getChildByName('out3').y + 72;
					}
				}
				if (i == 4) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.y = nd_outNode.getChildByName('out4').y;
					} else {
						nd_outNodeChild.y = nd_outNode.getChildByName('out4').y;
					}
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name = "pai" + j;
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outChild.x = nd_outChild.x - (j - 1) * 2;
					}
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, Math.abs(j - 12));
				}
			}
		} else if (pos == 3) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				childNum = 10;
				if (i == 2) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.x = nd_outNode.getChildByName('out2').x - 107;
					} else {
						nd_outNodeChild.x = nd_outNode.getChildByName('out2').x - 86;
					}
				}
				if (i == 3) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.x = nd_outNode.getChildByName('out3').x - 107;
					} else {
						nd_outNodeChild.x = nd_outNode.getChildByName('out3').x - 86;
					}
				}
				if (i == 4) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.x = nd_outNode.getChildByName('out4').x;
					} else {
						nd_outNodeChild.x = nd_outNode.getChildByName('out4').x;
					}
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name = "pai" + Math.abs(j - (childNum + 1));
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		} else if (pos == 4) {
			childNum = 10;
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				if (i == 2) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.y = nd_outNode.getChildByName('out2').y - 91;
					} else {
						nd_outNodeChild.y = nd_outNode.getChildByName('out2').y - 72;
					}
				}
				if (i == 3) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.y = nd_outNode.getChildByName('out3').y - 91;
					} else {
						nd_outNodeChild.y = nd_outNode.getChildByName('out3').y - 72;
					}
				}
				if (i == 4) {
					// childNum=11;  //第4牌，需要11个蹲牌
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outNodeChild.y = nd_outNode.getChildByName('out4').y;
					} else {
						nd_outNodeChild.y = nd_outNode.getChildByName('out4').y;
					}
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name = "pai" + j;
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outChild.x = nd_outChild.x - (j - 1) * 3;
					}
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		}
	},
	InitNdOut: function (pos, childNum) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		this.nd_out01 = this.node.getChildByName('nd_out01');
		this.nd_out02 = this.node.getChildByName('nd_out02');
		this.nd_out03 = this.node.getChildByName('nd_out03');
		this.nd_out04 = this.node.getChildByName('nd_out04');
		let nd_outLineNum = 4;//总共4排
		let nd_outChild = false;
		let wndName = this.ComTool.StringAddNumSuffix("sp_seat", pos, 2);
		let nd_outNode = this.GetWndNode(wndName + '/nd_out');
		if (pos == 1) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				/*if(i==4 && childNum==6){
                    childNum=11;  //第4牌，需要11个蹲牌
                    if(is3DShow==1){
                        nd_outNodeChild.x=nd_outNode.getChildByName('out3').x+115;
                    }else{
                        nd_outNodeChild.x=nd_outNode.getChildByName('out3').x+97;
                    }
                }*/
				if (i == 4) {
					childNum = 9;
					nd_outNodeChild.x = nd_outNode.getChildByName('out4').x;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out01);
					nd_outChild.name = "pai" + j;
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);

				}
			}
		} else if (pos == 2) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				/*if(i==4 && childNum==6){
                    childNum=11;  //第4牌，需要11个蹲牌
                    if(is3DShow==1){
                        nd_outNodeChild.y=nd_outNode.getChildByName('out3').y+92;
                    }else{
                        nd_outNodeChild.y=nd_outNode.getChildByName('out3').y+72;
                    }
                }*/
				if (i == 4) {
					childNum = 9;
					nd_outNodeChild.y = nd_outNode.getChildByName('out4').y;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out02);
					nd_outChild.name = "pai" + j;
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outChild.x = nd_outChild.x - (j - 1) * 2;
					}
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, Math.abs(j - 12));
				}
			}
		} else if (pos == 3) {
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.x = 0;
				/*if(i==4 && childNum==6){
                    childNum=11;  //第4牌，需要11个蹲牌
                    if(is3DShow==1){
                        nd_outNodeChild.x=nd_outNode.getChildByName('out3').x-107;
                    }else{
                        nd_outNodeChild.x=nd_outNode.getChildByName('out3').x-86;
                    }
                }*/
				if (i == 4) {
					childNum == 9;
					nd_outNodeChild.x = nd_outNode.getChildByName('out4').x;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out03);
					nd_outChild.name = "pai" + Math.abs(j - (childNum + 1));
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		} else if (pos == 4) {
			nd_outNode.parent.x = -319;
			nd_outNode.parent.y = 32;
			for (let i = 1; i <= nd_outLineNum; i++) {
				let nd_outNodeChild = nd_outNode.getChildByName('out' + i);
				nd_outNodeChild.removeAllChildren();
				nd_outNodeChild.y = 0;
				/*if(i==4 && childNum==6){
                    childNum=11;  //第4牌，需要11个蹲牌
                    if(is3DShow==1){
                        nd_outNodeChild.y=nd_outNode.getChildByName('out3').y-91;
                    }else{
                        nd_outNodeChild.y=nd_outNode.getChildByName('out3').y-72;
                    }
                }*/
				if (i == 4) {
					childNum = 9;
					nd_outNodeChild.y = nd_outNode.getChildByName('out4').y;
				}
				for (let j = 1; j <= childNum; j++) {
					nd_outChild = cc.instantiate(this.nd_out04);
					nd_outChild.name = "pai" + j;
					if (is3DShow == 1 || is3DShow == 2) {
						nd_outChild.x = nd_outChild.x - (j - 1) * 3;
					}
					nd_outChild.active = 1;
					nd_outNodeChild.addChild(nd_outChild, j);
				}
			}
		}
	},
	DeleteAllNdOut: function () {
		let players = this.RoomMgr.GetEnterRoom().GetRoomProperty('posList');
		this.playersCount = players.length;
		for (let i = 0; i < players.length; i++) {
			let showpos = this.Pos2Show(i);
			let wndName = this.ComTool.StringAddNumSuffix("sp_seat", showpos, 2);
			let nd_outNode = this.GetWndNode(wndName + '/nd_out');
			for (let j = 1; j <= 4; j++) {
				nd_outNode.getChildByName('out' + j).removeAllChildren();
			}
		}
	},
	InitAllHead: function () {
		let players = this.room.GetRoomProperty('posList');
		let childs = this.headPosNode.children;
		let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		let uiPosIndex = 1;
		this.playersCount = players.length;
		for (let i = 0; i < players.length; i++) {
			let head = cc.instantiate(this.headPrefab);
			let headScript = head.getComponent(head.name);
			let point = {};
			let showPos = this.Pos2Show(i);
			this.headNode.addChild(head);
			point = {x: childs[showPos - 1].x, y: childs[showPos - 1].y};
			headScript.Init(showPos, players[i].pos, point);
		}
	},
	InitAllCards: function () {
		let players = this.room.GetRoomProperty('posList');
		let selfID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
		for (let i = 0; i < players.length; i++) {
			let showPos = this.Pos2Show(i);
			this.AddCardChildren(showPos);
			//放大宽度
			// if(showPos==1){
			//     let realWidth = cc.director.getVisibleSize().width;
			//     if(realWidth>1360){
			//         if(realWidth>1520){
			//             realWidth=1520;
			//         }
			//         let scaleX=realWidth/1360;
			//         this.cardNodes.getChildByName('card01').scaleX=scaleX;
			//     }else{
			//         this.cardNodes.getChildByName('card01').scaleX=1;
			//         this.cardNodes.getChildByName('card01').scaleY=1;
			//     }
			// }
		}
	},
	AddCardChildren: function (showpos) {
		if (showpos == 1) {
			let node = cc.instantiate(this.card01Prefab);
			let nodeScript = node.getComponent(node.name);
			this.cardNodes.getChildByName('card01').addChild(node);
			nodeScript.Init();
		} else if (showpos == 2) {
			let node2 = cc.instantiate(this.card02Prefab);
			let nodeScript2 = node2.getComponent(node2.name);
			this.cardNodes.getChildByName('card02').addChild(node2);
			nodeScript2.Init();
		} else if (showpos == 3) {
			let node3 = cc.instantiate(this.card03Prefab);
			let nodeScript3 = node3.getComponent(node3.name);
			this.cardNodes.getChildByName('card03').addChild(node3);
			nodeScript3.Init();
		} else if (showpos == 4) {
			let node4 = cc.instantiate(this.card04Prefab);
			let nodeScript4 = node4.getComponent(node4.name);
			this.cardNodes.getChildByName('card04').addChild(node4);
			nodeScript4.Init();
		}

	},
	OnDiceFinished: function (event) {
		/*let animationName = event.getCurrentTarget().name;
        if(animationName == "UIDice_PlayDice"){*/
		let room = this.RoomMgr.GetEnterRoom();
		let saiziList = room.GetRoomSet().GetRoomSetProperty("saizi");
		this.ShowSaiZi(saiziList);
		this.OnDicePlayEnd();
		//}
	},
	ShowOutCard01: function (event) {
	},
	KaiJinFinished: function (event) {
		this.kaijin1.active = false;
		this.ShowJin();
		return;
	},
	HideAllChild: function () {
		this.HideSeatCard();
	},

	HideAllLianZhuangNum: function () {
		for (let showPos = 1; showPos <= this.ShareDefine.MJRoomJoinCount; showPos++) {
			this.SetPosLianZhuangNum(showPos, "", false);
		}
	},
	SetPosLianZhuangNum: function (showPos, lianzhuang, isShow) {
		let wndName = "headNodes/headPos/pos"+showPos+"/lb_lianzhuang";
		this.SetWndProperty(wndName, "text", lianzhuang);
		this.SetWndProperty(wndName, "active", isShow);
	},
	//隐藏桌面牌蹲
	HideSeatCard: function () {
		for (let posID = 1; posID <= this.ShareDefine.MJRoomJoinCount; posID++) {
			let wndName = this.ComTool.StringAddNumSuffix("sp_seat", posID, 2);
			this.SetWndProperty(wndName, "active", 0);
		}
	},
	EVENT_SetPosCard: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		let clientSetPos = room.GetClientPlayerSetPos();
		if (!clientSetPos) {
			this.ErrLog("InitDealCard GetClientPlayerSetPos fail");
			return
		}
		let UICard01 = this.GetCardComponentByPos(1);
		UICard01.ShowAllPlayerCard(room);
		UICard01.ShowHandCard(room);
		UICard01.ShowDownCard(room);
	},
	CloseSpTiShi: function () {
		let UICard01 = this.GetCardComponentByPos(1);
		UICard01.CloseSpTiShi();
	},
	GetCardComponentByPos: function (showpos) {
		let room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = room.GetRoomPosMgr();
		let playerCount = RoomPosMgr.GetRoomPlayerCount();
		let index = showpos;
		let cardNode = this.cardNodes.getChildByName('card0' + index.toString()).children;
		return cardNode[0].getComponent(cardNode[0].name);

	},
	//隐藏玩家准备按钮
	HidePlayerReady: function () {
		this.btn_ready.active = 0;
		this.btn_weixin.active = 0;
		this.invitationNode.active = false;
		this.btn_roomkey.active = 0;
	},

	PlayEffect: function (effectName) {
		this.AddWndEffect("ZiMoEffect", effectName, effectName, 1)
	},
	GetHeadByPos: function (showpos) {
		let is3DShow = this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName + "_is3DShow");
		if (is3DShow == 1) {
			if (showpos == 1) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead1').getComponent(app.subGameName + '_UIPublicHead');
			} else if (showpos == 2) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead2').getComponent(app.subGameName + '_UIPublicHead');
			} else if (showpos == 3) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead3').getComponent(app.subGameName + '_UIPublicHead');
			} else if (showpos == 4) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead4').getComponent(app.subGameName + '_UIPublicHead');
			}
		} else if (is3DShow == 2) {
			if (showpos == 1) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead1').getComponent(app.subGameName + '_UIWBHead');
			} else if (showpos == 2) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead2').getComponent(app.subGameName + '_UIWBHead');
			} else if (showpos == 3) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead3').getComponent(app.subGameName + '_UIWBHead');
			} else if (showpos == 4) {
				return this.headNode.getChildByName(app.subGameName + '_UIPublicHead4').getComponent(app.subGameName + '_UIWBHead');
			}
		}

	},
	//-----------------回调函数------------------------

	Event_ChatMessage: function (event) {
		let argDict = event;
		let senderPid = argDict["senderPid"];
		let quickID = parseInt(argDict["quickID"]);
		let content = argDict["content"];
		let room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = room.GetRoomPosMgr();
		let PlayerCount = RoomPosMgr.GetRoomPlayerCount();
		let initiatorPos = -1;
		for (let i = 0; i < PlayerCount; i++) {
			let player = RoomPosMgr.GetPlayerInfoByPos(i);
			let pid = player["pid"];
			if (senderPid == pid) {
				initiatorPos = i;
			}
		}
		// let headNode = this.GetHeadByPos(this.Pos2Show(initiatorPos));
		let headScript = this.GetHeadByPos(this.Pos2Show(initiatorPos));
		let playerSex = this.InitHeroSex(initiatorPos, false);
		let soundName = "";
		let path = "";
		if (quickID < 101) {
			switch (quickID) {
				case 1:
					content = app.i18n.t("UIVoiceStringBieChao");
					soundName = [playerSex, "_FastVoice_1"].join("");
					break;
				case 2:
					content = app.i18n.t("UIVoiceStringBieZou");
					soundName = [playerSex, "_FastVoice_2"].join("");
					break;
				case 3:
					content = app.i18n.t("UIVoiceStringZhaoHu");
					soundName = [playerSex, "_FastVoice_3"].join("");
					break;
				case 4:
					content = app.i18n.t("UIVoiceStringZanLi");
					soundName = [playerSex, "_FastVoice_4"].join("");
					break;
				case 5:
					content = app.i18n.t("UIVoiceStringZanShang");
					soundName = [playerSex, "_FastVoice_5"].join("");
					break;
				case 6:
					content = app.i18n.t("UIVoiceStringCuiCu");
					soundName = [playerSex, "_FastVoice_6"].join("");
					break;
				case 7:
					content = app.i18n.t("UIVoiceStringKuaJiang");
					soundName = [playerSex, "_FastVoice_7"].join("");
					break;
				case 8:
					content = app.i18n.t("UIVoiceStringDaShang");
					soundName = [playerSex, "_FastVoice_8"].join("");
					break;
				case 9:
					content = app.i18n.t("UIVoiceStringLiKai");
					soundName = [playerSex, "_FastVoice_9"].join("");
					break;
				case 10:
					content = app.i18n.t("UIVoiceStringYanChi");
					soundName = [playerSex, "_FastVoice_10"].join("");
					break;
				case 31:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"31");
					soundName = app.subGameName+"_FastVoice_31";
					break;
				case 32:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"32");
					soundName = app.subGameName+"_FastVoice_32";
					break;
				case 33:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"33");
					soundName = app.subGameName+"_FastVoice_33";
					break;
				case 34:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"34");
					soundName = app.subGameName+"_FastVoice_34";
					break;
				case 35:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"35");
					soundName = app.subGameName+"_FastVoice_35";
					break;
				case 36:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"36");
					soundName = app.subGameName+"_FastVoice_36";
					break;
				case 37:
					content = app.i18n.t("UIVoiceString"+app.subGameName.toUpperCase()+"37");
					soundName = app.subGameName+"_FastVoice_37";
					break;
				default:
					this.ErrLog("Event_chatmessage not find(%s)", quickID);
			}
		}
		else {
			let face = this.SysDataManager.GetTableDict("Face");
			switch (quickID) {
				case 101:
					path = "face1Action";
					break;
				case 102:
					path = "face2Action";
					break;
				case 103:
					path = "face3Action";
					break;
				case 104:
					path = "face4Action";
					break;
				case 105:
					path = "face5Action";
					break;
				case 106:
					path = "face6Action";
					break;
				case 107:
					path = "face7Action";
					break;
				case 108:
					path = "face8Action";
					break;
				case 109:
					path = "face9Action";
					break;
				case 110:
					path = "face10Action";
					break;
				case 111:
					path = "face11Action";
					break;
				case 112:
					path = "face12Action";
					break;
				case 113:
					path = "face13Action";
					break;
				case 114:
					path = "face14Action";
					break;
				case 115:
					path = "face15Action";
					break;
				default:
					this.ErrLog("Event_chatmessage not find(%s)", quickID);
			}
		}
		if (soundName != "") {
			this.SoundManager.PlaySound(soundName);
		}
		//敏感词汇替换
		content = this.UtilsWord.CheckContentDirty(content);

		if (headScript) {
			if (content == "")
				headScript.ShowFaceContent(path);
			else
				headScript.ShowChatContent(content);
		}

		this.Log("Event_chatmessage:", event);
	},
	//删除打出的卡牌
	Event_DeleteOutCard: function (event) {
		let argDict = event;
		this.ShowPosOutCard(Math.floor(argDict["pos"]));
	},
	//房间解散
	Event_DissolveRoom: function (event) {

		let argDict = event;
		let ownnerForce = argDict["ownnerForce"];

		//未开启房间游戏时才会触发
		if (ownnerForce) {
			let room = this.RoomMgr.GetEnterRoom();
			//如果是房主主动接撒直接退出
			if (room && room.IsClientIsOwner()) {
				this.Client.ExitGame();
			}
			else {
				this.SetWaitForConfirm('OwnnerForceRoom', this.ShareDefine.ConfirmOK);
			}
		}
		else if (event.dissolveNoticeType == 1) {
			this.SetWaitForConfirm('SportsPointDissolveRoom', this.ShareDefine.ConfirmOK, [event.msg]);
		} else if (event.dissolveNoticeType == 3) {
			this.SetWaitForConfirm('MSG_BeDissolve', this.ShareDefine.ConfirmOK, [event.msg]);
		}
		else {
			let state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
			let setState = this.RoomSet.GetRoomSetProperty("state");
			//如果没有打完一局不会下发roomend,直接显示2次弹框
			if (state != this.ShareDefine.RoomState_End) {
				this.SetWaitForConfirm('DissolveRoom', this.ShareDefine.ConfirmOK);
				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
			}
			//如果有roomend数据显示 结果界面
			else {

				this.FormManager.CloseForm(app.subGameName + "_UIMessage02");
				if (setState == this.ShareDefine.SetState_Init) {
					this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJResultDetail", false, false, true);
				}
			}

		}
	},

	//收到解散房间
	Event_StartVoteDissolve: function (event) {
		this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
	},

	//收到解散房间
	Event_ChangePlayerNum: function (event) {
		this.FormManager.ShowForm(app.subGameName + "_UIMessage03");
	},

	Event_PosReadyChg: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		this.ShowPlayerReady(room);
		let serverPack = event;
		app[app.subGameName + "Client"].OnEvent("Head_PosReadyChg", serverPack);
	},

	PosEffect: function (showpos, effectName) {
		this.AddWndEffect("PosEffect/Effects" + showpos, effectName, effectName, 1);

		this.scheduleOnce(function () {
			this.node.getChildByName('PosEffect').getChildByName("Effects" + showpos).removeAllChildren();
		}, 2);

	},

	//特效播放结束
	OnEffectEnd: function (wndPath, effectName) {
		//开金动画结束
		if (effectName == "KaiJin") {
			this.KaiJinFinished();
			return;
		}
		if (effectName == 'liuju') {
			this.ShowWinLostForm();
			return;
		}
		let roomSet = this.RoomMgr.GetEnterRoom().GetRoomSet();
		let setEnd = roomSet.GetRoomSetProperty("setEnd");
		let posResultList = setEnd["posResultList"];
		let posCount = posResultList.length;
		let huType = "";
		let playerPos = "";
		let huTypeArray = new Array();
		for (let index = 0; index < posCount; index++) {
			let posInfo = posResultList[index];
			let posHuType = posInfo["huType"];
			if (posResultList[index]['endPoint'] && posResultList[index]['endPoint']["huTypeMap"]) {
				let keys = Object.keys(posResultList[index]['endPoint']["huTypeMap"])
				if (keys.indexOf("DanYou") >= 0) {
					posHuType = this.ShareDefine.HuType_DanYou
				}
				else if (keys.indexOf("ShuangYou") >= 0) {
					posHuType = this.ShareDefine.HuType_ShuangYou
				}
				else if (keys.indexOf("SanYou") >= 0) {
					posHuType = this.ShareDefine.HuType_SanYou
				}
			}
			let pos = posInfo["pos"];
			if (posHuType != this.ShareDefine.HuType_NotHu) {
				playerPos = pos;
				huType = posHuType;
				huTypeArray[pos] = huType;
			}
		}
		if (this.EffectActionState == this.EffectActionLong) {
			for (let i = 0; i < 4; i++) {
				if (huTypeArray[i] > 0) {
					let showpos = this.Pos2Show(i);
					let huTypeId = huTypeArray[i];
					if (huTypeId == this.ShareDefine.HuType_ZiMo) {
						this.PosEffect(showpos, "Zimo");
					} else if (huTypeId == this.ShareDefine.HuType_QGH) {
						this.PosEffect(showpos, "QiangGangHu");
					} else if (huTypeId == this.ShareDefine.HuType_SanJinDao) {
						this.PosEffect(showpos, "SanJinDao");
					} else if (huTypeId == this.ShareDefine.HuType_SiJinDao || huTypeId == this.ShareDefine.HuType_FHZ) {
						this.PosEffect(showpos, "SiJinDao");
					} else if (huTypeId == this.ShareDefine.HuType_WuJinDao) {
						this.PosEffect(showpos, "WuJinDao");
					} else if (huTypeId == this.ShareDefine.HuType_LiuJinDao) {
						this.PosEffect(showpos, "LiuJinDao");
					} else if (huTypeId == this.ShareDefine.HuType_DanYou) {
						this.PosEffect(showpos, "DanYou");
					} else if (huTypeId == this.ShareDefine.HuType_ShuangYou) {
						this.PosEffect(showpos, "ShuangYou");
					} else if (huTypeId == this.ShareDefine.HuType_SanYou) {
						this.PosEffect(showpos, "SanYou");
					} else if (huTypeId == this.ShareDefine.HuType_QiangJin) {
						this.PosEffect(showpos, "QiangJin");
					} else if (huTypeId == this.ShareDefine.HuType_ShiSanYao) {
						this.PosEffect(showpos, "ShiSanYao");
					} else if (huTypeId == this.ShareDefine.HuType_PingHu) {
						this.PosEffect(showpos, "hu");
					} else if (huTypeId == this.ShareDefine.HuType_TianHu) {
						this.PosEffect(showpos, "tianhu");
					} else if (huTypeId == this.ShareDefine.HuType_DDHu) {
						this.PosEffect(showpos, "duiduihu");
					} else if (huTypeId == this.ShareDefine.HuType_JinQue) {
						this.PosEffect(showpos, "jinque");
					} else if (huTypeId == this.ShareDefine.HuType_JinLong) {
						this.PosEffect(showpos, "jinlong");
					} else if (huTypeId == this.ShareDefine.HuType_YiZhangHua) {
						this.PosEffect(showpos, "yizhanghua");
					} else if (huTypeId == this.ShareDefine.HuType_WHuaWGang) {
						this.PosEffect(showpos, "wuhuawugang");
					} else if (huTypeId == this.ShareDefine.HuType_HunYiSe) {
						this.PosEffect(showpos, "hunyise");
					} else if (huTypeId == this.ShareDefine.HuType_QingYiSe) {
						this.PosEffect(showpos, "qingyise");
					} else if (huTypeId == this.ShareDefine.HuType_DiHu) {
						this.PosEffect(showpos, "dihu");
					} else if (huTypeId == this.ShareDefine.HuType_JinGang) {
						this.PosEffect(showpos, "jingang");
					} else if (huTypeId == this.ShareDefine.HuType_XiaoZhaDan) {
						this.PosEffect(showpos, "xiaozhadan");
					} else if (huTypeId == this.ShareDefine.HuType_DaZhaDan) {
						this.PosEffect(showpos, "dazhadan");
					} else if (huTypeId == this.ShareDefine.HuType_ChaoJiZhaDan) {
						this.PosEffect(showpos, "chaojizhadan");
					} else if (huTypeId == this.ShareDefine.HuType_DaDuiPeng) {
						this.PosEffect(showpos, "daduipeng");
					} else if (huTypeId == this.ShareDefine.HuType_DaSanYuan) {
						this.PosEffect(showpos, "dasanyuan");
					} else if (huTypeId == this.ShareDefine.HuType_SanJinYou) {
						this.PosEffect(showpos, "sanjinyou");
					} else if (huTypeId == this.ShareDefine.HuType_DanDiao) {
						this.PosEffect(showpos, "hu");
					} else if (huTypeId == this.ShareDefine.HuType_JieDao || huTypeId == this.ShareDefine.HuType_MenZi || huTypeId == this.ShareDefine.HuType_PiHu || huTypeId == this.ShareDefine.HuType_LuanFeng || huTypeId == this.ShareDefine.HuType_CS_Tou || huTypeId == this.ShareDefine.HuType_SC_Ke || huTypeId == this.ShareDefine.HuType_SSBK || huTypeId == this.ShareDefine.HuType_SSBK_Qing) {
						this.PosEffect(showpos, "hu");
					} else if (huTypeId == this.ShareDefine.HuType_ZhuoPao || huTypeId == this.ShareDefine.HuType_GSKH || huTypeId == this.ShareDefine.HuType_BuQiuR || huTypeId == this.ShareDefine.HuType_KouTing || huTypeId == this.ShareDefine.HuType_HaiDiLao || huTypeId == this.ShareDefine.HuType_QingLong || huTypeId == this.ShareDefine.HuType_SanAnKe) {
						this.PosEffect(showpos, "hu");
					} else if (huTypeId == this.ShareDefine.HuType_JiePao) {
						this.PosEffect(showpos, "hu");
					}
				}
			}
			this.EffectActionState = this.EffectActionZiMo;
			this.scheduleOnce(function () {
				if (this.EffectActionState == this.EffectActionZiMo) {
					this.ShowWinLostForm();
					this.EffectActionState = this.NoAction;
				}
			}, 2);
		}
		else if (this.EffectActionState == this.EffectActionZiMo) {
			this.ShowWinLostForm();
			//this.FormManager.ShowForm("game/base/ui/majiang/"+app.subGameName+"_UIMJWinLost",this.setEnd);
			this.EffectActionState = this.NoAction;
		}
	},
	AllPosOpenCardEffect2: function () {
		let room = this.RoomMgr.GetEnterRoom();
		for (let posID = 0; posID < this.playersCount; posID++) {
			let formObj = this.GetCardComponentByPos(this.Pos2Show(posID));
			;
			if (!formObj) {
				this.ErrLog("ShowAllPlayerShouCard not find:%s", formName);
				continue
			}
			formObj.ShowAllPlayerCard(room);
		}
	},
	//继续游戏
	Event_PosContinueGame: function (event) {
		let serverPack = event;
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosContinueGame not enter room");
			return
		}
		let RoomPosMgr = room.GetRoomPosMgr();
		let clientPos = RoomPosMgr.GetClientPos();
		if (serverPack["pos"] != clientPos) {
			let clientPlayerInfo = RoomPosMgr.GetPlayerInfoByPos(clientPos);
			//如果玩家已经继续了,需要渲染其他人的状态
			if (!clientPlayerInfo["gameReady"]) {
				return
			}
		}
		else {
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWinLost");
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJResultDetail");
		}
		this.OnRoomPlaying(room);
		this.ShowPlayerReady(room);
		for (let posID = 0; posID < this.playersCount; posID++) {
			let formObj = this.GetCardComponentByPos(this.Pos2Show(posID));
			;
			if (!formObj) {
				this.ErrLog("Event_PosContinueGame not find:%s", formName);
				continue
			}
			formObj.OnSetInit(room)
		}
		app[app.subGameName + "Client"].OnEvent("Head_PosReadyChg", serverPack);
	},

	OnSetStart: function (roomSetId = 0) {
		let room = this.RoomMgr.GetEnterRoom();
		this.ShowJin();
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJXiPai");
		let roomSet = room.GetRoomSet();

		let dPos = roomSet.GetRoomSetProperty("dPos");
		//let DirectionDictKeys = Object.keys(this.DirectionDict);

		let roomPosMgr = room.GetRoomPosMgr();

		let ClientPos = roomPosMgr.GetClientPos();
		let DownPos = roomPosMgr.GetClientDownPos();
		let FacePos = roomPosMgr.GetClientFacePos();
		let UpPos = roomPosMgr.GetClientUpPos();

		/*if(dPos==ClientPos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[0]]);
        }else if(dPos==DownPos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[1]]);
        }else if(dPos==FacePos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[2]]);
        }else if(dPos==UpPos){
            this.middleAnimation.play(this.DirectionDict[DirectionDictKeys[3]]);
        }
        app[app.subGameName+"_SoundManager"]().PlaySound("dasaizi");*/

		this.StopPlayPosActionHelp();
		this.ShowAllOutCard(room);
		this.OnDiceFinished();
		app[app.subGameName + "Client"].OnEvent("Head_UpdateBacker", {});
		//播放音乐
		let SceneManager = app[app.subGameName + "_SceneManager"]();
		SceneManager.PlayMusic("RoomStart");
		this.ShowLianZhuangNum(room);
	},
	ShowLianZhuangNum: function (room) {
		let roomSet = room.GetRoomSet();
		let dPos = roomSet.GetRoomSetProperty("dPos");
		let setPosList = roomSet.GetRoomSetProperty("setPosList");
		this.HideAllLianZhuangNum()
		for (let i = 0; i < setPosList.length; i++) {
			let posInfo = setPosList[i];
			let posID = posInfo["posID"];
			let lianZhuangNum = "连庄:"+ posInfo["lianZhuangNum"];
			let showPos = this.Pos2Show(posID);
			// if (dPos == posID) {
			this.SetPosLianZhuangNum(showPos, lianZhuangNum, true);
			// } else {
			// 	this.SetPosLianZhuangNum(showPos, "", false);
			// }
		}
	},
	IsShowVoice: function () {
		let room = this.RoomMgr.GetEnterRoom();
		let gaoji = room.GetRoomConfigByProperty('gaoji');
		if (gaoji.length > 0) {
			if (gaoji.indexOf(5) > -1) {
				return false;
			}
		}
		return true;
	},
	//一局开始
	Event_SetStart: function (event) {
		this.invitationNode.active = false;
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWinLost");
		this.HidePlayerReady();
		this.OnSetStart();
	},
	//局结束,光泽麻将扎码需要重写
	Event_SetEnd: function (event) {
		this.unschedule(this.ShowTime);
		this.time.string = '';
		this.StopPlayPosActionHelp();
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseChi");
		let room = this.RoomMgr.GetEnterRoom();
		room.GetRoomProperty('set').seePosList = [];
		room.GetRoomProperty('set').guangyouPos = -1;
		let huPlayerDict = {};
		let argDict = event;
		let setEnd = argDict["setEnd"];
		this.setEnd = setEnd;
		let posResultList = setEnd["posResultList"];
		let huTypeArray = new Array();
		let huSexArray = new Array();
		let playerSex = false;
		let huType = '';
		for (let i = 0; i < posResultList.length; i++) {
			if (posResultList[i].huType != this.ShareDefine.HuType_NotHu) {
				let key = posResultList[i].pos;
				let pos = posResultList[i]["pos"];
				huType = posResultList[i].huType;
				huPlayerDict[key] = huType;
				playerSex = this.InitHeroSex(pos);
				let index = i
				if (posResultList[index]['endPoint'] && posResultList[index]['endPoint']["huTypeMap"]) {
					let keys = Object.keys(posResultList[index]['endPoint']["huTypeMap"])
					if (keys.indexOf("DanYou") >= 0) {
						huType = this.ShareDefine.HuType_DanYou
					}
					else if (keys.indexOf("ShuangYou") >= 0) {
						huType = this.ShareDefine.HuType_ShuangYou
					}
					else if (keys.indexOf("SanYou") >= 0) {
						huType = this.ShareDefine.HuType_SanYou
					}
				}
				huTypeArray[pos] = huType;
				huSexArray[pos] = playerSex;
			}
		}
		let posIDList = Object.keys(huPlayerDict);
		let huCount = posIDList.length;
		if (huCount) {
			for (let i = 0; i < 4; i++) {
				if (huTypeArray[i] > 0) {
					let soundName = "";
					let huTypeId = huTypeArray[i];
					if (huTypeId == this.ShareDefine.HuType_LiuJinDao) {
						soundName = [huSexArray[i], "_liujindao"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_QiangJin) {
						soundName = [huSexArray[i], "_qiangjin"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_SanJinDao) {
						soundName = [huSexArray[i], "_sanjindao"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_SanYou) {
						soundName = [huSexArray[i], "_sanyou"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_ShuangYou) {
						soundName = [huSexArray[i], "_shuangyou"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_SiJinDao) {
						soundName = [huSexArray[i], "_sijindao"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_WuJinDao) {
						soundName = [huSexArray[i], "_wujindao"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_DanYou) {
						soundName = [huSexArray[i], "_youjin"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_ShiSanYao) {
						soundName = [huSexArray[i], "_shisanyao"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_DDHu) {
						soundName = [huSexArray[i], "_qidui"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_QGH) {
						soundName = [huSexArray[i], "_qiangganghu"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_ZiMo) {
						soundName = [huSexArray[i], "_zimo"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_PingHu) {
						soundName = [huSexArray[i], "_pinghu"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_JinQue) {
						soundName = [huSexArray[i], "_jinque"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_JinLong) {
						soundName = [huSexArray[i], "_jinlong"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_YiZhangHua) {
						soundName = [huSexArray[i], "_yizhanghua"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_WHuaWGang) {
						soundName = [huSexArray[i], "_wuhuawugang"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_HunYiSe) {
						soundName = [huSexArray[i], "_hunyise"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_QingYiSe) {
						soundName = [huSexArray[i], "_qingyise"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_DiHu) {
						soundName = [huSexArray[i], "_dihu"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_DanDiao) {
						soundName = [huSexArray[i], "_pinghu"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_JieDao ||
						huTypeId == this.ShareDefine.HuType_MenZi ||
						huTypeId == this.ShareDefine.HuType_PiHu ||
						huTypeId == this.ShareDefine.HuType_LuanFeng ||
						huTypeId == this.ShareDefine.HuType_CS_Tou ||
						huTypeId == this.ShareDefine.HuType_SC_Ke ||
						huTypeId == this.ShareDefine.HuType_SSBK ||
						huTypeId == this.ShareDefine.HuType_SSBK_Qing ||
						huTypeId == this.ShareDefine.HuType_JiePao) {
						soundName = [playerSex, "_pinghu"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_BuQiuR ||
						huTypeId == this.ShareDefine.HuType_KouTing ||
						huTypeId == this.ShareDefine.HuType_HaiDiLao ||
						huTypeId == this.ShareDefine.HuType_QingLong ||
						huTypeId == this.ShareDefine.HuType_SanAnKe) {
						soundName = [playerSex, "_pinghu"].join("");
					} else if (huTypeId == this.ShareDefine.HuType_ZiMo) {
						soundName = [playerSex, "_pinghu"].join("");
					}
					if (soundName) {
						this.SoundManager.PlaySound(soundName);
					}
				}
			}
			this.EffectActionState = this.EffectActionLong;
			this.OnEffectEnd(false, false);
		}
		else {
			//播放流局动画
			this.PlayEffect('liuju');
		}
		for (let posID = 0; posID < this.playersCount; posID++) {
			let ShowPos = this.Pos2Show(posID);
			let formObj = this.GetCardComponentByPos(ShowPos);
			if (!formObj) {
				this.ErrLog("Event_SetEnd not find:%s", formName);
				continue
			}
			if (ShowPos == 1) {
				formObj.OnClosePosActionHelp();
			}
			formObj.OnSetEnd(this.setEnd);
			let headFormObj = this.GetHeadByPos(ShowPos);
			headFormObj.UpDateLabJiFen();
			headFormObj.UpDateLabSportsPoint();
			headFormObj.OnClosePosActionHelp();
		}
		this.ActionFinishShowAllOutCard();
	},
	ShowWinLostForm: function () {
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
		this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWinLost", this.setEnd);
	},
	//位置更新
	Event_PosUpdate: function (event) {
		let serverPack = event;
		app[app.subGameName + "Client"].OnEvent('Head_PosUpdate', serverPack);
		this.RefreshRoomShow();
	},
	Event_PosReady: function (event) {
		let serverPack = event;
		app[app.subGameName + "Client"].OnEvent('Head_PosReady', serverPack);
	},
	RefreshRoomShow: function () {
		let room = this.RoomMgr.GetEnterRoom();
		this.ShowPlayerReady(room);
	},
	//位置离开
	Event_PosLeave: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosLeave not enter room");
			return
		}
		let serverPack = event;
		let pos = serverPack["pos"];
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		//如果是客户端玩家并且是被T了
		if (serverPack["beKick"] && clientPos == pos) {
			if (serverPack["kickOutTYpe"] == 2) {
				this.SetWaitForConfirm('MSG_BeKick', this.ShareDefine.ConfirmOK, [serverPack.msg]);
			} else {
				this.SetWaitForConfirm('UIPlay_BeKick', this.ShareDefine.ConfirmOK);
			}
		}
		this.ShowPlayerReady(room);
		app[app.subGameName + "Client"].OnEvent('Head_PosLeave', serverPack);
	},
	click_btn_kehu: function () {
		if (this.FormManager.IsFormShow("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai")) {
			this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai");
			return;
		}
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		let huCard = setPos.GetSetPosProperty("huCard");
		if (huCard.length) {
			let roomPosMgr = room.GetRoomPosMgr();
			let clientPos = roomPosMgr.GetClientPos();
			let huCardTypeInfo = room.GetRoomSet().GetHuCardTypeInfo(clientPos);
			let cardTypeList = Object.keys(huCardTypeInfo);
			cardTypeList.SortList();
			let LeftCardType = room.GetRoomSet().GetLeftCardTypeInfo(clientPos);
			if (cardTypeList.length > 0) {
				this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai", cardTypeList, LeftCardType);
			}
		}
	},
	//round开始
	Event_StartRound: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_StartRound not enter room");
			return
		}
		this.RedisplayPosActionHelp(room);
		
		let xianShi = room.GetRoomConfigByProperty('xianShi');
		if (xianShi == 1) {
			//需要显示3分钟出牌
			this.unschedule(this.ShowTime);
			this.nd_dice.active = true;
			this.time.string = '';
			if (event.room_SetWait.waitID == 1) {
				this.ShowTimeOut = 183;
			} else {
				this.ShowTimeOut = 181;
			}
			this.ShowTime();
			this.schedule(this.ShowTime, 1);
		} else if (xianShi == 2) {
			//需要显示5分钟出牌
			this.unschedule(this.ShowTime);
			this.nd_dice.active = true;
			this.time.string = '';
			this.ShowTimeOut = 301;
			this.ShowTime();
			this.schedule(this.ShowTime, 1);
		} 
		else if (xianShi == 3) {
			//需要显示60秒出牌
			this.unschedule(this.ShowTime);
			this.nd_dice.active = true;
			this.time.string = '';
			this.ShowTimeOut = 61;
			this.ShowTime();
			this.schedule(this.ShowTime, 1);
		} else if (xianShi == 4) {
			//需要显示30秒出牌
			this.unschedule(this.ShowTime);
			this.nd_dice.active = true;
			this.time.string = '';
			this.ShowTimeOut = 31;
			this.ShowTime();
			this.schedule(this.ShowTime, 1);
		}
		else if (xianShi == 5) {
			//需要显示15秒出牌
			this.unschedule(this.ShowTime);
			this.nd_dice.active = true;
			this.time.string = '';
			this.ShowTimeOut = 16;
			this.ShowTime();
			this.schedule(this.ShowTime, 1);
		}
		else {
			this.time.string = '';
		}
	},
	ShowTime: function () {
		this.ShowTimeOut = this.ShowTimeOut - 1;
		if (this.ShowTimeOut > -1) {
			this.nd_dice.active = false;
			this.time.string = this.ShowTimeOut;
		} else {
			this.nd_dice.active = true;
			this.time.string = '';
		}

	},
	//抢金三金
	Event_SQOpCard: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_SQOpCard not enter room");
			return
		}
		this.RedisplayPosActionHelpShort(room);
	},
	ShowKaiJinSprite: function (jin, btnNode) {
		let cardType = Math.floor(jin / 100);
		let imageName = ["CardShow", cardType].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if (imageInfo) {
			let imagePath = imageInfo["FilePath"];
			let that = this;
			app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function (spriteFrame) {
					if (!spriteFrame) {
						that.ErrLog("ShowKaiJinSprite(%s) load spriteFrame fail", imagePath);
						return;
					}
					btnNode.color = cc.color(255, 255, 0);
					let wndSprite = btnNode.getComponent(cc.Sprite);
					wndSprite.spriteFrame = spriteFrame;
				})
				.catch(function (error) {
					that.ErrLog("ShowKaiJinSprite(%s) error:%s", imagePath, error.stack);
				})
		}
		else {
			this.ErrLog('failed load imageName%s', imageName, cardType);
			return;
		}
	},
	RedisplayPosActionHelpShort: function (room) {
		let setRound = room.GetRoomSet().GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		if (!opPosList) {
			this.ErrLog("not opPosList setRound:", setRound)
			return;
		}
		let UICard01 = this.GetCardComponentByPos(1);
		UICard01.OnShowPosActionHelp();
		return;
	},
	RedisplayPosActionHelp: function (room) {
		let setRound = room.GetRoomSet().GetRoomSetProperty("setRound");
		let opPosList = setRound["opPosList"];
		if (!opPosList) {
			this.ErrLog("not opPosList setRound:", setRound)
			return;
		}
		let count = opPosList.length;
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let clientDownPos = room.GetRoomPosMgr().GetClientDownPos();
		let clientFacePos = room.GetRoomPosMgr().GetClientFacePos();
		let clientUpPos = room.GetRoomPosMgr().GetClientUpPos();

		let UICard01 = this.GetCardComponentByPos(1);
		let UIHead01 = this.GetHeadByPos(1);

		let UIHead02 = false;
		let UIHead03 = false;
		let UIHead04 = false;

		for (let posID = 0; posID < this.playersCount; posID++) {
			let showpos = this.Pos2Show(posID);
			if (showpos == 1) {
				continue;
			}
			let headObj = this.GetHeadByPos(showpos);
			if (showpos == 2) {
				UIHead02 = headObj;
			} else if (showpos == 3) {
				UIHead03 = headObj;
			} else if (showpos == 4) {
				UIHead04 = headObj;
			}
		}

		let isClientAction = false;
		let isClientDownAction = false;
		let isClientFaceAction = false;
		let isClientUpAction = false;
		//可能有多个玩家等待执行,需要遍历所有需要执行动作的玩家列表
		for (let index = 0; index < count; index++) {
			let posActionInfo = opPosList[index];
			let actionPos = posActionInfo["waitOpPos"];
			//如果找到客户端玩家,则执行出牌动作提示
			if (actionPos == clientPos) {
				let showHelpWndNameList = UICard01.OnShowPosActionHelp();
				//如果可以过的不提示进度条
				if (!showHelpWndNameList.InArray("btn_next")) {
					UIHead01.OnShowPosActionHelp();
					this.seat01.play("UIPlay_MiddleSeat");
					//如果亮灯，说明轮到有人要出牌了，出牌动画结束
					if (this.MoveNode) {
						var seq = cc.sequence(cc.spawn(cc.moveTo(0.15, cc.v2(this.shownodePos.x, this.shownodePos.y)),
							cc.scaleTo(0.15, 0.3
							)), cc.callFunc(this.ActionFinishShowAllOutCard, this));
						this.scheduleOnce(function () {
							this.MoveNode.runAction(seq)
						}, 0.2);
					}
				}
				isClientAction = true;
				break
			}
			else if (actionPos == clientDownPos) {
				UIHead02.OnShowPosActionHelp();
				this.seat02.play("UIPlay_MiddleSeat");
				isClientDownAction = true;
				//如果亮灯，说明轮到有人要出牌了，出牌动画结束
				if (this.MoveNode) {
					var seq = cc.sequence(cc.spawn(cc.moveTo(0.15, cc.v2(this.shownodePos.x, this.shownodePos.y)),
						cc.scaleTo(0.15, 0.3
						)), cc.callFunc(this.ActionFinishShowAllOutCard, this));
					this.scheduleOnce(function () {
						this.MoveNode.runAction(seq)
					}, 0.2);
				}
				break
			}
			else if (actionPos == clientFacePos) {
				UIHead03.OnShowPosActionHelp();
				this.seat03.play("UIPlay_MiddleSeat");
				isClientFaceAction = true;
				//如果亮灯，说明轮到有人要出牌了，出牌动画结束
				if (this.MoveNode) {
					var seq = cc.sequence(cc.spawn(cc.moveTo(0.15, cc.v2(this.shownodePos.x, this.shownodePos.y)),
						cc.scaleTo(0.15, 0.3
						)), cc.callFunc(this.ActionFinishShowAllOutCard, this));
					this.scheduleOnce(function () {
						this.MoveNode.runAction(seq)
					}, 0.2);
				}
				break
			}
			else if (actionPos == clientUpPos) {
				UIHead04.OnShowPosActionHelp();
				this.seat04.play("UIPlay_MiddleSeat");
				isClientUpAction = true;
				//如果亮灯，说明轮到有人要出牌了，出牌动画结束
				if (this.MoveNode) {
					var seq = cc.sequence(cc.spawn(cc.moveTo(0.15, cc.v2(this.shownodePos.x, this.shownodePos.y)),
						cc.scaleTo(0.15, 0.3
						)), cc.callFunc(this.ActionFinishShowAllOutCard, this));
					this.scheduleOnce(function () {
						this.MoveNode.runAction(seq)
					}, 0.2);
				}
				break
			}
		}

		//如果客户端玩家不是可执行的人,则关闭出牌动作提示

		if (!isClientAction && UICard01 && UIHead01) {
			UICard01.OnClosePosActionHelp();
			UIHead01.OnClosePosActionHelp();
		}
		if (!isClientDownAction && UIHead02) {
			UIHead02.OnClosePosActionHelp();
		}
		if (!isClientFaceAction && UIHead03) {
			UIHead03.OnClosePosActionHelp();
		}
		if (!isClientUpAction && UIHead04) {
			UIHead04.OnClosePosActionHelp();
		}
	},
	Event_ClosePosActionHelp: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		let setPos = room.GetClientPlayerSetPos();
		this.ClosePosActionHelp(setPos, room, false);
	},
	//预先打牌
	Pre_OutCard: function (cardID) {
		this.SoundManager.PlaySound("dapai");
		let room = this.RoomMgr.GetEnterRoom();
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		this.RoomSet.OnAddOutCard(clientPos, cardID);
		//用户手牌刷新预处理
		this.RoomSet.PreSetShouCard(clientPos, cardID);
		this.RoomSet.SetRoomSetProperty('waitReciveCard', cardID);
		this.ClosePosActionHelp(clientPos, room, false);
		// this.ShowAllOutCard();//本家出牌显示出来
		this.ShowPaiAction(clientPos);
		let playerSex = this.InitHeroSex(clientPos);
		let soundName = '';
		let jin1 = this.RoomSet.get_jin1();
		soundName = [playerSex, "_", parseInt(cardID / 100)].join("");
		this.SoundManager.PlaySound(soundName);
		this.GetCardComponentByPos(this.Pos2Show(clientPos)).OnPosActionEnd();
	},
	Event_PosOpCardEX: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosOpCard not enter room");
			return
		}
		let argDict = event;
		//执行动作的位置
		let actionPos = argDict["pos"];
		let OpType = argDict["opType"];
		let UICard = this.GetCardComponentByPos(this.Pos2Show(actionPos));
		UICard.OnPosActionEnd();
	},
	//位置动作结束
	Event_PosOpCard: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosOpCard not enter room");
			return
		}
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJHuPai");
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWBHuPai");
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIChooseChi");
		this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIWBChooseChi");
		let argDict = event;
		//执行动作的位置
		let actionPos = argDict["pos"];
		let OpType = argDict["opType"];
		let pai = argDict["opCard"];
		let isFlash = argDict["isFlash"];
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let isAuto = room.GetRoomDataInfo()['posList'][clientPos].trusteeship;
		
		//如果听牌自动打牌了
		let roomSet = room.GetRoomSet();
		let set_PosList = argDict["set_PosList"];
		if (actionPos == clientPos && set_PosList[actionPos].isTing) {//听牌的人是自己
			//锁定自己的手牌
			// let UICard01 = this.GetCardComponentByPos(1);
			// UICard01.LockHandCard(room);
			for (let i = 0; i < set_PosList.length; i++) {
				let posID = set_PosList[i]["posID"];
				let shouCard = set_PosList[i]["shouCard"];
				let handCard = set_PosList[i]["handCard"];
				let outCard = set_PosList[i]["outCard"];
				let publicCardList = set_PosList[i]["publicCardList"];
				let setPos = roomSet.GetSetPosByPos(set_PosList[i]["posID"]);
				setPos.SetDataInfo("shouCard", shouCard);
				setPos.SetDataInfo("handCard", handCard);
				setPos.SetDataInfo("publicCardList", publicCardList);
				setPos.SetDataInfo("outCard", outCard);
				let formObj = this.GetCardComponentByPos(this.Pos2Show(posID));
				if (!formObj) {
					this.ErrLog("Event_PosOpCard not find:%s", posID);
					return;
				}
				formObj.OnPosActionEnd();
			}
		}
		
		//预先打牌修改开始

		if (clientPos == actionPos && OpType == this.ShareDefine.OpType_Out && !isAuto && isFlash == false) {
			let UICardSelf = this.GetCardComponentByPos(this.Pos2Show(actionPos));
			if (UICardSelf) {
				//判断是否可以听牌了
				let setPos = room.GetClientPlayerSetPos();
				let huCard = setPos.GetSetPosProperty("huCard");
				if (huCard.length) {
					this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
					//this.FormManager.GetFormComponentByFormName("game/base/ui/majiang/UIMJKeHu").Show_KeHuPai();
				} else {
					this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
				}
				this.ShowAllOutCard(room);
			} else {
				this.ErrLog("Event_PosOpCard(%s) not find UICard", actionPos);
			}
			return;
		}
		//预先打牌修改结束
		this.SoundManager.PlaySound("dapai");
		this.Check_PengGang(OpType, pai, actionPos, room);
		this.ClosePosActionHelp(actionPos, room, isFlash);
		let UICard = this.GetCardComponentByPos(this.Pos2Show(actionPos));
		//更新出牌玩家的UICard界面显示
		if (UICard) {
			UICard.OnPosActionEnd();
			if (this.FormManager.IsFormShow("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu")) {
				let UIKeHu = this.FormManager.GetFormComponentByFormName("game/base/ui/majiang/" + app.subGameName + "_UIMJKeHu");
				UIKeHu.Show_KeHuPai();
			}
		} else {
			this.ErrLog("Event_PosOpCard(%s) not find UICard", actionPos);
		}

		if (OpType == this.ShareDefine.OpType_See) {
			room.GetRoomProperty('set').seePosList.push(actionPos);
			let formObj = this.GetCardComponentByPos(this.Pos2Show(actionPos));
			if (!formObj) {
				this.ErrLog("Event_PosOpCard not find:%s", pos);
				return
			}
			formObj.ShowAllPlayerCard(room);
		}
		if (OpType == this.ShareDefine.OpType_GuangYou) {
			room.GetRoomProperty('set').guangyouPos = actionPos;
			let formObj = this.GetCardComponentByPos(this.Pos2Show(actionPos));
			if (!formObj) {
				this.ErrLog("Event_PosOpCard not find:%s", pos);
				return
			}
			formObj.ShowAllPlayerCard(room);
		}
		//SetDataInfo

		if (OpType == this.ShareDefine.OpType_Out) {
			this.SoundManager.PlaySound("give");
			this.ShowPaiAction(actionPos);
		}
		this.ShowAllOutCard(room);
	},
	//位置动作结束
	Event_Applique: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_Applique not enter room");
			return;
		}
		this.leftPaiNodeList.pop();
		this.ShowLeftCardCount(room);
		//补花去掉一张牌
		let argDict = event;
		//执行动作的位置
		let actionPos = argDict["pos"];
		let OpType = argDict["opType"];
		let pai = argDict["opCard"];
		let isFlash = argDict["isFlash"];
		this.ClosePosActionHelp(actionPos, room, isFlash);
		let UICard = this.GetCardComponentByPos(this.Pos2Show(actionPos));
		//更新补花玩家界面
		if (UICard) {
			UICard.OnPosActionEnd();
		} else {
			this.ErrLog("Applique(%s) not find UICard", actionPos);
		}
		this.ShowAllHuaCard(room);
		//补花音效
		let playerSex = this.InitHeroSex(actionPos);
		let soundPath = "";
		soundPath = [playerSex, '_buhua'].join("");
		this.SoundManager.PlaySound(soundPath);
		//播放补花特效
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let clientDownPos = room.GetRoomPosMgr().GetClientDownPos();
		let clientFacePos = room.GetRoomPosMgr().GetClientFacePos();
		let clientUpPos = room.GetRoomPosMgr().GetClientUpPos();

		if (isFlash == false) {
			if (actionPos == clientPos) {
				this.PosEffect(1, 'BuHua');
			} else if (actionPos == clientDownPos) {
				this.PosEffect(2, 'BuHua');
			} else if (actionPos == clientFacePos) {
				this.PosEffect(3, 'BuHua');
			} else if (actionPos == clientUpPos) {
				this.PosEffect(4, 'BuHua');
			}
		} else {
			if (actionPos == clientPos) {
				this.scheduleOnce(function () {
					this.PosEffect(1, 'BuHua')
				}, 1);
			} else if (actionPos == clientDownPos) {
				this.scheduleOnce(function () {
					this.PosEffect(2, 'BuHua')
				}, 1);
			} else if (actionPos == clientFacePos) {
				this.scheduleOnce(function () {
					this.PosEffect(3, 'BuHua')
				}, 1);
			} else if (actionPos == clientUpPos) {
				this.scheduleOnce(function () {
					this.PosEffect(4, 'BuHua')
				}, 1);
			}
		}
	},

	Check_PengGang: function (opType, pai, pos, room) {
		let playerSex = this.InitHeroSex(pos);

		let language = this.LocalDataManager.GetConfigProperty("SysSetting", "Language");
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let clientDownPos = room.GetRoomPosMgr().GetClientDownPos();
		let clientFacePos = room.GetRoomPosMgr().GetClientFacePos();
		let clientUpPos = room.GetRoomPosMgr().GetClientUpPos();
		let soundName = "";
		if (opType == this.ShareDefine.OpType_Gang || opType == this.ShareDefine.OpType_JieGang || opType == this.ShareDefine.OpType_AnGang) {
			if (pos == clientPos) {
				this.PosEffect(1, 'Gang');
			}
			else if (pos == clientDownPos) {
				this.PosEffect(2, 'Gang');
			}
			else if (pos == clientFacePos) {
				this.PosEffect(3, 'Gang');
			}
			else if (pos == clientUpPos) {
				this.PosEffect(4, 'Gang');
			}
			if (opType == this.ShareDefine.OpType_Gang) {
				soundName = [playerSex, "_", "bugang"].join("");
			} else {
				soundName = [playerSex, "_", "gang"].join("");
			}
			this.SoundManager.PlaySound(soundName);
			this.RoomMgr.DeleteOutCard(pai);
		}
		else if (opType == this.ShareDefine.OpType_Peng) {
			if (pos == clientPos) {
				this.PosEffect(1, 'Peng');
			}
			else if (pos == clientDownPos) {
				this.PosEffect(2, 'Peng');
			}
			else if (pos == clientFacePos) {
				this.PosEffect(3, 'Peng');
			}
			else if (pos == clientUpPos) {
				this.PosEffect(4, 'Peng');
			}
			soundName = [playerSex, "_", "peng"].join("");
			this.SoundManager.PlaySound(soundName);
			this.RoomMgr.DeleteOutCard(pai);
		} else if (opType == this.ShareDefine.OpType_Chi) {
			if (pos == clientPos) {
				this.PosEffect(1, 'Chi');
			}
			else if (pos == clientDownPos) {
				this.PosEffect(2, 'Chi');
			}
			else if (pos == clientFacePos) {
				this.PosEffect(3, 'Chi');
			}
			else if (pos == clientUpPos) {
				this.PosEffect(4, 'Chi');
			}
			soundName = [playerSex, "_", "chi"].join("");
			this.SoundManager.PlaySound(soundName);
			this.RoomMgr.DeleteOutCard(pai);
		}
		else if (opType == this.ShareDefine.OpType_Out) {
			let jin1 = this.RoomSet.get_jin1();
			// if (Math.floor(jin1 / 100) == Math.floor(pai / 100)) {
			// 	soundName = "dabao";
			// } else {
				soundName = [playerSex, "_", parseInt(pai / 100)].join("");
			// }
			this.SoundManager.PlaySound(soundName);
		}
	},


	CloseAllActionHelp: function () {
		this.seat01.stop("UIPlay_MiddleSeat");
		this.seat01.node.getChildByName("sp1").active = 1;
		this.seat01.node.getChildByName("sp2").active = 0;
		this.seat02.stop("UIPlay_MiddleSeat");
		this.seat02.node.getChildByName("sp1").active = 1;
		this.seat02.node.getChildByName("sp2").active = 0;
		this.seat03.stop("UIPlay_MiddleSeat");
		this.seat03.node.getChildByName("sp1").active = 1;
		this.seat03.node.getChildByName("sp2").active = 0;
		this.seat04.stop("UIPlay_MiddleSeat");
		this.seat04.node.getChildByName("sp1").active = 1;
		this.seat04.node.getChildByName("sp2").active = 0;
	},
	ClosePosActionHelp: function (actionPos, room, isFlash) {
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let clientDownPos = room.GetRoomPosMgr().GetClientDownPos();
		let clientFacePos = room.GetRoomPosMgr().GetClientFacePos();
		let clientUpPos = room.GetRoomPosMgr().GetClientUpPos();
		if (actionPos == clientPos) {
			this.seat01.stop("UIPlay_MiddleSeat");
			this.seat01.node.getChildByName("sp1").active = 1;
			this.seat01.node.getChildByName("sp2").active = 0;
		}
		else if (actionPos == clientDownPos) {
			this.seat02.stop("UIPlay_MiddleSeat");
			this.seat02.node.getChildByName("sp1").active = 1;
			this.seat02.node.getChildByName("sp2").active = 0;
		}
		else if (actionPos == clientFacePos) {
			this.seat03.stop("UIPlay_MiddleSeat");
			this.seat03.node.getChildByName("sp1").active = 1;
			this.seat03.node.getChildByName("sp2").active = 0;
		}
		else if (actionPos == clientUpPos) {
			this.seat04.stop("UIPlay_MiddleSeat");
			this.seat04.node.getChildByName("sp1").active = 1;
			this.seat04.node.getChildByName("sp2").active = 0;
		}
	},
	Event_Jin: function (event) {
		let room = this.RoomMgr.GetEnterRoom();
		//剩余囤牌去掉一张
		let argDict = event;
		let jin1 = argDict["jin"];
		let jin2 = argDict["jin2"];
		let normalMoCnt = argDict["normalMoCnt"];
		let gangMoCnt = argDict["gangMoCnt"];
		//取卡牌ID的前2位
		//jin=4501;
		this.RoomSet.set_jin1(jin1);
		this.RoomSet.set_jin2(jin2);
		this.RoomSet.SetRoomSetProperty("normalMoCnt", normalMoCnt);
		this.RoomSet.SetRoomSetProperty("gangMoCnt", gangMoCnt);
		//更新牌蹲信息
		if (argDict['jinJin'] > 0) {
			this.RoomSet.set_jinjin(argDict['jinJin']);
			jin1 = argDict['jinJin'];
		}
		//this.InitLeftPaiNode(room);
		this.ShowLeftCardCount(room);
		this.ShowKaiJinSprite(jin1, this.kaijin1);
		// this.kaijin1.x = -50;
		this.kaijin1.x = 0;
		this.kaijin1.y = 0;
		this.kaijin1.active = true;

		/*this.ShowKaiJinSprite(jin2, this.kaijin2);
		this.kaijin2.x = 50;
		this.kaijin2.y = 0;
		this.kaijin2.active = true;*/


		this.PlayEffect("KaiJin");
		//重新显示所有玩家手牌
		for (let posID = 0; posID < this.playersCount; posID++) {
			let showpos = this.Pos2Show(posID);
			if (showpos != 1) {
				continue;
			}
			let formObj = this.GetCardComponentByPos(showpos);
			if (!formObj) {
				this.ErrLog("Event_PosContinueGame not find:%s", formObj);
				continue;
			}
			formObj.ShowAllPlayerCard(room);
		}
	},
	//摸牌
	Event_PosGetCard: function (event) {
		this.HideAllSeeCard();
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Event_PosGetCard not enter room");
			return
		}
		let argDict = event;
		if (argDict) {
			let pos = argDict["pos"];
			let isNormal = argDict["isNormal"];
			let formObj = this.GetCardComponentByPos(this.Pos2Show(pos));
			if (!formObj) {
				this.ErrLog("Event_PosGetCard not find:%s", pos);
				return
			}
			formObj.OnPosGetCard();
			let leftCount = this.leftPaiNodeList.length;
			if (!leftCount) {
				this.ErrLog("Event_PosGetCard leftPaiNodeList.length not card left:", argDict);
				return
			}
			if (isNormal) {
				this.leftPaiNodeList.shift();
			} else {
				//从后面pop掉一张
				this.leftPaiNodeList.pop();
			}
			//刷新用户shoucard
			let clientSetPos = room.GetClientPlayerSetPos();
			if (!clientSetPos) {
				this.ErrLog("PosgetCard GetClientPlayerSetPos fail");
				return
			}
			this.ShowLeftCardCount(room);
		}
	},
	//摇色子结束
	OnDicePlayEnd: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("OnDicePlayEnd not enter room");
			return
		}
		this.InitDealCard(room);
		this.InitLeftPaiNode(room);
		let playerAll = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		for (let posID = 0; posID < playerAllList.length; posID++) {
			let formObj = this.GetCardComponentByPos(this.Pos2Show(posID));
			if (!formObj) {
				this.ErrLog("OnDicePlayEnd not find:%s", formName);
				continue
			}
			formObj.OnSetStart(room)
		}
	},

	startPaiPos2Realy: function (room) {
		let roomSet = room.GetRoomSet();
		let startPaiPos = roomSet.GetRoomSetProperty("startPaiPos");
		let clientPos = -1;
		let downPos = -1;
		let facePos = -1;
		let upPos = -1;
		let roomPosMgr = room.GetRoomPosMgr();
		clientPos = roomPosMgr.GetClientPos();
		if (clientPos == 0) {
			downPos = 1;
			facePos = 2;
			upPos = 3;
		} else if (clientPos == 1) {
			downPos = 2;
			facePos = 3;
			upPos = 0;
		} else if (clientPos == 2) {
			downPos = 3;
			facePos = 0;
			upPos = 1;
		} else if (clientPos == 3) {
			downPos = 0;
			facePos = 1;
			upPos = 2;
		}
		if (startPaiPos == clientPos) {
			startPaiPos = 0
		}
		else if (startPaiPos == downPos) {
			startPaiPos = 1
		}
		else if (startPaiPos == facePos) {
			startPaiPos = 2
		}
		else if (startPaiPos == upPos) {
			startPaiPos = 3
		}
		let playerCount = roomPosMgr.GetRoomPlayerCount();
		if (playerCount == 2 && clientPos == 1) {
			//二人麻将
			if (startPaiPos == 0) {
				startPaiPos = 3;
			} else if (startPaiPos == 1) {
				startPaiPos = 0;
			} else if (startPaiPos == 2) {
				startPaiPos = 1;
			} else if (startPaiPos == 3) {
				startPaiPos = 2;
			}
		}
		return startPaiPos;

	},
	GetPaiDunNode: function (pos, paiDun) {
		let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos + 1, 2);
		let cardWndPath = [seatWndName, "sp_card", this.ComTool.StringAddNumSuffix("pai", paiDun + 1, 2)].join("/");
		let wndNode = [];
		wndNode['pos'] = pos;
		wndNode['paiDun'] = paiDun;
		wndNode['cardWndPath'] = cardWndPath;
		return wndNode;
	},
	ShowJin: function () {
		//this.kaijin1.active=0;
		let jin1 = this.RoomSet.get_jin1();
		let btnNode = this.GetWndNode("bg_jinpai");
		if (jin1 == 0) {
			let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
			wndSprite.spriteFrame = '';
		} else {
			let cardType = Math.floor(jin1 / 100);
			let imageName = ["CardShow", cardType].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (imageInfo) {
				let imagePath = imageInfo["FilePath"];
				let that = this;
				app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
					.then(function (spriteFrame) {
						if (!spriteFrame) {
							that.ErrLog("JinShow(%s) load spriteFrame fail", imagePath);
							return;
						}
						btnNode.getChildByName('card').color = cc.color(255, 255, 0);
						let wndSprite = btnNode.getChildByName('card').getComponent(cc.Sprite);
						wndSprite.spriteFrame = spriteFrame;
					})
					.catch(function (error) {
						that.ErrLog("JinShow(%s) error:%s", imagePath, error.stack);
					})
			}
			else {
				this.ErrLog('failed load imageName%s', imageName, cardType);
				return;
			}
		}
		let jin2 = this.RoomSet.get_jin2();
		let btnNode2 = this.GetWndNode("bg_benjin");
		if (jin2 == 0) {
			let wndSprite = btnNode2.getChildByName('card').getComponent(cc.Sprite);
			wndSprite.spriteFrame = '';
		} else {
			let cardType = Math.floor(jin2 / 100);
			let imageName = ["CardShow", cardType].join("");
			let imageInfo = this.IntegrateImage[imageName];
			if (imageInfo) {
				let imagePath = imageInfo["FilePath"];
				let that = this;
				app[app.subGameName + "_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
					.then(function (spriteFrame) {
						if (!spriteFrame) {
							that.ErrLog("JinShow2(%s) load spriteFrame fail", imagePath);
							return;
						}
						btnNode.getChildByName('card').color = cc.color(255, 255, 0);
						let wndSprite = btnNode2.getChildByName('card').getComponent(cc.Sprite);
						wndSprite.spriteFrame = spriteFrame;
					})
					.catch(function (error) {
						that.ErrLog("JinShow2(%s) error:%s", imagePath, error.stack);
					})
			}
			else {
				this.ErrLog('failed load imageName%s', imageName, cardType);
				return;
			}
		}
	},
	OnShow: function () {
		this.DelNode();
		this.room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = this.room.GetRoomPosMgr();
		this.InitAllCards();
		this.InitAllHead();
		this.InitAllNdOut();
		this.CloseAllActionHelp();
		let room = this.room;
		this.ShowMiddleSeatName(room);
		this.EffectActionState = this.NoAction;
		this.HideAllChild();
		this.StopPlayPosActionHelp();
		let SceneManager = app[app.subGameName + "_SceneManager"]();
		if (!room) {
			this.ErrLog("OnShow not enter room");
			return
		}
		let state = room.GetRoomProperty("state");
		//如果是初始化
		let GameBackMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "GameBackMusic");
		SceneManager.PlayMusic(GameBackMusic);
		if (state == this.ShareDefine.RoomState_Init) {
			this.OnRoomInit(room);
		}
		else if (state == this.ShareDefine.RoomState_Playing) {
			let clientPos = RoomPosMgr.GetClientPos();
			let isAuto = room.GetRoomDataInfo()['posList'][clientPos].trusteeship;
			if (isAuto) {
				app[app.subGameName + "_GameManager"]().SetAutoPlayIng(true);
				app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + '_UIAutoPlay');
			}
			let dissolveInfo = room.GetRoomProperty('dissolve');
			if (typeof(dissolveInfo) != "undefined") {
				if (dissolveInfo) {
					let posAgreeList = dissolveInfo.posAgreeList;
					if (0 != posAgreeList.length) {
						this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
					}
				}
			}
			this.OnRoomPlaying(room);
		}
		else if (state == this.ShareDefine.RoomState_End) {
			this.OnRoomEnd(room);
		}
		else {
			this.ErrLog("OnShow:%s error", state);
		}
		let dissolve = room.GetRoomProperty("dissolve");
		let endSec = dissolve["endSec"];
		if (endSec) {
			this.FormManager.ShowForm(app.subGameName + "_UIMessage02");
		}
		app[app.subGameName + "Client"].OnEvent('Head_PosUpdate', {});
	},
	InitHeroSex: function (pos, fangyan = true) {
		let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let player = RoomPosMgr.GetPlayerInfoByPos(pos);
		let Sex = player["sex"];
		let playerSex = "";
		if (Sex == this.ShareDefine.HeroSex_Boy) {
			playerSex = "boy";
		}
		else if (Sex == this.ShareDefine.HeroSex_Girl) {
			playerSex = "girl";
		}
		let language = this.LocalDataManager.GetConfigProperty("SysSetting", "Language");
		//莆田十六张仙游麻将独立音效
		if (language == this.ShareDefine.Dialect) {
			if (fangyan == true) {
				playerSex = playerSex + "_" + app.subGameName;
			}
		}
		return playerSex;
	},
	//房间初始化显示
	OnRoomInit: function (room) {
		let setState = this.RoomSet.GetRoomSetProperty("state");
		if (setState == this.ShareDefine.SetState_Playing) {
			return;
		}
		this.kaijin1.active = false;
		this.ShowJin();
		this.HidePlayerReady();
		//显示牌桌信息
		this.ShowAllSeatCard(room, {});
		this.HideAllOutCard(room);
		this.ShowMiddleSeatName(room);
		// this.ShowReady(room);
		this.ShowPlayerReady(room);
		this.ShowSaiZi([1, 1]);
		//隐藏连庄
		this.HideAllLianZhuangNum();
	},
	ReInRoom: function (room) {
		let roomID = this.RoomMgr.GetEnterRoomID();
		this.RoomMgr.SendGetRoomInfo(roomID);
	},
	//房间开始显示
	OnRoomPlaying: function (room) {
		//方位定位
		this.ShowMiddleSeatName(room);
		let roomSet = room.GetRoomSet();
		let roomPosMgr = room.GetRoomPosMgr();
		let setState = roomSet.GetRoomSetProperty("state");
		this.kaijin1.active = false;
		this.ShowJin();
		this.HidePlayerReady();
		this.ShowLianZhuangNum(room);
		if (setState == this.ShareDefine.SetState_Init) {
			//如果用户手牌，实际处于Playing状态
			let setPos = this.RoomMgr.GetEnterRoom().GetClientPlayerSetPos();
			if (setPos) {
				let shouCardList = setPos.GetSetPosProperty("shouCard");
				if (shouCardList.length > 0) {
					app[app.subGameName + "Client"].OnEvent("ModalLayer", "OpenNet");
					this.scheduleOnce(this.ReInRoom, 4);
					return;
				}
			}
			//如果用户手牌，实际处于Playing状态
			this.OnRoomInit(room);
		} else if (setState == this.ShareDefine.SetState_Playing) {
			//开局阶段，播放开局动画，还没开金的情况下处理
			let lastShotTime = roomSet.GetRoomSetProperty("lastShotTime");
			let setCurrentTime = roomSet.GetRoomSetProperty("setCurrentTime");
			this.ShowAllSeatCard(room);
			this.InitLeftPaiNode(room);
			this.ShowAllOutCard(room);
			this.RedisplayPosActionHelp(room);
			let saiziList = room.GetRoomSet().GetRoomSetProperty("saizi");
			this.ShowSaiZi(saiziList);
			this.ShowLeftCardCount(room);
			this.invitationNode.active = false;
		} else if (setState == this.ShareDefine.SetState_End) {
			this.ShowPlayerReady(room);
			this.invitationNode.active = false;
			//   this.ShowAllSeatCard(room);
			//   this.InitLeftPaiNode(room);
			let clientPos = roomPosMgr.GetClientPos();
			let playerInfo = roomPosMgr.GetPlayerInfoByPos(clientPos);
			let playerReadyState = playerInfo["gameReady"];
			//如果玩家未准备
			if (!playerReadyState) {
				this.ShowSaiZi([1, 1]);
				this.ShowWinLostForm();
				// this.FormManager.ShowForm("game/base/ui/majiang/"+app.subGameName+"_UIMJWinLost",this.setEnd);
			}
			//如果玩家已准备则初始化牌局
			else {
				this.OnRoomInit(room);
				return;
			}
			this.ShowMiddleSeatName(room);
		}
	},
	//房间结束
	OnRoomEnd: function (room) {
		this.invitationNode.active = false;
		this.ShowAllSeatCard(room, {});
		this.ShowAllOutCard(room);

		this.ShowMiddleSeatName(room);
		this.ShowLianZhuangNum(room);

		this.HidePlayerReady();

		this.ShowSaiZi([1, 1])

		//如果onShow的时候已经是End状态显示
		this.FormManager.ShowForm("game/base/ui/majiang/" + app.subGameName + "_UIMJResultDetail");
	},
	//显示玩家准备状态
	ShowPlayerReady: function (room) {
		if (!room) {
			this.ErrLog("Event_ShowReadyOrNoReady not enter room");
			return
		}
		let roomSetID = room.GetRoomProperty("setID");
		let ReadyState = "";
		if (roomSetID > 0) {
			ReadyState = "gameReady";
		}
		else {
			ReadyState = "roomReady";
		}

		this.SetPlayerReadyInfo(ReadyState);
	},
	SetPlayerReadyInfo: function (ReadyState) {
		let roomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		let clientPos = roomPosMgr.GetClientPos();
		let downPos = roomPosMgr.GetClientDownPos();
		let facePos = roomPosMgr.GetClientFacePos();
		let upPos = roomPosMgr.GetClientUpPos();
		let playerAll = roomPosMgr.GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let isAllReady = false;
		//判断下所有玩家是否都准备
		if (ReadyState == "roomReady") {
			var tempNum = 0;
			for (let j = 0; j < playerAllList.length; j++) {
				let readyPlayer = playerAll[playerAllList[j]];
				if (readyPlayer[ReadyState])
					tempNum++;
			}
			if (tempNum == playerAllList.length)
				isAllReady = true;
		}
		for (let i = 0; i < playerAllList.length; i++) {
			let player = playerAll[playerAllList[i]];
			if (!player && ReadyState == "roomReady") {
				let needIndex = -1;
				if (i == downPos) {
					needIndex = 2;
				}
				else if (i == facePos) {
					needIndex = 3;
				}
				else if (i == upPos) {
					needIndex = 4;
				}
				if (needIndex != -1) {
				}
				continue;
			}
			let isClientReady = player[ReadyState];
			if (player["pos"] == clientPos) {
				if (ReadyState == "roomReady") {
					if (isClientReady) {
						this.btn_ready.active = 0;
						this.btn_weixin.active = 0;
						if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
							this.invitationNode.active = true;
						}
						this.btn_roomkey.active = 0;
						if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
							this.btn_weixin.active = 0;
							this.invitationNode.active = false;
							this.btn_roomkey.active = 0;
						}
					} else {
						if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
							this.Click_btn_ready();
							this.btn_ready.active = 0;
							this.btn_weixin.active = 0;
							this.invitationNode.active = false;
							this.btn_roomkey.active = 0;
						}
						else {
							this.btn_ready.active = 1;
							this.btn_weixin.active = 0;
							if (this.roomCfg.clubId > 0 || this.roomCfg.unionId > 0) {
								this.invitationNode.active = true;
							}
							this.btn_roomkey.active = 0;
						}


					}
				}
			}
		}

	},
	StopPlayPosActionHelp: function () {
		this.seat01.stop();
		this.seat02.stop();
		this.seat03.stop();
		this.seat04.stop();
		this.CloseAllActionHelp();
	},
	//显示牌桌麻蹲,:需要被删除的蹲
	ShowAllSeatCard: function (room) {
		//遍历4个座位
		for (let pos = 0; pos < this.ShareDefine.MJRoomJoinCount; pos++) {
			let posID = pos + 1;
			let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", posID, 2);
			this.SetWndProperty(seatWndName, "active", 1);
		}
	},
	HideCoinPlayerCard: function () {
		for (let index = 0; index < this.ShareDefine.MJRoomJoinCount; index++) {
			let formObj = this.GetCardComponentByPos(this.Pos2Show(index));
			formObj.HideAllChild();
		}
	},
	//显示所有位置打出去的卡牌
	ShowAllHuaCard: function () {
		//遍历4个座位
		for (let index = 0; index < this.ShareDefine.MJRoomJoinCount; index++) {
			this.ShowPosHuaCard(index);
		}
	},
	//显示所有位置打出去的卡牌
	ShowAllOutCard: function () {
		//遍历4个座位
		for (let index = 0; index < this.ShareDefine.MJRoomJoinCount; index++) {
			this.ShowPosOutCard(index);
		}
	},
	ShowPosHuaCard: function (pos) {
		let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos + 1, 2);
		let seatNode = this.GetWndNode(seatWndName);
		if (!seatNode) {
			this.ErrLog("ShowPosOutCard not find (%s)", seatWndName);
			return
		}
		//显示花牌
		let hua_outNode = seatNode.getChildByName("hua");
		let hua_Out = hua_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
		hua_Out.ShowHuaCard();
	},
	//显示位置打出的卡牌
	ShowPosOutCard: function (pos) {
		let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", pos + 1, 2);
		let seatNode = this.GetWndNode(seatWndName);
		if (!seatNode) {
			this.ErrLog("ShowPosOutCard not find (%s)", seatWndName);
			return
		}
		let nd_outNode = seatNode.getChildByName("nd_out");
		let UIPlay_Out = nd_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
		UIPlay_Out.ShowAllOutCard();
	},
	//隐藏所有打出的卡牌
	HideAllOutCard: function () {
		//遍历4个座位
		for (let index = 0; index < this.ShareDefine.MJRoomJoinCount; index++) {
			let seatWndName = this.ComTool.StringAddNumSuffix("sp_seat", index + 1, 2);
			let seatNode = this.GetWndNode(seatWndName);
			if (!seatNode) {
				this.ErrLog("HideAllOutCard not find (%s)", seatWndName);
				continue
			}
			let nd_outNode = seatNode.getChildByName("nd_out");
			let UIPlay_Out = nd_outNode.getComponent(app.subGameName + "_UIMJPlay_Out");
			UIPlay_Out.HideAllChild();
		}
	},
	ShowLeftCardCount: function (room) {

		let normalMoCnt = this.RoomSet.GetRoomSetProperty("normalMoCnt");
		let gangMoCnt = this.RoomSet.GetRoomSetProperty("gangMoCnt");


		this.sp_leftnum.active = true;
		this.lbnum.string = 144 - normalMoCnt - gangMoCnt;
	},
	//显示中间方位名
	ShowMiddleSeatName: function (room) {
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let playerCount = room.GetRoomPosMgr().GetRoomPlayerCount();
		if (playerCount == 4) {
			if (clientPos == this.ShareDefine.Pos_East) {
				this.ShowImage("UIPlay_East0_1", "UIPlay_East0_2", "UIPlay_South3_1", "UIPlay_South3_2", "UIPlay_West2_1", "UIPlay_West2_2", "UIPlay_North1_1", "UIPlay_North1_2");
			}
			else if (clientPos == this.ShareDefine.Pos_South) {
				this.ShowImage("UIPlay_South0_1", "UIPlay_South0_2", "UIPlay_West3_1", "UIPlay_West3_2", "UIPlay_North2_1", "UIPlay_North2_2", "UIPlay_East1_1", "UIPlay_East1_2");
			}
			else if (clientPos == this.ShareDefine.Pos_West) {
				this.ShowImage("UIPlay_West0_1", "UIPlay_West0_2", "UIPlay_North3_1", "UIPlay_North3_2", "UIPlay_East2_1", "UIPlay_East2_2", "UIPlay_South1_1", "UIPlay_South1_2");
			}
			else if (clientPos == this.ShareDefine.Pos_North) {
				this.ShowImage("UIPlay_North0_1", "UIPlay_North0_2", "UIPlay_East3_1", "UIPlay_East3_2", "UIPlay_South2_1", "UIPlay_South2_2", "UIPlay_West1_1", "UIPlay_West1_2");
			}
			else {
				this.ErrLog("clientPos:%s error", clientPos);
			}
		} else if (playerCount == 3) {
			if (clientPos == 0) {//东南西北
				this.ShowImage("UIPlay_East0_1", "UIPlay_East0_2", "UIPlay_South3_1", "UIPlay_South3_2", "UIPlay_West2_1", "UIPlay_West2_2", "UIPlay_North1_1", "UIPlay_North1_2");
			}
			else if (clientPos == 1) {//南北西东
				this.ShowImage("UIPlay_South0_1", "UIPlay_South0_2", "UIPlay_North3_1", "UIPlay_North3_2", "UIPlay_West2_1", "UIPlay_West2_2", "UIPlay_East1_1", "UIPlay_East1_2");
			}
			else if (clientPos == 2) {//北东西南
				this.ShowImage("UIPlay_North0_1", "UIPlay_North0_2", "UIPlay_East3_1", "UIPlay_East3_2", "UIPlay_West2_1", "UIPlay_West2_2", "UIPlay_South1_1", "UIPlay_South1_2");
			}
			else {
				this.ErrLog("clientPos:%s error", clientPos);
			}
		} else {
			if (clientPos == 0)
				this.ShowImage("UIPlay_East0_1", "UIPlay_East0_2", "UIPlay_South3_1", "UIPlay_South3_2", "UIPlay_West2_1", "UIPlay_West2_2", "UIPlay_North1_1", "UIPlay_North1_2");
			else
				this.ShowImage("UIPlay_West0_1", "UIPlay_West0_2", "UIPlay_North3_1", "UIPlay_North3_2", "UIPlay_East2_1", "UIPlay_East2_2", "UIPlay_South1_1", "UIPlay_South1_2");
		}
	},

	ShowImage: function (value1_1, value1_2, value2_1, value2_2, value3_1, value3_2, value4_1, value4_2) {
		this.SetWndProperty("sp_middle/seat01/sp1", "image", value1_1);
		this.SetWndProperty("sp_middle/seat01/sp2", "image", value1_2);
		this.SetWndProperty("sp_middle/seat02/sp1", "image", value2_1);
		this.SetWndProperty("sp_middle/seat02/sp2", "image", value2_2);
		this.SetWndProperty("sp_middle/seat03/sp1", "image", value3_1);
		this.SetWndProperty("sp_middle/seat03/sp2", "image", value3_2);
		this.SetWndProperty("sp_middle/seat04/sp1", "image", value4_1);
		this.SetWndProperty("sp_middle/seat04/sp2", "image", value4_2);
	},
	//---------计时器，开局发牌逻辑--------------
	//GPS按钮点击
	OnBtn_GPS_Click:function(){
		let room = this.RoomMgr.GetEnterRoom();
		let RoomPosMgr = room.GetRoomPosMgr();
		let PlayerCount = RoomPosMgr.GetRoomPlayerCount();
		if(PlayerCount <= 2){
			app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg('MSG_GPS_LOST_PLAYER');
			return;
		}
		if (this.FormManager.IsFormShow(app.subGameName+"_UIGPSLoation")) {
			this.FormManager.CloseForm(app.subGameName+"_UIGPSLoation");
		} else {
			this.FormManager.ShowForm(app.subGameName+"_UIGPSLoation");
		}
	},
	OnUpdate: function () {
		let tick = Date.now();

		if (this.dealCardState == this.DealCard_InitState) {

		}
		else if (this.dealCardState == this.DealCard_GetCardState) {
			this.dealCardState = this.DealCard_InitState;
			//this.Deal_GetCardState(tick);
			this.AllPosOpenCardEffect2();
		}
		else if (this.dealCardState == this.DealCard_MoCardState) {
			this.Deal_MoCardState(tick);
		}
		else if (this.dealCardState == this.DealCard_AlignCardState) {
			if (this.nextDealCardTick > tick) {
				return
			}
			/*let formObj = this.GetCardComponentByPos(1);
            formObj.OpenCardEffect2()*/
			this.dealCardState = this.DealCard_InitState;
		}
		else {
			this.ErrLog("OnUpdate dealCardState:%s error", this.dealCardState);
		}
		//更新系统时间
		let DateNow = new Date();
		let Hours = DateNow.getHours();
		let Minutes = DateNow.getMinutes();
		Hours = this.ComTool.StringAddNumSuffix("", Hours, 2);
		Minutes = this.ComTool.StringAddNumSuffix("", Minutes, 2);
		this.now_time.string = Hours + ":" + Minutes;

	},
	//开局抓牌阶段
	Deal_GetCardState: function (tick) {

		if (this.nextDealCardTick > tick) {
			return
		}

		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("DealCard not enter room");
			return
		}

		let dealInfo = this.dealGetDunNodeList.shift();
		if (!dealInfo) {
			this.ErrLog("Deal_GetCardState dealGetDunNodeList not card");
			return
		}
		let pos = dealInfo["Pos"];
		let dunNodeList = dealInfo["DunNodeList"];
		//卡牌数量4
		let cardCount = dunNodeList.length * 2;


		//通知接收牌的位置
		let formObj = this.GetCardComponentByPos(this.Pos2Show(pos));
		if (!formObj) {
			this.ErrLog("DealCard not find GetCardComponentByPos(%s)", pos);
			return
		}

		let cardIDList = [];
		//如果是客户端玩家,取玩家牌数据
		if (pos == room.GetRoomPosMgr().GetClientPos()) {
			cardIDList = this.clientPlayerShouCardList.splice(0, cardCount);
		}
		else {
			cardIDList = [0, 0, 0, 0];
		}

		if (cardIDList.length != cardCount) {
			this.ErrLog("DealCard(%s,%s) cardIDList:", pos, cardCount, cardIDList, this.clientPlayerShouCardList);
			return
		}
		//开牌效果
		formObj.OpenCardEffect(cardIDList);

		//如果发牌蹲位已经发完了,进入摸牌
		if (this.dealGetDunNodeList.length) {
			this.nextDealCardTick = tick + this.OpenCardTick;
		}
		else {
			this.dealCardState = this.DealCard_MoCardState;
			this.nextDealCardTick = tick + this.MoCardTick;
		}
	},

	//开局摸牌阶段
	Deal_MoCardState: function (tick) {
		if (this.nextDealCardTick > tick) {
			return
		}
		this.nextDealCardTick = tick + this.AlignCardTick;

		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Deal_MoCardState not enter room");
			return
		}

		let clientPos = room.GetRoomPosMgr().GetClientPos();
		let joinPlayerCount = room.GetRoomPosMgr().GetRoomPlayerCount();
		/*let playerAllList= Object.keys(playerAll);
        let joinPlayerCount = playerAllList.length;*/
		for (let pos = 0; pos < joinPlayerCount; pos++) {

			//通知接收牌的位置
			let formObj = this.GetCardComponentByPos(this.Pos2Show(pos));
			if (!formObj) {
				this.ErrLog("DealCard not find GetCardComponentByPos(%s)", pos);
				continue
			}

			let cardIDList = [];
			if (pos == clientPos) {
				cardIDList = this.clientPlayerShouCardList;
			}
			else {
				cardIDList = [0]
			}

			if (cardIDList.length != 1) {
				continue
			}
			formObj.OpenCardEffect(cardIDList);
		}

		this.dealCardState = this.DealCard_AlignCardState;
		this.clientPlayerShouCardList = [];
		this.dealMoDunNodeList = [];
	},
	//---------点击函数---------------------

	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	SetWaitForConfirm: function (msgID, type, msgArg = []) {
		let ConfirmManager = app[app.subGameName + "_ConfirmManager"]();
		ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
		ConfirmManager.ShowConfirm(type, msgID, msgArg);
	},
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			if (msgID == "SportsPointNotEnough") {
				let roomID = this.RoomMgr.GetEnterRoomID();
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
			}
			return
		}
		if (msgID == "MSG_BeKick" || msgID == "MSG_BeDissolve") {
			app[app.subGameName + "Client"].ExitGame();
		} else if (msgID == "UIPlay_BeKick") {
			this.Client.ExitGame();
		}
		else if ('MSG_Room_Change' == msgID) {
			let roomID = this.RoomMgr.GetEnterRoomID();
			let that = this;
			app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {"roomID": roomID}, function (success) {

				},
				function (error) {
					let msg = error.Msg;
					that.ShowSysMsg(msg);
				});
		}
		else if (msgID == "OwnnerForceRoom") {
			this.Client.ExitGame();
		}
		else if (msgID == "MSG_Room_EXIT") {
			this.Click_btn_jiesan();
		}
		else if (msgID == "DissolveRoom") {
			this.Client.ExitGame();
		}
		else if (msgID == "PlayerLeaveRoom") {
			let roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID);
		}
		else if (msgID == "UIMoreTuiChuFangJian") {
			let ClientPos = this.RoomPosMgr.GetClientPos();
			let player = this.RoomPosMgr.GetPlayerInfoByPos(ClientPos);
			if (!player)
				return;
			let posName = player.name;
			let roomID = this.RoomMgr.GetEnterRoomID();
			let state = this.RoomMgr.GetEnterRoom().GetRoomProperty("state");
			if (state == this.ShareDefine.RoomState_Playing) {
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return
			}
			//房主不能退出房间，只能解散
			if (this.RoomMgr.GetEnterRoom().IsClientIsOwner()) {
				app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
				return
			}
			app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, ClientPos);
		}
		else {
			this.ErrLog("OnConFirm msgID:%s error", msgID);
		}
	},

	OnClickForm: function () {
		this.FormManager.GetFormComponentByFormName(app.subGameName + "_UIMore").HideAll();
		let UICard01 = this.GetCardComponentByPos(1);
		UICard01.DeselectCard();
//        this.FormManager.CloseForm(app.subGameName+"_UIChat");
	},
	Click_btn_shuaxin: function () {
		if (this.ShuaXining == true) {
			return;
		}
		this.ShuaXining = true;
		this.ReInRoom();
	},
	isChangeRen: function () {
		/*let room = this.RoomMgr.GetEnterRoom();
		let playerAll = room.GetRoomPosMgr().GetRoomAllPlayerInfo();
		let playerAllList = Object.keys(playerAll);
		let joinPlayerCount = playerAllList.length;
		if (joinPlayerCount <= 2) {
			return false;
		}
		let fangjian = room.GetRoomConfigByProperty('fangjian');
		if (fangjian.length > 0) {
			if (fangjian.indexOf(0) > -1) {
				return true;
			}
		}*/
		return false;
	},
	Click_btn_change: function () {
		let roomID = this.RoomMgr.GetEnterRoomID();
		let that = this;
		app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "ChangePlayerNum", {"roomID": roomID}, function (success) {

		}, function (error) {
			let msg = error.Msg;
			that.ShowSysMsg(msg);
		});
		// this.SetWaitForConfirm('MSG_Room_Change',this.ShareDefine.Confirm,[],[]);

	},
	OnClick: function (btnName, btnNode) {
		if (btnName == "btn_shuaxin") {
			this.Click_btn_shuaxin();
		} 
		else if (btnName == "btn_change") {
			this.Click_btn_change();
		} 
		else if (btnName == "btn_ready") {
			this.Click_btn_ready();
		}
		else if (btnName == "btn_cancel") {
			this.Click_btn_cancel();
		} 
		else if (btnName == "btn_exit") {
			this.Click_btn_jiesan();
		}
		else if (btnName == "btn_out") {
			this.Click_btn_jiesan();		
		}
		else if (btnName == "btn_weixin") {
			this.Click_btn_weixin();
		} 
		else if (btnName == "btn_roomkey") {
			let str = "房间号：" + this.RoomMgr.GetEnterRoom().GetRoomProperty("key");
			this.Click_btn_fzkl(str);
		} 
		else if (btnName == "btn_setting" || btnName == "btn_more") {
			this.FormManager.ShowForm(app.subGameName + "_UISetting02");
		}
		else if (btnName == "btn_gps") {
			this.OnBtn_GPS_Click();
		} 
		else if (btnName == "btn_chat") {
			this.FormManager.ShowForm(app.subGameName+"_UIChat");
		}else if (btnName == "btn_wanfa") {
			let wanFaStr = this.WanFa();
			this.ShowSysMsg(wanFaStr);
		}
		else {
			this.ErrLog("OnClick(%s) not find", btnName);
		}
	},


	Click_btn_ready: function () {
		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Click_btn_ready not enter room");
			return
		}
		let roomID = room.GetRoomProperty("roomID");
		let clientPos = room.GetRoomPosMgr().GetClientPos();
		app[app.subGameName + "_GameManager"]().SendReady(roomID, clientPos);
	},
	Event_CodeError: function (event) {
		let argDict = event;
		let code = argDict["Code"];
		if(code == app[app.subGameName + "_ShareDefine"]().NotExistRoom){
			this.FormManager.ClearDefaultFormNameList();
			app[app.subGameName+"Client"].ExitGame();
		}
		else if(!app[app.subGameName + "_ShareDefine"]().isCoinRoom && code == this.ShareDefine.ExitROOM_ERROR){
			this.FormManager.ClearDefaultFormNameList();
		}
		else if(app[app.subGameName + "_ShareDefine"]().isCoinRoom && code == this.ShareDefine.ExitROOM_ERROR){
			app[app.subGameName+"Client"].ExitGame();
		}
		else if(code == this.ShareDefine.ErrorNotRoomCardByXiPai){
			app[app.subGameName+"_SysNotifyManager"]().ShowSysMsg("SSS_XIPAI_FAILED");
		}
		else if (code == this.ShareDefine.SportsPointNotEnough) {
			this.SetWaitForConfirm("SportsPointNotEnough", this.ShareDefine.ConfirmYN, []);
		} 
		else if (code == this.ShareDefine.NotAllow) {
			if (this.FormManager.IsFormShow("game/base/ui/majiang/" + app.subGameName + "_UIMJWinLost")) {
				this.FormManager.CloseForm("game/base/ui/majiang/" + app.subGameName + "_UIMJWinLost");
			}
		}
	},
	Click_btn_jiesan: function () {

		let room = this.RoomMgr.GetEnterRoom();
		if (!room) {
			this.ErrLog("Click_btn_jiesan not enter room");
			return
		}

		if (app[app.subGameName + "_ShareDefine"]().isCoinRoom) {
			//Event_ExitRoomSuccess 都有做退出处理
			//Event_CodeError
			let needArg = this.RoomPosMgr.GetClientPos();
			let roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName + "_GameManager"]().SendExitRoom(roomID, needArg);
			app[app.subGameName + "_FormManager"]().AddDefaultFormName(app.subGameName + "_UIPractice");
			return;
		}

		let state = room.GetRoomProperty("state");
		if (state == this.ShareDefine.RoomState_End) {
			//直接退出到大厅
			this.Client.ExitGame();
			return
		}
		let ClientPos = this.RoomPosMgr.GetClientPos();
		let player = this.RoomPosMgr.GetPlayerInfoByPos(ClientPos);
		if (!player)
			return;
		let posName = player.name;
		let roomID = this.RoomMgr.GetEnterRoomID();
		if (state == this.ShareDefine.RoomState_Playing) {
			let jiesan = room.GetRoomConfigByProperty('jiesan');
			if (jiesan == 4) {
				this.ShowSysMsg("房间不可以解散");
				return;
			}
			app[app.subGameName + "_GameManager"]().SendDissolveRoom(roomID, posName);
			return
		}

		let msgID = '';

		let roomCfg = room.GetRoomConfig();
		if (roomCfg.createType == 2 || roomCfg.clubId != 0) {
			msgID = 'UIMoreTuiChuFangJian';
		} else {
			if (room.IsClientIsOwner()) {
				msgID = 'PlayerLeaveRoom';
			}
			else {
				msgID = 'UIMoreTuiChuFangJian';
			}
		}

		app[app.subGameName + "_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
		app[app.subGameName + "_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, msgID, []);
	},

	ShowSaiZi: function (saiziList) {
		//隐藏显示剩余卡牌
		this.sp_leftnum.active = false;
		this.nd_dice.active = true;

		let count = saiziList.length;
		if (count) {
			for (let index = 0; index < count; index++) {
				let point = saiziList[index];

				let touzi = null;
				if (index) {
					touzi = this.touzi2;
				}
				else {
					touzi = this.touzi1;
				}
				touzi.spriteFrame = this.SaiZiList[point - 1];
			}
		}
		else {
			this.touzi1.spriteFrame = this.SaiZiList[0];
			this.touzi2.spriteFrame = this.SaiZiList[0];
		}
	},
	//初始化发牌列表
	InitDealCard: function (room) {
		let roomSet = room.GetRoomSet();
		let roomPosMgr = room.GetRoomPosMgr();
		let startPaiPos = this.startPaiPos2Realy(room);
		let startPaiDun = roomSet.GetRoomSetProperty("startPaiDun");
		let dPos = roomSet.GetRoomSetProperty("dPos");
		let clientSetPos = room.GetClientPlayerSetPos();
		if (!clientSetPos) {
			this.ErrLog("InitDealCard GetClientPlayerSetPos fail");
			return
		}
		let shouCard = clientSetPos.GetSetPosProperty("shouCard");
		this.clientPlayerShouCardList = shouCard.slice();
		//发牌的顺序列表
		let dealPosList = [];
		let joinPlayerCount = roomPosMgr.GetRoomPlayerCount();
		for (let index = 0; index < joinPlayerCount; index++) {
			dealPosList.push((dPos + index) % joinPlayerCount);
		}
		this.dealGetDunNodeList = [];
		//总共发出去的蹲数 (13/2)*4
		let dealDunCount = Math.floor(this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] / 2) * joinPlayerCount;
		let paiDun = startPaiDun;
		let paiPos = startPaiPos;
		let getDunNodeList = [];
		for (let dealIndex = 0; dealIndex < dealDunCount; dealIndex++) {
			//如果牌蹲数量大于14,换到上家牌蹲
			if (paiDun >= this.ShareDefine.MJRoomPaiDun) {
				paiPos = (paiPos + this.ShareDefine.MJRoomJoinCount - 1) % this.ShareDefine.MJRoomJoinCount;
				paiDun = 0;
			}
			let wndDunNode = this.GetPaiDunNode(paiPos, paiDun);
			if (wndDunNode) {
				getDunNodeList.push(wndDunNode);
			}
			else {
				this.ErrLog("1InitDealCard GetPaiDunNode(%s,%s) not find wndNode", paiPos, paiDun);
			}
			//拿了2张 切换到下家拿牌
			if (getDunNodeList.length >= 2) {
				//拿牌的位置
				let pos = dealPosList.shift();
				dealPosList.push(pos);
				this.dealGetDunNodeList.push({"Pos": pos, "DunNodeList": getDunNodeList});
				this.Log("1InitDealCard pos(%s) get(%s)(%s,%s)", pos, paiPos, paiDun - 1, paiDun);
				getDunNodeList = [];
			}
			paiDun += 1;
		}
		this.dealMoDunNodeList = [];
		//每人摸一张,消耗2蹲牌
		for (let dealIndex = 0; dealIndex < 2; dealIndex++) {
			//如果牌蹲数量大于14,换到上家牌蹲
			if (paiDun >= this.ShareDefine.MJRoomPaiDun) {
				paiPos = (paiPos + this.ShareDefine.MJRoomJoinCount - 1) % this.ShareDefine.MJRoomJoinCount;
				paiDun = 0;
			}

			let wndDunNode = this.GetPaiDunNode(paiPos, paiDun);
			if (wndDunNode) {
				this.Log("2InitDealCard(%s,%s)", paiPos, paiDun);
				this.dealMoDunNodeList.push(wndDunNode);
			}
			else {
				this.ErrLog("2InitDealCard GetPaiDunNode(%s,%s) not find wndNode", paiPos, paiDun);
			}
			paiDun += 1;
		}

		this.nextDealCardTick = 0;
		this.dealCardState = this.DealCard_GetCardState;
	},
	//初始化剩余的牌节点列表
	InitLeftPaiNode: function (room) {
		let roomSet = room.GetRoomSet();
		let roomPosMgr = room.GetRoomPosMgr();
		let startPaiPos = this.startPaiPos2Realy(room);
		let startPaiDun = roomSet.GetRoomSetProperty("startPaiDun");
		let normalMoCnt = roomSet.GetRoomSetProperty("normalMoCnt");
		let gangMoCnt = roomSet.GetRoomSetProperty("gangMoCnt");
		this.leftPaiNodeList = [];
		let paiPos = startPaiPos;
		let paiDun = startPaiDun;
		//总共发出去的蹲数 (13/2)*4
		let joinPlayerCount = roomPosMgr.GetRoomPlayerCount();
		let dealDunCount = Math.floor(this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] / 2) * joinPlayerCount;
		//扣除掉发牌的蹲数
		for (let dealIndex = 0; dealIndex < dealDunCount; dealIndex++) {
			//如果牌蹲数量大于14,换到上家牌蹲
			if (paiDun >= this.ShareDefine.MJRoomPaiDun) {
				paiPos = (paiPos + this.ShareDefine.MJRoomJoinCount - 1) % this.ShareDefine.MJRoomJoinCount;
				paiDun = 0;
			}
			paiDun += 1;
		}
		//扣除每人摸一张,消耗2蹲牌
		for (let dealIndex = 0; dealIndex < 2; dealIndex++) {
			//如果牌蹲数量大于14,换到上家牌蹲
			if (paiDun >= this.ShareDefine.MJRoomPaiDun) {
				paiPos = (paiPos + this.ShareDefine.MJRoomJoinCount - 1) % this.ShareDefine.MJRoomJoinCount;
				paiDun = 0;
			}
			paiDun += 1;
		}

		//总共的牌蹲数量
		let allPaiDunCount = this.ShareDefine.MJRoomPaiDun * this.ShareDefine.MJRoomJoinCount;
		//发完牌剩下的牌，144-13*玩家数
		let LeftNum = allPaiDunCount * 2 - joinPlayerCount * this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"];
		//剩余的牌
		for (let dealIndex = 0; dealIndex < allPaiDunCount; dealIndex++) {
			//如果牌蹲数量大于14,换到上家牌蹲
			if (paiDun >= this.ShareDefine.MJRoomPaiDun) {
				paiPos = (paiPos + this.ShareDefine.MJRoomJoinCount - 1) % this.ShareDefine.MJRoomJoinCount;
				paiDun = 0;
			}

			let wndDunNode = this.GetPaiDunNode(paiPos, paiDun);
			if (wndDunNode) {
				for (let childIndex = 1; childIndex <= 2; childIndex++) {
					let childName = "pai" + childIndex;
					if (this.leftPaiNodeList.length < LeftNum) {
						this.leftPaiNodeList.push(childName);
					}
				}
			}
			else {
				this.ErrLog("InitLeftPaiNode 2InitDealCard GetPaiDunNode(%s,%s) not find wndNode", paiPos, paiDun);
			}
			if (this.leftPaiNodeList.length >= LeftNum) {
				break;
			}
			paiDun += 1;
		}
		let deleteCount = normalMoCnt - this.ShareDefine[this.GameTyepStringUp() + "RoomDealPerPosCardCount"] * joinPlayerCount;
		if (deleteCount < 0) {
			this.ErrLog("normalMoCnt:%s < 52 error", normalMoCnt);
		}
		for (let index = 0; index < deleteCount; index++) {
			this.leftPaiNodeList.shift();
		}
		for (let index = 0; index < gangMoCnt; index++) {
			//从后面pop掉一张
			this.leftPaiNodeList.pop();
		}
	},
	OnClose: function () {
		this.DelNode();
		if (this.MoveNode) {
			this.MoveNode.active = false;
		}
	},
	DelNode: function () {
		this.DeleteFormAllEffect();
		this.diceAnimation.stop();
		this.headNode.removeAllChildren();
		this.DeleteAllNdOut();
		this.cardNodes.getChildByName('card01').removeAllChildren();
		this.cardNodes.getChildByName('card02').removeAllChildren();
		this.cardNodes.getChildByName('card03').removeAllChildren();
		this.cardNodes.getChildByName('card04').removeAllChildren();
		this.node.getChildByName('sp_seat01').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat02').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat03').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
		this.node.getChildByName('sp_seat04').getChildByName('nd_out').getComponent(app.subGameName + "_UIMJPlay_Out").SetEffectNull();
	},
});

module.exports = BaseMaJiangForm;


