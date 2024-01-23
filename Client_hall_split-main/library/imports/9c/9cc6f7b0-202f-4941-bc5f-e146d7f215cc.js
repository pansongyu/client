"use strict";
cc._RF.push(module, '9cc6fewIC9JQbxf4UbX8hXM', 'UIUserInfo');
// script/ui/UIUserInfo.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_head: cc.Sprite,
        label_name: cc.Label,
        label_id: cc.Label,
        label_gold: cc.Label,
        label_roomCard: cc.Label,
        label_clubCard: cc.Label,
        label_ip: cc.Label,
        label_gps: cc.Label,
        sp_female: cc.Sprite,
        sp_ip: cc.Node,
        sp_gps: cc.Node,
        icon_roomCard: cc.Node,
        icon_coin: cc.Node,
        icon_clubCard: cc.Node,
        sp_boy: cc.SpriteFrame,
        sp_girl: cc.SpriteFrame,
        itemsNode: cc.Node,
        editBox: cc.EditBox,
        btnCopyNode: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.RegEvent("EVT_PlayerAddress", this.Event_PlayerAddress);
        this.ReqIP();
        this.pos = -1;
        this.heroIp = 0;
        this.RegEvent("SHOWINFODISTANCE", this.OnEvt_ShowInfoDistance);
        this.RegEvent("OnCopyTextNtf", this.OnEvt_CopyTextNtf);
        this.RegEvent("OnUploadImage", this.Event_OnUploadImage, this);
        // let Gifts = app.SysDataManager().GetTableDict("Gift");
        // this.giftCfg = [];
        // for(let key in Gifts){
        //     let itemNode = cc.instantiate(this.itemPrefab);
        //     itemNode.name = 'item' + key;
        //     itemNode.on('click',this.OnGiftClick,this);

        //     let typeStr = 'type' + Gifts[key].Type;
        //     let typeNode = itemNode.getChildByName(typeStr);
        //     let numLabel = typeNode.getChildByName('label').getComponent(cc.Label);
        //     numLabel.string = Gifts[key].Num;
        //     //typeNode.active = true;
        //     typeNode.active = false;
        //     this.itemsNode.addChild(itemNode);
        //     let imgPath = 'texture/gift/' + Gifts[key].ImageName;
        //     let iconPath = 'ScrollView/items/' + itemNode.name + '/item_icon'
        //     this.SetWndImageByFilePath(iconPath,imgPath);
        // }
        this.WeChatManager = app.WeChatManager();
        this.editBox.node.on('editing-did-ended', this.EditBoxChangeCB, this);
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
    },
    EditBoxEndCB: function EditBoxEndCB() {
        this.editBox.string = this.label_id.string;
    },
    Event_PlayerAddress: function Event_PlayerAddress(event) {
        var argDict = event;
        var pid = argDict['pid'];
        var address = argDict['address'];
        address = address.replace('/', '');
        try {
            var subIndex = address.indexOf(':');
            if (-1 != subIndex) address = address.substring(0, subIndex);
        } catch (error) {
            this.ErrLog('Address sub error address : ' + address);
        }
        this.label_ip.string = address;
        this.heroIp = address;
    },
    Event_HeroProperty: function Event_HeroProperty(event) {
        var argDict = event;
        if (argDict["Property"] == "gold") {
            this.ShowFastCount();
        } else if (argDict["Property"] == "roomCard") {
            this.ShowRoomCard();
        } else if (argDict["Property"] == "clubCard") {
            this.ShowClubCard();
        }
    },
    OnShow: function OnShow() {
        var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

        //        app.LocationMgr().setType("userinfo");
        this.pos = pos;
        if (pos < 0) {
            this.isMobile = app.HeroAccountManager().GetAccountProperty("isMobile");
            //this.icon_coin.active = true;
            this.icon_coin.active = false;
            this.icon_roomCard.active = true;
            this.icon_clubCard.active = false;
            this.sp_gps.active = false;
            this.itemsNode.active = false;
            this.ShowHero_NameOrID();
            this.ShowFastCount();
            this.ShowRoomCard();
            this.ShowClubCard();
            if (this.isMobile == 1 || !cc.sys.isNative) {
                this.ShowEditName();
            } else {
                this.ShowLabelName();
            }
        } else {
            this.isMobile = 0;
            this.sp_gps.active = true;
            this.icon_roomCard.active = false;
            this.icon_coin.active = false;
            this.icon_clubCard.active = false;
            this.itemsNode.active = true;
        }
        this.ShowSex();
        this.SetGiftBtnInteractable(this.sp_gps.active);
    },
    ShowLabelName: function ShowLabelName() {
        this.node.getChildByName("EditBox").active = false;
        this.node.getChildByName("btn_save").active = false;
        this.node.getChildByName("label_name").active = true;
    },
    ShowEditName: function ShowEditName() {
        this.node.getChildByName("EditBox").active = true;
        this.node.getChildByName("EditBox").getComponent(cc.EditBox).string = app.HeroManager().GetHeroProperty("name");
        this.node.getChildByName("btn_save").active = true;
        this.node.getChildByName("label_name").active = false;
    },
    ShowPlayerAddress: function ShowPlayerAddress(pid) {
        if (pid > 0) {
            var that = this;
            var sendPack = { "pid": pid };
            app.NetManager().SendPack("game.CPlayerLocationInfo", sendPack, function (success) {
                var detail = success.locationInfo;
                var address = detail.Address;
                var updateTime = detail.updateTime;
                var now = Math.floor(new Date().getTime() / 1000);
                if (now - updateTime > 10800) {
                    //3小时内的定位有效
                    that.label_gps.string = "未知地址";
                    return;
                }
                if (address) {
                    that.label_gps.string = "地址:" + address;
                } else {
                    that.label_gps.string = "未知地址";
                }
            }, function (error) {
                //全部定位获取失败
                that.label_gps.string = "未知地址";
            });
        } else {
            this.label_gps.string = "未知地址";
        }
        //显示用户ip
        //    this.SendHttpRequest('http://fb.qicaiqh.com/myip.php', "?Sign=ddcat", "GET",{});
    },
    /*SendHttpRequest:function(serverUrl, argString, requestType, sendPack){
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
    },*/
    SetGiftBtnInteractable: function SetGiftBtnInteractable(bEnable) {
        var items = this.itemsNode.children;
        for (var i = 0; i < items.length; i++) {
            var btn = items[i].getComponent(cc.Button);
            if (btn) btn.interactable = bEnable;
        }
    },
    ShowPlayerInfo: function ShowPlayerInfo(room) {
        var roomPosMgr = room.GetRoomPosMgr();
        var allPlayerInfo = null;
        if (roomPosMgr) allPlayerInfo = roomPosMgr.GetRoomAllPlayerInfo();else allPlayerInfo = room.GetRoomProperty('posList');
        var playerInfo = allPlayerInfo[this.pos];
        this.label_name.string = this.ComTool.GetBeiZhuName(playerInfo["pid"], playerInfo["name"], 9);
        this.label_id.string = this.ComTool.GetPid(playerInfo["pid"]);
        this.editBox.string = this.label_id.string;
        this.SetShowIDNode();
        if (playerInfo["playerIP"] == undefined) {
            this.label_ip.string = "ip获取失败";
        } else {
            this.label_ip.string = playerInfo["playerIP"];
        }
        var WeChatHeadImage1 = this.sp_head.getComponent("WeChatHeadImage");
        WeChatHeadImage1.ShowHeroHead(playerInfo["pid"]);
    },
    //显示距离
    OnEvt_ShowInfoDistance: function OnEvt_ShowInfoDistance(event) {
        var room = this.RoomMgr.GetEnterRoom();
        var roomPosMgr = room.GetRoomPosMgr();
        var distance = parseInt(event["distance"].toString());
        if (event["pos1"] == roomPosMgr.GetClientPos() && event["pos2"] == this.pos) {
            this.label_gps.string = "您距" + this.label_name.string + "的距离：" + distance + "米";
        } else if (event["pos2"] == roomPosMgr.GetClientPos() && event["pos1"] == this.pos) {
            this.label_gps.string = "您距" + this.label_name.string + "的距离：" + distance + "米";
        }
    },
    ReqIP: function ReqIP() {
        app.NetManager().SendPack('game.CPlayerAddress', {});
    },
    ShowFastCount: function ShowFastCount() {
        //let fastCard = app.HeroManager().GetHeroProperty("fastCard");
        var gold = app.HeroManager().GetHeroProperty('gold');
        this.label_gold.string = gold;
    },
    ShowRoomCard: function ShowRoomCard() {
        var heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.label_roomCard.string = heroRoomCard;
    },
    ShowClubCard: function ShowClubCard() {
        var heroClubCard = app.HeroManager().GetHeroProperty("clubCard");
        this.label_clubCard.string = heroClubCard;
    },
    ShowHero_NameOrID: function ShowHero_NameOrID() {
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var heroName = app.HeroManager().GetHeroProperty("name");
        this.label_name.string = this.ComTool.GetBeiZhuName(heroID, heroName);
        this.label_id.string = this.ComTool.GetPid(heroID); // app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});
        this.editBox.string = this.label_id.string;
        var WeChatHeadImage1 = this.sp_head.getComponent("WeChatHeadImage");
        WeChatHeadImage1.ShowHeroHead(heroID);
        this.SetShowIDNode();
    },
    ShowSex: function ShowSex() {
        var sex = -1;
        if (-1 == this.pos) sex = app.HeroAccountManager().GetAccountProperty("Sex");else {
            var room = this.RoomMgr.GetEnterRoom();
            sex = room.GetRoomProperty('posList')[this.pos].sex;
        }
        if (sex == app.ShareDefine().HeroSex_Boy) {
            this.sp_female.spriteFrame = this.sp_boy;
        } else {
            this.sp_female.spriteFrame = this.sp_girl;
        }
    },
    OnGiftClick: function OnGiftClick(event) {
        if (-1 == this.pos) return;
        if (!this.RoomMgr) return;
        var room = this.RoomMgr.GetEnterRoom();
        if (!room) return;
        var typeJinBi = event.target.getChildByName('type1');
        var typeCard = event.target.getChildByName('type6');
        var label = null;
        var num = 0;
        var gold = app.HeroManager().GetHeroProperty('gold');
        var card = app.HeroManager().GetHeroProperty("roomCard");
        if (typeJinBi.active) {
            label = typeJinBi.getChildByName('label').getComponent(cc.Label);
            num = parseInt(label.string);
            if (num > gold) {
                this.ShowSysMsg("WarnFastGoldNotEnough");
                return;
            }
        } else if (typeCard.active) {
            label = typeCard.getChildByName('label').getComponent(cc.Label);
            num = parseInt(label.string);
            if (num > card) {
                this.ShowSysMsg("WarnFastCardNotEnough");
                return;
            }
        }

        var itemName = event.target.name;
        var data = {};
        data.roomID = room.GetRoomProperty("roomID");
        data.pos = this.pos;
        data.productId = parseInt(itemName.substr('item'.length));
        app.NetManager().SendPack('game.CPlayerSendGift', data);
        this.CloseForm();
    },
    SetShowIDNode: function SetShowIDNode() {
        if (cc.sys.isNative) {
            this.label_id.node.active = true;
            this.editBox.node.active = false;
            //this.btnCopyNode.active = true;
        } else {
            this.label_id.node.active = false;
            this.editBox.node.active = true;
            this.btnCopyNode.active = false;
        }
    },
    OnEvt_CopyTextNtf: function OnEvt_CopyTextNtf(event) {
        if (0 == event.code) this.ShowSysMsg("已复制ID：" + event.msg);else this.ShowSysMsg("复制失败");
    },
    Event_OnUploadImage: function Event_OnUploadImage(event) {
        var heroID = app.HeroManager().GetHeroProperty("pid");
        var uploadImgURL = event.uploadImgURL;
        this.WeChatManager.InitHeroHeadImage(heroID, uploadImgURL);
        var WeChatHeadImage1 = this.sp_head.getComponent("WeChatHeadImage");
        WeChatHeadImage1.ShowHeroHead(heroID);
        //保存头像给服务端
        app.NetManager().SendPack("player.CPlayerChangeNameAndHeadImg", { "name": '', "headImg": uploadImgURL }, function (event) {
            app.SysNotifyManager().ShowSysMsg("修改成功", [], 3);
            app.Client.OnEvent("HeroProperty", { "Property": 'headimg' });
        }, function (event) {
            console.log("头像保存失败");
        });
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_copy' == btnName) {
            var str = this.label_id.string;
            if (cc.sys.isNative) {
                var argList = [{ "Name": "msg", "Value": str.toString() }];
                var promisefunc = function promisefunc(resolve, reject) {
                    app.NativeManager().CallToNative("copyText", argList);
                };
                return new app.bluebird(promisefunc);
            } else {}
        } else if ("btn_save" == btnName) {
            //保存名字
            var name = this.node.getChildByName("EditBox").getComponent(cc.EditBox).string;
            if (name == "") {
                app.SysNotifyManager().ShowSysMsg("请输入名字", [], 3);
            }
            app.NetManager().SendPack("player.CPlayerChangeNameAndHeadImg", { "name": name, "headImg": '' }, function (event) {
                app.HeroManager().SetHeroProperty("name", name);
                app.SysNotifyManager().ShowSysMsg("修改成功", [], 3);
                //刷新大厅名字
                app.Client.OnEvent("HeroProperty", { "Property": 'name', "name": name });
            }, function (event) {
                console.log("名字保存失败");
            });
        } else if ("btn_head") {
            console.log("btn_head isMobile:" + this.isMobile);
            if (this.isMobile != 1) {
                return;
            }
            var uploadImgURL = app.Client.GetClientConfigProperty("uploadImgURL");
            var _argList = [{ "Name": "uploadImgURL", "Value": uploadImgURL }];
            app.NativeManager().CallToNative("openPhotoAlbum", _argList);
        }
    }
});

cc._RF.pop();