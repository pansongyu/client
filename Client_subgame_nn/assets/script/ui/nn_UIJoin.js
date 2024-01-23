/*
 UIJoin 登陆界面
*/
var app = require("nn_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
    },
    OnCreateInit: function () {
    	this.ZorderLv = 7;
	    this.sp_shurukuang = this.GetWndNode("sp_shuru/shurukuang");

        this.labelString = [];
        this.GameManager = app[app.subGameName + "_GameManager"]();
	    // this.RegEvent("EnterRoomNeedJoinFamily", this.Event_EnterRoomNeedJoinFamily, this);
	    this.RegEvent("GetFamilyInfo", this.Event_GetFamilyInfo, this);
        this.RegEvent("CodeError", this.Event_CodeError, this);
    },
	//事件回调
    Event_CodeError:function(event){
        let codeInfo = event;
        if(codeInfo["Code"] == this.ShareDefine.CLUB_NotClubJoinRoomErr){
            app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg('CLUB_NotClubJoinRoomErr');
        }
    },
	Event_EnterRoomNeedJoinFamily:function(event){
		let familyID = event["familyID"];

		this.WaitForConfirm("EnterRoomNeedJoinFamily", [], [familyID], this.ShareDefine.ConfirmYN);
	},

	Event_GetFamilyInfo:function(){

		//加入房主工会成功,再次发送进入房间
		if(this.labelString.length == 6){
			let roomKey = this.labelString.join("");
			this.GameManager.SendEnterRoom(roomKey);
		}
		else{
			console.error("Event_GetFamilyInfo labelString error", this.labelString);
		}
	},

    OnShow:function () {
        this.ResetNumber();
    },

    ResetNumber:function(){
        let children = this.sp_shurukuang.children;
        for(let idx = 0; idx < children.length; idx++){
            let sp_bg = children[idx];
            sp_bg.getChildByName("lb_num").getComponent(cc.Label).string = "";
        }
        this.labelString = [];
    },

	/**
	 * 2次确认点击回调
	 * @param curEventType
	 * @param curArgList
	 */
	OnConFirm:function(clickType, msgID, backArgList){
		if(clickType != "Sure"){
			return
		}

		//如果确定加入房主的工会
		if(msgID == "EnterRoomNeedJoinFamily"){
			//发送加入工会
			app[app.subGameName+"_PlayerFamilyManager"]().SendJoinFamily(backArgList[0]);
		}
		else{
			console.error("OnConFirm not find msgID:%s", msgID);
		}
	},
    OnClickForm:function () {
        //this.CloseForm();
    },
    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(!btnName){
            console.error("UIJoin Buttn OnClick(%s) not find btnName", btnName);
        }
        if(btnName === "btn_clear"){
            this.Click_Btn_Clear();
        }
        else if(btnName === "btn_close"){
            this.Click_btn_close();
        }
        else if(btnName === "btn_reset"){
            this.ResetNumber();
        }
        else{
            this.Click_BtnNumber(btnName);
        }
    },

    Click_btn_close:function () {
        this.labelString = [];
        this.OnClick_Close();
    },

    Click_Btn_Clear:function () {
        if(this.labelString.length == 0){
            return
        }
        let node = this.GetWndNode("sp_shuru/shurukuang/sp_bg" + this.labelString.length + "/lb_num");
        node.getComponent(cc.Label).string = "";
        this.labelString.pop();
    },

    Click_BtnNumber:function (btnName) {
        if(this.labelString.length >= 6)
            return;
        let num = Math.floor(btnName.substring(btnName.length - 1));
        this.labelString.push(num);
	    let roomKey = this.labelString.join("");

        let children = this.sp_shurukuang.children;
        for(let idx = 0; idx < children.length; idx++){
            let sp_bg = children[idx];
            let lb_num = sp_bg.getChildByName("lb_num").getComponent(cc.Label);
            if(lb_num.string == ""){
                let data = this.labelString[this.labelString.length -1];
                lb_num.string = data.toString();
                break;
            }
        }
        if(this.labelString.length == 6){
            let self = this;
            app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "EnterRoom", {"roomKey":roomKey,"posID":-1}, function(){}, function(event){
                self.ResetNumber();
            });
        }
    },

});
