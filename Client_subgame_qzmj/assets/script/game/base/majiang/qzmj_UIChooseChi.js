/*
 UIChooseCard 界面基类(又FormManager控制创建和销毁)
 */
var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        btn_chi1:cc.Node,
        btn_chi2:cc.Node,
        btn_chi3:cc.Node
    },

    OnCreateInit: function () {
        this.ComTool = app[app.subGameName+"_ComTool"]();
    },

    OnShow: function (chiList,opCard) {
        this.is3DShow=this.LocalDataManager.GetConfigProperty("SysSetting", app.subGameName+"_is3DShow");
        this.RoomMgr =app[app.subGameName.toUpperCase()+"RoomMgr"]();
        this.chiList=chiList;
        this.btn_chi1.active = 0;
        this.btn_chi2.active = 0;
        this.btn_chi3.active = 0;
        let count = chiList.length;
        for(let i = 0; i < count; i++){
            let btn_chi_Path = this.ComTool.StringAddNumSuffix("btn_chi", i+1,1);
            this.SetWndProperty(btn_chi_Path, "active", 1);
            for(let j=0;j<3;j++){
                let cardType = Math.floor(chiList[i][j]/100);
                let cardPath = this.ComTool.StringAddNumSuffix("btn_chi",i+1,1)+'/'+this.ComTool.StringAddNumSuffix("card",j+1,2);
                 let imageName='';
                if(this.is3DShow == 1||this.is3DShow == 2){
	                imageName = ["CardShow",cardType].join("");
                }else if(this.is3DShow == 0){ 
                    imageName = ["Card2DShow",cardType].join("");
                }
                let wndNode = this.GetWndNode(cardPath);
                wndNode.CardType = cardType;
                this.SetWndProperty(cardPath, "image", imageName);
                if(Math.floor(opCard/100)==Math.floor(chiList[i][j]/100)){
                    this.SetWndProperty(cardPath, "color", cc.color(150,150,150));
                }else{
                    this.SetWndProperty(cardPath, "color", cc.color(255,255,255));
                } 
            }
           
        }
    },

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_chi1"){
            this.RoomMgr.SendPosAction(this.chiList[0][0], this.ShareDefine.OpType_Chi);
        }
        else if(btnName == "btn_chi2"){
            this.RoomMgr.SendPosAction(this.chiList[1][0], this.ShareDefine.OpType_Chi);
        }
        else if(btnName == "btn_chi3"){
            this.RoomMgr.SendPosAction(this.chiList[2][0], this.ShareDefine.OpType_Chi);
        }
        if(this.is3DShow == 1){
            this.FormManager.GetFormComponentByFormName("game/"+app.subGameName.toUpperCase()+"/ui/UI"+app.subGameName.toUpperCase()+"Play").GetCardComponentByPos(1).CloseSpTiShi();
        } else if(this.is3DShow == 0){
            this.FormManager.GetFormComponentByFormName("game/"+app.subGameName.toUpperCase()+"/ui/UI"+app.subGameName.toUpperCase()+"2DPlay").GetCardComponentByPos(1).CloseSpTiShi();
        }else {
	        this.FormManager.GetFormComponentByFormName("game/"+app.subGameName.toUpperCase()+"/ui/UI"+app.subGameName.toUpperCase()+"WBPlay").GetCardComponentByPos(1).CloseSpTiShi();
        }
        this.CloseForm();
    },
});