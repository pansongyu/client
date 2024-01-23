/*
    ProgressTransition 进度条渐变组件
*/

var app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        //渐变总耗时秒
        TransDuration: 3,
        //更新间隔
        UpdateDuration: 0.1,

        TimeLable:cc.Label,
    },

    // use this for initialization
	OnLoad: function () {
	    this.JS_Name = this.node.name + "_ProgressTransition";

		this.SoundManager = app.SoundManager();
        this.InitData(this.TransDuration, this.UpdateDuration);

    },

	onDisable:function(){
		if(this.audioID){
			this.SoundManager.StopSoundByAudioID(this.audioID);
			this.audioID = 0;
		}
	},

    //初始化数据
    InitData:function(transDuration, updateDuration){

	    this.isPlaySound = false;
	    this.audioID = 0;

        this.TransDuration = transDuration;
        this.UpdateDuration = updateDuration;

        //总共可以更新的次数
        this.UpdateCount = Math.ceil(transDuration/updateDuration);

        this.ProgressBar = this.node.getComponent(cc.ProgressBar);

        //是否需要修改
        this.isNeedChange = false;

        //是否需要隐藏
        this.isWhetherHide = false;

        //是否递增变化
        this.isAddProgress = false;

        //流失的秒
        this.passSeconds = 0;

        this.endProgress = 0;

        //每次改变量
        this.tarnsValue = 0;

        this.endTick = 0;
    },

    //时间倒计时
    SetProgressByTime:function(transDuration=0, endTick=0, isNeedSound=false, isWhetherHide=false){

        //如果没有传倒计时长,取默认配置表
        if(!transDuration){
            transDuration = this.TransDuration
        }
        this.InitData(transDuration, this.UpdateDuration);

        let nowTick = app.ServerTimeManager().GetServerTimeData();
        //如果没有传递结束时间,取当前事件加时长
        if(!endTick){
            endTick = nowTick + this.TransDuration*1000;
        }
        //清空数据
        if(this.TimeLable){
            this.TimeLable.string = "";
        }

	    this.isPlaySound = isNeedSound;
	    this.audioID = 0;


        //倒计时已经结束
        if(nowTick >= endTick){
            this.ProgressBar.progress = 0;
            this.isWhetherHide = isWhetherHide;
            this.isNeedChange = false;
            return
        }

        let startProgress = (endTick - nowTick)/(this.TransDuration*1000)
        this.ProgressBar.progress = startProgress;

        this.endProgress = 0;
        this.isNeedChange = true;
        this.passSeconds = 0;
        this.endTick = endTick;
        
        this.tarnsValue = Math.abs(this.endProgress - startProgress)/this.UpdateCount;

    },

    //非时间倒计时进度变化
    SetProgress:function(endProgress, startProgress=-1){

        //默认-1 取当前值开始变化
        if(startProgress < 0){
            startProgress = this.ProgressBar.progress;
        }
        else if(startProgress > 1){
            this.WarnLog("SetProgress:%s startProgress error", startProgress);
            startProgress = 1;
        }
        this.ProgressBar.progress = startProgress;


        if(endProgress > 1){
            this.WarnLog("SetProgress:%s endProgress error", endProgress);
            endProgress = 1;
        }
        else if(endProgress < 0){
            this.WarnLog("SetProgress:%s endProgress error", endProgress);
            endProgress = 0;
        }


        if(endProgress == startProgress){
            this.isNeedChange = false;
            return
        }

        if(endProgress > startProgress){
            this.isAddProgress = true;
        }
        else{
            this.isAddProgress = false;
        }

        this.endProgress = endProgress;
        this.isNeedChange = true;
        this.passSeconds = 0;
        
        this.tarnsValue = Math.abs(endProgress - startProgress)/this.UpdateCount;

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!this.isNeedChange){
            this.node.active = this.isWhetherHide;
            return
        }

        this.passSeconds += dt;
        if(this.passSeconds < this.UpdateDuration){
            return
        }
        this.passSeconds = 0;

        let nowProgress = this.ProgressBar.progress;

        if(this.isAddProgress){

            nowProgress += this.tarnsValue;

            if(nowProgress >= this.endProgress){
                this.isNeedChange = false;
                this.ProgressBar.progress = this.endProgress;
                return
            }
        }
        else{

            nowProgress -= this.tarnsValue;

            if(nowProgress <= this.endProgress){
                this.isNeedChange = false;
                this.ProgressBar.progress = this.endProgress;
                return
            }
        }

        this.ProgressBar.progress = nowProgress;

        if(this.TimeLable){

            let nowServerTick = app.ServerTimeManager().GetServerTimeData();
            let leftSec = Math.floor((this.endTick - nowServerTick)/1000);
            if(leftSec < 8 && this.isPlaySound && !this.audioID){

                var that = this;
                this.audioID = 0;
                this.SoundManager.PlaySound("TimeOut")
                    .then(function(audioID){
                        that.audioID = audioID;
                    })
            }
            if(leftSec <= 0){
                this.TimeLable.string = "";
                this.onDisable();
            }
            else{
                this.TimeLable.string = leftSec;
            }
        }
    },
});
