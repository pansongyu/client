var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        rankZhongZhiNode:cc.Node,
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
    OnShow:function(clubId, unionId, unionName, unionPostType, myisminister, unionSign, levelPromotion,rankedOpenZhongZhi, rankedOpenEntryZhongZhi, btn_defaultName="btn_day_0"){
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.levelPromotion = levelPromotion;
        this.rankedOpenZhongZhi = rankedOpenZhongZhi;
        this.rankedOpenEntryZhongZhi = rankedOpenEntryZhongZhi;
        this.UpdateLeftBtn();
        this.lastClickBtnName = "";
        let lb_Title = this.node.getChildByName("bg_create").getChildByName("lb_Title");
        lb_Title.getComponent(cc.Label).string = unionName + "（ID:" + unionSign + "）";
        let btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name,btn_default);
    },
    UpdateLeftBtn:function(){

    },
    ClickLeftBtn:function(clickName){
        let rightNode = this.node.getChildByName("right");
        let allRightBtn = [];
        for (let i = 0; i < rightNode.children.length; i++) {
            allRightBtn.push(rightNode.children[i]);
        }
        for (let i = 0; i < allRightBtn.length; i++) {
            if (allRightBtn[i].name == this.lastClickBtnName + "Node") {
                if (allRightBtn[i].getComponent(allRightBtn[i].name).isClickAnyWnd) {
                    allRightBtn[i].getComponent(allRightBtn[i].name).isClickAnyWnd = false;
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
        let getType = clickName.replace('btn_day_','');
        this.rankZhongZhiNode.getComponent("btn_RankZhongzhiNode").InitData(this.clubId, this.unionId, getType,this.rankedOpenZhongZhi, this.rankedOpenEntryZhongZhi);
        // for (let i = 0; i < allRightBtn.length; i++) {
        //     if (allRightBtn[i].name == clickName + "Node") {
        //         allRightBtn[i].active = true;
        //         allRightBtn[i].getComponent(allRightBtn[i].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign, this.levelPromotion);
        //     }else{
        //         allRightBtn[i].active = false;
        //     }
        // }
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
    },
    OnClick:function(btnName, btnNode){
        if('btn_close'==btnName){
            this.CloseForm();
        }else if(btnName.startsWith("btn_day_")){
            this.ClickLeftBtn(btnName);
        }
    },
});