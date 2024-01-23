var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout_player:cc.Node,
        bg:cc.Node,
        UIRecord_Child: cc.Prefab,
    },

    OnCreateInit: function () {
    
        this.ComTool = app.ComTool();

        this.loopScrollView = this.getComponent("LoopScrollView");
    },


    ShowPlayerName:function(playerList){
        let list = [];
        for(let idx in playerList){
            list.push(playerList[idx]);
        }

        list.sort(function(a, b){
            return a.pos - b.pos;
        });
        
        for(let idx = 0; idx < list.length; idx++){
            let player = list[idx];
            let path = 'UIInfo/bg/layout_player/lb_name' + (parseInt(idx)+1).toString();
            let node = this.GetWndNode(path);
            let name = "";
            if(player.name.length > 4){
                name = player.name;
                name = name.substring(0, 4) + '...';
            }
            else{
                name = player.name;
            }
            node.getComponent(cc.Label).string = name;
        }
        
    },

    OnShow:function () {

        //清空名字
        for(let i = 0; i < this.layout_player.children.length; i++){
            let node = this.layout_player.children[i];
            node.getComponent(cc.Label).string = '';
        }

        let playerList = app.RecordData().GetPlayerList();
        let everyGameKeys = app.RecordData().GetEveryGameKeys();

        if(playerList){
            this.ShowPlayerName(playerList);
        }

        this.loopScrollView.InitScrollData("UIRecord_Child", this.UIRecord_Child, everyGameKeys);
    },

    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }
        else{
            this.ErrLog("OnClick(%s) not find btnName",btnName);
        }
    },


});