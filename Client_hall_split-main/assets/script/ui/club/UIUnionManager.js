var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        redTip:cc.Node,
    },

    OnCreateInit: function () {
        this.WeChatManager=app.WeChatManager();
        this.InitEvent();
    },
    InitEvent:function(){
        //基础网络包
        this.NetManager=app.NetManager();
        this.RegEvent("CodeError", this.Event_CodeError, this);
        //新的审核通知
        this.NetManager.RegNetPack('SUnion_Examine',this.Event_UnionExamine,this);
    },
    Event_CodeError:function(event){
        let code = event["Code"];
    },
    Event_UnionExamine:function(event){
        if (event.unionId != this.unionId) {
            return;
        }
        if (event.size > 0) {
            this.redTip.active = true;
        }else{
            this.redTip.active = false;
        }
    },
    //--------------显示函数-----------------
    OnShow:function(clubId, unionId, unionName, unionPostType, myisminister, unionSign, btn_defaultName="btn_Setting"){
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.lastClickBtnName = "";
        let lb_Title = this.node.getChildByName("bg_create").getChildByName("lb_Title");
        lb_Title.getComponent(cc.Label).string = unionName + "（ID:" + unionSign + "）";
        let btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name,btn_default);
        this.UpdateLeftBtn();
        if (this.unionPostType == app.ClubManager().UNION_MANAGE ||
            this.unionPostType == app.ClubManager().UNION_CREATE) {
            //如果是管理或者创建者，请求是否有审核消息
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            let self = this;
            app.NetManager().SendPack('union.CUnionExamine',sendPack,function(serverPack){
                self.Event_UnionExamine(serverPack);
            });
        }
    },
    UpdateLeftBtn:function(){
        let btn_Setting = this.node.getChildByName("left").getChildByName("btn_Setting");
        let btn_Data = this.node.getChildByName("left").getChildByName("btn_Data");
        let btn_Member = this.node.getChildByName("left").getChildByName("btn_Member");
        let btn_Wanfa = this.node.getChildByName("left").getChildByName("btn_Wanfa");
        let btn_Message = this.node.getChildByName("left").getChildByName("btn_Message");
        let btn_MemberCheck = this.node.getChildByName("left").getChildByName("btn_MemberCheck");
        let btn_RaceRank = this.node.getChildByName("left").getChildByName("btn_RaceRank");
        let btn_ForbidTable = this.node.getChildByName("left").getChildByName("btn_ForbidTable");

        let btn_Management = this.node.getChildByName("left").getChildByName("btn_Management");
        let btn_ForbidGame = this.node.getChildByName("left").getChildByName("btn_ForbidGame");
        let btn_SetSkinType = this.node.getChildByName("left").getChildByName("btn_SetSkinType");
        if(this.myisminister == app.ClubManager().Club_MINISTER_MGRSS){//赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        }else if (this.unionPostType == app.ClubManager().UNION_GENERAL) {//普通成员
            btn_Setting.active = false;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = false;
            if (this.myisminister != app.ClubManager().Club_MINISTER_GENERAL) {
                btn_MemberCheck.active = true;   
            }else{
                btn_MemberCheck.active = false;   
            }
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        }else if(this.unionPostType == app.ClubManager().UNION_CLUB){//亲友圈创建者
            btn_Setting.active = true;
            btn_Data.active = false;
            btn_Member.active = false;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = false;
            btn_Management.active = false;
            btn_ForbidGame.active = false;
            btn_SetSkinType.active = false;
        }else if(this.unionPostType == app.ClubManager().UNION_MANAGE){//赛事管理
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        }else if(this.unionPostType == app.ClubManager().UNION_CREATE){//赛事创建者
            btn_Setting.active = true;
            btn_Data.active = true;
            btn_Member.active = true;
            btn_Wanfa.active = true;
            btn_Message.active = true;
            btn_MemberCheck.active = true;
            btn_ForbidTable.active = true;
            btn_Management.active = true;
            btn_ForbidGame.active = true;
            btn_SetSkinType.active = true;
        }
        //赛事数据暂时放后台统计
        btn_Data.active = false;
        btn_RaceRank.active = true;
    },
    ClickLeftBtn:function(clickName){
        if (clickName == "btn_MemberCheck") {
            this.redTip.active = false;
        }
        let rightNode = this.node.getChildByName("right");
        let allRightBtn = [];
        for (let i = 0; i < rightNode.children.length; i++) {
            allRightBtn.push(rightNode.children[i]);
        }
        for (let i = 0; i < allRightBtn.length; i++) {
            if (allRightBtn[i].name == this.lastClickBtnName + "Node") {
                if (allRightBtn[i].getComponent(allRightBtn[i].name).isClickAnyWnd) {
                    allRightBtn[i].getComponent(allRightBtn[i].name).isClickAnyWnd = false;
                    if (this.unionPostType != app.ClubManager().UNION_CREATE && this.lastClickBtnName == "btn_Setting") {
                        continue;
                    }
                    this.SetWaitForConfirm("MSG_UNOIN_SAVE",app.ShareDefine().ConfirmYN,[],[clickName,this.lastClickBtnName]);
                    return;
                }
            }
        }
        this.lastClickBtnName = clickName;
        let leftNode = this.node.getChildByName("left");
        let allLeftBtn = [];
        for (let i = 0; i < leftNode.children.length; i++) {
            allLeftBtn.push(leftNode.children[i]);
        }
        for (let i = 0; i < allLeftBtn.length; i++) {
            if (allLeftBtn[i].name == clickName) {
                allLeftBtn[i].getChildByName("img_off").active = false;
                allLeftBtn[i].getChildByName("lb_off").active = false;
                allLeftBtn[i].getChildByName("img_on").active = true;
                allLeftBtn[i].getChildByName("lb_on").active = true;
            }else{
                allLeftBtn[i].getChildByName("img_off").active = true;
                allLeftBtn[i].getChildByName("lb_off").active = true;
                allLeftBtn[i].getChildByName("img_on").active = false;
                allLeftBtn[i].getChildByName("lb_on").active = false;
            }
        }
        for (let i = 0; i < allRightBtn.length; i++) {
            if (allRightBtn[i].name == clickName + "Node") {
                allRightBtn[i].active = true;
                allRightBtn[i].getComponent(allRightBtn[i].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign);
            }else{
                allRightBtn[i].active = false;
            }
        }
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            if('MSG_UNOIN_SAVE' == msgID){
                this.ClickLeftBtn(backArgList[0]);
            }
            return;
        }
        if('MSG_UNOIN_SAVE' == msgID){
            let rightNode = this.node.getChildByName("right");
            let eventComponent = rightNode.getChildByName(backArgList[1]+"Node").getComponent(backArgList[1]+"Node");
            if (eventComponent) {
                eventComponent.SaveChange();
                this.ClickLeftBtn(backArgList[0]);
            }else{
                console.log("找不到组件：" + backArgList[1]+"Node，需查询！！！");
            }
        }
    },
    OnClick:function(btnName, btnNode){
        if('btn_close'==btnName){
            //关闭之前判断是否保存了房间列表
            let rightNode = this.node.getChildByName("right");
            let eventComponent = rightNode.getChildByName("btn_WanfaNode").getComponent("btn_WanfaNode");
            if (eventComponent) {
                if (eventComponent.isSaveSuccess) {
                    app.Client.OnEvent('OnRefreshRoomList');
                }
            }else{
                console.log("找不到组件：btn_WanfaNode,需查询！！！");
            }
            this.CloseForm();
        }else if('btn_Setting'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_Data'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_Member'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_Wanfa'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_Message'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_MemberCheck'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_RaceRank'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_ForbidTable'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_Management'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_ForbidGame'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_SetSkinType'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_RaceRankZhongzhi'==btnName){
            this.ClickLeftBtn(btnName);
        }
    },
});