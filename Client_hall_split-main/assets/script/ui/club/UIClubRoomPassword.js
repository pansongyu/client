/*
 UIJoin 登陆界面
*/
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_shurukuang: cc.Node,
    },
    OnCreateInit: function () {
        this.labelString = [];
        this.GameManager = app.GameManager();
    },
    OnShow: function (btnNode,CLubID) {
        this.btnNode=btnNode;
        this.CLubID=CLubID;
        this.ResetNumber();
    },

    ResetNumber: function () {
        let children = this.sp_shurukuang.children;
        for (let idx = 0; idx < children.length; idx++) {
            let sp_bg = children[idx];
            sp_bg.getChildByName("lb_num").getComponent(cc.Label).string = "";
        }
        this.labelString = [];
    },

    //---------点击函数---------------------
    OnClick: function (btnName, btnNode) {
        if (!btnName) {
            this.ErrLog("UIJoin Buttn OnClick(%s) not find btnName", btnName);
        }
        if (btnName === "btn_clear") {
            this.Click_Btn_Clear();
        } else if (btnName === "btn_close") {
            this.Click_btn_close();
        } else if (btnName === "btn_reset") {
            this.ResetNumber();
        } else {
            this.Click_BtnNumber(btnName);
        }
    },

    Click_btn_close: function () {
        this.labelString = [];
        this.OnClick_Close();
    },

    Click_Btn_Clear: function () {
        if (this.labelString.length == 0) {
            return
        }
        let node = this.GetWndNode("sp_shuru/shurukuang/sp_bg" + this.labelString.length + "/lb_num");
        node.getComponent(cc.Label).string = "";
        this.labelString.pop();
    },

    Click_BtnNumber: function (btnName) {
        if (this.labelString.length >= 6)
            return;
        let num = Math.floor(btnName.substring(btnName.length - 1));
        this.labelString.push(num);
        let roomKey = this.labelString.join("");

        let children = this.sp_shurukuang.children;
        for (let idx = 0; idx < children.length; idx++) {
            let sp_bg = children[idx];
            let lb_num = sp_bg.getChildByName("lb_num").getComponent(cc.Label);
            if (lb_num.string == "") {
                let data = this.labelString[this.labelString.length - 1];
                lb_num.string = data.toString();
                break;
            }
        }
        if (this.labelString.length == 6) {
            //存储密码
            localStorage.setItem("password_"+this.CLubID+"_"+this.btnNode.tagId,roomKey);
            //触发重新加入事件
            app.Client.OnEvent("ReJoin",this.btnNode);
            this.CloseForm();
        }
    },
});
