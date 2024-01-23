/*
    SliderShowValue 滑动进度2进制增长带值显示
*/

var app = require("app")

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        //显示最大值文本
        MaxLabel: cc.Label,
        //显示当前文本
        NowLabel: cc.Label,
    },

    // use this for initialization
    OnLoad: function () {

	    this.JS_Name = this.node.name + "_SliderShowValue";

	    this.SoundManager = app.SoundManager();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
    	this.slider = this.node.getComponent(cc.Slider);

    	this.maxValue = 0;
    	this.minValue = 0;
	    //每次变化的进度
	    this.addProgress = 0.02;

	    this.progressAddValueDict = {};
    },

    InitSlider:function(minValue, maxValue){

	    this.minValue = minValue;
	    this.maxValue = maxValue;

	    //最小值比最大值大
	    if(minValue > maxValue){
		    this.minValue = maxValue;
	    }

	    this.progressAddValueDict = {};

	    //取最大值是2的几次方
	    let disValue = this.maxValue - this.minValue;
	    let maxCount = 0;
	    if(disValue > 0){

		    //微信没有存在log2接口
		    if(Math.log2){
			    maxCount = Math.ceil(Math.log2(disValue));
		    }
		    else{
			    maxCount =  Math.ceil(Math.log(disValue)*Math.LOG2E)
		    }
	    }

	    //至少1个刻度
	    if(maxCount <= 0){
		    maxCount = 1;
	    }

	    for(let index=1; index<=maxCount; index++){
		    let progress = index/maxCount;
		    let addValue = Math.pow(2, index);

		    let value = this.minValue + addValue;
		    //已经是最后一个值了
		    if(value >= this.maxValue){
			    this.progressAddValueDict[progress] = this.maxValue;
		    }
		    else{
			    this.progressAddValueDict[progress] = value;
		    }
	    }

	    if(disValue != 0){
		    //取最小进度的一半做为其实进度
		    let minProgress = (1/maxCount)/2;
		    //最小进度不能大于0.05
		    if(minProgress > this.addProgress){
			    minProgress = this.addProgress
		    }
		    this.progressAddValueDict[minProgress] = this.minValue
		    //每次变化的进度
		    this.addProgress = 0.02;
	    }
	    else{
		    //如果最大最小值是一样的 每次增加1
		    this.addProgress = 1;
	    }

	    if(this.MaxLabel){
		    this.MaxLabel.string = this.maxValue;
	    }

        this.ShowValue();
    },


    ChangeProgress:function(isAdd){
        let nowProgress = this.slider.progress;

        if(isAdd){
        	if(nowProgress == 1){
        		return 1
        	}
        	nowProgress += this.addProgress;
        }
        else{
        	if(!nowProgress){
        		return 0
        	}
        	nowProgress -= this.addProgress;
        }

        if(nowProgress > 1){
            nowProgress = 1;
        }
        else if(nowProgress < 0){
            nowProgress = 0;
        }

        this.slider.progress = nowProgress;

        this.ShowValue();

        return nowProgress
    },

    ShowValue:function(){
    	let nowProgress = this.slider.progress;
		let nowText = "";

        if(nowProgress >= 1){
            this.SetWndImage(this.slider.handle, "AllInImage");
	        nowText = "";
        }
        else{
            this.SetWndImage(this.slider.handle, "NotAllInImage");

	        let progressList = Object.keys(this.progressAddValueDict);
	        //从大到小
	        progressList.SortList(true);
	        let count = progressList.length;
	        let nowValue = 0;

	        for(let index=0; index<count; index++){
		        let progress = progressList[index];
		        if(progress <= nowProgress){
			        nowValue = this.progressAddValueDict[progress];
			        break
		        }
	        }
	        nowText = nowValue;
        }

	    if(this.NowLabel){
		    this.NowLabel.string = nowText;
	    }

    },

    //设置精灵图片贴图
    SetWndImage:function(wndNode, value){

        let sprite = wndNode.getComponent(cc.Sprite);
        if(!sprite){
            this.ErrLog("SetWndImage(%s,%s) not find cc.Sprite", wndNode.name, value);
            return
        }

        let that = this;
        this.GetSpriteFrameByImageName(value)
            .then(function(spriteFrame){
                if(spriteFrame){
                    sprite.spriteFrame = spriteFrame;
                }
                else{
                    that.ErrLog("SetWndImage(%s,%s) load spriteFrame fail", wndNode.name, value);
                }
            })
            .catch(function(error){
                that.ErrLog("SetWndImage(%s,%s) error:%s", wndNode.name, value, error.stack);
            })

    },



    //获取图片的帧贴图对象
    GetSpriteFrameByImageName:function(imageName){
        let imageInfo = this.IntegrateImage[imageName];
        if(!imageInfo){
            this.ErrLog("GetSpriteFrameByImageName IntegrateImage.txt not find key(%s)", imageName);
            return app.bluebird.reject(new Error("IntegrateImage.txt not find image"));
        }
        let filePath = imageInfo["FilePath"];
        let fileName = imageInfo["FileName"];

        let resType = cc.SpriteFrame;
        //如果加载的是合图资源
        if(filePath.startsWith("atlas")){
            resType = cc.SpriteAtlas;
            if(!fileName){
                this.ErrLog("GetSpriteFrameByImageName(%s) use atlas(%s) need appoint FileName", imageName, filePath);
                return app.bluebird.reject(new Error("image in cc.SpriteAtlas not appint FileName"));
            }
        }
        let that = this;
        return app.ControlManager().CreateLoadPromise(filePath, resType)
                        .then(function(spriteFrame){

                            //如果是合图创建的模型,加载的是Atlas资源,需要获取文件名精灵帧
                            if(resType == cc.SpriteAtlas){
                                spriteFrame = spriteFrame.getSpriteFrame(fileName);
                            }

                            if(!spriteFrame){
                                that.ErrLog("GetSpriteFrameByImageName(%s) not find spriteFrame", imageName);
                                return
                            }
                            return spriteFrame
                        })
    },

    GetProgress:function(){
        return this.slider.progress
    },

    GetShowValue:function(){
	    if(!this.NowLabel){
		    this.ErrLog("GetShowValue not NowLabel");
		    return 0
	    }
        let value = Math.floor(this.NowLabel.string);
        return value
    },

    GetMaxValue:function(){
        this.maxValue
    },

});
