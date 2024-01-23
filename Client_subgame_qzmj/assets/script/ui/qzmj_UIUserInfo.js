var app = require("qzmj_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
        sp_boy:cc.SpriteFrame,
        sp_girl:cc.SpriteFrame,
        itemPrefab:cc.Prefab,
    },

    OnCreateInit: function () {
    	this.ZorderLv = 7;
    	this.sp_ip = this.node.getChildByName("sp_ip");
    	this.sp_gps = this.node.getChildByName("sp_gps");
    	this.sp_head = this.node.getChildByName("sprite_head").getComponent(cc.Sprite);
    	this.sp_female = this.node.getChildByName("sp_female").getComponent(cc.Sprite);
    	this.label_name = this.GetWndNode("sp_female/label_name").getComponent(cc.Label);
    	this.label_id = this.GetWndNode("sp_id/label_ID").getComponent(cc.Label);
    	this.label_ip = this.GetWndNode("sp_ip/label_IP").getComponent(cc.Label);
    	this.label_gps = this.GetWndNode("sp_gps/lb_gps").getComponent(cc.Label);
    	this.itemsNode = this.GetWndNode("ScrollView/items");
    	this.btnCopyNode = this.GetWndNode("sp_id/btn_copy");
    	this.editBox = this.GetWndNode("sp_id/editBox").getComponent(cc.EditBox);

        this.ReqIP();
        this.pos=-1;
        this.RegEvent("SHOWINFODISTANCE", this.OnEvt_ShowInfoDistance);
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf);
        
        let Gifts = app[app.subGameName+"_SysDataManager"]().GetTableDict("Gift");
        this.giftCfg = [];
        for(let key in Gifts){
            let itemNode = cc.instantiate(this.itemPrefab);
            itemNode.name = 'item' + key;
            itemNode.on('click',this.OnGiftClick,this);

            this.itemsNode.addChild(itemNode);
            let imgPath = 'texture/ui/' + app.subGameName + '_UIUserInfo/' + Gifts[key].ImageName;
            let iconPath = 'ScrollView/items/' + itemNode.name + '/item_icon'
            this.SetWndImageByFilePath(iconPath,imgPath);
        }
        this.editBox.node.on('editing-did-ended',this.EditBoxChangeCB,this);
    },
    EditBoxEndCB:function(){
        this.editBox.string = this.label_id.string;
    },
    OnShow: function (pos=-1) {
//        app.LocationMgr().setType("userinfo");
        this.pos = pos;
        if(pos<0){
            this.sp_gps.active = false;
            this.itemsNode.active = false;
            this.ShowHero_NameOrID();
        }else{
            this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
            let room = this.RoomMgr.GetEnterRoom();
            let roomPosMgr = room.GetRoomPosMgr();
            this.sp_gps.active = true;
            this.itemsNode.active = true;
            this.ShowPlayerInfo(room);
            let playerInfo=roomPosMgr.GetPlayerInfoByPos(this.pos);
            if(playerInfo){
                this.ShowPlayerAddress(playerInfo.pid);
            }
        }
        this.ShowSex();
        this.SetGiftBtnInteractable(this.sp_gps.active);
    },
    ShowPlayerAddress:function(pid){
        if(pid>0){
            let that=this;
            let sendPack={"pid":pid};
            app[app.subGameName + "_NetManager"]().SendPack("game.CPlayerLocationInfo",sendPack,function(success){
                let detail=success.locationInfo;
                let address=detail.Address;
                let updateTime=detail.updateTime;
                let now=Math.floor(new Date().getTime()/1000);
                if(now-updateTime>10800){
                    //3小时内的定位有效
                    that.label_gps.string ="未知地址";
                    return;
                }
                if(address){
                    that.label_gps.string ="地址:"+address;
                }else{
                    that.label_gps.string ="未知地址";
                }
                
            },function(error){
                //全部定位获取失败
                that.label_gps.string ="未知地址";
            });
        }else{
            this.label_gps.string ="未知地址";
        }
        //显示用户ip
       // this.SendHttpRequest('http://www.qp355.com/myip.php', "?Sign=ddcat", "GET",{});
    },
    SendHttpRequest:function(serverUrl, argString, requestType, sendPack){

        var url = [serverUrl, argString].join("")

        var dataStr = JSON.stringify(sendPack);

        //每次都实例化一个，否则会引起请求结束，实例被释放了
        var httpRequest = new XMLHttpRequest();

        httpRequest.timeout = 2000;


        httpRequest.open(requestType, url, true);
        //服务器json解码
        httpRequest.setRequestHeader("Content-Type", "application/json");
        var that = this;
        httpRequest.onerror = function(){
            that.ErrLog("httpRequest.error:%s", url);
            that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        };
        httpRequest.ontimeout = function(){
            
        };
        httpRequest.onreadystatechange = function(){

            //执行成功
            if (httpRequest.status == 200){
                if(httpRequest.readyState == 4){
                    that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
                }
            }
            else{
                that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
                that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
            }
        };
        httpRequest.send(dataStr);

    },
    OnReceiveHttpPack:function(serverUrl, httpResText){
        try{
            let serverPack = JSON.parse(httpResText);
            if(serverPack["IsSuccess"] == 1){
                this.sp_ip.getChildByName('label_IP').getComponent(cc.Label).string=serverPack.myip;
            }
            else{
               this.sp_ip.getChildByName('label_IP').getComponent(cc.Label).string='未知ip';
            }
        }
        catch (error){
            this.sp_ip.getChildByName('label_IP').getComponent(cc.Label).string='未知ip';
        }
    },
    OnConnectHttpFail:function(serverUrl, readyState, status){
       this.sp_ip.getChildByName('label_IP').getComponent(cc.Label).string='未知ip';
    },
    SetGiftBtnInteractable:function(bEnable){
        let items = this.itemsNode.children;
        for(let i=0;i<items.length;i++){
            let btn = items[i].getComponent(cc.Button);
            if(btn)
                btn.interactable = bEnable;
        }
    },
    ShowPlayerInfo:function(room){
        let roomPosMgr = room.GetRoomPosMgr();
        let allPlayerInfo = null;
        if(roomPosMgr)
            allPlayerInfo = roomPosMgr.GetRoomAllPlayerInfo();
        else
            allPlayerInfo = room.GetRoomProperty('posList');
        let playerInfo = allPlayerInfo[this.pos];
        this.label_name.string = playerInfo["name"];
        this.label_id.string = this.ComTool.GetPid(playerInfo["pid"]);
        this.editBox.string = this.label_id.string;
        this.SetShowIDNode();
        if(playerInfo["playerIP"]==undefined){
            this.label_ip.string="ip获取失败"
        }else{
            this.label_ip.string = playerInfo["playerIP"];  
        }
        //this.label_gps.string = "您距"+ this.label_name.string +"的距离：未知距离";
        let WeChatHeadImage1 = this.sp_head.getComponent(app.subGameName + "_WeChatHeadImage");
        WeChatHeadImage1.ShowHeroHead(playerInfo["pid"]);

        //app.LocationMgr().OnGetLocation();
        this.unionId = this.RoomMgr.GetEnterRoom().GetRoomConfigByProperty("unionId");
        if (playerInfo["pid"] == app[app.subGameName + "_HeroManager"]().GetHeroID() && this.unionId > 0) {
            this.node.getChildByName("lb_bsf").getComponent(cc.Label).string = "比赛分:" + playerInfo.sportsPoint
        }
        else{
            this.node.getChildByName("lb_bsf").getComponent(cc.Label).string = ""
        }
    },
    //显示距离
    OnEvt_ShowInfoDistance:function(event){
        let room = this.RoomMgr.GetEnterRoom();
        let roomPosMgr = room.GetRoomPosMgr();
        let distance = parseInt(event["distance"].toString());
        if(event["pos1"]==roomPosMgr.GetClientPos()&&event["pos2"]==this.pos){
            this.label_gps.string = "您距"+ this.label_name.string +"的距离："+ distance +"米";
        }else if(event["pos2"]==roomPosMgr.GetClientPos()&&event["pos1"]==this.pos){
            this.label_gps.string = "您距"+ this.label_name.string +"的距离："+ distance +"米";
        }
    },
    ReqIP:function(){
        app[app.subGameName + "_NetManager"]().SendPack('game.CPlayerAddress', {});
    },
  
    ShowHero_NameOrID:function () {
        let heroName = app[app.subGameName + "_HeroManager"]().GetHeroProperty("name");
        this.label_name.string =heroName;
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        this.label_id.string =this.ComTool.GetPid(heroID);// app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        this.editBox.string = this.label_id.string;
        let WeChatHeadImage1 = this.sp_head.getComponent(app.subGameName + "_WeChatHeadImage");
        WeChatHeadImage1.ShowHeroHead(heroID);
        this.SetShowIDNode();
    },
    ShowSex:function(){
    	let sex = -1;
        if(-1 == this.pos)
            sex = app[app.subGameName+"_HeroAccountManager"]().GetAccountProperty("Sex");
        else{
            let room = this.RoomMgr.GetEnterRoom();
            sex = room.GetRoomProperty('posList')[this.pos].sex;
        }
    	if (sex == app[app.subGameName+"_ShareDefine"]().HeroSex_Boy) {
    		this.sp_female.spriteFrame = this.sp_boy;
    	} else {
    		this.sp_female.spriteFrame = this.sp_girl;
    	}
    },
    OnGiftClick:function(event){
        if(-1 == this.pos)
            return;
        if(!this.RoomMgr)
            return;
        let room = this.RoomMgr.GetEnterRoom();
        if(!room)
            return;

        let itemName = event.target.name;
        let data = {};
        data.roomID = room.GetRoomProperty("roomID");
        data.pos = this.pos;
        data.productId = parseInt(itemName.substr(('item').length));
        app[app.subGameName + "_NetManager"]().SendPack(app.subGameName + ".C" + app.subGameName.toUpperCase() + "SendGift", data);
        this.CloseForm();
    },
    SetShowIDNode:function(){
        if(cc.sys.isNative){
            this.label_id.node.active = true;
            this.editBox.node.active = false;
            //this.btnCopyNode.active = true;
        }
        else{
            this.label_id.node.active = false;
            this.editBox.node.active = true;
            this.btnCopyNode.active = false;
        }
    },
    OnEvt_CopyTextNtf:function(event){
        if(0 == event.code)
            this.ShowSysMsg("已复制ID："+event.msg);
        else
            this.ShowSysMsg("复制失败");
    },
    OnClick:function(btnName, btnNode){
        if('btn_copy' == btnName){
            let str = this.label_id.string;
            if(cc.sys.isNative){
                let argList = [{"Name":"msg","Value":str.toString()}];
                app[app.subGameName + "_NativeManager"]().CallToNative("copyText", argList);
            }
            else{
                
            }
        }
    },
});
