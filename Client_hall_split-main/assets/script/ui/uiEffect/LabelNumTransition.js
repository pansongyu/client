/*
    LabelNumTransition 数字label渐变
*/

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        //渐变总耗时秒
        TransDuration: 3,
        //更新间隔
        UpdateDuration: 0.1,
    },

    // use this for initialization
	OnLoad: function () {

	    this.JS_Name = this.node.name + "_LabelNumTransition";

        //总共可以更新的次数
        this.UpdateCount = Math.ceil(this.TransDuration/this.UpdateDuration);
        this.Label = this.node.getComponent(cc.Label);

        //是否需要修改
        this.isNeedChange = false;

        //是否递增变化
        this.isAddProgress = false;

        //流失的秒
        this.passSeconds = 0;

        this.endValue = 0;

        //因为渐变量可能是小数,是整数显示,所以需要记录当前变化的精确至
        this.nowValue = 0;

        //数字后缀
        this.suffix = "";

        //每次改变量
        this.tarnsValue = 0;
        
    },

    SetLabelNum:function(endValue, startValue=null, suffix=""){

        //取当前值开始变化
        if(startValue == null){
            //使用parseInt 会去除后缀字符串 比如%
            startValue = parseInt(this.Label.string);
            if(!startValue){
                startValue = 0;
            }
        }

        this.Label.string = startValue + suffix;
        this.suffix = suffix;

        //如果开始和结束一样,则停止之前的改变
        if(endValue == startValue){
            this.isNeedChange = false;
            return
        }

        if(endValue > startValue){
            this.isAddProgress = true;
        }
        else{
            this.isAddProgress = false;
        }

        this.endValue = endValue;
        this.isNeedChange = true;
        this.passSeconds = 0;
        this.nowValue = startValue;
        this.tarnsValue = Math.abs(endValue - startValue)/this.UpdateCount;
        if(this.tarnsValue < 1){
            this.tarnsValue = 1;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!this.isNeedChange){
            return
        }

        this.passSeconds += dt;
        if(this.passSeconds < this.UpdateDuration){
            return
        }
        this.passSeconds = 0;

        let num = 0;

        if(this.isAddProgress){

            this.nowValue += this.tarnsValue;

            num = Math.floor(this.nowValue);

            if(num >= this.endValue){
                this.isNeedChange = false;
                this.Label.string = this.endValue + this.suffix;
                return
            }
        }
        else{

            this.nowValue -= this.tarnsValue;

            num = Math.floor(this.nowValue);
            if(num <= this.endValue){
                this.isNeedChange = false;
                this.Label.string = this.endValue + this.suffix;
                return
            }
        }

        this.Label.string = num + this.suffix;
    },
});
