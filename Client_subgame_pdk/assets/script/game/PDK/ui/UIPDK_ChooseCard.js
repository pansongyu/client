/*
 UIChooseCard 界面基类(又FormManager控制创建和销毁)
 */
var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        card01:cc.Node,
        card02:cc.Node,
        card03:cc.Node,
        card04:cc.Node
    },

    OnCreateInit: function () {
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
    },

    OnShow: function (huPaiList) {
        this.card01.active = 0;
        this.card02.active = 0;
        this.card03.active = 0;
        this.card04.active = 0;

        let count = huPaiList.length;
        for(let i = 0; i < count; i++){
	        let cardType = huPaiList[i];
		    let cardPath = this.ComTool.StringAddNumSuffix("card", i+1, 2);
		    let imageName = ["CardShow", huPaiList[i]].join("");
	         let wndNode = this.GetWndNode(cardPath);
	         wndNode.CardType = cardType;

	        this.SetWndProperty(cardPath, "active", 1);
	        this.SetWndProperty(cardPath, "image", imageName);
	    }
    },

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName.startsWith("card")){
            this.Click_EmitAnGang(btnNode);
        }
        else {
            this.ErrLog("OnClick btnName:%s not find  ", btnName);
        }
    },
    Click_EmitAnGang:function (btnNode) {
	    let cardType = btnNode.CardType;
        let sendCardID = [cardType, "01"].join("");
        this.RoomMgr.SendPosAction(sendCardID, this.ShareDefine.OpType_AnGang);
        this.FormManager.GetFormComponentByFormName("UICard01").CloseSpTiShi();
        this.CloseForm();
    },
});