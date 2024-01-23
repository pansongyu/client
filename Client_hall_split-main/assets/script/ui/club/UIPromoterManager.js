var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {

    },

    OnCreateInit: function () {
        this.WeChatManager=app.WeChatManager();
        this.InitEvent();
    },
    InitEvent:function(){
        //基础网络包
        this.NetManager=app.NetManager();
        this.RegEvent("CodeError", this.Event_CodeError, this);
    },
    Event_CodeError:function(event){
        let code = event["Code"];
    },
    //--------------显示函数-----------------
    OnShow:function(clubId, unionId, myisPartner, unionPostType, myisminister, unionSign, btn_defaultName="btn_PromoterList"){
        this.clubId = clubId;
        this.unionId = unionId;
        this.myisPartner = myisPartner;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionSign = unionSign;
        this.lastClickBtnName = "";
        let btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name,btn_default);
        this.UpdateLeftBtn();
    },
    UpdateLeftBtn:function(){
        let btn_PromoterList = this.node.getChildByName("left").getChildByName("btn_PromoterList");
        let btn_PromoterMsg = this.node.getChildByName("left").getChildByName("btn_PromoterMsg");
        let btn_PromoterXiaShuList = this.node.getChildByName("left").getChildByName("btn_PromoterXiaShuList");
        //如果是创建者打开
        if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            btn_PromoterList.active = true;
            btn_PromoterXiaShuList.active = false;
        }else{
            btn_PromoterList.active = false;
            btn_PromoterXiaShuList.active = true;
        }
    },
    ClickLeftBtn:function(clickName){
        let rightNode = this.node.getChildByName("right");
        let allRightBtn = [];
        for (let i = 0; i < rightNode.children.length; i++) {
            allRightBtn.push(rightNode.children[i]);
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
                allRightBtn[i].getComponent(allRightBtn[i].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.myisPartner);
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
            return;
        }
    },
    OnClick:function(btnName, btnNode){
        if('btn_close'==btnName){
            this.CloseForm();
        }else if('btn_PromoterList'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_PromoterMsg'==btnName){
            this.ClickLeftBtn(btnName);
        }else if('btn_PromoterXiaShuList'==btnName){
            this.ClickLeftBtn(btnName);
        }
    },
});