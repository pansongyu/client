var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    InitData:function (clubId, unionId, unionPostType,myisminister) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.content = this.node.getChildByName("view").getChildByName("content");
        if (this.unionPostType == app.ClubManager().UNION_CREATE) {
            this.node.getChildByName("btn_DissolveUnion").active = true;
            this.node.getChildByName("btn_diamond").active = true;
            this.node.getChildByName("btn_ExitUnion").active = false;
            this.node.getChildByName("btn_SaveSetting").active = true;
        }else if(this.myisminister == app.ClubManager().Club_MINISTER_MGRSS){
            this.node.getChildByName("btn_DissolveUnion").active = false;
            this.node.getChildByName("btn_diamond").active = true;
            this.node.getChildByName("btn_ExitUnion").active = false;
            this.node.getChildByName("btn_SaveSetting").active = true;
        }else{
            this.node.getChildByName("btn_DissolveUnion").active = false;
            this.node.getChildByName("btn_diamond").active = false;
            this.node.getChildByName("btn_ExitUnion").active = true;
            this.node.getChildByName("btn_SaveSetting").active = false;
        }
        this.isClickAnyWnd = false;
        this.SettingData = null;
        this.isUpdateDataEnd = false;
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        let self = this;
        app.NetManager().SendPack("union.CUnionGetConfig",sendPack, function(serverPack){
            self.UpdateData(serverPack);
            self.SettingData = serverPack;
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取赛事设置失败，请关闭界面重试");
        });
    },
    UpdateData:function(serverPack){
        this.content.getChildByName("NameEditBox").getComponent(cc.EditBox).string = serverPack.name;
        let JoinToggleContainer = this.content.getChildByName("JoinToggleContainer");
        if (serverPack.join == 0) {
            JoinToggleContainer.getChildByName("JoinToggle1").getComponent(cc.Toggle).isChecked = true;
        }else{
            JoinToggleContainer.getChildByName("JoinToggle2").getComponent(cc.Toggle).isChecked = true;
        }
        let ExitToggleContainer = this.content.getChildByName("ExitToggleContainer");
        if (serverPack.quit == 0) {
            ExitToggleContainer.getChildByName("ExitToggle1").getComponent(cc.Toggle).isChecked = true;
        }else{
            ExitToggleContainer.getChildByName("ExitToggle2").getComponent(cc.Toggle).isChecked = true;
        }
        let allowToggleContainer = this.content.getChildByName("allowToggleContainer");
        if (serverPack.joinClubSameUnion == 0) {
            allowToggleContainer.getChildByName("AllowToggle1").getComponent(cc.Toggle).isChecked = true;
        }else{
            allowToggleContainer.getChildByName("AllowToggle2").getComponent(cc.Toggle).isChecked = true;
        }
        let tableToggleContainer = this.content.getChildByName("tableToggleContainer");
        if (serverPack.tableNum == 0) {
            tableToggleContainer.getChildByName("tableToggle1").getComponent(cc.Toggle).isChecked = true;
        }else if(serverPack.tableNum == 5){
            tableToggleContainer.getChildByName("tableToggle2").getComponent(cc.Toggle).isChecked = true;
        }else if(serverPack.tableNum == 10){
            tableToggleContainer.getChildByName("tableToggle3").getComponent(cc.Toggle).isChecked = true;
        }else if(serverPack.tableNum == 20){
            tableToggleContainer.getChildByName("tableToggle4").getComponent(cc.Toggle).isChecked = true;
        }


        let StateToggleContainer = this.content.getChildByName("StateToggleContainer");
        if (serverPack.state == 0) {
            StateToggleContainer.getChildByName("StateToggle1").getComponent(cc.Toggle).isChecked = true;
        }else{
            StateToggleContainer.getChildByName("StateToggle2").getComponent(cc.Toggle).isChecked = true;
        }
        this.content.getChildByName("SportsPointEditBox").getComponent(cc.EditBox).string = serverPack.initSports;
        let MatchRateToggleContainer = this.content.getChildByName("MatchRateToggleContainer");
        if (serverPack.matchRate == 0) {
            MatchRateToggleContainer.getChildByName("Toggle1").getComponent(cc.Toggle).isChecked = true;
        }else if (serverPack.matchRate == 1) {
            MatchRateToggleContainer.getChildByName("Toggle2").getComponent(cc.Toggle).isChecked = true;
        }else {
            MatchRateToggleContainer.getChildByName("Toggle3").getComponent(cc.Toggle).isChecked = true;
        }
        this.content.getChildByName("OutSportsEditBox").getComponent(cc.EditBox).string = serverPack.outSports;
        let prizeToggleContainer = this.content.getChildByName("prizeToggleContainer");
        if (serverPack.prizeType == 2) {
            prizeToggleContainer.getChildByName("Toggle1").getComponent(cc.Toggle).isChecked = true;
        }else{
            prizeToggleContainer.getChildByName("Toggle2").getComponent(cc.Toggle).isChecked = true;
        }
        this.content.getChildByName("prizeRankEditBox").getComponent(cc.EditBox).string = serverPack.ranking;
        this.content.getChildByName("prizeValueEditBox").getComponent(cc.EditBox).string = serverPack.value;
        //刷新后才开始监听是否有改变
        this.isUpdateDataEnd = true;
    },
    OnClickAnyWnd:function(event){
        if (this.isUpdateDataEnd) {
            this.isClickAnyWnd = true;
        }
    },
    OnEditBoxEnd:function(event){
        let percentStr =event.node.getComponent(cc.EditBox).string;
        if (app.ComTool().StrIsNum(percentStr)) {
            let value = parseFloat(percentStr);
            if (value > 0) {
                event.node.getComponent(cc.EditBox).string = "-"+event.node.getComponent(cc.EditBox).string;
            }
        }else{
            event.node.getComponent(cc.EditBox).string = "";
            app.SysNotifyManager().ShowSysMsg("请输入纯数字",[],3);
        }
    },
    GetSetConfig:function(){
        let sendPack = app.ClubManager().GetUnionSendPackHead();
        let unionNameEditBox = this.content.getChildByName("NameEditBox").getComponent(cc.EditBox);
        if (unionNameEditBox.string == "") {
            app.SysNotifyManager().ShowSysMsg("赛事名称不能为空", [], 3);
            return null;
        }
        if (unionNameEditBox.string.length > 16) {
            app.SysNotifyManager().ShowSysMsg("赛事名称不能超过16个字符", [], 3);
            return null;
        }
        if (app.UtilsWord().CheckContentDirtyEx(unionNameEditBox.string)) {
            app.SysNotifyManager().ShowSysMsg("赛事名称包含敏感词汇", [], 3);
            return null;
        }
        sendPack.name = unionNameEditBox.string;
        let JoinToggleContainer = this.content.getChildByName("JoinToggleContainer");
        if (JoinToggleContainer.getChildByName("JoinToggle1").getComponent(cc.Toggle).isChecked) {
            sendPack.join = 0;
        }else{
            sendPack.join = 1;
        }
        let ExitToggleContainer = this.content.getChildByName("ExitToggleContainer");
        if (ExitToggleContainer.getChildByName("ExitToggle1").getComponent(cc.Toggle).isChecked) {
            sendPack.quit = 0;
        }else{
            sendPack.quit = 1;
        }
        let allowToggleContainer = this.content.getChildByName("allowToggleContainer");
        if (allowToggleContainer.getChildByName("AllowToggle1").getComponent(cc.Toggle).isChecked) {
            sendPack.joinClubSameUnion = 0;
        }else{
            sendPack.joinClubSameUnion = 1;
        }
        //sendPack.joinClubSameUnion = 1;
        
        let tableToggleContainer = this.content.getChildByName("tableToggleContainer");
        if (tableToggleContainer.getChildByName("tableToggle1").getComponent(cc.Toggle).isChecked) {
            sendPack.tableNum = 0;
        }else if(tableToggleContainer.getChildByName("tableToggle2").getComponent(cc.Toggle).isChecked){
            sendPack.tableNum = 1;
        }else if(tableToggleContainer.getChildByName("tableToggle3").getComponent(cc.Toggle).isChecked){
            sendPack.tableNum = 2;
        }else if(tableToggleContainer.getChildByName("tableToggle4").getComponent(cc.Toggle).isChecked){
            sendPack.tableNum = 3;
        }

        let StateToggleContainer = this.content.getChildByName("StateToggleContainer");
        if (StateToggleContainer.getChildByName("StateToggle1").getComponent(cc.Toggle).isChecked) {
            sendPack.state = 0;
        }else{
            sendPack.state = 1;
        }
        let sportsPointEditBox = this.content.getChildByName("SportsPointEditBox").getComponent(cc.EditBox);
        if (!app.ComTool().StrIsNum(sportsPointEditBox.string) || isNaN(parseFloat(sportsPointEditBox.string)) || parseFloat(sportsPointEditBox.string) < 0) {
            app.SysNotifyManager().ShowSysMsg("裁判力度必须是大于0的纯数字", [], 3);
            return null;
        }
        sendPack.initSports = sportsPointEditBox.string;
        let MatchRateToggleContainer = this.content.getChildByName("MatchRateToggleContainer");
        if (MatchRateToggleContainer.getChildByName("Toggle1").getComponent(cc.Toggle).isChecked) {
             sendPack.matchRate = 0;
        }else if (MatchRateToggleContainer.getChildByName("Toggle2").getComponent(cc.Toggle).isChecked) {
            sendPack.matchRate = 1;
        }else {
            sendPack.matchRate = 2;
        }
        let outSportsEditBox = this.content.getChildByName("OutSportsEditBox").getComponent(cc.EditBox);
        if (!app.ComTool().StrIsNum(outSportsEditBox.string) || isNaN(parseFloat(outSportsEditBox.string))) {
            app.SysNotifyManager().ShowSysMsg("赛事淘汰必须是纯数字", [], 3);
            return null;
        }


        if (parseFloat(outSportsEditBox.string) > parseFloat(sportsPointEditBox.string)) {
            if(app.ClubManager().GetUnionTypeByLastClubData()!=1){
                app.SysNotifyManager().ShowSysMsg("赛事淘汰不能大于裁判力度", [], 3);
                return null;
            }
        }


        sendPack.outSports = outSportsEditBox.string;
        let prizeToggleContainer = this.content.getChildByName("prizeToggleContainer");
        if (prizeToggleContainer.getChildByName("Toggle1").getComponent(cc.Toggle).isChecked) {
            sendPack.prizeType = 2;
        }else{
            sendPack.prizeType = 1;
        }
        let prizeRankEditBox = this.content.getChildByName("prizeRankEditBox").getComponent(cc.EditBox);
        if (isNaN(parseInt(prizeRankEditBox.string)) || parseInt(prizeRankEditBox.string) < 0 || parseInt(prizeRankEditBox.string) > 50) {
            app.SysNotifyManager().ShowSysMsg("奖励排名必须是大于0小于等于50的纯数字", [], 3);
            return null;
        }
        sendPack.ranking = prizeRankEditBox.string;
        let prizeValueEditBox = this.content.getChildByName("prizeValueEditBox").getComponent(cc.EditBox);
        if (isNaN(parseInt(prizeValueEditBox.string)) || parseInt(prizeValueEditBox.string) < 0) {
            app.SysNotifyManager().ShowSysMsg("奖励数量必须是大于0的纯数字", [], 3);
            return null;
        }
        sendPack.value = prizeValueEditBox.string;
        return sendPack;
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
        if('btn_SaveSetting'==btnName){
            if (this.isClickAnyWnd) {
                this.SaveChange();
            }
        }else if('btn_ExitUnion'==btnName){
            this.SetWaitForConfirm('MSG_EXIT_UNION',app.ShareDefine().Confirm);
        }else if('btn_DissolveUnion'==btnName){
              let sendPack = app.ClubManager().GetUnionSendPackHead();
              app.FormManager().ShowForm('ui/club/UIClubDissolve',sendPack.clubId,sendPack.unionId,2);
        }else if('btn_diamond'==btnName){
              let sendPack = app.ClubManager().GetUnionSendPackHead();
              app.FormManager().ShowForm('ui/club/UIClubDiamond',sendPack.clubId,sendPack.unionId);
        }else if(btnName == "btn_help"){
            this.content.getChildByName("helpNode").active = !this.content.getChildByName("helpNode").active;
        }else if(btnName == "btn_help_1"){
            this.content.getChildByName("helpNode_1").active = !this.content.getChildByName("helpNode_1").active;
        }
    },
    SaveChange:function(){
        let sendPack = this.GetSetConfig();
        if (sendPack == null) {
            return;
        }
        let self = this;
        app.NetManager().SendPack("union.CUnionSetConfig",sendPack, function(serverPack){
            app.SysNotifyManager().ShowSysMsg("修改成功",[],3);
            self.isClickAnyWnd = false;
        }, function(error){
            // app.SysNotifyManager().ShowSysMsg("修改失败",[],3);
        });
    },
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
            return
        }
        if('MSG_EXIT_UNION' == msgID){
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            let self = this;
            app.NetManager().SendPack("union.CUnionQuit",sendPack, function(serverPack){
                if (serverPack == 9) {
                    app.SysNotifyManager().ShowSysMsg("申请退出成功",[],3);
                }else{
                    //直接退出不需要申请
                    app.SysNotifyManager().ShowSysMsg("退出成功",[],3);
                    if (app.FormManager().GetFormComponentByFormName("ui/club/UIUnionManager")) {
                        app.FormManager().GetFormComponentByFormName("ui/club/UIUnionManager").CloseForm();
                    }
                    if (app.FormManager().GetFormComponentByFormName("ui/club_2/UIUnionManager_2")) {
                        app.FormManager().GetFormComponentByFormName("ui/club_2/UIUnionManager_2").CloseForm();
                    }
                    if (app.ClubManager().GetClubFormComponent()) {
                        app.ClubManager().GetClubFormComponent().OnShow();
                    }
                }
            }, function(){
                app.SysNotifyManager().ShowSysMsg("退出失败",[],3);
            });
        }else if('MSG_DISSOLVE_UNION' == msgID){
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            let self = this;
            app.NetManager().SendPack("union.CUnionDissolve",sendPack, function(serverPack){
                app.FormManager().CloseForm("ui/club/UIUnionManager");
                app.FormManager().CloseForm("ui/club_2/UIUnionManager_2");
                // app.FormManager().CloseForm("ui/club/UIClubMain");
                app.ClubManager().CloseClubFrom();
            }, function(){
                
            });
        }
    },
});