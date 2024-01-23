/*
 UICard01-04 set结束摊牌
 */

let app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseComponent"),

	properties: {
		
	},

	// use this for initialization
	OnLoad: function () {
		this.JS_Name = this.node.name + "_UIMJCard_ShowHua";
		this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
		//this.RoomMgr = app.RoomMgr();
		this.ShareDefine = app[app.subGameName+"_ShareDefine"]();
		this.ComTool = app[app.subGameName+"_ComTool"]();
		this.SysDataManager = app[app.subGameName+"_SysDataManager"]();
		this.EffectManager = app[app.subGameName+"_EffectManager"]();
		this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
		this.ChildCount = 8;
	},
	ShowHuaList:function(cardIDList,imageString='EatCard_Self_'){
		let count=0;
		if(typeof(cardIDList)!="undefined"){
			count = cardIDList.length;
		}
		cardIDList.sort();
		for(let index=0; index<count; index++){
			let cardID = cardIDList[index];
			let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
			let childNode = this.node.getChildByName(childName);
			if(!childNode){
				// this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			childNode.active = 1;
			this.ShowImage(childNode, imageString, cardID);
		}
		//设置多余的卡牌位置空
		for(let cardIndex=count+1; cardIndex <=this.ChildCount; cardIndex++){
			let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
			let childNode = this.node.getChildByName(childName);
			if(!childNode){
				// this.ErrLog("ShowAllDownCard not find childName:%s", childName);
				continue
			}
			childNode.active = 0;
		}
	},
	ShowImage:function(childNode, imageString, cardID){
		let childSprite = childNode.getComponent(cc.Sprite);
		if(!childSprite){
			// this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
			return
		}
		//取卡牌ID的前2位
		let imageName = [imageString, Math.floor(cardID/100)].join("");
		let imageInfo = this.IntegrateImage[imageName];
		if(!imageInfo){
			// this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
			return
		}
		let imagePath = imageInfo["FilePath"];
        if(app['majiang_'+imageName]){
		    childSprite.spriteFrame = app['majiang_'+imageName];
		}else{
		    let that = this;
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
			});
		}
	},



});
