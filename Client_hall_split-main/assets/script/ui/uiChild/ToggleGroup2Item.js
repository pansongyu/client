
var app = require("app");
cc.Class({
    extends: require("BaseChildForm"),

    properties: {
    },


    //-----------------回调函数------------------
    //开始编辑文本输入框触发的事件回调。
    onEditingDidBegan: function(event){
        // console.log("onEditingDidBegan:", event);
    },

    //编辑文本输入框时触发的事件回调。
    onTextChanged: function(event){
        console.log("onTextChanged:", event);
        // let editboxStr = event.replace('-', '');
        //默认为0
        if(event == ""){
            event = "0";
        }
        this.editboxStr = event;
        let result = (this.editboxStr.toString()).indexOf(".");
        if(result != -1 && result <= 6) {
            // alert("含有小数点");
        } else {
            // alert("不含小数点");
            this.editboxStr = event.substring(0,5);
        }
        this.editboxStr = this.editboxStr.replace(/[^\d.]/g, "");
        this.editboxStr = parseFloat(this.editboxStr).toFixed(2);
        if(this.node.getChildByName("Toggle2"))this.node.getChildByName("Toggle2").getChildByName("editbox").getComponent(cc.EditBox).string = this.editboxStr;
        
    },

    //结束编辑文本输入框时触发的事件回调。
    onEditingDidEnded: function(event){
        // console.log("onEditingDidEnded:", event);
        if(this.node.getChildByName("Toggle2"))this.node.getChildByName("Toggle2").getChildByName("editbox").getComponent(cc.EditBox).string = this.editboxStr;
    },

    //当用户按下回车按键时的事件回调
    onEditingReturn: function(event){
        // console.log("onEditingReturn:", event);
        if(this.node.getChildByName("Toggle2"))this.node.getChildByName("Toggle2").getChildByName("editbox").getComponent(cc.EditBox).string = this.editboxStr;
    },

});

