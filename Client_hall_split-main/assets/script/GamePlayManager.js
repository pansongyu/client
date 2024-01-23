var app = require("app");
module.exports = {
    playgame : null,

    WeChatShare:function(playgame,gameCfg=null){
        let type=typeof(playgame);
        if(type== 'number'){
            playgame=app.ShareDefine().GametTypeID2PinYin[playgame];
        }
        var WeChatShare=new Array();
        var gamename='';
        var special='';
        if(playgame){
            special = app.Client.GetClientConfigProperty("RoomShare"+playgame.toUpperCase());
        }
        switch(playgame){
            case 'sss':
                gamename="自由扑克";
                break;
            case 'hzmj':
                gamename="红中麻将";
                break;
            case 'lymj':
                gamename="龙岩麻将";
                break;
            case 'zypk':
                gamename="自由扑克";
                break;
            case 'xmmj':
                gamename="厦门麻将";
                break;
            case 'zjjhmj':
                gamename="金华麻将";
                break;
            case 'hbyxmj':
                gamename="阳新麻将";
                break;
            case 'pt13mj':
                gamename="莆田十三张";
                break;
            case 'zjmj':
                gamename="镇江麻将";
                break;
            case 'wzmj':
                gamename="万载麻将";
                break;
            case 'ycmj':
                gamename="宜春麻将";
                break;
            case 'xymj':
                gamename="仙游麻将";
                break;
            case 'npmj':
                gamename="南平麻将";
                break;
            case 'npgzmj':
                gamename="光泽麻将";
                break;
            case 'ssmj':
                gamename="石狮麻将";
                break;
            case 'fzmj':
                gamename="福州麻将";
                break;
            case 'smmj':
                gamename="三明麻将";
                break;
            case 'qzmj':
                gamename="泉州麻将";
                 break;
            case 'namj':
                gamename="南安麻将";
                 break;
            case 'zzmj':
                gamename="漳州麻将";
                 break;
            case 'ptmj':
                gamename="莆田十六张";
                break;
            case 'ndmj':
                gamename="宁德麻将";
                break;
            case 'nn':
                if(gameCfg==null){
                    let RoomMgr = this.RoomMrg(this.playgame);
                    let room = RoomMgr.GetEnterRoom();
                    let type = room.GetRoomConfig().sign;
                    if(0 == type)
                        gamename = '自由抢庄 牛';
                    else if(1 == type)
                        gamename = '拼十上庄 牛';
                    else if(2 == type)
                        gamename = '固定庄家 牛';
                    else if(3 == type)
                        gamename = '通比 牛';
                    else if(4 == type)
                        gamename = '明牌抢庄 牛';
                    else if(5 == type)
                        gamename = '轮庄 拼十';
                }else{
                    if(gameCfg.sign==0){
                        gamename = '自由抢庄 牛';
                    }else if(gameCfg.sign==1){
                        gamename = '拼十上庄 牛';
                    }else if(gameCfg.sign==2){
                        gamename = '固定庄家 牛';
                    }else if(gameCfg.sign==3){
                        gamename = '通比 牛';
                    }else if(gameCfg.sign==4){
                        gamename = '明牌抢庄 牛';
                    }else if(gameCfg.sign==5){
                        gamename = '轮庄 牛';
                    }
                }
                break;
            case 'sg':
                if(gameCfg==null){
                    let RoomMgr = this.RoomMrg(this.playgame);
                    let room = RoomMgr.GetEnterRoom();
                    let type = room.GetRoomConfig().sign;
                    if(0 == type)
                        gamename = '自由抢庄 三公';
                    else if(1 == type)
                        gamename = '三公上庄 三公';
                    else if(2 == type)
                        gamename = '固定庄家 三公';
                    else if(3 == type)
                        gamename = '通比三公';
                    else if(4 == type)
                        gamename = '加倍抢庄 三公';
                }else{
                    if(gameCfg.sign==0){
                        gamename = '自由抢庄 三公';
                    }else if(gameCfg.sign==1){
                        gamename = '三公上庄 三公';
                    }else if(gameCfg.sign==2){
                        gamename = '固定庄家 三公';
                    }else if(gameCfg.sign==3){
                        gamename = '通比三公';
                    }else if(gameCfg.sign==4){
                        gamename = '加倍抢庄 三公';
                    }
                }
                break;
            case 'pdk':
                gamename="跑得快";
                break;
            case 'xyzb':
                gamename="仙游炸棒";
                break;
            case 'wsk':
                gamename="五十K";
                break;
            case 'pxcn':
                gamename="莆仙吹牛";
                break;
            case 'zjh':
                gamename="欢乐比牌";
                break;
            case 'gd':
                gamename="掼蛋";
                break;
            case 'ddz':
                gamename="斗地主";
                break;
            case 'gdy':
                gamename="干瞪眼";
                break;
            default:
                gamename="万载宜春棋牌";
                break;
        }
        let title='';
        let desc='';
        if(playgame){
            title= app.Client.GetClientConfigProperty("WeChatShareRoomTitle");
            title=title.replace('{游戏名}',gamename);
            desc= app.Client.GetClientConfigProperty("WeChatShareRoomDesc");
            desc=desc.replace('{游戏名}',gamename);
        }else{
            title= app.Client.GetClientConfigProperty("WeChatShareTitle");
            desc= app.Client.GetClientConfigProperty("WeChatShareDesc");
        }
        let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");  
        let ShortShareUrl = app.Client.GetClientConfigProperty("ShortShareUrl");   
        //获取HeroID
        this.ComTool = app.ComTool();
        this.HeroManager = app.HeroManager();
        let heroID = app.HeroManager().GetHeroProperty("pid");
        let cityId=app.HeroManager().GetHeroProperty("cityId");
        let ShortHeroID=this.ComTool.GetPid(heroID);
        WeChatShare['title']=title;
        WeChatShare['desc']=desc;
        WeChatShare['special']=special;
        WeChatShare['url']=weChatAppShareUrl+heroID+"&cityid="+cityId;
		console.log("WeXinShare WeChatShare:",WeChatShare);
        return WeChatShare;
    },
    GameHelp:function(playgame){
        return "UIGameHelp";
    },

    GetTypeByName:function (playgame) {
        let gameType = playgame;
        switch(playgame){
            case 'sss_zz':
            case 'sss_dr':
                gameType = 'sss';
            case 'hzmj':
            case 'lymj':
            case 'hzmj':
                break;
            case 'mpqz_nn':
            case 'zyqz_nn':
            case 'nnsz_nn':
            case 'gdzj_nn':
            case 'tbnn_nn':
            case 'lz_nn':
                gameType = 'nn';
                break;
            case 'mpqz_sg':
            case 'zyqz_sg':
            case 'sgsz_sg':
            case 'gdzj_sg':
            case 'tb_sg':
                gameType = 'sg';
                break;
            case 'pdk':
                break;
        }
        return gameType;
    },

    GetNameByType:function (type) {
        let playgame = type;
        switch(playgame){
            case 'sss':
                let sss_room = this.RoomMrg(this.playgame).GetEnterRoom();
                let sss_type = sss_room.GetRoomConfigByProperty("sign");
                if(2 == sss_type)
                    playgame = 'sss_zz';
                else if(3 == sss_type)
                    playgame = 'sss_dr';
                break;
            case 'hzmj':
            case 'lymj':
            case 'hzmj':
                break;
            case 'nn':{
                    let RoomMgr = this.RoomMrg(this.playgame);
                    let room = RoomMgr.GetEnterRoom();
                    let type = room.GetRoomConfig().sign;
                    if(0 == type)
                        playgame = 'zyqz_nn';
                    else if(1 == type)
                        playgame = 'nnsz_nn';
                    else if(2 == type)
                        playgame = 'gdzj_nn';
                    else if(3 == type)
                        playgame = 'tbnn_nn';
                    else if(4 == type)
                        playgame = 'mpqz_nn';
                    else if(5 == type)
                        playgame = 'lz_nn';
                }
                break;
            case 'sg':{
                    let RoomMgr = this.RoomMrg(this.playgame);
                    let room = RoomMgr.GetEnterRoom();
                    let type = room.GetRoomConfig().sign;
                    if(0 == type)
                        playgame = 'zyqz_sg';
                    else if(1 == type)
                        playgame = 'sgsz_sg';
                    else if(2 == type)
                        playgame = 'gdzj_sg';
                    else if(3 == type)
                        playgame = 'tb_sg';
                    else if(4 == type)
                        playgame = 'mpqz_sg';
                }
                break;
            case 'pdk':
                let PDKRoomMgr = this.RoomMrg(this.playgame);
                let PDKType = PDKRoomMgr.GetEnterRoom().GetRoomConfig().sign;
                if(1 == PDKType)
                    playgame = 'pdk_jd';
                else if(2 == PDKType)
                    playgame = 'pdk_lyfj';
                break;

        }
        return playgame;
    },

    //获取对应玩家的头
    GetHead:function(playgame, pos){
        if(!playgame){
            console.log("GetHead Error: none gameName:%s or pos:%s ", playgame, pos);
            return null;
        }
        let uiname = '';
        let room = null;
        switch(playgame){
            case 'sss':
                uiname =  "UISSS_Head0";
                room = app.SSSRoom();
                break;
            case 'hzmj':
                uiname =  "UIHead0";
                room = app.HZMJRoom();
                break;
            case 'lymj':
                uiname =  "UIHead0";
                room = app.LYMJRoom();
                break;
        }

        console.log("GetHead playgame:%s uiname:%s",playgame, uiname);
        if(!room){
            console.log("GetHead not enter room");
            return null;
        }
        let roomPosMgr = room.GetRoomPosMgr();
        let clientPos = roomPosMgr.GetClientPos();
        let downPos = roomPosMgr.GetClientDownPos();
        let facePos = roomPosMgr.GetClientFacePos();
        let upPos = roomPosMgr.GetClientUpPos();
        //如果是本家
        if(pos == clientPos){
            uiname += "1";
        }
        else if(pos == downPos){
            uiname += "2";
        }
        else if(pos == facePos){
            uiname += "3";
        }
        else if(pos == upPos){
            uiname += "4";
        }
        else{
            console.log("GetHead(%s)  clientPos:%s, downPos:%s, facePos:%s, upPos:%s error", pos, clientPos, downPos, facePos, upPos);
            return null;
        }
        console.log("GetHead(%s):%s ", pos, uiname);
        //通知接收牌的位置
        let formObj = app.FormManager().GetFormComponentByFormName(uiname);
        if(!formObj){
            console.log("GetHead(%s):%s not find", pos, uiname);
            return null;
        }
        return formObj;
    },
    //获取游戏房间人数
    GetPlayerCount:function(){
        let RoomMgr = this.RoomMrg(this.playgame);
        let room = RoomMgr.GetEnterRoom();
        let roomPosMgr = room.GetRoomPosMgr();
        let playerInfo = null;
        let playerCount = 0;
        if(roomPosMgr){
            playerInfo = roomPosMgr.GetRoomAllPlayerInfo();
            playerCount = Object.keys(playerInfo).length;
        }
        else{
            playerInfo = room.GetRoomProperty('posList');
            playerCount = playerInfo.length;
        }
        return playerCount;
    },
};