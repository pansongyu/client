var app = require("qzmj_app");
cc.Class({
	extends: require(app.subGameName+"_BaseForm"),

	properties: {
		gongnengbeijing:cc.Node,
		btn_autoplay:cc.Node,
		btn_shezhi:cc.Node,
		btn_jiesan:cc.Node,
		btn_record:cc.Node,
		btn_help:cc.Node,
		btn_moreshou:cc.Node,
		btn_information:cc.Node,
		now_day:cc.Label,
		now_time:cc.Label,
		room_data:cc.Node,
		giftPrefabs:[cc.Prefab],
		giftNode:cc.Node,
	},

	OnCreateInit: function () {
	   this.ComTool = app[app.subGameName + "_ComTool"]();
	   this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
	   this.btn_autoplay.active = false;
	   this.btn_shezhi.active = false;
	   this.btn_jiesan.active = false;
	   this.btn_record.active = false;
	   this.btn_help.active = false;
	   this.gongnengbeijing.active = false;

	   this.RegEvent("SetStart", this.Event_SetStart);
	   this.RegEvent("SSSSetStart", this.Event_SetStart);
	   this.RegEvent("PDKSetStart", this.Event_SetStart);
	   this.RegEvent("LYMJ_SetStart", this.Event_SetStart);
	   this.RegEvent('ExitRoomSuccess',this.Event_ExitRoomSuccess);
	   this.RegEvent('CodeError',this.Event_CodeError);
	   this.RegEvent('GameGift',this.Event_GameGift);
	},
	GiftMoveEnd:function(sender, useData){
		sender.getComponent(cc.Animation).play();
		sender.bMove = false;
		//播放音效
		app[app.subGameName+"_SoundManager"]().PlaySound('mofa_'+sender.name);
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
	//-----------------回调函数------------------
	Event_GameGift:function(event){
		this.PlayGame = app.subGameName;
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
		ani.on('finished',this.OnGiftAniEnd, this);
		let vec1 = sendHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
		let vec2 = reciveHead.node.convertToWorldSpaceAR(cc.v2(0, 0));
		vec1 = this.giftNode.convertToNodeSpaceAR(vec1);
		vec2 = this.giftNode.convertToNodeSpaceAR(vec2);
		tempNode.x = vec1.x;
		tempNode.y = vec1.y;
		this.giftNode.addChild(tempNode);
		let action = cc.sequence(
			cc.moveTo(0.3,vec2),
			cc.callFunc(self.GiftMoveEnd,self)
		);
		tempNode.runAction(action);
	},
	Event_ExitRoomSuccess:function(event){
		// app[app.subGameName + "Client"].ExitGame();
	},
	Event_CodeError:function(event){
		let argDict = event;
		let code = argDict["Code"];
		if(code == app[app.subGameName + "_ShareDefine"]().NotExistRoom){
			this.FormManager.ClearDefaultFormNameList();
			app[app.subGameName + "Client"].ExitGame();
		}
		else if(!app[app.subGameName + "_ShareDefine"]().isCoinRoom && code == this.ShareDefine.ExitROOM_ERROR)
			this.FormManager.ClearDefaultFormNameList();
		else if(app[app.subGameName + "_ShareDefine"]().isCoinRoom && code == this.ShareDefine.ExitROOM_ERROR)
			app[app.subGameName + "Client"].ExitGame();
		else if(code == this.ShareDefine.ErrorNotRoomCardByXiPai)
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("SSS_XIPAI_FAILED");
	},
	Event_SetStart:function(event){
	    this.SetRoomData();
		if(0 == this.btn_moreshou.rotationX){
			if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
				this.btn_autoplay.active = true;
			}else{
				this.btn_autoplay.active = false;
			}
		}
	},
	OnShow: function () {
		this.playgame=app.subGameName;
		this.RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
		this.btn_moreshou.rotationX = 0;
		this.SimulateOnClick("btn_moreshou");
		//this.SetRoomData();
		if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
			this.room_data.active = false;
			this.node.getChildByName('btn_gps').active=false;
		}else{
			this.room_data.active = false;
			this.node.getChildByName('btn_gps').active=true;
			this.btn_autoplay.active = false;
		}
		this.OnGiftAniEnd(null);//清理表情
	},

	SetRoomData:function(){
        let room = this.RoomMgr.GetEnterRoom();
        let roomCfg = room.GetRoomConfig();
		let current = room.GetRoomConfigByProperty("setCount");
		let setID = room.GetRoomProperty("setID");
		let joinPlayerCount = 0;
        let playerAll = this.RoomPosMgr.GetRoomAllPlayerInfo();
    	let playerAllList= Object.keys(playerAll);
    	joinPlayerCount = playerAllList.length;
		current=current*joinPlayerCount;
		this.room_data.getChildByName('label1').getComponent("cc.Label").string="庄数："+setID+"/"+current;
        this.room_data.getChildByName('label2').getComponent("cc.Label").string = "房间号："+room.GetRoomProperty("key");
        

        let label0 = this.room_data.getChildByName('label0');
        label0.getComponent("cc.Label").string = joinPlayerCount + '人场';
        let label3 = this.room_data.getChildByName('label3');
        label3.active = false;
	},

	//---------点击函数---------------------
	OnClick:function(btnName, btnNode){
		if(btnName == "btn_moreshou" || btnName == "gongnengbeijing"){
			this.Click_btn_moreshou();
		}
		else if(btnName == "btn_shezhi"){
		   this.Click_btn_shezhi();
		}
		else if(btnName == "btn_jiesan"){
			this.Click_btn_jiesan();
		}
		else if(btnName == "btn_information"){
			console.log("info");
			// this.FormManager.ShowForm("UIRoomInfo");
		}
		else if(btnName == "btn_autoPlay"){
		    this.Click_btn_moreshou();
			if(app[app.subGameName+"_GameManager"]().IsFristPlay()){
				this.Click_btn_autoplay();
			}else{
				app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('MSG_CAN_NOT_AUTOPLAY');
			}
		}
		else if (btnName == "btn_record") {
			//如果房间结束直接到this.FormManager.ShowForm("UIResultTotal");
		    let room = this.RoomMgr.GetEnterRoom();
		    let roomState=room.GetRoomProperty('state');
		    if(roomState==this.ShareDefine.RoomState_End){
		        // this.FormManager.ShowForm("UIResultTotal");
		        return
		    }
            let roomID = this.RoomMgr.GetEnterRoom().GetRoomProperty("roomID");
            this.RoomMgr.SendRoomRecord(roomID);	
		}
		else if (btnName == "btn_help") {
			app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName+"_UIGameHelp",app.subGameName);
		}
		else if (btnName == "btn_gps") {
			this.OnBtn_GPS_Click();
		}
		else{
			this.ErrLog("OnClick(%s) not find",btnName);
		}
	},
	HideAll:function(){
		this.gongnengbeijing.active = false;
		this.btn_shezhi.active = false;
		this.btn_jiesan.active = false;
		this.btn_record.active = false;
		this.btn_help.active = false;
		this.btn_autoplay.active = false;
		this.btn_moreshou.rotationX = 180;
	},
	Click_btn_moreshou:function () { 
		if(0 == this.btn_moreshou.rotationX){
			this.gongnengbeijing.active = false;
			this.btn_shezhi.active = false;
		 	this.btn_jiesan.active = false;
			this.btn_record.active = false;
			this.btn_help.active = false;
			this.btn_autoplay.active = false;
			this.btn_moreshou.rotationX = 180;
		}else{
			this.gongnengbeijing.active = true;
			this.btn_shezhi.active = true;
			this.btn_jiesan.active = true;
			this.btn_record.active = false;
			this.btn_help.active = false;
			
			if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
				this.btn_autoplay.active = true;
			}else{
				this.btn_autoplay.active = false;
			}
			this.btn_moreshou.rotationX = 0;
		}
	},

	Click_btn_shezhi:function () {
		this.FormManager.ShowForm(app.subGameName+"_UISetting02");
	},
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
	Click_btn_autoplay:function(){
		app[app.subGameName+"_GameManager"]().SendAutoStart();
	},
	Click_btn_jiesan:function () { 
		let room = this.RoomMgr.GetEnterRoom();
		if(!room){
			this.ErrLog("Click_btn_jiesan not enter room");
			return
		}
		
		if(app[app.subGameName + "_ShareDefine"]().isCoinRoom){
			//Event_ExitRoomSuccess 都有做退出处理
			//Event_CodeError
			let needArg = this.RoomPosMgr.GetClientPos();
			let roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName+"_GameManager"]().SendExitRoom(roomID, needArg);
			app[app.subGameName + "_FormManager"]().AddDefaultFormName(app.subGameName+"_UIPractice");
			return;
		}

		let state = room.GetRoomProperty("state");
		if(state == this.ShareDefine.RoomState_End){
		    //直接退出到大厅
		    app[app.subGameName + "Client"].ExitGame();
		    return
		}
		let ClientPos = this.RoomPosMgr.GetClientPos();
		let player = this.RoomPosMgr.GetPlayerInfoByPos(ClientPos);
		if(!player)
			return;
		let	posName = player.name;
		let roomID = this.RoomMgr.GetEnterRoomID();
		if(state == this.ShareDefine.RoomState_Playing){
			app[app.subGameName+"_GameManager"]().SendDissolveRoom(roomID, posName);
			return
		}

		let msgID = '';

		let roomCfg = room.GetRoomConfig();
		if(roomCfg.createType==2 || roomCfg.clubID!=0){
			msgID = 'UIMoreTuiChuFangJian';
		}else{
			if(room.IsClientIsCreater()){
				msgID = 'PlayerLeaveRoom';
			}
			else{
				msgID = 'UIMoreTuiChuFangJian';
			}
		}

        app[app.subGameName+"_ConfirmManager"]().SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
        app[app.subGameName+"_ConfirmManager"]().ShowConfirm(this.ShareDefine.Confirm, msgID, []);
	},
	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	OnConFirm:function(clickType, msgID, backArgList){
		let room = this.RoomMgr.GetEnterRoom();
		if(clickType != "Sure"){
			return
		}
		if(msgID == "PlayerLeaveRoom"){
			let roomID = this.RoomMgr.GetEnterRoomID();
			app[app.subGameName+"_GameManager"]().SendDissolveRoom(roomID);
		}
		else if(msgID == "UIMoreTuiChuFangJian"){
			let ClientPos = this.RoomPosMgr.GetClientPos();
			let player = this.RoomPosMgr.GetPlayerInfoByPos(ClientPos);
			if(!player)
				return;
			let posName = player.name;
			let roomID = this.RoomMgr.GetEnterRoomID();
			let state = room.GetRoomProperty("state");
			if(state == this.ShareDefine.RoomState_Playing){
				app[app.subGameName+"_GameManager"]().SendDissolveRoom(roomID, posName);
				return
			}
			//房主不能退出房间，只能解散
            if (this.RoomMgr.GetEnterRoom().IsClientIsOwner()) {
               app[app.subGameName+"_GameManager"]().SendDissolveRoom(roomID, posName);
                return
            }
			app[app.subGameName+"_GameManager"]().SendExitRoom(roomID, ClientPos);
		}
	},
	OnUpdate:function(){
		//更新系统时间
		var DateNow = new Date();
		let Hours=DateNow.getHours();  
		let Minutes=DateNow.getMinutes();
		var month = DateNow.getMonth() + 1;
        var day = DateNow.getDate();

        month=this.ComTool.StringAddNumSuffix("", month, 2);
        day=this.ComTool.StringAddNumSuffix("", day, 2);
		Hours=this.ComTool.StringAddNumSuffix("", Hours, 2);
		Minutes=this.ComTool.StringAddNumSuffix("", Minutes, 2);
		this.now_day.string=month+'-'+day;
		this.now_time.string=Hours+":"+Minutes;
	},
});