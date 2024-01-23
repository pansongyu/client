var app = require("app");
cc.Class({
    extends: require("UIPromoterAllManager"),

    properties: {

    },
    CheckUserDisplay:function(){
        let memberScrollView = this.node.getChildByName("promoterListNode").getChildByName("memberScrollView");
        let ScrollOffset=memberScrollView.getComponent(cc.ScrollView).getScrollOffset();
        let gundongY=ScrollOffset.y;
        let content = memberScrollView.getChildByName("view").getChildByName("content");
        content.getComponent(cc.Layout).updateLayout();
        let demo = this.node.getChildByName("promoterListNode").getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < content.children.length; i++) {
            if(content.children[i].y+gundongY>-1300){ 
                //需要渲染
                if(content.children[i].isDisplay==false){
                    //开始渲染,把空节点替换成真实节点
                    let nullNode=content.children[i];
                    nullNode.isDisplay=true;
                    let child = cc.instantiate(demo);
                    let serverPack=null;
                    if(i==0){
                        //固定是本家总数据
                        serverPack=this.serverPack[0];
                        child.getChildByName("tip_all").active=this.searchInput.string=="";  //搜索时不变色
                        //child.getChildByName("controlNode").active=true;
                    }else{
                        serverPack=this.PidGetData(nullNode.pid);
                    }
                    if(typeof(serverPack) == "undefined"){
                        //防止意外获取数据
                        continue;
                    }
                    child.pid = serverPack.pid;
                    child.myisminister = serverPack.myisminister;

                    child.active=true;

                    let dataNode = child.getChildByName("dataNode");//数据父节点
                    let toptitle=this.node.getChildByName("promoterListNode").getChildByName("topTitle");//标题父节点

                    child.playerData = serverPack;
                    if(serverPack.iconUrl){
                        app.WeChatManager().InitHeroHeadImage(serverPack.pid, serverPack.iconUrl);
                        let WeChatHeadImage = dataNode.getChildByName('img_head').getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(serverPack.pid,serverPack.iconUrl);
                    }
                    //自己不能操作自己，不能操作创建者, 创建者可以操作创建者
                    // if (child.pid == this.selfPid && 
                    //     child.myisminister != app.ClubManager().Club_MINISTER_CREATER) {
                    //     child.getChildByName("btn_control").active = false;
                    // }else{
                    //     child.getChildByName("btn_control").active = true;
                    // }
                    dataNode.getChildByName("lb_userName").getComponent(cc.Label).string =this.ComTool.GetBeiZhuName(serverPack.pid,serverPack.name);
                    dataNode.getChildByName("lb_userName").getChildByName("lb_userId").getComponent(cc.Label).string = "ID:"+serverPack.pid;
                    dataNode.getChildByName("lb_playerNum").getComponent(cc.Label).string =serverPack.number;
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_4"),dataNode.getChildByName("lb_jushu"),serverPack.setCount, 0);
                    // this.ShowOrHideDataNode(toptitle.getChildByName("lb_4"),dataNode.getChildByName("lb_dayingjia"),serverPack.winner);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_5"),dataNode.getChildByName("lb_costSp"),serverPack.entryFee, 1);//理论报名费
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_12"),dataNode.getChildByName("lb_actualEntryFee"),serverPack.actualEntryFee, 2);//实际报名费
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_13"),dataNode.getChildByName("lb_spWarningPromoter"),serverPack.sportsPointWarning, 9);//推广员预警值
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_14"),dataNode.getChildByName("lb_spWarningPersonal"),serverPack.personalSportsPointWarning, 10);//个人预警值
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_15"),dataNode.getChildByName("lb_allScorePoint"),serverPack.totalPoint, 11);//总积分
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_16"),dataNode.getChildByName("lb_playerTotalPoint"),serverPack.playerTotalPoint, 12);//成员总积分
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_17"),dataNode.getChildByName("lb_eliminatePoint"),serverPack.eliminatePoint, 13);//个人淘汰分
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_18"),dataNode.getChildByName("lb_shengcunPoint"),serverPack.alivePoint, 14);//生存积分
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_19"),dataNode.getChildByName("lb_totalPoint"),serverPack.zhongZhiTotalPoint, 15);//中至总积分


                    if(serverPack.shareType==1){
                        this.ShowOrHideDataNode(toptitle.getChildByName("lb_6"),dataNode.getChildByName("lb_bili"),serverPack.shareFixedValue, 3);
                    }else if(serverPack.shareType==0){
                        this.ShowOrHideDataNode(toptitle.getChildByName("lb_6"),dataNode.getChildByName("lb_bili"),serverPack.shareValue, 3, "%");
                    }else if(serverPack.shareType==2){
                        this.ShowOrHideDataNode(toptitle.getChildByName("lb_6"),dataNode.getChildByName("lb_bili"),"区间", 3);
                    }
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_7"),dataNode.getChildByName("lb_scorePoint"),serverPack.scorePoint, 4);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_8"),dataNode.getChildByName("lb_costZuan"),serverPack.consume, 5);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_9"),dataNode.getChildByName("lb_WinLostSp"),serverPack.sportsPointConsume, 6);
                    this.ShowOrHideDataNode(toptitle.getChildByName("lb_10"),dataNode.getChildByName("curSpNode").getChildByName("lb_curSportPoint"),serverPack.sportsPoint, 7);
                    // this.ShowOrHideDataNode(toptitle.getChildByName("lb_11"),dataNode.getChildByName("sumSpNode").getChildByName("lb_sumSportPoint"),serverPack.sumSportsPoint, 8);
                    if (serverPack.level > 0) {
                        child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_xiaji").active = true;
                        dataNode.getChildByName('img_head').getChildByName("img_tg").active = true;
                        if (this.showListSecond.indexOf(1) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        }else{
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        }
                    }else{
                        child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_setPromoter").active =true;
                        child.getChildByName("controlNode").getChildByName("btn_xiaji").active = false;
                        dataNode.getChildByName('img_head').getChildByName("img_tg").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                    }
                    if (this.unionId > 0) {
                        child.getChildByName("controlNode").getChildByName("btn_jjdz").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_AlivePointWaning").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_EliminarePoint").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_bmffc").active = child.pid != this.selfPid;
                        if (this.showListSecond.indexOf(1) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        }else{
                            child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        }
                        if (this.showListSecond.indexOf(2) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                        }else{
                            child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                        }
                    }else{
                        child.getChildByName("controlNode").getChildByName("btn_jjdz").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_bmffc").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_AlivePointWaning").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_EliminarePoint").active = false;
                    }
                    if (child.pid == this.selfPid) {
                        if (child.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
                            child.getChildByName("controlNode").getChildByName("btn_xiaji").active = true;
                            child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = true;
                            child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                        }else{
                            child.getChildByName("controlNode").getChildByName("btn_xiaji").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = true;
                            child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_jjdz").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_baobiao").active = false;
                        }
                        //预警值本身不能修改
                        child.getChildByName("controlNode").getChildByName("btn_sportsPointWarning").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_spWarningPersonal").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_AlivePointWaning").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_EliminarePoint").active = false;
                        //我的分成
                        if (this.showListSecond.indexOf(0) >= 0) {
                            child.getChildByName("controlNode").getChildByName("btn_selfFenCheng").active = true;
                        }else{
                            child.getChildByName("controlNode").getChildByName("btn_selfFenCheng").active = false;
                        }
                    }else{
                        child.getChildByName("controlNode").getChildByName("btn_selfFenCheng").active = false;
                    }
                    if(this.isPromotionManage>0){
                        child.getChildByName("controlNode").getChildByName("btn_setPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                        if(child.pid ==this.promotionManagePid){
                            //如果是推广员，那不能操作创建者
                            child.getChildByName("controlNode").getChildByName("btn_xiaji").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_setSportsPoint").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_cancelPromoter").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_jjdz").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_baobiao").active = false;
                            child.getChildByName("controlNode").getChildByName("btn_bmffc").active = false;
                        }
                    }
                    if(this.levelPromotion>0 && !this.myisminister && this.kicking == 0){
                        child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false;
                    }
                    //child.getChildByName("controlNode").getChildByName("btn_delPromoter").active = false; //所有人都隐藏这个移除按钮
                    if(this.modifyValue == 0){
                        child.getChildByName("controlNode").getChildByName("btn_changePromoter").active = false;
                    }
                    if (this.myisminister != app.ClubManager().Club_MINISTER_CREATER) {
                        child.getChildByName("controlNode").getChildByName("btn_powerOp").active = false;
                    }
                    //是否显示审核按钮或者状态
                    /**
                     * 审核状态
                     * 0 不显示
                     * 1 未审核
                     * 2 已审核
                     */
                    child.getChildByName("controlNode").getChildByName("btn_Examine").totalPoint = serverPack.totalPoint;
                    if (serverPack.examineStatus == 0) {
                        dataNode.getChildByName('img_head').getChildByName("img_ysh").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_Examine").active = false;
                    }else if (serverPack.examineStatus == 1) {
                        dataNode.getChildByName('img_head').getChildByName("img_ysh").active = false;
                        child.getChildByName("controlNode").getChildByName("btn_Examine").active = true;
                    }else if (serverPack.examineStatus == 2) {
                        dataNode.getChildByName('img_head').getChildByName("img_ysh").active = true;
                        child.getChildByName("controlNode").getChildByName("btn_Examine").active = false;
                    }
                    nullNode.addChild(child);
                    if(i==0){
                        //默认点击打开第一个
                        this.OnClick('btn_ShowBtn',child.getChildByName("btn_ShowBtn"));
                    }
                }
            }
        }
    },

    InitLeft:function(){
        if (this.type == -1) {
            this.node.getChildByName("btn_commonOp").getChildByName('off').active=false;
            this.node.getChildByName("btn_commonOp").getChildByName('on').active=true;
            this.node.getChildByName("btn_all").getChildByName('off').active=true;
            this.node.getChildByName("btn_all").getChildByName('on').active=false;
        }else if (this.type == -2) {
            this.node.getChildByName("btn_all").getChildByName('off').active=false;
            this.node.getChildByName("btn_all").getChildByName('on').active=true;
            this.node.getChildByName("btn_commonOp").getChildByName('off').active=true;
            this.node.getChildByName("btn_commonOp").getChildByName('on').active=false;
        }else{
            this.node.getChildByName("btn_commonOp").getChildByName('off').active=true;
            this.node.getChildByName("btn_commonOp").getChildByName('on').active=false;
            this.node.getChildByName("btn_all").getChildByName('off').active=true;
            this.node.getChildByName("btn_all").getChildByName('on').active=false;
        }
        let tab=this.node.getChildByName("tab");
        for(let i=0;i<tab.children.length;i++){
            tab.children[i].getChildByName('off').active=i!=this.type;
            tab.children[i].getChildByName('on').active=i==this.type;
        }
    },
});