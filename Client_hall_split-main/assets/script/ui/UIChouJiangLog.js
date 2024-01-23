/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        layoutNode:cc.Node,
        scrollView:cc.ScrollView,
        prefab:cc.Prefab,
    },

    //初始化
    OnCreateInit:function(){
        // this.RegEvent("OnChouJiangLingQu", this.Event_LingQuNtf);
        // this.RegEvent("ConnectSuccess", this.OnEvent_ConnectSuccess);
    },

    //---------显示函数--------------------

    OnShow:function(serverPack){
       this.ShowLog(serverPack);
    },
    ShowLog:function(luckDraws){
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToTop();
        //this.layoutNode.removeAllChildren();
        this.DestroyAllChildren(this.layoutNode);
        for(let i=0;i<luckDraws.length;i++){
            let logNode = cc.instantiate(this.prefab);
            logNode.name = luckDraws[i].id.toString();
            logNode.luckData = luckDraws[i];
            let timeStr = app.ComTool().GetDateYearMonthDayHourMinuteString(luckDraws[i].timestamp);
            let prizeStr = "";
            if (luckDraws[i].prizeType == 1) {
                prizeStr = luckDraws[i].rewardNum + "个乐豆";
            }else if (luckDraws[i].prizeType == 2) {
                prizeStr = luckDraws[i].rewardNum + "个钻石";
            }else if (luckDraws[i].prizeType == 8) {
                prizeStr = luckDraws[i].rewardNum + "元红包";
            }
            logNode.getChildByName('lb_num').getComponent(cc.Label).string = prizeStr;
            logNode.getChildByName('lb_time').getComponent(cc.Label).string = timeStr;
            // let btn_lingqu = logNode.getChildByName('btn_lingqu');
            // if(1 == luckDraws[i].state)
            //     btn_lingqu.active = true;
            // else
            //     btn_lingqu.active = false;
            // btn_lingqu.on('click',this.OnLingQuClick,this);
            logNode.active=true;
            this.layoutNode.addChild(logNode);
        }
        this.scrollView.scrollToTop();
    },
    OnEvent_ConnectSuccess:function(event){
        // let that = this;
        // app.NetManager().SendPack("game.CPlayerLuckDraw",{"type":3}, function(event){
        //     let luckDraws=event.luckDraws;
        //     that.ShowLog(luckDraws);
        // }, function(){});
    },
    Event_LingQuNtf:function(event){
        // let lqList = event.detail.recordIdList;
        // let childs = this.layoutNode.children;
        // for(let i=0;i<lqList.length;i++){
        //     for(let j=0;j<childs.length;j++){
        //         if(lqList[i] == parseInt(childs[j].name)){
        //             childs[j].getChildByName('btn_lingqu').active = false;
        //             break;
        //         }
        //     }
        // }
    },
    //---------点击函数---------------------
    OnLingQuClick:function(event){
        // let id = parseInt(event.target.parent.name);
        // app.NetManager().SendPack("game.CPlayerLuckDraw",{"type":8,"recordId":id});
        //event.target.active = false;
        // this.FormManager.ShowForm('UIChouJiangResult',event.target.parent.luckData,true);
    },
	OnClick:function(btnName, eventData){
		if(btnName == "btn_close"){
            this.CloseForm();
		}
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
