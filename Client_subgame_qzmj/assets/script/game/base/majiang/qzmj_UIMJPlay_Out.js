/*
 显示位置打出去的牌
 */

let app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseComponent"),

	properties: {
	},

	// use this for initialization
	OnLoad: function () {
		this.name=app.subGameName+"_UIMJPlay_Out";
		this.JS_Name = this.node.name + "_UIMJPlay_Out";
		this.LocalDataManager=app.LocalDataManager();
		this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
		this.ChildCount = 4;
		this.PaiChildCount = 21;
		this.effectComponent = null;
		this.ComTool = app[app.subGameName+"_ComTool"]();
		this.SysDataManager = app[app.subGameName+"_SysDataManager"]();
		this.EffectManager = app[app.subGameName+"_EffectManager"]();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.is3DShow=1;
		this.HideAllChild();
	},
	SetEffectNull:function(){
		this.effectComponent = null;
	},
	HideAllChild:function(){
		if(this.node.name=='nd_out'){
			for(let index=1; index <= this.ChildCount; index++){
				let childName = this.ComTool.StringAddNumSuffix("out", index, 1);
				let childNode = this.node.getChildByName(childName);
				if(!childNode){
					this.ErrLog("HideAllChild not find:%s", childName);
					continue
				}
				for(let paiIndex=1; paiIndex <= this.PaiChildCount; paiIndex++){
					let childName = this.ComTool.StringAddNumSuffix("pai", paiIndex, 1);
					let paiNode = childNode.getChildByName(childName);
					if(!paiNode){
						continue
					}
					//paiNode.removeAllChildren();
					this.removeChildren(paiNode);
					paiNode.getComponent(cc.Sprite).spriteFrame = null;
					// paiNode.getChildByName('da').active=false;
				}
			}
		}else if(this.node.name=='hua'){
			for(let index=1; index <= 8; index++){
				let childName = this.ComTool.StringAddNumSuffix("hua",index, 1);
				let childNode=cc.find(childName, this.node);
				if(childNode!=null){
					childNode.active=false;
				}
			}
		}
	},

	ShowTipOutCard:function(cardID){
		let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
		let jin1=roomSet.get_jin1();
		let jin2=roomSet.get_jin2();
		for(let index=1; index <= this.ChildCount; index++){
			let childName = this.ComTool.StringAddNumSuffix("out", index, 1);
			let childNode = this.node.getChildByName(childName);
			if(!childNode){
				this.ErrLog("HideAllChild not find:%s", childName);
				continue
			}
			for(let paiIndex=1; paiIndex <= this.PaiChildCount; paiIndex++){
				let childName = this.ComTool.StringAddNumSuffix("pai", paiIndex, 1);
				let paiNode = childNode.getChildByName(childName);
				if(!paiNode){
					continue
				}
				if((jin1>0 && paiNode.CardType==Math.floor(jin1/100)) || (jin2>0 && paiNode.CardType==Math.floor(jin2/100))){
					paiNode.color=cc.color(255,255,0);
				}else{
					if(Math.floor(cardID/100)==paiNode.CardType){
						paiNode.color=cc.color(0,255,0);
					}else{
						paiNode.color=cc.color(255,255,255);
					}
				}
			}

		}
	},
	
	//显示所有打出的牌
	ShowAllOutCard:function(){
		let room = this.RoomMgr.GetEnterRoom();
		if(!room){
			this.ErrLog("ShowAllOutCard not enter room");
			this.HideAllChild();
			return
		}
		this.ShowOutCard(room);
	},
	DaCard:function(outCardList){
		var new_outCardList=[];
        let count=outCardList.length;
        let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
        let jin1=roomSet.get_jin1();
		for(let index=0; index<count; index++){
			let cardID = outCardList[index];
			if(cardID>0 && Math.floor(jin1/100)==Math.floor(cardID/100)){
			    new_outCardList.push(cardID);
			}
		}
		return new_outCardList;
	},
	OutCard:function(outCardList){
	    var new_outCardList=new Array();
        let count=outCardList.length;
        var i=0;
        let room = this.RoomMgr.GetEnterRoom();
		let roomSet = room.GetRoomSet();
        let jin1=roomSet.get_jin1();
	    /*for(let index=0; index<count; index++){
			let cardID = outCardList[index];
			if(cardID>5000){
			    new_outCardList[i]=cardID;
			    i++;
			}
		}*/
		for(let index=0; index<count; index++){
			let cardID = outCardList[index];
			if(cardID<=5000 && cardID>0){
			    new_outCardList[i]=cardID;
			    i++;
			}
		}
		return new_outCardList;
		
	},
	OutCard2:function(outCardList){
	    var new_outCardList=new Array();
        let count=outCardList.length;
        var i=0;
	    for(let index=0; index<count; index++){
			let cardID = outCardList[index];
			if(cardID>5000){
			    new_outCardList[i]=cardID;
			    i++;
			}
		}
		for(let index=0; index<count; index++){
			let cardID = outCardList[index];
			if(cardID<=5000 && cardID>0){
			    new_outCardList[i]=cardID;
			    i++;
			}
		}
		return new_outCardList;
		
	},
	HuaCard:function(outCardList){
		var new_outCardList=new Array();
		let count=outCardList.length;
		var i=0;
		//过滤掉花牌
		for(let index=0; index<count; index++){
			let cardID = outCardList[index];
			if(cardID>5000){
				new_outCardList[i]=cardID;
				i++;
			}
		}
		return new_outCardList;

	},
	ShowJinBg:function(cardID,childNode,jin1=0,jin2=0){
		// childNode.color=cc.color(255,255,255);
		if(jin1===0){
    		let room = this.RoomMgr.GetEnterRoom();
			let roomSet = room.GetRoomSet();
			jin1=roomSet.get_jin1();
			jin2=roomSet.get_jin2();
		}
		if (Math.floor(cardID/100) == Math.floor(jin1/100) || Math.floor(cardID/100) == Math.floor(jin2/100)) {
			childNode.color=cc.color(255,255,0);
		}else{
			childNode.color=cc.color(255,255,255);
		}
	},
	ShowOutCard2:function(outcard,jin1=0,jin2=0,imageString){
		let outCardList = this.OutCard2(outcard);
		let count = outCardList.length;
		let layOutIndex = 1;
		let paiIndex = 1;
		let forNum = 0;
		let waitReceiveCardID=0;
		let effectName = "";
		//显示打出去的牌
		for(let index=forNum; index<count; index++){
			let cardID = outCardList[index];
			let childName = this.ComTool.StringAddNumSuffix("out", layOutIndex, 1);
			let OutNode=cc.find(childName, this.node);
			let PaiChildCount=OutNode.childrenCount;
			let paiChildName = this.ComTool.StringAddNumSuffix("pai", paiIndex, 1);
			let childPath = [childName, paiChildName].join("/");
			let childNode = cc.find(childPath, this.node);
			if(!childNode){
				this.ErrLog("ShowOutCard not find:%s", childPath);
				continue
			}
			//childNode.removeAllChildren();
			this.removeChildren(childNode);
			this.ShowJinBg(cardID,childNode,jin1,jin2);
			this.ShowImage(childNode, imageString, cardID, waitReceiveCardID, effectName);
			paiIndex += 1;
			if(paiIndex > PaiChildCount){
				paiIndex = 1;
				layOutIndex += 1;
			}
		}
		//隐藏掉剩余的卡牌
		for(; layOutIndex <= this.ChildCount; layOutIndex++){
			for(; paiIndex <= this.PaiChildCount; paiIndex++){
				let childName = this.ComTool.StringAddNumSuffix("out", layOutIndex, 1);
				let paiChildName = this.ComTool.StringAddNumSuffix("pai", paiIndex, 1);
				let childPath = [childName, paiChildName].join("/");
				let childNode = cc.find(childPath, this.node);
				if(!childNode){
					continue
				}
				//childNode.removeAllChildren();
				this.removeChildren(childNode);
				let childSprite = childNode.getComponent(cc.Sprite);
				if(!childSprite){
					this.ErrLog("hide ShowOutCard(%s) not find childSprite", childPath);
					continue
				}
				childSprite.spriteFrame = null;
			}
			paiIndex = 1;
		}
		
	},
	ShowDaCard:function(){
		let room = this.RoomMgr.GetEnterRoom();
		let nodeParentName = this.node.parent.name;
		let roomPosMgr = room.GetRoomPosMgr();
		let pos = 0;
		//需要获取当前本家位置ID
		let imageString = "";
		let effectName = "";
		if(nodeParentName == "sp_seat01"){
			pos = roomPosMgr.GetClientPos();
			imageString = "EatCard_Self_";
			effectName = "OutCatTip";
		}
		else if(nodeParentName == "sp_seat02"){
			pos = roomPosMgr.GetClientDownPos();
			imageString = "OutCard_Down_";
			effectName = "OutCatTip2";
		}
		else if(nodeParentName == "sp_seat03"){
			pos = roomPosMgr.GetClientFacePos();
			imageString = "EatCard_Self_";
			effectName = "OutCatTip";
		}
		else{
			pos = roomPosMgr.GetClientUpPos();
			imageString = "OutCard_Up_";
			effectName = "OutCatTip2";
		}
		if(-1 == pos)
			return;
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(pos);
		if(!setPos){
			this.ErrLog("ShowOutCard(%s) not find:%s", nodeParentName, pos);
			return
		}
		let waitReceiveCardID = roomSet.GetRoomSetProperty("waitReciveCard");
		let outCardList = this.DaCard(setPos.GetSetPosProperty("outCard"));
		// let daList=setPos.GetSetPosProperty("daList");
		let count = outCardList.length;
		let clientPos = roomPosMgr.GetClientPos();
		let facePos = roomPosMgr.GetClientFacePos();
		//显示打出去的牌
		for(let index=0; index<=3; index++){
			let childName = this.ComTool.StringAddNumSuffix("pai", index+1, 1);
			let childNode=cc.find(childName, this.node);
			let cardID = outCardList[index];
			if(!childNode){
				this.ErrLog("hide ShowOutCard(%s) not find childSprite", childName);
				continue;
			}
			this.removeChildren(childNode);
			if(cardID>0){
				this.ShowJinBg(cardID,childNode);
				this.ShowImage(childNode, imageString, cardID, waitReceiveCardID, effectName);
				//显示头搭二搭被搭
				// this.ShowDa(childNode.getChildByName('da'),cardID,daList);
				//显示头搭二搭被搭
			}else{
				this.removeChildren(childNode);
				let childSprite = childNode.getComponent(cc.Sprite);
				if(!childSprite){
					this.ErrLog("hide ShowOutCard(%s) not find childSprite", childPath);
					continue
				}
				childSprite.spriteFrame = null;
				// childNode.getChildByName('da').active=false;
			}
		}
	},
	ShowOutCard:function(room){
		//sp_seat01
		let nodeParentName = this.node.parent.name;
		let roomPosMgr = room.GetRoomPosMgr();
		let pos = 0;
		//需要获取当前本家位置ID
		let imageString = "";
		let effectName = "";
		if(nodeParentName == "sp_seat01"){
			pos = roomPosMgr.GetClientPos();
			imageString = "OutCard_Self_";
			effectName = "OutCatTip";
		}
		else if(nodeParentName == "sp_seat02"){
			pos = roomPosMgr.GetClientDownPos();
			imageString = "OutCard_Down_";
			effectName = "OutCatTip2";
		}
		else if(nodeParentName == "sp_seat03"){
			pos = roomPosMgr.GetClientFacePos();
			imageString = "OutCard_Self_";
			effectName = "OutCatTip";
		}
		else{
			pos = roomPosMgr.GetClientUpPos();
			imageString = "OutCard_Up_";
			effectName = "OutCatTip2";
		}
		if(-1 == pos)
			return;
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(pos);
		if(!setPos){
			this.ErrLog("ShowOutCard(%s) not find:%s", nodeParentName, pos);
			return
		}
		let waitReceiveCardID = roomSet.GetRoomSetProperty("waitReciveCard");

		let outCardList = this.OutCard(setPos.GetSetPosProperty("outCard"));
		//let daList=setPos.GetSetPosProperty("daList");
		let count = outCardList.length;
		let clientPos = roomPosMgr.GetClientPos();
		let facePos = roomPosMgr.GetClientFacePos();
		let layOutIndex = 1;
		let paiIndex = 1;
		let forNum = 0;
		//显示打出去的牌
		for(let index=forNum; index<count; index++){
			let cardID = outCardList[index];
			let childName = this.ComTool.StringAddNumSuffix("out", layOutIndex, 1);
			let OutNode=cc.find(childName, this.node);
			let PaiChildCount=OutNode.childrenCount;
			let paiChildName = this.ComTool.StringAddNumSuffix("pai", paiIndex, 1);
			let childPath = [childName, paiChildName].join("/");
			let childNode = cc.find(childPath, this.node);
			if(!childNode){
				this.ErrLog("ShowOutCard not find:%s", childPath);
				continue
			}
			//childNode.removeAllChildren();
			this.removeChildren(childNode);
			this.ShowJinBg(cardID,childNode);
			this.ShowImage(childNode, imageString, cardID, waitReceiveCardID, effectName);
			/*//显示头搭二搭被搭
			this.ShowDa(childNode.getChildByName('da'),cardID,daList);
			//显示头搭二搭被搭*/
			paiIndex += 1;
			if(paiIndex > PaiChildCount){
				paiIndex = 1;
				layOutIndex += 1;
			}
		}
		//隐藏掉剩余的卡牌
		for(; layOutIndex <= this.ChildCount; layOutIndex++){
			for(; paiIndex <= this.PaiChildCount; paiIndex++){
				let childName = this.ComTool.StringAddNumSuffix("out", layOutIndex, 1);
				let paiChildName = this.ComTool.StringAddNumSuffix("pai", paiIndex, 1);
				let childPath = [childName, paiChildName].join("/");
				let childNode = cc.find(childPath, this.node);
				if(!childNode){
					continue
				}
				//childNode.removeAllChildren();
				this.removeChildren(childNode);
				let childSprite = childNode.getComponent(cc.Sprite);
				if(!childSprite){
					this.ErrLog("hide ShowOutCard(%s) not find childSprite", childPath);
					continue
				}
				childSprite.spriteFrame = null;
				// childNode.getChildByName('da').active=false;
			}
			paiIndex = 1;
		}
	},
	ShowHuaCard:function(){
		//花牌
		let room = this.RoomMgr.GetEnterRoom();
		let nodeParentName = this.node.parent.name;
		let roomPosMgr = room.GetRoomPosMgr();
		let pos = 0;
		if(nodeParentName == "sp_seat01"){
			pos = roomPosMgr.GetClientPos();
		}
		else if(nodeParentName == "sp_seat02"){
			pos = roomPosMgr.GetClientDownPos();
		}
		else if(nodeParentName == "sp_seat03"){
			pos = roomPosMgr.GetClientFacePos();
		}
		else{
			pos = roomPosMgr.GetClientUpPos();
		}
		if(-1 == pos)
			return;
		//显示花牌
		let roomSet = room.GetRoomSet();
		let setPos = roomSet.GetSetPosByPos(pos);
		if(!setPos){
			this.ErrLog("ShowOutCard(%s) not find:%s", nodeParentName, pos);
			return
		}
		let huaCardList = this.HuaCard(setPos.GetSetPosProperty("outCard"));
		let huaCount = huaCardList.length;
		//显示打出去的牌
		for(let index=0; index<huaCount; index++){
			let cardID = huaCardList[index];
			let childName = this.ComTool.StringAddNumSuffix("hua",index+1, 1);
			let childNode=cc.find(childName, this.node);
			this.ShowHuaImg(childNode, cardID);
			childNode.active=true;
		}
		//隐藏多余的话
		for(let i=huaCount;i<8;i++){
			let childName = this.ComTool.StringAddNumSuffix("hua",i+1, 1);
			let childNode=cc.find(childName, this.node);
			childNode.active=false;
		}
	},
	ShowHuaImg:function(childNode, cardID){
		let childSprite = childNode.getComponent(cc.Sprite);
		if(!childSprite){
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}
		childNode.CardType=Math.floor(cardID/100);
		let imageName = ['hua_', Math.floor(cardID/100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if(!imageInfo){
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];

		let that = this;
		app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function(spriteFrame){
				if(!spriteFrame){
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;
			})
			.catch(function(error){
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
	},
	removeChildren:function(childNode){
		let delNode=null;
		if(!childNode.children){
			return;
		}
		for(let i=0;i<childNode.children.length;i++){
			if(childNode.children[i].name!='da'){
				delNode=childNode.children[i];
				break;
			}
		}
		if(delNode!=null){
			childNode.removeChild(delNode);
		}
	},
	ShowDa:function(childNode,cardID,daList){
		let touda=daList[0];
		let erda=daList[1];
		let beida=daList[2];
		let daId=0;
		if(touda.length>0){
			for(let i=0;i<touda.length;i++){
				if(cardID==touda[i]){
					daId=1;
					break;
				}
			}
		}
		if(erda.length>0){
			for(let i=0;i<erda.length;i++){
				if(cardID==erda[i]){
					daId=2;
					break;
				}
			}
		}
		if(beida.length>0){
			for(let i=0;i<beida.length;i++){
				if(cardID==beida[i]){
					daId=3;
					break;
				}
			}
		}
		if(daId>0){
			let imageName = "da_"+daId;
			let imageInfo = this.IntegrateImage[imageName];
			if(!imageInfo){
				this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
				return
			}
			let imagePath = imageInfo["FilePath"];
			let that = this;
			let childSprite = childNode.getComponent(cc.Sprite);
			app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
				.then(function(spriteFrame){
					if(!spriteFrame){
						that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
						return
					}
					childSprite.spriteFrame = spriteFrame;
				})
				.catch(function(error){
					that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			    }
			);
			childNode.active=true;
		}else{
			childNode.active=false;
		}
	},
	ShowImage:function(childNode, imageString, cardID, waitReceiveCardID, effectName){

		let childSprite = childNode.getComponent(cc.Sprite);
		if(!childSprite){
			this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}
		childNode.CardType=Math.floor(cardID/100);
		//需要先隐藏？会出现闪屏渲染
		//childSprite.spriteFrame = null;

		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID/100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if(!imageInfo){
			this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];

		let that = this;
		app[app.subGameName+"_ControlManager"]().CreateLoadPromise(imagePath, cc.SpriteFrame)
			.then(function(spriteFrame){
				if(!spriteFrame){
					that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
					return
				}
				//记录精灵图片对象
				childSprite.spriteFrame = spriteFrame;

				//如果卡牌ID 是当前打出的牌,加特效
				if(waitReceiveCardID == cardID){
					that.AddWndEffect(childNode, effectName);
				}

			})
			.catch(function(error){
				that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
			});
	},

	AddWndEffect:function(childNode, effectName){

		let that = this;
		this.removeChildren(childNode);
		if(that.effectComponent){
			this.effectComponent.AddModelToParent(childNode, this.node);
			this.effectComponent.ShowEffect();
		}
		else{
			this.EffectManager.CreateEffectByEffectRes(effectName, effectName, 0)
				.then(function(effectComponent){
					effectComponent.AddModelToParent(childNode, that.node);
					effectComponent.ShowEffect();
					that.effectComponent = effectComponent;
				})
				.catch(function(error){
					that.ErrLog("error:%s", error.stack);
				})
		}


	},


});
