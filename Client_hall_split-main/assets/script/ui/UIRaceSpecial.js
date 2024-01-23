var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
    	right_child:cc.Prefab,
        node_rightLayout:cc.Node,
    },
    OnCreateInit:function(){
       
    },
    OnShow:function(){
        app.FormManager().CloseForm('UINewMain');
        app.FormManager().ShowForm('UIEconomy','UIRaceSpecial');
    },
    OnClick:function(btnName, btnNode){
        
    },
    OnConFirm:function(clickType, msgID, backArgList){
        
    }
});
