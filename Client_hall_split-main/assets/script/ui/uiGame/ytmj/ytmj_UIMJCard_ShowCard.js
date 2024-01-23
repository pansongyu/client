/*
 UICard01-04 set结束摊牌
 */

let app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
		sp_in:cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.JS_Name = this.node.name + "_UIMJCard_ShowCard";
		this.ComTool = app.ComTool();
		this.SysDataManager = app.SysDataManager();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.ChildCount = 16; //最多发16张牌
		this.HideAllChild();
	},

	HideAllChild:function(){
		for(let index=1; index <= this.ChildCount; index++){
			let childName = this.ComTool.StringAddNumSuffix("card", index, 2);
			let childNode = this.node.getChildByName(childName);
			if(!childNode){
				continue
			}
			let cardSprite = childNode.getComponent(cc.Sprite);
			cardSprite.spriteFrame = null;
		}
		this.sp_in.getComponent(cc.Sprite).spriteFrame=null;
	},
	ShowDownCard:function(cardIDList,handCard,jin1,jin2,imageString="EatCard_Self_"){
		this.ShowDownImg(cardIDList,handCard,imageString,jin1,jin2);
	},
	ShowJinBg:function(cardID,childNode,jin1=0,jin2=0){
		if(jin1==0){
			let room = this.RoomMgr.GetEnterRoom();
			let roomSet = room.GetRoomSet();
			jin1=roomSet.get_jin1();
			jin2=roomSet.get_jin2();
		}
		if (Math.floor(cardID/100) == Math.floor(jin1/100) || Math.floor(cardID/100) == Math.floor(jin2/100)) {
			if (cardID != 0) {
				childNode.color=cc.color(255,255,0);
				childNode.getChildByName('da').active = true;
			} else {
				childNode.color=cc.color(255,255,255);
				childNode.getChildByName('da').active = false;
			}
		}else{
			childNode.color=cc.color(255,255,255);
			childNode.getChildByName('da').active = false;
		}
	},
	//显示底牌
	ShowAllDownCard:function(){
		let room = this.RoomMgr.GetEnterRoom();
		if(!room){
			this.ErrLog("ShowAllDownCard not enter room");
			return
		}
		//UICard01
		let nodeParentName = this.node.parent.name;
		let roomPosMgr = room.GetRoomPosMgr();
		let pos = 0;
		//需要获取当前本家位置ID
		let imageString = "";
		if(nodeParentName == "UI"+this.GameTyepStringUp()+"Card01"){
			pos = roomPosMgr.GetClientPos();
			imageString = "EatCard_Self_";
		}
		else if(nodeParentName == "UI"+this.GameTyepStringUp()+"Card02"){
			pos = roomPosMgr.GetClientDownPos();
			imageString = "EatCard_Down_";
		}
		else if(nodeParentName == "UI"+this.GameTyepStringUp()+"Card03"){
			pos = roomPosMgr.GetClientFacePos();
			imageString = "EatCard_Self_";
		}
		else{
			pos = roomPosMgr.GetClientUpPos();
			imageString = "EatCard_Up_";
		}
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(pos);
		if(!setPos){
			this.ErrLog("ShowAllDownCard(%s) not find:%s", nodeParentName, pos);
			return
		}
		let cardIDList = setPos.GetSetPosProperty("shouCard");
		let handCard = setPos.GetSetPosProperty("handCard");
		this.ShowDownImg(cardIDList,handCard,imageString,0,0);
	},
	ShowDownImg:function(cardIDList,handCard=0,imageString,jin1=0,jin2=0){
		let count=0;
		if(typeof(cardIDList)!="undefined"){
			count = cardIDList.length;
		}
		for(let index=0; index<count; index++){
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if(!childNode){
				this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			this.ShowJinBg(cardID,childNode,jin1,jin2);
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID,jin1,jin2);
		}
		//设置多余的卡牌位置空
		for(let cardIndex=count+1; cardIndex <= this.ChildCount; cardIndex++){
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if(!childNode){
				continue
			}
			childNode.active = 0;
		}
		//进卡不能控制显影只能设置空图片
		if (handCard > 0 && handCard != 5000) {
			this.sp_in.active = true;
			// this.ShowJinBg(handCard, this.sp_in, jin1, jin2);
			this.ShowImage(this.sp_in, imageString, handCard, jin1, jin2);
			if (Math.floor(handCard/100) == Math.floor(jin1/100) || Math.floor(handCard/100) == Math.floor(jin2/100)) {
				this.sp_in.getChildByName('da').active = true;
			} else {
				this.sp_in.getChildByName('da').active = false;
			}
		} else {
			this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
			this.sp_in.UserData = null;
			this.sp_in.getChildByName('da').active = false;
		}
	},
	ShowImage:function(childNode, imageString, cardID){
		let childSprite = childNode.getComponent(cc.Sprite);
		if(!childSprite){
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}

		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID/100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if(!imageInfo){
			this.ErrLog("fuck ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		//图片没有变化
		if(childNode.UserData == imageName){

			this.Log("UserData:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
		if(app['majiang_'+imageName]){
			childSprite.spriteFrame = app['majiang_'+imageName];
			childNode.UserData = imageName;
		}else{
			let that = this;
			app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function(spriteFrame){
					if(!spriteFrame){
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					//记录精灵图片对象
					childSprite.spriteFrame = spriteFrame;
					childNode.UserData = imageName;
					app['majiang_' + imageName] = spriteFrame;
				})
				.catch(function(error){
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
				});
		}
	},
});