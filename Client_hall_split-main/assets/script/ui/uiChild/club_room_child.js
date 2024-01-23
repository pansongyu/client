/*
 UIGMTool_Child2 GM工具子界面
 */

cc.Class({
    extends: require("BaseChildForm"),

    properties: {
        bg_join:cc.SpriteFrame,
        bg_touxiang:cc.SpriteFrame,
    },

    //创建界面回掉
    OnCreateInit:function(){
        this.FormManager = app.FormManager();
        this.ShareDefine = app.ShareDefine();
        this.HeroManager=app.HeroManager();
        this.heroName = this.HeroManager.GetHeroProperty("name");
        this.heroId=this.HeroManager.GetHeroProperty("pid");
        this.WeChatManager = app.WeChatManager();
        this.ComTool = app.ComTool();
        this.LocalDataManager=app.LocalDataManager();
        this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
        this.GetTuiGuangUrl();
    },
    //获取用户推广Url
    GetTuiGuangUrl:function(){
        this.TuiGuangUrl = this.LocalDataManager.GetConfigProperty("SysSetting", "TuiGuangUrl");
        if(this.TuiGuangUrl == ''){
            let heroID = app.HeroManager().GetHeroProperty("pid");
            let ShortHeroID=this.ComTool.GetPid(heroID);
            let long_url="http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=https://fb.qicaiqh.com:88/"+ShortHeroID+'/';
            app.NetManager().SendPack("game.CShortenGenerate",{"url":long_url},this.GetShorTuiGuangUrl.bind(this),this.FailTuiGuangUrl.bind(this));
        }
    },
    FailTuiGuangUrl:function(serverPack){
        let heroID = app.HeroManager().GetHeroProperty("pid");
        let ShortHeroID=this.ComTool.GetPid(heroID);
        let randUrl=this.GetRandBaseUrl();
        this.TuiGuangUrl='http://'+randUrl+"/"+ShortHeroID+"/";
        this.LocalDataManager.SetConfigProperty("SysSetting", "TuiGuangUrl",this.TuiGuangUrl);
    },
    GetShorTuiGuangUrl:function(serverPack){
        if(typeof(serverPack.requestUrl)=="undefined"){
            return;
        }
        let jsonStr=serverPack.requestUrl;
        jsonStr=jsonStr.replace('[','');
        jsonStr=jsonStr.replace(']','');
        let ShareUrl=eval('(' + jsonStr + ')');
        this.TuiGuangUrl=ShareUrl.url_short;
        this.LocalDataManager.SetConfigProperty("SysSetting", "TuiGuangUrl",this.TuiGuangUrl);

    },
    InitShowInfo:function () {
        let clubroomList=app['clubroomList'];
        let userData = this.GetFormProperty("UserData");
        let roomData=clubroomList[userData];
        this.roomData=roomData;
        this.SetRoomInfo(userData,roomData);
        this.ShowPlayer();
    },
    //显示
    OnShow:function(){
        this.node.active=true;
        this.InitShowInfo();
    },
    ShowPlayer:function(){
        this.InitJoinBtn();
        let playerList=this.playerList;
        for(let i=0;i<playerList.length;i++){
            if(i>3){
                //最多显示5人
                break;
            }
            let PlayerInfo=playerList[i];
            //用户头像创建
            let heroID = PlayerInfo["pid"];
            let headImageUrl = PlayerInfo["headImageUrl"];
            let touxiang=this.GetWndNode('more/join_btn/btn_join'+(i+1));
            if(heroID>0){
                if(headImageUrl){
                    this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                    let WeChatHeadImage=touxiang.getComponent("WeChatHeadImage");
                    WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
                }else{
                    touxiang.getComponent(cc.Sprite).spriteFrame=this.bg_touxiang;
                }
            }else{
                touxiang.getComponent(cc.Sprite).spriteFrame=this.bg_join;
            }
        }
    },
    ShowRoomJoin:function(){
        this.FormManager.ShowForm('UIClubRoomJoin',this.roomData);
    },
    SetRoomInfo:function (key,roomData) {
         let gameType=roomData.gameType;
         let playerList=roomData.posList;
         let roomCfg=roomData.roomCfg;
         let roomID=roomData.roomID;
         let roomKey=roomData.roomKey;
         let playerNum=roomCfg.playerNum;
         let clubName=roomData.clubName;
         let setID=roomData.setID;

         this.playerNum=playerNum;
         this.playerList=new Array();
         for(let i=0;i<playerList.length;i++){
            if(playerList[i]){
                if(playerList[i].pid>0){
                    this.playerList.push(playerList[i]);
                }
            }
         }

         this.gameType=gameType.toLowerCase();
         this.gameCfg=roomData.roomCfg;
         this.roomKey=roomKey;
         this.roomID=roomID;
         this.SetWndProperty("lb_roomkey", "text",roomKey);
         this.SetWndProperty("lb_clubname", "text",clubName);
         this.SetWndProperty("lb_setcount", "text",setID+'/'+roomCfg.setCount);
         this.SetWndProperty("lb_gamename", "text",this.GameType2Name(gameType));
         this.SetWndProperty("lb_wanfa", "text",this.GetWanFa(roomCfg));
         if(setID>0){
            //开始了关闭加入按钮
            this.SetWndProperty('more','active',false);
            this.node.height=60;
         }else{
            this.SetWndProperty('more','active',true);
            this.node.height=130;
         }
    },
    GameType2Name:function(gameType){
        let gameTypeID=this.ShareDefine.GametTypeNameDict[gameType];
        return this.ShareDefine.GametTypeID2Name[gameTypeID];
    },
    InitJoinBtn:function(){
        let playerNum=this.playerNum;
        //初始化头像背景
        for(let i=1;i<=5;i++){
            this.node.getChildByName('more').getChildByName('join_btn').getChildByName('btn_join'+i).getComponent(cc.Sprite).spriteFrame=this.bg_join;
        }
        for(let i=1;i<=playerNum;i++){
            if(i>5){
                break;
            }
            this.SetWndProperty("more/join_btn/btn_join"+i, "active",true);
        }
        let j=playerNum+1;
        for(;j<=5;j++){
            this.SetWndProperty("more/join_btn/btn_join"+j, "active",false);
        }
    },
    getCurSelectRenShu:function(needIndex){
        return needIndex;
    },
    GetHasPlayerNum:function(){
        let nowJoin = 0;
        for(let i=0;i<this.playerList.length;i++){
            if(0 != this.playerList[i].pid)
                nowJoin++;
        }
        return nowJoin;
    },
    Click_btn_Share:function(){
        var GamePlayManager = require('GamePlayManager');
        let gameType = this.gameType;
        var WeChatShare= GamePlayManager.WeChatShare(gameType,this.gameCfg);
        let title = null;
        if(WeChatShare['special']){
           title =WeChatShare['special'];
        }else{
           title =WeChatShare['title'];
        }
        let weChatAppShareUrl =WeChatShare['url'];
        let setCount = this.gameCfg["setCount"];  //多少局
        let roomKey = this.roomKey;  //房间号

        let joinPlayerCount = this.getCurSelectRenShu(this.gameCfg.playerNum);  //几人场
        let nowJoin = this.GetHasPlayerNum();
        title=title.replace('{房间号}',roomKey);
        let gamedesc ="";
        gamedesc=joinPlayerCount+"人场";
        gamedesc=gamedesc+","+setCount+"圈";
        let autoCardIdx= this.gameCfg["paymentRoomCardType"]; 
        if(0 == autoCardIdx)
            gamedesc=gamedesc+",房主出钻";
        else if(1 == autoCardIdx)
            gamedesc=gamedesc+",平分钻石";
        else
            gamedesc=gamedesc+",大赢家出钻";
        let que=joinPlayerCount-nowJoin;
        gamedesc+=","+nowJoin+"缺"+que;
        let teshuwanfan=this.WanFa;
        if(teshuwanfan){
            gamedesc += "," + teshuwanfan;
        }
        console.log("Click_btn_weixin:",title);
        console.log("Click_btn_weixin:",gamedesc);
        console.log("Click_btn_weixin:",weChatAppShareUrl);
        
        //this.SDKManager.Share(title, gamedesc, weChatAppShareUrl, "0");
        this.FormManager.ShowForm('UIRoomCopy',roomKey,title,gamedesc,weChatAppShareUrl);
    },
    //启动微信房间分享
    BeginShare:function(roomKey,text){
        this.ShareText=text;
        this.roomKey=roomKey;
        //校服
        let long_url="http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=https://fb.qicaiqh.com:88/room"+roomKey;
        app.NetManager().SendPack("game.CShortenGenerate",{"url":long_url},this.SuccessTcnUrl.bind(this),this.FailTcnUrl.bind(this));
    },
    
    SuccessTcnUrl:function(serverPack){
        let shareUrl="https://fb.qicaiqh.com:88/"+app.ComTool().GetPid(app.HeroManager().GetHeroProperty("pid"))+"/";
        if(this.TuiGuangUrl){
            text=this.ShareText+"\n"+"下载地址:"+shareUrl;
        }else{
            if(url_short){
                text=this.ShareText;
            }else{
                text=this.ShareText;
            }
        }
        this.SDKManager.ShareText(text,"0");
    },

    //微信分享获取短域名失败分享
    FailTcnUrl:function(event){
        let shareUrl="https://fb.qicaiqh.com:88/"+app.ComTool().GetPid(app.HeroManager().GetHeroProperty("pid"))+"/";
        let text=this.ShareText+"\n"+"下载地址:"+shareUrl;
        this.SDKManager.ShareText(text,"0");
    },
    OnClick_Join:function(){
        let nowJoin = this.GetHasPlayerNum();
        if(nowJoin >= this.playerNum){
            app.SysNotifyManager().ShowSysMsg("房间人数已满");
            return;
        }                       
        app.Client.JoinRoomCheckSubGame(this.gameType, this.roomKey);
    },
    GetWanFa:function(gameCfg){
        let wanfa=app.RoomCfgManager().WanFa(this.gameType,gameCfg);
        this.WanFa=wanfa;
        return wanfa.substring(0, 8) + '...';
    },
    //-------------点击函数-------------

});