"use strict";
cc._RF.push(module, 'b28b0hP5J5Ey67h9do9ZCWh', 'UIRecord');
// script/ui/UIRecord.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout_player: cc.Node,
        bg: cc.Node,
        UIRecord_Child: cc.Prefab
    },

    OnCreateInit: function OnCreateInit() {

        this.ComTool = app.ComTool();

        this.loopScrollView = this.getComponent("LoopScrollView");
    },

    ShowPlayerName: function ShowPlayerName(playerList) {
        var list = [];
        for (var idx in playerList) {
            list.push(playerList[idx]);
        }

        list.sort(function (a, b) {
            return a.pos - b.pos;
        });

        for (var _idx = 0; _idx < list.length; _idx++) {
            var player = list[_idx];
            var path = 'UIInfo/bg/layout_player/lb_name' + (parseInt(_idx) + 1).toString();
            var node = this.GetWndNode(path);
            var name = "";
            if (player.name.length > 4) {
                name = player.name;
                name = name.substring(0, 4) + '...';
            } else {
                name = player.name;
            }
            node.getComponent(cc.Label).string = name;
        }
    },

    OnShow: function OnShow() {

        //清空名字
        for (var i = 0; i < this.layout_player.children.length; i++) {
            var node = this.layout_player.children[i];
            node.getComponent(cc.Label).string = '';
        }

        var playerList = app.RecordData().GetPlayerList();
        var everyGameKeys = app.RecordData().GetEveryGameKeys();

        if (playerList) {
            this.ShowPlayerName(playerList);
        }

        this.loopScrollView.InitScrollData("UIRecord_Child", this.UIRecord_Child, everyGameKeys);
    },

    //-----------------回调函数------------------

    //---------点击函数---------------------
    OnClick: function OnClick(btnName, btnNode) {
        if (btnName == "btn_close") {
            this.CloseForm();
        } else {
            this.ErrLog("OnClick(%s) not find btnName", btnName);
        }
    }

});

cc._RF.pop();