/*
 SliderProgressBarParagraph.js 滑动进度分段带进度条显示
 */

var app = require("qzmj_app");

cc.Class({
	extends: require(app.subGameName + "_BaseComponent"),

	properties: {
		ScrollThreshold: 0.5,
		EventNode:cc.Node,
		ProgressBar:cc.ProgressBar,
	},

	// use this for initialization
	OnLoad: function () {
		this.JS_Name = this.node.name + "_SliderProgressBarParagraph";

        this.ComTool = app[app.subGameName + "_ComTool"]();


		this.slider = this.node.getComponent(cc.Slider);

		this.paragraphPositionDict = {};

        this.LocalDataManager = app.LocalDataManager();

	},

	InitData:function(keyIDList, showDataList=[], isSendEvent=true){
		this.paragraphPositionDict = {};

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

		}

		if(showDataList.length){
            this.ShowBackgroundLabel(showDataList)
        }
		//初始化默认从0开始
		this.slider.progress = 0;

		if(isSendEvent){
            this.OnSliderEvent(this.slider);
        }
	},

	ShowBackgroundLabel:function(showDataList){

		let backGroundNode = this.node.getChildByName("Background");
		let count = showDataList.length;

		for(let index=count; index>0; index--){
			let childName = this.ComTool.StringAddNumSuffix("yuandian",index,2);
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

    OnSliderEvent:function(slider){
        this.ResetProgress();

        if(this.ProgressBar){
            this.ProgressBar.progress = this.slider.progress;
        }
    },

	ResetProgress:function(){

		let nowProgress = this.slider.progress;

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
					this.EventNode.emit("SliderParagraph",  {"KeyID":paragraphPositionDict["KeyID"], "Node":this.node,"Progress":progress});
				}
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
				this.OnSliderEvent(this.slider);
				return
			}
		}
		this.ErrLog("SetChooseKeyID(%s) not find:", keyID, this.paragraphPositionDict);
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

});
