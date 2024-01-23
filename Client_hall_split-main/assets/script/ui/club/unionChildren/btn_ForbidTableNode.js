var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad:function(){
        this.ComTool=app.ComTool();
        app.Client.RegEvent('OnUnionForbidReShow',this.Event_UnionForbidReShow,this);
    	// let forbidScrollView = this.node.getChildByName("forbidScrollView").getComponent(cc.ScrollView);
     //    forbidScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    Event_UnionForbidReShow:function(){
        this.GetUnionForbidList(true);
    },
    InitData:function (clubId, unionId, unionPostType) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        // this.curPage = 1;
        this.GetUnionForbidList(true);
    },
    // GetNextPage:function(){
    // 	this.curPage++;
    // 	this.GetUnionForbidList(false);
    // },
    GetUnionForbidList:function(isRefresh,pidOne='',pidTwo=''){
    	let sendPack = app.ClubManager().GetUnionSendPackHead();
    	// sendPack.pageNum = this.curPage;
        sendPack.pidOne=pidOne;
        sendPack.pidTwo=pidTwo;
        let self = this;
        app.NetManager().SendPack("union.CUnionGroupingList",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取列表失败",[],3);
        });
    },

    UpdateScrollView:function(serverPack, isRefresh){
    	let forbidScrollView = this.node.getChildByName("forbidScrollView");
    	let content = forbidScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		forbidScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
    	let demo = this.node.getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.length; i++) {
    		let nodePrefab = cc.instantiate(demo);
    		nodePrefab.name="forbid_"+serverPack[i].groupingId;
            nodePrefab.getChildByName('renshu').getChildByName('lb').getComponent(cc.Label).string=(i+1)+"限制人数："+serverPack[i].groupingSize+"斜15";
            nodePrefab.groupingId=serverPack[i].groupingId;
            nodePrefab.getChildByName('layout').getChildByName('user1').active=false;
            nodePrefab.getChildByName('layout').getChildByName('user2').active=false;
            nodePrefab.getChildByName('layout').getChildByName('btn_set_forbit').groupingId=serverPack[i].groupingId;

            nodePrefab.getChildByName('btn_set_forbit').groupingId=serverPack[i].groupingId;
            nodePrefab.getChildByName('btn_del_forbit').groupingId=serverPack[i].groupingId;

            nodePrefab.active=true;
            for(let j=0;j<serverPack[i].playerList.length;j++){
                let usernode=nodePrefab.getChildByName('layout').getChildByName('user'+(j+1));
                usernode.active=true;
                let heroID = serverPack[i].playerList[j]["pid"];
                let headImageUrl = serverPack[i].playerList[j]["iconUrl"];

                usernode.getChildByName('name').getComponent(cc.Label).string= this.ComTool.GetBeiZhuName(heroID,serverPack[i].playerList[j].name);

                usernode.getChildByName('id').getComponent(cc.Label).string=app.i18n.t("UIMain_PIDText",{"pid":app.ComTool().GetPid(heroID)});
                let WeChatHeadImage = usernode.getChildByName('head').getChildByName('img').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                //用户头像创建
                if(heroID && headImageUrl){
                    app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                }
                usernode.getChildByName('btn_forbit_del_user').pid=heroID;
                usernode.getChildByName('btn_forbit_del_user').groupingId=serverPack[i].groupingId;
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
            }
    		content.addChild(nodePrefab);
    	}
    },
    //控件点击回调
    OnClick_BtnWnd:function(eventTouch, eventData){
        try{
            app.SoundManager().PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        }
        catch (error){
            console.log("OnClick_BtnWnd:"+error.stack);
        }
    },
    OnClick:function(btnName, btnNode){
        let self = this;
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        if('btn_addForbid'==btnName){
            app.NetManager().SendPack("union.CUnionGroupingAdd",sendPack, function(serverPack){
                self.GetUnionForbidList(true);
            }, function(){

            });
        }else if('btn_del_forbit'==btnName){
            sendPack.groupingId = btnNode.groupingId;
            app.NetManager().SendPack('union.CUnionGroupingRemove',sendPack, function(serverPack){
                self.GetUnionForbidList(true);
            }, function(){

            });
        }else if('btn_forbit_del_user'==btnName){
            sendPack.groupingId = btnNode.groupingId;
            sendPack.pid = btnNode.pid;
            app.NetManager().SendPack('union.CUnionGroupingPidRemove',sendPack, function(serverPack){
                self.GetUnionForbidList(true);
            }, function(){

            });
        }else if('btn_set_forbit'==btnName){
            app.FormManager().ShowForm('ui/club/UIForbidUserList',this.clubId,btnNode.groupingId,this.unionId);
        }else if('btn_ForbidSearch'==btnName){
            let pid1=this.node.getChildByName("EditBoxForbid1").getComponent(cc.EditBox).string;
            let pid2=this.node.getChildByName("EditBoxForbid2").getComponent(cc.EditBox).string;
            if(pid1!='' || pid2!=''){
                this.GetUnionForbidList(true,pid1,pid2);
            }
        }
    },
});