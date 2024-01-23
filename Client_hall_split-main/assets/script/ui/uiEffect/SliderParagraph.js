/*
    SliderParagraph 滑动进度分段
*/

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        //拆分为几段
        ParagraphCount: 4,
        ScrollThreshold: 0.5,
	    EventNode:cc.Node,
    },

    // use this for initialization
    OnLoad: function () {
    	if(this.isOnLoad)//艹尼玛的creator虾几把onload active=false不会onload
    		return;
    	this.isOnLoad = true;
	    this.JS_Name = this.node.name + "_SliderParagraph";

	    this.ComTool = app.ComTool();

    	this.slider = this.node.getComponent(cc.Slider);

	    this.node.on('slide', this.OnSlideEvent, this);

    	//获取button对象
	    //let buttonNode = this.slider.handle.node;
	    //buttonNode.on('touchend', this.OnTouchEnded, this);
	    //buttonNode.on('touchcancel', this.OnTouchCancelled, this);

	    this.UpdateSecond = 0.1;

        this.paragraphPositionDict = {};
        this.progressValueDict = {};
        this.keyIDList = [];
        this.showDataList = [];

	    //设置默认的分段信息
	    let keyIDList = this.ComTool.Range(0, this.ParagraphCount+1);
	    this.InitData(keyIDList);

    },

	OnSlideEvent:function(){
		this.isSend = false;
	},

	InitData:function(keyIDList, showDataList=[]){
		if(!this.isOnLoad)
			this.OnLoad();
		this.passSecond = 0;
		this.isSend = false;

		this.paragraphPositionDict = {};
		this.progressValueDict = {};

		let keyCount = keyIDList.length;
		if(!keyCount){
			this.ErrLog("InitData keyIDList empty", keyIDList);
			return
		}
		//如果只有一个则设置开始结束一样
		else if(keyCount == 1){
			keyIDList.push(keyIDList[0]);
			keyCount = keyIDList.length;
		}
		this.keyIDList = keyIDList;
		this.showDataList = showDataList;

		let offProgress = this.ScrollThreshold*1/(keyCount-1);

		for(let index=0; index<keyCount; index++){

			let keyID = keyIDList[index];
			let progress = index/(keyCount-1);

			let minProgress = progress - offProgress;
			let maxProgress = progress + offProgress;

			if(minProgress < 0){
				minProgress = 0;
			}

			if(maxProgress > 1){
				maxProgress = 1;
			}

			//分段每个点的进度位置,最小最大进入范围
			this.paragraphPositionDict[index] = {
														"KeyID":keyID,
														"Progress":progress,
														"MinProgress":minProgress,
														"MaxProgress":maxProgress,
													};

			this.progressValueDict[progress] = keyID;
		}

		this.ShowBackgroundLabel(showDataList)
		//初始化默认从0开始
		this.slider.progress = 0;

	},

	ShowBackgroundLabel:function(showDataList){

		let backGroundNode = this.node.getChildByName("Background");
		let count = showDataList.length;

		for(let index=count; index>0; index--){
			let childName = this.ComTool.StringAddNumSuffix("yuandian", index, 2);
			let childPath = [childName, "lb"].join("/");
			let labelNode = cc.find(childPath, backGroundNode);
			if(!labelNode){
				this.ErrLog("ShowBackgroundLabel not find:%s,%s", childPath, this.node.name);
				continue
			}
			let childLabel = labelNode.getComponent(cc.Label);
			childLabel.string = showDataList[index-1];
		}
	},

	update:function(passSecond){
		this.passSecond += passSecond;

		if(this.passSecond >= this.UpdateSecond){
			this.ResetProgress();
			this.passSecond = 0;
		}
	},


	ResetProgress:function(){

		let nowProgress = this.slider.progress;

		if(this.progressValueDict.hasOwnProperty(nowProgress)){
			if(this.isSend){
				return
			}
			if(this.EventNode){
				this.EventNode.emit("SliderParagraph",  {"KeyID":this.progressValueDict[nowProgress],"Node":this.node});
			}
			this.isSend = true;
			return
		}

		//遍历所有的坐标进度点
		for(let index in this.paragraphPositionDict){
			let paragraphPositionDict = this.paragraphPositionDict[index];
			//查找当前进度位置停留值
			if(paragraphPositionDict["MinProgress"] <= nowProgress && nowProgress <= paragraphPositionDict["MaxProgress"]){

				let progress = paragraphPositionDict["Progress"];
				//如果正在滑动中跳出
				if( this.slider._dragging){
				}
				else{
					this.slider.progress = progress;
				}
				if(this.EventNode){
					this.EventNode.emit("SliderParagraph",  {"KeyID":paragraphPositionDict["KeyID"],"Node":this.node});
				}
				this.isSend = true;
				break
			}
		}
	},

	//设置滑动到指定key位置
	SetChooseKeyID:function(keyID){
		for(let index in this.paragraphPositionDict){
			let paragraphPositionDict = this.paragraphPositionDict[index];
			if(paragraphPositionDict["KeyID"] == keyID){
				this.slider.progress = paragraphPositionDict["Progress"];
				if(this.EventNode){
					this.EventNode.emit("SliderParagraph",  {"KeyID":keyID,"Node":this.node});
				}
				this.isSend = true;
				return
			}
		}
		this.ErrLog("SetChooseKeyID(%s) not find", keyID);
	},

	//获取当前选中的keyID
	GetChooseKeyID:function(){
		let nowProgress = this.slider.progress;

		for(let index in this.paragraphPositionDict){
			let paragraphPositionDict = this.paragraphPositionDict[index];
			//查找当前进度位置停留值
			if(paragraphPositionDict["MinProgress"] <= nowProgress && nowProgress <= paragraphPositionDict["MaxProgress"]){
				return paragraphPositionDict["KeyID"]
			}
		}
		this.ErrLog("GetChooseKeyID not find:%s", nowProgress, this.paragraphPositionDict);
		return 0
	},

	GetProgressNodeByKeyID:function(keyID){
		let index = this.keyIDList.indexOf(keyID);
		if(index == -1){
			this.ErrLog("GetProgressNodeByKeyID(%s) not find", keyID);
			return
		}

		let childName = this.ComTool.StringAddNumSuffix("yuandian", index + 1, 2);
		let backGroundNode = this.node.getChildByName("Background");
		let progressNode = cc.find(childName, backGroundNode);
		if(!progressNode){
			this.ErrLog("GetProgressNodeByKeyID(%s) not find", childName);
			return
		}
		return progressNode;
	},

});
