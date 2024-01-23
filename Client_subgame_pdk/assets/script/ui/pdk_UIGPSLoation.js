var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
    },
    OnCreateInit:function(){
        this.WeChatManager = app[app.subGameName+"_WeChatManager"]();
    },
    OnClose:function(){
    },
    //不同玩家展示位置不同，二人麻将
    Pos2Show:function(pos){
        let RoomPosMgr = this.RoomMgr.GetEnterRoom().GetRoomPosMgr();
        let clientPos=RoomPosMgr.GetClientPos();
        let downPos=RoomPosMgr.GetClientDownPos();
        let facePos=RoomPosMgr.GetClientFacePos();
        let upPos=RoomPosMgr.GetClientUpPos();
        if(pos==clientPos){
            return 1;
        }else if(pos==downPos){
            return 2;
        }else if(pos==facePos){
            return 3;
        }else if(pos==upPos){
            return 4;
        }
        return -1;
    },
    OnShow: function () {
        this.Init();//隐藏素有的定位信息
        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        let room =this.RoomMgr.GetEnterRoom();
        let roomID = room.GetRoomProperty("roomID");
        let roomPosMgr = room.GetRoomPosMgr();
        this.playerAll = roomPosMgr.GetRoomAllPlayerInfo();
        let playerAllList= Object.keys(this.playerAll);
        let playerCount=0;
        let showPosPid=[];
        showPosPid[1]={pid:0};
        showPosPid[2]={pid:0};
        showPosPid[3]={pid:0};
        showPosPid[4]={pid:0};
        for(let i=0;i<playerAllList.length;i++){
            if(this.playerAll[i].pid>0){
                playerCount++;
            }
            let showpos=this.Pos2Show(this.playerAll[i].pos);
            showPosPid[showpos]=this.playerAll[i];
        }
        this.showPosPid=showPosPid;
        if(playerCount<2){
            this.CloseForm();
        }
        let sendPack={"roomID":roomID};
        let that=this;
        app[app.subGameName + "_NetManager"]().SendPack("game.CGetAllLocation",sendPack,function(success){
            let detail=success.locationInfos;
            let NewDetail=[];
            let now=Math.floor(new Date().getTime()/1000);
            for(let i=0;i<detail.length;i++){
                if(now-detail[i].updateTime<10800){
                    //3小时内的定位有效
                    NewDetail.push(detail[i]);
                }else{
                    NewDetail.push({"isGetError":true,"Address":"","pid":detail[i].pid,"pos":detail[i].pos});
                }
            }
            that.ShowGps(NewDetail);
        },function(error){
            //全部定位获取失败
        });
    },
    Init:function(){
        this.node.getChildByName('gps_line_12').active=false;
        this.node.getChildByName('gps_line_13').active=false;
        this.node.getChildByName('gps_line_14').active=false;
        this.node.getChildByName('gps_line_23').active=false;
        this.node.getChildByName('gps_line_24').active=false;
        this.node.getChildByName('gps_line_34').active=false;
        this.node.getChildByName('userinfo1').active=false;
        this.node.getChildByName('userinfo2').active=false;
        this.node.getChildByName('userinfo3').active=false;
        this.node.getChildByName('userinfo4').active=false;
    },
    toRad:function(d) {  
        return d * Math.PI / 180; 
    },
    getDisance:function(lat1, lng1, lat2, lng2) {
        var dis = 0;
        var radLat1 = this.toRad(lat1);
        var radLat2 = this.toRad(lat2);
        var deltaLat = radLat1 - radLat2;
        var deltaLng = this.toRad(lng1) -this. toRad(lng2);
        var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        return dis * 6378137;
    },
    ShowGps:function(detail){
        let room =this.RoomMgr.GetEnterRoom();
        let NewDetail=[];
        for(let i=0;i<detail.length;i++){
            let pos=detail[i].pos;
            let showpos=this.Pos2Show(pos);
            if(this.showPosPid[showpos].pid>0){
                //显示有收到定位的gps节点
                let userinfo=this.node.getChildByName('userinfo'+showpos);
                userinfo.active=true;
                let player = room.GetRoomPosMgr().GetPlayerInfoByPos(pos);
                let WeChatHeadImage=userinfo.getChildByName('head').getChildByName('head_img').getComponent(app.subGameName + "_WeChatHeadImage");
                WeChatHeadImage.ShowHeroHead(player.pid);
                userinfo.getChildByName('username').getComponent(cc.Label).string=player.name.substr(0,8);
                userinfo.getChildByName('address').getComponent(cc.Label).string=detail[i].Address; 
            }
            NewDetail[showpos]=detail[i];
        }
        if(this.showPosPid[1].pid>0 && this.showPosPid[2].pid>0){
             let node12=this.node.getChildByName('gps_line_12');
             node12.active=true;
             if(NewDetail[1].isGetError==false && NewDetail[2].isGetError==false){
                 let distance12=this.getDisance(NewDetail[1].Latitude,NewDetail[1].Longitude,NewDetail[2].Latitude,NewDetail[2].Longitude);
                 node12.getChildByName('label_juli').getComponent(cc.Label).string=this.OnTranformationDistance(distance12);
             }else{
                 node12.getChildByName('label_juli').getComponent(cc.Label).string="未知距离";
             }
        }

        if(this.showPosPid[1].pid>0 && this.showPosPid[3].pid>0){
             let node13=this.node.getChildByName('gps_line_13');
             node13.active=true;
             if(NewDetail[1].isGetError==false && NewDetail[3].isGetError==false){
                 let distance13=this.getDisance(NewDetail[1].Latitude,NewDetail[1].Longitude,NewDetail[3].Latitude,NewDetail[3].Longitude);
                 node13.getChildByName('label_juli').getComponent(cc.Label).string=this.OnTranformationDistance(distance13);
             }else{
                 node13.getChildByName('label_juli').getComponent(cc.Label).string="未知距离";
             }
        }
        if(this.showPosPid[1].pid>0 && this.showPosPid[4].pid>0){
             let node14=this.node.getChildByName('gps_line_14');
             node14.active=true;
             if(NewDetail[1].isGetError==false && NewDetail[4].isGetError==false){
                 let distance14=this.getDisance(NewDetail[1].Latitude,NewDetail[1].Longitude,NewDetail[4].Latitude,NewDetail[4].Longitude);
                 node14.getChildByName('label_juli').getComponent(cc.Label).string=this.OnTranformationDistance(distance14);
             }else{
                 node14.getChildByName('label_juli').getComponent(cc.Label).string="未知距离";
             }
        }
        if(this.showPosPid[2].pid>0 && this.showPosPid[3].pid>0){
             let node23=this.node.getChildByName('gps_line_23');
             node23.active=true;
             if(NewDetail[2].isGetError==false && NewDetail[3].isGetError==false){
                 let distance23=this.getDisance(NewDetail[2].Latitude,NewDetail[2].Longitude,NewDetail[3].Latitude,NewDetail[3].Longitude);
                 node23.getChildByName('label_juli').getComponent(cc.Label).string=this.OnTranformationDistance(distance23);
             }else{
                 node23.getChildByName('label_juli').getComponent(cc.Label).string="未知距离";
             }
        }
        if(this.showPosPid[2].pid>0 && this.showPosPid[4].pid>0){
             let node24=this.node.getChildByName('gps_line_24');
             node24.active=true;
             if(NewDetail[2].isGetError==false && NewDetail[4].isGetError==false){
                 let distance24=this.getDisance(NewDetail[2].Latitude,NewDetail[2].Longitude,NewDetail[4].Latitude,NewDetail[4].Longitude);
                 node24.getChildByName('label_juli').getComponent(cc.Label).string=this.OnTranformationDistance(distance24);
             }else{
                 node24.getChildByName('label_juli').getComponent(cc.Label).string="未知距离";
             }
        }
        if(this.showPosPid[3].pid>0 && this.showPosPid[4].pid>0){
             let node34=this.node.getChildByName('gps_line_34');
             node34.active=true;
             if(NewDetail[3].isGetError==false && NewDetail[4].isGetError==false){
                 let distance34=this.getDisance(NewDetail[3].Latitude,NewDetail[3].Longitude,NewDetail[4].Latitude,NewDetail[4].Longitude);
                 node34.getChildByName('label_juli').getComponent(cc.Label).string=this.OnTranformationDistance(distance34);
             }else{
                 node34.getChildByName('label_juli').getComponent(cc.Label).string="未知距离";
             }
        }
    },
    //距离转换米或者公里
    OnTranformationDistance:function(distance){
        let distanceStr = '';
        if(distance / 1000 > 1){
            distanceStr = (distance / 1000.0).toFixed(2) + '公里';
        }else {
            distanceStr = distance.toFixed(2) + '米';
        }
        return distanceStr;
    },
});
