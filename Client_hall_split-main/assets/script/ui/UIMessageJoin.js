/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        lb_message:cc.Label,
    },

    //初始化
    OnCreateInit:function(){
        this.ShareDefine = app.ShareDefine();

    },

    //---------显示函数--------------------

    OnShow:function(serverPack){
        this.RoomKey=serverPack.roomKey;
        let name=serverPack.name;
        let type=serverPack.continueType;
        let typeName="";
        if(type==0){
            typeName="房主付";
        }else if(type==1){
            typeName="平分";
        }else if(type==2){
            typeName="大赢家";
        }
        this.lb_message.string=name+" 选择 "+typeName+" 续局，是否加入该房间？";
    },

    //---------点击函数---------------------

	OnClick:function(btnName, eventData){
		if(btnName == "btnSure"){
            let self = this;
            app.NetManager().SendPack("room.CBaseGetGameType", {"roomKey":this.RoomKey}, function(event){
                let gameType = event;
                let name = app.ShareDefine().GametTypeID2PinYin[gameType];
                app.Client.JoinRoomCheckSubGame(name, self.RoomKey);
            }, function(event){
            });
        }
        else if(btnName == "btnCancel"){
            this.CloseForm();
        }
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},

});
